/* Rebella rhythm L0: the tunnel you float in (spec 20, 22 tier 0). ONE full-screen WebGL fragment shader,
   rendered at 1/phi resolution (governor steps it by phi), capped at 60/phi fps, paused when hidden.
   Log-polar coordinates around an OFF-SCREEN pivot (spec 12): translation in log_phi(r) is a seamless infinite
   zoom (one unit = scale by phi). Nebula = domain-warped fBm (lacunarity phi, gain 1/phi) from a golden-ratio
   (Weyl) hash, modulated by the site physics (Balmer colour, brightness, depth). Per-region LOD: a low-frequency
   noise sets the octave count and the pixel snap step (phi^k) for each region (fractal resolution, spec 22).
   Bodies: up to F(7)=13 hard spots (entities, cue 1) + F(6)=8 soft drifters (organisms: cell, diatom, spore,
   jellyfish; cue phi^-2..phi^-4), drawn as SDFs whose edge sharpness = cue. CPU physics: bodies ride the vortex
   (omega ~ 1/r^2 about the pivot, golden-spiral inflow), collide with each other and the visitor with
   restitution = cue, absorption = 1 - cue (absorbed energy changes the interior). Canvas2D fallback: a
   generated 55x55 (fib 10) noise tile in nested golden-spiral layers. */
