/* ============================================================
   CYBERCRAFT — main.js (v2)
   Курсор, reveal, счётчики, tilt, меню, форма, звук (эмбиент +
   клики), FAQ, hover-preview, параллакс, прогресс-бар,
   3D-фон с искажающимся шаром и логотипом, 3D-аватары.
   ============================================================ */
'use strict';

/* Copy Telegram usernames from the team cards. */
document.querySelectorAll('.member-telegram[data-copy-username]').forEach(function (button) {
  var label = button.querySelector('.telegram-label');
  var originalLabel = label.textContent;
  var originalAriaLabel = button.getAttribute('aria-label');
  var resetTimer;

  button.addEventListener('click', function () {
    var username = button.getAttribute('data-copy-username');

    function fallbackCopy() {
      var field = document.createElement('textarea');
      field.value = username;
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      var copied = document.execCommand('copy');
      field.remove();
      return copied ? Promise.resolve() : Promise.reject(new Error('Copy failed'));
    }

    var copyPromise = window.isSecureContext && navigator.clipboard
      ? navigator.clipboard.writeText(username).catch(fallbackCopy)
      : fallbackCopy();

    copyPromise.then(function () {
      window.clearTimeout(resetTimer);
      button.classList.add('is-copied');
      label.textContent = 'Скопировано!';
      button.setAttribute('aria-label', 'Скопировано: ' + username);
      resetTimer = window.setTimeout(function () {
        button.classList.remove('is-copied');
        label.textContent = originalLabel;
        button.setAttribute('aria-label', originalAriaLabel);
      }, 1600);
    }).catch(function () {
      label.textContent = 'Не скопировалось';
      window.setTimeout(function () { label.textContent = originalLabel; }, 1600);
    });
  });
});

/* ================= Shared mouse state ================= */
var mouse = { x: 0, y: 0, speed: 0 };
window.addEventListener('mousemove', function (e) {
  var nx = (e.clientX / window.innerWidth - 0.5) * 2;
  var ny = (e.clientY / window.innerHeight - 0.5) * 2;
  mouse.speed = Math.min(50, Math.abs(nx - mouse.x) * 70 + Math.abs(ny - mouse.y) * 70 + mouse.speed * 0.55);
  mouse.x = nx;
  mouse.y = ny;
});

/* ================= 1. Custom cursor ================= */
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
  var hoverables = document.querySelectorAll('a, button, .tilt, input, textarea, select, .srow, .faq-q');
  hoverables.forEach(function (el) {
    el.addEventListener('mouseenter', function () { ring.classList.add('is-hover'); });
    el.addEventListener('mouseleave', function () { ring.classList.remove('is-hover'); });
  });
})();

/* ================= 2. Reveal on scroll ================= */
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

/* ================= 3. Counters ================= */
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

/* ================= 4. 3D-Tilt карточек ================= */
(function () {
  document.querySelectorAll('.tilt').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transition = 'transform .08s linear';
      card.style.transform =
        'perspective(900px) rotateX(' + (-y * 9) + 'deg) rotateY(' + (x * 9) + 'deg) translateY(-5px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  });
})();

/* ================= 5. Мобильное меню ================= */
(function () {
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', function () {
    burger.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });
})();

/* ================= 6. Активный пункт меню ================= */
(function () {
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (a) {
    if (a.getAttribute('href') === path) a.classList.add('is-active');
  });
})();

/* ================= 7. Навигация строго в том же окне ================= */
(function () {
  document.querySelectorAll('a[href$=".html"]').forEach(function (a) {
    a.setAttribute('target', '_self');
    a.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = a.getAttribute('href');
    });
  });
})();

/* ================= 8. Форма контактов ================= */
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

