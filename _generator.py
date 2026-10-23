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

WORDMARK='<a class="wordmark" href="index.html" aria-label="Rebella home"><span class="script">rebel</span><span class="serif">la</span><svg class="spark" aria-hidden="true"><use href="#i-sparkle"/></svg></a>'

def header(active=None):
    items=''.join(f'<li class="c-{k}"><a class="navlink" href="category.html"{" aria-current=\"page\"" if active==k else ""}>{n}</a></li>' for k,n in CATS)
    ditems=''.join(f'<li class="c-{k}"><a href="category.html">{n}</a></li>' for k,n in CATS)
    return f'''{ICONS}
<div class="topbar"><div class="container"><span class="tagline">Learn what you love.</span><button class="lock-site" type="button" data-lock aria-label="Lock Rebella">&#128274; Lock</button><nav aria-label="Utility"><a href="#newsletter">Newsletter</a><a href="article.html">Submit your work</a><a href="#follow">Instagram</a></nav></div></div>
<header class="masthead"><div class="container">
  {WORDMARK}
  <div class="head-promo"><div class="promo-text"><p>Get the print edition <span class="example">Example</span></p><a class="btn btn-primary dots-brick" href="#join">Find out more</a></div><a class="cover-thumb" href="#join" aria-label="Current issue (example cover)">{cover()}</a></div>
</div></header>
<nav class="mainnav" aria-label="Main"><div class="container">
  <button class="icon-btn burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><svg><use href="#i-burger"/></svg></button>
  <ul class="menu">{items}</ul>
  <div class="nav-right">
    <a class="create-pill" href="create.html"{" aria-current=\"page\"" if active=="create" else ""}><svg aria-hidden="true"><use href="#i-sparkle"/></svg>Create</a>
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
  <ul><li class="c-create"><a href="create.html">&#10024; Create a board</a></li>{ditems}</ul>
  <div class="drawer-sub"><a class="btn btn-primary dots-brick" href="#newsletter">Join the newsletter</a><a class="btn btn-secondary dots-mustard" href="#join">Get the magazine</a><button class="btn btn-secondary" type="button" data-lock>&#128274; Lock Rebella</button></div>
</nav>'''

FOOTER=f'''<footer>
  <section class="join-band" id="join"><div class="container">
    <div class="cover">{cover()}</div>
    <div class="copy"><h3>Rebella in print</h3><p><span class="example">Example copy</span> A quarterly mag of make-it projects, big questions and real stories, posted to your door.</p>
      <div class="btns"><a class="btn btn-primary dots-brick" href="#">Subscribe</a><a class="btn btn-secondary dots-mustard" href="#">Latest issue</a></div></div>
  </div></section>
  <div class="strip"><a href="article.html">Got something to share? Submit to Your Voice &rarr;</a></div>
  <div class="footer-dark"><div class="container">
    <div class="footer-cols">
      <div><h6>Rebella</h6><ul><li><a href="#">About</a></li><li><a href="#">Contact</a></li><li><a href="#">Community guidelines</a></li><li><a href="#">Submit your work</a></li><li><a href="create.html">Create a board</a></li><li><a href="credits.html">Photo credits</a></li></ul></div>
      <div><h6>Explore</h6><ul>{''.join(f'<li><a href="category.html">{n}</a></li>' for k,n in CATS)}</ul></div>
      <div><h6>Help &amp; safety</h6><ul><li><a href="#">Talk to someone (helplines)</a></li><li><a href="#">Staying safe online</a></li><li><a href="#">For parents &amp; carers</a></li><li><a href="#">Privacy</a></li></ul></div>
    </div>
    <p class="legal">&copy; 2026 Rebella. Prototype with example content only. <a href="#">Privacy</a> | <a href="#">Terms</a> | <a href="credits.html">Photo credits</a></p>
    <p class="legal photo-note">Photos are CC0 / public domain from Wikimedia Commons, credited on the <a href="credits.html">credits page</a>. Stickers are original Rebella artwork.</p>
  </div></div>
</footer>'''

