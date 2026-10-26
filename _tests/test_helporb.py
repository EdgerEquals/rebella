"""Help orb standard checks (Kids Club 'help orb on by default, in the kid's own look', Danny 14:30 AWST 26 Oct 2026, and core 'grow on drop').
Run: python3 _tests/test_helporb.py [SIMMIE_CHAT_DIR]   (serves this repo, and the chat repo if given, locally; 390 px; Chromium + WebKit)
Checks: the orb is on from the first screen (Rebella, dashboard gate, chat login) and not covered; drop on a control opens its help and
the control grows in front of the orb, then settles back; 'Change how I look' sets a look that persists on this device; only one emoji
(no letters) is accepted; a control with no entry says it's still being tuned under its own name; HelpOrb.drop() (virtual drop) works;
the orb breathes in time with B, holds its breath while dragged, shows a one-time nudge, and tap-then-control works;
the passcode gate still refuses a wrong passcode and stays shut; no console errors; the orb adds no outside requests."""
import os, sys, threading, functools, http.server, socketserver
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHAT = sys.argv[1] if len(sys.argv) > 1 else None
def serve(d):
    H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=d); http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
    class Q(socketserver.ThreadingTCPServer): allow_reuse_address = True; daemon_threads = True
    s = Q(('127.0.0.1', 0), H); threading.Thread(target=s.serve_forever, daemon=True).start(); return f'http://127.0.0.1:{s.server_address[1]}/'
