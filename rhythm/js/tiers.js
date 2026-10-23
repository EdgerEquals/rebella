/* Rebella rhythm: progressive load tiers (see README "Load tiers").
   T0 inline/defer: HTML, critical CSS, symbol sprite, physics, movers (organism lanes 5/8/13 s).
   T1 first scroll / tap / key: article lists from <template>, nebula canvas, slow organism lanes (21/34/55 s).
   T2 sphere section within 61.8% of a viewport, or a tap on it: chrome-less sphere (three.js + 5 KB subset).
   T3 deeper engagement (8 interactions, a Curie or Gd-Dy knee crossing): mind overlay + procedural morphs.
   Audio: only after the visitor presses Sound (a gesture); off by default. */
(function () {
  'use strict';
  var RB = window.RB; if (!RB) return;
  var base = document.currentScript.src, url = function (f) { return new URL(f, base).href; };
  RB.tier = 0;
  function idle(f) { (window.requestIdleCallback || function (g) { setTimeout(g, 618); })(f); }
  idle(function () { ['nebula.js', 'sphere.js'].forEach(function (f) { var l = document.createElement('link'); l.rel = 'modulepreload'; l.href = url(f); document.head.appendChild(l); }); });
  function tier1() {
    if (RB.tier >= 1) return; RB.tier = 1;
    ['feat', 'fresh'].forEach(function (k) { var t = document.getElementById('t-' + k), s = document.getElementById(k + '-slot'); if (t && s) s.replaceChildren(t.content.cloneNode(true)); });
    if (!RB.S.reduced) import(url('nebula.js'));
    ['scroll', 'pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (e) { removeEventListener(e, tier1); });
  }
  ['scroll', 'pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (e) { addEventListener(e, tier1, { passive: true }); });
  var stage = document.getElementById('stage'), sphereOn = false;
  function tier2() { if (sphereOn) return; sphereOn = true; tier1(); RB.tier = Math.max(RB.tier, 2); import(url('sphere.js')).then(function (m) { m.mount(stage, url('../data/sphere-subset.json')); }); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); tier2(); } }, { rootMargin: '61.8% 0px' });
    io.observe(stage);
  } else tier2();
  stage.addEventListener('pointerdown', tier2, { once: true });
  var t3 = false;
  function tier3() { if (t3 || RB.S.reduced) return; t3 = true; RB.tier = Math.max(RB.tier, 3); import(url('mind.js')); import(url('morph.js')); }
  RB.cue(function (k) { if (k === 'curie' || k === 'knee' || k === 'alphabeta') tier3(); });
  RB.on(function (S) { if (!t3 && S.interactions >= 8) tier3(); });
  var snd = document.getElementById('snd'), audio = null;
  snd.addEventListener('click', function () {
    var on = snd.getAttribute('aria-pressed') !== 'true';
    snd.setAttribute('aria-pressed', String(on)); snd.textContent = on ? 'Sound on' : 'Sound off';
    if (on && !audio) audio = import(url('audio.js')).then(function (m) { return m.start(); });
    if (audio) audio.then(function (a) { a.set(on); });
  });
})();