GATE='''<section id="gate" class="gate" aria-labelledby="gate-title">
  <div class="gate-card dots-brick">
    <div class="wordmark" aria-label="Rebella"><span class="script">rebel</span><span class="serif">la</span></div>
    <p class="gate-kicker">Learn what you love.</p>
    <h1 id="gate-title" class="hand">Coming soon</h1>
    <p class="gate-intro">Rebella is private for now. Enter the passcode to come in.</p>
    <form id="gate-form" autocomplete="off">
      <label for="passcode" class="sr-only">Passcode</label>
      <input id="passcode" class="gate-field dots-mustard" type="password" autocomplete="current-password" placeholder="Passcode" required>
      <button class="btn btn-primary btn-block" type="submit">Come in</button>
      <p id="gate-msg" class="gate-msg" role="alert" aria-live="polite"></p>
    </form>
    <noscript><p class="gate-msg">Rebella needs JavaScript turned on to unlock.</p></noscript>
  </div>
</section>'''

def page(title,body,active=None,desc='Rebella prototype',extra_head=''):
    return f'''<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="noindex,nofollow">
<meta name="referrer" content="no-referrer">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,300;0,400;0,700;1,400&family=Gochi+Hand&family=Kaushan+Script&family=Lora:wght@500&display=swap">
<link rel="stylesheet" href="css/styles.css">
<style>html:not(.unlocked) #site{{display:none!important}}</style>
<script src="js/config.js"></script>
<script src="js/gate.js"></script>
<script src="js/main.js"></script>{extra_head}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<a class="escape" href="index.html" data-escape aria-label="Emergency stop: leave this page now and go to the Rebella homepage">
  <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 2h18l13 13v18L33 46H15L2 33V15z" fill="#fff"/><path d="M16.5 6h15L42 16.5v15L31.5 42h-15L6 31.5v-15z" fill="#B23A35"/><rect x="13" y="20.5" width="22" height="7" rx="3.5" fill="#fff"/></svg>
  <span class="label"><strong>Get me out</strong><small>Tap to go Home</small></span>
</a>
{GATE}
<div id="site" hidden>
{header(active)}
{body}
{FOOTER}
</div>
</body>
</html>
'''

POSTS=[
 ('make','Make It','Turn an old T-shirt into a tote bag in 20 minutes','No sewing machine needed: a pair of scissors, a few knots and you have a bag with a story.','tote-bag'),
 ('questions','Big Questions','Why is the sky blue (and sunsets orange)?','A tiny bit of physics explains one of the prettiest things you see every day.','sunset-sky'),
 ('mind','Mind &amp; Body','A five-minute wind-down for busy brains','Three simple steps to help you switch off before bed, without needing an app.','tea'),
 ('voice','Your Voice','"I started a coding club at lunch"','A reader shares how she found her people by building something from scratch.','code'),
 ('rwl','Read Watch Listen','Six books to read when you want an adventure','From quests to mysteries: picks chosen by readers your age.','reading'),
 ('world','Your World','How to talk money with your family','Pocket money, first jobs and saving up: conversation starters that don\'t feel awkward.','money-jar'),
 ('make','Make It','Easy no-bake cookies for a rainy afternoon','Five ingredients, one bowl and zero oven time.','cookies'),
 ('questions','Big Questions','What would it be like to live on Mars?','Air, food, gravity and the very long commute, explained.','mars'),
 ('mind','Mind &amp; Body','Stretches you can do at your desk','Loosen up your neck, shoulders and wrists between study sessions.','stretching'),
 ('world','Your World','Group chat drama? Try these three steps','How to step back, speak up or log off when chats get heated.','phone'),
]

def photo(name,cls='photo',eager=False):
    c=CRED['img/articles/'+name+'.jpg']
    return f'<img class="{cls}" src="{c["file"]}" alt="{c["alt"]}" width="{c["w"]}" height="{c["h"]}"{"" if eager else " loading=\"lazy\""} decoding="async">'

