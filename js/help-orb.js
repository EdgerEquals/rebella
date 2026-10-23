/* HelpOrb: exactly one draggable help orb, the only way to ask. No tooltips, strips, pop-ups or new boxes.
   API: HelpOrb.init({dict, headerSlot, footerSlot, targets})
     dict: {key: {title, text, try}}, targets: [[cssSelector, key], ...] (adds data-help at runtime),
     headerSlot/footerSlot: existing text elements (title -> header, explanation + "try this" -> footer).
   Timings (PHI^n s): glow 2.618 (all targets, golden-angle offsets), hot 1.618, fade-out 0.382,
   footer pages 6.854, crossfade back + orb return 0.618. Reduced motion: colour only, no movement. */
(function () {
  'use strict';
  if (window.HelpOrb) return;
  var GA = 0.6180339887, PAGE = 6854, OUT = 382, BACK = 618;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var st = null;

  function css() {
    var s = document.createElement('style');
    s.textContent =
      '.help-orb{position:fixed;left:12px;bottom:calc(var(--app-foot-h,60px) + 12px);z-index:960;width:48px;height:48px;border-radius:50%;border:2px solid #fff;' +
      'background:radial-gradient(circle at 35% 30%,#FDEEF2,#F48FB1 60%,#8E2350);color:#3D1226;font:700 1.5rem/1 "Alegreya Sans",sans-serif;cursor:grab;touch-action:none;' +
      'box-shadow:0 2px 10px rgba(61,18,38,.35);transition:opacity .618s ease;padding:0}' +
      '.help-orb.dragging{cursor:grabbing;transition:none;opacity:.92}.help-orb.gone{opacity:0;transition:opacity .382s ease;pointer-events:none}' +
      '.help-orb:focus-visible{outline:3px solid #8E2350;outline-offset:3px}' +
      'html.help-seeking [data-help]{box-shadow:inset 0 0 0 999px rgba(246,201,212,.28);animation:helpGlow 2.618s ease-in-out infinite;animation-delay:var(--help-d,0s)}' +
      'html.help-seeking [data-help].help-hot{box-shadow:inset 0 0 0 999px rgba(244,143,177,.45);animation:helpHot 1.618s ease-in-out infinite}' +
      '@keyframes helpGlow{0%,100%{box-shadow:inset 0 0 0 999px rgba(246,201,212,.22),0 0 0 0 rgba(244,143,177,0)}50%{box-shadow:inset 0 0 0 999px rgba(246,201,212,.34),0 0 10px 2px rgba(244,143,177,.55)}}' +
      '@keyframes helpHot{0%,100%{box-shadow:inset 0 0 0 999px rgba(244,143,177,.38),0 0 6px 2px rgba(142,35,80,.4)}50%{box-shadow:inset 0 0 0 999px rgba(244,143,177,.52),0 0 14px 4px rgba(142,35,80,.7)}}' +
      '@media (prefers-reduced-motion:reduce){html.help-seeking [data-help]{animation:none!important}.help-orb,.help-orb.gone{transition:none}}';
    document.head.appendChild(s);
  }
  function targets() { return Array.prototype.filter.call(document.querySelectorAll('[data-help]'), function (el) { return el.offsetParent !== null || el.getClientRects().length; }); }
  function seek(on) {
    document.documentElement.classList.toggle('help-seeking', on);
    if (on) targets().forEach(function (el, k) { el.style.setProperty('--help-d', (-2.618 * (((k + 1) * GA) % 1)).toFixed(3) + 's'); });
    else document.querySelectorAll('.help-hot').forEach(function (el) { el.classList.remove('help-hot'); });
  }
  function hot(el) {
    if (st.hot === el) return;
    if (st.hot) st.hot.classList.remove('help-hot');
    st.hot = el; if (el) el.classList.add('help-hot');
  }
  function under(x, y) {
    var list = document.elementsFromPoint(x, y);
    for (var i = 0; i < list.length; i++) { if (list[i] === st.orb) continue; var t = list[i].closest('[data-help]'); if (t) return t; if (list[i].tagName !== 'HTML') return null; }
    return null;
  }
  function swap(el, text, cb) {
    if (reduce) { el.textContent = text; if (cb) cb(); return; }
    el.style.transition = 'opacity .382s ease'; el.style.opacity = '0';
    setTimeout(function () { el.textContent = text; el.style.transition = 'opacity .618s ease'; el.style.opacity = '1'; if (cb) setTimeout(cb, BACK); }, OUT);
  }
  function answer(key) {
    var e = st.dict[key] || st.dict._miss || { title: 'Drop me on something', text: 'Drag the orb onto any part of the page to find out what it does.' };
    var h = st.header, f = st.footer, pages = [];
    String(e.text || '').split(/(?<=[.!?])\s+/).forEach(function (s) { if (!s) return; var last = pages[pages.length - 1]; if (last && (last + ' ' + s).length <= 90) pages[pages.length - 1] = last + ' ' + s; else pages.push(s); });
    if (e.try) pages.push('Try this: ' + e.try);
    [h, f].forEach(function (el) { if (el && !el.hasAttribute('data-help-busy')) { el.setAttribute('data-help-original', el.textContent); el.setAttribute('data-help-busy', ''); } });
    if (f) { f.setAttribute('aria-live', 'polite'); var bar = f.closest('footer'); if (bar) bar.classList.add('help-answering'); }
    clearTimeout(st.timer);
    if (h) swap(h, e.title || '');
    var i = 0;
    (function next() {
      if (i < pages.length) { if (f) swap(f, pages[i]); i++; st.timer = setTimeout(next, PAGE); return; }
      done();
    })();
  }
  function done() {
    [st.header, st.footer].forEach(function (el) {
      if (!el || !el.hasAttribute('data-help-busy')) return;
      var o = el.getAttribute('data-help-original') || '';
      el.removeAttribute('data-help-busy'); el.removeAttribute('data-help-original');
      swap(el, o);
    });
    if (st.footer) { var bar = st.footer.closest('footer'); if (bar) setTimeout(function () { bar.classList.remove('help-answering'); }, OUT); }
    home();
  }
  function home() {
    var o = st.orb; o.style.left = ''; o.style.top = ''; o.style.bottom = ''; avoid();
    o.classList.remove('gone', 'dragging');
  }
  // the orb never sits on a YouTube player: lift its dock above any player it would cover
  function avoid() {
    var o = st.orb; o.style.bottom = '';
    var r = o.getBoundingClientRect();
    document.querySelectorAll('iframe[src*="youtube"]').forEach(function (f) {
      var p = f.getBoundingClientRect();
      if (r.left < p.right && r.right > p.left && r.top < p.bottom && r.bottom > p.top) o.style.bottom = (window.innerHeight - p.top + 12) + 'px';
    });
  }
  function drop(el) { seek(false); st.orb.classList.add('gone'); setTimeout(function () { answer(el ? el.getAttribute('data-help') : '_miss'); }, OUT); }

  function init(opt) {
    if (st) return window.HelpOrb; // exactly one orb
    opt = opt || {};
    st = { dict: opt.dict || {}, header: opt.headerSlot || document.querySelector('[data-help-slot="header"]'), footer: opt.footerSlot || document.querySelector('[data-help-slot="footer"]'), hot: null, timer: 0, kb: false };
    (opt.targets || []).forEach(function (p) { try { document.querySelectorAll(p[0]).forEach(function (el) { if (!el.hasAttribute('data-help')) el.setAttribute('data-help', p[1]); }); } catch (e) {} });
    css();
    var o = st.orb = document.createElement('button');
    o.type = 'button'; o.className = 'help-orb'; o.id = 'help-orb'; o.textContent = '?';
    o.setAttribute('aria-label', 'Help orb. Drag me onto anything to find out what it does, or press Enter then use the arrow keys.');
    document.body.appendChild(o); avoid();
    window.addEventListener('resize', avoid); window.addEventListener('scroll', function () { if (!o.classList.contains('dragging')) avoid(); }, { passive: true });
    var sx = 0, sy = 0, ox = 0, oy = 0, moved = false;
    o.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return; e.preventDefault();
      try { o.setPointerCapture(e.pointerId); } catch (x) {}
      var r = o.getBoundingClientRect(); sx = e.clientX; sy = e.clientY; ox = r.left; oy = r.top; moved = false;
      o.classList.add('dragging'); seek(true);
    });
    o.addEventListener('pointermove', function (e) {
      if (!o.classList.contains('dragging')) return;
      var dx = e.clientX - sx, dy = e.clientY - sy; if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      o.style.left = (ox + dx) + 'px'; o.style.top = (oy + dy) + 'px'; o.style.bottom = 'auto';
      hot(under(e.clientX, e.clientY));
    });
    function end(e) {
      if (!o.classList.contains('dragging')) return;
      try { o.releasePointerCapture(e.pointerId); } catch (x) {}
      o.classList.remove('dragging');
      if (!moved) { seek(false); home(); return; }
      var t = under(e.clientX, e.clientY); hot(null); drop(t);
    }
    o.addEventListener('pointerup', end); o.addEventListener('pointercancel', function (e) { o.classList.remove('dragging'); seek(false); hot(null); home(); });
    // keyboard: focus the orb, Enter, arrows to choose, Enter to ask, Escape to cancel
    o.addEventListener('keydown', function (e) {
      var list = targets();
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!st.kb) { st.kb = true; seek(true); hot(list[0] || null); if (list[0]) list[0].scrollIntoView({ block: 'nearest' }); }
        else { st.kb = false; var t = st.hot; hot(null); drop(t); }
      } else if (st.kb && /^Arrow/.test(e.key)) {
        e.preventDefault(); var i = list.indexOf(st.hot), d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : -1;
        var n = list[(i + d + list.length) % list.length]; hot(n); if (n) n.scrollIntoView({ block: 'nearest' });
      } else if (st.kb && e.key === 'Escape') { st.kb = false; hot(null); seek(false); }
    });
    o.addEventListener('blur', function () { if (st.kb) { st.kb = false; hot(null); seek(false); } });
    return window.HelpOrb;
  }
  window.HelpOrb = { init: init };
})();
