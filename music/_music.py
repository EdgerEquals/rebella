# Rebella Music section (side copy, Oct 2026). Everything for the section lives in this folder.
# _generator.py calls install() from ONE line (guarded by MUSIC_SECTION). install() adds the music page,
# one nav link (desktop bar + the same link in the mobile drawer) and one small home teaser.
# Remove: see music/REMOVE.md.
import os, json, html as _h

PHI = 1.6180339887
def e(s): return _h.escape(str(s), quote=True)

MOODS = {'chill': 'Chill', 'upbeat': 'Upbeat', 'dreamy': 'Dreamy', 'acoustic': 'Acoustic'}
LOCAL = {'wa': 'Local: WA', 'au': 'Aussie'}

def _card(t, k):
    loc = (f'<span class="mu-chip mu-local mu-{e(t["local"])}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" fill="currentColor"/></svg>{e(LOCAL[t["local"]])} · {e(t["location"])}</span>'
           if t.get('local') else (f'<span class="mu-chip mu-where">{e(t["location"])}</span>' if t.get('location') else ''))
    voc = '<span class="mu-chip mu-voc">Vocals</span>' if t['vocal'] else '<span class="mu-chip mu-voc">Instrumental</span>'
    tid = 'mu-' + t['id']
    return f'''<li class="mu-card mood-{e(t["mood"])}" data-track="{e(t["id"])}" style="--k:{k}">
  <div class="mu-row">
    <button class="mu-play" type="button" aria-controls="{tid}-audio" aria-label="Play {e(t["title"])} by {e(t["artist"])}" data-label-play="Play {e(t["title"])} by {e(t["artist"])}" data-label-pause="Pause {e(t["title"])} by {e(t["artist"])}" hidden>
      <svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>
      <svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" fill="currentColor"/></svg>
    </button>
    <div class="mu-info">
      <h3 class="mu-title" id="{tid}-title">{e(t["title"])}</h3>
      <p class="mu-artist">{e(t["artist"])}</p>
      <p class="mu-chips"><span class="mu-chip mu-mood">{e(MOODS[t["mood"]])}</span>{voc}{loc}</p>
    </div>
    <span class="mu-eq" aria-hidden="true"><i></i><i></i><i></i></span>
  </div>
  <p class="mu-about">{e(t["about"])}</p>
  <audio id="{tid}-audio" class="mu-audio" controls preload="none" src="{e(t["file"])}" aria-labelledby="{tid}-title"></audio>
  <div class="mu-seek" hidden><label class="sr-only" for="{tid}-seek">Position in {e(t["title"])}</label><input class="mu-range" id="{tid}-seek" type="range" min="0" max="1000" step="1" value="0" disabled><span class="mu-time"><span class="mu-cur">0:00</span> / <span class="mu-dur">{e(t["duration"])}</span></span></div>
  <p class="mu-credit">&ldquo;{e(t["title"])}&rdquo; by <a href="{e(t["artist_url"])}" rel="noopener">{e(t["artist"])}</a> · Source: <a href="{e(t["source_url"])}" rel="noopener">{e(t["source"])}</a> · Licence: <a href="{e(t["licence_url"])}" rel="noopener license">{e(t["licence"])}</a> · Changes: {e(t["changes"])}</p>
</li>'''

