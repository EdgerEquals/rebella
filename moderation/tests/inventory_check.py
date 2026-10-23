#!/usr/bin/env python3
"""Bonnie's Dashboard element-inventory guard. Fails (exit 1) if any required dashboard element is missing.

  python3 moderation/tests/inventory_check.py                      # static check of moderation/ (no dependencies)
  python3 moderation/tests/inventory_check.py --render URL --pass P  # also checks the live DOM after unlocking
                                                                     # (needs playwright + a browser; use a TEST copy
                                                                     #  and a test passcode, never print a real one)
Static: every required id/selector in index.html, every required script/stylesheet include (theme loaded last),
the LOCKED age dial (section, agedial.css, agedial.js) byte-identical to tag locked-family-silhouette-2026-10-24,
and no colour literal outside the theme file. Render: the JS-built parts (music button, Music tab, Approve/Reject,
sounds switch, the five flavours, status lights, weather chip) exist and the locked panel + silhouette are visible."""
import hashlib, pathlib, re, sys
from html.parser import HTMLParser
D = pathlib.Path(__file__).resolve().parent.parent
LOCK = {  # sha256 at tag locked-family-silhouette-2026-10-24
  "css/agedial.css": "6cb088dad9b121b9", "js/agedial.js": "3e50e90bbe0a8634",
  "section": "ee6cd889c23827e31292658bc9038bf9f4f2e6d503426368354ed4ee3a226805"}
REQ_IDS = {  # label -> ids that must exist in index.html
  "passcode gate": ["gate", "gate-form", "passcode", "gate-msg"],
  "Lock button": ["lock"],
  "Ask Dad button + panel": ["ask-dad", "dad-panel", "dp-form"],
  "emoji strip / fact ticker": ["il-head", "wx-ticker", "wx-tick-track"],
  "Perth weather chip": ["wx-chip"],
  "sticky black header": ["dash-head"],
  "export / reset": ["export", "reset", "reset-strip"],
  "tab counts": ["c-pending", "c-approved", "c-rejected", "c-all"],
  "queue": ["queue", "queue-meta", "main"],
  "age dial panel": ["agedial", "ad-age"],
  "family silhouette SVG": ["ad-family", "ad-dad", "ad-mum", "ad-kid-b", "ad-kid-g"],
  "Simmie terminal": ["tty", "tty-open", "tty-cloud", "tty-form", "wx-foot"],
  "status gauge": ["wx-gauge"],
}
REQ_TEXT = {"Bonnie's Dashboard pill": r'<span class="mod-pill">Bonnie\'s Dashboard</span>',
  "Rebella logo": r'class="wordmark small"', "Dad's world mark": r'class="dad-mark"',
  "tagline": r'class="tagline">Keep Rebella safe, fun and cool<',
  "tabs Pending/Approved/Rejected/All": r'data-filter="pending".*data-filter="approved".*data-filter="rejected".*data-filter="all"',
  "status lights QUEUE/FRESH/LINK/SKY": r'data-light="queue".*data-light="fresh".*data-light="link".*data-light="sky"',
  "page title": r"<title>Bonnie's Dashboard</title>"}
REQ_INC = ["css/mod.css", "css/hud.css", "css/night.css", "css/play.css", "css/inbox-dash.css", "css/bonnie-music.css",
  "css/bonnie-sound.css", "css/music-glow.css", "css/sticky-head.css", "css/agedial.css", "css/theme-command-centre.css",
  "js/config.js", "js/crypto.js", "js/app.js", "js/hud.js", "js/talk.js", "js/inbox-dash.js", "js/bonnie-music.js",
  "js/bonnie-sound.js", "js/music-glow.js", "js/sticky-head.js", "js/agedial.js", "js/ad-plane.js"]
REQ_JS = {"Music tab (inbox-dash.js)": ("js/inbox-dash.js", "ibx-music-tab"), "Approve button (app.js)": ("js/app.js", "btn-approve"),
  "Reject button (app.js)": ("js/app.js", "\\u2715 Reject"), "music button (bonnie-music.js)": ("js/bonnie-music.js", "bm-pill"),
  "sounds switch (bonnie-sound.js)": ("js/bonnie-sound.js", "bs-toggle"), "sound flavours (bonnie-sound.js)": ("js/bonnie-sound.js", "bs-flav")}
FLAVOURS = ["Lo-fi", "Chiptune", "Ambient", "Pop", "Nature"]

class P(HTMLParser):
    def __init__(s): super().__init__(); s.ids = set(); s.inc = []
    def handle_starttag(s, t, a):
        a = dict(a)
        if a.get("id"): s.ids.add(a["id"])
        if t == "link" and a.get("rel") == "stylesheet" and a.get("href", "").startswith("css/"): s.inc.append(a["href"].split("?")[0])
        if t == "script" and a.get("src"): s.inc.append(a["src"].split("?")[0])
