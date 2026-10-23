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

# Static logo (outlined vector wordmark, no web-font swap, no motion). Light = visitor theme, dark = black dashboard header.
WORDMARK_DASH = '<div class="wordmark small wm-logo"><img src="img/rebella-wordmark-dark.svg" alt="Rebella" width="121" height="47" decoding="async"></div>'
WORDMARK_SITE = '<a class="wordmark small wm-logo" href="index.html"><img src="img/rebella-wordmark-light.svg" alt="Rebella" width="121" height="47" decoding="async"></a>'
# Header radio dial: js in music/youtube/bonnie-radio.js mounts a compact genre dial here (same dial, smaller).
# Without JS it is a plain link to the radio on the Music Playground.
RADIO_MINI = ('<span class="br-mini-host" data-radio-mini data-help="radio-mini">'
              '<a class="br-mini-link" href="music/playground/#radio" aria-label="Rebella radio">&#128251; Radio</a></span>')

WORDING = {
  'bonnie': dict(
    tagline='Keep Rebella safe, fun and cool', greet_help='dash-tagline',
    top_right='<button id="lock" class="lockbtn" type="button" aria-label="Lock dashboard">&#128274; Lock</button>',
    wordmark=WORDMARK_DASH, pill="Bonnie's Dashboard",
    actions='<button id="export" class="btn btn-info" type="button">Export decisions (JSON)</button>'
            '<button id="reset" class="btn btn-secondary" type="button" aria-expanded="false" aria-controls="reset-strip">Reset all</button>',
    foot_left="Bonnie's Dashboard", foot_line="Decisions are sent securely to Simmie's publisher", foot_extra=''),
  'visitor': dict(
    # js/bars.js swaps this for "Hey Sam, ..." / "Welcome back, Sam" when the reader has chosen a nickname.
    tagline='Hey there, welcome to Rebella', greet_help='greeting',
    top_right='<span class="bar-right"><nav class="bar-links" aria-label="Utility">'
              '<a href="category.html" data-help="all-articles">All articles</a><a href="submit.html" data-help="submit">Share your work</a></nav>' + RADIO_MINI + '</span>',
    wordmark=WORDMARK_SITE, pill='Learn what you love',
    actions='',   # Create and Picks removed from the header (Danny, 24 Oct 2026); still in the phone menu, footer and page bodies
    foot_left='Rebella <span aria-hidden="true">&middot;</span> <a class="ft-cookies" href="cookies/" data-help="cookies">Cookies and your device</a>',
    foot_line='Made for curious minds like you',
    # Optional nickname: collapsed to one tappable phrase; js/bars.js expands it in place. No form is ever submitted.
    foot_extra=' <span class="vn" id="vn" data-help="name-prompt">'
               '<button class="vn-ask" id="vn-ask" type="button">Want me to call you something?</button>'
               '<span class="vn-known" id="vn-known" hidden>Not <span id="vn-who"></span>? <button class="vn-link" id="vn-change" type="button">change</button> / <button class="vn-link" id="vn-forget" type="button">forget my name</button></span>'
               '<span class="vn-form" id="vn-form" role="group" aria-label="Choose a nickname" hidden>'
               '<label class="sr-only" for="vn-in">Type a name</label>'
               '<input class="vn-in" id="vn-in" type="text" maxlength="20" placeholder="Type a name" autocomplete="off" autocapitalize="words" spellcheck="false" enterkeyhint="done">'
               '<button class="vn-link vn-save" id="vn-save" type="button">save</button> <button class="vn-link" id="vn-skip" type="button">skip</button> '
               '<small class="vn-note" id="vn-note" aria-live="polite">Stays on this device only</small></span></span>'),
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
