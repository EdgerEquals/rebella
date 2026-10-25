# Generates the static Rebella pages (output is plain HTML; no build step needed to use the site).
import os, json
OUT=os.path.dirname(os.path.abspath(__file__))  # run from inside the site folder
CREDITS=json.load(open(os.path.join(OUT,'img','credits.json')))
CRED={c['file']:c for c in CREDITS}
CATS=[('make','Make It'),('questions','Big Questions'),('mind','Mind &amp; Body'),('world','Your World'),('rwl','Read Watch Listen'),('voice','Your Voice')]

ICONS='''<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<symbol id="i-star" viewBox="0 0 100 100"><path d="M50 4l12 30 32 2-25 21 8 32-27-18-27 18 8-32L6 36l32-2z" fill="#fff"/></symbol>
<symbol id="i-sparkle" viewBox="0 0 100 100"><path d="M50 0c4 30 16 42 50 50-34 8-46 20-50 50-4-30-16-42-50-50 34-8 46-20 50-50z" fill="currentColor"/></symbol>
<symbol id="i-planet" viewBox="0 0 100 100"><circle cx="50" cy="50" r="26" fill="#fff"/><ellipse cx="50" cy="52" rx="46" ry="12" fill="none" stroke="#5B3A50" stroke-width="5" transform="rotate(-18 50 52)"/><circle cx="42" cy="44" r="5" fill="#5B3A50" opacity=".25"/></symbol>
<symbol id="i-brush" viewBox="0 0 100 100"><rect x="44" y="8" width="12" height="52" rx="5" fill="#fff"/><path d="M38 60h24l-3 14c-2 10-16 10-18 0z" fill="#5B3A50"/><path d="M46 84c0 8 8 8 8 0l-4-10z" fill="#5B3A50"/></symbol>
<symbol id="i-book" viewBox="0 0 100 100"><path d="M8 24c16-6 30-4 42 6v52c-12-10-26-12-42-6z" fill="#fff"/><path d="M92 24c-16-6-30-4-42 6v52c12-10 26-12 42-6z" fill="#fff" opacity=".85"/><path d="M50 30v52" stroke="#5B3A50" stroke-width="3"/></symbol>
<symbol id="i-leaf" viewBox="0 0 100 100"><path d="M18 82C14 40 44 14 86 14c2 42-24 72-68 68z" fill="#fff"/><path d="M22 78L70 30" stroke="#5B3A50" stroke-width="4" stroke-linecap="round"/></symbol>
<symbol id="i-bubble" viewBox="0 0 100 100"><path d="M14 20h72a8 8 0 018 8v36a8 8 0 01-8 8H44L24 88V72H14a8 8 0 01-8-8V28a8 8 0 018-8z" fill="#fff"/><circle cx="32" cy="46" r="5" fill="#5B3A50"/><circle cx="50" cy="46" r="5" fill="#5B3A50"/><circle cx="68" cy="46" r="5" fill="#5B3A50"/></symbol>
<symbol id="i-bulb" viewBox="0 0 100 100"><circle cx="50" cy="40" r="26" fill="#fff"/><rect x="38" y="62" width="24" height="18" rx="4" fill="#5B3A50"/><path d="M50 4v-4M86 40h6M8 40h6M76 14l4-4M24 14l-4-4" stroke="#fff" stroke-width="5" stroke-linecap="round"/></symbol>
<symbol id="i-music" viewBox="0 0 100 100"><path d="M38 70V22l44-10v48" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><ellipse cx="28" cy="72" rx="13" ry="10" fill="#fff"/><ellipse cx="72" cy="62" rx="13" ry="10" fill="#fff"/></symbol>
<symbol id="i-heart" viewBox="0 0 100 100"><path d="M50 86C10 60 4 38 16 24c10-12 28-10 34 6 6-16 24-18 34-6 12 14 6 36-34 62z" fill="#fff"/></symbol>
<symbol id="i-fb" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z"/></symbol>
<symbol id="i-ig" viewBox="0 0 24 24"><path fill="currentColor" d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zM17.3 5.5a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4zM12 2.2c-2.7 0-3 0-4 .1-3.6.2-5.5 2-5.7 5.7-.1 1-.1 1.3-.1 4s0 3 .1 4c.2 3.6 2 5.5 5.7 5.7 1 .1 1.3.1 4 .1s3 0 4-.1c3.6-.2 5.5-2 5.7-5.7.1-1 .1-1.3.1-4s0-3-.1-4c-.2-3.6-2-5.5-5.7-5.7-1-.1-1.3-.1-4-.1zm0 1.8c2.6 0 2.9 0 4 .1 2.6.1 3.8 1.4 3.9 3.9.1 1 .1 1.3.1 3.9s0 2.9-.1 3.9c-.1 2.6-1.3 3.8-3.9 3.9-1 .1-1.3.1-4 .1s-2.9 0-3.9-.1c-2.6-.1-3.8-1.3-3.9-3.9-.1-1-.1-1.3-.1-3.9s0-2.9.1-3.9C4.2 5.5 5.4 4.2 8 4.1c1-.1 1.3-.1 4-.1z"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M15.5 15.5L21 21" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol>
<symbol id="i-burger" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol>
<symbol id="blob" viewBox="0 0 100 100"><path d="M52 3c20 0 40 12 44 32 5 22-4 44-22 55-17 10-41 9-57-4C2 74-1 52 5 35 11 17 32 3 52 3z"/></symbol>
</svg>'''

ICON_FOR={'make':'i-brush','questions':'i-planet','mind':'i-leaf','world':'i-bubble','rwl':'i-book','voice':'i-heart'}