def card(p,href='article.html'):
    k,cn,t,ex,img=p
    return f'''<article class="card c-{k}">
  <figure class="thumb-link">{photo(img)}<span class="band" aria-hidden="true">{cn}</span><span class="view" aria-hidden="true">View post</span></figure>
  <div class="text"><a class="tag" href="category.html">{cn}</a><h3><a href="{href}">{t}</a></h3><p>{ex}</p></div>
</article>'''

HERO_ART='''<svg viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <circle cx="300" cy="250" r="170" fill="#FBE6A2"/><circle cx="250" cy="200" r="26" fill="#fff" opacity=".25"/><circle cx="360" cy="320" r="40" fill="#fff" opacity=".18"/>
  <ellipse cx="300" cy="260" rx="290" ry="60" fill="none" stroke="#F3A9BE" stroke-width="18" transform="rotate(-14 300 260)"/>
  <path d="M120 470c90-40 190-34 270 18v70H120z" fill="#B9A6E3"/>
  <path d="M520 520c60-30 140-30 200 0v40H520z" fill="#F3A9BE"/>
  <g transform="translate(560 330) rotate(-8)"><path d="M0 40c70-30 140-24 200 14v150c-60-38-130-44-200-14z" fill="#fff"/><path d="M400 40c-70-30-140-24-200 14v150c60-38 130-44 200-14z" fill="#FFF3E8"/><path d="M200 54v150" stroke="#5B3A50" stroke-width="5"/><path d="M40 90h120M40 120h110M40 150h90M240 90h120M240 120h110" stroke="#FCD5B5" stroke-width="8" stroke-linecap="round"/></g>
  <g transform="translate(980 90) rotate(32)"><rect width="40" height="300" rx="6" fill="#F3A9BE"/><rect y="250" width="40" height="34" fill="#FCD5B5"/><path d="M0 0l20-50 20 50z" fill="#FFF3E8"/><path d="M14-34l6-16 6 16z" fill="#5B3A50"/></g>
  <g fill="#fff"><path d="M640 90c4 28 14 38 42 42-28 4-38 14-42 42-4-28-14-38-42-42 28-4 38-14 42-42z"/><path d="M90 80c3 20 10 27 30 30-20 3-27 10-30 30-3-20-10-27-30-30 20-3 27-10 30-30z"/><path d="M1100 420c3 20 10 27 30 30-20 3-27 10-30 30-3-20-10-27-30-30 20-3 27-10 30-30z"/></g>
  <g fill="#FBE6A2"><circle cx="540" cy="200" r="10"/><circle cx="880" cy="60" r="8"/><circle cx="1150" cy="250" r="12"/><circle cx="80" cy="360" r="9"/></g>
  <path d="M820 200c30-40 90-30 96 14 6 40-50 60-80 40-20-12-26-34-16-54z" fill="#C6E9D2" stroke="#58BAB3" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round"/>
</svg>'''

def pillars():
    return '<section class="pillars container" aria-label="Explore by interest"><ul>'+''.join(
        f'<li class="c-{k}"><a href="category.html"><svg aria-hidden="true"><use href="#blob"/></svg><span>{n}</span></a></li>' for k,n in CATS)+'</ul></section>'

def sidebar(first=True):
    issue=f'''<section class="widget"><div class="issue-box dots-mustard"><h4>Current issue</h4><div class="cover">{cover()}</div>
      <div class="issue-btns"><a class="btn btn-primary" href="#join">Subscribe</a><a class="btn btn-info" href="#join">View issue</a></div></div>
      <p class="issue-note">Example copy. Print edition placeholder.</p></section>'''
    house='''<section class="widget sticky-widget"><div class="house-ad dots-brick"><h5>Your Voice</h5><p>Write it, draw it, film it. Send us what you're proud of and we might feature it. <span class="example">Example</span></p><a class="btn btn-primary dots-brick btn-block" href="article.html">Submit</a></div></section>'''
    nl='''<section class="widget nl-widget"><h5>Join our newsletter</h5><form data-demo><label class="sr-only" for="sn1">First name</label><input class="field dots-mustard" id="sn1" placeholder="First name"><label class="sr-only" for="se1">Email</label><input class="field dots-mustard" id="se1" type="email" placeholder="Email"><button class="btn btn-secondary dots-mustard btn-block">Sign up</button><p class="form-msg" role="status"></p></form></section>'''
    return f'<aside class="sidebar">{issue if first else nl}{house}</aside>'

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

