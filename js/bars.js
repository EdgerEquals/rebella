/* Shared bars (Rebella). Two jobs only:
   1) Measure the locked header/footer heights so the page content is padded clear of them (never moves the bars).
   2) Visitor audience: the optional nickname. It is stored ONLY in this browser's localStorage under
      'rebella-visitor' as {v:1, name, savedOn:'YYYY-MM-DD'}. It is never sent, logged, fetched, put in a URL or analytics.
      If storage is blocked (eg private mode) it works for this visit only and fails silently. */
(function () {
  'use strict';
  var root = document.documentElement;
  var head = document.getElementById('app-head'), foot = document.getElementById('app-foot');
  if (!head || !foot) return;
  document.body.classList.add('has-bars');

  function measure() {
    if (head.offsetHeight) root.style.setProperty('--app-head-h', head.offsetHeight + 'px');
    if (foot.offsetHeight) root.style.setProperty('--app-foot-h', foot.offsetHeight + 'px');
  }
  measure();
  if ('ResizeObserver' in window) { var ro = new ResizeObserver(measure); ro.observe(head); ro.observe(foot); }
  else window.addEventListener('resize', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure, function () {});

  if (head.getAttribute('data-audience') !== 'visitor') return;

  /* ---------- nickname (visitor only) ---------- */
  var KEY = 'rebella-visitor', FADE = 618; // PHI^-1 s greeting fade
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BAD = ['fuck', 'shit', 'bitch', 'cunt', 'wank', 'twat', 'slut', 'whore', 'bastard', 'nigg', 'fag', 'retard', 'porn', 'nazi', 'rape', 'pussy', 'penis', 'vagina', 'boob', 'bollock', 'dickhead', 'arsehole', 'asshole', 'cock'];
  var BAD_WORD = ['ass', 'arse', 'tit', 'tits', 'cum', 'sex', 'sexy', 'piss', 'poo', 'poop', 'kill', 'die', 'hate'];
  var memory = null; // fallback for this visit when storage is blocked

  function clean(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  // returns '' when ok, else a short reason
  function check(n) {
    if (!n) return 'empty';
    if (n.length > 20) return 'Up to 20 letters, please';
    if (!/^\p{L}[\p{L} -]*$/u.test(n) || /[ -]{2,}/.test(n)) return 'Letters, spaces and hyphens only';
    var flat = n.toLowerCase().replace(/[ -]/g, '');
    for (var i = 0; i < BAD.length; i++) if (flat.indexOf(BAD[i]) !== -1) return "Let's pick a different name";
    var words = n.toLowerCase().split(/[ -]+/);
    for (var j = 0; j < words.length; j++) if (BAD_WORD.indexOf(words[j]) !== -1) return "Let's pick a different name";
    return '';
  }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function load() {
    var raw = null;
    try { raw = window.localStorage.getItem(KEY); } catch (e) { return memory; }
    if (raw == null) return memory;
    try {
      var o = JSON.parse(raw), n = o && o.v === 1 ? clean(o.name) : '';
      if (n && !check(n) && /^\d{4}-\d{2}-\d{2}$/.test(o.savedOn || '')) return { v: 1, name: n, savedOn: o.savedOn };
    } catch (e) {}
    try { window.localStorage.removeItem(KEY); } catch (e) {} // invalid: drop it
    return null;
  }
  function save(n) {
    var rec = { v: 1, name: n, savedOn: today() };
    memory = rec;
    try { window.localStorage.setItem(KEY, JSON.stringify(rec)); } catch (e) {}
    return rec;
  }
  function forget() { memory = null; try { window.localStorage.removeItem(KEY); } catch (e) {} }

  var $ = function (id) { return document.getElementById(id); };
  var greet = $('bar-greet'), right = foot.querySelector('.ft-right');
  var ask = $('vn-ask'), known = $('vn-known'), who = $('vn-who'), form = $('vn-form'), inp = $('vn-in'), note = $('vn-note');
  var NEUTRAL = greet ? greet.textContent : 'Hey there, welcome to Rebella';
  var NOTE = note ? note.textContent : 'Stays on this device only';
  // Return-visit greetings: picked by the day (same all day, on every page), never at random per page.
  var BACK = ['Welcome back, {n}', 'Good to see you again, {n}', 'Hi again, {n}. Glad you\u2019re here', 'Welcome back, {n}. What\u2019s calling you today?'];
  function dayIndex() { var d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); }

  function setGreeting(text) {
    if (!greet || greet.textContent === text) return;
    // the help orb may be showing an answer in this line: update what it will restore to instead
    if (greet.hasAttribute('data-help-busy')) { greet.setAttribute('data-help-original', text); return; }
    if (reduce) { greet.textContent = text; return; }
    greet.classList.add('fading');
    setTimeout(function () { greet.textContent = text; greet.classList.remove('fading'); }, FADE);
  }
  function show(state, rec, fresh) {
    ask.hidden = state !== 'ask'; known.hidden = state !== 'known'; form.hidden = state !== 'edit';
    right.classList.toggle('vn-editing', state === 'edit');
    if (rec) who.textContent = rec.name;
  }
  function render(rec, fresh) {
    if (rec) {
      setGreeting(fresh ? 'Hey ' + rec.name + ', welcome to Rebella' : BACK[dayIndex() % BACK.length].replace('{n}', rec.name));
      show('known', rec);
    } else { setGreeting(NEUTRAL); show('ask'); }
  }
  function edit(prefill) {
    note.textContent = NOTE; inp.value = prefill || ''; show('edit');
    try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); }
  }
  function commit() {
    var n = clean(inp.value), why = check(n);
    if (why === 'empty') { cancel(); return; }
    if (why) { note.textContent = why; return; }
    var rec = save(n); render(rec, true);
    try { $('vn-change').focus({ preventScroll: true }); } catch (e) {}
  }
  function cancel() { render(load(), false); try { (ask.hidden ? $('vn-change') : ask).focus({ preventScroll: true }); } catch (e) {} }

  ask.addEventListener('click', function () { edit(''); });
  $('vn-change').addEventListener('click', function () { var r = load(); edit(r ? r.name : ''); });
  $('vn-forget').addEventListener('click', function () { forget(); render(null); try { ask.focus({ preventScroll: true }); } catch (e) {} });
  $('vn-save').addEventListener('click', commit);
  $('vn-skip').addEventListener('click', cancel);
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    else if (e.key === 'Escape') { e.preventDefault(); cancel(); }
  });
  inp.addEventListener('input', function () { if (note.textContent !== NOTE) note.textContent = NOTE; });

  // first paint: no fade, so a returning reader is greeted straight away
  var start = load();
  if (start && greet) greet.textContent = BACK[dayIndex() % BACK.length].replace('{n}', start.name);
  show(start ? 'known' : 'ask', start);
  // another Rebella tab changed it: follow along quietly
  window.addEventListener('storage', function (e) { if (e.key === KEY || e.key === null) render(load(), false); });

  window.RebellaVisitor = { check: check, load: load }; // read-only helpers for tests
})();
