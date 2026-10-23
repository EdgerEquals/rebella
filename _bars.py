"""Shared header/footer bars for Rebella and Bonnie's Dashboard.

ONE component: _bars.html (structure) + css/bars.css (static locked bars) + js/bars.js (height measuring,
visitor greeting and the optional on-device nickname). The audience switch only changes the wording:

  render_bars('bonnie')  -> dashboard wording (Bonnie, Lock, Export/Reset, Simmie's publisher)
  render_bars('visitor') -> Rebella wording, addressed to "you", the person reading the site

Visitor wording must never mention Bonnie, Dad, Simmie, moderation, the queue, Ask Dad, Lock, passcode,
the age dial, the message-status glow or meters (checked by _tests/test_shared_bars.py).
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = open(os.path.join(HERE, '_bars.html')).read()

WORDMARK_DASH = '<div class="wordmark small"><span class="script">rebel</span><span class="serif">la</span></div>'
WORDMARK_SITE = '<a class="wordmark small" href="index.html" aria-label="Rebella home"><span class="script">rebel</span><span class="serif">la</span></a>'

FOOT_VISITOR = (
  '<link rel="stylesheet" href="css/footbar.css?v=1">'
  '<div class="fb-lane" aria-hidden="true"></div>'
  '<div class="container fb-wrap">'
  '<div class="fb-row" data-help="fb-status">'
  '<span class="fb-lights">'
  '<span class="fb-light idle" data-l="sky" role="img" aria-label="Sky: loading the Perth weather"><b></b><small><span class="lg">Sky</span><span class="sm">S</span></small></span>'
  '<span class="fb-light idle" data-l="time" role="img" aria-label="Time of day"><b></b><small><span class="lg">Time</span><span class="sm">T</span></small></span>'
  '<span class="fb-light idle" data-l="radio" role="img" aria-label="Radio: off"><b></b><small><span class="lg">Radio</span><span class="sm">R</span></small></span>'
  '<span class="fb-light idle" data-l="device" role="img" aria-label="Device: nothing saved" data-help="fb-device"><b></b><small><span class="lg">Device</span><span class="sm">D</span></small></span>'
  '</span>'
  '<svg class="fb-wave" viewBox="0 0 40 16" aria-hidden="true" focusable="false"><path d="M0 8 Q5 2 10 8 T20 8 T30 8 T40 8 T50 8 T60 8 T70 8 T80 8"/></svg>'
  '<svg class="fb-gauge" viewBox="0 0 32 18" role="img" aria-label="Time of day gauge" focusable="false"><path class="g-arc" d="M3 16 A13 13 0 0 1 29 16"/><line class="g-needle" x1="16" y1="16" x2="16" y2="5"/><circle cx="16" cy="16" r="1.8"/></svg>'
  '<span class="fb-tick" data-help="fb-facts"><span class="ft-line fb-tick-t" id="bar-line" data-help-slot="footer">Made for curious minds like you</span></span>'
  '</div>'
  '<div class="fb-tty ft-right">'
  '<span class="fb-p" aria-hidden="true">rebella&gt;</span>'
  '<span class="vn" id="vn" data-help="name-prompt">'
  '<button class="vn-ask" id="vn-ask" type="button">Want me to call you something?</button>'
  '<span class="vn-known" id="vn-known" hidden>Not <span id="vn-who"></span>? <button class="vn-link" id="vn-change" type="button">change</button> / <button class="vn-link" id="vn-forget" type="button">forget my name</button></span>'
  '<span class="vn-form" id="vn-form" role="group" aria-label="Choose a nickname" hidden>'
  '<label class="sr-only" for="vn-in">Type a name</label>'
  '<input class="vn-in" id="vn-in" type="text" maxlength="20" placeholder="Type a name" autocomplete="off" autocapitalize="words" spellcheck="false" enterkeyhint="done">'
  '<button class="vn-link vn-save" id="vn-save" type="button">save</button> <button class="vn-link" id="vn-skip" type="button">skip</button> '
  '<small class="vn-note" id="vn-note" aria-live="polite">Stays on this device only</small></span></span>'
  '<span class="fb-cursor" aria-hidden="true"></span>'
  '<button type="button" class="fb-pause" aria-pressed="false" data-help="fb-pause"><span aria-hidden="true" class="fb-pi"></span><span class="fb-pl">Pause motion</span></button>'
  '</div></div>'
  '<script src="js/footbar.js?v=1" defer></script>'
)

WORDING = {
  'bonnie': dict(
    tagline='Keep Rebella safe, fun and cool', greet_help='dash-tagline',
    top_right='<button id="lock" class="lockbtn" type="button" aria-label="Lock dashboard">&#128274; Lock</button>',
    wordmark=WORDMARK_DASH, pill="Bonnie's Dashboard",
    actions='<button id="export" class="btn btn-info" type="button">Export decisions (JSON)</button>'
            '<button id="reset" class="btn btn-secondary" type="button" aria-expanded="false" aria-controls="reset-strip">Reset all</button>',
    foot_html='<div class="container"><span class="ft-left">Bonnie\'s Dashboard</span><span class="ft-right"><span class="ft-line" id="bar-line" data-help-slot="footer">Decisions are sent securely to Simmie\'s publisher</span></span></div>'),
  'visitor': dict(
    # js/bars.js swaps this for "Hey Sam, ..." / "Welcome back, Sam" when the reader has chosen a nickname.
    tagline='Hey there, welcome to Rebella', greet_help='greeting',
    top_right='<nav class="bar-links" aria-label="Utility"><a href="recommendations.html" data-help="picks-link">Picks</a>'
              '<a href="category.html" data-help="all-articles">All articles</a><a href="submit.html" data-help="submit">Share your work</a></nav>',
    wordmark=WORDMARK_SITE, pill='Learn what you love',
    actions='<a class="btn btn-info" href="create.html" data-help="create-pill">Make a board</a>'
            '<a class="btn btn-secondary" href="recommendations.html" data-help="picks-link">See the picks</a>',
    # FOOTER (live 24 Oct 2026, Danny's yes): the dashboard footer items, adapted for the public and personalised on the
    # device only. Status lights (Sky / Time / Radio / Device), waveform, time-of-day gauge, fun-fact ticker (also the help
    # orb's footer slot), animal lane, the terminal-style line holding the optional nickname, and Pause motion.
    # Driven by js/footbar.js + css/footbar.css (loaded from here so the cached bars.css?v=1 is untouched).
    foot_html=FOOT_VISITOR),
}

BANNED_VISITOR = ['bonnie', 'dad', 'simmie', 'moderation', 'queue', 'ask dad', 'lock', 'passcode', 'age dial', 'meter', 'status glow']

def render_bars(audience='visitor'):
    w = WORDING[audience]
    out = TEMPLATE
    for k, v in dict(w, audience=audience).items():
        out = out.replace('{' + k + '}', v)
    return out

def split_bars(audience='visitor'):
    """(header_html, footer_html) so the page can put content between them."""
    html = render_bars(audience)
    i = html.index('<footer')
    return html[:i], html[i:]
