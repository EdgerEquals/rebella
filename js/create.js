/* Rebella Create: client-side mood board / collage / vision board editor. No backend: boards live in localStorage.
   Pointer events (mouse, pen, touch). Export draws the board onto a <canvas> from same-origin images only, so it isn't tainted. */
(function () {
  'use strict';
  var LIB = window.REBELLA_LIBRARY || { stickers: [], photos: [] };
  var KEY = 'rebella-board-v1';
  var TYPES = { mood: { w: 1200, h: 900, name: 'mood board' }, collage: { w: 1000, h: 1000, name: 'collage' }, vision: { w: 900, h: 1200, name: 'vision board' } };
  var BGS = [['#FFF8F4', 'Cream'], ['#FFFFFF', 'White'], ['#F8CFDB', 'Blush'], ['#FCD9C0', 'Peach'], ['#FBE7B0', 'Butter'], ['#C8EBD5', 'Mint'], ['#B5E3E0', 'Aqua'], ['#DCD0F2', 'Lavender'], ['#5B3A50', 'Plum']];
  var TXT_COLS = [['#3A2B35', 'Ink'], ['#B4436C', 'Raspberry'], ['#5A4291', 'Violet'], ['#22696A', 'Teal'], ['#94461A', 'Toffee'], ['#FFFFFF', 'White']];
  var FONT_STACK = { 'Gochi Hand': '"Gochi Hand", cursive', 'Kaushan Script': '"Kaushan Script", cursive', 'Lora': 'Lora, Georgia, serif', 'Alegreya Sans': '"Alegreya Sans", Helvetica, Arial, sans-serif' };
  var STARTERS = {
    mood: [{ kind: 'text', text: 'my mood', font: 'Kaushan Script', color: '#732B45', size: 96, cx: 600, cy: 110, rot: -3 }],
    collage: [],
    vision: [{ kind: 'text', text: 'My vision board', font: 'Gochi Hand', color: '#3A2B35', size: 84, cx: 450, cy: 110, rot: 0 }]
  };

  var state = { type: 'mood', bg: '#F8CFDB', items: [] };
  var sel = null, scale = 1, uid = 1;
  var board, wrap, statusEl, toolsLabel;

  function $(id) { return document.getElementById(id); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function T() { return TYPES[state.type]; }
  function byId(id) { for (var i = 0; i < state.items.length; i++) if (state.items[i].id === id) return state.items[i]; return null; }
  function say(msg) { statusEl.textContent = msg; clearTimeout(say.t); say.t = setTimeout(function () { statusEl.textContent = ''; }, 4000); }

  /* ---------- persistence ---------- */
  var saveTimer;
  function save(now) {
    clearTimeout(saveTimer);
    var go = function () { try { localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch (e) { return false; } };
    if (now) return go();
    saveTimer = setTimeout(go, 300);
  }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s && TYPES[s.type] && Array.isArray(s.items)) {
        state.type = s.type; state.bg = s.bg || state.bg;
        state.items = s.items.filter(function (it) { return it && (it.kind === 'text' || /^img\/(stickers|library)\/[\w-]+\.(svg|jpg)$/.test(it.src || '')); });
        state.items.forEach(function (it) { it.id = uid++; });
        return true;
      }
    } catch (e) {}
    return false;
  }

  /* ---------- rendering ---------- */
  function fit() {
    var t = T(), avail = wrap.clientWidth;
    var maxH = Math.max(320, Math.min(window.innerHeight * 0.78, 900));
    scale = Math.min(avail / t.w, maxH / t.h);
    board.style.width = t.w + 'px'; board.style.height = t.h + 'px';
    board.style.transform = 'scale(' + scale + ')';
    board.style.left = Math.max(0, (avail - t.w * scale) / 2) + 'px';
    wrap.style.height = (t.h * scale) + 'px';
    board.style.setProperty('--inv', (1 / scale).toFixed(4));
  }
  function itemEl(it) {
    var el = document.createElement('div');
    el.className = 'item item-' + it.kind; el.dataset.id = it.id; el.tabIndex = 0;
    if (it.kind === 'text') {
      var sp = document.createElement('span'); sp.className = 'txt'; el.appendChild(sp);
      el.setAttribute('aria-label', 'Words: ' + it.text);
    } else {
      var img = document.createElement('img'); img.src = it.src; img.alt = ''; img.draggable = false; el.appendChild(img);
      el.setAttribute('aria-label', (it.kind === 'photo' ? 'Photo: ' : 'Sticker: ') + (it.alt || ''));
    }
    var r = document.createElement('span'); r.className = 'handle h-rotate'; r.dataset.h = 'rotate'; r.title = 'Rotate'; el.appendChild(r);
    var z = document.createElement('span'); z.className = 'handle h-resize'; z.dataset.h = 'resize'; z.title = 'Resize'; el.appendChild(z);
    return el;
  }
  function place(it, el) {
    el = el || board.querySelector('[data-id="' + it.id + '"]');
    if (!el) return;
    if (it.kind === 'text') {
      var sp = el.firstChild; sp.textContent = it.text;
      sp.style.fontFamily = FONT_STACK[it.font] || FONT_STACK['Gochi Hand'];
      sp.style.fontSize = it.size + 'px'; sp.style.color = it.color;
      el.style.width = 'auto'; el.style.height = 'auto';
      it.w = Math.max(20, sp.offsetWidth); it.h = Math.max(20, sp.offsetHeight);
      el.setAttribute('aria-label', 'Words: ' + it.text);
    }
    el.style.width = it.w + 'px'; el.style.height = it.h + 'px';
    el.style.left = (it.cx - it.w / 2) + 'px'; el.style.top = (it.cy - it.h / 2) + 'px';
    el.style.transform = 'rotate(' + (it.rot || 0) + 'deg)';
    el.classList.toggle('framed', !!it.frame);
    if (it.frame) el.style.setProperty('--pad', Math.max(8, Math.min(it.w, it.h) * 0.05) + 'px');
    el.classList.toggle('selected', sel === it.id);
  }
  function render() {
    fit();
    board.style.backgroundColor = state.bg;
    board.innerHTML = '';
    state.items.forEach(function (it) { var el = itemEl(it); board.appendChild(el); place(it, el); });
    syncUI();
  }
  function syncUI() {
    var it = byId(sel);
    document.querySelectorAll('.item-tools .tool').forEach(function (b) {
      b.disabled = !it || (b.dataset.act === 'frame' && it.kind !== 'photo');
      if (b.dataset.act === 'frame') b.setAttribute('aria-pressed', String(!!(it && it.frame)));
    });
    toolsLabel.textContent = it ? (it.kind === 'text' ? 'Words selected' : it.kind === 'photo' ? 'Photo selected' : 'Sticker selected') : 'Tap something on your board to edit it';
    $('txt-update').disabled = !(it && it.kind === 'text');
    document.querySelectorAll('input[name=btype]').forEach(function (r) { r.checked = r.value === state.type; });
    document.querySelectorAll('#bg-swatches .sw').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.c.toLowerCase() === state.bg.toLowerCase())); });
  }
  function select(id) {
    sel = id;
    board.querySelectorAll('.item').forEach(function (el) { el.classList.toggle('selected', +el.dataset.id === id); });
    syncUI();
  }

  /* ---------- adding items ---------- */
  function addItem(it, atTop) {
    it.id = uid++;
    if (atTop !== false) state.items.push(it); else state.items.unshift(it);
    var el = itemEl(it); board.appendChild(el); place(it, el);
    select(it.id); save();
    try { el.focus({ preventScroll: true }); } catch (e) {}
    return it;
  }
  function addFromLib(kind, entry, cx, cy) {
    var t = T(), base = kind === 'photo' ? 360 : (entry.w > entry.h * 1.6 ? 300 : 200);
    var k = base / Math.max(entry.w, entry.h);
    if (cx == null) { cx = t.w / 2 + (Math.random() - .5) * t.w * .3; cy = t.h / 2 + (Math.random() - .5) * t.h * .3; }
    addItem({ kind: kind, src: entry.src, alt: entry.alt, w: Math.round(entry.w * k), h: Math.round(entry.h * k), cx: cx, cy: cy, rot: kind === 'photo' ? Math.round((Math.random() - .5) * 8) : Math.round((Math.random() - .5) * 16), frame: kind === 'photo' });
    say((kind === 'photo' ? 'Photo' : 'Sticker') + ' added. Drag it where you want it.');
  }
  function textOpts() {
    var cur = document.querySelector('#txt-colours .sw[aria-pressed=true]');
    return { text: ($('txt-input').value || '').trim().slice(0, 80), font: $('txt-font').value, color: cur ? cur.dataset.c : '#3A2B35' };
  }

  /* ---------- pointer interactions on the board ---------- */
  function toBoard(e) { var r = board.getBoundingClientRect(); return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale }; }
  var drag = null;
  function onDown(e) {
    var el = e.target.closest('.item');
    if (!el) { if (e.target === board) select(null); return; }
    var it = byId(+el.dataset.id); if (!it) return;
    e.preventDefault();
    select(it.id); el.focus({ preventScroll: true });
    var p = toBoard(e), h = e.target.dataset && e.target.dataset.h;
    drag = { it: it, el: el, mode: h || 'move', p0: p, cx: it.cx, cy: it.cy, w: it.w, h: it.h, size: it.size, rot: it.rot || 0,
      d0: Math.max(10, Math.hypot(p.x - it.cx, p.y - it.cy)), a0: Math.atan2(p.y - it.cy, p.x - it.cx), pid: e.pointerId };
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
  }
  function onMove(e) {
    if (!drag || e.pointerId !== drag.pid) return;
    e.preventDefault();
    var p = toBoard(e), it = drag.it, t = T();
    if (drag.mode === 'move') {
      it.cx = clamp(drag.cx + p.x - drag.p0.x, 0, t.w); it.cy = clamp(drag.cy + p.y - drag.p0.y, 0, t.h);
    } else if (drag.mode === 'resize') {
      var f = Math.hypot(p.x - it.cx, p.y - it.cy) / drag.d0;
      if (it.kind === 'text') it.size = clamp(Math.round(drag.size * f), 14, 400);
      else { f = clamp(f, 40 / Math.min(drag.w, drag.h), 2400 / Math.max(drag.w, drag.h)); it.w = Math.round(drag.w * f); it.h = Math.round(drag.h * f); }
    } else if (drag.mode === 'rotate') {
      var a = drag.rot + (Math.atan2(p.y - it.cy, p.x - it.cx) - drag.a0) * 180 / Math.PI;
      a = ((a + 540) % 360) - 180; if (Math.abs(a) < 4) a = 0;
      it.rot = Math.round(a);
    }
    place(it, drag.el);
  }
  function onUp(e) { if (!drag || e.pointerId !== drag.pid) return; drag = null; save(); }

  /* ---------- library: tap to add, or drag onto the board ---------- */
  function libGrid(container, list, kind) {
    list.forEach(function (entry) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'lib-item';
      b.setAttribute('aria-label', 'Add ' + (kind === 'photo' ? 'photo: ' : 'sticker: ') + entry.alt);
      var img = document.createElement('img'); img.src = entry.src; img.alt = ''; img.loading = 'lazy'; img.draggable = false; b.appendChild(img);
      var st = null, ghost = null;
      b.addEventListener('pointerdown', function (e) { if (e.button > 0) return; st = { x: e.clientX, y: e.clientY, id: e.pointerId }; });
      b.addEventListener('pointermove', function (e) {
        if (!st || e.pointerId !== st.id) return;
        if (!ghost && Math.hypot(e.clientX - st.x, e.clientY - st.y) > 8) {
          ghost = img.cloneNode(); ghost.className = 'drag-ghost'; document.body.appendChild(ghost);
          try { b.setPointerCapture(e.pointerId); } catch (err) {}
        }
        if (ghost) { e.preventDefault(); ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px'; }
      });
      function end(e, cancelled) {
        if (!st || e.pointerId !== st.id) return;
        if (ghost) {
          ghost.remove(); ghost = null;
          var r = board.getBoundingClientRect();
          if (!cancelled && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
            var p = toBoard(e); addFromLib(kind, entry, p.x, p.y);
          }
          b.dataset.dragged = '1'; setTimeout(function () { delete b.dataset.dragged; }, 50);
        }
        st = null;
      }
      b.addEventListener('pointerup', function (e) { end(e, false); });
      b.addEventListener('pointercancel', function (e) { end(e, true); });
      b.addEventListener('click', function () { if (b.dataset.dragged) return; addFromLib(kind, entry); });
      container.appendChild(b);
    });
  }

  /* ---------- export ---------- */
  function loadImg(src) {
    return new Promise(function (res, rej) { var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { rej(new Error('Could not load ' + src)); }; im.src = src; });
  }
  async function exportPNG() {
    var t = T(), cv = document.createElement('canvas'), k = 1.5;
    cv.width = t.w * k; cv.height = t.h * k;
    var ctx = cv.getContext('2d'); ctx.scale(k, k);
    ctx.fillStyle = state.bg; ctx.fillRect(0, 0, t.w, t.h);
    var fonts = {}; state.items.forEach(function (it) { if (it.kind === 'text') fonts[it.font] = 1; });
    if (document.fonts) await Promise.all(Object.keys(fonts).map(function (f) { return document.fonts.load('40px "' + f + '"').catch(function () {}); }));
    for (var i = 0; i < state.items.length; i++) {
      var it = state.items[i];
      ctx.save(); ctx.translate(it.cx, it.cy); ctx.rotate((it.rot || 0) * Math.PI / 180);
      if (it.kind === 'text') {
        ctx.font = it.size + 'px ' + (FONT_STACK[it.font] || 'cursive'); ctx.fillStyle = it.color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        var lines = String(it.text).split('\n'), lh = it.size * 1.15;
        lines.forEach(function (ln, j) { ctx.fillText(ln, 0, (j - (lines.length - 1) / 2) * lh); });
      } else {
        var im = await loadImg(it.src);
        ctx.shadowColor = 'rgba(58,43,53,.22)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
        if (it.kind === 'photo' && it.frame) {
          var pad = Math.max(8, Math.min(it.w, it.h) * 0.05);
          ctx.fillStyle = '#fff'; ctx.fillRect(-it.w / 2 - pad, -it.h / 2 - pad, it.w + pad * 2, it.h + pad * 2);
          ctx.shadowColor = 'transparent';
        }
        ctx.drawImage(im, -it.w / 2, -it.h / 2, it.w, it.h);
      }
      ctx.restore();
    }
    // small watermark
    ctx.font = '22px "Kaushan Script", cursive'; ctx.fillStyle = 'rgba(58,43,53,.45)'; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillText('made on rebella', t.w - 18, t.h - 12);
    return new Promise(function (res, rej) { try { cv.toBlob(function (b) { b ? res(b) : rej(new Error('Export failed')); }, 'image/png'); } catch (e) { rej(e); } });
  }

  /* ---------- actions ---------- */
  function act(name) {
    var it = byId(sel); if (!it) return;
    var i = state.items.indexOf(it);
    if (name === 'delete') { state.items.splice(i, 1); sel = null; render(); say('Deleted.'); }
    else if (name === 'forward' && i < state.items.length - 1) { state.items.splice(i, 1); state.items.splice(i + 1, 0, it); render(); }
    else if (name === 'back' && i > 0) { state.items.splice(i, 1); state.items.splice(i - 1, 0, it); render(); }
    else if (name === 'dup') { var c = JSON.parse(JSON.stringify(it)); c.cx += 30; c.cy += 30; addItem(c); }
    else if (name === 'frame' && it.kind === 'photo') { it.frame = !it.frame; place(it); syncUI(); }
    save();
  }
  function setType(type) {
    if (!TYPES[type] || type === state.type) return;
    var o = T(), n = TYPES[type];
    state.type = type;
    state.items.forEach(function (it) { it.cx = clamp(it.cx * n.w / o.w, 0, n.w); it.cy = clamp(it.cy * n.h / o.h, 0, n.h); });
    if (!state.items.length) starter();
    render(); save(); say('Switched to a ' + n.name + '.');
  }
  function starter() { (STARTERS[state.type] || []).forEach(function (s) { var c = JSON.parse(JSON.stringify(s)); c.id = uid++; state.items.push(c); }); }

  function swatches(container, list, onPick, cls) {
    list.forEach(function (c) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'sw' + (cls ? ' ' + cls : ''); b.dataset.c = c[0];
      b.style.background = c[0]; b.title = c[1]; b.setAttribute('aria-label', c[1]); b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { onPick(c[0], b); });
      container.appendChild(b);
    });
  }

  function init() {
    board = $('board'); wrap = $('board-wrap'); statusEl = $('status'); toolsLabel = $('sel-label');
    if (!board) return;
    if (!load()) starter();
    swatches($('bg-swatches'), BGS, function (c) { state.bg = c; board.style.backgroundColor = c; $('bg-custom').value = c.toLowerCase(); syncUI(); save(); });
    $('bg-custom').addEventListener('input', function (e) { state.bg = e.target.value; board.style.backgroundColor = state.bg; syncUI(); save(); });
    swatches($('txt-colours'), TXT_COLS, function (c, b) {
      document.querySelectorAll('#txt-colours .sw').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
    document.querySelector('#txt-colours .sw').setAttribute('aria-pressed', 'true');
    libGrid($('grid-stickers'), LIB.stickers, 'sticker');
    libGrid($('grid-photos'), LIB.photos, 'photo');

    document.querySelectorAll('input[name=btype]').forEach(function (r) { r.addEventListener('change', function () { if (r.checked) setType(r.value); }); });
    document.querySelectorAll('.item-tools .tool').forEach(function (b) { b.addEventListener('click', function () { act(b.dataset.act); }); });

    board.addEventListener('pointerdown', onDown);
    board.addEventListener('pointermove', onMove);
    board.addEventListener('pointerup', onUp);
    board.addEventListener('pointercancel', onUp);
    board.addEventListener('dblclick', function (e) {
      var el = e.target.closest('.item'); var it = el && byId(+el.dataset.id);
      if (it && it.kind === 'text') { showTab('text'); $('txt-input').value = it.text; $('txt-font').value = it.font; $('txt-input').focus(); }
    });
    board.addEventListener('keydown', function (e) {
      var it = byId(sel); if (!it || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      var step = e.shiftKey ? 20 : 5, moved = true;
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); act('delete'); return; }
      if (e.key === 'ArrowLeft') it.cx -= step; else if (e.key === 'ArrowRight') it.cx += step;
      else if (e.key === 'ArrowUp') it.cy -= step; else if (e.key === 'ArrowDown') it.cy += step;
      else if (e.key === '+' || e.key === '=') { if (it.kind === 'text') it.size = Math.min(400, it.size + 4); else { it.w *= 1.06; it.h *= 1.06; } }
      else if (e.key === '-') { if (it.kind === 'text') it.size = Math.max(14, it.size - 4); else { it.w /= 1.06; it.h /= 1.06; } }
      else if (e.key === 'r' || e.key === 'R') it.rot = ((it.rot || 0) + (e.shiftKey ? -5 : 5));
      else if (e.key === 'Escape') { select(null); moved = false; }
      else moved = false;
      if (moved) { e.preventDefault(); place(it); save(); }
    });
    board.addEventListener('focusin', function (e) { var el = e.target.closest('.item'); if (el && +el.dataset.id !== sel) select(+el.dataset.id); });

    $('txt-add').addEventListener('click', function () {
      var o = textOpts(); if (!o.text) { say('Type some words first.'); return; }
      var t = T();
      addItem({ kind: 'text', text: o.text, font: o.font, color: o.color, size: 72, cx: t.w / 2, cy: t.h / 2, rot: 0 });
      say('Words added.');
    });
    $('txt-update').addEventListener('click', function () {
      var it = byId(sel); if (!it || it.kind !== 'text') return;
      var o = textOpts(); if (!o.text) return;
      it.text = o.text; it.font = o.font; it.color = o.color; place(it); save(); say('Words updated.');
    });
    $('save-btn').addEventListener('click', function () { say(save(true) ? 'Saved in this browser. It will be here next time you visit.' : 'Couldn\u2019t save (storage is full or blocked).'); });
    $('clear-btn').addEventListener('click', function () {
      if (!state.items.length) return;
      if (!window.confirm('Clear everything off your board?')) return;
      state.items = []; sel = null; render(); save(true); say('Board cleared.');
    });
    $('download-btn').addEventListener('click', async function () {
      var b = this; b.disabled = true; say('Making your picture\u2026');
      try {
        var blob = await exportPNG(), url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = 'rebella-' + state.type + '-board.png'; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        say('Downloaded! Check your downloads or photos.');
      } catch (err) { say('Sorry, the download didn\u2019t work: ' + err.message); }
      finally { b.disabled = false; }
    });

    // tabs
    function showTab(name) {
      ['stickers', 'photos', 'text'].forEach(function (n) {
        var on = n === name, tab = $('tab-' + n);
        tab.setAttribute('aria-selected', String(on)); tab.tabIndex = on ? 0 : -1; $('panel-' + n).hidden = !on;
      });
    }
    var tabs = ['stickers', 'photos', 'text'];
    tabs.forEach(function (n, i) {
      var tab = $('tab-' + n);
      tab.addEventListener('click', function () { showTab(n); });
      tab.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        var nx = tabs[(i + d + tabs.length) % tabs.length]; showTab(nx); $('tab-' + nx).focus();
      });
    });

    // Re-fit whenever the board area changes size. This also covers the passcode gate: the page is hidden (0px wide)
    // until it is unlocked, so when it first becomes visible we re-render fully (text needs measuring).
    var lastW = 0;
    var onSize = function () { var w = wrap.clientWidth; if (!w) { lastW = 0; return; } if (!lastW) render(); else if (w !== lastW) fit(); lastW = w; };
    if (window.ResizeObserver) new ResizeObserver(onSize).observe(wrap);
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(onSize, 120); });
    document.addEventListener('DOMContentLoaded', function () { setTimeout(onSize, 0); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { state.items.forEach(function (it) { if (it.kind === 'text') place(it); }); });
    render();
    window.RebellaCreate = { state: state, exportPNG: exportPNG, render: render };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
