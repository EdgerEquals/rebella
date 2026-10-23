/* Rebella help orb: ONE draggable "?" per page, the only way to ask what something does.
   No pop-ups, tooltips, title-attribute help, modals, overlays or help boxes. The answer is fed into text lines the page
   ALREADY has: the header tagline shows the control's title, the footer line shows what it does (+ "try this"), paged.

   API (keep exactly):  HelpOrb.init({ dict, headerSlot, footerSlot })
     dict        object { key: {title, what, try?} }, a URL string to a JSON file of that shape, or an array of those
                 (merged left to right, so a page's own entries can extend or override a site dictionary).
     headerSlot  element or selector for an EXISTING header text node. Default: [data-help-slot=header], else .topbar .tagline
     footerSlot  element or selector for an EXISTING footer text node. Default: [data-help-slot=footer], else footer .strip a
   Controls opt in with data-help="key". The module never creates a slot; with no slot it simply answers into nothing visible
   (and still sets aria-live on whatever slot exists).

   Phi timing (Bonnie's ladder, PHI^n s): orb fade-out 0.382 s, text crossfade 0.382 s, orb fade-in at home 0.618 s,
   droppable glow pulse 2.618 s (golden-angle offsets per target), target-under-orb pulse 1.618 s, footer paging 6.854 s,
   answer hold = max(6.854 s, paging time). Reduced motion: colour only, no pulse, no fades. Optional rule-9 haptic on drop. */
