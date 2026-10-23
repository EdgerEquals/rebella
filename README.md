# Rebella: learn what you love

Live: https://edgerequals.github.io/rebella/ (public). The moderation dashboard in `moderation/` is separate, passcode-locked, and is NOT touched by `_generator.py`.

Open with any static server from this folder, e.g. `python3 -m http.server 8765`, then visit http://localhost:8765/

- `index.html` (home), `category.html` (all articles), `category-<section>.html` (one page per section: make, questions, mind, world, rwl, voice), `articles/<slug>.html` (one page per article), `recommendations.html`, `submit.html` (how Your Voice sharing will work), `create.html` (board maker), `credits.html` (photo credits)
- `article.html` is only a "this page has moved" redirect to `articles/moon-garden.html` (kept so old links still work).
- `css/styles.css` (all styling, pastel palette variables at the top), `css/create.css` (board maker), `js/main.js` (small vanilla JS), `js/create.js` + `js/library.js` (board maker)
- `img/articles/` (article photos), `img/library/` (photo library for Create), `img/stickers/` (original SVG stickers), `img/credits.json` (credit data used to build credits.html). Full list with sources and licences: `CREDITS.md`.
- Fonts: Google Fonts (Alegreya Sans, Gochi Hand, Kaushan Script, Lora). Fallbacks apply offline.
- `_generator.py` regenerates every HTML page plus `sitemap.xml` and `robots.txt` from shared header/footer blocks. Article text lives in `_articles.py`, the Create page body in `_create_body.html`, the hero artwork in `_hero_art.svg`. Edit, then run `python3 _generator.py` from this folder. Plain static output, no build step needed to serve it.

## Articles
- Each entry in `_articles.py` (slug, section, title, card excerpt, meta description, photo, lead, body HTML, support flag) becomes `articles/<slug>.html`, its card on the home/section/all-articles pages, and a sitemap entry.
- `support=True` adds the "Need to talk?" box (ReachOut, Kids Helpline 1800 55 1800, headspace). Use it on any health, feelings or online-safety article. Rebella doesn't give medical advice.
- Rules: original writing only, check every fact, no invented statistics or quotes, no diet/weight-loss/appearance-rating content, photos CC0/public domain and credited in `img/credits.json`, `CREDITS.md` and (generated) `credits.html`.

## Recommendations page (edit ONE file: `js/recs.js`)
- `recommendations.html` reads everything from `js/recs.js` (rendered by `js/recs-render.js`). To update the picks, edit `js/recs.js` only, then commit and push. No need to run the generator.
- Any field left as `""` shows a "coming soon" placeholder for that section.
- Links must start with `https://`. Songs are links only, never upload audio. The `celebrity` block is shown as **Rightfully Famous** (key name unchanged); add a `source` news link so it can be checked, or leave it empty. `deed` is optional. Empty `why` notes are simply left out; an empty quote `by` shows "Author unknown".
- About me: interests only. No name, school, suburb, age or photos. Bonnie checks every update before it goes live.

Example:
```js
window.REBELLA_RECS = {
  updated: "Week of 26 October 2026",
  song: { title: "Song name", artist: "Artist name", why: "It always cheers me up on the bus.", link: "https://example.com/song" },
  celebrity: { name: "Person's name", who: "Singer and songwriter", deed: "What they did, in one or two sentences.", why: "It shows small acts matter.", source: "https://example.com/news-story" },
  quote: { text: "The quote goes here", by: "Who said it", why: "Why I like it." },
  goal: { goal: "Say something kind to three people this week.", why: "Kindness is contagious." },
  other: [
    { title: "A book, show, hobby or website", type: "Book", why: "Why I recommend it.", link: "https://example.com" }
  ],
  about: { interests: ["drawing", "space", "baking"], note: "I love making things and finding out how stuff works." }
};
```

## Search (SEO)
- Home title and meta description use the phrases (the visible intro is now Florence's own note, kept verbatim in `_generator.py`; class `.creator-note`) "learn what you love", "fun websites for teens" and "educational and cool sites for girls".
- Every page has its own title, meta description, meta keywords, canonical URL, Open Graph and Twitter tags (articles also have Article JSON-LD). `sitemap.xml` lists every public page (not `moderation/`). `robots.txt` keeps `Disallow: /moderation/` and has a `Sitemap:` line.
- Note: crawlers only read robots.txt at the domain root (edgerequals.github.io/robots.txt), so submit the sitemap in Google Search Console as well.

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

## Public site (no gate)
- Rebella is public: every page has `class="unlocked"` on `<html>` (the CSS hides content without it) and is indexable. The old site-wide passcode gate was removed in Oct 2026.
- The moderation dashboard (`moderation/`) keeps its own passcode gate and is excluded from the sitemap and disallowed in robots.txt.
- No social features (comments, profiles, DMs, follower counts) and no personal details anywhere on the public site.

## Zine look + rebel quotes (Oct 2026, inspired by the movie Moxie)
- `css/zine.css` loads AFTER `css/styles.css` on every generated page and only adds/overrides styles: paper grain, tape strips, cut-paper edges, torn-paper dividers, slightly tilted cards/photos, photocopy halftone on photos, ransom-note headings. Pastel palette and category bands are unchanged. Respects `prefers-reduced-motion` (no hover motion/transitions) and `forced-colors`.
- **No class names were renamed or removed.** New classes only: `body.zine` (scopes the zine styles), `.zine-tear` (torn divider), `.ransom` / `.rw` / `.rl0`–`.rl5` / `.ransom-h` (cut-out-letter headings: home h1 and section page titles only; plain text sits in an `.sr-only` span), `.rebel-quote` / `.rq-paper` / `.rq-text` / `.rq-cap` / `.rq-person` / `.rq-who` / `.rq-src` / `.quote-row` (quote cards).
- Quotes: edit ONE file, `js/quotes.js` (`quote`, `person`, `who`, `context`, `source`). The list after the `=` must stay valid JSON because `_generator.py` reads it too. Every quote must be real, word-for-word, correctly attributed and linked to a reliable source (Wikiquote's sourced section, a primary source or a reputable outlet). Never add "attributed"/disputed/listicle quotes.
- `js/quotes-render.js` fills every `[data-rebel-quote]` slot with a random quote (a different person per slot) on each page load. `_generator.py` pre-renders a fixed quote in each slot so nothing is blank without JS.
- `_generator.py` interfaces are unchanged (`ARTICLES` format, `card()`, `article_page(a)`, `page(...)`). New helpers: `rebel_quote(seed)`, `ransom(text)`, `TEAR`. `article_page()` now adds one quote card after the article body (before the support box); section pages get one after the 2nd card (and another if a section has 4+ articles); the home page gets three; the All articles page gets two.

## Content pipeline (approved items)
- Items Bonnie approves on the moderation dashboard are published by `/workspace/rebella-pipeline` (on the box).
  They live in `_pipeline_articles.json` (same fields as `_articles.py` plus source/licence info), with photos in
  `img/articles/<slug>.jpg`, credits in `img/credits.json` + `CREDITS.md`, and `_generator.py` builds their pages,
  home/section cards, credits table and sitemap. Don't hand-edit those entries; republished text must stay unedited.
