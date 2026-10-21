/* ============================================================
   CYBERCRAFT — main.js
   Кастомный курсор, Three.js фон, tilt-карточки, reveal,
   счётчики, мобильное меню, форма, эмбиент-музыка (WebAudio).
   ============================================================ */
'use strict';

/* ---------- 1. Custom cursor (точка + кольцо с lerp) ---------- */
(function () {
  var dot = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }
  document.body.classList.add('has-cursor');
  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var rx = mx, ry = my;
  window.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
  });
  (function loop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
    requestAnimationFrame(loop);
  })();
  var hoverables = document.querySelectorAll('a, button, .tilt, input, textarea, select, .srow');
  hoverables.forEach(function (el) {
    el.addEventListener('mouseenter', function () { ring.classList.add('is-hover'); });
    el.addEventListener('mouseleave', function () { ring.classList.remove('is-hover'); });
  });
})();

/* ---------- 2. Reveal on scroll (Intersection Observer) ---------- */
(function () {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();

/* ---------- 3. Анимированные счётчики ---------- */
(function () {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      io.unobserve(el);
      var target = parseInt(el.getAttribute('data-count'), 10);
      var dur = 1700, start = performance.now();
      function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  counters.forEach(function (c) { io.observe(c); });
})();

/* ---------- 4. 3D-Tilt карточек ---------- */
(function () {
  document.querySelectorAll('.tilt').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        'perspective(900px) rotateX(' + (-y * 9) + 'deg) rotateY(' + (x * 9) + 'deg) translateY(-5px)';
      card.style.transition = 'transform .08s linear';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  });
})();

/* ---------- 5. Мобильное меню ---------- */
(function () {
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', function () {
    burger.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });
})();

/* ---------- 6. Активный пункт меню ---------- */
(function () {
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (a) {
    if (a.getAttribute('href') === path) a.classList.add('is-active');
  });
})();

/* ---------- 7. Форма контактов ---------- */
(function () {
  var form = document.querySelector('.contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var note = form.querySelector('.form-note');
    note.textContent = 'Спасибо! Мы свяжемся с вами в течение 24 часов.';
    note.classList.add('is-ok');
    form.reset();
  });
})();

/* ---------- 8. Эмбиент-музыка (WebAudio, без внешних файлов) ---------- */
(function () {
  var btn = document.querySelector('.sound-toggle');
  if (!btn) return;
  var ctx = null, master = null, filter = null;
  var playing = false, timer = null, chordIdx = 0;
  var label = btn.querySelector('.sound-label');

  // Аккорды: ля минор -> соль мажор -> фа мажор (пэд + октавы)
  var chords = [
    [110.00, 164.81, 220.00, 261.63],
    [98.00, 146.83, 196.00, 246.94],
    [87.31, 130.81, 174.61, 220.00]
  ];

  function ensureCtx() {
    if (ctx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 750;
    filter.Q.value = 4;
    filter.connect(master);
    master.connect(ctx.destination);
    // Медленный LFO на частоту фильтра — "дыхание" синтвейва
    var lfo = ctx.createOscillator();
    var lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 380;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
  }

  function playChord() {
    var freqs = chords[chordIdx % chords.length];
    chordIdx++;
    var t = ctx.currentTime;
    freqs.forEach(function (f, i) {
      var osc = ctx.createOscillator();
      osc.type = (i % 2) ? 'sawtooth' : 'triangle';
      osc.frequency.value = f;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.09, t + 1.6);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 7.6);
      osc.connect(g); g.connect(filter);
      osc.start(t); osc.stop(t + 7.8);
      // Обертон для воздушности
      var osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = f * 2.003;
      var g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.028, t + 2.2);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 7.9);
      osc2.connect(g2); g2.connect(filter);
      osc2.start(t); osc2.stop(t + 8);
    });
    timer = setTimeout(playChord, 6000);
  }

  function start() {
    ensureCtx();
    ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.16, ctx.currentTime, 1.2);
    if (!timer) playChord();
    playing = true;
    btn.classList.add('is-on');
    label.textContent = 'Звук: вкл';
  }

  function stop() {
    clearTimeout(timer); timer = null;
    if (master) master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4);
    playing = false;
    btn.classList.remove('is-on');
    label.textContent = 'Звук: выкл';
  }

  btn.addEventListener('click', function () { playing ? stop() : start(); });

  // Попытка автоплея; если браузер блокирует — стартует при первом клике
  start();
  setTimeout(function () {
    if (ctx && ctx.state === 'suspended') {
      var resume = function () {
        ctx.resume();
        document.removeEventListener('click', resume);
      };
      document.addEventListener('click', resume);
    }
  }, 150);
})();

/* ---------- 9. Three.js — 3D фон (каркасная сфера + частицы) ---------- */
(function () {
  var canvas = document.getElementById('webgl');
  if (!canvas || !window.THREE) return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 7;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var group = new THREE.Group();

  var geo = new THREE.IcosahedronGeometry(2.6, 1);
  var wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(geo),
    new THREE.LineBasicMaterial({ color: 0xff4d00, transparent: true, opacity: 0.3 })
  );
  var dots = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0xf5f5f5, size: 0.04, transparent: true, opacity: 0.85 })
  );
  var core = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.35, 0)),
    new THREE.LineBasicMaterial({ color: 0xf5f5f5, transparent: true, opacity: 0.14 })
  );

  group.add(wire);
  group.add(dots);
  group.add(core);

  if (window.innerWidth < 820) {
    group.position.x = 0;
    group.scale.setScalar(0.72);
  } else {
    group.position.x = 2.7;
  }
  scene.add(group);

  // Далёкое звёздное поле
  var starCount = 500;
  var positions = new Float32Array(starCount * 3);
  for (var i = 0; i < starCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 26;
  }
  var starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0x9a9a9a, size: 0.022, transparent: true, opacity: 0.55 })
  );
  scene.add(stars);

  var mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  var clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    group.rotation.y += 0.0018;              // медленное вращение
    group.rotation.x += (mouseY * 0.32 - group.rotation.x) * 0.035; // параллакс за мышью
    group.rotation.z += (mouseX * 0.18 - group.rotation.z) * 0.035;
    group.position.y = Math.sin(t * 0.5) * 0.18;

    core.rotation.y -= 0.004;
    core.rotation.x += 0.002;

    stars.rotation.y = t * 0.012;

    camera.position.x += (mouseX * 0.45 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 0.35 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
