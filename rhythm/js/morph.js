// Rebella rhythm tier 3: procedural high-cue forms. Each shortcut's silhouette is composed live from primitives
// (arcs, rects, ellipses, recursive branches) chosen and sized by the current band energies and depth, so no two
// cues need look alike and nothing is fixed to one theme. Carroll-ish (doorways, frames, keyholes, clocks, cards,
// rabbits, trees, figures) but original geometry; fractal (self-similar by 1/phi), never psychedelic (fixed palette).
const RB = window.RB, PHI = RB.PHI, pw = RB.pw, GA = 2 * Math.PI / (PHI * PHI);
const F = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89], f = v => v.toFixed(1);
const fib = (lo, hi, u) => F[Math.min(hi, lo + Math.round(u * (hi - lo)))];
const sat = e => Math.tanh(e);
const gen = {
  door(S) { let h = ''; const n = 1 + Math.round(S.D * 3); for (let i = 0; i < n; i++) { const s = Math.pow(1 / PHI, i), w = 26 * s, y = 46 - 60 * (1 - s) / PHI;
    h += `<path d="M${f(-w)} ${f(y)}V${f(y - 60 * s + w)}a${f(w)} ${f(w)} 0 0 1 ${f(2 * w)} 0V${f(y)}" fill="${i ? 'none' : '#fff'}" stroke="currentColor" stroke-width="${f(5 * s + 1)}"/>`; } return h; },
  frame(S) { let x = -46, y = -28.4, w = 92, h = 56.9, n = 3 + Math.round(sat(S.E[3]) * 4), o = `<rect x="${x}" y="${y}" width="${w}" height="${f(h)}" fill="#fff" stroke="currentColor" stroke-width="5"/>`;
    for (let i = 0; i < n; i++) { const d = i % 4, sw = f(2.6 / (1 + i / PHI)); // golden-rectangle subdivision (self-similar by 1/phi)
      if (d === 0) { o += `<path d="M${f(x + h)} ${f(y)}v${f(h)}" stroke="currentColor" stroke-width="${sw}"/>`; x += h; w -= h; }
      else if (d === 1) { o += `<path d="M${f(x)} ${f(y + w)}h${f(w)}" stroke="currentColor" stroke-width="${sw}"/>`; y += w; h -= w; }
      else if (d === 2) { o += `<path d="M${f(x + w - h)} ${f(y)}v${f(h)}" stroke="currentColor" stroke-width="${sw}"/>`; w -= h; }
      else { o += `<path d="M${f(x)} ${f(y + h - w)}h${f(w)}" stroke="currentColor" stroke-width="${sw}"/>`; h -= w; } }
    return o; },
  keyhole(S) { let h = ''; const n = 1 + S.awake.filter(Boolean).length; for (let i = 0; i < n; i++) h += `<circle r="${f(44 * Math.pow(1 / PHI, i / 2))}" fill="none" stroke="currentColor" stroke-width="${i ? 1.5 : 5}"/>`;
    return h + `<circle cy="-12" r="13" fill="currentColor"/><path d="M-8-4h16l${f(5 + sat(S.E[1]) * 4)} 34h${f(-26 - sat(S.E[1]) * 8)}z" fill="currentColor"/>`; },
  clock(S) { const n = fib(4, 6, S.D); let h = '<circle r="44" fill="#fff" stroke="currentColor" stroke-width="5"/>';
    for (let i = 0; i < n; i++) { const a = i / n * 2 * Math.PI; h += `<path d="M${f(36 * Math.sin(a))} ${f(-36 * Math.cos(a))}L${f(42 * Math.sin(a))} ${f(-42 * Math.cos(a))}" stroke="currentColor" stroke-width="3"/>`; }
    return h + '<path class="hh" d="M0 0V-21" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path class="mh" d="M0 0V-34" stroke="#B4436C" stroke-width="3" stroke-linecap="round"/>'; },
  card(S) { const n = fib(0, 4, sat(S.E[2])); let h = '<rect x="-30" y="-44" width="60" height="88" rx="7" fill="#fff" stroke="currentColor" stroke-width="5"/>';
    for (let i = 0; i < n; i++) { const r = 7 * Math.sqrt(i + 0.5), a = i * GA; h += `<path transform="translate(${f(r * Math.cos(a))} ${f(r * Math.sin(a) * PHI)})" d="M0-6l5 6-5 6-5-6z" fill="#B4436C"/>`; } return h; },
  spot(S) { const n = fib(1, 4, sat(S.E[4])); let h = '<circle r="30" fill="currentColor"/>'; for (let i = 1; i <= n; i++) h += `<circle r="${f(30 + 14 * i / n)}" fill="none" stroke="currentColor" stroke-width="1.5"/>`; return h; },
  tree(S) { let p = ''; const d = 4 + Math.round(S.D * 3), sp = GA / pw(3 - sat(S.E[0]) / PHI);
    (function br(x, y, a, l, k) { const x2 = x + l * Math.sin(a), y2 = y - l * Math.cos(a); p += `<path d="M${f(x)} ${f(y)}L${f(x2)} ${f(y2)}" stroke-width="${f(k * 1.2 + 0.5)}"${k < 2 ? ' stroke="#2E6B47"' : ''}/>`;
      if (k > 0) { br(x2, y2, a - sp, l / PHI, k - 1); br(x2, y2, a + sp / PHI, l / PHI, k - 1); } })(0, 46, 0, 32, d);
    return `<g stroke="#94461A" stroke-linecap="round" fill="none">${p}</g>`; },
  rabbit(S) { const e = 15 + sat(S.E[4]) * 9, b = 30 - S.D * 6; return `<ellipse cx="-4" cy="14" rx="${f(b)}" ry="${f(b / PHI + 3)}" fill="#fff" stroke="currentColor" stroke-width="4"/><circle cx="24" cy="-6" r="14" fill="#fff" stroke="currentColor" stroke-width="4"/>` +
    `<ellipse cx="22" cy="${f(-20 - e)}" rx="6" ry="${f(e)}" fill="#F8CFDB" stroke="currentColor" stroke-width="4" transform="rotate(${f(-8 - S.x[4] * 9)} 22 -20)"/><ellipse cx="32" cy="${f(-20 - e * 0.9)}" rx="5" ry="${f(e * 0.9)}" fill="#F8CFDB" stroke="currentColor" stroke-width="4" transform="rotate(${f(12 + S.x[3] * 9)} 32 -20)"/><circle cx="28" cy="-8" r="2.5" fill="currentColor"/>`; },
  figure(S) { const a = 20 + S.x[0] * 14; return `<circle cy="-30" r="13" fill="#FCD9C0" stroke="currentColor" stroke-width="4"/><path d="M0-16C-20-14-24 20-22 44h44C24 20 20-14 0-16z" fill="#F8CFDB" stroke="currentColor" stroke-width="4"/>` +
    `<path d="M-14-6l-24 ${f(a)}M14-6l24 ${f(a)}" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`; },
  jelly(S) { const n = fib(2, 4, sat(S.E[2])); let t = ''; for (let i = 0; i < n; i++) { const x = -28 + 56 * (i + 0.5) / n; t += `M${f(x)} 6q${f((i % 2 ? 6 : -6))} 18 ${f(i % 2 ? -2 : 2)} ${f(38 + 4 * Math.sin(i * GA))}`; }
    return `<g class="pulse"><path d="M-36 0a36 32 0 0 1 72 0z" fill="#F8CFDB" stroke="currentColor" stroke-width="4"/><path d="${t}" fill="none" stroke="currentColor" stroke-width="3"/></g>`; },
  diatom(S) { const n = fib(3, 6, sat(S.E[2])), ry = 40 / (PHI + S.D); let h = `<ellipse rx="40" ry="${f(ry)}" fill="#FCD9C0" stroke="currentColor" stroke-width="4"/>`;
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI; h += `<path d="M${f(-36 * Math.cos(a))} ${f(-ry * 0.9 * Math.sin(a))}L${f(36 * Math.cos(a))} ${f(ry * 0.9 * Math.sin(a))}" stroke="currentColor" stroke-width="1.5" opacity=".618"/>`; } return h; },
  seed(S) { const n = fib(7, 9, S.D); let h = '<path d="M0 4V46" stroke="#94461A" stroke-width="3"/><g fill="currentColor">';
    for (let i = 1; i <= n; i++) { const r = 30 * Math.sqrt(i / n), a = i * GA; h += `<circle cx="${f(r * Math.cos(a))}" cy="${f(-14 + r * Math.sin(a))}" r="${f(0.8 + 1.6 * i / n)}"/>`; } return h + '</g>'; }
};
RB.morph = (name, S) => gen[name] ? gen[name](S) : null;
