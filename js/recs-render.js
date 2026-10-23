/* Renders js/recs.js into recommendations.html. You shouldn't need to edit this file. */
(function () {
  var R = window.REBELLA_RECS || {};
  function has(v) { return typeof v === 'string' && v.trim() !== ''; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function safeLink(url, text) {
    if (!has(url) || !/^https:\/\//i.test(url.trim())) return null;
    var a = el('a', 'rec-link', text); a.href = url.trim(); a.rel = 'noopener nofollow noreferrer'; a.target = '_blank'; return a;
  }
  function why(body, text, label, soon) {
    if (!has(text)) {
      if (!soon) return;
      var ph = el('p', 'placeholder why'); ph.appendChild(el('span', 'ph-chip', 'Placeholder')); ph.appendChild(document.createTextNode((label || 'Why I chose this') + ': coming soon.')); body.appendChild(ph); return;
    }
    var p = el('p', 'why'); p.appendChild(el('strong', null, (label || 'Why I chose this') + ': ')); p.appendChild(document.createTextNode(text)); body.appendChild(p);
  }
  function fill(key, build) {
    var sec = document.querySelector('[data-rec="' + key + '"] .rec-body') || (key === 'about' && document.querySelector('#about-me .rec-body'));
    if (!sec) return;
    var frag = document.createDocumentFragment();
    if (build(frag)) { sec.innerHTML = ''; sec.appendChild(frag); }
  }
  fill('song', function (b) {
    var s = R.song || {}; if (!has(s.title)) return false;
    b.appendChild(el('p', 'rec-title', s.title));
    if (has(s.artist)) b.appendChild(el('p', 'rec-sub', 'by ' + s.artist));
    why(b, s.why);
    var a = safeLink(s.link, 'Listen (opens another site)'); if (a) b.appendChild(a);
    return true;
  });
  fill('celebrity', function (b) {
    var c = R.celebrity || {}; if (!has(c.name)) return false;
    b.appendChild(el('p', 'rec-title', c.name));
    if (has(c.who)) b.appendChild(el('p', 'rec-sub', c.who));
    if (has(c.deed)) { var d = el('p'); d.appendChild(el('strong', null, 'Kind deed: ')); d.appendChild(document.createTextNode(c.deed)); b.appendChild(d); }
    why(b, c.why, 'Why she\u2019s rightfully famous', true);
    var a = safeLink(c.source, 'Read more about her'); if (a) b.appendChild(a);
    return true;
  });
  fill('quote', function (b) {
    var q = R.quote || {}; if (!has(q.text)) return false;
    var bq = el('blockquote', 'rec-quote', '\u201C' + q.text + '\u201D'); b.appendChild(bq);
    b.appendChild(el('p', 'rec-sub', '\u2014 ' + (has(q.by) ? q.by : 'Author unknown')));
    why(b, q.why);
    return true;
  });
  fill('goal', function (b) {
    var g = R.goal || {}; if (!has(g.goal)) return false;
    b.appendChild(el('p', 'rec-title', g.goal));
    why(b, g.why);
    return true;
  });
  fill('other', function (b) {
    var list = (R.other || []).filter(function (o) { return o && has(o.title); }); if (!list.length) return false;
    var ul = el('ul', 'rec-list');
    list.forEach(function (o) {
      var li = el('li');
      if (has(o.type)) li.appendChild(el('span', 'rec-type', o.type));
      li.appendChild(el('span', 'rec-title', o.title));
      why(li, o.why);
      var a = safeLink(o.link, 'Find out more'); if (a) li.appendChild(a);
      ul.appendChild(li);
    });
    b.appendChild(ul); return true;
  });
  fill('about', function (b) {
    var a = R.about || {}; var ints = (a.interests || []).filter(has);
    if (!ints.length && !has(a.note)) return false;
    if (has(a.note)) a.note.split('\n').forEach(function (line) { if (line.trim()) b.appendChild(el('p', null, line)); });
    if (ints.length) { var ul = el('ul', 'interest-chips'); ints.forEach(function (i) { ul.appendChild(el('li', null, i)); }); b.appendChild(ul); }
    return true;
  });
  var up = document.getElementById('recs-updated');
  if (up) up.textContent = has(R.updated) ? R.updated : 'Coming soon: the first picks are on their way.';
})();
