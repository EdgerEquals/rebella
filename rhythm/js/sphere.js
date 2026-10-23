// Rebella rhythm tier 2: chrome-less view of Edger's stratified bubble sphere (sphere-holster, base5 case).
// Same approach as sphere-holster's viewer (three.js r160, concentric shells per layer, five domains) but with
// NO panels, knobs, labels or hints. Visitors only change how the model is WINDOWED, physically:
//   bump it (pointer momentum -> angular momentum, damped by log_phi(Q) of the ferrite shell),
//   look at it (hover/dwell position aims and deepens a cross-section; device tilt moves the camera),
//   switch by contact (a tap at a latitude band selects which domain is shown),
//   centre it in the viewport (camera moves in; deeper site state widens the time window).
// Data: ../data/sphere-subset.json (5 KB, extracted by tools/build_physics_subset.py). ESTIMATED PHYSICS.
const RB = window.RB, S = RB.S, PHI = RB.PHI, pw = RB.pw;
const CDN = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
const DOM = ['optical', 'acoustic', 'thermal', 'electric', 'magnetic'];
const hex = h => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
const COL = { acoustic: hex('#FCD9C0'), electric: hex('#DCD0F2'), magnetic: hex('#C8EBD5'), cold: hex('#B5E3E0'), ref: hex('#FBE7B0'), hot: hex('#B4436C') };
const lerp = (a, b, t) => a + (b - a) * t, cl = (x, a, b) => Math.max(a, Math.min(b, x));
function interp(xs, ys, x) { if (x <= xs[0]) return ys[0]; for (let i = 1; i < xs.length; i++) if (x <= xs[i]) return lerp(ys[i - 1], ys[i], (x - xs[i - 1]) / (xs[i] - xs[i - 1] || 1)); return ys[ys.length - 1]; }