def thumb(cat,icon=None):
    return f'<div class="thumb c-{cat}"><svg aria-hidden="true"><use href="#{icon or ICON_FOR[cat]}"/></svg></div>'

def cover():
    # placeholder magazine cover (CSS/SVG only)
    return '''<svg viewBox="0 0 120 160" aria-hidden="true" style="width:100%;height:100%;display:block"><rect width="120" height="160" fill="#B5E3E0"/><rect y="118" width="120" height="42" fill="#FBE7B0"/><circle cx="60" cy="88" r="30" fill="#F8C8D5"/><circle cx="60" cy="76" r="12" fill="#FCD9C0"/><path d="M36 112c4-18 44-18 48 0z" fill="#DCD0F2"/><text x="8" y="26" font-family="Kaushan Script,cursive" font-size="22" fill="#B4436C">rebel</text><text x="66" y="26" font-family="Lora,serif" font-size="20" fill="#5B3A50">la</text><text x="8" y="136" font-family="Gochi Hand,cursive" font-size="9" fill="#5B3A50">ISSUE 01 · EXAMPLE</text><path d="M96 40l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" fill="#E9C25A"/></svg>'''

import re, html as _html, zlib
from _articles import ARTICLES
# Rebel quotes (Moxie zine refresh, Oct 2026): ONE data file, js/quotes.js, shared with the browser.
QUOTES=json.loads(open(os.path.join(OUT,'js','quotes.js')).read().split('window.REBELLA_QUOTES =',1)[1].strip().rstrip(';'))
def rebel_quote(seed):
    """Cut-out paper quote card. Pre-rendered (stable per page+slot) so it's never blank without JS;
    js/quotes-render.js swaps in a random quote on every page load."""
    q=QUOTES[zlib.crc32(seed.encode())%len(QUOTES)]
    e=lambda t:_html.escape(t,quote=True)
    return (f'<aside class="rebel-quote" data-rebel-quote aria-label="Rebel quote"><figure class="rq-paper">'
            f'<blockquote class="rq-text" cite="{e(q["source"])}"><p>{e(q["quote"])}</p></blockquote>'
            f'<figcaption class="rq-cap"><span class="rq-person">{e(q["person"])}</span><span class="rq-who">{e(q["who"])}</span>'
            f'<a class="rq-src" href="{e(q["source"])}" rel="noopener">Source: {e(q["context"])}</a></figcaption></figure></aside>')
TEAR=''  # torn dividers removed Oct 2026 (neat content); kept as a no-op so the generator interface is unchanged
def ransom(text):
    """Was cut-out letters; now plain, tidy heading text (Bonnie asked for neat content, Oct 2026). Kept for interface compatibility."""
    return _html.escape(_html.unescape(text))
# Items approved on the moderation dashboard (written by /workspace/rebella-pipeline/publish.py). Newest first.
_PJ=os.path.join(OUT,'_pipeline_articles.json')
PIPE=json.load(open(_PJ)) if os.path.exists(_PJ) else []
ARTICLES=PIPE+[a for a in ARTICLES if a['slug'] not in {p['slug'] for p in PIPE}]
SITE='https://edgerequals.github.io/rebella/'
UPDATED='2026-10-23'
MUSIC_SECTION=True  # Music section: everything lives in music/. Set False (or delete music/ and the 'if MUSIC_SECTION' line below) to remove it. See music/REMOVE.md
CATNAME=dict(CATS)
CAT_INFO={
 'make':('Crafts, DIY, art and cooking: learn by doing, mess allowed.','Make It: crafts, DIY projects, art and easy recipes for teens on Rebella.'),
 'questions':('Space, science and the "wait, why?" questions about how the world works.','Big Questions: space, science and curious questions explained for teens on Rebella.'),
 'mind':('Feeling good, sleeping well and looking after yourself, inside and out.','Mind & Body: wind-downs, stretches and feel-good ideas for teens, with links to real support.'),
 'world':('Friends, family, money and getting along online and off.','Your World: friendships, family, money and staying kind online, for teens on Rebella.'),
 'rwl':('Books, shows and music worth your time.','Read Watch Listen: book lists and picks for teens on Rebella.'),
 'voice':('Speak up, start something, make something and share it.','Your Voice: start something, make something, and how sharing with Rebella will work.'),
}
KEYWORDS='learn what you love, fun websites for teens, educational and cool sites for girls, online magazine for teen girls, teen magazine Australia, Rebella'
def esc(s): return _html.escape(_html.unescape(s), quote=True)
def strip(s): return _html.unescape(re.sub('<[^>]+>','',s))

from _bars import bonnies_logo  # Bonnie's logo (img/bonnies-logo.svg), phone menu spot
WORDMARK='<a class="wordmark bl-wordmark" href="index.html" aria-label="Rebella home">'+bonnies_logo('bl-drawer',label=None,w=106,h=42)+'</a>'
def catlink(k): return f'category-{k}.html'
from _bars import split_bars
BARS_HEAD,BARS_FOOT=split_bars('visitor')  # shared with Bonnie's Dashboard; audience switch in _bars.py

