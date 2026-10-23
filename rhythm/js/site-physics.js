/* Rebella rhythm: site physics model (tier 0). One visibility-paused rAF loop, fixed 30 Hz physics step.
   Five coupled nonlinear oscillator BANDS at f0*phi^n. f0 = the sphere's lowest l=0 shell mode (1.011 MHz,
   EdgerEquals/sphere-holster base5) time-scaled by phi^-32. Because phi^(n+1) = phi^n + phi^(n-1), every
   neighbouring triple is exactly three-wave resonant (f[n+1] = f[n] + f[n-1]), so a cubic coupling term
   x[n-1]x[n]x[n+1] moves energy between bands: swells, dips and beats with no random numbers anywhere.
   Visitor = main nonlinear element: pointer, scroll, taps, stillness and tilt push the bands in phase with
   their own motion (positive feedback, tanh-saturated). Damping Q per band = log_phi(Q of a real layer).
   Outputs: depth/swirl (space-time), Balmer colour/brightness (light), band energies (sound, tier A).
   ESTIMATED PHYSICS: the sphere model is a v0 paper model; mapping gains are noted inline. */
(function () {
  'use strict';
  var C = window.RB_CONST, PHI = C.phi, TAU = 2 * Math.PI, LP = Math.log(PHI);
  var pw = function (n) { return Math.pow(PHI, n); };
  var N = 5, M_VIS = 32;
  var f0 = C.l0[0][0] / pw(M_VIS);                  // 0.2076 Hz: ~ resting breathing rate (12.5 /min)
  var w = [], q = [], x = [], v = [], E = [], awake = [];
  for (var k = 0; k < N; k++) {
    w[k] = TAU * f0 * pw(k);                         // band 4 = 1.42 Hz: ~ heart rate (85 /min)
    q[k] = Math.log(C.bandQ[k]) / LP;               // quartz 2100 -> 15.9 ... calorivac 20 -> 6.2
    x[k] = 0; v[k] = 0; E[k] = 0; awake[k] = false;
  }
  var KAPPA = 1 / pw(2), BETA = 1 / PHI, SAT = 1 / PHI; // coupling, Duffing hardening, push saturation
  var TH_ON = 1 / pw(2), TH_OFF = TH_ON / PHI;        // band wake-up hysteresis (Schmitt), amplitude^2
  var T = C.T, Tref = T.T_ref_K, TAU_TH = 13;         // site "temperature" relaxes in 13 s (Fibonacci)
  var HEAT = (T.T_curie_bto_K - Tref) * PHI * PHI;         // mapping gain: sustained lively input reaches 393 K
  var S = {
    t: 0, f0: f0, w: w, q: q, x: x, E: E, Etot: 0, awake: awake, T: Tref, D: 0, Dv: 0, Omega: 0, theta: 0,
    still: 0, rgb: [255, 240, 235], B: 0, gaze: [0.5, 0.5], tilt: [0, 0], limit: 13, interactions: 0,
    hot: false, cold: false, glass: false, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, PHI: PHI
  };
  var subs = [], cues = [];
  var RB = window.RB = { S: S, on: function (f) { subs.push(f); }, cue: function (f) { cues.push(f); }, kick: kick, PHI: PHI, pw: pw };
  function emit(kind, data) { for (var i = 0; i < cues.length; i++) cues[i](kind, data || {}); }

  // ---- visitor input (accumulated, consumed by the fixed step) ----
  var inp = { p: [innerWidth / 2, innerHeight / 2], pv: [0, 0], speed: 0, scroll: 0, lastY: scrollY, lastT: performance.now(), idle: 0 };
  RB.input = inp;
  function touch() { inp.idle = 0; S.interactions++; }
  addEventListener('pointermove', function (e) {
    var now = performance.now(), dt = Math.max(8, now - inp.lastT) / 1000;
    var dx = e.clientX - inp.p[0], dy = e.clientY - inp.p[1];
    inp.pv = [dx / dt, dy / dt]; inp.p = [e.clientX, e.clientY]; inp.lastT = now;
    inp.speed += Math.hypot(dx, dy) / Math.hypot(innerWidth, innerHeight);   // viewport diagonals travelled
    S.gaze = [e.clientX / innerWidth, e.clientY / innerHeight]; inp.idle = 0;
  }, { passive: true });
  addEventListener('scroll', function () { inp.scroll += Math.abs(scrollY - inp.lastY) / innerHeight; inp.lastY = scrollY; inp.idle = 0; }, { passive: true });
  addEventListener('pointerdown', function () { touch(); kick(1 / PHI, -1); }, { passive: true });
  addEventListener('keydown', function () { touch(); }, { passive: true });
  addEventListener('deviceorientation', function (e) {
    if (e.beta == null) return;
    var b = e.beta / 90, g = e.gamma / 90, d = Math.hypot(b - S.tilt[0], g - S.tilt[1]);
    S.tilt = [b, g]; inp.speed += d / PHI; S.gaze = [0.5 + g / 2, 0.5 + b / 2];
  }, { passive: true });

  // impulse: band < 0 = broadband (a tap), else into one band (collisions)
  function kick(j, band) {
    for (var k = 0; k < N; k++) if (band < 0 || band === k) v[k] += j * w[k] * (v[k] >= 0 ? 1 : -1);
  }
  function push(k, u, dt) { // phase-locked push: positive feedback like pumping a swing, saturating
    var amp = Math.sqrt(E[k]); v[k] += w[k] * Math.tanh(u / SAT) * (v[k] >= 0 ? 1 : -1) * dt * (1 - Math.tanh(amp / PHI));
  }

  // Balmer lines -> sRGB (approximate CIE fit, Bruton 1996)
  function wl(nm) {
    var r = 0, g = 0, b = 0;
    if (nm < 440) { r = -(nm - 440) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = -(nm - 510) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = -(nm - 645) / 65; } else r = 1;
    return [r, g, b];
  }
  var LINES = C.balmer.map(function (l) { return { c: wl(l[0]), w: l[1] }; });

  function step(dt) {
    S.t += dt; inp.idle += dt;
    var still = 1 - Math.exp(-inp.idle / 21);         // stillness builds over ~21 s (Fibonacci)
    S.still = still;
    var uP = inp.speed / dt, uS = inp.scroll / dt; inp.speed = 0; inp.scroll = 0;
    // visitor drives: scroll -> bands 1-2, pointer/tilt -> bands 3-4, stillness (presence) -> band 0
    push(0, still / pw(3), dt); push(1, uS / PHI, dt); push(2, uS / pw(2), dt); push(3, uP / PHI, dt); push(4, uP, dt);
    var P = 0, Et = 0;
    for (var k = 0; k < N; k++) {
      var c = 0;                                        // -dU/dx_k for U = kappa * sum x[n-1] x[n] x[n+1]
      if (k >= 1 && k + 1 < N) c += x[k - 1] * x[k + 1];
      if (k >= 2) c += x[k - 2] * x[k - 1];
      if (k + 2 < N) c += x[k + 1] * x[k + 2];
      var a = -w[k] * w[k] * (x[k] + BETA * x[k] * x[k] * x[k] + KAPPA * c) - (w[k] / q[k]) * v[k];
      v[k] += a * dt; x[k] += v[k] * dt;                // semi-implicit Euler
      E[k] = x[k] * x[k] + (v[k] / w[k]) * (v[k] / w[k]);
      if (k) P += (w[k] / q[k]) * (v[k] / w[k]) * (v[k] / w[k]); Et += E[k];
      if (!awake[k] && E[k] > TH_ON) { awake[k] = true; emit('wake', { band: k }); }
      else if (awake[k] && E[k] < TH_OFF) { awake[k] = false; emit('sleep', { band: k }); }
    }
    S.Etot = Et;
    // temperature: power dissipated by the activity bands 1-4 heats (band 0 is the resting/breathing mode), stillness cools toward below the Gd-Dy knee (260 K)
    var Tt = Tref - (Tref - T.T_c_gddy_K) * PHI * still + HEAT * Math.tanh(P * PHI);
    S.T += (Tt - S.T) * dt / TAU_TH;
    var hw = (T.T_curie_bto_K - Tref) / pw(3);           // thermal hysteresis width
    if (!S.hot && S.T > T.T_curie_bto_K) { S.hot = true; emit('curie', { up: true }); }
    else if (S.hot && S.T < T.T_curie_bto_K - hw) { S.hot = false; emit('curie', { up: false }); }
    if (!S.cold && S.T < T.T_c_gddy_K) { S.cold = true; emit('knee', { down: true }); }
    else if (S.cold && S.T > T.T_c_gddy_K + hw) { S.cold = false; emit('knee', { down: false }); }
    if (!S.glass && S.T > T.T_quartz_alpha_beta_K) { S.glass = true; emit('alphabeta', {}); }
    else if (S.glass && S.T < T.T_quartz_alpha_beta_K - hw * PHI) S.glass = false;
    // depth: underdamped (Q = phi^2) so it overshoots and returns; target from stillness, cooled by heat
    var heatF = Math.max(0, Math.min(1, (S.T - Tref) / (T.T_curie_bto_K - Tref)));
    var Dt = Math.max(0, Math.min(1, still * (1 - heatF) / PHI + x[0] / pw(3) + (S.cold ? 1 / pw(3) : 0)));
    var wD = TAU * f0 / pw(2), qD = pw(2);
    S.Dv += (-wD * wD * (S.D - Dt) - (wD / qD) * S.Dv) * dt; S.D += S.Dv * dt;
    S.D = Math.max(0, Math.min(1, S.D));
    // swirl: angular momentum L conserved while the effective radius shrinks with depth: Omega = L / r^2
    var L = TAU * f0 / pw(3) * (1 + Math.tanh(Et) / PHI), r = 1 - S.D / PHI;
    S.Omega = L / (r * r); S.theta += S.Omega * dt;
    // light: band energies weight the Balmer lines (656 <- bands 0-1, 486 <- 2, 434 <- 3-4)
    var A = [E[3] + E[4], E[2], E[0] + E[1]], rgb = [0, 0, 0], ws = 0;
    for (var i = 0; i < 3; i++) { var m = LINES[i].w * (A[i] + 1 / pw(4)); ws += m; for (var j = 0; j < 3; j++) rgb[j] += LINES[i].c[j] * m; }
    S.rgb = rgb.map(function (c) { return Math.round(255 * Math.min(1, c / ws * PHI)); });
    S.B = 1 - Math.exp(-Et);
  }

  // ---- governor: Fibonacci concurrency limit from depth, stepped down if frames run slow ----
  var FIB = [2, 3, 5, 8, 13], gov = 0, ema = 16, good = 0;
  function govern(ms) {
    ema += (ms - ema) / 13;
    if (ema > 1000 / 30 && gov > -4) { gov--; ema = 16; good = 0; }
    else if (ema < 1000 / 55 && gov < 0 && (good += ms) > 5000) { gov++; good = 0; }
    var idx = Math.round((1 - S.D) * 4) + gov;
    S.limit = FIB[Math.max(0, Math.min(4, idx))];
  }

  var raf = 0, last = 0, acc = 0, H = 1 / 30;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    var ms = last ? now - last : 16; last = now;
    var dt = Math.min(ms / 1000, 0.1); acc += dt;
    while (acc >= H) { step(H); acc -= H; }
    govern(ms);
    for (var i = 0; i < subs.length; i++) subs[i](S, dt);
  }
  function start() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }
  document.addEventListener('visibilitychange', function () {
    document.documentElement.classList.toggle('paused', document.hidden);
    if (document.hidden) stop(); else start();
  });
  RB.start = start;
  start();
})();
