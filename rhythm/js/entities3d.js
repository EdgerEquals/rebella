// Rebella rhythm spec 22 tier 2: heavy 3D entities, lazy, reusing the loaded three.js. Only deep in the cascade
// (D > 1/phi) or after sustained interaction (round(phi^5) = 11 taps/keys). Concurrency: 0-1 near the top, up to 2 deep.
// ORGANISM: a waving rabbit built from ellipsoids (body : head : ear proportions by phi); the paw waves as a damped
// pendulum driven at band 2. ENTITY: a rigid doorway (posts + lintel, aspect phi) tumbling as a free rigid body.
// Both orbit an OFF-AXIS pivot outside the sphere on a golden spiral (radius / phi per turn, reset out of view).
const RB = window.RB, S = RB.S, PHI = RB.PHI, pw = RB.pw;
export function attach(X) {
  const { THREE, scene } = X, TAU = 2 * Math.PI;
  scene.add(new THREE.HemisphereLight(0xFFF8F4, 0x3A2B35, PHI));
  const warm = new THREE.MeshLambertMaterial({ color: 0xFFF8F4 }), pink = new THREE.MeshLambertMaterial({ color: 0xF8CFDB }), cool = new THREE.MeshLambertMaterial({ color: 0x4C5E7A });
  const ell = (m, sx, sy, sz, x, y, z) => { const o = new THREE.Mesh(new THREE.SphereGeometry(1, 13, 8), m); o.scale.set(sx, sy, sz); o.position.set(x, y, z); return o; };
  const u = pw(-4), rabbit = new THREE.Group();
  rabbit.add(ell(warm, u * PHI, u, u, 0, 0, 0), ell(warm, u / PHI, u / PHI, u / PHI, u * PHI, u, 0),
    ell(pink, u * pw(-3), u, u * pw(-3), u * PHI, u * PHI * PHI, -u * pw(-2)), ell(pink, u * pw(-3), u, u * pw(-3), u * PHI, u * PHI * PHI, u * pw(-2)));
  const arm = new THREE.Group(); arm.position.set(u * PHI / PHI, u / PHI, u / PHI); arm.add(ell(warm, u * pw(-3), u / PHI, u * pw(-3), 0, u / PHI, 0)); rabbit.add(arm);
  const door = new THREE.Group(), bx = (w, h, x, y) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, u * pw(-2)), cool); o.position.set(x, y, 0); return o; };
  door.add(bx(u * pw(-2), u * PHI * 2, -u, 0), bx(u * pw(-2), u * PHI * 2, u, 0), bx(u * 2 + u * pw(-2), u * pw(-2), 0, u * PHI));
  const ents = [{ o: rabbit, n: 1, ph: 0 }, { o: door, n: 2, ph: 1 / PHI }]; ents.forEach(e => { e.o.visible = false; scene.add(e.o); });
  const piv = new THREE.Vector3(PHI * PHI, 0, -PHI);
  X.hooks.push((S, dt) => {
    const cap = S.D > pw(-1) ? 2 : 1;
    ents.forEach((e, i) => {
      e.o.visible = i < cap; if (!e.o.visible) return;
      e.ph += dt / (S.T0 * pw(e.n + 2)); const t = e.ph % 1, R = PHI * PHI * pw(-t), a = Math.PI + (t - 0.5) * TAU;
      e.o.position.set(piv.x + R * Math.cos(a), Math.sin(a) * pw(-2), piv.z + R * Math.sin(a));
      if (e.o === rabbit) { e.o.lookAt(0, 0, 0); arm.rotation.z = Math.sin(S.tau * S.w[2]) / PHI; }   // waving
      else { e.o.rotation.x += S.Omega * pw(-1) * dt; e.o.rotation.y += S.Omega * pw(-2) * dt; }      // rigid tumble
    });
  });
}