export async function mount(stage, dataUrl) {
  const [THREE, D] = await Promise.all([import(CDN), fetch(dataUrl).then(r => r.json())]);
  const rnd = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
  rnd.setPixelRatio(Math.min(devicePixelRatio || 1, PHI));
  const cvs = rnd.domElement; cvs.setAttribute('aria-hidden', 'true');
  stage.replaceChildren(cvs);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(38.2, 1.618, 0.01, 40), grp = new THREE.Group(); scene.add(grp);
  const vs = `uniform float uP; varying vec3 vN; varying vec3 vV; varying vec3 vW;
    void main(){ vec3 p = position * (1.0 + uP); vec4 mv = modelViewMatrix * vec4(p, 1.0); vN = normalize(normalMatrix * normal); vV = -mv.xyz; vW = (modelMatrix * vec4(p, 1.0)).xyz; gl_Position = projectionMatrix * mv; }`;
  const fs = `uniform vec3 uC; uniform float uI; uniform vec4 uPl; varying vec3 vN; varying vec3 vV; varying vec3 vW;
    void main(){ if (dot(vW, uPl.xyz) > uPl.w) discard; float rim = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 1.618);
      gl_FragColor = vec4(uC * (0.236 + rim), (0.146 + rim) * uI); }`;
  const plane = new THREE.Vector4(0, 0, 1, 2);
  const shells = D.layers.map(L => {
    const m = new THREE.ShaderMaterial({ vertexShader: vs, fragmentShader: fs, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
      uniforms: { uC: { value: new THREE.Color(1, 1, 1) }, uI: { value: 0.3 }, uP: { value: 0 }, uPl: { value: plane } } });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(Math.max(L.b, 0.02), 48, 32), m); grp.add(mesh); return { L, m };
  });
  const gddyB = (D.layers.find(l => l.key === 'gddy') || { b: 0.382 }).b;
  const ac = D.vectors.find(v => v.domain === 'acoustic') || { r1: 0.38 };
  const tr = D.transit, tOmax = tr.t_opt[tr.t_opt.length - 1], tAmax = tr.t_ac[tr.t_ac.length - 1];
  const trR = D.thermal_track.map(p => p[0]).reverse(), trF = D.thermal_track.map(p => Math.log(p[1])).reverse();
  const share = k => D.acoustic_l0.map(md => md.share[k] || 0);
  const dw = DOM.map((d, i) => i === 0 ? 1 : 0);
  let di = 0, vis = false, tWin = 0, spin = new THREE.Vector3(), q = new THREE.Quaternion(), dwell = 0, hover = null, last = 0, acc = 0;
  const Qd = Math.log((D.layers.find(l => l.key === 'ferrite') || { Q: 500 }).Q) / Math.log(PHI), tauSpin = Qd / (Math.PI * S.f0);
  new IntersectionObserver(es => { vis = es[0].isIntersecting; }).observe(stage);
  function size() { const r = stage.getBoundingClientRect(); rnd.setSize(r.width, r.height, false); cam.aspect = r.width / Math.max(1, r.height); cam.updateProjectionMatrix(); }
  size(); addEventListener('resize', size, { passive: true });
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), unit = new THREE.Sphere(new THREE.Vector3(), 1), hit = new THREE.Vector3();
  function pick(e) { const r = cvs.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, cam); return ray.ray.intersectSphere(unit, hit); }
  let lp = null;
  cvs.addEventListener('pointermove', e => {
    const h = pick(e); hover = h ? hit.clone() : null;
    if (h && lp) { // bump: pointer momentum at the contact point -> torque (r x p) on the sphere
      const dv = new THREE.Vector3((e.clientX - lp[0]), -(e.clientY - lp[1]), 0).multiplyScalar(1 / (stage.clientWidth || 1)).applyQuaternion(cam.quaternion);
      spin.add(new THREE.Vector3().crossVectors(hit, dv).multiplyScalar(PHI * PHI)); RB.kick(Math.min(dv.length(), 1) / pw(3), 2);
    }
    lp = [e.clientX, e.clientY];
  }, { passive: true });
  cvs.addEventListener('pointerleave', () => { hover = null; lp = null; });
  cvs.addEventListener('pointerdown', e => { if (!pick(e)) return; const lat = Math.asin(cl(hit.clone().normalize().y, -1, 1)); const z = cl(Math.floor((lat / Math.PI + 0.5) * 5), 0, 4); di = z === di ? (di + 1) % 5 : z; });
  RB.on((S, dt) => {
    if (!vis) return;
    acc += dt; if (acc < 1 / 30) return; dt = acc; acc = 0;
    // windowing state
    for (let i = 0; i < 5; i++) dw[i] += ((i === di ? 1 : 0) - dw[i]) * (1 - Math.exp(-dt * PHI));
    spin.multiplyScalar(Math.exp(-dt / tauSpin));
    const sl = spin.length(); if (sl > 1e-5) { q.setFromAxisAngle(spin.clone().normalize(), sl * dt); grp.quaternion.premultiply(q); }
    grp.rotation.y += S.Omega / pw(4) * dt;
    const r = stage.getBoundingClientRect(), cen = 1 - cl(Math.abs(r.top + r.height / 2 - innerHeight / 2) / (innerHeight / 2), 0, 1);
    const dist = lerp(4.236, lerp(1.618, 0.618, S.D), cen);
    const tilt = S.tilt, el = 0.236 + tilt[0] / PHI, az = tilt[1] / PHI;
    cam.position.set(dist * Math.sin(az) * Math.cos(el), dist * Math.sin(el), dist * Math.cos(az) * Math.cos(el)); cam.lookAt(0, 0, 0);
    dwell = hover ? dwell + dt : Math.max(0, dwell - dt * PHI);
    const depthCut = 1.1 - cl(dwell / (PHI * PHI * PHI), 0, 1) * 1.3;
    const n = hover ? hover.clone().normalize() : cam.position.clone().normalize();
    plane.set(n.x, n.y, n.z, depthCut);
    tWin += dt / (pw(3) * (1 + S.D * PHI)); tWin %= 1;   // time window: one transit per phi^3 s, slower when deep
    const rfO = interp(tr.t_opt, tr.r, tWin * tOmax), rfA = interp(tr.t_ac, tr.r, tWin * tAmax);
    let fs = 0, es = 0; for (let k = 0; k < 5; k++) { fs += S.E[k] * S.f0 * pw(k); es += S.E[k]; }
    const fReal = (es > 1e-4 ? fs / es : S.f0) * pw(32), rp = interp(trF, trR, Math.log(fReal));
    const Tt = S.T, Tc = D.thresholds, tc = Tt < Tc.T_ref_K ? COL.cold.map((c, i) => lerp(COL.ref[i], c, cl((Tc.T_ref_K - Tt) / (Tc.T_ref_K - Tc.T_c_gddy_K), 0, 1))) : COL.hot.map((c, i) => lerp(COL.ref[i], c, cl((Tt - Tc.T_ref_K) / (Tc.T_curie_bto_K - Tc.T_ref_K), 0, 1)));
    const lc = S.rgb.map(v => v / 255);
    shells.forEach(({ L, m }) => {
      const b = L.b, sh = share(L.key); let pulse = 0; for (let k = 0; k < sh.length && k < 5; k++) pulse += sh[k] * S.x[k];
      const g = x => Math.exp(-x * x / (0.0618 * 0.0618));
      const Io = (0.146 + g(b - rfO) * (1 + S.B)) * (b > gddyB + 0.01 ? 1 / pw(4) : 1);
      const Ia = b <= ac.r1 + 0.01 ? 0.146 + g(b - rfA) + Math.abs(pulse) : 0.09;
      const It = b <= rp ? 0.618 : 0.09;
      const Ie = (L.piezo ? Math.abs(pulse) * L.piezo / 2.3e-12 : 0) + (L.pyro ? Math.abs(Tt - Tc.T_ref_K) * L.pyro / 2e-4 / 100 : 0) + 0.05;
      const Im = L.key === 'ferrite' ? 0.09 : 0.02; // B = 0: radial fields have no curl (no drive defined)
      const I = [Io, Ia, It, Ie, Im], C = [lc, COL.acoustic, tc, COL.electric, COL.magnetic];
      let cr = 0, cg = 0, cb = 0, it = 0; for (let i = 0; i < 5; i++) { const w = dw[i] * I[i]; it += w; cr += C[i][0] * w; cg += C[i][1] * w; cb += C[i][2] * w; }
      m.uniforms.uC.value.setRGB(cr / (it || 1), cg / (it || 1), cb / (it || 1)); m.uniforms.uI.value = cl(it * PHI, 0, PHI) / PHI;
      m.uniforms.uP.value = (dw[1] + dw[3]) * pulse / pw(4);
    });
    rnd.render(scene, cam);
  });
}
