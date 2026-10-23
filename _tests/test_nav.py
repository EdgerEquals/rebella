"""Headless checks for js/nav.js (in-page navigation with real URLs). iPhone SE portrait + desktop, plus no-JS.
Run: python3 _tests/test_nav.py [base-url]"""
import os, sys, threading, functools, http.server, socketserver
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if len(sys.argv) > 1: BASE = sys.argv[1].rstrip('/') + '/'
else:
    H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT); http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
    class Q(socketserver.TCPServer): allow_reuse_address = True
    srv = Q(('127.0.0.1', 0), H); threading.Thread(target=srv.serve_forever, daemon=True).start(); BASE = f'http://127.0.0.1:{srv.server_address[1]}/'
fails, results = [], []
def ok(c, m):
    results.append(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
VIEWS = {'se-portrait': dict(viewport={'width': 375, 'height': 667}, is_mobile=True, has_touch=True), 'desktop': dict(viewport={'width': 1280, 'height': 900})}
with sync_playwright() as pw:
    b = pw.chromium.launch()
    for vn, o in VIEWS.items():
        ctx = b.new_context(**o); pg = ctx.new_page(); errs = []
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None); pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(BASE, wait_until='networkidle'); pg.evaluate('window.__mark = 1')
        mark = lambda: pg.evaluate('window.__mark === 1')
        pg.evaluate('scrollTo(0, 900)'); pg.wait_for_timeout(200); y0 = pg.evaluate('scrollY')
        href = pg.evaluate("(() => { const a=[...document.querySelectorAll('main a[href*=\"articles/\"]')].find(a=>a.offsetParent); a.scrollIntoView({block:'center'}); return a.getAttribute('href') })()")
        y0 = pg.evaluate('scrollY'); title0 = pg.title()
        pg.evaluate("[...document.querySelectorAll('main a[href*=\"articles/\"]')].find(a=>a.offsetParent).click()"); pg.wait_for_timeout(900)
        ok(mark() and href.split('/')[-1] in pg.url and pg.title() != title0, f'{vn}: article opened in-page, URL {pg.url.split("/",3)[-1]}')
        ok(pg.evaluate("document.activeElement.tagName === 'H1'") and pg.evaluate('scrollY') < 5, f'{vn}: focus on the new heading, scrolled to top')
        ok(pg.evaluate("document.getElementById('nav-live').textContent.includes('Page loaded')"), f'{vn}: change announced')
        ok(pg.evaluate("document.querySelectorAll('.help-orb').length === 1 && !!document.querySelector('#app-head .br-mini')"), f'{vn}: header, dial and one orb stay mounted')
        art = pg.url
        pg.go_back(); pg.wait_for_timeout(900)
        ok(mark() and pg.url.rstrip('/') == BASE.rstrip('/') and abs(pg.evaluate('scrollY') - y0) < 40, f'{vn}: Back -> home in-page, scroll restored ({pg.evaluate("scrollY")} vs {y0})')
        pg.go_forward(); pg.wait_for_timeout(900); ok(mark() and pg.url == art, f'{vn}: Forward -> article again')
        # header links still right after the URL changed depth
        cook = pg.evaluate("document.querySelector('#app-foot a.ft-cookies') ? document.querySelector('#app-foot a.ft-cookies').href : null")
        ok(cook is None or cook == BASE + 'cookies/', f'{vn}: footer links still resolve after the swap ({cook})')
        pg.goto(BASE + 'music/', wait_until='networkidle'); pg.evaluate('window.__mark = 1')
        pg.evaluate("document.querySelector('a[href$=\"playground/index.html\"]').click()"); pg.wait_for_timeout(1500)
        ok(mark() and 'music/playground/' in pg.url and pg.evaluate("!!document.querySelector('.br-dial') && !!window.BonnieRadio && !!document.getElementById('pg-tempo-readout').textContent.trim()"), f'{vn}: Playground swapped in, its dial and script started')
        pg.focus('.br-dial'); pg.keyboard.press('ArrowRight'); pg.wait_for_timeout(300)
        ok('?ch=' in pg.url, f'{vn}: station in the URL ({pg.url.split("/",3)[-1]})')
        pg.go_back(); pg.wait_for_timeout(900); ok(mark() and pg.url.endswith('music/'), f'{vn}: Back -> music page in-page')
        pg.go_forward(); pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(900)
        ok('music/playground/' in pg.url and pg.evaluate("document.querySelectorAll('.br-dial').length === 1 && document.querySelectorAll('.br-panel').length <= 1"), f'{vn}: Forward to Playground again (normal load since its script already ran)')
        # escape keeps location.replace
        n0 = pg.evaluate('history.length'); pg.evaluate("document.querySelector('[data-escape]').click()"); pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(500)
        ok(pg.url.rstrip('/') in (BASE.rstrip('/'), BASE + 'index.html') and pg.evaluate('history.length') == n0, f'{vn}: Get me out replaces the history entry')
        # deep link + refresh
        pg.goto(BASE + 'articles/moon-garden.html', wait_until='networkidle'); pg.reload(wait_until='networkidle')
        ok(pg.evaluate("!!document.querySelector('main h1')"), f'{vn}: deep link + refresh load the real page')
        ok(not errs, f'{vn}: no console errors {errs[:3]}')
        ctx.close()
    ctx = b.new_context(java_script_enabled=False); pg = ctx.new_page()
    pg.goto(BASE, wait_until='load'); pg.click('main a[href*="articles/"] >> nth=0'); pg.wait_for_load_state('load')
    ok('articles/' in pg.url and pg.locator('main h1').count() == 1, 'no-JS: links are normal page loads')
    pg.go_back(); pg.wait_for_load_state('load'); ok(pg.url.rstrip('/') in (BASE.rstrip('/'), BASE + 'index.html'), 'no-JS: Back works')
    ctx.close(); b.close()
print('\n'.join(results)); print(f'\n{len(results) - len(fails)}/{len(results)} passed'); sys.exit(1 if fails else 0)
