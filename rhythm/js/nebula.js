// Rebella rhythm tier 1: nebula of 377 (Fibonacci) motes you float among, inside the vortex.
// Placement: phyllotaxis (index i at golden angle i*137.5 deg, radius ~ sqrt(i)). Motion: Rankine vortex,
// omega ~ 1/r^2 outside the core (angular momentum conservation) so differential rotation winds spiral arms;
// golden-spiral inflow, motes reaching the core re-enter at the rim (count conserved). Light: Balmer colour
// from the site physics, inverse-square falloff from the core glow. Depth narrows the field and thins the motes.
const RB = window.RB, S = RB.S, PHI = RB.PHI, pw = RB.pw, GA = 2 * Math.PI / (PHI * PHI), B = 2 * Math.log(PHI) / Math.PI;
const amb = document.getElementById('amb'), cv = document.createElement('canvas'); cv.id = 'rb-neb';
amb.insertBefore(cv, amb.querySelector('.vig'));
const cx = cv.getContext('2d', { alpha: true }), N = 377, R = new Float32Array(N), A = new Float32Array(N);
for (let i = 0; i < N; i++) { R[i] = Math.sqrt((i + 1) / N); A[i] = i * GA; }
let W = 0, H = 0, op = 0;
function size() { W = cv.width = Math.ceil(innerWidth / 2); H = cv.height = Math.ceil(innerHeight / 2); }
size(); addEventListener('resize', size, { passive: true });
RB.on((S, dt) => {
  const rc = 1 / pw(4), cxp = W * (0.5 + (S.gaze[0] - 0.5) / pw(3)), cyp = H * (0.5 + (S.gaze[1] - 0.5) / pw(3));
  const zoom = 1 + S.D * PHI, Rv = Math.hypot(W, H) / 2 * zoom, nVis = Math.round(N * Math.pow(1 - S.D / PHI, PHI));
  op = Math.min(1, op + dt / PHI);
  cx.clearRect(0, 0, W, H);
  const [r, g, b] = S.rgb;
  cx.fillStyle = `rgb(${r},${g},${b})`;
  for (let i = 0; i < N; i++) {
    const rr = R[i], om = S.Omega / pw(2) / Math.max(rr * rr, rc * rc) * rc;
    A[i] += om * dt; R[i] -= B * rr * om * dt / pw(4);
    if (R[i] < rc / PHI) R[i] = 1;
    if (i >= nVis) continue;
    const x = cxp + Math.cos(A[i]) * rr * Rv, y = cyp + Math.sin(A[i]) * rr * Rv;
    if (x < 0 || y < 0 || x > W || y > H) continue;
    const lit = (0.236 + 0.764 / (1 + (rr / rc) * (rr / rc) / pw(4))) * (0.382 + 0.618 * S.B), s = 1 + rr * PHI * zoom;
    cx.globalAlpha = op * lit; cx.fillRect(x, y, s, s);
  }
  cx.globalAlpha = 1;
});