(function () {
  'use strict';
  if (window.HelpOrb && window.HelpOrb.__ready) return;
  var PHI = 1.6180339887, GA = 0.6180339887;
  var T_FADE = 0.382, T_HOME = 0.618, T_PAGE = 6.854;
  var NO_TARGET = { title: 'Ask the orb', what: 'Drop me on a control to learn what it does.' };
  var dict = {}, orb = null, headerEl = null, footerEl = null, busy = false, picking = false;
  var targets = [], pickIdx = -1, under = null, drag = null, reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function $(s) { if (!s) return null; if (s.nodeType) return s; try { return document.querySelector(s); } catch (e) { return null; } }
  function merge(src) { if (src && typeof src === 'object') Object.keys(src).forEach(function (k) { if (k.charAt(0) !== '_') dict[k] = src[k]; }); }
  function load(d) {
    var list = Array.isArray(d) ? d : [d];
    return list.reduce(function (p, item) {
      return p.then(function () {
        if (typeof item === 'string') {
          if (!window.fetch) return;
          return fetch(item, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(merge).catch(function () {});
        }
        merge(item);
      });
    }, Promise.resolve());
  }
  function css() {
    if (document.getElementById('help-orb-css')) return;
    var s = document.createElement('style'); s.id = 'help-orb-css';
    s.textContent =
      '.help-orb{position:fixed;left:calc(12px + env(safe-area-inset-left,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:950;' +
      'width:52px;height:52px;min-width:44px;min-height:44px;border-radius:50%;border:3px solid #fff;padding:0;cursor:grab;touch-action:none;' +
      'background:#DCD0F2;color:#5B3A50;font:700 1.6rem/1 "Gochi Hand","Patrick Hand",cursive;box-shadow:0 4px 14px rgba(58,43,53,.22);' +
      'transition:opacity ' + T_HOME + 's ease;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}' +
      '.help-orb:focus-visible{outline:3px solid #5B3A50;outline-offset:3px}' +
      '.help-orb.is-dragging{cursor:grabbing;transition:none;box-shadow:0 8px 22px rgba(58,43,53,.3)}' +
      '.help-orb.is-out{opacity:0;transition:opacity ' + T_FADE + 's ease}' +
      '.help-orb[hidden]{display:none}' +
      /* droppable signal: tint + glow via box-shadow only (no layout shift, no size change) */
      '.help-picking [data-help]{--help-tint:rgba(248,207,219,.30);--help-ring:rgba(180,67,108,.45);' +
      'box-shadow:inset 0 0 0 999px var(--help-tint),0 0 0 2px var(--help-ring)!important;animation:help-glow 2.618s ease-in-out infinite;animation-delay:var(--help-delay,0s)}' +
      '.help-picking [data-help].help-target{--help-tint:rgba(252,217,192,.55);--help-ring:rgba(180,67,108,.9);animation-duration:1.618s}' +
      '@keyframes help-glow{0%,100%{box-shadow:inset 0 0 0 999px var(--help-tint),0 0 0 2px var(--help-ring)}50%{box-shadow:inset 0 0 0 999px var(--help-tint),0 0 0 2px var(--help-ring),0 0 14px 4px var(--help-ring)}}' +
      '@media(prefers-reduced-motion:reduce){.help-picking [data-help]{animation:none!important}.help-orb,.help-orb.is-out{transition:none}}';
    document.head.appendChild(s);
  }

  // ---------- targets + highlight ----------
  function visibleTargets() {
    var vh = window.innerHeight, out = [];
    [].forEach.call(document.querySelectorAll('[data-help]'), function (el) {
      if (orb && (el === orb || orb.contains(el))) return;
      var r = el.getBoundingClientRect();
      if (r.width && r.height && r.bottom > 0 && r.top < vh) out.push(el);
    });
    return out;
  }
  function startPick() {
    picking = true; document.documentElement.classList.add('help-picking');
    [].forEach.call(document.querySelectorAll('[data-help]'), function (el, k) {
      el.style.setProperty('--help-delay', (-2.618 * (((k + 1) * GA) % 1)).toFixed(3) + 's');   // golden-angle offset
    });
  }
  function endPick() {
    picking = false; document.documentElement.classList.remove('help-picking'); setUnder(null);
    [].forEach.call(document.querySelectorAll('[data-help]'), function (el) { el.style.removeProperty('--help-delay'); });
  }
  function setUnder(el) {
    if (under === el) return;
    if (under) under.classList.remove('help-target');
    under = el; if (el) el.classList.add('help-target');
  }
  function hit(x, y) {
    var list = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [document.elementFromPoint(x, y)];
    for (var i = 0; i < list.length; i++) {
      var n = list[i]; if (!n || n === orb || (orb && orb.contains(n))) continue;
      var t = n.closest ? n.closest('[data-help]') : null;
      if (t && t !== orb) return t;
      if (n.tagName === 'IFRAME') { var w = n.closest('[data-help]'); if (w) return w; }
    }
    return null;
  }

  // ---------- answer into existing header + footer text ----------
  function fadeSwap(el, fn, done) {
    if (!el) { fn(); if (done) done(); return; }
    if (reduce) { fn(); if (done) done(); return; }
    el.style.transition = 'opacity ' + T_FADE + 's ease'; el.style.opacity = '0';
    setTimeout(function () { fn(); el.style.opacity = '1'; setTimeout(function () { el.style.transition = ''; el.style.opacity = ''; if (done) done(); }, T_FADE * 1000); }, T_FADE * 1000);
  }
  function pages(entry) {
    var text = (entry.what || '') + (entry['try'] ? ' Try this: ' + entry['try'] : '');
    var sent = text.match(/[^.!?]+[.!?]+["')]*\s*|[^.!?]+$/g) || [text], out = [], cur = '';
    var max = window.innerWidth < 576 ? 70 : 120;
    sent.forEach(function (s) { s = s.trim(); if (!s) return; if (cur && (cur + ' ' + s).length > max) { out.push(cur); cur = s; } else cur = cur ? cur + ' ' + s : s; });
    if (cur) out.push(cur);
    return out.length ? out : [''];
  }
  function answer(key) {
    var entry = (key && dict[key]) || (key ? { title: key, what: 'No help written for this one yet.' } : NO_TARGET);
    busy = true; hideOrb();
    try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) {}
    var hSave = headerEl ? [].slice.call(headerEl.childNodes).map(function (n) { return n.cloneNode(true); }) : null;
    var fSave = footerEl ? [].slice.call(footerEl.childNodes).map(function (n) { return n.cloneNode(true); }) : null;
    var hLive = headerEl && headerEl.getAttribute('aria-live'), fLive = footerEl && footerEl.getAttribute('aria-live');
    if (headerEl) headerEl.setAttribute('aria-live', 'polite');
    if (footerEl) footerEl.setAttribute('aria-live', 'polite');
    var pg = pages(entry), i = 0, hold = Math.max(T_PAGE, pg.length * T_PAGE);
    fadeSwap(headerEl, function () { headerEl && (headerEl.textContent = entry.title || ''); });
    fadeSwap(footerEl, function () { footerEl && (footerEl.textContent = pg[0]); });
    var pager = setInterval(function () { i++; if (i >= pg.length) return clearInterval(pager); fadeSwap(footerEl, function () { footerEl.textContent = pg[i]; }); }, T_PAGE * 1000);
    setTimeout(function () {
      clearInterval(pager);
      function restore(el, save, live) {
        if (!el) return;
        fadeSwap(el, function () { el.textContent = ''; save.forEach(function (n) { el.appendChild(n); }); }, function () { if (live == null) el.removeAttribute('aria-live'); else el.setAttribute('aria-live', live); });
      }
      restore(headerEl, hSave, hLive); restore(footerEl, fSave, fLive);
      setTimeout(function () { busy = false; showOrb(); }, T_FADE * 2000);
    }, hold * 1000);
  }
  function hideOrb() {
    orb.classList.add('is-out');
    setTimeout(function () { orb.hidden = true; orb.style.transform = ''; }, reduce ? 0 : T_FADE * 1000);
  }
  function showOrb() {
    orb.style.transform = ''; orb.classList.add('is-out'); orb.hidden = false; dock();
    requestAnimationFrame(function () { requestAnimationFrame(function () { orb.classList.remove('is-out'); }); });
  }

  // ---------- docking: keep clear of the YouTube player and of controls ----------
  var KEEP = 'iframe,[data-help-keepclear],button,a[href],input,select,textarea,[role=slider],[data-help]';
  function dock() {
    if (!orb || orb.hidden || drag) return;
    orb.style.bottom = '';
    var base = orb.getBoundingClientRect(), size = base.height || 52, vh = window.innerHeight, best = null;
    for (var b = 14; b < vh * 0.62; b += 22) {
      var top = vh - b - size, bad = 0, hard = false;
      [[0.5, 0.5], [0.1, 0.5], [0.9, 0.5], [0.5, 0.1], [0.5, 0.9]].forEach(function (p) {
        var x = base.left + base.width * p[0], y = top + size * p[1];
        var list = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [];
        for (var i = 0; i < list.length; i++) {
          var n = list[i]; if (n === orb) continue;
          if (n.closest && n.closest('iframe,[data-help-keepclear]')) { hard = true; break; }
          if (n.closest && n.closest(KEEP)) { bad++; break; }
        }
      });
      if (!hard && bad === 0) { best = b; break; }
      if (!hard && (best === null || bad < best.bad)) best = { b: b, bad: bad };
    }
    var v = typeof best === 'number' ? best : (best ? best.b : 14);
    orb.style.bottom = 'calc(' + v + 'px + env(safe-area-inset-bottom,0px))';
  }
  var dockRaf = 0;
  function dockSoon() { if (dockRaf) return; dockRaf = requestAnimationFrame(function () { dockRaf = 0; dock(); }); }

  // ---------- pointer drag ----------
  function onDown(e) {
    if (busy || e.button > 0) return;
    e.preventDefault();
    var r = orb.getBoundingClientRect();
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, ox: e.clientX - r.left - r.width / 2, oy: e.clientY - r.top - r.height / 2, moved: false };
    try { orb.setPointerCapture(e.pointerId); } catch (err) {}
  }
  function onMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 6) return;
    if (!drag.moved) { drag.moved = true; orb.classList.add('is-dragging'); startPick(); }
    orb.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    setUnder(hit(e.clientX, e.clientY));
  }
  function onUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var d = drag; drag = null;
    try { orb.releasePointerCapture(e.pointerId); } catch (err) {}
    orb.classList.remove('is-dragging');
    if (!d.moved) { answer('orb'); return; }                    // a plain tap explains the orb itself
    var t = hit(e.clientX, e.clientY); endPick();
    answer(t ? t.getAttribute('data-help') : null);
  }
  function onCancel() { if (!drag) return; drag = null; orb.classList.remove('is-dragging'); orb.style.transform = ''; endPick(); }

  // ---------- keyboard pick mode (orb only) ----------
  function onKey(e) {
    if (busy) return;
    if (!picking) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); targets = visibleTargets();
        if (!targets.length) { answer(null); return; }
        startPick(); pickIdx = 0; focusPick(); }
      return;
    }
    var k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowRight' || (k === 'Tab' && !e.shiftKey)) { e.preventDefault(); pickIdx = (pickIdx + 1) % targets.length; focusPick(); }
    else if (k === 'ArrowUp' || k === 'ArrowLeft' || (k === 'Tab' && e.shiftKey)) { e.preventDefault(); pickIdx = (pickIdx - 1 + targets.length) % targets.length; focusPick(); }
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); var t = targets[pickIdx]; endPick(); answer(t.getAttribute('data-help')); }
    else if (k === 'Escape') { e.preventDefault(); endPick(); }
  }
  function focusPick() {
    var t = targets[pickIdx]; setUnder(t);
    try { t.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); } catch (e) {}
    orb.setAttribute('aria-label', 'Help orb, pick mode: ' + ((dict[t.getAttribute('data-help')] || {}).title || 'control') + '. Enter to explain, arrows to move, Escape to stop.');
  }
  function onBlur() { if (picking && !drag) { endPick(); orb.setAttribute('aria-label', LABEL); } }

  var LABEL = 'Help orb. Drag me onto a control, or press Enter and use the arrow keys to pick one.';
  function init(opts) {
    opts = opts || {};
    if (window.HelpOrb.__inited) return window.HelpOrb;              // exactly one orb per page
    window.HelpOrb.__inited = true;
    css();
    headerEl = $(opts.headerSlot) || $('[data-help-slot=header]') || $('.topbar .tagline');
    footerEl = $(opts.footerSlot) || $('[data-help-slot=footer]') || $('footer .strip a');
    var found = document.querySelectorAll('.help-orb');
    for (var i = 1; i < found.length; i++) found[i].parentNode.removeChild(found[i]);   // refuse a second orb
    orb = found[0] || document.createElement('button');
    orb.className = 'help-orb'; orb.type = 'button'; orb.textContent = '?';
    orb.setAttribute('aria-label', LABEL); orb.setAttribute('data-help', 'orb');
    if (!orb.parentNode) document.body.appendChild(orb);
    orb.addEventListener('pointerdown', onDown); orb.addEventListener('pointermove', onMove);
    orb.addEventListener('pointerup', onUp); orb.addEventListener('pointercancel', onCancel);
    orb.addEventListener('keydown', onKey); orb.addEventListener('blur', onBlur);
    orb.addEventListener('click', function (e) { e.preventDefault(); });
    window.addEventListener('scroll', dockSoon, { passive: true }); window.addEventListener('resize', dockSoon);
    setTimeout(dock, 300);
    return load(opts.dict || {}).then(function () { return window.HelpOrb; });
  }
  window.HelpOrb = { __ready: true, init: init, addDict: function (d) { return load(d); }, explain: function (k) { if (!busy && orb) answer(k); }, dock: dock };
})();
