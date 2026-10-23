// Rebella rhythm audio (only after the Sound button; off by default). Partials = the sphere's first five l=0 shell
// modes (1.011-8.482 MHz, base5) / phi^18 (175-1468 Hz); bed = first HHO gas-cavity mode (665 kHz / phi^18 = 115 Hz).
// Decays = the model's tau_ac x phi^18, so each partial keeps its real Q (Q = pi f tau). Gains follow band energies.
// Depth lowers a low-pass (air absorption ~ f^2 over distance). Imaginarium: pitch drops by phi per rung (spec 17).
// Master gain phi^-8 (about -33 dB).
const RB = window.RB, C = window.RB_CONST, PHI = RB.PHI, pw = RB.pw, K = pw(18);
export function start() {
  const ac = new (window.AudioContext || window.webkitAudioContext)(), master = ac.createGain(); master.gain.value = 0;
  const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = C.l0[4][0] / K; lp.connect(master); master.connect(ac.destination);
  const osc = f => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.value = 0; o.connect(g); g.connect(lp); o.start(); return { o, g, f }; };
  const parts = C.l0.map(([f, Q, tau]) => Object.assign(osc(f / K), { tau: tau * K })), bed = osc(C.gas0 / K);
  let on = false;
  RB.on(S => {
    if (!on) return; const t = ac.currentTime, down = pw(-S.rung * S.imag);
    parts.forEach((p, k) => { p.g.gain.setTargetAtTime(Math.tanh(S.E[k]) / PHI * pw(-k), t, p.tau / Math.PI); p.o.frequency.setTargetAtTime(p.f * down, t, pw(-1)); });
    bed.g.gain.setTargetAtTime(S.still / PHI, t, PHI); bed.o.frequency.setTargetAtTime(bed.f * down, t, pw(-1));
    lp.frequency.setTargetAtTime(C.l0[4][0] / K * pw(-3 * S.D) * down, t, pw(-1));
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) ac.suspend(); else if (on) ac.resume(); });
  return { set(v) { on = v; if (v) { ac.resume(); master.gain.setTargetAtTime(pw(-8), ac.currentTime, pw(-1)); } else master.gain.setTargetAtTime(0, ac.currentTime, pw(-2)); } };
}
