# Rebella Music Playground (side copy, local only). Everything lives in music/playground/.
# Wired in by ONE line in _generator.py (the 'MUSIC PLAYGROUND hook'). Remove: see music/playground/REMOVE.md.
import os

BODY = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '_body.html')).read()
DRAWER_LI = '<li class="c-create"><a href="{pre}music/playground/index.html">&#9834; Music Playground</a></li>'
ENTRY = '<p class="mu-pg-link"><a class="btn btn-secondary dots-mustard" href="playground/index.html">Try the Music Playground</a></p>'

def install(PAGES, page, G):
    PAGES.append(('music/playground/index.html', 'Music Playground | Rebella', BODY,
        'The Rebella Music Playground: tune the genre dial, build a little band of made-up instruments and play with sound. No microphone, nothing recorded or sent.',
        'playground', '\n<link rel="stylesheet" href="music/playground/playground.css">\n<script src="music/playground/js/help-orb.js" defer></script>\n<script src="music/playground/js/playground.js" defer></script>',
        'img/articles/reading.jpg', 'website', None, 'music playground, make music, ' + G['KEYWORDS'], '', True, '0.5'))
    def wrapped(path, title, bdy, desc, active=None, *a, **kw):
        out = page(path, title, bdy, desc, active, *a, **kw)
        pre = '../' * path.count('/')
        anchor = '&#9835; Music</a></li>'                       # the Music section's drawer link
        if anchor in out:                                      # one nav link: in the menu, right under Music
            out = out.replace(anchor, anchor + DRAWER_LI.format(pre=pre), 1)
        if path == 'music/index.html':                         # entry button on the Music page
            out = out.replace('<aside class="mu-featured"', ENTRY + '\n<aside class="mu-featured"', 1)
        return out
    return wrapped
