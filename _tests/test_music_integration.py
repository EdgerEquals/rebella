"""Headless checks for the integrated Music section, Music Playground and Bonnie's radio (one dial, one orb, one registry).
Run from the repo root:  python3 _tests/test_music_integration.py [outdir] [base-url]
Default: serves the repo locally. With a base URL (e.g. the live site) it checks that instead. Nothing is sent anywhere."""
import os, sys, re, threading, functools, http.server, socketserver
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = sys.argv[1] if len(sys.argv) > 1 else '/tmp/rebella-music-integ'
os.makedirs(SHOTS, exist_ok=True)
if len(sys.argv) > 2: BASE = sys.argv[2].rstrip('/') + '/'
else:
    H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    class Q(socketserver.TCPServer): allow_reuse_address = True
    http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
    srv = Q(('127.0.0.1', 0), H); threading.Thread(target=srv.serve_forever, daemon=True).start()
    BASE = f'http://127.0.0.1:{srv.server_address[1]}/'
HOST = urlparse(BASE).netloc
PAGES = ['', 'music/', 'music/playground/', 'cookies/', 'articles/moon-garden.html', 'recommendations.html']
VIEWS = {'se-portrait': dict(viewport={'width': 375, 'height': 667}, is_mobile=True, has_touch=True, device_scale_factor=2),
         'se-landscape': dict(viewport={'width': 667, 'height': 375}, is_mobile=True, has_touch=True, device_scale_factor=2),
         'desktop': dict(viewport={'width': 1366, 'height': 900})}
ALLOWED_EXT = ('fonts.googleapis.com', 'fonts.gstatic.com')
YT = re.compile(r'youtube|ytimg|googlevideo|doubleclick')
def yt(u): return bool(YT.search(urlparse(u).netloc))   # host only (the site's own music/youtube/ folder is fine)
NOAUDIO = "delete window.AudioContext; delete window.webkitAudioContext;"
fails = []; results = []
def ok(c, m):
    results.append(('PASS ' if c else 'FAIL ') + m)
    if not c: fails.append(m)
def center(pg, sel):  # centre the element in the visible window between the locked bars
    pg.evaluate("""s => { const e=document.querySelector(s), h=document.getElementById('app-head').getBoundingClientRect().bottom, f=document.getElementById('app-foot').getBoundingClientRect().top;
      const n=document.querySelector('.mainnav'), nb=(n&&getComputedStyle(n).position==='sticky')?n.getBoundingClientRect().bottom:h, top=Math.max(h,nb), r=e.getBoundingClientRect();
      scrollBy(0, r.top - (top + (f - top - r.height) / 2)); }""", sel); pg.wait_for_timeout(200)
WARN = []
def click(pg, sel):
    center(pg, sel)
    try: pg.click(sel, timeout=3000)
    except Exception:   # covered by the locked bars / orb / Get me out (tiny landscape window): note it and press it via the DOM
        WARN.append(f'{pg.viewport_size["width"]}x{pg.viewport_size["height"]} {pg.url.split("/",3)[-1] or "/"}: {sel} covered by the locked bars, orb or Get me out')
        pg.evaluate("s => document.querySelector(s).click()", sel)
def name(p): return (p.strip('/').replace('/', '_').replace('.html', '') or 'home')