def header(active=None):
    cur=lambda k: ' aria-current="page"' if active==k else ''
    items=''.join(f'<li class="c-{k}"><a class="navlink" href="{catlink(k)}"{cur(k)}>{n}</a></li>' for k,n in CATS)
    ditems=''.join(f'<li class="c-{k}"><a href="{catlink(k)}">{n}</a></li>' for k,n in CATS)
    return f'''{ICONS}
{BARS_HEAD}
<nav class="mainnav" aria-label="Main"><div class="container">
  <button class="icon-btn burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><svg><use href="#i-burger"/></svg></button>
  <ul class="menu">{items}</ul>
  <div class="nav-right">
    <!-- Create and Picks links removed from the header nav (Danny, 24 Oct 2026); the pages stay, reachable from the phone menu, footer and page bodies -->
    <a class="social" href="#follow" aria-label="Facebook (placeholder)"><svg><use href="#i-fb"/></svg></a>
    <a class="social" href="#follow" aria-label="Instagram (placeholder)"><svg><use href="#i-ig"/></svg></a>
    <a class="sub-link" href="#newsletter">Join</a>
    <button class="icon-btn" id="search-btn" aria-label="Search" aria-expanded="false" aria-controls="searchbar"><svg><use href="#i-search"/></svg></button>
  </div>
</div>
<div class="searchbar" id="searchbar"><div class="container"><form data-demo role="search"><label class="sr-only" for="q">Search Rebella</label><input id="q" type="search" placeholder="Search for something you're curious about…"><button class="btn btn-info dots-aqua" type="submit">Search</button></form></div></div>
</nav>
<div class="overlay" id="overlay" data-close-drawer></div>
<nav class="drawer" id="drawer" aria-label="Mobile menu" aria-hidden="true">
  <button class="icon-btn close" data-close-drawer aria-label="Close menu"><svg><use href="#i-close"/></svg></button>
  {WORDMARK}
  <ul><li class="c-create"><a href="create.html">&#10024; Create a board</a></li><li class="c-create"><a href="recommendations.html">&#9733; Recommendations</a></li>{ditems}<li><a href="category.html">All articles</a></li></ul>
  <div class="drawer-sub"><a class="btn btn-primary dots-brick" href="#newsletter">Join the newsletter</a><a class="btn btn-secondary dots-mustard" href="#join">Get the magazine</a></div>
</nav>'''

FOOTER=f'''<section class="site-end" aria-label="More from Rebella">
  <section class="join-band" id="join"><div class="container">
    <div class="cover">{cover()}</div>
    <div class="copy"><h3>Rebella in print</h3><p><span class="example">Example copy</span> A quarterly mag of make-it projects, big questions and real stories, posted to your door.</p>
      <div class="btns"><a class="btn btn-primary dots-brick" href="#">Subscribe</a><a class="btn btn-secondary dots-mustard" href="#">Latest issue</a></div></div>
  </div></section>
  <div class="strip"><a href="submit.html">Got something to share? How Your Voice will work &rarr;</a></div>
  <div class="footer-dark"><div class="container">
    <div class="footer-cols">
      <div><h6>Rebella</h6><ul><li><a href="index.html">Home</a></li><li><a href="recommendations.html">Recommendations</a></li><li><a href="category.html">All articles</a></li><li><a href="create.html">Create a board</a></li><li><a href="submit.html">Submit your work</a></li><li><a href="credits.html">Photo credits</a></li></ul></div>
      <div><h6>Explore</h6><ul>{''.join(f'<li><a href="{catlink(k)}">{n}</a></li>' for k,n in CATS)}</ul></div>
      <div><h6>Help &amp; safety</h6><ul><li><a href="https://au.reachout.com/" rel="noopener">ReachOut</a></li><li><a href="https://kidshelpline.com.au/" rel="noopener">Kids Helpline 1800 55 1800</a></li><li><a href="https://headspace.org.au/" rel="noopener">headspace</a></li><li><a href="https://www.esafety.gov.au/young-people" rel="noopener">eSafety: staying safe online</a></li></ul></div>
    </div>
    <p class="legal">&copy; 2026 Rebella. A safe, fun place for teens to learn what you love. <a href="credits.html">Photo credits</a></p>
    <p class="legal photo-note">Photos are CC0 / public domain (Wikimedia Commons, NASA, museum open access), credited on the <a href="credits.html">credits page</a>. Stickers are original Rebella artwork.</p>
  </div></div>
</section>
{BARS_FOOT}'''

URLATTR=re.compile(r'((?:href|src)=")(?!https?:|#|/|mailto:|tel:|data:|\.\./)([^"]*)"')
def page(path,title,body,desc,active=None,extra_head='',og_img='img/articles/moon.jpg',og_type='website',canonical=None,keywords=KEYWORDS,head_more=''):
    canon=canonical if (canonical or '').startswith('http') else SITE+(canonical if canonical is not None else ('' if path=='index.html' else path))
    out=f'''<!doctype html>
<html lang="en-AU" class="unlocked">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{esc(desc)}">
<meta name="keywords" content="{esc(keywords)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="{canon}">
<meta property="og:site_name" content="Rebella">
<meta property="og:locale" content="en_AU">
<meta property="og:type" content="{og_type}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="{SITE}{og_img}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(desc)}">
<meta name="twitter:image" content="{SITE}{og_img}">{head_more}
<meta name="referrer" content="no-referrer">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,300;0,400;0,700;1,400&family=Gochi+Hand&family=Kaushan+Script&family=Lora:wght@500&family=Special+Elite&display=swap">
<link rel="stylesheet" href="css/styles.css?v=8">
<link rel="stylesheet" href="css/zine.css?v=5">
<link rel="stylesheet" href="css/bars.css?v=6">
<link rel="stylesheet" href="music/youtube/bonnie-radio.css?v=2">
<script src="js/main.js?v=3"></script>
<script src="js/ratio-pump.js?v=3" data-site="rebella" data-freq="0.75"></script>
<script src="js/bars.js?v=4" defer></script>
<script src="music/youtube/stations.js?v=2" defer></script>
<script src="music/youtube/bonnie-radio.js?v=3" defer></script>
<script src="js/help-orb.js?v=5" defer></script>
<script src="js/help-init.js?v=1" defer></script>
<script src="js/nav.js?v=3" defer></script>
<script src="js/quotes.js" defer></script>
<script src="js/quotes-render.js" defer></script>{extra_head}
</head>
<body class="zine">
<a class="skip" href="#main">Skip to content</a>
<a class="escape" href="index.html" data-escape aria-label="Emergency stop: leave this page now and go to the Rebella homepage">
  <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 2h18l13 13v18L33 46H15L2 33V15z" fill="#fff"/><path d="M16.5 6h15L42 16.5v15L31.5 42h-15L6 31.5v-15z" fill="#B23A35"/><rect x="13" y="20.5" width="22" height="7" rx="3.5" fill="#fff"/></svg>
  <span class="label"><strong>Get me out</strong><small>Tap to go Home</small></span>
</a>
<div id="site">
{header(active)}
{body}
{FOOTER}
</div>
</body>
</html>
'''
    depth=path.count('/')
    if depth:
        pre='../'*depth
        out=URLATTR.sub(lambda m: m.group(1)+pre+m.group(2)+'"', out)
    return out

