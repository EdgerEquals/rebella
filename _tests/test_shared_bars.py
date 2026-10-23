"""Headless checks for the shared bars, nickname, help orb and cookies page.
Run from the repo root:  python3 _tests/test_shared_bars.py [outdir-for-screenshots]
Serves the site on a local static server; nothing is pushed or sent anywhere."""
import json, os, re, subprocess, sys, time, threading, functools, http.server, socketserver
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = sys.argv[1] if len(sys.argv) > 1 else '/tmp/rebella-sharedbars-shots'
os.makedirs(SHOTS, exist_ok=True)
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
class Q(socketserver.TCPServer): allow_reuse_address = True
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
srv = Q(('127.0.0.1', 0), H); PORT = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{PORT}/'
PAGES = ['index.html', 'recommendations.html', 'create.html', 'articles/make-a-zine.html', 'cookies/']
VIEWS = {'phone-portrait': (390, 844), 'phone-landscape': (844, 390), 'desktop': (1366, 900)}
fails = []; results = []
def ok(cond, msg):
    results.append(('PASS' if cond else 'FAIL') + ' ' + msg)
    if not cond: fails.append(msg)

BANNED = ['bonnie', 'dad', 'simmie', 'moderation', 'queue', 'ask dad', 'lock', 'passcode', 'age dial', 'meter', 'status glow']
BLOCK_STORAGE = """Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}});"""

