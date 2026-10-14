"""Run: Get-Content tests/browser/product-stock.py | browser-harness"""

from time import sleep

target = new_tab("http://127.0.0.1:8000/list")
wait_for_load()
session = cdp("Target.attachToTarget", targetId=target, flatten=True)["sessionId"]

try:
    for width in (1440, 390):
        cdp("Emulation.setDeviceMetricsOverride", session_id=session,
            width=width, height=900, deviceScaleFactor=1, mobile=width < 768)
        sleep(0.2)
        state = js("""(() => {
            const page = JSON.parse(document.querySelector('script[data-page="app"]').textContent);
            const cards = Array.from(document.querySelectorAll('a[href]'))
                .filter(link => new URL(link.href).pathname === '/detail')
                .map(link => ({
                    slug: new URL(link.href).searchParams.get('product'),
                    soldOut: Array.from(link.querySelectorAll('span'))
                        .some(label => label.textContent.trim() === 'Stok Habis'),
                    grayscale: link.querySelector('img').classList.contains('grayscale'),
                    opacity: Number(getComputedStyle(link.querySelector('img')).opacity),
                    disabled: link.getAttribute('aria-disabled') === 'true'
                }));
            return {
                products: page.props.products.data,
                cards,
                overflow: document.documentElement.scrollWidth > window.innerWidth + 1
            };
        })()""", target_id=target)
        assert state["products"], "Catalog must contain products."
        assert not state["overflow"], (width, "Horizontal overflow")
        cards = {card["slug"]: card for card in state["cards"]}
        for product in state["products"]:
            expected = not any(variant["is_active"] and variant["stock"] > 0
                               for variant in product["variants"])
            card = cards[product["slug"]]
            assert card["soldOut"] == expected, (width, product["title"], card)
            assert card["grayscale"] == expected, (width, product["title"], card)
            assert card["opacity"] == (0.65 if expected else 1), (width, product["title"], card)
            assert not card["disabled"], (width, product["title"], card)
        print(f"PASS {width}px: {len(state['products'])} cards match active variant stock.")
finally:
    cdp("Target.closeTarget", targetId=target)