def photo(name,cls='photo',eager=False):
    c=CRED['img/articles/'+name+'.jpg']
    return f'<img class="{cls}" src="{c["file"]}" alt="{c["alt"]}" width="{c["w"]}" height="{c["h"]}"{"" if eager else " loading=\"lazy\""} decoding="async">'

BY={a['slug']:a for a in ARTICLES}
def ahref(a): return f'articles/{a["slug"]}.html'
def card(slug):
    a=BY[slug]; k=a['cat']; cn=CATNAME[k]
    return f'''<article class="card c-{k}">
  <figure class="thumb-link">{photo(a["img"])}<span class="band" aria-hidden="true">{cn}</span><span class="view" aria-hidden="true">Read it</span></figure>
  <div class="text"><a class="tag" href="{catlink(k)}">{cn}</a><h3><a href="{ahref(a)}">{a["title"]}</a></h3><p>{a["excerpt"]}</p></div>
</article>'''

HERO_ART=open(os.path.join(OUT,'_hero_art.svg')).read() if os.path.exists(os.path.join(OUT,'_hero_art.svg')) else ''

def pillars():
    return '<section class="pillars container" aria-label="Explore by interest"><ul>'+''.join(
        f'<li class="c-{k}"><a href="{catlink(k)}"><svg aria-hidden="true"><use href="#blob"/></svg><span>{n}</span></a></li>' for k,n in CATS)+'</ul></section>'

def sidebar(first=True):
    issue=f'''<section class="widget"><div class="issue-box dots-mustard"><h4>Current issue</h4><div class="cover">{cover()}</div>
      <div class="issue-btns"><a class="btn btn-primary" href="#join">Subscribe</a><a class="btn btn-info" href="#join">View issue</a></div></div>
      <p class="issue-note">Example copy. Print edition placeholder.</p></section>'''
    house='''<section class="widget sticky-widget"><div class="house-ad dots-brick"><h5>Your Voice</h5><p>Write it, draw it, film it. Soon you'll be able to share what you're proud of, safely, with every piece checked by an adult editor.</p><a class="btn btn-primary dots-brick btn-block" href="submit.html">How it will work</a></div></section>'''
    nl='''<section class="widget nl-widget"><h5>Join our newsletter</h5><form data-demo><label class="sr-only" for="sn1">First name</label><input class="field dots-mustard" id="sn1" placeholder="First name"><label class="sr-only" for="se1">Email</label><input class="field dots-mustard" id="se1" type="email" placeholder="Email"><button class="btn btn-secondary dots-mustard btn-block">Sign up</button><p class="form-msg" role="status"></p></form></section>'''
    recs='''<section class="widget"><div class="house-ad recs-ad dots-mustard"><h5>&#9733; Recommendations</h5><p>Song of the week, quote of the week, a goal for everyone and more picks.</p><a class="btn btn-secondary dots-mustard btn-block" href="recommendations.html">See the picks</a></div></section>'''
    return f'<aside class="sidebar">{issue if first else nl}{recs}{house}</aside>'

CREATE_PROMO='''<section class="create-promo container" aria-labelledby="cp-title"><div class="cp-inner dots-brick">
  <div class="cp-stickers" aria-hidden="true"><img src="img/stickers/word-dream-big.svg" alt="" class="s1"><img src="img/stickers/flower-peach.svg" alt="" class="s2"><img src="img/stickers/washi-mint-stripes.svg" alt="" class="s3"><img src="img/stickers/star-butter.svg" alt="" class="s4"><img src="img/library/tulips.jpg" alt="" class="p1"><img src="img/library/hot-air-balloon.jpg" alt="" class="p2"></div>
  <div class="cp-copy"><h2 id="cp-title" class="hand">Make a mood board</h2><p>Mood boards, collages and vision boards: drag in stickers and photos, add your own words, then save it as a picture.</p><a class="btn btn-primary dots-brick" href="create.html">Start creating</a></div>
</div></section>'''

NEWSLETTER='''<section class="newsletter container" id="newsletter"><h2>Join our newsletter</h2>
<p>One email a fortnight with new projects, big questions and reader stories. <span class="example">Example copy</span></p>
<form data-demo><div class="row"><div><label class="sr-only" for="nf">First name</label><input class="field" id="nf" placeholder="First name"></div><div><label class="sr-only" for="ne">Email</label><input class="field" id="ne" type="email" placeholder="Email"></div></div>
<div class="radios"><fieldset><legend>Location:</legend><label><input type="radio" name="loc" checked> AU</label><label><input type="radio" name="loc"> NZ</label><label><input type="radio" name="loc"> Other</label></fieldset></div>
<button class="btn btn-secondary dots-mustard btn-block">Sign up</button><p class="form-msg" role="status"></p>
<small>Example form: no data is collected in this prototype. Real version needs parent/guardian consent wording for under-16s.</small></form></section>'''

