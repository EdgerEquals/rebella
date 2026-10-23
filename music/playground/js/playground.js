/* Rebella Music Playground. Everything is generated live with Tone.js (self-hosted, vendor/tone, loaded only after the
   first tap and only if the browser has an AudioContext). No microphone, no audio files, nothing sent or stored remotely.
   Phi timing (PHI^n s): UI transitions 0.382 s; Dad's ladder (rule 10) sets crossfade = PHI^(3.5+s) clamped 2.06-22.83 s,
   BPM = 60/PHI^(-1+s/2) clamped 62-157, volume = 0.55*PHI^(-s/4) clamped 0.25-0.8 (serious/urgent duck to 0.3).
   Synth envelopes use PHI^n times. Auto-drift every PHI^5.5 = 14.1 s x PHI^s, applied at the next bar. */
window.PG_HELP = {"orb": {"title": "The help orb", "what": "Drag me onto anything in the Playground and I'll tell you what it does, up here and down in the footer.", "try": "Drop me on the big dial first."}, "start": {"title": "Wake the sound", "what": "Browsers keep quiet until you tap something. This wakes the Playground's sound.", "try": "Tap it, then tap Hear it on any instrument."}, "mute": {"title": "Mute everything", "what": "Silences the Playground and the radio. It remembers your choice next time.", "try": "Flick it on when someone needs quiet."}, "dial": {"title": "The genre dial", "what": "Turn it like an old radio. Between stations you hear static, and each click is a station.", "try": "Turn it slowly and stop where it feels right."}, "player": {"title": "The radio player", "what": "Music from YouTube plays here, but only channels Dad has said yes to.", "try": "Turn the dial to see which stations have music yet."}, "reading": {"title": "Reading music", "what": "Quiet music for when you've got a book open. It plays in the radio player.", "try": "Pick a book, tap this, and see how it feels."}, "follow": {"title": "Follow the radio", "what": "Your band picks up the station's tempo and key, so it plays along. It goes by labels, not by listening.", "try": "Turn the dial with your band playing."}, "tap-tempo": {"title": "Tap tempo", "what": "Tap along to a beat and the band speeds up or slows down to match you.", "try": "Tap four times to your heartbeat."}, "line-up": {"title": "Line up", "what": "Tap right on a beat you hear and the band starts its bar right there.", "try": "Wait for a big beat on the radio, then tap."}, "nudge": {"title": "Nudge", "what": "Shifts your band a whole beat, or a tiny 10 milliseconds, earlier or later.", "try": "Use the tiny nudges until it sounds glued together."}, "latency": {"title": "Latency", "what": "Bluetooth speakers and headphones can run a little late. This slides your band to make up for it.", "try": "Slide it until claps on screen and in your ears match."}, "flavour": {"title": "Sound flavour", "what": "Changes the patterns your band plays: Lo-fi, Chiptune, Ambient, Pop or Nature.", "try": "Leave the band the same and just change the flavour."}, "presets": {"title": "Band moods", "what": "Ready-made bands named after a feeling. Each one swaps in a few instruments.", "try": "Pick the one that matches your day."}, "play": {"title": "Play", "what": "Starts and stops your band.", "try": "Press play, then take instruments in and out."}, "swing": {"title": "Swing", "what": "Makes the beat bounce instead of marching. More swing, more bounce.", "try": "Slide it slowly while the drums play."}, "humanise": {"title": "Loose", "what": "Lets the notes land a little early or late and play a little softer or louder, like real people playing.", "try": "Turn it right up, then right down, and listen for the difference."}, "ensemble": {"title": "Your band", "what": "Up to four instruments on a phone, or six on a bigger screen. Each one has a part to play.", "try": "Give two instruments the same part and see what happens."}, "slot": {"title": "Band member", "what": "Choose its part (bass, chords, melody or rhythm), mute it, solo it or change how loud it is in the mix.", "try": "Solo each one to hear what it's doing on its own."}, "fx-filter": {"title": "Filter sweep", "what": "Slowly opens and closes the sound, like a door to a room with music in it.", "try": "Use it on a pad and close your eyes."}, "fx-delay": {"title": "Tape-style echo", "what": "Repeats notes a bit later, fading each time, like an old tape echo.", "try": "Try it on the pluck."}, "fx-chorus": {"title": "Chorus", "what": "Makes one instrument sound like a few playing together.", "try": "Switch it on with the electric piano."}, "fx-phaser": {"title": "Phaser", "what": "A slow, swirly whoosh moving through the sound.", "try": "Turn it on and listen to the hats."}, "fx-crush": {"title": "Bitcrush", "what": "Makes the sound crunchy and old-video-game-ish.", "try": "Pair it with Chiptune."}, "bend": {"title": "Bend time", "what": "Slows the band down and drops the pitch for a moment, then lets it spring back.", "try": "Press it right before the drums come back in."}, "soon": {"title": "Coming soon", "what": "A looper, sample pads, stutter and chop, all made from the Playground's own sound.", "try": "Keep playing with the effects for now."}, "pump-time": {"title": "Time of day", "what": "Later in the day, Dad's music gets slower, softer and fades more gently.", "try": "Slide it to Deep night and watch the readout."}, "pump-weather": {"title": "Weather", "what": "Hot and sunny days speed things up, fog and rain slow them down.", "try": "Try Foggy, then Hot."}, "pump-urgency": {"title": "Hurry", "what": "When something needs attention, the music quickens and goes quieter.", "try": "Slide it to Urgent and see the volume drop."}, "pump-mood": {"title": "Mood", "what": "Each mood nudges the pace and picks a kind of music for Dad.", "try": "Find the mood you're in right now."}, "ladder-readout": {"title": "The readout", "what": "Shows the steps added up (s), the beats per minute, how long the fade is, the volume and the kind of music.", "try": "Move one slider at a time and watch which number changes."}, "crossfade": {"title": "Drift to the next part", "what": "Slowly fades your band into a slightly different part, over the fade time shown in the readout.", "try": "Press it with the band playing and listen to the melody lift."}, "auto-dj": {"title": "Let it drift", "what": "Keeps drifting between parts on its own, at the ladder's pace.", "try": "Switch it on and just listen for a while."}, "inst-acid": {"title": "Acid bass", "what": "A squelchy, rubbery bass that bubbles along. Tap Hear it to listen, Add to put it in your band.", "try": "Turn on the filter sweep with it."}, "inst-sub": {"title": "Sub bass", "what": "A deep, round bass you feel more than hear. Tap Hear it to listen, Add to put it in your band.", "try": "Try it on headphones."}, "inst-ep": {"title": "Electric piano", "what": "Soft, bell-like piano chords. Tap Hear it to listen, Add to put it in your band.", "try": "Pair it with Sunday morning."}, "inst-pad": {"title": "Warm pad", "what": "A slow, cosy cloud of sound that fades in gently. Tap Hear it to listen, Add to put it in your band.", "try": "Let it hold under everything else."}, "inst-lead": {"title": "Lead", "what": "A bright, buzzy synth for melodies. Tap Hear it to listen, Add to put it in your band.", "try": "Give it the melody part."}, "inst-pluck": {"title": "Pluck", "what": "Like a string being picked. Tap Hear it to listen, Add to put it in your band.", "try": "Add the tape-style echo."}, "inst-bells": {"title": "Bells", "what": "Shiny, ringing metal tones. Tap Hear it to listen, Add to put it in your band.", "try": "Try them with Soft rain."}, "inst-strings": {"title": "Strings", "what": "A swell of string-like sound that rises slowly. Tap Hear it to listen, Add to put it in your band.", "try": "Give it the chords part."}, "inst-kit": {"title": "Drum kit (808-style)", "what": "Kick, snare, clap and hi-hats in one. Tap Hear it to listen, Add to put it in your band.", "try": "Make it the rhythm, then add swing."}, "inst-shaker": {"title": "Shaker", "what": "A soft shaker that fills the gaps. Tap Hear it to listen, Add to put it in your band.", "try": "Add it to Barefoot."}};  // inline fallback copy of data/help.json
(function () {
  'use strict';
  var PHI = 1.6180339887, GA = 0.6180339887;
  function $(id) { return document.getElementById(id); }
  function el(t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  var reduce = false; try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var HAS_AUDIO = !!(window.AudioContext || window.webkitAudioContext);
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/js\/playground\.js.*$/, '') : '';

  // ---------- key + scale helper (tiny inline table; Tonal.js not needed) ----------
  var NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  var MODES = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10], mixolydian: [0, 2, 4, 5, 7, 9, 10] };
  var FN = { I: 1, ii: 2, iii: 3, IV: 4, V: 5, vi: 6, i: 1, iv: 4, v: 5, VI: 6, VII: 7, III: 3 };
  var key = { root: 'F', mode: 'dorian' }, pendingKey = null;
  function deg(d, oct) { var sc = MODES[key.mode] || MODES.major, n = sc.length, i = d - 1, o = Math.floor(i / n); i = ((i % n) + n) % n; return 12 * (oct + 1 + o) + NOTES.indexOf(key.root) + sc[i]; }
  function chord(fn, oct, sev) { var r = FN[fn] || 1, c = [deg(r, oct), deg(r + 2, oct), deg(r + 4, oct)]; if (sev) c.push(deg(r + 6, oct)); return c; }
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  // ---------- pattern library (scale degrees + chord functions, so everything follows the key) ----------
  // bass: step -> degree offset from the chord root (1 root, 5 fifth, 8 octave); melody: step -> scale degree;
  // chords: steps where the chord sounds; rhythm: step -> drum letters (k kick, s snare, c clap, h hat).
  function rep(str) { var o = {}; str.split(' ').forEach(function (t, i) { if (t !== '.') o[i] = t; }); return o; }
  var LIB = {
    lofi:     { prog: ['ii', 'V', 'I', 'vi'], sev: true,  chords: [0, 7],         bass: rep('1 . . . . . 5 . 1 . . . . . 3 .'), melody: rep('. . 5 . 6 . . 5 . . 3 . 2 . . .'), rhythm: rep('kh . h . sh . h k kh . kh . sh . h .') },
    chiptune: { prog: ['I', 'V', 'vi', 'IV'], sev: false, chords: [0, 4, 8, 12], bass: rep('1 . 8 . 1 . 8 . 1 . 8 . 5 . 8 .'), melody: rep('8 . 10 . 12 . 10 8 . 5 . 8 . 10 . 12'), rhythm: rep('kh . h . sh . h . kh . kh . sh . h h') },
    ambient:  { prog: ['I', 'IV', 'vi', 'IV'], sev: true, chords: [0],            bass: rep('1 . . . . . . . . . . . . . . .'), melody: rep('. . . . 5 . . . . . . . 9 . . .'), rhythm: rep('. . . . . . . . h . . . . . . .') },
    pop:      { prog: ['I', 'V', 'vi', 'IV'], sev: false, chords: [0, 3, 6, 10],  bass: rep('1 . . 1 . . 5 . 1 . . 1 . 5 . .'), melody: rep('5 . 6 . 8 . 6 . 5 . 3 . 5 . . .'), rhythm: rep('kh . h . sch . h . kh . kh . sch . h .') },
    nature:   { prog: ['I', 'IV', 'I', 'V'],  sev: false, chords: [0, 8],         bass: rep('1 . . . . . . . 5 . . . . . . .'), melody: rep('3 . 5 . . . 6 . 5 . . . 3 . 2 .'), rhythm: rep('h . . h . . h . h . . h . . h .') }
  };
  // section B (for crossfades): same harmony, melody up a third, busier hats
  function variantB(lib) {
    var m = {}; Object.keys(lib.melody).forEach(function (k) { m[k] = String(+lib.melody[k] + 2); });
    var r = {}; for (var i = 0; i < 16; i++) r[i] = (lib.rhythm[i] || '') + (i % 2 ? '' : 'h');
    return { prog: lib.prog, sev: lib.sev, chords: lib.chords, bass: lib.bass, melody: m, rhythm: r };
  }

  // ---------- instruments (all generated) ----------
  var INST = [
    { id: 'acid',    name: 'Acid bass',     icon: '\u{1F7E2}', role: 'bass',   vol: -10 },
    { id: 'sub',     name: 'Sub bass',      icon: '\u{1F30A}', role: 'bass',   vol: -6 },
    { id: 'ep',      name: 'Electric piano',icon: '\u{1F3B9}', role: 'chords', vol: -10 },
    { id: 'pad',     name: 'Warm pad',      icon: '\u2601\uFE0F', role: 'chords', vol: -16 },
    { id: 'lead',    name: 'Lead',          icon: '\u2728',    role: 'melody', vol: -16 },
    { id: 'pluck',   name: 'Pluck',         icon: '\u{1FAB6}', role: 'melody', vol: -8 },
    { id: 'bells',   name: 'Bells',         icon: '\u{1F514}', role: 'melody', vol: -16 },
    { id: 'strings', name: 'Strings',       icon: '\u{1F3BB}', role: 'chords', vol: -18 },
    { id: 'kit',     name: 'Drum kit (808-style)', icon: '\u{1F941}', role: 'rhythm', vol: -8 },
    { id: 'shaker',  name: 'Shaker',        icon: '\u{1FAD8}', role: 'rhythm', vol: -18 }
  ];
  var IBY = {}; INST.forEach(function (i) { IBY[i.id] = i; });
  function make(id, out) {
    var T = window.Tone, v;
    function wrap(s) { if ('maxPolyphony' in s) s.maxPolyphony = 32; s.connect(out); return s; }
    switch (id) {
      case 'acid': v = wrap(new T.MonoSynth({ oscillator: { type: 'sawtooth' }, filter: { Q: 6, type: 'lowpass' }, envelope: { attack: 0.005, decay: 0.236, sustain: 0.2, release: 0.146 }, filterEnvelope: { attack: 0.005, decay: 0.236, sustain: 0.1, baseFrequency: 180, octaves: 3.6 } }));
        return function (n, d, t, vel) { v.triggerAttackRelease(hz(n[0] - 12), d, t, vel); };
      case 'sub': v = wrap(new T.MonoSynth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.382, sustain: 0.618, release: 0.382 }, filterEnvelope: { baseFrequency: 300, octaves: 0 } }));
        return function (n, d, t, vel) { v.triggerAttackRelease(hz(n[0] - 12), d, t, vel); };
      case 'ep': v = wrap(new T.PolySynth(T.FMSynth, { harmonicity: 3, modulationIndex: 6, envelope: { attack: 0.01, decay: 1.618, sustain: 0.146, release: 1 }, modulationEnvelope: { attack: 0.01, decay: 0.618, sustain: 0, release: 0.382 } }));
        return function (n, d, t, vel) { v.triggerAttackRelease(n.map(hz), d, t, vel); };
      case 'pad': v = wrap(new T.PolySynth(T.AMSynth, { envelope: { attack: 1.618, decay: 0.618, sustain: 0.8, release: 2.618 } }));
        return function (n, d, t, vel) { v.triggerAttackRelease(n.map(hz), d, t, vel); };
      case 'lead': v = wrap(new T.MonoSynth({ oscillator: { type: 'fatsawtooth', count: 3, spread: 30 }, envelope: { attack: 0.02, decay: 0.236, sustain: 0.5, release: 0.382 }, filterEnvelope: { baseFrequency: 900, octaves: 2 } }));
        return function (n, d, t, vel) { v.triggerAttackRelease(hz(n[n.length - 1] + 12), d, t, vel); };
      case 'pluck': v = wrap(new T.PluckSynth({ attackNoise: 1, dampening: 3800, resonance: 0.9 }));
        return function (n, d, t) { v.triggerAttack(hz(n[n.length - 1]), t); };
      case 'bells': v = wrap(new T.PolySynth(T.FMSynth, { harmonicity: 5.07, modulationIndex: 14, oscillator: { type: 'sine' }, envelope: { attack: 0.002, decay: 2.618, sustain: 0, release: 1.618 }, modulation: { type: 'square' }, modulationEnvelope: { attack: 0.002, decay: 0.382, sustain: 0, release: 0.236 } }));
        return function (n, d, t, vel) { v.triggerAttackRelease(hz(n[n.length - 1] + 12), d, t, vel * 0.7); };
      case 'strings': var f = new T.Filter(2200, 'lowpass').connect(out);
        v = new T.PolySynth(T.Synth, { oscillator: { type: 'fatsawtooth', count: 3, spread: 22 }, envelope: { attack: 1, decay: 0.618, sustain: 0.8, release: 1.618 } }).connect(f); v.maxPolyphony = 32;
        return function (n, d, t, vel) { v.triggerAttackRelease(n.map(hz), d, t, vel); };
      case 'kit':
        var kick = wrap(new T.MembraneSynth({ pitchDecay: 0.05, octaves: 6, envelope: { attack: 0.001, decay: 0.382, sustain: 0 } }));
        var snare = wrap(new T.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.146, sustain: 0 } }));
        var cf = new T.Filter(1600, 'bandpass').connect(out), clap = new T.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 0.001, decay: 0.09, sustain: 0 } }).connect(cf);
        var hat = wrap(new T.MetalSynth({ envelope: { attack: 0.001, decay: 0.056, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 })); hat.volume.value = -14;
        return function (n, d, t, vel, drums) { drums = drums || 'k';
          if (drums.indexOf('k') > -1) kick.triggerAttackRelease('C1', '8n', t, vel);
          if (drums.indexOf('s') > -1) snare.triggerAttackRelease('16n', t, vel * 0.6);
          if (drums.indexOf('c') > -1) clap.triggerAttackRelease('16n', t, vel * 0.7);
          if (drums.indexOf('h') > -1) hat.triggerAttackRelease(hz(84), '32n', t, vel * 0.5); };
      case 'shaker': var hf = new T.Filter(6000, 'highpass').connect(out);
        v = new T.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.004, decay: 0.056, sustain: 0 } }).connect(hf);
        return function (n, d, t, vel, drums) { if (!drums || /h|s|c/.test(drums)) v.triggerAttackRelease('32n', t, vel * 0.6); };
    }
  }

  // ---------- mood presets (by feeling) ----------
  var PRESETS = [
    { name: 'Sunday morning', flavour: 'lofi',     slots: ['ep', 'sub', 'kit', 'pad'], soft: true },
    { name: 'Brave',          flavour: 'chiptune', slots: ['lead', 'pluck', 'sub', 'kit'] },
    { name: 'Soft rain',      flavour: 'ambient',  slots: ['pad', 'bells', 'strings', 'sub'] },
    { name: 'Sunshine',       flavour: 'pop',      slots: ['pluck', 'lead', 'acid', 'kit', 'shaker'] },
    { name: 'Barefoot',       flavour: 'nature',   slots: ['pad', 'pluck', 'shaker', 'bells'] }
  ];
  function maxSlots() { return window.innerWidth < 600 ? 4 : 6; }

  // ---------- state ----------
  var SKEY = 'rebella.playground.v1';
  var saved = store(SKEY) || {};
  var state = { flavour: saved.flavour || 'lofi', slots: Array.isArray(saved.slots) ? saved.slots : PRESETS[0].slots.map(function (id) { return { inst: id, role: IBY[id].role, mute: false, solo: false, vol: IBY[id].vol + (id === 'kit' ? -4 : 0) }; }) };
  state.slots = state.slots.filter(function (s) { return s && IBY[s.inst]; }).slice(0, 6);
  function save() { store(SKEY, { flavour: state.flavour, slots: state.slots }); }

  // ---------- audio engine ----------
  var T = null, ready = false, starting = null, nodes = {}, voices = {}, parts = [], bpm = 76, xf = { from: 0, to: 0, t0: 0, len: 0 }, section = 0;
  function loadTone() {
    if (!HAS_AUDIO) return Promise.reject(new Error('no audio'));
    if (window.Tone) return Promise.resolve(window.Tone);
    return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = BASE + 'vendor/tone/Tone.js'; s.onload = function () { window.Tone ? res(window.Tone) : rej(new Error('tone')); }; s.onerror = rej; document.head.appendChild(s); });
  }
  function wake() {
    if (ready) return Promise.resolve(true);
    if (starting) return starting;
    if (!HAS_AUDIO) return Promise.resolve(false);
    var ctxStart = null;
    starting = loadTone().then(function (Tn) {
      T = Tn; return T.start();
    }).then(function () {
      build(); ready = true; setMute($('pg-mute').checked); $('pg-start').textContent = 'Sound is awake'; $('pg-start').disabled = true; return true;
    }).catch(function () { starting = null; return false; });
    return starting;
  }
  function build() {
    nodes.master = new T.Gain(0.8).toDestination();
    nodes.limiter = new T.Limiter(-3).connect(nodes.master);
    nodes.gen = new T.Gain(1).connect(nodes.limiter);                       // generated layer (ducks under the radio)
    // effects chain (wet 0 until switched on)
    nodes.delay = new T.FeedbackDelay({ delayTime: '8n.', feedback: 0.382, wet: 0 }).connect(nodes.gen);
    nodes.pitch = new T.PitchShift({ pitch: 0, wet: 0 }).connect(nodes.delay);
    nodes.crush = new T.BitCrusher(4); nodes.crush.wet.value = 0; nodes.crush.connect(nodes.pitch);
    nodes.phaser = new T.Phaser({ frequency: 1 / 2.618, octaves: 3, baseFrequency: 400, wet: 0 }).connect(nodes.crush);
    nodes.chorus = new T.Chorus({ frequency: 1 / 1.618, delayTime: 3.5, depth: 0.618, wet: 0 }).connect(nodes.phaser).start();
    nodes.filter = new T.AutoFilter({ frequency: 1 / 4.236, baseFrequency: 300, octaves: 3.6, wet: 0 }).connect(nodes.chorus).start();
    nodes.fxIn = nodes.filter;
    nodes.static = new T.Gain(0).connect(nodes.limiter);
    nodes.noise = new T.Noise('pink').connect(new T.Filter({ type: 'bandpass', frequency: 1800, Q: 1.618 }).connect(nodes.static)).start();
    nodes.click = new T.MembraneSynth({ pitchDecay: 0.008, octaves: 2, envelope: { attack: 0.001, decay: 0.03, sustain: 0 } }).connect(nodes.limiter); nodes.click.volume.value = -18;
    T.Transport.bpm.value = bpm; T.Transport.swingSubdivision = '16n'; T.Transport.swing = +$('pg-swing').value;
    rebuildVoices();
  }
  function rebuildVoices() {
    if (!ready && !T) return;
    Object.keys(voices).forEach(function (k) { try { voices[k].ch.dispose(); } catch (e) {} });
    voices = {};
    parts.forEach(function (p) { try { p.dispose(); } catch (e) {} }); parts = [];
    state.slots.forEach(function (s, i) {
      var ch = new T.Channel({ volume: s.vol, mute: s.mute, solo: s.solo }).connect(nodes.fxIn);
      voices[i] = { ch: ch, play: make(s.inst, ch) };
      var events = []; for (var st = 0; st < 16; st++) events.push({ time: '0:0:' + st, step: st });
      var p = new T.Part(function (time, ev) { stepSlot(i, time, ev.step); }, events);
      p.loop = true; p.loopEnd = '1m'; p.start(0); parts.push(p);
    });
  }
  function xfWeights(time) {
    if (!xf.len) return section ? [0, 1] : [1, 0];
    var x = clamp((time - xf.t0) / xf.len, 0, 1);
    if (x >= 1) { xf.len = 0; }
    var a = Math.cos(x * Math.PI / 2), b = Math.sin(x * Math.PI / 2);   // equal-power
    return xf.to ? [a, b] : [b, a];
  }
  function stepSlot(i, time, st) {
    var s = state.slots[i], v = voices[i]; if (!s || !v) return;
    var lib = LIB[state.flavour], bar = Math.floor(T.Transport.getTicksAtTime(time) / T.Transport.PPQ / 4);
    if (st === 0 && pendingKey && i === 0) { key = pendingKey; pendingKey = null; readTempo(); }
    var fn = lib.prog[bar % lib.prog.length], w = xfWeights(time), human = +$('pg-human').value;
    var srcs = [lib, variantB(lib)];
    for (var k = 0; k < 2; k++) {
      var L = srcs[k], vel = w[k] * (0.62 + Math.random() * 0.3 * human) * (s.soft ? 0.7 : 1); if (vel < 0.03) continue;
      var t = time + Math.random() * human * 0.018;
      try {
        if (s.role === 'bass' && L.bass[st]) v.play([deg((FN[fn] || 1) + (+L.bass[st]) - 1, 2)], '8n', t, vel);
        else if (s.role === 'chords' && L.chords.indexOf(st) > -1) v.play(chord(fn, 4, L.sev), state.flavour === 'ambient' ? '1m' : '4n', t, vel * 0.8);
        else if (s.role === 'melody' && L.melody[st]) v.play([deg(+L.melody[st], 4)], '8n', t, vel);
        else if (s.role === 'rhythm' && L.rhythm[st]) v.play([deg(1, 4)], '16n', t, vel, L.rhythm[st]);
      } catch (e) {}
    }
  }
  function setMute(m) { store('rebella.playground.muted', !!m); if (T) T.Destination.mute = !!m; try { if (yt && yt.mute) m ? yt.mute() : yt.unMute(); } catch (e) {} }

  // ---------- UI: instruments ----------
  function renderInst() {
    var ul = $('pg-inst'); ul.textContent = '';
    INST.forEach(function (it) {
      var li = el('li', 'pg-tile'); li.setAttribute('data-help', 'inst-' + it.id);
      var ic = el('span', 'pg-ico', it.icon); ic.setAttribute('aria-hidden', 'true');
      li.appendChild(ic); li.appendChild(el('span', 'pg-iname', it.name));
      var row = el('div', 'pg-tile-row');
      var pre = el('button', 'pg-btn', 'Hear it'); pre.type = 'button'; pre.setAttribute('aria-label', 'Hear ' + it.name);
      pre.addEventListener('click', function () { wake().then(function (ok) { if (ok) preview(it.id); }); });
      var add = el('button', 'pg-btn', 'Add'); add.type = 'button'; add.setAttribute('aria-label', 'Add ' + it.name + ' to your band');
      add.addEventListener('click', function () { addSlot(it.id); });
      row.appendChild(pre); row.appendChild(add); li.appendChild(row); ul.appendChild(li);
    });
  }
  var pv = {};
  function preview(id) {
    if (!pv[id]) { var g = new T.Channel({ volume: IBY[id].vol }).connect(nodes.fxIn); pv[id] = make(id, g); }
    var now = T.now() + 0.05;
    if (id === 'kit') { pv[id]([60], '16n', now, 0.9, 'k'); pv[id]([60], '16n', now + 0.236, 0.9, 'h'); pv[id]([60], '16n', now + 0.382, 0.9, 'sh'); return; }
    if (IBY[id].role === 'chords') pv[id](chord('I', 4, true), 1, now, 0.8);
    else [1, 3, 5].forEach(function (d, k) { pv[id]([deg(d, IBY[id].role === 'bass' ? 3 : 4)], '8n', now + k * 0.236, 0.8); });
  }
  // ---------- UI: ensemble ----------
  function addSlot(id) {
    if (state.slots.length >= maxSlots()) { note('Your band is full here. Take someone out to make room.'); return; }
    state.slots.push({ inst: id, role: IBY[id].role, mute: false, solo: false, vol: IBY[id].vol });
    save(); renderSlots(); if (T) rebuildVoices();
  }
  function note(t) { $('pg-slots-note').textContent = t; }
  function renderSlots() {
    var ol = $('pg-slots'); ol.textContent = ''; note('');
    state.slots.forEach(function (s, i) {
      var li = el('li', 'pg-slot'); li.setAttribute('data-help', 'slot');
      var head = el('div', 'pg-slot-head');
      head.appendChild(el('span', 'pg-ico', IBY[s.inst].icon)).setAttribute('aria-hidden', 'true');
      head.appendChild(el('strong', '', IBY[s.inst].name));
      li.appendChild(head);
      var row = el('div', 'pg-row');
      var sel = el('select'); sel.setAttribute('aria-label', 'Part for ' + IBY[s.inst].name);
      [['bass', 'Bass'], ['chords', 'Chords'], ['melody', 'Melody'], ['rhythm', 'Rhythm']].forEach(function (r) { var o = el('option', '', r[1]); o.value = r[0]; if (s.role === r[0]) o.selected = true; sel.appendChild(o); });
      sel.addEventListener('change', function () { s.role = sel.value; save(); });
      var mute = el('button', 'pg-btn', 'Mute'); mute.type = 'button'; mute.setAttribute('aria-pressed', String(s.mute));
      mute.addEventListener('click', function () { s.mute = !s.mute; mute.setAttribute('aria-pressed', String(s.mute)); if (voices[i]) voices[i].ch.mute = s.mute; save(); });
      var solo = el('button', 'pg-btn', 'Solo'); solo.type = 'button'; solo.setAttribute('aria-pressed', String(s.solo));
      solo.addEventListener('click', function () { s.solo = !s.solo; solo.setAttribute('aria-pressed', String(s.solo)); if (voices[i]) voices[i].ch.solo = s.solo; save(); });
      var vl = el('label', 'pg-slider'); vl.appendChild(el('span', '', 'Mix'));
      var vol = el('input'); vol.type = 'range'; vol.min = -36; vol.max = 0; vol.step = 1; vol.value = s.vol; vol.setAttribute('aria-label', 'Mix level for ' + IBY[s.inst].name);
      vol.addEventListener('input', function () { s.vol = +vol.value; if (voices[i]) voices[i].ch.volume.rampTo(s.vol, 0.382); });
      vol.addEventListener('change', save); vl.appendChild(vol);
      var rm = el('button', 'pg-btn', 'Take out'); rm.type = 'button'; rm.setAttribute('aria-label', 'Take ' + IBY[s.inst].name + ' out of the band');
      rm.addEventListener('click', function () { state.slots.splice(i, 1); save(); renderSlots(); if (T) rebuildVoices(); });
      [sel, mute, solo, vl, rm].forEach(function (n) { row.appendChild(n); });
      li.appendChild(row); ol.appendChild(li);
    });
    if (!state.slots.length) note('Your band is empty. Add an instrument or pick a band mood.');
  }
  function renderPresets() {
    var box = $('pg-presets'); box.textContent = '';
    PRESETS.forEach(function (p) {
      var b = el('button', 'pg-btn pg-preset', p.name); b.type = 'button';
      b.addEventListener('click', function () {
        state.flavour = p.flavour; [].forEach.call(document.querySelectorAll('input[name=pg-flavour]'), function (r) { r.checked = r.value === p.flavour; });
        state.slots = p.slots.slice(0, maxSlots()).map(function (id) { return { inst: id, role: IBY[id].role, mute: false, solo: false, vol: IBY[id].vol + (p.soft && id === 'kit' ? -4 : 0) }; });
        save(); renderSlots(); if (T) rebuildVoices();
      });
      box.appendChild(b);
    });
  }
  // ---------- transport ----------
  var playing = false;
  function setPlay(on) {
    wake().then(function (ok) {
      if (!ok) return;
      playing = on; $('pg-play').setAttribute('aria-pressed', String(on)); $('pg-play').textContent = on ? 'Stop' : 'Play';
      if (on) T.Transport.start('+0.05'); else T.Transport.stop();
    });
  }
  function readTempo() { $('pg-tempo-readout').textContent = 'Tempo ' + Math.round(bpm) + ' BPM, key ' + key.root + ' ' + key.mode + (latency ? ', latency ' + latency + ' ms' : ''); }

  // ---------- genre dial ----------
  var genres = [], order = [], detent = 0, angle = 0, STEP = 0;
  function shuffle(n) { var o = []; for (var i = 0; i < n; i++) o.push(i); for (i = n - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = o[i]; o[i] = o[j]; o[j] = t; } return o; }
  function setupDial(list) {
    genres = list; var n = genres.length; STEP = 270 / (n - 1);
    var ord = null; try { ord = JSON.parse(sessionStorage.getItem('rebella.playground.dialorder')); } catch (e) {}
    if (!ord || ord.length !== n) { ord = shuffle(n); try { sessionStorage.setItem('rebella.playground.dialorder', JSON.stringify(ord)); } catch (e) {} }
    order = ord;
    var g = $('pg-dial-ticks'); var ns = 'http://www.w3.org/2000/svg';
    for (var i = 0; i < n; i++) { var a = (-135 + i * STEP) * Math.PI / 180, l = document.createElementNS(ns, 'line');
      l.setAttribute('x1', 100 + 76 * Math.sin(a)); l.setAttribute('y1', 100 - 76 * Math.cos(a)); l.setAttribute('x2', 100 + 88 * Math.sin(a)); l.setAttribute('y2', 100 - 88 * Math.cos(a)); l.setAttribute('class', 'pg-dial-tick'); g.appendChild(l); }
    $('pg-dial').setAttribute('aria-valuemax', String(n - 1));
    setAngle(-135, false); settle(0, true);
  }
  function cur() { return genres[order[detent]]; }
  function setAngle(a, live) {
    angle = clamp(a, -135, 135);
    $('pg-dial-knob').setAttribute('transform', 'rotate(' + angle + ' 100 100)');
    if (live && ready) {   // static between stations: loudest halfway between detents
      var pos = (angle + 135) / STEP, d = Math.abs(pos - Math.round(pos)) * 2;
      nodes.static.gain.rampTo(0.18 * d, 0.03);
      var nearest = Math.round(pos);
      if (nearest !== lastTick) { lastTick = nearest; nodes.click.triggerAttackRelease('C6', 0.02); }
    }
  }
  var lastTick = -1;
  function settle(i, quiet) {
    detent = clamp(i, 0, genres.length - 1);
    var target = -135 + detent * STEP, knob = $('pg-dial-knob');
    if (!reduce) { knob.style.transition = 'transform .382s ease'; setTimeout(function () { knob.style.transition = ''; }, 382); }
    setAngle(target, false);
    if (ready) { nodes.static.gain.rampTo(0, 0.146); if (!quiet) nodes.click.triggerAttackRelease('G5', 0.03); }
    var gnr = cur(); $('pg-dial').setAttribute('aria-valuenow', String(detent)); $('pg-dial').setAttribute('aria-valuetext', gnr.label);
    $('pg-dial-label').textContent = gnr.label;
    if (!quiet) onStation(gnr);
  }
  function dialEvents() {
    var dial = $('pg-dial'), drag = null;
    function ang(e) { var r = dial.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2; return Math.atan2(x, -y) * 180 / Math.PI; }
    dial.addEventListener('pointerdown', function (e) { wake(); drag = { a0: ang(e), k0: angle }; try { dial.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault(); });
    dial.addEventListener('pointermove', function (e) { if (!drag) return; var d = ang(e) - drag.a0; if (d > 180) d -= 360; if (d < -180) d += 360; setAngle(drag.k0 + d, true); });
    function up() { if (!drag) return; drag = null; settle(Math.round((angle + 135) / STEP)); }
    dial.addEventListener('pointerup', up); dial.addEventListener('pointercancel', up);
    dial.addEventListener('keydown', function (e) {
      var k = e.key, i = detent;
      if (k === 'ArrowRight' || k === 'ArrowUp') i++; else if (k === 'ArrowLeft' || k === 'ArrowDown') i--; else if (k === 'Home') i = 0; else if (k === 'End') i = genres.length - 1; else return;
      e.preventDefault(); wake().then(function () { settle(i); });
    });
  }
  // ---------- follow the radio ----------
  function onStation(g) {
    loadSource(sourceFor(g), g.label);
    if (!$('pg-follow').checked) return;
    var fade = ladder().fade;
    bpm = g.bpm; if (T) T.Transport.bpm.rampTo(g.bpm, fade);
    pendingKey = { root: g.key, mode: MODES[g.mode] ? g.mode : 'major' }; if (!playing) { key = pendingKey; pendingKey = null; }
    state.flavour = g.flavour; [].forEach.call(document.querySelectorAll('input[name=pg-flavour]'), function (r) { r.checked = r.value === g.flavour; }); save();
    readTempo();
  }
  var taps = [], latency = 0;
  function tap() {
    var now = performance.now(); taps = taps.filter(function (t) { return now - t < 2618; }); taps.push(now);
    if (taps.length >= 2) { var d = (taps[taps.length - 1] - taps[0]) / (taps.length - 1); bpm = clamp(60000 / d, 40, 200); if (T) T.Transport.bpm.rampTo(bpm, 0.382); readTempo(); }
    wake();
  }
  function shift(sec) { if (!T || !playing) return; try { T.Transport.seconds = Math.max(0, T.Transport.seconds + sec); } catch (e) {} }

  // ---------- YouTube (one visible compliant player; only for approved sources with a real id) ----------
  var channels = { channels: [], reading: null }, yt = null, ytReady = false, ytList = null;
  var ID_RE = /^[A-Za-z0-9_-]{12,64}$/;
  function sourceFor(g) {
    var ok = (channels.channels || []).filter(function (c) { return c.approvedByDad === true && c.genre === g.id && ID_RE.test(c.youtubePlaylistId || ''); });
    return ok.length ? ok[Math.floor(Math.random() * ok.length)].youtubePlaylistId : null;
  }
  function loadSource(list, label) {
    var msg = $('pg-player-msg');
    if (!list) { if (yt) try { yt.pauseVideo(); } catch (e) {} $('pg-player-empty').hidden = false; msg.textContent = label + ': nothing on this station yet. Dad adds approved channels, then they play here.'; return; }
    $('pg-player-empty').hidden = true; ytList = list;
    if (!yt) return buildYT(list);
    if (ytReady) crossfadeYT(list);
  }
  function buildYT(list) {
    var box = $('pg-player'), f = document.createElement('iframe');
    f.id = 'pg-yt'; f.width = 356; f.height = 200; f.title = 'Rebella radio (YouTube player)';
    f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    f.src = 'https://www.youtube-nocookie.com/embed/videoseries?list=' + encodeURIComponent(list) + '&enablejsapi=1&playsinline=1&rel=0&origin=' + encodeURIComponent(location.origin);
    box.appendChild(f);
    var s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s);
    window.onYouTubeIframeAPIReady = function () {
      yt = new YT.Player('pg-yt', { events: { onReady: function () { ytReady = true; randomStart(); }, onStateChange: function (e) { duck(e.data === 1); } } });
    };
  }
  function randomStart() { try { yt.setShuffle(true); var p = yt.getPlaylist() || []; yt.playVideoAt(Math.floor(Math.random() * Math.max(1, p.length))); setTimeout(function () { var d = yt.getDuration(); if (d > 0) yt.seekTo(Math.random() * d * 0.618, true); }, 1618); if ($('pg-mute').checked) yt.mute(); } catch (e) {} }
  function crossfadeYT(list) {
    var L = ladder(), half = L.fade / 2, v0 = 100;
    rampYT(half, function (x) { return v0 * Math.cos(x * Math.PI / 2); }, function () {
      try { yt.loadPlaylist({ list: list, listType: 'playlist' }); } catch (e) {}
      setTimeout(function () { randomStart(); rampYT(half, function (x) { return L.vol * 100 * Math.sin(x * Math.PI / 2); }); }, 1000);
    });
  }
  function rampYT(sec, f, done) { var t0 = performance.now(), id = setInterval(function () { var x = clamp((performance.now() - t0) / (sec * 1000), 0, 1); try { yt.setVolume(Math.round(f(x))); } catch (e) {} if (x >= 1) { clearInterval(id); if (done) done(); } }, 60); }
  function duck(radioPlaying) { if (nodes.gen) nodes.gen.gain.rampTo(radioPlaying ? 0.3 : 1, 0.618); }
  document.addEventListener('visibilitychange', function () { if (document.hidden && yt && ytReady) try { yt.pauseVideo(); } catch (e) {} });

  // ---------- Dad's ladder (rule 10 demo; pumps are sliders here) ----------
  var PT = [['Day', 0], ['Evening', 0.5], ['Clear night', 1.5], ['Deep night', 2]];
  var PW = [['Hot', -1], ['Sunny', -0.5], ['Stormy', 0], ['Cloudy', 0], ['Rainy', 0.5], ['Foggy', 1]];
  var PU = [['No hurry', 0], ['Something new', -0.5], ['Urgent', -1.5]];
  var PM = [['Calm', 1, 'ambient or acoustic'], ['Warm', 0.5, 'soul or folk'], ['Proud', 0, 'cinematic'], ['Not sure', 0, 'cinematic'], ['Playful', -0.5, 'indie-pop'], ['Excited', -1, 'upbeat pop or electronic'], ['Serious', 0.5, 'piano']];
  function ladder() {
    var t = PT[+$('pp-time').value], w = PW[+$('pp-weather').value], u = PU[+$('pp-urg').value], m = PM[+$('pp-mood').value];
    var s = t[1] + w[1] + u[1] + m[1];
    var fade = clamp(Math.pow(PHI, 3.5 + s), 2.06, 22.83), b = clamp(60 / Math.pow(PHI, -1 + s / 2), 62, 157), vol = clamp(0.55 * Math.pow(PHI, -s / 4), 0.25, 0.8);
    if (m[0] === 'Serious' || u[0] === 'Urgent') vol = 0.3;
    return { s: s, fade: fade, bpm: b, vol: vol, genre: m[2], t: t[0], w: w[0], u: u[0], m: m[0] };
  }
  function showLadder() {
    var L = ladder();
    $('pp-time-o').textContent = L.t; $('pp-weather-o').textContent = L.w; $('pp-urg-o').textContent = L.u; $('pp-mood-o').textContent = L.m;
    ['pp-time', 'pp-weather', 'pp-urg', 'pp-mood'].forEach(function (id) { $(id).setAttribute('aria-valuetext', $(id + '-o').textContent); });
    $('pg-ladder-readout').textContent = 's = ' + (L.s > 0 ? '+' : '') + L.s.toFixed(1) + ' \u00b7 ' + Math.round(L.bpm) + ' BPM \u00b7 fade ' + L.fade.toFixed(2) + ' s \u00b7 volume ' + Math.round(L.vol * 100) + '% \u00b7 ' + L.genre;
  }
  function crossfade() {
    wake().then(function (ok) {
      if (!ok) return;
      var L = ladder();                                                   // pumps are read once, at the boundary
      var at = playing ? T.Transport.nextSubdivision('1m') : T.now();
      T.Transport.scheduleOnce(function () {}, at);
      xf = { to: section ? 0 : 1, t0: at, len: L.fade }; section = section ? 0 : 1;
      T.Transport.bpm.rampTo(L.bpm, L.fade); bpm = L.bpm; nodes.gen.gain.rampTo(L.vol / 0.55 > 1 ? 1 : L.vol / 0.55, L.fade);
      if (yt && ytReady && ytList) crossfadeYT(ytList);
      readTempo();
    });
  }
  var autoT = null;
  function auto(on) { clearTimeout(autoT); if (!on) return; (function loop() { var L = ladder(); autoT = setTimeout(function () { crossfade(); loop(); }, Math.pow(PHI, 5.5 + L.s) * 1000); })(); }

  // ---------- effects rack ----------
  var FX = [['filter', 'Filter sweep', 0.618], ['delay', 'Tape-style echo', 0.382], ['chorus', 'Chorus', 0.618], ['phaser', 'Phaser', 0.5], ['crush', 'Bitcrush', 0.382]];
  function renderFX() {
    var box = $('pg-fx');
    FX.forEach(function (f) {
      var lab = el('label', 'pg-switch'); lab.setAttribute('data-help', 'fx-' + f[0]);
      var inp = el('input'); inp.type = 'checkbox'; inp.setAttribute('switch', '');
      inp.addEventListener('change', function () { var on = inp.checked; wake().then(function (ok) { if (ok) nodes[f[0]].wet.rampTo(on ? f[2] : 0, 0.382); }); });
      lab.appendChild(inp); lab.appendChild(el('span', '', f[1])); box.appendChild(lab);
    });
  }
  function bend() {
    wake().then(function (ok) {
      if (!ok) return;
      var b0 = T.Transport.bpm.value, low = b0 / Math.pow(PHI, 0.5);
      T.Transport.bpm.rampTo(low, 1.618); nodes.pitch.wet.rampTo(1, 0.236);
      var t0 = performance.now(), id = setInterval(function () { var x = (performance.now() - t0) / 3236; nodes.pitch.pitch = -1.5 * Math.sin(Math.PI * Math.min(1, x)); if (x >= 1) { clearInterval(id); nodes.pitch.pitch = 0; nodes.pitch.wet.rampTo(0, 0.382); } }, 30);
      setTimeout(function () { T.Transport.bpm.rampTo(b0, 1.618); }, 1618);
    });
  }

  // ---------- help dictionary (merged into any site dictionary) ----------
  function initHelp() {
    if (!window.HelpOrb) return;
    var inline = window.PG_HELP || {};
    window.HelpOrb.init({ dict: [inline, BASE + 'data/help.json'] });
  }

  // ---------- boot ----------
  function boot() {
    var mute = $('pg-mute'); mute.checked = !!store('rebella.playground.muted');
    mute.addEventListener('change', function () { setMute(mute.checked); });
    $('pg-start').addEventListener('click', function () { wake(); });
    if (!HAS_AUDIO) { $('pg-noaudio').hidden = false; $('pg-start').disabled = true; $('pg-start').textContent = 'Sound is resting'; ['pg-play', 'pg-bend', 'pg-xfade'].forEach(function (id) { $(id).disabled = true; }); }
    [].forEach.call(document.querySelectorAll('input[name=pg-flavour]'), function (r) { r.checked = r.value === state.flavour; r.addEventListener('change', function () { if (r.checked) { state.flavour = r.value; save(); } }); });
    renderInst(); renderSlots(); renderPresets(); renderFX();
    $('pg-play').addEventListener('click', function () { setPlay(!playing); });
    $('pg-swing').addEventListener('input', function () { if (T) T.Transport.swing = +this.value; });
    $('pg-tap').addEventListener('click', tap);
    $('pg-lineup').addEventListener('click', function () { wake().then(function (ok) { if (ok && playing) { T.Transport.stop(); T.Transport.start('+0.01'); } }); });
    [].forEach.call(document.querySelectorAll('[data-nudge]'), function (b) { b.addEventListener('click', function () { var v = b.getAttribute('data-nudge'); shift(v === 'beat' ? 60 / bpm : v === '-beat' ? -60 / bpm : +v / 1000); }); });
    $('pg-latency').addEventListener('input', function () { var v = +this.value, d = (v - latency) / 1000; latency = v; $('pg-latency-out').textContent = v + ' ms'; this.setAttribute('aria-valuetext', v + ' ms'); shift(d); readTempo(); });
    $('pg-bend').addEventListener('click', bend);
    $('pg-xfade').addEventListener('click', crossfade);
    $('pg-auto').addEventListener('change', function () { auto(this.checked); });
    ['pp-time', 'pp-weather', 'pp-urg', 'pp-mood'].forEach(function (id) { $(id).addEventListener('input', showLadder); });
    $('pg-reading').addEventListener('click', function () {
      var r = channels.reading || {}, id = r.approvedByDad === true && ID_RE.test(r.youtubePlaylistId || '') ? r.youtubePlaylistId : null;
      loadSource(id, 'Reading music'); if (!id) $('pg-player-msg').textContent = 'Reading music is waiting for its playlist. It will play here once it arrives.';
    });
    showLadder();
    var gj = fetch(BASE + 'data/genres.json').then(function (r) { return r.json(); }).catch(function () { return { genres: [{ id: 'lofi', label: 'Lo-fi', flavour: 'lofi', bpm: 76, key: 'F', mode: 'dorian' }, { id: 'ambient', label: 'Ambient', flavour: 'ambient', bpm: 64, key: 'E', mode: 'major' }] }; });
    var cj = fetch(BASE + 'data/channels.json').then(function (r) { return r.json(); }).catch(function () { return { channels: [] }; });
    Promise.all([gj, cj]).then(function (a) { channels = a[1] || channels; setupDial(a[0].genres); dialEvents(); var g = cur(); bpm = g.bpm; key = { root: g.key, mode: MODES[g.mode] ? g.mode : 'major' }; state.flavour = state.flavour || g.flavour; readTempo(); });
    initHelp();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
