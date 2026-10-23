/* Rebella rhythm: site physics (load tier L0). PHI is the only ratio (spec 10): every timing, step and count
   below is base x phi^n, where the one time base T0 = 1/f0 comes from the sphere model, and the one device
   constant is the display frame F = 1/60 s (hardware refresh, not a design ratio).
   Bands: 5 coupled nonlinear oscillators at f0*phi^n, f0 = sphere's lowest l=0 shell mode 1.011 MHz / phi^32
   (EdgerEquals/sphere-holster base5). phi^(n+1) = phi^n + phi^(n-1), so neighbouring triples are exactly
   three-wave resonant and the cubic coupling trades energy between bands (swells, dips, beats). Damping per band
   Q = log_phi(Q of a real layer). Visitor = main nonlinear element (phase-locked, tanh-saturated pushes).
   Global drifting state (spec 12): S.tau = site time (runs at phi^-D, slower when deep and when the
   imaginarium downshifts), S.psi = where the site sits in space (drifts with swirl, jumps a golden angle on
   every navigation). Engagement S.eng (dwell + interactions) drives progressive revelation (spec 13).
   ESTIMATED PHYSICS: the sphere model is a v0 paper model; mapping gains are noted inline. */
(function () {
  'use strict';
  var C = window.RB_CONST, PHI = C.phi, TAU = 2 * Math.PI, LP = Math.log(PHI);
  var pw = function (n) { return Math.pow(PHI, n); };
  var F = 1 / 60, N = 5, M_VIS = 32;
  var f0 = C.l0[0][0] / pw(M_VIS), T0 = 1 / f0;     // 0.2076 Hz, T0 = 4.817 s (~ resting breath)
  var GA = TAU / pw(2);                              // golden angle 137.5 deg
  var w = [], q = [], x = [], v = [], E = [], awake = [];
  for (var k = 0; k < N; k++) { w[k] = TAU * f0 * pw(k); q[k] = Math.log(C.bandQ[k]) / LP; x[k] = v[k] = E[k] = 0; awake[k] = false; }
  var KAPPA = pw(-2), BETA = pw(-1), SAT = pw(-1), TH_ON = pw(-2), TH_OFF = pw(-3);
  var T = C.T, Tref = T.T_ref_K, TAU_TH = T0 * pw(2), HEAT = (T.T_curie_bto_K - Tref) * pw(2), HW = (T.T_curie_bto_K - Tref) * pw(-3);
  var S = {
    t: 0, tau: 0, psi: 0, f0: f0, T0: T0, F: F, GA: GA, w: w, q: q, x: x, E: E, Etot: 0, awake: awake, T: Tref, D: 0, Dv: 0,
    Omega: 0, theta: 0, still: 0, rgb: [255, 240, 235], B: 0, gaze: [0.5, 0.5], tilt: [0, 0], interactions: 0, eng: 0,
    hot: false, cold: false, glass: false, imag: 0, rung: 0, scale: pw(-1), oct: 5, gov: 0,
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, PHI: PHI
  };
  var subs = [], cues = [];
  var RB = window.RB = { S: S, on: function (f) { subs.push(f); }, cue: function (f) { cues.push(f); }, kick: kick, PHI: PHI, pw: pw, emit: emit };
  function emit(kind, data) { for (var i = 0; i < cues.length; i++) cues[i](kind, data || {}); }

  var inp = { p: [innerWidth / 2, innerHeight / 2], pv: [0, 0], speed: 0, scroll: 0, lastY: scrollY, lastT: 0, idle: 0 };
  RB.input = inp;
  function touch() { inp.idle = 0; S.interactions++; }
  addEventListener('pointermove', function (e) {
    var now = performance.now(), dt = Math.max(F * 1000 / PHI, now - inp.lastT) / 1000, dx = e.clientX - inp.p[0], dy = e.clientY - inp.p[1];
    inp.pv = [dx / dt, dy / dt]; inp.p = [e.clientX, e.clientY]; inp.lastT = now;
    inp.speed += Math.hypot(dx, dy) / Math.hypot(innerWidth, innerHeight); S.gaze = [e.clientX / innerWidth, e.clientY / innerHeight]; inp.idle = 0;
  }, { passive: true });
  addEventListener('scroll', function () { inp.scroll += Math.abs(scrollY - inp.lastY) / innerHeight; inp.lastY = scrollY; inp.idle = 0; }, { passive: true });
  addEventListener('pointerdown', function () { touch(); kick(pw(-1), -1); }, { passive: true });
  addEventListener('keydown', function () { touch(); }, { passive: true });
  addEventListener('hashchange', function () { S.psi += GA; touch(); }); // navigation moves the site in space
  addEventListener('deviceorientation', function (e) {
    if (e.beta == null) return; var b = e.beta / 90, g = e.gamma / 90, d = Math.hypot(b - S.tilt[0], g - S.tilt[1]);   // 90 deg = quarter turn (unit change)
    S.tilt = [b, g]; inp.speed += d / PHI; S.gaze = [0.5 + g / 2, 0.5 + b / 2];
  }, { passive: true });
  function kick(j, band) { for (var k = 0; k < N; k++) if (band < 0 || band === k) v[k] += j * w[k] * (v[k] >= 0 ? 1 : -1); }
  function push(k, u, dt) { var amp = Math.sqrt(E[k]); v[k] += w[k] * Math.tanh(u / SAT) * (v[k] >= 0 ? 1 : -1) * dt * (1 - Math.tanh(amp / PHI)); }
  function wl(nm) { // wavelength -> sRGB (Bruton 1996 piecewise fit; breakpoints are CIE data, not design ratios)
    var r = 0, g = 0, b = 0;
    if (nm < 440) { r = -(nm - 440) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = -(nm - 645) / 65; } else if (nm <= 780) r = 1;
    else r = Math.max(0, pw(-(nm - 780) / 780 * PHI));  // infrared: shown as fading deep red (false colour)
    return [r, g, b];
  }
  RB.wl = wl;
  function step(dt) {
    S.t += dt; inp.idle += dt;
    var still = 1 - Math.exp(-inp.idle / (T0 * pw(3))); S.still = still;
    var uP = inp.speed / dt, uS = inp.scroll / dt; inp.speed = 0; inp.scroll = 0;
    push(0, still * pw(-3), dt); push(1, uS / PHI, dt); push(2, uS / pw(2), dt); push(3, uP / PHI, dt); push(4, uP, dt);
    var P = 0, Et = 0;
    for (var k = 0; k < N; k++) {
      var c = 0;
      if (k >= 1 && k + 1 < N) c += x[k - 1] * x[k + 1]; if (k >= 2) c += x[k - 2] * x[k - 1]; if (k + 2 < N) c += x[k + 1] * x[k + 2];
      var a = -w[k] * w[k] * (x[k] + BETA * x[k] * x[k] * x[k] + KAPPA * c) - (w[k] / q[k]) * v[k];
      v[k] += a * dt; x[k] += v[k] * dt; E[k] = x[k] * x[k] + (v[k] / w[k]) * (v[k] / w[k]);
      if (k) P += (w[k] / q[k]) * (v[k] / w[k]) * (v[k] / w[k]); Et += E[k];
      if (!awake[k] && E[k] > TH_ON) { awake[k] = true; emit('wake', { band: k }); } else if (awake[k] && E[k] < TH_OFF) { awake[k] = false; emit('sleep', { band: k }); }
    }
    S.Etot = Et;
    var Tt = Tref - (Tref - T.T_c_gddy_K) * PHI * still + HEAT * Math.tanh(P * PHI);
    S.T += (Tt - S.T) * dt / TAU_TH;
    if (!S.hot && S.T > T.T_curie_bto_K) { S.hot = true; emit('curie', { up: true }); } else if (S.hot && S.T < T.T_curie_bto_K - HW) { S.hot = false; emit('curie', { up: false }); }
    if (!S.cold && S.T < T.T_c_gddy_K) { S.cold = true; emit('knee', { down: true }); } else if (S.cold && S.T > T.T_c_gddy_K + HW) { S.cold = false; emit('knee', { down: false }); }
    if (!S.glass && S.T > T.T_quartz_alpha_beta_K) { S.glass = true; emit('alphabeta', {}); } else if (S.glass && S.T < T.T_quartz_alpha_beta_K - HW * PHI) S.glass = false;
    var heatF = Math.max(0, Math.min(1, (S.T - Tref) / (T.T_curie_bto_K - Tref)));
    var Dt = Math.max(0, Math.min(1, still * (1 - heatF) / PHI + x[0] * pw(-3) + (S.cold ? pw(-3) : 0)));
    var wD = TAU * f0 / pw(2), qD = pw(2);
    S.Dv += (-wD * wD * (S.D - Dt) - (wD / qD) * S.Dv) * dt; S.D = Math.max(0, Math.min(1, S.D + S.Dv * dt));
    var L = TAU * f0 * pw(-3) * (1 + Math.tanh(Et) / PHI), r = 1 - S.D / PHI;
    S.Omega = L / (r * r); S.theta += S.Omega * dt;
    // global drifting state: site time dilates with depth and with the imaginarium downshift; site space drifts with swirl
    var rate = pw(-S.D) * pw(-S.rung * S.imag); S.tau += dt * rate; S.psi += S.Omega * pw(-4) * dt;
    S.eng += dt * (document.hidden ? 0 : 1) * (1 + still / PHI);
    var A = [E[3] + E[4], E[2], E[0] + E[1]], rgb = [0, 0, 0], ws = 0;
    for (var i = 0; i < 3; i++) { var lam = C.balmer[i][0] * pw(S.rung * S.imag * pw(-3)), c3 = wl(lam), m = C.balmer[i][1] * (A[i] + pw(-4)); ws += m; for (var j = 0; j < 3; j++) rgb[j] += c3[j] * m; }
    S.rgb = rgb.map(function (c) { return Math.round(255 * Math.min(1, c / ws * PHI)); });   // 255 = 8-bit channel max
    S.B = 1 - Math.exp(-Et);
  }
  // governor (spec 22): steps render scale, octaves and counts by phi when frames run slow
  var ema = F * 1000, good = 0;
  function govern(ms) {
    ema += (ms - ema) * pw(-5);
    if (ema > F * 1000 * pw(2) && S.gov > -3) { S.gov--; ema = F * 1000; good = 0; }
    else if (ema < F * 1000 * PHI && S.gov < 0 && (good += ms) > T0 * 1000) { S.gov++; good = 0; }
    S.scale = pw(-1 + S.gov); S.oct = 5 + S.gov;   // render scale 1/phi -> 1/phi^4; fBm octaves 5 -> 2
  }
  var raf = 0, last = 0, acc = 0, H = F * PHI;  // physics step phi/60 s (~37 Hz)
  function frame(now) {
    raf = requestAnimationFrame(frame);
    var ms = last ? now - last : F * 1000; last = now; var dt = Math.min(ms / 1000, F * pw(5)); acc += dt;
    while (acc >= H) { step(H); acc -= H; }
    govern(ms);
    for (var i = 0; i < subs.length; i++) subs[i](S, dt);
  }
  function start() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }
  document.addEventListener('visibilitychange', function () { document.documentElement.classList.toggle('paused', document.hidden); if (document.hidden) stop(); else start(); });
  document.documentElement.style.setProperty('--T0', T0.toFixed(4) + 's');   // CSS band durations derive from this
  RB.start = start; RB.fib = function (n) { return Math.round(pw(n) / (2 * PHI - 1)); }; // Binet: F(n) = round(phi^n / sqrt5), sqrt5 = 2phi - 1
  start();
})();
