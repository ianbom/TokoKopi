"""Start tests/browser/vite.config.ts, then pipe this file to browser-harness."""

import base64
import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from time import sleep

vite = os.environ.get('VITE_TEST_URL', 'http://127.0.0.1:5175')
html = f'''<html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body><div id="app"></div><script type="module">
window.__fixtureErrors=[];
window.addEventListener('error',event=>window.__fixtureErrors.push(event.message));
window.addEventListener('unhandledrejection',event=>window.__fixtureErrors.push(String(event.reason)));
import RefreshRuntime from '{vite}/@react-refresh';
RefreshRuntime.injectIntoGlobalHook(window);
window.$RefreshReg$=()=>{{}}; window.$RefreshSig$=()=>(type)=>type;
window.__vite_plugin_react_preamble_installed__=true;
const fixture=await import('{vite}/tests/browser/checkout-payment-fixture.tsx');
await fixture.mount();
</script></body></html>'''


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            self.wfile.write(html.encode())
        else:
            try:
                super().do_GET()
            except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError):
                pass

    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(Path.cwd() / 'public')))
Thread(target=server.serve_forever, daemon=True).start()


def eventually(expression, target):
    for attempt in range(100):
        result = js(expression, target_id=target)
        if result:
            return result
        sleep(.2)
    raise AssertionError((expression, js("({errors:window.__fixtureErrors,text:document.body.innerText.slice(0,500),resources:performance.getEntriesByType('resource').filter(r=>r.responseStatus>=400).map(r=>[r.name,r.responseStatus])})", target_id=target)))


try:
    for width in (1440, 390, 320):
        target = new_tab(f'http://127.0.0.1:{server.server_port}/')
        session = cdp('Target.attachToTarget', targetId=target, flatten=True)['sessionId']
        try:
            cdp('Emulation.setDeviceMetricsOverride', session_id=session, width=width, height=900, deviceScaleFactor=1, mobile=width < 768)
            eventually("document.querySelectorAll('input[name=payment_method]').length === 8", target)
            eventually("!Array.from(document.querySelectorAll('button')).some(b=>b.textContent.includes('Memuat'))", target)
            initial = js("""(() => {
                const radios=Array.from(document.querySelectorAll('input[name=payment_method]'));
                const fieldset=radios[0].closest('fieldset');
                const pay=Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Bayar Sekarang');
                return {names:radios.map(r=>r.getAttribute('aria-label')),checked:radios.filter(r=>r.checked).length,
                    disabled:pay.disabled,columns:getComputedStyle(fieldset.querySelector('.grid')).gridTemplateColumns.split(' ').length,
                    before:!!(fieldset.compareDocumentPosition(pay)&Node.DOCUMENT_POSITION_FOLLOWING),
                    overflow:document.documentElement.scrollWidth>innerWidth+1};
            })()""", target_id=target)
            assert initial['checked'] == 0 and initial['disabled']
            assert initial['columns'] == 3 and initial['before'] and not initial['overflow'], (width, initial)
            assert initial['names'] == ['BCA Virtual Account', 'BNI Virtual Account', 'BRI Virtual Account', 'Mandiri Bill Payment', 'Permata Virtual Account', 'QRIS', 'GoPay', 'ShopeePay']
            eventually("Array.from(document.querySelectorAll('fieldset img')).every(i=>i.complete&&i.naturalWidth>0)", target)
            js("document.querySelector('input[value=bca_va]').click();document.querySelector('input[value=bca_va]').focus()", target_id=target)
            cdp('Input.dispatchKeyEvent', session_id=session, type='keyDown', key='ArrowRight', code='ArrowRight', windowsVirtualKeyCode=39)
            cdp('Input.dispatchKeyEvent', session_id=session, type='keyUp', key='ArrowRight', code='ArrowRight', windowsVirtualKeyCode=39)
            eventually("document.querySelector('input[value=bni_va]').checked", target)
            assert js("document.querySelectorAll('input[name=payment_method]:checked').length", target_id=target) == 1
            assert js("document.activeElement.matches('input[name=payment_method]:focus-visible')", target_id=target)
            js("document.querySelector('input[placeholder=\"Masukkan kode voucher\"]').focus()", target_id=target)
            cdp('Input.insertText', session_id=session, text='COFFEE10')
            js("Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Pakai').click()", target_id=target)
            eventually("Array.from(document.querySelectorAll('button')).some(b=>b.textContent.trim()==='Hapus')", target)
            assert js("document.querySelector('input[value=bni_va]').checked", target_id=target)
            js("Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Hapus').click()", target_id=target)
            eventually("!Array.from(document.querySelectorAll('button')).some(b=>b.textContent.trim()==='Hapus')", target)
            js("Array.from(document.querySelectorAll('button')).find(b=>b.textContent.includes('Kantor')).click()", target_id=target)
            eventually("Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Bayar Sekarang').disabled", target)
            eventually("Array.from(document.querySelectorAll('button')).some(b=>b.textContent.toLowerCase().includes('jne')&&!b.disabled)", target)
            js("Array.from(document.querySelectorAll('button')).find(b=>b.textContent.toLowerCase().includes('jne')).click();document.querySelector('input[type=checkbox]').click()", target_id=target)
            eventually("!Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Bayar Sekarang').disabled", target)
            assert js("document.querySelector('input[value=bni_va]').checked", target_id=target)
            assert not js("document.documentElement.scrollWidth>innerWidth+1", target_id=target), width
            js("document.querySelector('fieldset').scrollIntoView({block:'center',behavior:'instant'})", target_id=target)
            sleep(.1)
            screenshot = cdp('Page.captureScreenshot', session_id=session, format='png')['data']
            Path(os.environ.get('TEMP', '/tmp'), f'deklase-payment-{width}.png').write_bytes(base64.b64decode(screenshot))
            key = js("sessionStorage.getItem('checkout.idempotency_key')", target_id=target)
            js("(() => {const button=Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Bayar Sekarang');button.click();button.click()})()", target_id=target)
            eventually("document.querySelector('input[value=bni_va]').matches(':disabled')", target)
            probe = js(f"import('{vite}/tests/browser/checkout-payment-fixture.tsx').then(m=>({{count:m.probe.orderRequests,method:m.probe.payloads[0].payment_method}}))", target_id=target)
            assert probe == {'count': 1, 'method': 'bni_va'}, probe
            js(f"import('{vite}/tests/browser/checkout-payment-fixture.tsx').then(m=>m.probe.releaseOrder())", target_id=target)
            eventually("document.getElementById('payment-method-error') !== null", target)
            assert js("document.querySelector('input[value=bni_va]').checked", target_id=target)
            assert js("sessionStorage.getItem('checkout.idempotency_key')", target_id=target) == key
            assert js("document.querySelector('a[href$=\"/my-order/42\"]')!==null", target_id=target)
            print(f'PASS {width}px: logos, radio/keyboard, persistence, prerequisites, submit guard, errors, no overflow')
        finally:
            cdp('Target.closeTarget', targetId=target)
finally:
    server.shutdown()
    server.server_close()