/* ================= 9. Звук: эмбиент + клики ================= */
var Sound = (function () {
  var btn = document.querySelector('.sound-toggle');
  var label = btn ? btn.querySelector('.sound-label') : null;
  var ctx = null, master = null, filter = null;
  var playing = false, timer = null, chordIdx = 0;
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

  function refreshUI() {
    if (!btn) return;
    btn.classList.toggle('is-on', playing);
    if (label) label.textContent = playing ? 'Звук: вкл' : 'Звук: выкл';
  }

  function start() {
    ensureCtx();
    ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.16, ctx.currentTime, 1.2);
    if (!timer) playChord();
    playing = true;
    refreshUI();
  }

  function stop() {
    clearTimeout(timer); timer = null;
    if (master) master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4);
    playing = false;
    refreshUI();
  }

  if (btn) {
    btn.addEventListener('click', function () { playing ? stop() : start(); });
    // Попытка автоплея сразу при загрузке
    start();
    // Если браузер заблокировал (нет пользовательского жеста) —
    // запускаем звук при ЛЮБОМ первом взаимодействии
    var resume = function () {
      if (ctx && ctx.state === 'suspended') ctx.resume();
    };
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) {
      document.addEventListener(ev, resume);
    });
  }

  // Короткий "тик" при клике по кнопкам
  var clickCtx = null;
  function playClick() {
    try {
      if (!clickCtx) clickCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (clickCtx.state === 'suspended') clickCtx.resume();
      var t = clickCtx.currentTime;
      var o = clickCtx.createOscillator();
      var g = clickCtx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(660, t);
      o.frequency.exponentialRampToValueAtTime(180, t + 0.07);
      g.gain.setValueAtTime(0.045, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      o.connect(g); g.connect(clickCtx.destination);
      o.start(t); o.stop(t + 0.1);
    } catch (e) { /* без звука — не страшно */ }
  }

  return { playClick: playClick };
})();

(function () {
  ['.btn', '.header-cta', '.nav a', '.srow', '.burger', '.faq-q'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.addEventListener('click', function () { Sound.playClick(); });
    });
  });
})();

/* ================= 10. FAQ accordion ================= */
(function () {
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function (i) {
        i.classList.remove('is-open');
      });
      if (!wasOpen) item.classList.add('is-open');
    });
  });
})();

