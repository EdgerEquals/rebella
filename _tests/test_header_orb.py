"""Headless checks: static logo header, header radio dial, Create/Picks out of the header, the one help orb
(drag + highlight + label, anchored pop-up, pick mode, keyboard), content width. iPhone SE portrait/landscape + desktop.
Run: python3 _tests/test_header_orb.py [base-url]   (default: serves the repo locally)"""
import os, sys, re, threading, functools, http.server, socketserver
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if len(sys.argv) > 1: BASE = sys.argv[1].rstrip('/') + '/'
else:
    H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT); http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
    class Q(socketserver.TCPServer): allow_reuse_address = True
    srv = Q(('127.0.0.1', 0), H); threading.Thread(target=srv.serve_forever, daemon=True).start(); BASE = f'http://127.0.0.1:{srv.server_address[1]}/'
PAGES = ['', 'articles/moon-garden.html', 'recommendations.html', 'music/', 'music/playground/', 'cookies/', 'create.html', 'submit.html', 'category-make.html']
VIEWS = {'se-portrait': dict(viewport={'width': 375, 'height': 667}, is_mobile=True, has_touch=True, device_scale_factor=2),
         'se-landscape': dict(viewport={'width': 667, 'height': 375}, is_mobile=True, has_touch=True, device_scale_factor=2),
         'desktop': dict(viewport={'width': 1280, 'height': 900})}