FOLLOW='<section class="follow container" id="follow"><h2>Follow us</h2><p class="motto">Be curious. Be bold. Be you.</p><div class="icons"><a href="#" aria-label="Facebook (placeholder)"><svg><use href="#i-fb"/></svg></a><a href="#" aria-label="Instagram (placeholder)"><svg><use href="#i-ig"/></svg></a></div><div class="tiles" aria-label="Photo tiles">'+''.join(
    f'<img class="tile" src="{CRED[f]["file"]}" alt="{CRED[f]["alt"]}" loading="lazy" decoding="async" width="{CRED[f]["w"]}" height="{CRED[f]["h"]}">' for f in ['img/library/'+n+'.jpg' for n in ['sunflower','pink-cupcakes','night-sky','kitten-daisies','watercolours','tulips','hot-air-balloon','bookshop','strawberries','great-wave']])+'</div></section>'

# Bonnie's About me (approved 23 Oct 2026). Same text as about.note in js/recs.js (Picks page): keep both in sync.
ABOUT_ME=["Hello!!", "My name is Bonnie and I created this website!", "I play soccer, and I love camping and swimming at the beach (even though I'm deathly scared of sharks!!). I paint, and I play the viola, the guitar and a range of other instruments.", "I'm a proud Aussie girl!! I love learning about nutrition, herbal medicines and botany, and I adore everlasting flowers!", "I hope you have a wonderful day. Sending you all love xx", "Be brave. Be different. Be a rebel."]
ABOUT_CARD='<section class="container about-home" aria-labelledby="about-home-title"><div class="about-me about-card c-world"><h2 id="about-home-title">About me <span class="about-by">by Bonnie</span></h2><div class="rec-body">'+''.join(f'<p>{_html.escape(l)}</p>' for l in ABOUT_ME)+'</div></div></section>'
HOME_FIRST=[p['slug'] for p in PIPE[:3]]+['t-shirt-tote-bag','why-is-the-sky-blue','five-minute-wind-down','start-a-coding-club','six-adventure-books']
HOME_LATER=['talk-money-with-your-family','no-bake-oat-cookies','living-on-mars','desk-stretches','group-chat-drama']
moon=BY['moon-garden']
import sys as _sys; _sys.path.insert(0, os.path.join(OUT,'music','youtube')); import _yt_music  # Bonnie's radio (YouTube): music/youtube/
_yt_music.build(); BONNIE_RADIO=_yt_music.section()
home=f'''<main id="main">
<section class="site-intro container">
  <h1 class="hand ransom-h">{ransom("Learn what you love.")}</h1>
  <div class="creator-note" aria-label="A note from Rebella's creator">
    <p class="cn-hi">Hi all!!</p>
    <p>My name is Bonnie and I am the creator of this website. I made Rebella for teenage girls (older are always welcome!) to feel welcome and safe online, to have a platform to express yourself and learn the things you want to, not the things that everyone else wants you to learn at school. I hope that this site helps you realise that the world is waiting for you. And that nobody else can replicate the wonders that you might bring to it.</p>
    <p class="cn-motto">Be brave. Be different. Be a rebel.</p>
    <p class="cn-sign">Live it up sis.</p>
  </div>
</section>
{BONNIE_RADIO}
<section class="hero container c-questions">
  <a class="hero-art" href="{ahref(moon)}" aria-label="Read the featured post: {moon['title']}">{HERO_ART}</a>
  <div class="hero-text"><span class="cat-chip kicker">Featured · Big Questions</span><h2 class="dots-aqua">{moon['title']}</h2><a class="btn dots-aqua" href="{ahref(moon)}">Read it</a></div>
</section>
<div class="container feed-wrap">
  <div class="feed"><h2 class="section-title">Fresh this week</h2>
  {''.join(card(s) for s in HOME_FIRST[:3])}
  {rebel_quote('index-1')}
  {''.join(card(s) for s in HOME_FIRST[3:])}
  <h2 class="featured-title">Featured</h2>
  {card('reader-art-wall-home')}
  </div>
  {sidebar(True)}
</div>
{ABOUT_CARD}
{TEAR}
{pillars()}
<div class="container quote-row">{rebel_quote('index-2')}</div>
{CREATE_PROMO}
{TEAR}
<div class="container feed-wrap">
  <div class="feed">{''.join(card(s) for s in HOME_LATER[:2])}
  {rebel_quote('index-3')}
  {''.join(card(s) for s in HOME_LATER[2:])}
  <p class="all-link"><a class="btn btn-info dots-aqua" href="category.html">See all articles</a></p></div>
  {sidebar(False)}
</div>
{TEAR}
{FOLLOW}
{NEWSLETTER}
</main>'''

def cat_page(k):
    lead,_=CAT_INFO[k]
    posts=[a for a in ARTICLES if a['cat']==k]
    return f'''<main id="main" class="c-{k}">
<header class="page-header container"><span class="cat-chip">Section</span><h1 class="page-title ransom-h">{ransom(CATNAME[k])}</h1><p class="lead-banner">{lead}</p></header>
<div class="container feed-wrap">
  <div class="feed">{''.join(card(a['slug']) for a in posts[:2])}
  {rebel_quote('cat-'+k+'-1')}
  {''.join(card(a['slug']) for a in posts[2:])}
  {rebel_quote('cat-'+k+'-2') if len(posts)>3 else ''}
  <p class="all-link"><a class="btn btn-info dots-aqua" href="category.html">See all articles</a></p></div>
  {sidebar(True)}
</div>
</main>'''