def static():
    fail = []; html = (D/"index.html").read_text(); p = P(); p.feed(html)
    for lab, ids in REQ_IDS.items():
        miss = [i for i in ids if i not in p.ids]
        if miss: fail.append("%s: missing #%s" % (lab, ", #".join(miss)))
    for lab, rx in REQ_TEXT.items():
        if not re.search(rx, html, re.S): fail.append(lab + ": missing")
    for inc in REQ_INC:
        if inc not in p.inc: fail.append("include missing: " + inc)
    css = [i for i in p.inc if i.startswith("css/")]
    if css and css[-1] != "css/theme-command-centre.css": fail.append("theme-command-centre.css must be the LAST stylesheet")
    for lab, (f, s) in REQ_JS.items():
        if s not in (D/f).read_text(): fail.append(lab + ": not found in " + f)
    snd = (D/"js/bonnie-sound.js").read_text()
    for fl in FLAVOURS:
        if fl not in snd: fail.append("sound flavour missing: " + fl)
    for f in ("css/agedial.css", "js/agedial.js"):
        if hashlib.sha256((D/f).read_bytes()).hexdigest()[:16] != LOCK[f]: fail.append("LOCKED file changed: " + f)
    m = re.search(r'<section class="agedial".*?</section>', html, re.S)
    if not m or hashlib.sha256(m.group(0).encode()).hexdigest() != LOCK["section"]: fail.append("LOCKED age dial section changed")
    # palette layer: no colour literals outside the theme file (comments ignored; locked agedial.css exempt)
    for f in sorted((D/"css").glob("*.css")):
        if f.name in ("theme-command-centre.css", "agedial.css"): continue
        body = re.sub(r"/\*.*?\*/", "", f.read_text(), flags=re.S)
        hit = re.search(r"(?<![\w-])#[0-9A-Fa-f]{3,8}\b(?=[^{}]*[;}])|\brgba?\(\s*\d|\bhsla?\(\s*\d|%23[0-9A-Fa-f]{3,6}", body)
        if hit: fail.append("colour literal outside the theme file: %s (%s)" % (f.name, hit.group(0)))
    return fail

def render(url, pw):
    import asyncio
    from playwright.async_api import async_playwright
    CHECKS = {"music button": ".bm .bm-pill", "Music tab": ".tab.ibx-music-tab", "Approve buttons": "#queue .btn-approve",
      "Reject buttons": "#queue .btn-primary", "sounds switch": ".bs-toggle", "sound flavours": ".bs-flav",
      "status lights": ".wx-light[data-light]", "weather chip": "#wx-chip", "emoji strip": "#il-head",
      "Simmie terminal": "#tty", "Lock": "#lock", "Ask Dad": "#ask-dad", "age dial panel": "#agedial", "silhouette": "#ad-family",
      "Bonnie's Dashboard pill": ".masthead .mod-pill", "logo": ".masthead .wordmark"}
    async def go():
        fail = []
        async with async_playwright() as p:
            b = await p.chromium.launch(args=["--no-sandbox"], executable_path="/usr/bin/google-chrome" if pathlib.Path("/usr/bin/google-chrome").exists() else None)
            pg = await b.new_page(viewport={"width": 1280, "height": 800})
            await pg.goto(url, wait_until="networkidle")
            if not await pg.is_visible("#gate"): fail.append("gate not shown before unlock")
            await pg.fill("#passcode", pw); await pg.click("#gate-form button")
            await pg.wait_for_selector("#app", state="visible", timeout=30000); await pg.wait_for_timeout(2500)
            for lab, sel in CHECKS.items():
                if await pg.locator(sel).count() == 0: fail.append("render: %s missing (%s)" % (lab, sel))
            fl = await pg.evaluate("[...document.querySelectorAll('.bs-flav button,.bs-flav label')].map(e=>e.textContent.trim())")
            for f in FLAVOURS:
                if not any(f.lower() in x.lower() for x in fl): fail.append("render: flavour missing: " + f)
            if await pg.locator(".wx-light[data-light]").count() < 4: fail.append("render: fewer than 4 status lights")
            pill = (await pg.text_content(".masthead .mod-pill") or "").strip()
            if pill != "Bonnie's Dashboard": fail.append("render: pill says %r" % pill)
            await b.close()
        return fail
    return asyncio.run(go())

if __name__ == "__main__":
    fails = static()
    if "--render" in sys.argv:
        fails += render(sys.argv[sys.argv.index("--render")+1], sys.argv[sys.argv.index("--pass")+1])
    if fails:
        print("INVENTORY CHECK FAILED:"); [print("  - " + f) for f in fails]; sys.exit(1)
    print("inventory check passed (%s)" % ("static + render" if "--render" in sys.argv else "static"))
