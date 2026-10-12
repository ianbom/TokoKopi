"""Run: Get-Content tests/browser/admin-catalog-tables.py | browser-harness

Requires a running app on port 8000, an authenticated admin browser, and catalog rows.
Never confirms deletion; blocks DELETE requests as an additional safeguard.
"""

from time import sleep

target = new_tab("about:blank")
session = cdp("Target.attachToTarget", targetId=target, flatten=True)["sessionId"]


def click_button(name):
    nodes = cdp("Accessibility.getFullAXTree", session_id=session)["nodes"]
    node = next(node for node in nodes if node.get("role", {}).get("value") == "button"
                and node.get("name", {}).get("value") == name)
    backend_id = node["backendDOMNodeId"]
    cdp("DOM.scrollIntoViewIfNeeded", session_id=session, backendNodeId=backend_id)
    bounds = cdp("DOM.getBoxModel", session_id=session, backendNodeId=backend_id)["model"]["content"]
    center_x, center_y = sum(bounds[0::2]) / 4, sum(bounds[1::2]) / 4
    cdp("Input.dispatchMouseEvent", session_id=session, type="mousePressed",
        x=center_x, y=center_y, button="left", clickCount=1)
    cdp("Input.dispatchMouseEvent", session_id=session, type="mouseReleased",
        x=center_x, y=center_y, button="left", clickCount=1)
    sleep(0.25)


try:
    for path, key, confirmation in (
        ("products", "products", "Hapus produk"),
        ("product-variants", "variants", "Hapus varian"),
    ):
        for width, page in ((1440, 1), (390, 1), (1440, 2)):
            cdp("Emulation.setDeviceMetricsOverride", session_id=session,
                width=width, height=900, deviceScaleFactor=1, mobile=width < 768)
            cdp("Page.navigate", session_id=session,
                url=f"http://127.0.0.1:8000/admin/{path}?page={page}")
            for attempt in range(75):
                if js("document.readyState === 'complete' && Boolean(document.querySelector('table'))", target_id=target):
                    break
                sleep(0.2)
            data = js(f"""(() => {{
                const props = JSON.parse(document.querySelector('[data-page]').textContent).props;
                const rows = [...document.querySelectorAll('tbody tr')].filter(row => row.querySelector('button'));
                const headings = [...document.querySelectorAll('thead th')].map(cell => cell.textContent.trim());
                return {{
                    from: props['{key}'].from,
                    total: props['{key}'].total,
                    numbers: rows.map(row => Number(row.cells[0].textContent)),
                    headings,
                    actionsAligned: rows.every(row => {{
                        const centers = [...row.lastElementChild.querySelectorAll('a,button')]
                            .map(button => {{const box = button.getBoundingClientRect(); return box.top + box.height / 2;}});
                        return Math.max(...centers) - Math.min(...centers) <= 1;
                    }}),
                    deleteColors: rows.map(row => getComputedStyle(row.querySelector('button')).backgroundColor),
                    detailLinks: rows.every(row => row.lastElementChild.querySelector('a')?.textContent.trim() === 'Detail'),
                    numericAligned: rows.every(row => [3, 4].every(index =>
                        getComputedStyle(row.cells[index]).textAlign === 'right'
                        && getComputedStyle(document.querySelectorAll('thead th')[index]).textAlign === 'right')),
                    noPageOverflow: document.documentElement.scrollWidth <= innerWidth + 1,
                }};
            }})()""", target_id=target)
            assert data["numbers"], (path, page, "No catalog rows available")
            assert data["numbers"] == list(range(data["from"], data["from"] + len(data["numbers"]))), data
            assert data["headings"][0] == "No." and data["headings"][-1] == "Aksi", data
            assert data["actionsAligned"] and data["noPageOverflow"], (path, width, data)
            assert all(color == "rgb(180, 35, 24)" for color in data["deleteColors"]), data
            if path == "products":
                assert "Producer" in data["headings"] and "Gilingan" not in data["headings"], data
                assert data["detailLinks"], data
            else:
                assert data["numericAligned"], data

            js("""window.catalogDeleteAttempts = [];
                const originalOpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function(method, url, ...args) {
                    if (method.toUpperCase() === 'DELETE') {
                        window.catalogDeleteAttempts.push(String(url));
                        throw new Error('Deletion blocked by catalog browser check');
                    }
                    return originalOpen.call(this, method, url, ...args);
                };""", target_id=target)
            click_button("Hapus")
            dialog = js("""(() => {
                const dialog = document.querySelector('[role="dialog"]');
                return dialog ? {text: dialog.innerText, active: dialog.contains(document.activeElement),
                    buttons: [...dialog.querySelectorAll('button')].map(button => button.textContent.trim())} : null;
            })()""", target_id=target)
            assert dialog and dialog["active"] and confirmation in dialog["buttons"], (path, dialog)
            click_button("Batal")
            assert not js("Boolean(document.querySelector('[role=\"dialog\"]'))", target_id=target), path
            assert js("window.catalogDeleteAttempts.length", target_id=target) == 0, path
            print(f"PASS {path}: width={width}, page={page}, modal cancelled without deletion")
finally:
    cdp("Target.closeTarget", targetId=target)
