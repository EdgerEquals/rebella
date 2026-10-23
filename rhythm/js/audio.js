// Rebella rhythm audio (loaded only after the Sound button is pressed). Partials = the sphere's first five
// l=0 shell modes (1.011-8.482 MHz, base5) divided by phi^18 (175-1468 Hz); the bed is the first HHO gas-cavity
// mode (665 kHz / phi^18 = 115 Hz). Decays use the model's tau_ac multiplied by the same phi^18, so each partial
// keeps its real Q (Q = pi f tau). Gains follow the band energies; depth lowers a low-pass cutoff because high
// frequencies are absorbed more over distance (air absorption ~ f^2). Master gain is very quiet (-34 dB).
const RB = window.RB, C = window.RB_CONST, PHI = RB.PHI, K = Math.pow(PHI, 18);
export function start() {
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  const master = ac.createGain(); master.gain.value = 0;
  const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = C.l0[4][0] / K;
  lp.connect(master); master.connect(ac.destination);
  const parts = C.l0.map(([f, Q, tau]) => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f / K; g.gain.value = 0; o.connect(g); g.connect(lp); o.start(); return { g, tau: tau * K }; });
  const bo = ac.createOscillator(), bg = ac.createGain(); bo.frequency.value = C.gas0 / K; bg.gain.value = 0; bo.connect(bg); bg.connect(lp); bo.start();
  let on = false;
  RB.on(S => {
    if (!on) return; const t = ac.currentTime;
    parts.forEach((p, k) => p.g.gain.setTargetAtTime(Math.tanh(S.E[k]) / PHI / (k + 1), t, p.tau / Math.PI));
    bg.gain.setTargetAtTime(S.still / PHI, t, PHI);
    lp.frequency.setTargetAtTime(C.l0[4][0] / K / Math.pow(PHI, 3 * S.D), t, 1 / PHI);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) ac.suspend(); else if (on) ac.resume(); });
  return { set(v) { on = v; if (v) { ac.resume(); master.gain.setTargetAtTime(0.02, ac.currentTime, 1 / PHI); } else master.gain.setTargetAtTime(0, ac.currentTime, 1 / PHI / PHI); } };
}
