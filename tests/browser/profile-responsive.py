from time import sleep

new_tab(page_info()["url"])
wait_for_load()
targets = js("""Array.from(document.querySelectorAll('[aria-label="Navigasi akun"] a[href]'), link => link.href)""")
assert len(targets) == 5, "Open an authenticated customer account page first."

try:
    for target_url in targets:
        goto_url(target_url)
        wait_for_load()
        detail_url = js("""Array.from(document.querySelectorAll('a[href]')).find(link => link.textContent.trim() === 'Lihat Detail')?.href ?? null""")
        if detail_url and detail_url not in targets:
            targets.append(detail_url)

        for viewport_width in (320, 375, 430, 768, 1024, 1440):
            cdp("Emulation.setDeviceMetricsOverride", width=viewport_width, height=900, deviceScaleFactor=1, mobile=viewport_width < 768)
            sleep(0.2)
            layout = js("""(() => {
                const nav = document.querySelector('[aria-label="Navigasi akun"]');
                const active = nav?.querySelector('[aria-current="page"]');
                const navBounds = nav?.getBoundingClientRect();
                const activeBounds = active?.getBoundingClientRect();
                return {
                    width: window.innerWidth,
                    scrollWidth: document.documentElement.scrollWidth,
                    activeVisible: Boolean(activeBounds && navBounds && activeBounds.left >= navBounds.left - 1 && activeBounds.right <= navBounds.right + 1),
                    touchHeight: activeBounds?.height ?? 0
                };
            })()""")
            assert layout["scrollWidth"] <= layout["width"] + 1, (target_url, viewport_width, layout)
            assert layout["activeVisible"], (target_url, viewport_width, layout)
            assert layout["touchHeight"] >= 44, (target_url, viewport_width, layout)
        print(f"PASS {target_url}")
    if len(targets) == 5:
        print("SKIP order detail: no order available.")
finally:
    cdp("Emulation.clearDeviceMetricsOverride")
