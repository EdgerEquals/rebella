// Rebella rhythm: the mind overlay (spec 13, 15). You are also inside Edger's mind, and nothing says so.
// Revelation is stepped by phi on engagement (dwell + attention): stage k at T0 * phi^(k+1) s = 12.6, 20.4, 33, 53, 86 s.
// 1 neuron sites glow faintly among the nebula; 2 they fire; 3 they answer where you look; 4 spikes travel to their
// parastichy neighbours (i +- 5, i +- 8) with a conduction delay; 5 the tunnel walls fold into ridges (cortex-like fBm).
// Leaky integrate-and-fire: dV/dt = (I - V)/tau_m, tau_m = phi^3 s, refractory tau_ref = phi^-2 s, so no neuron can
// flash faster than 1/tau_ref = 2.6 Hz (spec 18: never > 3 flashes/s). Drawn by the field shader (one pass).
const RB = window.RB, S = RB.S, PHI = RB.PHI, pw = RB.pw, GA = S.GA;
const NN = 21, TM = pw(3), TR = pw(-2), V = new Float32Array(NN), ref = new Float32Array(NN), glow = new Float32Array(NN), N = new Float32Array(NN * 3);
const mind = RB.mind = { N, M: 0, stage: 0 }; let sig = [];
const T = i => [i - 8, i - 5, i + 5, i + 8].filter(j => j >= 0 && j < NN);
RB.on((S, dt) => {
  const st = Math.max(0, Math.min(5, Math.floor(Math.log(Math.max(1, S.eng / S.T0)) / Math.log(PHI)) - 1));
  if (st !== mind.stage) { mind.stage = st; RB.emit('mind', { stage: st }); }
  mind.M += (st / 5 - mind.M) * (1 - Math.exp(-dt / S.T0));
  const W = innerWidth, H = innerHeight, m = Math.min(W, H) / PHI, I0 = RB.input;
  for (let i = 0; i < NN; i++) {
    const r = m * Math.sqrt((i + 1 / PHI) / NN), a = i * GA + S.psi;
    const x = W / 2 + r * Math.cos(a), y = H / 2 + r * Math.sin(a); N[i * 3] = x; N[i * 3 + 1] = y;
    glow[i] *= Math.exp(-dt / TR);
    if (st >= 2 && ref[i] <= 0) {
      let I = S.D * pw(-2); for (let k = 0; k < 5; k++) I += S.E[k] * (1 + Math.cos(i * k * GA)) / 2 / PHI;
      if (st >= 3) I += Math.exp(-Math.hypot(x - I0.p[0], y - I0.p[1]) / (m / PHI)) * PHI;    // answers your gaze
      V[i] += (I - V[i]) * dt / TM;
      if (V[i] >= 1) { V[i] = 0; ref[i] = TR; glow[i] = 1; if (st >= 4) for (const j of T(i)) sig.push({ j, t: Math.hypot(N[j * 3] - x, N[j * 3 + 1] - y) / (m / PHI) }); }
    } else ref[i] -= dt;
    N[i * 3 + 2] = glow[i];
  }
  sig = sig.filter(s => (s.t -= dt) > 0 || (V[s.j] += pw(-2), false));
});