def all_page():
    secs=''.join((rebel_quote('all-'+k) if i in (2,4) else '')+f'<section class="all-section c-{k}" aria-labelledby="sec-{k}"><h2 id="sec-{k}" class="section-title"><a href="{catlink(k)}">{n}</a></h2>{"".join(card(a["slug"]) for a in ARTICLES if a["cat"]==k)}</section>' for i,(k,n) in enumerate(CATS))
    return f'''<main id="main" class="c-voice">
<header class="page-header container"><span class="cat-chip">Explore</span><h1 class="page-title">All articles</h1><p class="lead-banner">Every Rebella article, sorted by section. Pick something you love and dive in.</p></header>
<div class="container feed-wrap">
  <div class="feed">{secs}</div>
  {sidebar(True)}
</div>
</main>'''

SUPPORT='''<aside class="support-box" aria-labelledby="support-title"><h2 id="support-title">Need to talk? You're not alone.</h2>
<p>Talk to a parent, carer, teacher or school counsellor, or contact one of these free Australian services. Rebella isn't a medical service and can't give medical advice.</p>
<ul><li><a href="https://au.reachout.com/" rel="noopener"><strong>ReachOut</strong></a>: online support, tips and stories for young people</li>
<li><a href="https://kidshelpline.com.au/" rel="noopener"><strong>Kids Helpline</strong></a>: call <a href="tel:1800551800">1800 55 1800</a> any time, for any reason, or chat online</li>
<li><a href="https://headspace.org.au/" rel="noopener"><strong>headspace</strong></a>: mental health support for 12 to 25 year olds, online and in centres</li></ul>
<p class="small">If you or someone else is in danger right now, call 000.</p></aside>'''

def related(a):
    same=[x for x in ARTICLES if x['cat']==a['cat'] and x is not a]
    others=[x for x in ARTICLES if x['cat']!=a['cat']]
    i=ARTICLES.index(a)
    others=others[i%len(others):]+others[:i%len(others)]
    picks=(same+others)[:3]
    lis=''.join(f'<li class="c-{x["cat"]}"><a href="{ahref(x)}"><span class="rel-cat">{CATNAME[x["cat"]]}</span>{x["title"]}</a></li>' for x in picks)
    return f'<nav class="related" aria-label="Related articles"><h2>Keep reading</h2><ul>{lis}</ul><p class="back-links"><a href="{catlink(a["cat"])}">&larr; More from {CATNAME[a["cat"]]}</a><a href="category.html">All articles</a><a href="index.html">Home</a></p></nav>'

def article_page(a):
    k=a['cat']; c=CRED['img/articles/'+a['img']+'.jpg']
    return f'''<main id="main" class="c-{k}">
<div class="container">
<p class="crumbs"><a href="index.html">Home</a> / <a href="{catlink(k)}">{CATNAME[k]}</a></p>
<h1 class="entry-title">{a["title"]}</h1>
<div class="feed-wrap">
  <article class="feed entry">
    <div class="meta"><span class="date">{a.get('date_label','23 October 2026')}</span><a class="cat cat-chip" href="{catlink(k)}">{CATNAME[k]}</a></div>
    <figure class="feature-art">{photo(a["img"],'photo',True)}<span class="band">{CATNAME[k]}</span><figcaption class="photo-credit">Photo: {c['artist']}, {c['licLabel'].split(' (')[0]}, via <a href="{c['page']}" rel="noopener">{c.get('via','Wikimedia Commons')}</a></figcaption></figure>
    <p class="lead">{a["lead"]}</p>
    {a["body"]}
    {rebel_quote('art-'+a['slug'])}
    {SUPPORT if a.get('support') else ''}
    <hr>
    <div class="author-box"><div class="avatar">{thumb('voice','i-star')}</div><div>{a.get('author_box') or "<strong>Written by the Rebella team</strong><br><small>Spotted a mistake? We check our facts, and we'll fix it.</small>"}</div></div>
    {related(a)}
  </article>
  {sidebar(True)}
</div>
</div>
</main>'''

def article_jsonld(a):
    import json as _j
    d={"@context":"https://schema.org","@type":"Article","headline":strip(a['title']),"description":strip(a['desc']),"image":SITE+'img/articles/'+a['img']+'.jpg',
       "datePublished":UPDATED,"author":{"@type":"Organization","name":a.get('author_name','Rebella')},"publisher":{"@type":"Organization","name":"Rebella"},"mainEntityOfPage":SITE+ahref(a),"inLanguage":"en-AU"}
    return '\n<script type="application/ld+json">'+_j.dumps(d,ensure_ascii=False)+'</script>'

MOVED=f'''<main id="main" class="c-questions"><div class="container moved">
<h1 class="entry-title">This page has moved</h1>
<p>Rebella now has a page for every article. Looking for <strong>{moon["title"]}</strong>? <a href="{ahref(moon)}">Read it here</a>, or <a href="category.html">browse all articles</a>.</p>
</div></main>'''

