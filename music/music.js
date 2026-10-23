/* Rebella Music page: one track at a time, nothing autoplays, no tracking, no network calls beyond the audio file itself.
   Without JS each card keeps its native <audio controls>. With JS, a big play/pause button + seek slider replace it. */
(function () {
  'use strict';
  var cards = [].slice.call(document.querySelectorAll('.mu-card'));
  if (!cards.length) return;
  var status = document.querySelector('.mu-status');
  var current = null;
  function fmt(s) { if (!isFinite(s) || s < 0) s = 0; s = Math.floor(s); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function say(t) { if (status) status.textContent = t; }

  cards.forEach(function (card) {
    var audio = card.querySelector('audio');
    var btn = card.querySelector('.mu-play');
    var seek = card.querySelector('.mu-seek');
    var range = card.querySelector('.mu-range');
    var cur = card.querySelector('.mu-cur');
    var dur = card.querySelector('.mu-dur');
    var title = card.querySelector('.mu-title').textContent;
    var artist = card.querySelector('.mu-artist').textContent;
    if (!audio || !btn) return;
    audio.removeAttribute('controls');
    audio.autoplay = false;
    btn.hidden = false; seek.hidden = false;
    btn.setAttribute('aria-pressed', 'false');
    card.classList.add('mu-ready');
    var dragging = false;

    function setUI(playing) {
      btn.setAttribute('aria-pressed', String(playing));
      btn.setAttribute('aria-label', btn.getAttribute(playing ? 'data-label-pause' : 'data-label-play'));
      card.classList.toggle('is-playing', playing);
    }
    btn.addEventListener('click', function () {
      if (audio.paused) {
        if (current && current !== audio) current.pause();
        var p = audio.play();
        if (p && p.catch) p.catch(function () { setUI(false); say('That track could not play. Try again in a moment.'); });
      } else { audio.pause(); }
    });
    audio.addEventListener('play', function () {
      if (current && current !== audio) current.pause();
      current = audio; setUI(true); range.disabled = false;
      say('Playing ' + title + ' by ' + artist);
      try {
        if ('mediaSession' in navigator && window.MediaMetadata) {
          navigator.mediaSession.metadata = new MediaMetadata({ title: title, artist: artist, album: 'Rebella Music' });
          navigator.mediaSession.setActionHandler('play', function () { audio.play(); });
          navigator.mediaSession.setActionHandler('pause', function () { audio.pause(); });
        }
      } catch (e) { /* optional */ }
    });
    audio.addEventListener('pause', function () { setUI(false); say('Paused ' + title); });
    audio.addEventListener('ended', function () { setUI(false); range.value = 0; cur.textContent = '0:00'; say(title + ' finished'); });
    audio.addEventListener('loadedmetadata', function () { if (isFinite(audio.duration)) dur.textContent = fmt(audio.duration); });
    audio.addEventListener('timeupdate', function () {
      if (dragging || !isFinite(audio.duration) || !audio.duration) return;
      range.value = Math.round(1000 * audio.currentTime / audio.duration);
      cur.textContent = fmt(audio.currentTime);
      range.setAttribute('aria-valuetext', fmt(audio.currentTime) + ' of ' + fmt(audio.duration));
    });
    range.addEventListener('input', function () {
      dragging = true;
      if (isFinite(audio.duration)) cur.textContent = fmt(range.value / 1000 * audio.duration);
    });
    range.addEventListener('change', function () {
      dragging = false;
      if (isFinite(audio.duration)) audio.currentTime = range.value / 1000 * audio.duration;
    });
  });
})();