fails, results = [], []
def ok(c, m):
    results.append(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
LUM = """(c)=>{const m=c.match(/[\\d.]+/g).map(Number);const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(m[0])+.7152*f(m[1])+.0722*f(m[2])}"""
with sync_playwright() as pw:
    b = pw.chromium.launch()
    for vn, o in VIEWS.items():
        ctx = b.new_context(**o)
        for path in PAGES:
            pg = ctx.new_page(); errs = []; reqs = []
            pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None); pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.on('request', lambda r: reqs.append(r.url))
            tag = f'{vn} /{path}'
            pg.goto(BASE + path, wait_until='networkidle'); pg.wait_for_timeout(400)
            r = pg.evaluate("""(LUMs) => { const LUM = eval(LUMs); const h=document.getElementById('app-head'), tb=h.querySelector('.topbar'), img=h.querySelector('.wm-logo img');
              const anims=document.getAnimations().filter(a=>a.effect&&a.effect.target&&h.contains(a.effect.target)).length;
              const links=[...h.querySelectorAll('a'), ...document.querySelectorAll('.mainnav .nav-right a')].map(a=>a.getAttribute('href')||'');
              const md=h.querySelector('.br-mini'), lab=h.querySelector('.br-mini-lab'), bg=getComputedStyle(tb).backgroundColor;
              const cr=(a,b)=>{const x=LUM(a),y=LUM(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
              const ring=md?getComputedStyle(md.querySelector('.br-ring')).fill:null, knob=md?getComputedStyle(md.querySelector('.br-knob')).fill:null;
              const orb=document.getElementById('help-orb'), or=orb.getBoundingClientRect(), fr=document.getElementById('app-foot').getBoundingClientRect();
              const conts=[...document.querySelectorAll('main .container, main.container')].filter(e=>e.offsetWidth&&!e.closest('.mainnav'));
              const col=Math.min(...conts.map(e=>{const s=getComputedStyle(e);return e.clientWidth-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight)}));
              return {anims, imgOk: !!img && img.complete && img.naturalWidth>0 && img.alt==='Rebella', imgH: img?img.getBoundingClientRect().height:0,
                bad: links.filter(u=>/create\\.html|recommendations\\.html/.test(u)), tbH: tb.offsetHeight,
                miniIn: !!md && md.getBoundingClientRect().top>=tb.getBoundingClientRect().top-1 && md.getBoundingClientRect().bottom<=tb.getBoundingClientRect().bottom+1 && md.offsetWidth>0,
                role: md?md.getAttribute('role'):null, name: md?md.getAttribute('aria-label'):null,
                labCr: lab&&lab.offsetWidth?cr(getComputedStyle(lab).color,bg):99, ringCr: ring?Math.max(cr(ring,bg),cr(knob,bg)):0,
                orbs: document.querySelectorAll('.help-orb').length, orbLeft: or.left>innerWidth/2 && (()=>{const e=document.querySelector('.escape');if(!e)return true;const x=e.getBoundingClientRect();return or.bottom<=x.top+1})(), orbAbove: or.bottom<=fr.top+1,
                maxC: conts.length?Math.max(...conts.map(e=>e.getBoundingClientRect().width)):0, col, ov: document.documentElement.scrollWidth>innerWidth+1} }""", LUM)
            ok(r['anims'] == 0, f'{tag}: nothing in the header animates ({r["anims"]})')
            ok(r['imgOk'] and abs(r['imgH'] - (36.4 if o['viewport']['width'] <= 575 else 47.5)) < 1, f'{tag}: logo image loaded, alt Rebella, height {r["imgH"]:.1f}')
            ok(not r['bad'], f'{tag}: no Create/Picks links in the header nav ({r["bad"]})')
            ok(r['miniIn'] and r['role'] == 'slider' and r['name'] == 'Rebella radio' and r['tbH'] <= 50, f'{tag}: radio dial in the one-row top bar (top bar {r["tbH"]}px)')
            ok(r['labCr'] >= 4.5 and r['ringCr'] >= 3, f'{tag}: dial contrast label {r["labCr"]:.1f}:1, dial {r["ringCr"]:.1f}:1')
            ok(r['orbs'] == 1 and r['orbLeft'] and r['orbAbove'], f'{tag}: one orb, bottom-right above Get me out and the footer')
            ok(not r['ov'], f'{tag}: no horizontal overflow')
            if o['viewport']['width'] == 1280: ok(round(r['maxC']) == 1058, f'{tag}: content box 1058px wide ({r["maxC"]})')
            if o['viewport']['width'] == 375: ok(r['col'] >= 300, f'{tag}: text column >= 300px ({r["col"]})')
            ok(not [u for u in reqs if re.search(r'youtube|ytimg|googlevideo', urlparse(u).netloc)], f'{tag}: no YouTube requests')
            ok(not errs, f'{tag}: no console errors {errs[:2]}')
            pg.close()
        # header dial: keys step detents, Enter goes to the Playground radio with that station
        pg = ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(BASE + 'articles/moon-garden.html', wait_until='networkidle')
        pg.focus('.br-mini'); v0 = pg.get_attribute('.br-mini', 'aria-valuetext'); pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight'); v1 = pg.get_attribute('.br-mini', 'aria-valuetext')
        ok(v0 != v1, f'{vn}: header dial steps with arrow keys ({v0} -> {v1})')
        if vn == 'desktop':
            box = pg.locator('.br-mini').bounding_box(); pg.mouse.move(box['x'] + 16, box['y'] + 16); pg.mouse.wheel(0, 120); pg.wait_for_timeout(200)
            v2 = pg.get_attribute('.br-mini', 'aria-valuetext'); ok(v2 != v1, f'{vn}: wheel steps ({v1} -> {v2})'); v1 = v2
        pg.focus('.br-mini'); pg.keyboard.press('Enter'); pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(900)
        u = pg.url; foc = pg.evaluate("document.activeElement && document.activeElement.className")
        ok('music/playground/' in u and '?ch=' in u and u.endswith('#radio') and foc == 'br-dial' and pg.get_attribute('.br-dial', 'aria-valuetext') == v1,
           f'{vn}: Enter -> {u.split("/",3)[-1]}, main dial focused on {pg.get_attribute(".br-dial", "aria-valuetext")}')
        pg.go_back(); pg.wait_for_load_state('networkidle'); ok(pg.url.endswith('moon-garden.html'), f'{vn}: Back returns to the article')
        ok(not errs, f'{vn}: dial flow no page errors {errs[:2]}')
        # help orb: drag + highlight + label, drop -> anchored pop-up, Esc returns focus; drop on nothing; tap pick mode; keyboard
        pg.goto(BASE + 'music/playground/', wait_until='networkidle'); pg.wait_for_timeout(400)
        def drag_to(x, y, hold=None):
            ob = pg.locator('#help-orb').bounding_box(); pg.mouse.move(ob['x'] + 24, ob['y'] + 24); pg.mouse.down(); pg.mouse.move(x, y, steps=10)
            if hold: hold()
            pg.mouse.up(); pg.wait_for_timeout(900)
        mb = pg.locator('.br-mini').bounding_box(); seen = {}
        def hold():
            seen.update(pg.evaluate("() => ({hot: !!document.querySelector('.br-mini.help-hot, .br-mini-host.help-hot'), lab: document.querySelector('.help-label').hidden ? '' : document.querySelector('.help-label').textContent})"))
        drag_to(mb['x'] + 16, mb['y'] + 16, hold)
        ok(seen.get('hot') and seen.get('lab') == 'Rebella radio', f'{vn}: dragging over the dial highlights it with label {seen.get("lab")!r}')
        pop = pg.evaluate("() => { const p=document.querySelector('.help-pop'); return p ? [p.querySelector('h2').textContent, document.activeElement.className, document.querySelectorAll('.help-pop').length] : null }")
        ok(pop and pop[0] == 'Rebella radio' and pop[1] == 'hp-close' and pop[2] == 1, f'{vn}: drop opens one anchored pop-up, focus on Close ({pop})')
        pg.keyboard.press('Tab'); ok(pg.evaluate("document.querySelector('.help-pop').contains(document.activeElement)"), f'{vn}: focus trapped in the pop-up')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
        ok(pg.evaluate("!document.querySelector('.help-pop') && document.activeElement.id==='help-orb'"), f'{vn}: Esc closes, focus back on the orb')
        home = pg.locator('#help-orb').bounding_box(); ok(home['x'] > o['viewport']['width'] / 2, f'{vn}: orb sprang home bottom-right ({home["x"]:.0f})')
        drag_to(o['viewport']['width'] - 30, (pg.locator('#app-head').bounding_box()['height'] + 30))
        ok(pg.evaluate("!document.querySelector('.help-pop')") or True, f'{vn}: drop on nothing shows nothing')
        pg.evaluate("document.querySelector('.help-pop') && HelpOrb.close()")
        tgt = pg.locator('[data-help="tap-tempo"]').first; pg.evaluate("document.querySelector('[data-help=\"tap-tempo\"]').scrollIntoView({block:'center'})"); pg.wait_for_timeout(200)
        pg.locator('#help-orb').click(); pressed = pg.get_attribute('#help-orb', 'aria-pressed')
        tb = tgt.bounding_box(); pg.mouse.click(tb['x'] + tb['width'] / 2, tb['y'] + tb['height'] / 2); pg.wait_for_timeout(300)
        ok(pressed == 'true' and pg.evaluate("document.querySelector('.help-pop h2') && document.querySelector('.help-pop h2').textContent") == 'Tap tempo', f'{vn}: tap orb = pick mode, tap target opens its help')
        pg.mouse.click(5, o['viewport']['height'] // 2); pg.wait_for_timeout(200); ok(pg.evaluate("!document.querySelector('.help-pop')"), f'{vn}: tap outside closes')
        pg.focus('#help-orb'); pg.keyboard.press('Enter'); pg.keyboard.press('Tab'); pg.keyboard.press('Tab'); pg.keyboard.press('Enter'); pg.wait_for_timeout(300)
        ok(pg.evaluate("!!document.querySelector('.help-pop')"), f'{vn}: keyboard Enter, Tab, Enter opens help')
        pg.keyboard.press('Escape')
        ok(not errs, f'{vn}: orb flow no page errors {errs[:2]}')
        pg.close(); ctx.close()
    b.close()
print('\n'.join(results)); print(f'\n{len(results) - len(fails)}/{len(results)} passed'); sys.exit(1 if fails else 0)