R = serve(ROOT); C = serve(CHAT) if CHAT else None
fails, results = [], []
def ok(c, m):
    results.append(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
SCREENS = [('rebella home', R, '', '#search-btn', 'Search'), ('rebella create', R, 'create.html', '#save-btn', 'Save'),
           ('dashboard gate', R, 'moderation/', '#gate-form button[type=submit]', 'Unlock')]
if C: SCREENS.append(('chat login', C, '', '#login-btn', 'Open chat'))
def drag(pg, sel):
    o = pg.locator('#help-orb').bounding_box(); t = pg.locator(sel).first; t.scroll_into_view_if_needed(); c = t.bounding_box()
    o = pg.locator('#help-orb').bounding_box()
    pg.mouse.move(o['x'] + o['width'] / 2, o['y'] + o['height'] / 2); pg.mouse.down()
    pg.mouse.move(c['x'] + c['width'] / 2, c['y'] + c['height'] / 2, steps=12); pg.mouse.up()
with sync_playwright() as pw:
    for eng in ('chromium', 'webkit'):
        b = getattr(pw, eng).launch()
        for name, base, path, sel, title in SCREENS:
            ctx = b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True)
            outside = []
            ctx.route('**/*', lambda r: (outside.append(r.request.url), r.abort()) if not r.request.url.startswith('http://127.0.0.1') else r.continue_())
            pg = ctx.new_page(); errs = []
            pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)   # outside requests are blocked by this test on purpose; pg.on('pageerror', lambda e: errs.append(str(e)))
            tag = f'{eng} {name}'
            pg.goto(base + path, wait_until='load'); pg.wait_for_selector('#help-orb', timeout=8000); pg.wait_for_timeout(700)
            r = pg.evaluate("""() => { const o = document.getElementById('help-orb'), b = o.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
                const top = document.elementFromPoint(x, y); return { n: document.querySelectorAll('.help-orb').length, onTop: top === o || o.contains(top), inView: b.left >= 0 && b.right <= innerWidth && b.top >= 0 && b.bottom <= innerHeight }; }""")
            ok(r['n'] == 1 and r['onTop'] and r['inView'], f'{tag}: one orb on the first screen, in view and not covered')
            # always gently alive: breathes in time with B, a one-time nudge on the first screen
            a = pg.evaluate("""() => { const o = document.getElementById('help-orb'), an = o.getAnimations().filter(x => x.animationName === 'helpBreathe')[0], B = window.PhiB && PhiB.value;
                const n = document.querySelector('.help-nudge'); return { has: !!an, state: an && an.playState, rate: an && an.playbackRate, dur: an && an.effect.getTiming().duration, B: B, nudge: !!n, nudgeText: n && n.textContent }; }""")
            ok(a['has'] and a['state'] == 'running' and a['rate'] == 1 and a['B'] and abs(a['dur'] - a['B'] * 1000) < 1, f'{tag}: breathes at rest, one breath = B ({a["dur"] and a["dur"] / 1000:.2f} s, B {a["B"] and round(a["B"], 2)} s)')
            ok(a['nudge'] and 'Drag me onto anything' in (a['nudgeText'] or ''), f'{tag}: first screen shows the one-time nudge')
            # tap the orb, then tap the control (pick mode) works as well as dragging
            ob = pg.locator('#help-orb').bounding_box(); pg.mouse.click(ob['x'] + ob['width'] / 2, ob['y'] + ob['height'] / 2); pg.wait_for_timeout(250)   # a tap (Playwright's click waits for stillness, and the orb is never still)
            ok(pg.evaluate("!document.querySelector('.help-nudge.on')"), f'{tag}: using the orb dismisses the nudge')
            pg.locator(sel).first.scroll_into_view_if_needed(); pg.wait_for_timeout(250)   # she scrolls to it; pick mode waits for her
            ok(pg.evaluate("document.getElementById('help-orb').getAttribute('aria-pressed')") == 'true', f'{tag}: after tapping the orb it waits for her to pick a control, even across a scroll')
            cb = pg.locator(sel).first.bounding_box(); pg.mouse.click(cb['x'] + cb['width'] / 2, cb['y'] + cb['height'] / 2); pg.wait_for_timeout(400)   # a plain tap on the control
            ok(pg.evaluate("(document.querySelector('.help-pop h2')||{}).textContent") == title and pg.evaluate("document.getElementById('app') ? true : true"), f'{tag}: tap the orb, then tap the control, opens its help')
            if name == 'dashboard gate': ok(pg.evaluate("document.getElementById('app').hidden"), f'{tag}: the tap in pick mode did not press Unlock')
            if pg.locator('.help-pop .hp-close').count(): pg.locator('.help-pop .hp-close').click()
            pg.wait_for_timeout(300)
            # breath holds (paused, not removed) while dragging
            o = pg.locator('#help-orb').bounding_box(); pg.mouse.move(o['x'] + o['width'] / 2, o['y'] + o['height'] / 2); pg.mouse.down(); pg.mouse.move(o['x'] - o['width'], o['y'] + o['height'] * 3, steps=8)
            h = pg.evaluate("() => { const an = document.getElementById('help-orb').getAnimations().filter(x => x.animationName === 'helpBreathe')[0]; return an ? an.playState : 'none'; }")
            pg.mouse.up(); pg.wait_for_timeout(1200)
            ok(h == 'paused', f'{tag}: the breath holds while dragging instead of snapping off ({h})')
            ok(pg.evaluate("(() => { const an = document.getElementById('help-orb').getAnimations().filter(x => x.animationName === 'helpBreathe')[0]; return an && an.playState === 'running'; })()"), f'{tag}: and breathes on again at home')
            pg.keyboard.press('Escape')
            # real drop -> help + grow
            drag(pg, sel); pg.wait_for_timeout(500)
            g = pg.evaluate("""(sel) => { const p = document.querySelector('.help-pop'), t = document.querySelector(sel), cs = getComputedStyle(t), o = getComputedStyle(document.getElementById('help-orb'));
                return { title: p && p.querySelector('h2').textContent, grown: t.classList.contains('help-grow'), scale: parseFloat(cs.scale) || 1, z: +cs.zIndex, oz: +o.zIndex, look: !!(p && p.querySelector('.hp-look')) }; }""", sel)
            ok(g['title'] == title, f'{tag}: drop on the control opens its help ({g["title"]!r})')
            ok(g['grown'] and g['scale'] > 1 and g['z'] > g['oz'], f'{tag}: the control grows (x{g["scale"]:.3f}) in front of the orb (z {g["z"]} > {g["oz"]})')
            ok(g['look'], f'{tag}: help box offers "Change how I look"')
            if pg.locator('.help-pop .hp-close').count(): pg.locator('.help-pop .hp-close').click()
            pg.wait_for_timeout(1200)
            s = pg.evaluate("(sel) => { const t = document.querySelector(sel); return { cls: t.className, scale: getComputedStyle(t).scale, vars: t.style.getPropertyValue('--hg-s') }; }", sel)
            ok('help-grow' not in s['cls'] and 'help-settle' not in s['cls'] and not s['vars'] and s['scale'] in ('none', '1'), f'{tag}: settles back and cleans up after closing')
            # look picker
            drag(pg, sel); pg.wait_for_timeout(400); pg.locator('.help-pop .hp-look').click(); pg.wait_for_timeout(300)
            tiles = pg.locator('.help-look .hl-tile').count(); ok(tiles == 13, f'{tag}: look picker shows 13 looks ({tiles})')
            pg.locator('.help-look .hl-tile[aria-label="Help owl"]').click(); pg.wait_for_timeout(200)
            lk = pg.evaluate("() => ({ t: document.getElementById('help-orb').textContent, s: localStorage.getItem('helporb.look.v1'), a: document.getElementById('help-orb').getAttribute('aria-label') })")
            ok(lk['t'] == '\U0001F989' and '"owl"' in (lk['s'] or '') and lk['a'].startswith('Help owl'), f'{tag}: picking the owl changes the orb at once and saves it on the device')
            pg.fill('.help-look .hl-in', 'Mia Smith'); pg.locator('.help-look .hl-go').click(); pg.wait_for_timeout(150)
            ok(pg.evaluate("document.getElementById('help-orb').textContent") == '\U0001F989', f'{tag}: letters (a name) are refused as a look')
            pg.fill('.help-look .hl-in', '\U0001F42C\U0001F42C'); pg.locator('.help-look .hl-go').click(); pg.wait_for_timeout(150)
            ok(pg.evaluate("document.getElementById('help-orb').textContent") == '\U0001F989', f'{tag}: two emoji are refused (just one)')
            pg.fill('.help-look .hl-in', '\U0001F42C'); pg.locator('.help-look .hl-go').click(); pg.wait_for_timeout(150)
            ok(pg.evaluate("document.getElementById('help-orb').textContent") == '\U0001F42C', f'{tag}: any one emoji she types becomes the look')
            pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
            pg.reload(wait_until='load'); pg.wait_for_selector('#help-orb'); pg.wait_for_timeout(500)
            ok(pg.evaluate("document.getElementById('help-orb').textContent") == '\U0001F42C', f'{tag}: her look is still there after a reload')
            ok(pg.evaluate("!document.querySelector('.help-nudge')"), f'{tag}: the nudge does not come back after a reload')
            ok(pg.evaluate("(() => { const an = document.getElementById('help-orb').getAnimations().filter(x => x.animationName === 'helpBreathe')[0]; return !!an && an.playState === 'running'; })()"), f'{tag}: breathes in her look too')
            # it still works the same in the new look
            drag(pg, sel); pg.wait_for_timeout(400)
            ok(pg.evaluate("(document.querySelector('.help-pop h2')||{}).textContent") == title, f'{tag}: works the same in her look')
            pg.locator('.help-pop .hp-close').click(); pg.wait_for_timeout(300)
            # a control with no entry: still being tuned, under its own name
            pg.evaluate("() => { const b = document.createElement('button'); b.id = 'zz-new'; b.textContent = 'Mystery knob'; b.style.cssText = 'position:fixed;left:40%;top:50%;z-index:5'; document.body.appendChild(b); }")
            drag(pg, '#zz-new'); pg.wait_for_timeout(400)
            m = pg.evaluate("() => { const p = document.querySelector('.help-pop'); return p ? [p.querySelector('h2').textContent, p.textContent] : null; }")
            ok(bool(m) and m[0] == 'Mystery knob' and 'still being tuned' in m[1], f'{tag}: a control with no entry explains itself as still being tuned ({m and m[0]!r})')
            pg.keyboard.press('Escape'); pg.wait_for_timeout(300)
            # virtual drop
            v = pg.evaluate("(sel) => HelpOrb.drop(document.querySelector(sel)) && document.querySelector('.help-pop h2').textContent", sel)
            ok(v == title, f'{tag}: HelpOrb.drop() (virtual drop) opens the same help')
            pg.evaluate("HelpOrb.close()"); pg.evaluate("HelpOrb.look('orb')")
            ok(pg.evaluate("document.getElementById('help-orb').textContent === '?' && localStorage.getItem('helporb.look.v1') === null"), f'{tag}: back to the orb clears the saved look')
            # gates stay shut
            if name == 'dashboard gate':
                pg.fill('#passcode', 'definitely-not-it'); pg.locator('#gate-form button[type=submit]').click(); pg.wait_for_timeout(2500)
                ok(pg.evaluate("document.getElementById('app').hidden && !document.getElementById('gate').hidden"), f'{tag}: a wrong passcode still keeps the dashboard shut')
            if name == 'chat login':
                ok(pg.evaluate("document.getElementById('screen-chat').hidden"), f'{tag}: chat stays hidden behind the password')
            ok(not errs, f'{tag}: no console errors {errs[:2]}')
            KNOWN = ('https://fonts.googleapis.com/', 'https://fonts.gstatic.com/', 'https://api.open-meteo.com/', 'https://marine-api.open-meteo.com/', 'https://edgerequals.github.io/simmie-chat/age-dial.json')   # the pages' own existing requests (blocked here)
            new_out = [u for u in outside if not u.startswith(KNOWN)]
            ok(not new_out, f'{tag}: the orb adds no requests beyond the page\'s own (fonts, weather, age dial) {new_out[:2]}')
            ctx.close()
        b.close()
print('\n'.join(results)); print(f'\n{len(results) - len(fails)}/{len(results)} passed'); sys.exit(1 if fails else 0)
