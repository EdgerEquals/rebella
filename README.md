# Rebella: static homepage prototype (example content only)

Open with any static server from this folder, e.g. `python3 -m http.server 8765`, then visit http://localhost:8765/

- `index.html` (home), `category.html` (Make It stub), `article.html` (article stub)
- `css/styles.css` (all styling, palette variables at the top), `js/main.js` (small vanilla JS)
- Fonts: Google Fonts (Alegreya Sans, Gochi Hand, Kaushan Script, Lora). Fallbacks apply offline.
- `_generator.py` is optional: it regenerates the three HTML files from shared header/footer blocks. You can also edit the HTML directly; there is no build step.

## Emergency stop ("Get me out")
- Fixed bottom-right on every page, z-index 2147483647, about 188×64px (and at least 64×64).
- With JS: `location.replace(index.html)`, so the escaped page is replaced in history.
- Without JS: a plain relative link to `index.html`, so it works from a subpath (e.g. GitHub Pages /rebella/) and from file://.