with sync_playwright() as p:
    b = p.chromium.launch()
    # ---- layout, lock, console errors, wording, cookies ----
    for vname, (w, h) in VIEWS.items():
        ctx = b.new_context(viewport={'width': w, 'height': h}, has_touch=vname.startswith('phone'), is_mobile=vname.startswith('phone'))
        for path in PAGES:
            pg = ctx.new_page(); errs = []
            pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.goto(BASE + path); pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(300)
            r = pg.evaluate("""() => { const h=document.getElementById('app-head').getBoundingClientRect(), f=document.getElementById('app-foot').getBoundingClientRect();
                 const first=[...document.querySelectorAll('#site > *')].find(e=>e.id!=='app-head'&&e.offsetHeight&&getComputedStyle(e).position!=='fixed'&&getComputedStyle(e).position!=='absolute');
                 const esc=document.querySelector('.escape').getBoundingClientRect(); const orb=document.getElementById('help-orb');
                 return {ht:h.top,hb:h.bottom,ft:f.top,fb:f.bottom,vh:innerHeight,first:first?first.getBoundingClientRect().top+scrollY:0,escb:esc.bottom,
                   orb: orb? orb.getBoundingClientRect().bottom:null, orbs: document.querySelectorAll('.help-orb').length,
                   text:(document.getElementById('app-head').innerText+' '+document.getElementById('app-foot').innerText).toLowerCase(),
                   sw: document.documentElement.scrollWidth, iw: innerWidth}; }""")
            tag = f'{vname} {path}'
            ok(abs(r['ht']) < 1 and abs(r['fb'] - r['vh']) < 1, f'{tag}: bars pinned top/bottom')
            ok(r['first'] >= r['hb'] - 1, f'{tag}: content starts below header ({r["first"]:.0f} >= {r["hb"]:.0f})')
            ok(r['escb'] <= r['ft'] + 1 and r['orb'] is not None and r['orb'] <= r['ft'] + 1, f'{tag}: Get me out and orb sit above footer')
            ok(r['orbs'] == 1, f'{tag}: exactly one help orb')
            ok(r['sw'] <= r['iw'] + 1, f'{tag}: no horizontal overflow')
            ok(not any(re.search(r'\b' + re.escape(x) + r'\b', r['text']) for x in BANNED), f'{tag}: visitor wording has no dashboard-only words')
            pg.mouse.wheel(0, 2500); pg.wait_for_timeout(300)
            r2 = pg.evaluate("() => [document.getElementById('app-head').getBoundingClientRect().top, innerHeight-document.getElementById('app-foot').getBoundingClientRect().bottom]")
            ok(abs(r2[0]) < 1 and abs(r2[1]) < 1, f'{tag}: bars stay locked after scroll')
            pg.evaluate('scrollTo(0,0)'); pg.wait_for_timeout(200)
            if path in ('index.html', 'cookies/', 'create.html'):
                pg.screenshot(path=f'{SHOTS}/{vname}_{path.strip("/").replace("/", "_").replace(".html", "")}.png')
            ok(not errs, f'{tag}: no console errors {errs[:2]}')
            pg.close()
        ok(ctx.cookies() == [], f'{vname}: no cookies set after visiting {len(PAGES)} pages ({len(ctx.cookies())})')
        ctx.close()

    # ---- nickname flow ----
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
    pg = ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(BASE + 'index.html'); pg.wait_for_load_state('networkidle')
    g = lambda: pg.text_content('#bar-greet').strip()
    fh0 = pg.evaluate("document.getElementById('app-foot').offsetHeight")
    ok(g() == 'Hey there, welcome to Rebella' and pg.is_visible('#vn-ask') and not pg.is_visible('#vn-form'), 'first visit: neutral greeting + collapsed phrase')
    pg.click('#vn-ask'); ok(pg.is_visible('#vn-in') and 'Stays on this device only' in pg.text_content('#vn-note'), 'prompt expands inline with device-only note')
    fh1 = pg.evaluate("document.getElementById('app-foot').offsetHeight"); ok(fh1 <= fh0, f'open prompt adds no footer height ({fh0}->{fh1})')
    pg.screenshot(path=f'{SHOTS}/name_prompt_open.png')
    pg.fill('#vn-in', 'B@d!'); pg.press('#vn-in', 'Enter'); ok('Letters' in pg.text_content('#vn-note'), 'rejects symbols')
    pg.fill('#vn-in', 'shithead'); pg.press('#vn-in', 'Enter'); ok('different' in pg.text_content('#vn-note'), 'profanity filter')
    reqs = []; pg.on('request', lambda r: reqs.append(r.url))
    pg.fill('#vn-in', '  Sam  '); pg.press('#vn-in', 'Enter'); pg.wait_for_timeout(1500)
    ok(reqs == [], f'no network requests on save ({reqs})')
    rec = json.loads(pg.evaluate("localStorage.getItem('rebella-visitor')"))
    ok(set(rec) == {'v', 'name', 'savedOn'} and rec['v'] == 1 and rec['name'] == 'Sam' and re.match(r'\d{4}-\d\d-\d\d$', rec['savedOn']), f'save: stored {rec}')
    ok(g() == 'Hey Sam, welcome to Rebella', f'save: header greets by name ({g()})')
    ok(pg.is_visible('#vn-known') and 'Not Sam?' in pg.inner_text('#vn-known'), 'save: footer shows "Not Sam? change / forget my name"')
    pg.screenshot(path=f'{SHOTS}/name_saved.png')
    pg.reload(); pg.wait_for_load_state('networkidle')
    ok('Sam' in g() and not g().startswith('Hey Sam'), f'reload: return greeting ({g()})')
    pg.goto(BASE + 'articles/make-a-zine.html'); pg.wait_for_load_state('networkidle')
    ok('Sam' in g(), 'return greeting on another page (same origin)')
    g1 = g(); pg.goto(BASE + 'create.html'); ok(g() == g1, 'return greeting picked by day, same on every page')
    pg.screenshot(path=f'{SHOTS}/name_return_visit.png')
    pg.click('#vn-change'); ok(pg.input_value('#vn-in') == 'Sam', 'change: prefilled')
    pg.fill('#vn-in', 'Mary-Jane Lee'); pg.press('#vn-in', 'Enter'); pg.wait_for_timeout(1400)
    ok(g() == 'Hey Mary-Jane Lee, welcome to Rebella' and json.loads(pg.evaluate("localStorage.getItem('rebella-visitor')"))['name'] == 'Mary-Jane Lee', 'change: updates in place')
    pg.click('#vn-forget'); pg.wait_for_timeout(1400)
    ok(pg.evaluate("localStorage.getItem('rebella-visitor')") is None and g() == 'Hey there, welcome to Rebella' and pg.is_visible('#vn-ask'), 'forget: key removed, first-visit state')
    pg.evaluate("localStorage.setItem('rebella-visitor', JSON.stringify({v:1,name:'<script>',savedOn:'2026-10-24'}))"); pg.reload(); pg.wait_for_load_state('networkidle')
    ok(pg.evaluate("localStorage.getItem('rebella-visitor')") is None and g() == 'Hey there, welcome to Rebella', 'invalid stored value dropped on load')
    ok(not errs, f'nickname flow: no page errors {errs}')
    ctx.close()
    # storage blocked
    ctx = b.new_context(); ctx.add_init_script(BLOCK_STORAGE)
    pg = ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(BASE + 'index.html'); pg.wait_for_load_state('networkidle')
    pg.click('#vn-ask'); pg.fill('#vn-in', 'Sam'); pg.press('#vn-in', 'Enter'); pg.wait_for_timeout(1400)
    ok(pg.text_content('#bar-greet').strip() == 'Hey Sam, welcome to Rebella', 'storage blocked: works for this visit')
    pg.reload(); pg.wait_for_load_state('networkidle')
    ok(pg.text_content('#bar-greet').strip() == 'Hey there, welcome to Rebella', 'storage blocked: not remembered after reload')
    ok(not errs, f'storage blocked: fails silently {errs}')
    ctx.close()

    # ---- help orb drag ----
    ctx = b.new_context(viewport={'width': 1366, 'height': 900}); pg = ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(BASE + 'index.html'); pg.wait_for_load_state('networkidle')
    o = pg.locator('#help-orb').bounding_box(); card = pg.locator('.card:visible').first; card.scroll_into_view_if_needed(); c = card.bounding_box()
    o = pg.locator('#help-orb').bounding_box()
    pg.mouse.move(o['x'] + 20, o['y'] + 20); pg.mouse.down(); pg.mouse.move(c['x'] + 40, c['y'] + 40, steps=8)
    ok(pg.evaluate("document.documentElement.classList.contains('help-seeking') && !!document.querySelector('.card.help-hot')"), 'orb drag: targets tinted, card under orb is hot')
    pg.screenshot(path=f'{SHOTS}/help_orb_dragging.png')
    pg.mouse.up(); pg.wait_for_timeout(1500)
    ok(pg.evaluate("!!document.querySelector('.help-pop') && document.querySelector('.help-pop h2').textContent === 'Article card'") and pg.text_content('#bar-greet').strip() == 'Hey there, welcome to Rebella', 'orb drop: answer in an anchored help pop-up (header line unchanged)')
    pg.screenshot(path=f'{SHOTS}/help_orb_answer.png')
    # cookies phrase
    pg.wait_for_timeout(23000)
    ok(pg.text_content('#bar-greet').strip() == 'Hey there, welcome to Rebella' and pg.evaluate("!document.getElementById('bar-line').hasAttribute('data-help-busy') && !document.getElementById('app-foot').classList.contains('help-answering')") and len(pg.text_content('#bar-line').strip()) > 0, 'orb: header restored, footer line handed back to the ticker')
    ok(not errs, f'orb: no page errors {errs}')
    ctx.close(); b.close()

# ---- About me + Picks unchanged vs main ----
def main_part(html, start, end):
    i = html.find(start); return html[i:html.find(end, i)] if i >= 0 else None
for f, s_, e_ in [('recommendations.html', '<main', '</main>'), ('index.html', '<section class="container about-home"', '</section>')]:
    old = subprocess.run(['git', 'show', 'main:' + f], cwd=ROOT, capture_output=True, text=True).stdout
    new = open(os.path.join(ROOT, f)).read()
    ok(main_part(old, s_, e_) is not None and main_part(old, s_, e_) == main_part(new, s_, e_), f'{f}: {s_} content unchanged vs main')
print('\n'.join(results)); print(f'\n{len(results) - len(fails)}/{len(results)} passed; screenshots in {SHOTS}')
sys.exit(1 if fails else 0)