SUBMIT='''<main id="main" class="c-voice"><div class="container">
<header class="page-header"><span class="cat-chip">Your Voice</span><h1 class="page-title">Share your work</h1><p class="lead-banner">Write it, draw it, make it. Sharing is coming soon.</p></header>
<div class="feed-wrap"><article class="feed entry">
<p class="lead">We can't wait to see what you make. Sending work to Rebella isn't open yet, because we're setting it up carefully so it's safe for everyone.</p>
<h2>How it will work</h2><ul>
<li>A parent or carer will need to say it's okay before you send anything.</li>
<li>An adult editor checks and approves every piece before it appears on the site.</li>
<li>We'll only ever show a first name or a made-up creator name. Never your full name, school, suburb or photos of your face.</li>
<li>No comments, no likes, no follower counts. Just good work to enjoy.</li></ul>
<h2>Get making now</h2><p>Our first art wall theme is "Home". Read the <a href="articles/reader-art-wall-home.html">art wall ideas</a>, try a <a href="articles/make-a-zine.html">mini zine</a> or start a <a href="articles/sketchbook-habit.html">sketchbook habit</a>, or make a mood board on the <a href="create.html">Create page</a>.</p>
<h2>Keep yourself safe</h2><p>Before you share anything anywhere, check it doesn't show your address, school uniform or logo, street signs, your house number or anyone who hasn't said it's okay to be in it.</p>
</article>'''+'''{SIDEBAR}</div></div></main>'''

RECS_BODY='''<main id="main" class="recs-page c-rwl"><div class="container">
<header class="page-header"><span class="cat-chip">&#9733; Picks</span><h1 class="page-title">Recommendations</h1><p class="lead-banner">Cool things worth sharing: a song, someone rightfully famous, a quote, a goal and more.</p></header>
<p class="recs-updated" id="recs-updated"></p>
<div class="recs-grid" id="recs">
  <section class="rec c-rwl" data-rec="song"><h2><span aria-hidden="true">&#9835;</span> Song of the week</h2><div class="rec-body"><p class="placeholder"><span class="ph-chip">Placeholder</span> Her first picks are coming soon.</p></div></section>
  <section class="rec c-voice" data-rec="celebrity"><h2><span aria-hidden="true">&#9829;</span> Rightfully Famous</h2><div class="rec-body"><p class="placeholder"><span class="ph-chip">Placeholder</span> Her first picks are coming soon.</p></div></section>
  <section class="rec c-questions" data-rec="quote"><h2><span aria-hidden="true">&#10077;</span> Quote of the week</h2><div class="rec-body"><p class="placeholder"><span class="ph-chip">Placeholder</span> Her first picks are coming soon.</p></div></section>
  <section class="rec c-mind" data-rec="goal"><h2><span aria-hidden="true">&#10003;</span> Goal for everyone</h2><div class="rec-body"><p class="placeholder"><span class="ph-chip">Placeholder</span> Her first picks are coming soon.</p></div></section>
  <section class="rec rec-wide c-make" data-rec="other"><h2><span aria-hidden="true">&#10024;</span> Other picks: anything else I recommend</h2><div class="rec-body"><p class="placeholder"><span class="ph-chip">Placeholder</span> Her first picks are coming soon.</p></div></section>
</div>
<section class="about-me c-world" id="about-me" aria-labelledby="about-title"><h2 id="about-title">About me <span class="about-by">by Bonnie</span></h2><div class="rec-body">{ABOUT_P}</div></section>
<noscript><p class="recs-note">Turn on JavaScript to see this week's picks.</p></noscript>
<p class="recs-note">Song and video picks are links to other sites, so ask a parent or carer before you open them. Rebella doesn't host any music.</p>
</div></main>'''

CREATE_BODY=open(os.path.join(OUT,'_create_body.html')).read()

def text_credits():
    if not PIPE: return ''
    rows=''.join(f'<tr><td><a href="articles/{a["slug"]}.html">{a["title"]}</a></td><td><a href="{a["source"]["url"]}" rel="noopener">{esc(a["source"]["name"])}</a></td><td><a href="{a["source"]["licence_url"]}" rel="noopener license">{esc(a["source"]["licence"])}</a></td><td>{a["source"].get("approved","")}</td></tr>' for a in PIPE)
    return f'<h2>Republished and adapted articles</h2><p>These pages reuse text, video or images under their own licence, credited on each page. Each one was approved by a Rebella editor before it went live.</p><div class="table-wrap"><table><thead><tr><th scope="col">Page</th><th scope="col">Source</th><th scope="col">Licence</th><th scope="col">Approved</th></tr></thead><tbody>{rows}</tbody></table></div>'

def credits_page():
    rows=lambda g: ''.join(f'<tr><td><img src="{c["file"]}" alt="" loading="lazy" width="80" height="{round(80*c["h"]/c["w"])}"></td><td>{c["alt"]}</td><td>{c["artist"]}</td><td>{c["licLabel"]}</td><td><a href="{c["page"]}" rel="noopener">{c["title"].replace("File:","")}</a></td></tr>' for c in CREDITS if c['group']==g)
    head='<thead><tr><th scope="col"><span class="sr-only">Preview</span></th><th scope="col">What it shows</th><th scope="col">Author</th><th scope="col">Licence</th><th scope="col">Source</th></tr></thead>'
    return f'''<main id="main" class="credits container">
<h1 class="entry-title">Photo credits</h1>
<p>Every photo on Rebella comes from <strong>Wikimedia Commons</strong>, <strong>NASA</strong> or a museum's open-access collection, and is marked <strong>CC0</strong> or <strong>public domain</strong> at its source, so it can be reused, changed and shared freely (including in boards you make and download). Credit isn't required, but we like to say thank you. Our stickers are original Rebella artwork.</p>
<h2>Article photos</h2><div class="table-wrap"><table>{head}<tbody>{rows('articles')}</tbody></table></div>
{text_credits()}
<h2>Create page photo library</h2><div class="table-wrap"><table>{head}<tbody>{rows('library')}</tbody></table></div>
</main>'''

