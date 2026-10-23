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
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(100 * pw(-2), PHI, pw(-10), pw(8)), grp = new THREE.Group(); scene.add(grp);
  const vs = `uniform float uP; varying vec3 vN; varying vec3 vV; varying vec3 vW;
    void main(){ vec3 p = position * (1.0 + uP); vec4 mv = modelViewMatrix * vec4(p, 1.0); vN = normalize(normalMatrix * normal); vV = -mv.xyz; vW = (modelMatrix * vec4(p, 1.0)).xyz; gl_Position = projectionMatrix * mv; }`;
  const fs = `uniform vec3 uC; uniform float uI; uniform vec4 uPl; varying vec3 vN; varying vec3 vV; varying vec3 vW;
    void main(){ if (dot(vW, uPl.xyz) > uPl.w) discard; float rim = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 1.618034);
      gl_FragColor = vec4(uC * (0.236068 + rim), (0.145898 + rim) * uI); }`;
  const plane = new THREE.Vector4(0, 0, 1, PHI);
  const shells = D.layers.map(L => {
    const m = new THREE.ShaderMaterial({ vertexShader: vs, fragmentShader: fs, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
      uniforms: { uC: { value: new THREE.Color(1, 1, 1) }, uI: { value: pw(-2) }, uP: { value: 0 }, uPl: { value: plane } } });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(Math.max(L.b, pw(-8)), 34, 21), m); grp.add(mesh); return { L, m };
  });
  const lay = k => D.layers.find(l => l.key === k), gddyB = lay('gddy').b, coreB = lay('core').b, quartzB = lay('quartz').b;
  const ac = D.vectors.find(v => v.domain === 'acoustic');
  const tr = D.transit, tOmax = tr.t_opt[tr.t_opt.length - 1], tAmax = tr.t_ac[tr.t_ac.length - 1];
  const trR = D.thermal_track.map(p => p[0]).reverse(), trF = D.thermal_track.map(p => Math.log(p[1])).reverse();
  const PZ = Math.max(...D.layers.map(l => l.piezo || 0)), PY = Math.max(...D.layers.map(l => l.pyro || 0));
  const share = k => D.acoustic_l0.map(md => md.share[k] || 0);
  const dw = DOM.map((d, i) => i === 0 ? 1 : 0);
  let di = 0, vis = false, tWin = 0, spin = new THREE.Vector3(), q = new THREE.Quaternion(), dwell = 0, hover = null, last = 0, acc = 0;
  const Qd = Math.log(lay('ferrite').Q) / Math.log(PHI), tauSpin = Qd / (Math.PI * S.f0);
  let imagOn = false, imagMod = null, ent3d = null;
  RB.three = { THREE, scene, grp, cam, D, hooks: [] };
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
    acc += dt; if (acc < S.F * PHI) return; dt = acc; acc = 0;   // 60/phi fps cap
    // windowing state
    for (let i = 0; i < 5; i++) dw[i] += ((i === di ? 1 : 0) - dw[i]) * (1 - Math.exp(-dt * PHI));
    spin.multiplyScalar(Math.exp(-dt / tauSpin));
    const sl = spin.length(); if (sl > pw(-24)) { q.setFromAxisAngle(spin.clone().normalize(), sl * dt); grp.quaternion.premultiply(q); }
    grp.rotation.y += S.Omega / pw(4) * dt;
    const r = stage.getBoundingClientRect(), cen = 1 - cl(Math.abs(r.top + r.height / 2 - innerHeight / 2) / (innerHeight / 2), 0, 1);
    const dist = lerp(pw(3), lerp(PHI, pw(-3), S.D), cen);   // centred + deep: the camera goes inside the quartz
    const tilt = S.tilt, el = pw(-3) + tilt[0] / PHI, az = tilt[1] / PHI + S.psi;
    cam.position.set(dist * Math.sin(az) * Math.cos(el), dist * Math.sin(el), dist * Math.cos(az) * Math.cos(el)); cam.lookAt(0, 0, 0);
    dwell = hover ? dwell + dt : Math.max(0, dwell - dt * PHI);
    const depthCut = 1 + pw(-4) - cl(dwell / pw(3), 0, 1) * (1 + pw(-2));   // dwell deepens the cut past the core
    const n = hover ? hover.clone().normalize() : cam.position.clone().normalize();
    plane.set(n.x, n.y, n.z, depthCut);
    tWin += dt / (pw(3) * pw(S.D * PHI)); tWin %= 1;   // time window: one transit per phi^3 s, slower when deep
    const rfO = interp(tr.t_opt, tr.r, tWin * tOmax), rfA = interp(tr.t_ac, tr.r, tWin * tAmax);
    let fs = 0, es = 0; for (let k = 0; k < 5; k++) { fs += S.E[k] * S.f0 * pw(k); es += S.E[k]; }
    const fReal = (es > pw(-19) ? fs / es : S.f0) * pw(32), rp = interp(trF, trR, Math.log(fReal));
    const Tt = S.T, Tc = D.thresholds, tc = Tt < Tc.T_ref_K ? COL.cold.map((c, i) => lerp(COL.ref[i], c, cl((Tc.T_ref_K - Tt) / (Tc.T_ref_K - Tc.T_c_gddy_K), 0, 1))) : COL.hot.map((c, i) => lerp(COL.ref[i], c, cl((Tt - Tc.T_ref_K) / (Tc.T_curie_bto_K - Tc.T_ref_K), 0, 1)));
    const lc = S.rgb.map(v => v / 255);
    shells.forEach(({ L, m }) => {
      const b = L.b, sh = share(L.key); let pulse = 0; for (let k = 0; k < sh.length && k < 5; k++) pulse += sh[k] * S.x[k];
      const g = x => Math.exp(-x * x / (pw(-6) * pw(-6)) / PHI);
      const Io = (pw(-4) + g(b - rfO) * (1 + S.B)) * (b > gddyB + pw(-10) ? pw(-4) : 1);
      const Ia = b <= ac.r1 + pw(-10) ? pw(-4) + g(b - rfA) + Math.abs(pulse) : pw(-5);
      const It = b <= rp ? pw(-1) : pw(-5);
      const Ie = (L.piezo ? Math.abs(pulse) * L.piezo / PZ : 0) + (L.pyro ? Math.abs(Tt - Tc.T_ref_K) / (Tc.T_curie_bto_K - Tc.T_ref_K) * L.pyro / PY : 0) + pw(-6);   // piezo d / quartz d11, pyro p / BTO p (model maxima)
      const Im = L.key === 'ferrite' ? pw(-5) : pw(-8); // B = 0: radial fields have no curl (no drive defined)
      const I = [Io, Ia, It, Ie, Im], C = [lc, COL.acoustic, tc, COL.electric, COL.magnetic];
      let cr = 0, cg = 0, cb = 0, it = 0; for (let i = 0; i < 5; i++) { const w = dw[i] * I[i]; it += w; cr += C[i][0] * w; cg += C[i][1] * w; cb += C[i][2] * w; }
      m.uniforms.uC.value.setRGB(cr / (it || 1), cg / (it || 1), cb / (it || 1)); m.uniforms.uI.value = cl(it * PHI, 0, PHI) / PHI;
      m.uniforms.uP.value = (dw[1] + dw[3]) * pulse / pw(4);
    });
    // spec 17: windowing past a physics threshold (camera inside the quartz crystal, or the cut reaching the plasma core)
    const inside = dist < quartzB || depthCut < coreB, outside = dist > quartzB * PHI && depthCut > coreB * PHI;
    if (inside && !imagOn) { imagOn = true; RB.emit('imaginarium', { on: true }); if (!imagMod) imagMod = import(new URL('imaginarium.js', import.meta.url).href).then(m => m.attach(RB.three)); }
    else if (outside && imagOn) { imagOn = false; RB.emit('imaginarium', { on: false }); }
    S.imag += ((imagOn ? 1 : 0) - S.imag) * (1 - Math.exp(-dt / S.T0));
    // spec 22 tier 2: heavy 3D entities only deep in the cascade or after sustained interaction
    if (!ent3d && (S.D > pw(-1) || S.interactions >= Math.round(pw(5)))) ent3d = import(new URL('entities3d.js', import.meta.url).href).then(m => m.attach(RB.three));
    for (const f of RB.three.hooks) f(S, dt);
    rnd.render(scene, cam);
  });
}
