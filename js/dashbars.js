/* Rebella header items (live 24 Oct 2026, Danny): the public, STATIC items from Bonnie's Dashboard header,
   personalised on this device only. Markup comes from _bars.py (div.hd-items inside the masthead).
   - Emoji set: one still state picked from the Perth weather mood + the time of day (same emoji sets as the
     dashboard header). It only changes when that state changes. No cycling, no animation, no motion.
   - Greeting chip: time of day from the device + the on-device nickname (window.RebellaVisitor, js/bars.js).
     Text updates in place once a minute.
   - Perth weather chip: icon, temperature, label; a link to the Bureau of Meteorology Perth forecast (new tab).
     It makes NO request of its own: it uses the footer's Perth forecast (js/footbar.js dispatches 'rebella:weather'
     and caches it in localStorage 'rebella.footer.weather' for 30 minutes).
   The header stays mounted across in-page navigation (js/nav.js), so this runs once per visit.
   Nothing is sent anywhere. No cookies. No location. */
(function () {
  'use strict';
  var head = document.getElementById('app-head');
  if (!head || head.getAttribute('data-audience') !== 'visitor' || head.getAttribute('data-hd-ready')) return;
  var box = head.querySelector('.hd-items'); if (!box) return;
  head.setAttribute('data-hd-ready', '1');
  var emo = box.querySelector('.hd-emoji'), hello = box.querySelector('.db-hello'), wx = box.querySelector('.db-wx');
  // same sets as moderation/js/hud.js (icon, label, faces x3, gifts)
  var SETS = {
    sun:   ['\u2600\uFE0F', 'Sunny', ['\uD83D\uDE04', '\uD83E\uDD29', '\uD83D\uDE0E'], ['\uD83D\uDD76\uFE0F', '\uD83C\uDF66']],
    hot:   ['\uD83C\uDF1E', 'Hot', ['\uD83D\uDE04', '\uD83E\uDD29', '\uD83D\uDE0E'], ['\uD83C\uDFD6\uFE0F', '\uD83C\uDF66']],
    cloud: ['\u26C5', 'Cloudy', ['\uD83D\uDE10', '\uD83E\uDDD0', '\uD83D\uDE34'], ['\uD83C\uDFA7', '\uD83E\uDDE6']],
    fog:   ['\uD83C\uDF2B\uFE0F', 'Foggy', ['\uD83D\uDE0C', '\uD83E\uDD14', '\uD83D\uDE34'], ['\uD83E\uDDE3', '\uD83D\uDD26']],
    rain:  ['\uD83C\uDF27\uFE0F', 'Rain', ['\uD83E\uDD7A', '\uD83E\uDD14', '\uD83E\uDD79'], ['\u2602\uFE0F', '\u2615']],
    storm: ['\u26C8\uFE0F', 'Storm', ['\uD83E\uDD17', '\uD83E\uDEE3', '\uD83D\uDE2E'], ['\uD83E\uDEC2', '\uD83C\uDF6B']],
    night: ['\uD83C\uDF19', 'Clear night', ['\uD83D\uDE0C', '\uD83E\uDD70', '\uD83E\uDD29'], ['\u2728', '\uD83E\uDD89']]
  };
  function mood(code, isDay, temp) { code = Number(code); if (code >= 95) return 'storm'; if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
    if (code === 45 || code === 48) return 'fog'; if (code <= 1) return isDay === 0 ? 'night' : (temp >= 30 ? 'hot' : 'sun'); return 'cloud'; }
  var wxKey = null, wxTemp = null, emoState = '';
  function name() { try { var r = window.RebellaVisitor && window.RebellaVisitor.load(); return r && r.name ? r.name : ''; } catch (e) { return ''; } }
  function slot(h) { return h < 12 ? 0 : h < 18 ? 1 : 2; }   // morning / afternoon / evening+night face
  function paintEmoji() {
    if (!emo || !wxKey) return;
    var s = SETS[wxKey], f = slot(new Date().getHours()), state = wxKey + ':' + f;
    if (state === emoState) return;   // swap only when the weather or time-of-day state changes
    emoState = state; emo.textContent = '';
    [s[2][f], s[3][0], s[3][1], s[0]].forEach(function (ch, i) { var e = document.createElement('span'); e.className = i === 0 ? 'f' : i === 3 ? 'w' : 'g' + i; e.textContent = ch; emo.appendChild(e); });
    emo.hidden = false;
  }
  function paint() {
    var d = new Date(), h = d.getHours(), n = name();
    var w = h < 5 ? 'Up late' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 21 ? 'Good evening' : 'Good night';
    var t = d.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' });
    if (hello) { hello.textContent = w + (n ? ', ' + n : '') + ' \u00B7 ' + t; hello.hidden = false; }
    paintEmoji();
  }
  function paintWx(key, temp) {
    var s = SETS[key]; if (!s || !wx) return;
    if (key === wxKey && temp === wxTemp && !wx.hidden) return;
    wxKey = key; wxTemp = temp;
    wx.innerHTML = '<span aria-hidden="true">' + s[0] + '</span><span class="db-wx-p">Perth</span> ' + temp + '\u00B0<span class="db-wx-l"> ' + s[1] + '</span><span class="db-wx-go" aria-hidden="true"> \u2197</span>';
    wx.setAttribute('aria-label', 'Perth weather: ' + s[1] + ', ' + temp + ' degrees. Opens the Bureau of Meteorology Perth forecast in a new tab');
    wx.hidden = false;
    paintEmoji();
  }
  document.addEventListener('rebella:weather', function (e) { if (e.detail) paintWx(e.detail.key, e.detail.temp); });
  try { var c = JSON.parse(localStorage.getItem('rebella.footer.weather')); if (c && c.u > 0 && Date.now() - c.t < c.u * 1000) paintWx(mood(c.code, c.isDay, c.temp), Math.round(c.temp)); } catch (e) {} // unit: ms per second; u = the feed's own update period (stored by footbar.js)
  paint();
  setTimeout(function () { paint(); setInterval(paint, 60000); }, (60 - new Date().getSeconds()) * 1000);
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('#vn-save,#vn-forget')) setTimeout(paint, 50); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target && e.target.id === 'vn-in') setTimeout(paint, 50); });
  window.addEventListener('storage', function () { paint(); });
})();