FOLLOW='<section class="follow container" id="follow"><h2>Follow us</h2><p class="motto">Be curious. Be bold. Be you.</p><div class="icons"><a href="#" aria-label="Facebook (placeholder)"><svg><use href="#i-fb"/></svg></a><a href="#" aria-label="Instagram (placeholder)"><svg><use href="#i-ig"/></svg></a></div><div class="tiles" aria-label="Example social tiles">'+''.join(
    f'<img class="tile" src="{CRED[f]["file"]}" alt="{CRED[f]["alt"]}" loading="lazy" decoding="async" width="{CRED[f]["w"]}" height="{CRED[f]["h"]}">' for f in ['img/library/'+n+'.jpg' for n in ['sunflower','pink-cupcakes','night-sky','kitten-daisies','watercolours','tulips','hot-air-balloon','bookshop','strawberries','great-wave']])+'</div></section>'

home=f'''<main id="main">
<section class="hero container c-questions">
  <a class="hero-art" href="article.html" aria-label="Read the featured post">{HERO_ART}</a>
  <div class="hero-text"><span class="example kicker">Example copy</span><h1 class="dots-aqua">Could you grow a garden on the Moon?</h1><a class="btn dots-aqua" href="article.html">View post</a></div>
</section>
<div class="container feed-wrap">
  <div class="feed"><h2 class="section-title">Fresh this week <span class="example">Example copy</span></h2>
  {''.join(card(p) for p in POSTS[:5])}
  <h2 class="featured-title">Featured</h2>
  {card(('voice','Your Voice','Reader art wall: theme "Home"','Send us a drawing, photo or collage about what home means to you. Example promo card.','art-wall'))}
  </div>
  {sidebar(True)}
</div>
{pillars()}
{CREATE_PROMO}
<div class="container feed-wrap">
  <div class="feed">{''.join(card(p) for p in POSTS[5:])}</div>
  {sidebar(False)}
</div>
{FOLLOW}
{NEWSLETTER}
</main>'''

cat_posts=[('make','Make It',t,e,i) for t,e,i in [
 ('Turn an old T-shirt into a tote bag in 20 minutes','No sewing machine needed.','tote-bag'),
 ('Easy no-bake cookies for a rainy afternoon','Five ingredients, one bowl.','cookies'),
 ('Paint a mini mural on your bedroom door (with permission!)','Plan, sketch, paint, admire.','mural'),
 ('Start a sketchbook habit you\'ll actually keep','Ten-minute prompts for every day of the week.','pencils'),
 ('Make your own lip balm with three ingredients','A simple kitchen-chemistry project using beeswax and honey.','honey'),
 ('Design a zine about your favourite thing','Fold, cut, write and photocopy.','scissors')]]
category=f'''<main id="main" class="c-make">
<header class="page-header container"><span class="cat-chip">Section</span><h1 class="page-title">Make It</h1><p class="lead-banner">Crafts, DIY, art and cooking: learn by doing, mess allowed. (Example copy)</p></header>
<div class="container feed-wrap">
  <div class="feed">{''.join(card(p) for p in cat_posts)}
  <ul class="pagination" aria-label="Pages"><li><span>1</span></li><li><a href="#">2</a></li><li><a href="#">3</a></li><li><a href="#">Next</a></li></ul></div>
  {sidebar(True)}
</div>
</main>'''

