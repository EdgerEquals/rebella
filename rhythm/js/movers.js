/* Rebella rhythm: drifting shortcuts (tier 0). No menu: each link is a small ENTITY (rigid, cool) or
   ORGANISM (soft-bodied, warm) moved by a physical or biological law (see README MOTION_BASIS).
   Low-cue: organisms drift in on Fibonacci-second lanes (5, 8, 13 | 21, 34, 55 s: consecutive Fibonacci
   numbers are coprime, so the lanes form a polyrhythm that rarely realigns). High-cue: threshold crossings in
   the site physics (band wake-ups, Curie / Gd-Dy knee / alpha-beta) bring entities and Carroll-ish organisms.
   Contact: entities REJECT (rigid elastic bounce, restitution 1/phi); organisms ABSORB (soft, inelastic squash).
   Everything is transform/opacity only, one shared rAF loop (site-physics.js), paused when the tab is hidden. */
(function () {
  'use strict';
  var RB = window.RB; if (!RB) return;
  var S = RB.S, PHI = RB.PHI, pw = RB.pw, TAU = 2 * Math.PI, GA = TAU / (PHI * PHI); // golden angle 137.5 deg
  var B = 2 * Math.log(PHI) / Math.PI;               // golden-spiral growth per radian (pitch 17.0 deg)
  var drift = document.getElementById('drift');
  var els = [].slice.call(drift.querySelectorAll('.mv'));
  var REDUCED = S.reduced;

  // ---- procedural fills for shared symbols: phyllotaxis seed head, L-system tree (deterministic) ----
  (function () {
    var g = document.querySelector('#g-seed .phy'), h = '';
    for (var i = 1; i <= 34; i++) { var r = 4.4 * Math.sqrt(i), a = i * GA; h += '<circle cx="' + (r * Math.cos(a)).toFixed(1) + '" cy="' + (-14 + r * Math.sin(a)).toFixed(1) + '" r="' + (1.4 + i / 34).toFixed(2) + '"/>'; }
    g.innerHTML = h;
    var t = document.querySelector('#g-tree .lsys'), p = '';
    (function br(x, y, a, l, d) { // binary L-system: angle = golden angle / phi^3, length ratio 1/phi
      var x2 = x + l * Math.sin(a), y2 = y - l * Math.cos(a);
      p += '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'L' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '" stroke-width="' + (d * 1.3).toFixed(1) + '"' + (d < 2 ? ' stroke="#2E6B47"' : '') + '/>';
      if (d > 0) { var s = GA / pw(3); br(x2, y2, a - s, l / PHI, d - 1); br(x2, y2, a + s, l / PHI, d - 1); }
    })(0, 46, 0, 32, 6);
    t.innerHTML = p;
  })();

  // ---- genomes ----
  var G = {
    keyhole: { cat: 'ent', law: 'pendulum', band: 1 }, clock: { cat: 'ent', law: 'kepler', band: 0 },
    spot: { cat: 'ent', law: 'billiard', band: 4 }, card: { cat: 'ent', law: 'flutter', band: 2 },
    frame: { cat: 'ent', law: 'advect', band: 3 }, door: { cat: 'ent', law: 'spiral', band: 0 },
    seed: { cat: 'org', law: 'pappus', band: 1, lane: 8 }, diatom: { cat: 'org', law: 'helix', band: 2, lane: 13 },
    jelly: { cat: 'org', law: 'jet', band: 2, lane: 5 }, rabbit: { cat: 'org', law: 'hop', band: 4, lane: 21, t1: 1 },
    figure: { cat: 'org', law: 'float', band: 0, lane: 34, t1: 1 }, tree: { cat: 'org', law: 'grow', band: 0, lane: 55, t1: 1 }
  };
  var ENT = ['keyhole', 'clock', 'spot', 'card', 'frame', 'door'];
  var pool = {}; els.forEach(function (el, i) { pool[el.dataset.g] = { el: el, i: i, g: G[el.dataset.g], on: false, focus: false }; });
  if (REDUCED) return;  // static row of links via CSS (.static)
  els.forEach(function (el) { el.classList.add('idle'); });  // static row of links via CSS (.static)

  var W = innerWidth, H = innerHeight, MIN = Math.min(W, H), n = 0;
  addEventListener('resize', function () { W = innerWidth; H = innerHeight; MIN = Math.min(W, H); }, { passive: true });
  function centre() { return [W * (0.5 + (S.gaze[0] - 0.5) / pw(3)), H * (0.5 + (S.gaze[1] - 0.5) / pw(3))]; }
  // Rankine vortex with golden-spiral inflow: v_theta = Gamma/r outside the core, solid-body inside
  function flow(x, y) {
    var c = centre(), dx = x - c[0], dy = y - c[1], r = Math.hypot(dx, dy) || 1, rc = MIN / pw(4);
    var Gm = S.Omega * MIN * MIN / pw(5), vt = r < rc ? Gm * r / (rc * rc) : Gm / r;
    return [(-dy / r) * vt - B * vt * dx / r, (dx / r) * vt - B * vt * dy / r];
  }
  function count() { var c = 0; for (var k in pool) if (pool[k].on) c++; return c; }

  function spawn(name, why) {
    var m = pool[name]; if (!m || m.on || m.focus || count() >= S.limit) return false;
    n++; var a = n * GA, g = m.g, el = m.el;          // entry point from the golden-angle sequence (no randomness)
    var sz = parseFloat(getComputedStyle(el).width) || 54;
    m.on = true; m.t = 0; m.why = why; m.sz = sz; m.kv = [0, 0]; m.dp = [0, 0]; m.sq = 0; m.ang = 0; m.av = 0; m.contact = false;
    m.s = 1; m.op = 0; m.v = [0, 0];
    var side = Math.cos(a) > 0 ? 1 : -1, yf = 0.5 + 0.382 * Math.sin(a);
    m.p = [side > 0 ? -sz : W + sz, H * yf];
    m.dir = side;
    switch (g.law) {
      case 'pappus': m.p = [W * (0.5 + 0.382 * Math.cos(a)), -sz]; break;
      case 'jet': m.p = [W * (0.5 + 0.382 * Math.cos(a)), H + sz]; break;
      case 'grow': m.p = [W * (0.5 + 0.382 * Math.cos(a)), H * (0.618 + 0.236 * Math.sin(a))]; break;
      case 'hop': m.p = [side > 0 ? -sz : W + sz, H * (0.618 + 0.146 * Math.sin(a))]; m.y0 = m.p[1]; m.ht = 0; break;
      case 'kepler': var c = centre(), r0 = MIN * 0.382; m.p = [c[0] + r0 * Math.cos(a), c[1] + r0 * Math.sin(a)];
        var GM = Math.pow(TAU / 13, 2) * r0 * r0 * r0, vc = Math.sqrt(GM / r0) / Math.sqrt(PHI); // apoapsis start: ellipse
        m.GM = GM; m.v = [-Math.sin(a) * vc, Math.cos(a) * vc]; m.life = 13; break;
      case 'spiral': var c2 = centre(); m.r = Math.hypot(W, H) / 2; m.th = a; m.r0 = m.r;
        m.p = [c2[0] + m.r * Math.cos(a), c2[1] + m.r * Math.sin(a)]; break;
      case 'billiard': var sp = MIN / pw(4); m.v = [side * sp * Math.cos(a / PHI), sp * Math.sin(a / PHI)]; m.p = [side > 0 ? sz : W - sz, H * yf]; m.life = 21; break;
      case 'pendulum': m.th0 = 1 / PHI; m.ang = m.th0; break;
      case 'flutter': m.p = [W * (0.5 + 0.382 * Math.cos(a)), -sz]; break;
      case 'advect': m.v = [side * MIN / pw(3), 0]; break;
    }
    if (RB.morph && why !== 'lane') { var sv = el.querySelector('svg'); m.orig = m.orig || sv.innerHTML; var mk = RB.morph(name, S); if (mk) sv.innerHTML = mk; }
    el.classList.remove('idle');
    el.style.setProperty('--fp', (1 / (S.f0 * pw(g.band))).toFixed(3) + 's');
    return true;
  }
  function retire(m) { if (m.orig) m.el.querySelector('svg').innerHTML = m.orig; m.on = false; m.el.classList.add('idle'); m.el.style.opacity = 0; m.el.style.transform = 'translate3d(-300px,-300px,0)'; }

  function law(m, dt) {
    var g = m.g, t = m.t, p = m.p, v = m.v, u = flow(p[0], p[1]), w = S.w[g.band], e = 1 - Math.exp(-dt * PHI);
    switch (g.law) {
      case 'pappus': // wind-borne seed: drag-dominated, falls at terminal velocity, sways like a pendulum
        v[0] += (u[0] / PHI - v[0]) * e; v[1] += (u[1] / PHI + H / 21 - v[1]) * e; m.ang = Math.sin(w * t) / pw(3); break;
      case 'helix': // ciliate-like swimmer: low Reynolds number, velocity = propulsion + advection, helical heading
        var hd = (m.dir > 0 ? 0 : Math.PI) + Math.sin(w * t) / pw(2) + (S.gaze[1] - 0.5) / PHI, s0 = W / 21;
        v[0] = s0 * Math.cos(hd) + u[0] / pw(2); v[1] = s0 * Math.sin(hd) + u[1] / pw(2); m.ang = hd; break;
      case 'jet': // jellyfish: thrust only while the bell contracts, quadratic-free linear drag between pulses
        var ps = Math.sin(w * t), hj = -Math.PI / 2 + Math.sin(S.w[0] * t) / pw(3), th = ps > 0 ? ps * H / pw(2) : 0;
        v[0] += (th * Math.cos(hj) - PHI * v[0] + u[0] / PHI) * dt; v[1] += (th * Math.sin(hj) - PHI * v[1] + u[1] / PHI) * dt; break;
      case 'hop': // rabbit bound: ballistic arcs under gravity, one hop per band-4 period
        var Th = 1 / (S.f0 * pw(4)) * PHI, h = H / pw(5), gr = 8 * h / (Th * Th);
        v[0] = m.dir * W / 13; m.ht += dt; if (m.ht >= Th) m.ht -= Th;
        p[1] = m.y0 - (4 * h / Th) * m.ht + 0.5 * gr * m.ht * m.ht; v[1] = 0; break;
      case 'float': // floating figure: advected by the vortex, slight buoyancy, breathing (band 0) envelope
        v[0] += (u[0] - v[0]) * e / PHI; v[1] += (u[1] - H / 55 - v[1]) * e / PHI; m.s = 1 + Math.sin(S.w[0] * t) / pw(5); break;
      case 'grow': // L-system tree: logistic growth, senescence fade after 21 s, rises in the flow
        m.s = 1 / (1 + Math.exp(-(t - PHI * PHI) * PHI)); v[0] = u[0] / pw(3); v[1] = u[1] / pw(3) - H / 89; if (t > 21) m.fade = true; break;
      case 'pendulum': // keyhole on a chain: physical pendulum (omega = band 1), damped with log_phi(Q), advected
        m.av += (-w * w * Math.sin(m.ang) - (w / S.q[g.band]) * m.av) * dt; m.ang += m.av * dt;
        if (t < dt * 2) m.av = 0; v[0] += (u[0] + m.dir * W / 21 - v[0]) * e / PHI; v[1] += (u[1] - v[1]) * e / PHI; break;
      case 'kepler': // clock face on a Kepler ellipse around the vortex centre (a = -GM r / r^3)
        var c = centre(), dx = p[0] - c[0], dy = p[1] - c[1], r3 = Math.pow(Math.hypot(dx, dy) + 1, 3);
        v[0] -= m.GM * dx / r3 * dt; v[1] -= m.GM * dy / r3 * dt; if (t > m.life) m.fade = true;
        m.el.style.setProperty('--ha', S.theta.toFixed(3) + 'rad'); m.el.style.setProperty('--ma', (S.theta * pw(5)).toFixed(3) + 'rad'); break;
      case 'spiral': // doorway falling down the vortex: golden-spiral inflow, angular momentum r^2 omega conserved
        var c3 = centre(), rc = MIN / pw(4), l = S.Omega * m.r0 * m.r0 / pw(4), om = l / Math.max(m.r * m.r, rc * rc);
        m.th += om * dt; m.r -= B * m.r * om * dt; m.s = Math.max(0.236, m.r / m.r0 * PHI);
        p[0] = c3[0] + m.r * Math.cos(m.th); p[1] = c3[1] + m.r * Math.sin(m.th); v[0] = v[1] = 0; if (m.r < rc) m.fade = true; break;
      case 'billiard': // hard spot: rigid elastic wall bounces (e = 1) for 21 s, then it leaves
        var hs = m.sz / 2; if (t < m.life) { if ((p[0] < hs && v[0] < 0) || (p[0] > W - hs && v[0] > 0)) v[0] = -v[0]; if ((p[1] < hs && v[1] < 0) || (p[1] > H - hs && v[1] > 0)) v[1] = -v[1]; } break;
      case 'flutter': // falling card: plate flutter, angle oscillates, edge-on it falls faster
        var tf = Math.sin(w * t) / PHI; m.ang = tf; v[0] = (W / pw(5)) * w * Math.cos(w * t) / PHI + u[0] / pw(2); v[1] = (H / 34) * (1 + Math.abs(Math.sin(tf)) * PHI) + u[1] / pw(2); break;
      case 'advect': // rigid picture frame carried by the flow: irrotational outside the core, so it keeps its orientation
        v[0] += (u[0] + m.dir * MIN / pw(4) - v[0]) * e / PHI; v[1] += (u[1] - v[1]) * e / PHI;
        var c4 = centre(); if (Math.hypot(p[0] - c4[0], p[1] - c4[1]) < MIN / pw(4)) m.ang += S.Omega * dt; break;
    }
    if (g.law !== 'spiral') { p[0] += v[0] * dt; p[1] += v[1] * dt; }
  }

  function contact(m, dt) {
    var I = RB.input, live = performance.now() - I.lastT < 100, pv = live ? I.pv : [0, 0];
    var px = m.p[0] + m.dp[0], py = m.p[1] + m.dp[1], dx = px - I.p[0], dy = py - I.p[1], d = Math.hypot(dx, dy) || 1, R = m.sz * m.s / 2;
    var inside = d < R && live;
    if (inside && !m.contact) {
      var vr = [pv[0] - m.v[0], pv[1] - m.v[1]], nx = dx / d, ny = dy / d, vn = vr[0] * nx + vr[1] * ny, sp = Math.hypot(vr[0], vr[1]);
      if (m.g.cat === 'ent') { if (vn > 0) { m.kv[0] += (1 + 1 / PHI) * vn * nx; m.kv[1] += (1 + 1 / PHI) * vn * ny; m.av += (vr[0] * ny - vr[1] * nx) / R / PHI; } RB.kick(Math.min(sp / 2000, 1) / PHI, 4); }
      else { m.kv[0] += vr[0] / pw(2); m.kv[1] += vr[1] / pw(2); m.sq = 1; RB.kick(Math.min(sp / 2000, 1) / PHI, 0); }
    }
    m.contact = inside;
    var k = Math.exp(-dt * PHI); m.dp[0] += m.kv[0] * dt; m.dp[1] += m.kv[1] * dt; m.kv[0] *= k; m.kv[1] *= k;
    if (m.g.cat === 'ent' && m.g.law !== 'pendulum') { m.ang += m.av * dt; m.av *= k; }
    m.sq *= Math.exp(-dt * S.w[4]);
  }

  var lanes = {}; for (var k in G) if (G[k].lane) lanes[k] = G[k].lane / PHI;
  var cueN = 0;
  RB.cue(function (kind, d) {
    if (kind === 'wake') spawn(ENT[(d.band + cueN++) % ENT.length], 'wake');
    else if (kind === 'curie' && d.up) { for (var i = 0; i < 3; i++) spawn(ENT[(cueN++) % ENT.length], 'curie'); spawn('tree', 'curie'); }
    else if (kind === 'knee' && d.down) { spawn('door', 'knee'); spawn('rabbit', 'knee'); spawn('figure', 'knee'); }
    else if (kind === 'alphabeta') ENT.forEach(function (e) { spawn(e, 'ab'); });
  });
  RB.spawn = spawn;

  RB.on(function (S, dt) {
    for (var k in lanes) if (S.t >= lanes[k]) { lanes[k] += G[k].lane; if (!G[k].t1 || RB.tier >= 1) spawn(k, 'lane'); }
    var c = centre(), Rl = MIN / PHI;
    for (var name in pool) {
      var m = pool[name]; if (!m.on || m.focus) continue;
      m.t += dt; law(m, dt); contact(m, dt);
      var x = m.p[0] + m.dp[0], y = m.p[1] + m.dp[1], mg = m.sz * 2;
      if (m.t > 1 && (x < -mg || x > W + mg || y < -mg || y > H + mg) || m.t > 55) { retire(m); continue; }
      // light: inverse-square falloff from the vortex's centre glow, plus fade in/out
      var rr = Math.hypot(x - c[0], y - c[1]) / Rl, lit = 0.786 + 0.214 / (1 + rr * rr);
      m.op = m.fade ? m.op - dt * PHI : Math.min(1, m.op + dt * PHI);
      if (m.fade && m.op <= 0) { m.fade = false; retire(m); continue; }
      var sc = m.s * (1 + S.D / pw(2)), sx = sc * (1 + m.sq / pw(3)), sy = sc * (1 - m.sq / pw(3)), hs = m.sz / 2;
      m.el.style.opacity = (m.op * lit).toFixed(3);
      m.el.style.transform = 'translate3d(' + (x - hs).toFixed(1) + 'px,' + (y - hs).toFixed(1) + 'px,0) rotate(' + m.ang.toFixed(3) + 'rad) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
    }
  });

  // keyboard: a focused shortcut is parked in view and held still; it resumes (or hides) on blur
  els.forEach(function (el) {
    var m = pool[el.dataset.g];
    el.addEventListener('focus', function () {
      m.focus = true; el.classList.remove('idle');
      var sz = m.sz || 54, per = Math.max(1, Math.floor((W - 220) / (sz * PHI))), col = m.i % per, row = Math.floor(m.i / per);
      el.style.opacity = 1; el.style.transform = 'translate3d(' + (16 + col * sz * PHI) + 'px,' + (H - sz * PHI * (row + 2)) + 'px,0)';
    });
    el.addEventListener('blur', function () { m.focus = false; if (!m.on) retire(m); });
    el.addEventListener('click', function () { RB.kick(1 / PHI, -1); });
  });
  // vortex rings: Rankine profile, omega ~ 1/r^2 outside the core (angular momentum), solid-body inside
  var rings = [].slice.call(document.querySelectorAll('#amb .ring')), svg = document.querySelector('#amb svg.rings'), amb = document.getElementById('amb'), lastD = -1;
  var RR = [100, 61.8, 38.2, 23.6, 14.6], ang = [0, 0, 0, 0, 0];
  RB.on(function (S, dt) {
    for (var i = 0; i < 5; i++) { var r = Math.max(RR[i], 38.2); ang[i] += S.Omega / pw(3) * (100 * 100) / (r * r) * dt; rings[i].style.transform = 'rotate(' + ang[i].toFixed(4) + 'rad)'; }
    var c = centre(); svg.style.transform = 'translate3d(' + (c[0] - W / 2).toFixed(1) + 'px,' + (c[1] - H / 2).toFixed(1) + 'px,0) scale(' + (1 + S.D * PHI).toFixed(3) + ')';
    if (Math.abs(S.D - lastD) > 0.01) { lastD = S.D; amb.style.setProperty('--d', S.D.toFixed(3)); amb.style.setProperty('--gx', (S.gaze[0] * 100).toFixed(1) + '%'); amb.style.setProperty('--gy', (S.gaze[1] * 100).toFixed(1) + '%'); }
  });
})();