(function () {
  'use strict';
  var RB = window.RB; if (!RB) return;
  var S = RB.S, PHI = RB.PHI, pw = RB.pw, TAU = 2 * Math.PI, GA = S.GA, B = 2 * Math.log(PHI) / Math.PI, fib = RB.fib;
  var amb = document.getElementById('amb'), cv = document.createElement('canvas'); cv.id = 'field'; amb.appendChild(cv);
  var FS = '#define F 1.618034\nprecision mediump float;uniform vec2 R,P;uniform float T,Z,D,M,G,O,Y,L,X;uniform vec3 C;uniform vec4 Q[21],K[21];uniform vec3 N[21];' +
    'float h(vec2 p){vec2 q=fract(p*vec2(F-1.,1./(F*F))+F);q+=dot(q,q.yx+21.*F);return fract((q.x+q.y)*q.x);}' +
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}' +
    'float fb(vec2 p,float o){float s=0.,a=1.,t=0.;for(int i=0;i<6;i++){if(float(i)>=o)break;s+=a*n(p);t+=a;p=p*F+vec2(F*F,F);a/=F;}return s/t;}' +
    'void main(){vec2 p=gl_FragCoord.xy;float lod=n((p-P)/(R.y*F)+Z);float sn=pow(F,floor(lod*F*F));p=floor(p/sn)*sn+sn/2.;' +
    'vec2 v=p-P;float r=length(v),a=atan(v.y,v.x);vec2 u=vec2((a-G)/log(F),log(r)/log(F)-Z)*pow(F,-X);' +
    'float o=max(1.,O-floor(lod*F));vec2 q=vec2(fb(u*F,o),fb(u*F+vec2(F,F*F),o));float f=fb(u*F+F*q+vec2(T/(F*F*F),0.),o);' +
    'f=mix(f,1.-abs(2.*f-1.),M/F);' +
    'vec3 bg=mix(vec3(1.,.973,.957),vec3(.227,.169,.208),D/F);vec3 c=mix(C,vec3(dot(C,vec3(1./3.))),1./F);' +
    'vec3 col=mix(bg,mix(bg,c,1./F),smoothstep(1./(F*F),1.,f)*(1./(F*F)+L/F));' +
    'vec2 sc=(p-R/2.)/R.y;col=mix(col,bg*(1.-D/F),smoothstep(1./F-D/(F*F),1./F+1./(F*F)-D/F,length(sc))*D);' +
    'for(int i=0;i<21;i++){vec4 b=Q[i];if(b.z<=0.)continue;vec2 d=p-b.xy;if(length(d)>b.z*F)continue;vec4 k=K[i];float cs=cos(k.z),sn2=sin(k.z);' +
    'vec2 e=vec2(cs*d.x+sn2*d.y,-sn2*d.x+cs*d.y)/b.z;float ty=k.x,sd,in1=1.;vec3 bc;float ln=length(e),an=atan(e.y,e.x);' +
    'if(ty<.5){sd=ln-1.;bc=vec3(.298,.369,.478);in1=1.-cos(ln*F*F*F*(1.+k.y)*6.2832)/(F*F*F*F);}' +
    'else if(ty<1.5){float br=1.+sin(Y*k.w)/(F*F*F*F);sd=ln-br*(1.+sin(an*5.+k.w)/(F*F*F*F));bc=vec3(.988,.851,.753);in1=1.-smoothstep(1./(F*F),1./F,ln)*(1./F)*(1.-k.y/F);}' +
    'else if(ty<2.5){vec2 g=e*vec2(1./F,1.);sd=length(g*vec2(1.,F))-1.;bc=vec3(.788,.922,.835);in1=1.-abs(sin(e.x*F*F*F*F))/(F*F*F)*(1.+k.y);}' +
    'else if(ty<3.5){sd=ln-1.;bc=vec3(.984,.906,.69);float m=99.;for(int j=-1;j<=1;j++){float s=floor(ln*ln*21.)+float(j);vec2 sp=sqrt(max(s,0.)/21.)*vec2(cos(s*6.2832/(F*F)),sin(s*6.2832/(F*F)));m=min(m,length(e-sp));}in1=1.-smoothstep(pow(F,-6.),pow(F,-4.),m)/(F*F);}' +
    'else{float bp=1.+sin(Y*k.w)/(F*F*F);sd=e.y<0.?length(e*vec2(1.,F*bp))-1.:abs(e.x-sin(e.y*F*F*F+k.w)/(F*F*F*F))-1./(F*F*F*F)+max(0.,e.y-F);bc=vec3(.973,.812,.859);}' +
    'float w=pow(F,-2.-4.*b.w);col=mix(col,bc*in1,(1.-smoothstep(-w,w,sd))*(1./F+b.w/(F*F)));' +
    'col=mix(col,bc*(1.-1./F),(1.-smoothstep(0.,w,abs(sd)))*b.w/F);}' +
    'if(M>0.)for(int i=0;i<21;i++){vec3 m=N[i];float dd=length(p-m.xy);col=mix(col,vec3(.706,.263,.424),M*(1./(F*F*F*F)+m.z/F)*(1.-smoothstep(0.,F*F*(1.+m.z*F*F),dd)));}' +
    'gl_FragColor=vec4(col,1.);}';
  var VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var gl = cv.getContext('webgl', { antialias: false, alpha: false, depth: false, powerPreference: 'low-power' }), U = {}, ctx2, tile;
  if (gl) {
    var pr = gl.createProgram();
    [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, FS]].forEach(function (s) { var sh = gl.createShader(s[0]); gl.shaderSource(sh, s[1]); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(sh)); gl.attachShader(pr, sh); });
    gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) gl = null;
  }
  if (gl) {
    gl.useProgram(pr); gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var al = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
    'R P T Z D M G O Y L X C Q K N'.split(' ').forEach(function (k) { U[k] = gl.getUniformLocation(pr, k); });
  } else { // canvas2D fallback: one generated noise tile (golden-ratio hash), drawn in nested golden-spiral layers
    var c2 = document.createElement('canvas'); c2.id = 'field'; amb.replaceChild(c2, cv); cv = c2;   // a canvas that tried webgl cannot give a 2d context
    ctx2 = cv.getContext('2d'); var tc = document.createElement('canvas'); tc.width = tc.height = 55; var tx = tc.getContext('2d'), id = tx.createImageData(55, 55);   // 55 = fib(10)
    for (var i = 0; i < 3025; i++) { var x = i % 55, y = (i / 55) | 0, hv = (x * (PHI - 1) + y * pw(-2) + PHI) % 1; hv = (hv * (hv + 21 * PHI)) % 1; id.data[i * 4] = 248; id.data[i * 4 + 1] = 207; id.data[i * 4 + 2] = 219; id.data[i * 4 + 3] = hv * 255 * pw(-3); }
    tx.putImageData(id, 0, 0); tile = ctx2.createPattern(tc, 'repeat');
  }
  RB.fieldGL = !!gl;

  var W = 0, H = 0, sc = 0;
  function size() { sc = S.scale; W = cv.width = Math.ceil(innerWidth * sc); H = cv.height = Math.ceil(innerHeight * sc); }
  size(); addEventListener('resize', size, { passive: true });

  // ---- pivot: off-screen, drifting with the global state (psi, scroll, depth) ----
  function pivot() {
    var dg = Math.hypot(innerWidth, innerHeight), d = dg * pw(-S.D), sf = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    var al = S.psi + sf * GA - Math.PI / PHI; return { x: innerWidth / 2 + d * Math.cos(al), y: innerHeight / 2 + d * Math.sin(al), d: d, face: al + Math.PI };
  }
  RB.pivot = pivot;
  // ---- bodies (CPU) ----
  var NB = 21, bodies = [];
  for (var i = 0; i < NB; i++) bodies.push({ on: false, hard: i < 13, r: 0, th: 0, vr: 0, vt: 0, rad: 0, cue: 1, ty: 0, u: 0, rot: 0, ph: i * GA, n: i });
  var spawnN = 0;
  function choose(b) { // spawn choice: band amplitudes + thresholds + cue
    var E = S.E, k = 0; for (var j = 1; j < 5; j++) if (E[j] > E[k]) k = j;
    if (b.hard) { b.ty = 0; b.cue = 1; }
    else { b.ty = 1 + ((k + spawnN + (S.cold ? 2 : 0) + (S.hot ? 1 : 0)) % 4); b.cue = pw(-2 - (b.ty % 3)); }
    b.u = 0; spawnN++;
  }
  function place(b, P, fresh) { // fresh: spread over the view by the golden-angle sequence; else re-enter beyond the far edge
    var dg = Math.hypot(innerWidth, innerHeight), half = Math.asin(Math.min(1, dg / 2 / P.d)), fr = (b.n * pw(-1)) % 1;
    b.r = fresh ? P.d + dg / 2 * (1 - 2 * fr) : P.d + dg * pw(-1); b.th = fresh ? (2 * ((b.n * GA / TAU) % 1) - 1) * half : b.th;
    b.base = MIN() * pw(-5 + (b.hard ? 0 : 1)) * (1 + fr / PHI); b.on = true; choose(b);
  }
  function MIN() { return Math.min(innerWidth, innerHeight); }
  var P0 = pivot(); bodies.forEach(function (b) { place(b, P0, true); });
  var ptr = { r: 0 }, Q = new Float32Array(NB * 4), K = new Float32Array(NB * 4), Nn = new Float32Array(63);
  function physics(dt, P) {
    var capH = fib(7 - Math.round(S.D * 3) + S.gov), capS = fib(6 - Math.round(S.D * 2) + S.gov), h = 0, s = 0;
    var dg = Math.hypot(innerWidth, innerHeight), I = RB.input, live = performance.now() - I.lastT < 1000 * S.F * pw(4);
    var pr2 = MIN() * pw(-6), px = I.p[0], py = I.p[1];
    for (var i = 0; i < NB; i++) {
      var b = bodies[i]; b.on = b.hard ? h++ < capH : s++ < capS; if (!b.on) continue;
      var om = S.Omega * pw(-2) * Math.pow(P.d / Math.max(b.r, P.d * pw(-2)), 2);       // angular momentum: omega ~ 1/r^2
      var dr = -B * b.r * om;                                                            // golden-spiral inflow
      b.th += (om + b.vt / b.r) * dt; b.r += (dr + b.vr) * dt;
      var k = Math.exp(-dt * PHI / (S.T0 / PHI)); b.vr *= k; b.vt *= k;
      b.rot += (b.hard ? om : Math.sin(S.tau * S.w[b.ty % 5]) * pw(-2)) * dt; b.u *= Math.exp(-dt / (S.T0 * PHI));
      var half = Math.asin(Math.min(1, dg / 2 / P.d)) * PHI;
      if (b.th > half) { b.th -= 2 * half; choose(b); }                                  // wrap round the far side (off-screen)
      if (b.r < P.d - dg * pw(-1)) place(b, P, false);  // fell past the near edge into the vortex: the loop restarts beyond the far edge
      b.rad = b.base * b.r / P.d;
      b.x = P.x + b.r * Math.cos(P.face + Math.PI + b.th); b.y = P.y + b.r * Math.sin(P.face + Math.PI + b.th);
    }
    // collisions: restitution = cue, absorbed fraction (1 - cue) goes into the interior
    for (i = 0; i < NB; i++) { var a = bodies[i]; if (!a.on) continue;
      for (var j = i + 1; j < NB; j++) { var c = bodies[j]; if (!c.on) continue;
        var dx = c.x - a.x, dy = c.y - a.y, dd = Math.hypot(dx, dy) || 1, ov = a.rad + c.rad - dd; if (ov <= 0) continue;
        var e = Math.sqrt(a.cue * c.cue), rel = (a.vr - c.vr), j2 = (1 + e) * rel / 2;
        a.vr -= j2; c.vr += j2; a.vt -= ov * PHI; c.vt += ov * PHI; a.u += (1 - a.cue) * Math.abs(rel) / MIN(); c.u += (1 - c.cue) * Math.abs(rel) / MIN(); }
      // the visitor: bumps (momentum) and looks (dwell over a body)
      var qx = a.x - px, qy = a.y - py, qd = Math.hypot(qx, qy) || 1;
      if (qd < a.rad + pr2) {
        if (live) { var nx = qx / qd, ny = qy / qd, vn = I.pv[0] * nx + I.pv[1] * ny, sp = Math.hypot(I.pv[0], I.pv[1]);
          if (vn > 0 && !a.hit) { a.vr += a.cue * vn * pw(-1); a.vt += a.cue * (I.pv[0] * -ny + I.pv[1] * nx) * pw(-1); a.u += (1 - a.cue) * sp / MIN(); RB.kick(Math.min(sp * pw(-11), 1) * pw(-1), a.hard ? 4 : 0); }
          a.hit = true; } else { a.u += dt * pw(-2); a.hit = false; }
      } else a.hit = false;
    }
  }
  var acc = 0, lastSc = sc;
  RB.on(function (S, dt) {
    var P = pivot();
    if (!S.reduced || !RB.fieldDrawn) physics(S.reduced ? 0 : dt, P);
    acc += dt; if (acc < S.F * PHI) return; acc = 0;                                // 60/phi fps cap
    if (S.reduced && RB.fieldDrawn) return;                                          // reduced motion: one still frame
    if (S.scale !== lastSc) { lastSc = S.scale; size(); }
    var k = sc;
    for (var i = 0; i < NB; i++) { var b = bodies[i], o = i * 4; Q[o] = b.x * k; Q[o + 1] = H - b.y * k; Q[o + 2] = b.on ? b.rad * k : 0; Q[o + 3] = b.cue;
      K[o] = b.ty; K[o + 1] = Math.min(b.u, PHI); K[o + 2] = b.rot; K[o + 3] = b.ph; }
    var mind = RB.mind;
    if (gl) {
      gl.viewport(0, 0, W, H);
      gl.uniform2f(U.R, W, H); gl.uniform2f(U.P, P.x * k, H - P.y * k); gl.uniform1f(U.T, S.tau); gl.uniform1f(U.Z, S.tau / S.T0 * pw(-1) + S.D);
      gl.uniform1f(U.D, S.D); gl.uniform1f(U.M, mind ? mind.M : 0); gl.uniform1f(U.G, P.face); gl.uniform1f(U.O, S.oct); gl.uniform1f(U.Y, S.tau * S.w[0]);
      gl.uniform1f(U.L, S.B); gl.uniform1f(U.X, S.rung * S.imag); gl.uniform3f(U.C, S.rgb[0] / 255, S.rgb[1] / 255, S.rgb[2] / 255);
      gl.uniform4fv(U.Q, Q); gl.uniform4fv(U.K, K);
      if (mind) { for (i = 0; i < 21; i++) { Nn[i * 3] = mind.N[i * 3] * k; Nn[i * 3 + 1] = H - mind.N[i * 3 + 1] * k; Nn[i * 3 + 2] = mind.N[i * 3 + 2]; } gl.uniform3fv(U.N, Nn); }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      var c = ctx2, z = (S.tau / S.T0 * pw(-1)) % 1; c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#FFF8F4'; c.fillRect(0, 0, W, H); c.fillStyle = tile;
      for (var m = 0; m < 4; m++) { var s2 = pw(m - z); c.setTransform(s2, 0, 0, s2, P.x * k, P.y * k); c.rotate(S.theta * pw(-m) + m * GA); c.globalAlpha = pw(-m); c.fillRect(-W * PHI, -H * PHI, W * PHI * 2, H * PHI * 2); }
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
      for (i = 0; i < NB; i++) { b = bodies[i]; if (!b.on) continue; c.fillStyle = b.hard ? '#4C5E7A' : '#FCD9C0'; c.beginPath(); c.arc(b.x * k, b.y * k, b.rad * k, 0, TAU); c.fill(); }
    }
    RB.fieldDrawn = true;
  });
  RB.bodies = bodies;
})();