/* ================= 11. Hover-preview за курсором ================= */
(function () {
  var preview = document.querySelector('.hover-preview');
  if (!preview) return;
  if (window.matchMedia('(hover: none)').matches) return;
  var img = preview.querySelector('img');
  var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  var x = tx, y = ty;
  window.addEventListener('mousemove', function (e) {
    tx = e.clientX; ty = e.clientY;
  });
  (function loop() {
    x += (tx - x) * 0.13;
    y += (ty - y) * 0.13;
    preview.style.transform =
      'translate(' + x + 'px,' + y + 'px) translate(-50%,-58%) scale(' + (preview.classList.contains('is-on') ? 1 : 0.85) + ')';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('[data-img]').forEach(function (row) {
    row.addEventListener('mouseenter', function () {
      img.src = row.getAttribute('data-img');
      preview.classList.add('is-on');
    });
    row.addEventListener('mouseleave', function () {
      preview.classList.remove('is-on');
    });
  });
})();

/* ================= 12. Параллакс картин и прогресс-бар ================= */
(function () {
  var pEls = document.querySelectorAll('[data-parallax]');
  var bar = document.querySelector('.progress-bar');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var vh = window.innerHeight;
      pEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        var off = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.transform = 'translateY(' + off + 'px)';
      });
      if (bar) {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ================= 13. Three.js: 3D-фон =================
   Объёмный знак CyberCraft в оранжевой каркасной сфере,
   окружённый частицами и мягким свечением. */
(function () {
  var canvas = document.getElementById('webgl');
  if (!canvas || !window.THREE) return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 7;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /* --- Мягкое свечение (radial gradient sprite) --- */
  function makeGlowTexture() {
    var c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    var x = c.getContext('2d');
    var g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,77,0,.85)');
    g.addColorStop(0.35, 'rgba(255,77,0,.28)');
    g.addColorStop(1, 'rgba(255,77,0,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }
  var group = new THREE.Group();

  /* Радиусы сеток заданы относительно размера знака. */
  var emblemRadius = 1.08;
  var emblemStroke = 0.14;
  var emblemOuterRadius = emblemRadius + emblemStroke;
  var innerStructureRadius = emblemOuterRadius * 1.7;
  var outerStructureRadius = innerStructureRadius * 1.55;
  /* --- Объёмный знак CyberCraft: буква C --- */
  var emblem = new THREE.Group();
  var emblemMaterial = new THREE.MeshStandardMaterial({
    color: 0xff5a1f,
    emissive: 0x671d00,
    emissiveIntensity: 0.55,
    roughness: 0.24,
    metalness: 0.48
  });
  var cMark = new THREE.Mesh(
    new THREE.TorusGeometry(emblemRadius, emblemStroke, 24, 96, Math.PI * 1.68),
    emblemMaterial
  );
  cMark.rotation.z = 0.53; // Открытая часть буквы смотрит вправо.
  emblem.add(cMark);

  var markNode = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xf5f5f5 })
  );
  markNode.position.set(1.08, 0, 0.02);
  emblem.add(markNode);
  group.add(emblem);
  /* --- Каркас и частицы вокруг --- */
  var wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(outerStructureRadius, 1)),
    new THREE.LineBasicMaterial({ color: 0xff4d00, transparent: true, opacity: 0.18 })
  );
  var core = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(innerStructureRadius, 0)),
    new THREE.LineBasicMaterial({ color: 0xf5f5f5, transparent: true, opacity: 0.24 })
  );
  group.add(wire);
  group.add(core);

  var baseX = window.innerWidth < 820 ? 2.0 : 2.7;
  var baseScale = window.innerWidth < 820 ? 0.5 : 1;
  group.scale.setScalar(baseScale);
  group.position.x = baseX;
  scene.add(group);

  /* --- Свечение за шаром --- */
  var glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTexture(),
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  glow.scale.setScalar(9.5 * baseScale);
  glow.position.set(baseX, 0, -1.5);
  scene.add(glow);

  /* --- Звёздное поле --- */
  var starCount = 500;
  var positions = new Float32Array(starCount * 3);
  for (var i = 0; i < starCount * 3; i++) positions[i] = (Math.random() - 0.5) * 26;
  var starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
    color: 0x9a9a9a, size: 0.022, transparent: true, opacity: 0.55
  }));
  scene.add(stars);

  /* --- Свет --- */
  scene.add(new THREE.AmbientLight(0x2c2c2c, 1.4));
  var key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(4, 6, 8);
  scene.add(key);
  var rimLight = new THREE.PointLight(0xff4d00, 60, 40);
  rimLight.position.set(-6, 3, 4);
  scene.add(rimLight);
  var fillLight = new THREE.PointLight(0x7d94b5, 18, 30);
  fillLight.position.set(4, -3, 6);
  scene.add(fillLight);

  /* --- Анимация: медленный дрейф и реакция на курсор --- */
  var clock = new THREE.Clock();

  (function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    // Повороты и дрейф
    group.rotation.y += 0.0016;
    group.rotation.x += (mouse.y * 0.28 - group.rotation.x) * 0.04;
    group.rotation.z += (mouse.x * 0.14 - group.rotation.z) * 0.04;
    group.position.y = Math.sin(t * 0.5) * 0.18;
    group.position.x += ((baseX + mouse.x * 0.35) - group.position.x) * 0.04;
    group.scale.setScalar(baseScale * (1 + Math.sin(t * 0.8) * 0.012));

    core.rotation.y -= 0.004;
    wire.rotation.y += 0.0006;

    glow.position.x = group.position.x;
    glow.material.opacity = 0.17 + Math.sin(t * 0.8) * 0.045;

    stars.rotation.y = t * 0.012;

    camera.position.x += (mouse.x * 0.45 - camera.position.x) * 0.03;
    camera.position.y += (-mouse.y * 0.35 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    baseX = window.innerWidth < 820 ? 2.0 : 2.7;
    baseScale = window.innerWidth < 820 ? 0.5 : 1;
    glow.scale.setScalar(9.5 * baseScale);
  });
})();
