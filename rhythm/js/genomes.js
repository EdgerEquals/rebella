/* Rebella rhythm L1: eight parametric high-cue genomes (spec 22 tier 1, spec 23 categories). They are the only
   navigation: real links, drawn live as inline SVG from the current cascade state and mutated every turn and every
   absorbed bump, so no two passes look alike (Carroll-ish, original geometry, fractal by 1/phi, fixed palette).
   Motion (spec 12): each genome ORBITS ITS OWN OFF-SCREEN PIVOT, so it sweeps through the view on an arc, never in a
   straight line. Orbit period T0 * phi^n (n = 1..8, all mismatched); radius and size shrink by phi per turn
   (golden-spiral infinite-zoom loop, reset off-screen); omega ~ 1/R^2 as it sinks (angular momentum). First
   entries cascade from page load at T0 * phi^(n-3). Bumps: restitution = cue (rejected momentum bends the arc),
   1 - cue is absorbed (interior change = mutation). ENTITIES: keyhole, card, frame, doorway, clock (rigid, cool,
   cue 1 or 1/phi). ORGANISMS: rabbit, figure, L-system tree (soft, warm, cue 1/phi^2). */
(function () {
  'use strict';
  var RB = window.RB; if (!RB) return;
  var S = RB.S, PHI = RB.PHI, pw = RB.pw, TAU = 2 * Math.PI, GA = S.GA, fib = RB.fib;
  var z = function (n) { return 50 * pw(-n); }, f = function (v) { return v.toFixed(1); }, th = Math.tanh;
  var COOL = '#4C5E7A', WARM = '#B4436C', INK = '#3A2B35';
  function st(n) { return ' stroke="currentColor" stroke-width="' + f(z(n)) + '"'; }
  var GEN = {
    keyhole: function (u, k) { var h = '', n = 1 + S.awake.filter(Boolean).length; for (var i = 0; i < n; i++) h += '<circle r="' + f(z(i / 2 + 1 / PHI / PHI)) + '" fill="none"' + st(i ? 5 : 3.5) + '/>';
      var w = z(4) + th(S.E[1] + u) * z(5); return h + '<circle cy="' + f(-z(3.5)) + '" r="' + f(z(3.5)) + '" fill="currentColor"/><path d="M' + f(-z(4.5)) + ' 0h' + f(z(3.5)) + 'l' + f(w) + ' ' + f(z(1.5)) + 'h' + f(-z(3.5) - 2 * w) + 'z" fill="currentColor"/>'; },
    card: function (u, k) { var n = fib(2 + Math.round(th(S.E[2] + u) * 3)), h = '<rect x="' + f(-z(1.5)) + '" y="' + f(-z(1.5) * PHI) + '" width="' + f(2 * z(1.5)) + '" height="' + f(2 * z(1.5) * PHI) + '" rx="' + f(z(4)) + '" fill="#fff"' + st(4) + '/>';
      for (var i = 0; i < n; i++) { var r = z(4) * Math.sqrt(i + 1 / PHI), a = i * GA + k; h += '<path transform="translate(' + f(r * Math.cos(a)) + ' ' + f(r * Math.sin(a) * PHI) + ')" d="M0-' + f(z(4)) + 'l' + f(z(4.5)) + ' ' + f(z(4)) + '-' + f(z(4.5)) + ' ' + f(z(4)) + '-' + f(z(4.5)) + '-' + f(z(4)) + 'z" fill="' + WARM + '"/>'; } return h; },
    frame: function (u, k) { var x = -z(0) * pw(-1 / PHI / PHI), w = -2 * x, y = -w / PHI / 2, hh = w / PHI, n = 3 + Math.round(th(S.E[3] + u) * 4) + (k % 2), o = '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(hh) + '" fill="#fff"' + st(3.5) + '/>';
      for (var i = 0; i < n; i++) { var d = i % 4, sw = ' stroke="currentColor" stroke-width="' + f(z(5 + i / PHI)) + '"'; // golden-rectangle subdivision
        if (d === 0) { o += '<path d="M' + f(x + hh) + ' ' + f(y) + 'v' + f(hh) + '"' + sw + '/>'; x += hh; w -= hh; } else if (d === 1) { o += '<path d="M' + f(x) + ' ' + f(y + w) + 'h' + f(w) + '"' + sw + '/>'; y += w; hh -= w; }
        else if (d === 2) { o += '<path d="M' + f(x + w - hh) + ' ' + f(y) + 'v' + f(hh) + '"' + sw + '/>'; w -= hh; } else { o += '<path d="M' + f(x) + ' ' + f(y + hh - w) + 'h' + f(w) + '"' + sw + '/>'; hh -= w; } }
      return o; },
    door: function (u, k) { var h = '', n = 1 + Math.round(S.D * 3 + th(u)); for (var i = 0; i < n; i++) { var s = pw(-i), w = z(1) * s, y = z(0) * pw(-1 / PHI / PHI) - z(1) * (1 - s), tall = 2 * w * PHI;  // arch height : width = phi
        h += '<path d="M' + f(-w) + ' ' + f(y) + 'V' + f(y - tall + w) + 'a' + f(w) + ' ' + f(w) + ' 0 0 1 ' + f(2 * w) + ' 0V' + f(y) + '" fill="' + (i ? 'none' : '#fff') + '"' + st(3.5 + i) + '/>'; }
      return h + '<circle cx="' + f(z(2)) + '" cy="' + f(z(3)) + '" r="' + f(z(5)) + '" fill="currentColor"/>'; },
    clock: function (u, k) { var n = fib(5 + Math.round(S.D * 2)), R0 = z(1 / PHI / PHI), h = '<circle r="' + f(R0) + '" fill="#fff"' + st(3.5) + '/>';
      for (var i = 0; i < n; i++) { var a = i / n * TAU; h += '<path d="M' + f(R0 * pw(-1 / PHI / PHI) * Math.sin(a)) + ' ' + f(-R0 * pw(-1 / PHI / PHI) * Math.cos(a)) + 'L' + f(R0 * Math.sin(a)) + ' ' + f(-R0 * Math.cos(a)) + '"' + st(5) + '/>'; }
      return h + '<path class="hh" d="M0 0V' + f(-z(2)) + '"' + st(4) + ' stroke-linecap="round"/><path class="mh" d="M0 0V' + f(-z(1)) + '" stroke="' + WARM + '" stroke-width="' + f(z(5)) + '" stroke-linecap="round"/>'; },
    rabbit: function (u, k) { var e = z(2) * (1 + th(S.E[4] + u) / PHI), b = z(1) * (1 - S.D / pw(3)), s4 = st(4);
      return '<ellipse cx="' + f(-z(4)) + '" cy="' + f(z(2.5)) + '" rx="' + f(b) + '" ry="' + f(b / PHI) + '" fill="#fff"' + s4 + '/><circle cx="' + f(z(1.5)) + '" cy="' + f(-z(4)) + '" r="' + f(z(2.5)) + '" fill="#fff"' + s4 + '/>' +
        '<ellipse cx="' + f(z(1.5)) + '" cy="' + f(-z(2.5) - e) + '" rx="' + f(e / PHI / PHI / PHI) + '" ry="' + f(e) + '" fill="#F8CFDB"' + s4 + ' transform="rotate(' + f(-S.x[4] * z(3)) + ' ' + f(z(1.5)) + ' ' + f(-z(2.5)) + ')"/>' +
        '<ellipse cx="' + f(z(1)) + '" cy="' + f(-z(2.5) - e / PHI) + '" rx="' + f(e / PHI / PHI / PHI) + '" ry="' + f(e / PHI) + '" fill="#F8CFDB"' + s4 + ' transform="rotate(' + f(z(3) + S.x[3] * z(3)) + ' ' + f(z(1)) + ' ' + f(-z(2.5)) + ')"/><circle cx="' + f(z(1.2)) + '" cy="' + f(-z(4)) + '" r="' + f(z(6)) + '" fill="currentColor"/>'; },
    figure: function (u, k) { var a = z(2) * (1 + S.x[0] / PHI + th(u) / PHI), s4 = st(4);
      return '<circle cy="' + f(-z(1)) + '" r="' + f(z(2.5)) + '" fill="#FCD9C0"' + s4 + '/><path d="M0 ' + f(-z(2)) + 'C' + f(-z(1.5)) + ' ' + f(-z(2)) + ' ' + f(-z(1)) + ' ' + f(z(2)) + ' ' + f(-z(1)) + ' ' + f(z(0.5)) + 'h' + f(2 * z(1)) + 'C' + f(z(1)) + ' ' + f(z(2)) + ' ' + f(z(1.5)) + ' ' + f(-z(2)) + ' 0 ' + f(-z(2)) + 'z" fill="#F8CFDB"' + s4 + '/>' +
        '<g class="flap"><path d="M' + f(-z(3)) + ' ' + f(-z(4)) + 'l' + f(-z(1.5)) + ' ' + f(a) + 'M' + f(z(3)) + ' ' + f(-z(4)) + 'l' + f(z(1.5)) + ' ' + f(a) + '"' + st(3.5) + ' stroke-linecap="round"/></g>'; },
    tree: function (u, k) { var p = '', d = 4 + Math.round(S.D * 2 + th(u)), sp = GA * pw(-3 + th(S.E[0]) / PHI);
      (function br(x, y, a, l, j) { var x2 = x + l * Math.sin(a), y2 = y - l * Math.cos(a); p += '<path d="M' + f(x) + ' ' + f(y) + 'L' + f(x2) + ' ' + f(y2) + '" stroke-width="' + f(z(6 - j / PHI)) + '"' + (j < 2 ? ' stroke="#2E6B47"' : '') + '/>';
        if (j > 0) { br(x2, y2, a - sp, l / PHI, j - 1); br(x2, y2, a + sp / PHI, l / PHI, j - 1); } })(0, z(0) * pw(-1 / PHI / PHI), 0, z(0.5), d);
      return '<g stroke="#94461A" stroke-linecap="round" fill="none">' + p + '</g>'; }
  };
  var CUE = { keyhole: 1, card: pw(-1), frame: 1, door: 1, clock: pw(-1), rabbit: pw(-2), figure: pw(-2), tree: pw(-2) };
  var ORDER = ['keyhole', 'card', 'frame', 'door', 'rabbit', 'clock', 'figure', 'tree'];
  var els = [].slice.call(document.querySelectorAll('#drift .mv')), G = [];
  els.forEach(function (el) { var name = el.dataset.g, n = ORDER.indexOf(name) + 1;
    G.push({ el: el, svg: el.querySelector('svg'), name: name, n: n, cue: CUE[name], ent: CUE[name] > pw(-2) + pw(-4), T: S.T0 * pw(n), u: 0, turn: 0, dw: 0, dR: 0, hit: false, focus: false, vis: false,
      ph: 0.5 - pw(-4) - pw(-3) }); });   // entry sits near u = 1/2 - phi^-4, so the first entry comes ~phi^-3 of a turn = T0 * phi^(n-3) after load
  function draw(g) { g.svg.setAttribute('viewBox', '-50 -50 100 100'); g.svg.innerHTML = GEN[g.name](g.u, g.turn); }
  G.forEach(draw);
  if (S.reduced) return;   // still version: static row of drawn links (CSS .static)
  els.forEach(function (el) { el.classList.add('idle'); });
  var speedEMA = 0;
  function cap() { return fib(5 - Math.round(S.D * 2) + S.gov); }   // top 5, mid 3, deep 2
  RB.pull = function (name) { G.forEach(function (g) { if (g.name === name && !g.vis) g.ph = Math.floor(g.ph) + 0.5 - pw(-4) - pw(-4); }); }; // jump (off-screen) to just before its entry
  RB.cue(function (kind, d) {
    if (kind === 'wake') RB.pull(ORDER[(d.band * 2 + Math.round(S.t)) % 8]);
    else if (kind === 'curie' && d.up) ['frame', 'card', 'keyhole', 'tree'].forEach(RB.pull);
    else if (kind === 'knee' && d.down) ['door', 'rabbit', 'figure'].forEach(RB.pull);
    else if (kind === 'alphabeta') ORDER.forEach(RB.pull);
  });
  RB.on(function (S, dt) {
    var W = innerWidth, H = innerHeight, dg = Math.hypot(W, H), I = RB.input, live = performance.now() - I.lastT < 1000 * S.F * pw(4), shown = 0, lim = cap();
    speedEMA += (Math.hypot(I.pv[0], I.pv[1]) * (live ? 1 : 0) / dg - speedEMA) * (1 - Math.exp(-dt * PHI));
    for (var i = 0; i < G.length; i++) {
      var g = G[i]; if (g.focus) continue;
      var hurry = g.name === 'rabbit' ? pw(th(S.eng / (S.T0 * pw(4)))) : 1;          // Carroll rule: the rabbit hurries more the later it gets
      var u = ((g.ph % 1) + 1) % 1, R0 = dg * pw(-1 / PHI) * (1 + (((g.n * pw(-1)) % 1) - 0.5) / PHI);
      g.ph += dt * hurry * pw(2 * u) / g.T * pw(-S.D) + g.dw * dt / TAU;             // omega grows as phi^(2u) while R shrinks by phi^-u
      var u2 = ((g.ph % 1) + 1) % 1; if (u2 < u) { g.turn++; draw(g); }              // new turn: mutate
      var al = S.psi + g.n * GA, pd = R0 * PHI * pw(-S.D / PHI);                      // pivot: off-screen, golden-angle spread, drifts with psi
      var px = W / 2 + pd * Math.cos(al), py = H / 2 + pd * Math.sin(al);
      var R = R0 * pw(-u2) * PHI + g.dR, a = al + Math.PI + (u2 - 0.5) * TAU;
      var x = px + R * Math.cos(a), y = py + R * Math.sin(a);
      var inv = S.imag > pw(-1) ? pw(2 * u2) : pw(-u2);                               // Carroll rule: in the imaginarium, receding things grow
      var s = inv * (1 + S.D / pw(2)) * (g.name === 'door' ? pw(-th(speedEMA * PHI)) : 1);   // Carroll rule: hurry and the door shrinks
      var sz = g.el.offsetWidth || 16 * pw(2.5), on = x > -sz && y > -sz && x < W + sz && y < H + sz;
      if (on && !g.vis) { if (shown >= lim) { g.el.style.opacity = 0; g.el.classList.add('idle'); continue; } g.vis = true; g.el.classList.remove('idle'); }
      if (!on && g.vis) { g.vis = false; g.el.classList.add('idle'); g.el.style.opacity = 0; }
      if (!g.vis) continue; shown++;
      // bump: rejected share (cue) bends the arc; absorbed share (1 - cue) mutates the interior
      var dx = x - I.p[0], dy = y - I.p[1], dd = Math.hypot(dx, dy) || 1;
      if (live && dd < sz * s / 2 + sz / pw(2)) { if (!g.hit) { var vn = (I.pv[0] * dx + I.pv[1] * dy) / dd, vt = (I.pv[0] * -Math.sin(a) + I.pv[1] * Math.cos(a));
        g.dw += g.cue * vt / R; g.dR += g.cue * vn * pw(-2); g.u += (1 - g.cue) * Math.abs(vn) / dg * PHI; if (1 - g.cue > pw(-2)) draw(g); RB.kick(Math.min(Math.abs(vn) / dg, 1) * pw(-2), g.ent ? 4 : 0); } g.hit = true; } else g.hit = false;
      var k = Math.exp(-dt * PHI * PHI / S.T0); g.dw *= k; g.dR *= k; g.u *= Math.exp(-dt / (S.T0 * pw(3)));
      var spin = g.ent ? S.tau * TAU / (g.T * pw(-2)) : Math.sin(S.tau * S.w[g.n % 5]) * pw(-3);   // entities: rigid spin; organisms: soft sway
      var op = Math.min(1, Math.min(x + sz, W + sz - x, y + sz, H + sz - y) / (sz * PHI));
      if (g.name === 'clock') { var ha = S.theta * (S.cold ? -1 : 1); g.el.style.setProperty('--ha', ha.toFixed(3) + 'rad'); g.el.style.setProperty('--ma', (ha * pw(5)).toFixed(3) + 'rad'); } // Carroll rule: below the knee time runs backwards
      g.el.style.opacity = op.toFixed(3);
      g.el.style.transform = 'translate3d(' + f(px) + 'px,' + f(py) + 'px,0) rotate(' + (a).toFixed(4) + 'rad) translate(' + f(R) + 'px,0) rotate(' + (-a + spin).toFixed(4) + 'rad) translate(-50%,-50%) scale(' + s.toFixed(3) + ')';
    }
  });
  els.forEach(function (el, i) { var g = G.filter(function (q) { return q.el === el; })[0];
    el.addEventListener('focus', function () { g.focus = true; el.classList.remove('idle'); var sz = el.offsetWidth || 16 * pw(2.5);
      el.style.opacity = 1; el.style.transform = 'translate3d(' + f(sz / PHI + i * sz * PHI) + 'px,' + f(sz) + 'px,0)'; });
    el.addEventListener('blur', function () { g.focus = false; if (!g.vis) { el.classList.add('idle'); el.style.opacity = 0; } });
    el.addEventListener('click', function () { RB.kick(pw(-1), -1); });
  });
})();