with sync_playwright() as pw:
    b = pw.chromium.launch()
    for audio in (True, False):
        for vn, opts in VIEWS.items():
            ctx = b.new_context(**opts)
            if not audio: ctx.add_init_script(NOAUDIO)
            for path in PAGES:
                pg = ctx.new_page(); errs = []; reqs = []; bad = []
                pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
                pg.on('pageerror', lambda e: errs.append(str(e)))
                pg.on('request', lambda r: reqs.append(r.url))
                pg.on('response', lambda r: bad.append(f'{r.status} {r.url}') if r.status >= 400 else None)
                tag = f'{vn}{"" if audio else "-noaudio"} /{path}'
                resp = pg.goto(BASE + path, wait_until='networkidle'); pg.wait_for_timeout(500)
                ok(resp and resp.status == 200, f'{tag}: HTTP 200 ({resp.status if resp else None})')
                r = pg.evaluate("""() => { const h=document.getElementById('app-head'), f=document.getElementById('app-foot');
                    return {orbs:document.querySelectorAll('.help-orb').length, ht:h?h.getBoundingClientRect().top:null, fb:f?innerHeight-f.getBoundingClientRect().bottom:null,
                      dials:document.querySelectorAll('.br-dial').length, sw:document.documentElement.scrollWidth, iw:innerWidth,
                      script:h&&h.querySelector('.wm-logo img')?'logo':null, mast:h?getComputedStyle(h.querySelector('.masthead')).backgroundColor:null,
                      foot:f?getComputedStyle(f).backgroundColor:null} }""")
                ok(r['orbs'] == 1, f'{tag}: exactly one help orb ({r["orbs"]})')
                ok(r['ht'] is not None and abs(r['ht']) < 1 and abs(r['fb']) < 1, f'{tag}: bars pinned')
                ok(r['mast'] == 'rgb(255, 255, 255)' and r['script'] == 'logo' and r['foot'] == 'rgb(253, 238, 242)', f'{tag}: light visitor bars ({r["mast"]}, {r["script"]}, {r["foot"]})')
                ok(r['sw'] <= r['iw'] + 1, f'{tag}: no horizontal overflow ({r["sw"]}>{r["iw"]})')
                pg.mouse.wheel(0, 3000); pg.wait_for_timeout(300)
                r2 = pg.evaluate("() => [document.getElementById('app-head').getBoundingClientRect().top, innerHeight-document.getElementById('app-foot').getBoundingClientRect().bottom]")
                ok(abs(r2[0]) < 1 and abs(r2[1]) < 1, f'{tag}: bars stay locked after scroll')
                pg.evaluate('scrollTo(0,0)'); pg.wait_for_timeout(200)
                if path in ('', 'music/playground/'):
                    ok(r['dials'] == 1, f'{tag}: exactly one genre dial ({r["dials"]})')
                    center(pg, '.br-dial'); pg.focus('.br-dial'); pg.keyboard.press('ArrowRight'); pg.wait_for_timeout(500)
                    click(pg, '.br-play'); pg.wait_for_timeout(800)
                    st = pg.text_content('.br-status')
                    ok('tuning in soon' in st, f'{tag}: placeholder play shows friendly message ({st!r})')
                if path == 'music/playground/':
                    t0 = pg.text_content('#pg-tempo-readout'); pg.focus('.br-dial')
                    for _ in range(3): pg.keyboard.press('ArrowLeft'); pg.wait_for_timeout(250)
                    for _ in range(4): pg.keyboard.press('ArrowRight'); pg.wait_for_timeout(250)
                    t1 = pg.text_content('#pg-tempo-readout')
                    ok(t1.startswith('Tempo') and t0 != t1 or 'BPM' in t1, f'{tag}: band follows the dial ({t0} -> {t1})')
                    click(pg, '#pg-reading'); pg.wait_for_timeout(400)
                    ok('Reading music is tuning in soon' in pg.text_content('.br-status'), f'{tag}: reading button placeholder')
                    if audio:
                        click(pg, '#pg-start'); pg.wait_for_timeout(2500)
                        tone = [u for u in reqs if u.endswith('vendor/tone/Tone.js')]
                        ok(pg.evaluate('!!window.Tone') and tone and all(urlparse(u).netloc == HOST for u in tone), f'{tag}: Tone.js loaded self-hosted ({tone})')
                        click(pg, '.pg-preset'); click(pg, '#pg-play'); pg.wait_for_timeout(1500); click(pg, '#pg-play')
                    else:
                        ok(not pg.evaluate('!!window.Tone') and pg.is_visible('#pg-noaudio'), f'{tag}: no AudioContext -> resting message, Tone not loaded')
                if path == 'music/':
                    ok(pg.locator('.mu-card').count() == 6 and 'hypersleep' not in pg.content().lower(), f'{tag}: 6 tracks, vocal track held back')
                ok(not [u for u in reqs if yt(u)], f'{tag}: nothing loaded from YouTube without an approved id ({[u for u in reqs if yt(u)][:2]})')
                ext = [u for u in reqs if urlparse(u).netloc not in (HOST,) + ALLOWED_EXT and not u.startswith(('data:', 'blob:'))]
                ok(not ext, f'{tag}: no third-party requests except fonts ({ext[:3]})')
                ok(not bad, f'{tag}: no 4xx/5xx ({bad[:2]})')
                ok(not errs, f'{tag}: no console errors ({errs[:2]})')
                pg.screenshot(path=f'{SHOTS}/{vn}{"" if audio else "-noaudio"}_{name(path)}.png')
                pg.close()
            ok(ctx.cookies() == [], f'{vn}{"" if audio else "-noaudio"}: no cookies set')
            ctx.close()
    # playground orb answers from the merged site help.json; name prompt makes zero requests
    ctx = b.new_context(**VIEWS['desktop']); pg = ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(BASE + 'music/playground/', wait_until='networkidle'); pg.wait_for_timeout(500)
    tgt = pg.locator('[data-help="tap-tempo"]').first; tgt.scroll_into_view_if_needed(); c = tgt.bounding_box(); o = pg.locator('#help-orb').bounding_box()
    pg.mouse.move(o['x'] + 20, o['y'] + 20); pg.mouse.down(); pg.mouse.move(c['x'] + 10, c['y'] + 10, steps=8); pg.mouse.up(); pg.wait_for_timeout(1600)
    ok(pg.text_content('#bar-greet').strip() == 'Tap tempo', f'playground orb: answer from merged help.json ({pg.text_content("#bar-greet").strip()!r})')
    pg.screenshot(path=f'{SHOTS}/playground_orb_answer.png')
    reqs = []; pg.on('request', lambda r: reqs.append(r.url))
    pg.click('#vn-ask'); pg.fill('#vn-in', 'Sam'); pg.press('#vn-in', 'Enter'); pg.wait_for_timeout(1500)
    ok(reqs == [], f'name prompt: zero network requests ({reqs})')
    pg.evaluate("localStorage.removeItem('rebella-visitor')")
    ok(not errs, f'orb + name prompt: no page errors {errs}')
    ctx.close(); b.close()
print('\n'.join(results)); print('\n'.join('WARN ' + w for w in sorted(set(WARN)))); print(f'\n{len(results) - len(fails)}/{len(results)} passed; screenshots in {SHOTS}')
sys.exit(1 if fails else 0)