HOME_JSONLD='\n<script type="application/ld+json">'+json.dumps({"@context":"https://schema.org","@type":"WebSite","name":"Rebella","alternateName":"Rebella: learn what you love","url":SITE,"description":"Rebella is an online magazine for teen girls: learn what you love with make-it projects, big questions, books and real advice.","inLanguage":"en-AU"})+'</script>'

PAGES=[]  # (path, title, body, desc, active, extra, og_img, og_type, canonical, keywords, head_more, in_sitemap, priority)
PAGES.append(('index.html','Rebella | Learn what you love: fun websites for teens',home,
  "Learn what you love with Rebella, an online magazine for teen girls. Make-it projects, big questions, books and real advice: one of the fun websites for teens, and one of the educational and cool sites for girls.",
  None,'','img/articles/moon.jpg','website',None,KEYWORDS,HOME_JSONLD,True,'1.0'))
PAGES.append(('category.html','All articles | Rebella',all_page(),'Every Rebella article in one place: crafts, science, books, friendships and feel-good ideas for teens who want to learn what they love.','all','','img/articles/pencils.jpg','website',None,KEYWORDS,'',True,'0.8'))
for k,n in CATS:
    first=[a for a in ARTICLES if a['cat']==k][0]
    PAGES.append((catlink(k),f'{n} | Rebella',cat_page(k),CAT_INFO[k][1],k,'','img/articles/'+first['img']+'.jpg','website',None,f'{strip(n)}, '+KEYWORDS,'',True,'0.7'))
for a in ARTICLES:
    PAGES.append((ahref(a),f'{a["title"]} | Rebella',article_page(a),a['desc'],a['cat'],'','img/articles/'+a['img']+'.jpg','article',a.get('canonical'),f'{strip(a["title"])}, {strip(CATNAME[a["cat"]])}, '+KEYWORDS,article_jsonld(a),True,'0.6'))
PAGES.append(('recommendations.html','Recommendations: song, quote and goal of the week | Rebella',RECS_BODY.replace('{ABOUT_P}',''.join(f'<p>{_html.escape(l)}</p>' for l in ABOUT_ME)),'Rebella Recommendations: song of the week, Rightfully Famous (someone famous for the right reasons), quote of the week, a goal for everyone and more picks.','recs','\n<script src="js/recs.js" defer></script>\n<script src="js/recs-render.js" defer></script>','img/articles/reading.jpg','website',None,'recommendations, song of the week, quote of the week, '+KEYWORDS,'',True,'0.7'))
PAGES.append(('submit.html','Share your work with Your Voice | Rebella',SUBMIT.replace('{SIDEBAR}',sidebar(False)),'How sharing your art, writing and projects with Rebella\'s Your Voice section will work, safely and with an adult editor checking everything.','voice','','img/articles/art-wall.jpg','website',None,KEYWORDS,'',True,'0.4'))
PAGES.append(('create.html','Create a mood board, collage or vision board | Rebella',CREATE_BODY,'Make mood boards, collages and vision boards with stickers and photos, add your own words, and save it as a picture. Free and private on Rebella.','create','\n<link rel="stylesheet" href="css/create.css">\n<script src="js/library.js" defer></script>\n<script src="js/create.js" defer></script>','img/library/tulips.jpg','website',None,'mood board maker, vision board, collage, '+KEYWORDS,'',True,'0.7'))
PAGES.append(('credits.html','Photo credits | Rebella',credits_page(),'Credits for the CC0 and public domain photos used on Rebella (Wikimedia Commons, NASA, museum open access) and for republished articles.',None,'','img/library/sunflower.jpg','website',None,KEYWORDS,'',True,'0.3'))
PAGES.append(('article.html','This page has moved | Rebella',MOVED,'This page has moved. Rebella now has a page for every article.',None,'','img/articles/moon.jpg','website',ahref(moon),KEYWORDS,f'\n<meta http-equiv="refresh" content="0; url={ahref(moon)}">',False,None))

from _cookies import COOKIES_BODY
PAGES.append(('cookies/index.html','Cookies and your device | Rebella',COOKIES_BODY,'What cookies are, how they differ from local storage, exactly what Rebella saves on your device (and never sends), and how to clear it.',None,'','img/articles/moon.jpg','website','cookies/',KEYWORDS,'',True,'0.3'))
os.makedirs(os.path.join(OUT,'cookies'),exist_ok=True)
if MUSIC_SECTION: from music._music import install; page=install(PAGES,page,globals())  # Music section hook (see music/REMOVE.md)
if MUSIC_SECTION and os.path.isdir(os.path.join(OUT,'music','playground')): from music.playground._playground import install as _pg; page=_pg(PAGES,page,globals())  # MUSIC PLAYGROUND hook (see music/playground/REMOVE.md)
os.makedirs(os.path.join(OUT,'articles'),exist_ok=True)
sm=[]
for path,t,b,d,act,x,img,typ,can,kw,hm,insm,pri in PAGES:
    open(os.path.join(OUT,path),'w').write(page(path,t,b,d,act,x,img,typ,can,kw,hm))
    if insm: sm.append(f'  <url><loc>{SITE}{"" if path=="index.html" else path.replace("index.html","")}</loc><lastmod>{UPDATED}</lastmod><priority>{pri}</priority></url>')
open(os.path.join(OUT,'sitemap.xml'),'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+'\n'.join(sm)+'\n</urlset>\n')
open(os.path.join(OUT,'robots.txt'),'w').write(f'User-agent: *\nDisallow: /rebella/moderation/\nDisallow: /moderation/\n\nSitemap: {SITE}sitemap.xml\n')
print('written',len(PAGES),'pages')