article=f'''<main id="main" class="c-questions">
<div class="container">
<h1 class="entry-title">Could you grow a garden on the Moon?</h1>
<div class="feed-wrap">
  <article class="feed entry">
    <div class="meta"><span class="date">22 October 2026 · <span class="example">Example article</span></span><a class="cat cat-chip" href="category.html">Big Questions</a><span class="share" aria-label="Share (placeholders)"><a href="#" aria-label="Share via email">@</a><a href="#" aria-label="Copy link">&#128279;</a></span></div>
    <figure class="feature-art">{photo('moon','photo',True)}<span class="band">Big Questions</span><figcaption class="photo-credit">Photo: {CRED['img/articles/moon.jpg']['artist']}, {CRED['img/articles/moon.jpg']['licLabel'].split(' (')[0]}, via <a href="{CRED['img/articles/moon.jpg']['page']}" rel="noopener">Wikimedia Commons</a></figcaption></figure>
    <p class="lead">Spoiler: maybe, with a lot of help. Here's what plants need, and what the Moon is missing. (All copy on this page is example text for the prototype.)</p>
    <p>Plants need four big things: light, water, air and something to grow in. On Earth we get all four for free. On the Moon, every one of them is a puzzle to solve.</p>
    <h2>1. Light</h2><p>The Moon gets plenty of sunshine, but a "day" there lasts about two Earth weeks, followed by two weeks of darkness. Gardeners would need lamps for the long nights.</p>
    <blockquote>Big question to think about: what would YOU plant first?</blockquote>
    <h2>2. Soil</h2><p>Moon dust (called regolith) has no living things in it and can be sharp. Scientists have actually grown small plants in real lunar samples, which is a promising start.</p>
    <ol><li><strong>Try it:</strong> plant cress seeds in sand vs potting mix and compare.</li><li><strong>Record:</strong> measure growth every day for a week.</li><li><strong>Share:</strong> send your results to Your Voice.</li></ol>
    <hr>
    <div class="author-box"><div class="avatar">{thumb('voice','i-star')}</div><div><strong>Written by the Rebella team</strong> (placeholder author box)</div></div>
  </article>
  {sidebar(True)}
</div>
</div>
</main>'''

CREATE_BODY=open(os.path.join(OUT,'_create_body.html')).read()

def credits_page():
    rows=lambda g: ''.join(f'<tr><td><img src="{c["file"]}" alt="" loading="lazy" width="80" height="{round(80*c["h"]/c["w"])}"></td><td>{c["alt"]}</td><td>{c["artist"]}</td><td>{c["licLabel"]}</td><td><a href="{c["page"]}" rel="noopener">{c["title"].replace("File:","")}</a></td></tr>' for c in CREDITS if c['group']==g)
    head='<thead><tr><th scope="col"><span class="sr-only">Preview</span></th><th scope="col">What it shows</th><th scope="col">Author</th><th scope="col">Licence</th><th scope="col">Source</th></tr></thead>'
    return f'''<main id="main" class="credits container">
<h1 class="entry-title">Photo credits</h1>
<p>Every photo on Rebella comes from <strong>Wikimedia Commons</strong> and is marked <strong>CC0</strong> or <strong>public domain</strong> on its file page, so it can be reused, changed and shared freely (including in boards you make and download). Credit isn't required, but we like to say thank you. Our stickers are original Rebella artwork.</p>
<h2>Article photos</h2><div class="table-wrap"><table>{head}<tbody>{rows('articles')}</tbody></table></div>
<h2>Create page photo library</h2><div class="table-wrap"><table>{head}<tbody>{rows('library')}</tbody></table></div>
</main>'''

for fn,t,b,a,x in [('index.html','Rebella | Learn what you love',home,None,''),('category.html','Make It | Rebella',category,'make',''),('article.html','Could you grow a garden on the Moon? | Rebella',article,'questions',''),
    ('create.html','Create a board | Rebella',CREATE_BODY,'create','\n<link rel="stylesheet" href="css/create.css">\n<script src="js/library.js" defer></script>\n<script src="js/create.js" defer></script>'),
    ('credits.html','Photo credits | Rebella',credits_page(),None,'')]:
    open(os.path.join(OUT,fn),'w').write(page(t,b,a,extra_head=x))
print('written')
