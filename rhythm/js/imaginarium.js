// Rebella rhythm: the imaginarium (spec 17). Not a new scene: an ADDITIVE layer on top of the sphere, reached when the
// windowing crosses a physics threshold (the camera inside the quartz crystal, or the cut reaching the plasma core).
// Same model, different energy regime: a cloud of F(11) = 89 motes on a Fibonacci (golden-angle) sphere lattice
// SCATTERS outward and DOWNSHIFTS: each rung lengthens every period by phi (site time runs at phi^-rung), drops the
// pitch by phi and redshifts the colour along Edger's Downshift Phosphor Ladder (486 nm Hbeta ... 2.8 um Er3+). At the
// silica/quartz wall (opaque beyond ~3.5 um, the model's outer boundary) it REFLECTS with restitution 1/phi (damped);
// once the bounces die it RE-CONCENTRATES and upshifts back toward Hbeta, then scatters again (cyclic, no UI).
const RB = window.RB, S = RB.S, PHI = RB.PHI, pw = RB.pw, C = window.RB_CONST;
export function attach(X) {
  const { THREE, scene } = X, NP = RB.fib(11), pos = new Float32Array(NP * 3), dir = [], GA = S.GA;
  for (let i = 0; i < NP; i++) { const y = 1 - 2 * (i + 0.5) / NP, r = Math.sqrt(1 - y * y), a = i * GA; dir.push([r * Math.cos(a), y, r * Math.sin(a)]); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  // round, soft motes: a 21x21 procedural Gaussian (sigma = 21/phi^3 px), no image asset
  const N = 21, px = new Uint8Array(N * N * 4);
  for (let i = 0; i < N * N; i++) { const x = i % N - (N - 1) / 2, y = Math.floor(i / N) - (N - 1) / 2, a = Math.exp(-(x * x + y * y) / (2 * (N / pw(3)) ** 2)); px.set([255, 255, 255, Math.round(a * 255)], i * 4); }
  const tex = new THREE.DataTexture(px, N, N); tex.needsUpdate = true;
  const mat = new THREE.PointsMaterial({ map: tex, alphaTest: pw(-8), size: pw(-4), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffffff });
  const pts = new THREE.Points(geo, mat); scene.add(pts);
  const L = C.ladder, wall = 1, a = 2 / Math.pow(S.T0 * PHI, 2), vmin = Math.sqrt(2 * a) * pw(-3);
  let rho = pw(-4), v = 0, phase = 1;   // +1 scattering out, -1 re-concentrating
  X.hooks.push((S, dt) => {
    const w = S.imag; mat.opacity = w * pw(-1); if (w < pw(-8)) { pts.visible = false; S.rung = 0; return; } pts.visible = true;
    v += phase * a * dt; rho += v * dt;
    if (rho > wall) { rho = wall; v = -Math.abs(v) / PHI; if (Math.abs(v) < vmin) phase = -1; }   // damped reflection at the wall
    if (rho < pw(-4)) { rho = pw(-4); v = 0; phase = 1; }
    const k = rho * (L.length - 1); S.rung = k;                                                // rung on the ladder
    const i = Math.min(L.length - 2, Math.floor(k)), nm = L[i] + (L[i + 1] - L[i]) * (k - i), c = RB.wl(nm);
    mat.color.setRGB(c[0], c[1], c[2]);
    for (let j = 0; j < NP; j++) { const r = rho * (1 + Math.sin(S.tau * S.w[j % 5] * pw(-k)) * pw(-4)); pos[j * 3] = dir[j][0] * r; pos[j * 3 + 1] = dir[j][1] * r; pos[j * 3 + 2] = dir[j][2] * r; }
    geo.attributes.position.needsUpdate = true;
  });
}
