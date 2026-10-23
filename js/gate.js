/* Rebella site-wide passcode gate. Loaded in <head> before the body so locked content never flashes.
   Passcode check: PBKDF2-HMAC-SHA256 via Web Crypto against the salted hash in js/config.js (no plaintext anywhere).
   Unlock lasts for this browser tab session (sessionStorage). NOTE: a client-side gate on a static host hides the
   pages from casual visitors; it is not real access control (the HTML is still downloadable). */
(function () {
  var CFG = window.REBELLA_GATE || { unset: true };
  var KEY = 'rebella-site-session';
  var root = document.documentElement;
  function unlocked() { try { return !CFG.unset && !!CFG.hash && sessionStorage.getItem(KEY) === CFG.hash; } catch (e) { return false; } }
  if (unlocked()) root.classList.add('unlocked');

  function hex(buf) { return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join(''); }
  function fromHex(h) { var a = new Uint8Array(h.length / 2); for (var i = 0; i < a.length; i++) a[i] = parseInt(h.substr(i * 2, 2), 16); return a; }
  function safeEq(a, b) { if (a.length !== b.length) return false; var r = 0; for (var i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
  async function derive(code) {
    var k = await crypto.subtle.importKey('raw', new TextEncoder().encode(code), 'PBKDF2', false, ['deriveBits']);
    return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(CFG.salt), iterations: CFG.iterations }, k, 256));
  }

  function apply() {
    var ok = unlocked(), site = document.getElementById('site'), gate = document.getElementById('gate');
    root.classList.toggle('unlocked', ok);
    if (site) site.hidden = !ok;
    if (gate) gate.hidden = ok;
    if (!ok) { var p = document.getElementById('passcode'); if (p) p.focus(); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    apply();
    var form = document.getElementById('gate-form'), fails = 0;
    if (form) form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var msg = document.getElementById('gate-msg'), input = document.getElementById('passcode'), btn = form.querySelector('button');
      msg.classList.remove('warn');
      if (CFG.unset) { msg.classList.add('warn'); msg.textContent = 'Rebella isn\u2019t open yet. Check back soon!'; return; }
      if (!window.crypto || !crypto.subtle) { msg.textContent = 'This page needs a secure (https) connection to unlock.'; return; }
      btn.disabled = true; msg.textContent = 'Checking\u2026';
      try {
        if (safeEq(await derive(input.value), CFG.hash)) {
          sessionStorage.setItem(KEY, CFG.hash); input.value = ''; msg.textContent = ''; fails = 0; apply(); window.scrollTo(0, 0);
        } else {
          fails++; input.value = ''; msg.textContent = 'That passcode didn\u2019t work.';
          await new Promise(function (r) { setTimeout(r, Math.min(4000, 400 * fails)); });
        }
      } finally { btn.disabled = false; if (!unlocked()) input.focus(); }
    });
    // Lock: forget the unlock and go to the home page (replacing this page in history).
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-lock]');
      if (!b) return;
      e.preventDefault();
      try { sessionStorage.removeItem(KEY); } catch (err) {}
      window.location.replace(new URL('index.html', document.baseURI).href);
    });
  });
})();
