# Rebella: static homepage prototype (example content only)

Open with any static server from this folder, e.g. `python3 -m http.server 8765`, then visit http://localhost:8765/

- `index.html` (home), `category.html` (Make It stub), `article.html` (article stub), `create.html` (board maker), `credits.html` (photo credits)
- `css/styles.css` (all styling, pastel palette variables at the top), `css/create.css` (board maker), `js/main.js` (small vanilla JS), `js/create.js` + `js/library.js` (board maker)
- `img/articles/` (article photos), `img/library/` (photo library for Create), `img/stickers/` (original SVG stickers), `img/credits.json` (credit data used to build credits.html). Full list with sources and licences: `CREDITS.md`.
- Fonts: Google Fonts (Alegreya Sans, Gochi Hand, Kaushan Script, Lora). Fallbacks apply offline.
- `_generator.py` regenerates all five HTML files from shared header/footer blocks (`_create_body.html` holds the Create page body). Edit it and run `python3 _generator.py`, or edit the HTML directly; there is no build step.

## Colours (Oct 2026: pastel)
- Site: blush #F8CFDB, peach #FCD9C0, butter #FBE7B0, mint #C8EBD5, aqua #B5E3E0, lavender #DCD0F2 on #FFF8F4, text #3A2B35, headings #5B3A50, accent #B4436C. All text/button pairs meet WCAG AA.
- Categories (band / text colour): Make It peach #FCD5B5 / #94461A, Big Questions aqua #B5E3E0 / #22696A, Mind & Body mint #C6E9D2 / #2E6B47, Your World lavender #DCD0F2 / #5A4291, Read Watch Listen butter #FBE6A2 / #745800, Your Voice blush #F8C8D5 / #A2355D.
- The passcode gate deliberately keeps the ORIGINAL Hilda browns (variables re-declared on `.gate`).

## Create (mood boards, collages, vision boards)
- Pure client-side: pick a board (mood 1200×900, collage 1000×1000, vision 900×1200), background colour, then tap or drag stickers/photos in; move, resize (corner handle), rotate (top handle), layer, copy, frame, delete; add words in Gochi Hand, Kaushan Script, Lora or Alegreya Sans.
- Keyboard: Tab to an item, arrows move (Shift = bigger steps), +/- resize, R rotates, Delete removes, Esc deselects.
- Saved automatically in `localStorage` (this browser only). "Download as image" draws the board onto a canvas (PNG, 1.5× size). All images are same-origin so the canvas isn't tainted.
- No uploading of your own photos (keeps it private and moderation-free).

## Emergency stop ("Get me out")
- Fixed bottom-right on every page (including create.html and credits.html), raspberry #B0255B on the site and the original brick red on the gate, z-index 2147483647, about 188×64px (and at least 64×64).
- With JS: `location.replace(index.html)`, so the escaped page is replaced in history.
- Without JS: a plain relative link to `index.html`, so it works from a subpath (e.g. GitHub Pages /rebella/) and from file://.

## Passcode gate (site-wide)
- Every page shows only a passcode screen (and the Get me out button) until unlocked. Page content sits in `<div id="site" hidden>` and is also hidden by CSS until `html.unlocked` is set.
- `js/gate.js` checks the passcode with Web Crypto (PBKDF2-HMAC-SHA256, 250k iterations) against the salted hash in `js/config.js`. Unlock lasts for the browser tab session (sessionStorage). "Lock" (top bar, and in the mobile menu) forgets it and returns to the home gate.
- Set the hash: `REBELLA_SITE_PASSCODE='...' python3 build_gate.py` (never commit plaintext). `python3 build_gate.py --unset` restores the placeholder, which locks everyone out.
- `noindex,nofollow` meta on every page + `robots.txt` Disallow.
- Limit: this is a client-side gate on a public static host. It stops casual visitors, but the HTML (and `_generator.py`) are public in the repo, so don't put anything truly private in it.
