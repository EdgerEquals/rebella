/* Rebella rhythm: cascade loading (spec 8, 11; see README "Load tiers"). Each later layer < 15 KB.
   L0 page load: HTML + critical CSS (one --phi variable), site-consts, site-physics, field (the one shader), tiers.
   L1 first idle after paint (requestIdleCallback): genomes (8 drawn links, the only navigation).
   L2 first scroll / tap / key / wheel / touch: article lists from <template>.
   L3 engagement >= T0*phi^2 (12.6 s, never announced): mind overlay.
   L4 sphere within 1/phi of a viewport, or a tap on it: chrome-less sphere (three.js + 5.5 KB subset).
   L5 windowing past a physics threshold: imaginarium.   L6 depth > 1/phi or round(phi^5) = 11 taps: 3D entities.
   A  the Sound button (a gesture): audio. */
(function () {
  'use strict';
  var RB = window.RB; if (!RB) return;
  var S = RB.S, PHI = RB.PHI, pw = RB.pw, base = document.currentScript.src, url = function (f) { return new URL(f, base).href; };
  RB.tier = 0;
  function idle(f) { (window.requestIdleCallback || function (g) { setTimeout(g, 1000 / PHI); })(f); }
  function script(f) { var s = document.createElement('script'); s.src = url(f); s.async = true; document.head.appendChild(s); }
  idle(function () { script('genomes.js'); RB.tier = 1; idle(function () { var l = document.createElement('link'); l.rel = 'modulepreload'; l.href = url('sphere.js'); document.head.appendChild(l); }); });
  function l2() {
    if (RB.l2) return; RB.l2 = true; RB.tier = Math.max(RB.tier, 2);
    ['feat', 'fresh'].forEach(function (k) { var t = document.getElementById('t-' + k), s = document.getElementById(k + '-slot'); if (t && s) s.replaceChildren(t.content.cloneNode(true)); });
    EV.forEach(function (e) { removeEventListener(e, l2); });
  }
  var EV = ['scroll', 'pointerdown', 'keydown', 'wheel', 'touchstart']; EV.forEach(function (e) { addEventListener(e, l2, { passive: true }); });
  var mindOn = false;
  RB.on(function (S) { if (!mindOn && !S.reduced && S.eng >= S.T0 * pw(2)) { mindOn = true; RB.tier = Math.max(RB.tier, 3); import(url('mind.js')); } });
  var stage = document.getElementById('stage'), sphereOn = false;
  function l4() { if (sphereOn) return; sphereOn = true; l2(); RB.tier = Math.max(RB.tier, 4); import(url('sphere.js')).then(function (m) { m.mount(stage, url('../data/sphere-subset.json')); }); }
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); l4(); } }, { rootMargin: (100 / PHI).toFixed(1) + '% 0px' }); io.observe(stage); } else l4();
  stage.addEventListener('pointerdown', l4, { once: true });
  var snd = document.getElementById('snd'), audio = null;
  snd.addEventListener('click', function () {
    var on = snd.getAttribute('aria-pressed') !== 'true'; snd.setAttribute('aria-pressed', String(on)); snd.textContent = on ? 'Sound on' : 'Sound off';
    if (on && !audio) audio = import(url('audio.js')).then(function (m) { return m.start(); });
    if (audio) audio.then(function (a) { a.set(on); });
  });
})();