def body(tracks):
    cards = ''.join(_card(t, k) for k, t in enumerate(tracks, 1))
    n_wa = sum(1 for t in tracks if t.get('local') == 'wa'); n_au = sum(1 for t in tracks if t.get('local'))
    return f'''<main id="main" class="music-page c-rwl">
<div class="container">
<header class="page-header"><span class="cat-chip">&#9835; Music</span><h1 class="page-title">Music</h1><p class="lead-banner">Real music by local and independent artists, free to play and share.</p></header>
<section class="mu-intro" aria-labelledby="mu-intro-title">
  <h2 id="mu-intro-title" class="hand">Support local. Press play.</h2>
  <p>Every track here was made by a real, independent artist who chose to share it under an open licence. That means they've said it's okay for anyone to play it, as long as we say who made it. So we do, on every track.</p>
  <p>We're starting close to home. {n_au} of these {len(tracks)} tracks are by Australian artists, and {n_wa} are by a composer from Perth. Finding local music you're allowed to share is harder than it sounds, so we'll keep looking and keep adding.</p>
  <p class="mu-how">Press play on any track. Only one plays at a time, and nothing starts on its own.</p>
</section>
<ol class="mu-list" aria-label="Tracks">
{cards}
</ol>
<p class="mu-status sr-only" role="status" aria-live="polite"></p>
<aside class="mu-featured" aria-labelledby="mu-feat-title">
  <h2 id="mu-feat-title" class="hand">Make music? Get featured</h2>
  <p>Writing songs in your bedroom? Making beats on a laptop? Playing in the school band? We'd love to feature young local artists here one day.</p>
  <p>It isn't open yet. When it is, a parent or carer will need to say okay first, and an adult editor will check every track, just like <a href="submit.html">Your Voice</a>. Please don't post your name, school or contact details anywhere to get featured. For now, just keep making.</p>
</aside>
<p class="recs-note mu-note">Artist and licence links go to other websites, so check with a parent or carer before you open them. The music plays from Rebella itself, and pressing play doesn't send anything about you anywhere.</p>
</div>
</main>'''

NAV_PILL = '<a class="create-pill music-pill" href="music/index.html"{cur}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9 17.5V6l11-2.5v11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><ellipse cx="6.4" cy="17.6" rx="3.2" ry="2.5" fill="currentColor"/><ellipse cx="17.4" cy="15" rx="3.2" ry="2.5" fill="currentColor"/></svg>Music</a>'
DRAWER_LI = '<li class="c-create"><a href="music/index.html">&#9835; Music</a></li>'
TEASER = '''<section class="container mu-teaser" aria-labelledby="mu-teaser-title"><div class="mu-teaser-in">
  <svg class="mu-teaser-note" aria-hidden="true"><use href="#i-music"/></svg>
  <div><h2 id="mu-teaser-title" class="hand">New: Music</h2><p>Free tracks by local and independent artists, starting with a Perth composer.</p></div>
  <a class="btn btn-info dots-aqua" href="music/index.html">Have a listen</a>
</div></section>'''
SITE_CSS = '<link rel="stylesheet" href="music/music-site.css">'

def install(PAGES, page, G):
    """Add the music page to PAGES and return a wrapped page() that adds the nav link, drawer link,
    home teaser and the tiny site-wide stylesheet to every generated page."""
    here = os.path.dirname(os.path.abspath(__file__))
    tracks = json.load(open(os.path.join(here, 'tracks.json')))['tracks']
    for t in tracks:
        assert os.path.exists(os.path.join(here, t['file'])), 'missing audio: ' + t['file']
        assert t['licence_url'].startswith('https://creativecommons.org/'), t['id']
    # Paths inside the page body are relative to the site root; page() adds ../ for music/index.html.
    b = body(tracks).replace('src="audio/', 'src="music/audio/')
    PAGES.append(('music/index.html', 'Music by local and independent artists | Rebella', b,
        'Free music on Rebella: openly licensed tracks by local Perth and Australian artists and other independent musicians, with full credits.',
        'music', '\n<link rel="stylesheet" href="music/music.css">\n<script src="music/music.js" defer></script>',
        'img/articles/reading.jpg', 'website', None, 'free music, local artists, Perth music, independent artists, ' + G['KEYWORDS'], '', True, '0.6'))
    def wrapped(path, title, bdy, desc, active=None, *a, **kw):
        out = page(path, title, bdy, desc, active, *a, **kw)
        pre = '../' * path.count('/')
        cur = ' aria-current="page"' if active == 'music' else ''
        def ins(s, anchor, add, after=True):
            assert anchor in s, 'music: anchor not found in ' + path + ': ' + anchor[:40]
            return s.replace(anchor, anchor + add if after else add + anchor, 1)
        fix = lambda s: s.replace('href="music/', 'href="' + pre + 'music/')
        out = ins(out, '<div class="nav-right">', '\n    ' + fix(NAV_PILL.replace('{cur}', cur)))
        out = ins(out, '&#9733; Recommendations</a></li>', fix(DRAWER_LI))
        out = ins(out, '</head>', fix(SITE_CSS), after=False)
        if path == 'index.html':
            out = ins(out, '<section class="create-promo container"', TEASER, after=False)
        return out
    return wrapped
