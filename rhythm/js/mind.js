// Rebella rhythm tier 3: mind overlay. 21 (Fibonacci) leaky integrate-and-fire neurons placed by phyllotaxis.
// dV/dt = (I - V) / tau_m, spike at V >= 1, then refractory. Biology ratio tau_m : tau_ref ~ 10 (cortex ~20 ms : 2 ms)
// kept as phi^5 = 11.1, time-scaled so tau_m = 1/phi s. Synapses run to the parastichy neighbours (i +- 5, i +- 8),
// spikes travel at a finite conduction velocity (delay = distance / v). Input = site physics band energies.
const RB = window.RB, PHI = RB.PHI, pw = RB.pw, GA = 2 * Math.PI / (PHI * PHI);
const amb = document.getElementById('amb'), cv = document.createElement('canvas'); cv.id = 'rb-mind'; amb.appendChild(cv);
const cx = cv.getContext('2d'), N = 21, TM = 1 / PHI, TR = TM / pw(5), V = new Float32Array(N), ref = new Float32Array(N), glow = new Float32Array(N);
let W, H, P = [], sig = [], reveal = 0;
function size() { W = cv.width = Math.ceil(innerWidth / 2); H = cv.height = Math.ceil(innerHeight / 2); const m = Math.min(W, H) / PHI;
  P = []; for (let i = 0; i < N; i++) { const r = m * Math.sqrt((i + 0.5) / N); P.push([W / 2 + r * Math.cos(i * GA), H / 2 + r * Math.sin(i * GA)]); } }
size(); addEventListener('resize', size, { passive: true });
const T = i => [i - 8, i - 5, i + 5, i + 8].filter(j => j >= 0 && j < N);
RB.cue(k => { if (k === 'knee') reveal = 1; });
reveal = 1 / PHI;
RB.on((S, dt) => {
  const vc = Math.min(W, H) / PHI;
  for (let i = 0; i < N; i++) {
    let I = S.D / pw(2);
    for (let k = 0; k < 5; k++) I += S.E[k] * (1 + Math.cos(i * k * GA)) / 2 / PHI;
    glow[i] *= Math.exp(-dt * pw(2));
    if (ref[i] > 0) { ref[i] -= dt; continue; }
    V[i] += (I - V[i]) * dt / TM;
    if (V[i] >= 1) { V[i] = 0; ref[i] = TR; glow[i] = 1; for (const j of T(i)) { const d = Math.hypot(P[j][0] - P[i][0], P[j][1] - P[i][1]); sig.push({ i, j, t: 0, T: d / vc }); } }
  }
  cx.clearRect(0, 0, W, H);
  const a = reveal * (0.382 + 0.618 * S.D); if (a < 0.01) return;
  cx.strokeStyle = 'rgba(180,67,108,' + (a * 0.382).toFixed(3) + ')'; cx.lineWidth = 0.618;
  sig = sig.filter(s => { s.t += dt; if (s.t >= s.T) { V[s.j] += 1 / pw(2); return false; } return true; });
  for (const s of sig) { const f = s.t / s.T, p = P[s.i], q = P[s.j]; cx.beginPath(); cx.moveTo(p[0], p[1]); cx.lineTo(p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f); cx.stroke(); }
  for (let i = 0; i < N; i++) { const g = glow[i]; cx.fillStyle = 'rgba(180,67,108,' + (a * (0.146 + 0.618 * g)).toFixed(3) + ')'; cx.beginPath(); cx.arc(P[i][0], P[i][1], 1.618 + g * 2.618, 0, 6.2832); cx.fill(); }
});
