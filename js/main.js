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
var mouse = { x: 0, y: 0, speed: 0, active: false };
window.addEventListener('mousemove', function (e) {
  var nx = (e.clientX / window.innerWidth - 0.5) * 2;
  var ny = (e.clientY / window.innerHeight - 0.5) * 2;
  mouse.speed = Math.min(50, Math.abs(nx - mouse.x) * 70 + Math.abs(ny - mouse.y) * 70 + mouse.speed * 0.55);
  mouse.x = nx;
  mouse.y = ny;
  mouse.active = true;
});
window.addEventListener('mouseleave', function () { mouse.active = false; });

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

/* ================= Навигация-маркеры по разделам ================= */
(function () {
  var links = document.querySelectorAll('.section-rail [data-section]');
  if (!links.length || !('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('data-section') === entry.target.id);
      });
    });
  }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
  links.forEach(function (link) {
    var section = document.getElementById(link.getAttribute('data-section'));
    if (section) observer.observe(section);
  });
})();

/* ================= 12. Фоновая фотосмена по скроллу и курсору ================= */
(function () {
  var layer = document.querySelector('.scene-photo');
  if (!layer) return;
  var scenes = [
    { at: 0.1, url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=70&w=1600&auto=format&fit=crop' },
    { at: 0.3, url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=70&w=1600&auto=format&fit=crop' },
    { at: 0.48, url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=70&w=1600&auto=format&fit=crop' },
    { at: 0.66, url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=70&w=1600&auto=format&fit=crop' },
    { at: 0.84, url: 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?q=70&w=1600&auto=format&fit=crop' }
  ];
  var active = -1;
  var px = 0, py = 0;
  function update() {
    var range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var progress = window.scrollY / range;
    var next = 0;
    for (var i = 0; i < scenes.length; i++) if (progress >= scenes[i].at) next = i;
    if (next !== active) {
      active = next;
      layer.style.backgroundImage = 'url("' + scenes[active].url + '")';
      layer.classList.add('is-active');
      layer.classList.remove('is-flicker');
      void layer.offsetWidth;
      layer.classList.add('is-flicker');
    }
  }
  window.addEventListener('mousemove', function (e) {
    px = (e.clientX / window.innerWidth - .5) * 12;
    py = (e.clientY / window.innerHeight - .5) * 9;
    layer.style.backgroundPosition = 'calc(50% + ' + px + 'px) calc(50% + ' + py + 'px)';
    layer.style.transform = 'scale(1.06) translate(' + px * -.16 + 'px,' + py * -.16 + 'px)';
  }, { passive: true });
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* Не оставляем битые фотографии на странице: вместо них показываем аккуратную заглушку. */
document.querySelectorAll('img').forEach(function (image) {
  image.addEventListener('error', function () {
    image.classList.add('image-failed');
    if (image.parentElement) image.parentElement.classList.add('has-image-fallback');
  }, { once: true });
});

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
    g.addColorStop(0, 'rgba(255,77,0,.62)');
    g.addColorStop(0.35, 'rgba(255,77,0,.22)');
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
    color: 0xff6a21,
    emissive: 0x702400,
    emissiveIntensity: 0.52,
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
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  markNode.position.set(1.08, 0, 0.02);
  emblem.add(markNode);
  group.add(emblem);
  /* --- Каркас и частицы вокруг --- */
  var baseX = window.innerWidth < 820 ? 0.65 : 1.45;
  var baseScale = window.innerWidth < 820 ? 0.43 : 0.72;
  group.scale.setScalar(baseScale);
  group.position.x = baseX;
  scene.add(group);

  /* --- Свечение за шаром --- */
  var glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTexture(),
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  glow.scale.setScalar(8.2 * baseScale);
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
  var rimLight = new THREE.PointLight(0xff5a14, 48, 40);
  rimLight.position.set(-6, 3, 4);
  scene.add(rimLight);
  var fillLight = new THREE.PointLight(0xff8a45, 16, 30);
  fillLight.position.set(4, -3, 6);
  scene.add(fillLight);

  /* Топология каркаса остаётся прежней. Каждое ребро рисуется короткими
     плавными сегментами, чтобы весь каркас гнулся как единая мягкая форма. */
  var sphereRadius = outerStructureRadius * 1.08;
  var sphereGeometry = new THREE.IcosahedronGeometry(sphereRadius, 2);
  var rawVertices = sphereGeometry.attributes.position.array;
  var networkVertices = [];
  var vertexIds = Object.create(null);
  var networkEdges = [];
  var edgeIds = Object.create(null);
  function getNetworkVertex(x, y, z) {
    var key = Math.round(x * 10000) + ':' + Math.round(y * 10000) + ':' + Math.round(z * 10000);
    if (vertexIds[key] !== undefined) return vertexIds[key];
    var id = networkVertices.length / 3;
    vertexIds[key] = id;
    networkVertices.push(x, y, z);
    return id;
  }
  function addNetworkEdge(a, b) {
    var first = Math.min(a, b), second = Math.max(a, b);
    var key = first + ':' + second;
    if (edgeIds[key]) return;
    edgeIds[key] = true;
    networkEdges.push([first, second]);
  }
  for (var ti = 0; ti < rawVertices.length; ti += 9) {
    var va = getNetworkVertex(rawVertices[ti], rawVertices[ti + 1], rawVertices[ti + 2]);
    var vb = getNetworkVertex(rawVertices[ti + 3], rawVertices[ti + 4], rawVertices[ti + 5]);
    var vc = getNetworkVertex(rawVertices[ti + 6], rawVertices[ti + 7], rawVertices[ti + 8]);
    addNetworkEdge(va, vb);
    addNetworkEdge(vb, vc);
    addNetworkEdge(vc, va);
  }
  sphereGeometry.dispose();

  var networkBase = new Float32Array(networkVertices);
  var networkPointsGeometry = new THREE.BufferGeometry();
  var networkPointPositions = new Float32Array(networkBase);
  networkPointsGeometry.setAttribute('position', new THREE.BufferAttribute(networkPointPositions, 3));
  var globeNodes = new THREE.Points(networkPointsGeometry, new THREE.PointsMaterial({
    color: 0xffbd8c, size: 0.034, transparent: true, opacity: 0.72,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  globeNodes.renderOrder = 3;
  globeNodes.frustumCulled = false;
  group.add(globeNodes);

  var edgeSubdivisions = 8;
  var networkBaseLines = new Float32Array(networkEdges.length * edgeSubdivisions * 2 * 3);
  var networkLinePositions = new Float32Array(networkBaseLines.length);
  function writeGreatCirclePoint(a, b, progress, offset) {
    var ax = networkBase[a * 3], ay = networkBase[a * 3 + 1], az = networkBase[a * 3 + 2];
    var bx = networkBase[b * 3], by = networkBase[b * 3 + 1], bz = networkBase[b * 3 + 2];
    var dot = THREE.MathUtils.clamp((ax * bx + ay * by + az * bz) / (sphereRadius * sphereRadius), -1, 1);
    var arc = Math.acos(dot);
    var sinArc = Math.sin(arc);
    var weightA = sinArc > 0.0001 ? Math.sin((1 - progress) * arc) / sinArc : 1 - progress;
    var weightB = sinArc > 0.0001 ? Math.sin(progress * arc) / sinArc : progress;
    networkBaseLines[offset] = ax * weightA + bx * weightB;
    networkBaseLines[offset + 1] = ay * weightA + by * weightB;
    networkBaseLines[offset + 2] = az * weightA + bz * weightB;
  }
  var lineCursor = 0;
  for (var ei = 0; ei < networkEdges.length; ei++) {
    var edge = networkEdges[ei];
    for (var si = 0; si < edgeSubdivisions; si++) {
      writeGreatCirclePoint(edge[0], edge[1], si / edgeSubdivisions, lineCursor);
      writeGreatCirclePoint(edge[0], edge[1], (si + 1) / edgeSubdivisions, lineCursor + 3);
      lineCursor += 6;
    }
  }
  networkLinePositions.set(networkBaseLines);
  var networkLineGeometry = new THREE.BufferGeometry();
  var networkLineAttribute = new THREE.BufferAttribute(networkLinePositions, 3);
  networkLineAttribute.setUsage(THREE.DynamicDrawUsage);
  networkLineGeometry.setAttribute('position', networkLineAttribute);
  var networkMaterial = new THREE.LineBasicMaterial({
    color: 0xff4d00, transparent: true, opacity: 0.24,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
  });
  var networkLines = new THREE.LineSegments(networkLineGeometry, networkMaterial);
  networkLines.renderOrder = 2;
  networkLines.frustumCulled = false;
  group.add(networkLines);

  var softGeometry = new THREE.SphereGeometry(sphereRadius * 1.006, 64, 48);
  var softPosition = softGeometry.attributes.position;
  var softBase = new Float32Array(softPosition.array);
  var softUniforms = {
    cursorDirection: { value: new THREE.Vector3(0, 0, 1) },
    hover: { value: 0 }
  };
  var softMaterial = new THREE.MeshBasicMaterial({
    color: 0xff4d00, transparent: true, opacity: 1,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    depthWrite: false, toneMapped: false
  });
  softMaterial.onBeforeCompile = function (shader) {
    shader.uniforms.uSoftCursorDirection = softUniforms.cursorDirection;
    shader.uniforms.uSoftHover = softUniforms.hover;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      '#include <common>\nvarying vec3 vSoftDirection;'
    ).replace(
      '#include <begin_vertex>',
      '#include <begin_vertex>\nvSoftDirection = normalize(position);'
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      '#include <common>\nuniform vec3 uSoftCursorDirection;\nuniform float uSoftHover;\nvarying vec3 vSoftDirection;'
    ).replace(
      '#include <color_fragment>',
      '#include <color_fragment>\n' +
      'float softAngle = acos(clamp(dot(normalize(vSoftDirection), normalize(uSoftCursorDirection)), -1.0, 1.0));\n' +
      'float softFocus = exp(-pow(softAngle / 0.9, 2.0) * 0.5);\n' +
      'float softLip = exp(-pow((softAngle - 0.96) / 0.38, 2.0) * 0.5);\n' +
      'diffuseColor.a *= 0.012 + uSoftHover * (0.045 + 0.125 * softFocus + 0.055 * softLip);\n' +
      'diffuseColor.rgb *= mix(0.5, 1.0, softFocus);'
    );
  };
  softMaterial.customProgramCacheKey = function () { return 'cybercraft-soft-orb-hover'; };
  var softShell = new THREE.Mesh(softGeometry, softMaterial);
  softShell.renderOrder = 1;
  softShell.frustumCulled = false;
  group.add(softShell);

  var orbit = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.018, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0xffad78, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  orbit.rotation.set(0.9, 0.16, -0.34);
  orbit.scale.set(1.2, 0.48, 1);
  orbit.renderOrder = 4;
  group.add(orbit);

  /* --- Анимация: медленный дрейф и реакция на курсор --- */
  var clock = new THREE.Clock();
  var cursorDirection = new THREE.Vector3(0, 0, 1);
  var pointerNdc = new THREE.Vector3();
  var pointerWorld = new THREE.Vector3();
  var pointerPlaneNormal = new THREE.Vector3();
  var groupWorldPosition = new THREE.Vector3();
  var groupWorldQuaternion = new THREE.Quaternion();
  var pointerRay = new THREE.Ray();
  var pointerPlane = new THREE.Plane();
  var deformation = 0;

  function deformPointInto(target, offset, bx, by, bz, t, amount, speed) {
    var nx = bx / sphereRadius, ny = by / sphereRadius, nz = bz / sphereRadius;
    var normalLength = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    nx /= normalLength; ny /= normalLength; nz /= normalLength;
    var facing = THREE.MathUtils.clamp(nx * cursorDirection.x + ny * cursorDirection.y + nz * cursorDirection.z, -1, 1);
    var angle = Math.acos(facing);
    var dentRatio = angle / 0.82;
    var lipRatio = (angle - 0.92) / 0.34;
    var dent = Math.exp(-dentRatio * dentRatio * 0.5);
    var raisedLip = Math.exp(-lipRatio * lipRatio * 0.5);
    var softWave = Math.sin(angle * 5.2 - t * 1.25 + nx * 1.1 + ny * 0.8) * Math.exp(-angle * 1.35) * 0.022;
    var radial = 1 + amount * (-0.17 * dent + 0.075 * raisedLip + softWave);
    var pull = amount * (0.12 + speed * 0.035) * Math.exp(-Math.pow(angle / 1.1, 2) * 0.5);
    var tangentX = cursorDirection.x - nx * facing;
    var tangentY = cursorDirection.y - ny * facing;
    var tangentZ = cursorDirection.z - nz * facing;
    target[offset] = bx * radial + tangentX * sphereRadius * pull;
    target[offset + 1] = by * radial + tangentY * sphereRadius * pull;
    target[offset + 2] = bz * radial + tangentZ * sphereRadius * pull;
  }

  (function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    var speed = Math.min(mouse.speed / 42, 1);
    group.updateMatrixWorld(true);
    pointerNdc.set(mouse.x, -mouse.y, 0.5).unproject(camera);
    pointerRay.origin.copy(camera.position);
    pointerRay.direction.copy(pointerNdc).sub(camera.position).normalize();
    group.getWorldPosition(groupWorldPosition);
    group.getWorldQuaternion(groupWorldQuaternion);
    pointerPlaneNormal.set(0, 0, 1).applyQuaternion(groupWorldQuaternion).normalize();
    pointerPlane.setFromNormalAndCoplanarPoint(pointerPlaneNormal, groupWorldPosition);
    var pointerHitsGlobePlane = pointerRay.intersectPlane(pointerPlane, pointerWorld);
    var pointerLocal = pointerHitsGlobePlane ? group.worldToLocal(pointerWorld) : new THREE.Vector3(0, 0, 0);
    var pointerX = pointerLocal.x / sphereRadius;
    var pointerY = pointerLocal.y / sphereRadius;
    var pointerDistance = Math.sqrt(pointerX * pointerX + pointerY * pointerY);
    var targetX = THREE.MathUtils.clamp(pointerX, -0.96, 0.96);
    var targetY = THREE.MathUtils.clamp(pointerY, -0.96, 0.96);
    var targetZ = Math.sqrt(Math.max(0.04, 1 - targetX * targetX - targetY * targetY));
    var targetDirection = new THREE.Vector3(targetX, targetY, targetZ).normalize();
    cursorDirection.lerp(targetDirection, 0.095).normalize();
    var overGlobe = mouse.active && pointerHitsGlobePlane && pointerDistance < 1.1;
    var pointerPresence = overGlobe ? 1 - THREE.MathUtils.smoothstep(pointerDistance, 0.8, 1.1) : 0;
    var deformationTarget = pointerPresence;
    deformation += (deformationTarget - deformation) * (deformationTarget > deformation ? 0.06 : 0.035);
    var cursorOnGlobe = deformation;
    for (var li = 0; li < networkBaseLines.length; li += 3) {
      deformPointInto(networkLinePositions, li, networkBaseLines[li], networkBaseLines[li + 1], networkBaseLines[li + 2], t, cursorOnGlobe, speed);
    }
    networkLineAttribute.needsUpdate = true;
    for (var ni = 0; ni < networkBase.length; ni += 3) {
      deformPointInto(networkPointPositions, ni, networkBase[ni], networkBase[ni + 1], networkBase[ni + 2], t, cursorOnGlobe, speed);
    }
    networkPointsGeometry.attributes.position.needsUpdate = true;
    for (var vi = 0; vi < softPosition.count; vi++) {
      var ix = vi * 3;
      var bx = softBase[ix], by = softBase[ix + 1], bz = softBase[ix + 2];
      deformPointInto(softPosition.array, ix, bx, by, bz, t, cursorOnGlobe, speed);
    }
    softPosition.needsUpdate = true;
    softUniforms.cursorDirection.value.copy(cursorDirection);
    softUniforms.hover.value = cursorOnGlobe;
    networkMaterial.opacity = 0.24 + Math.sin(t * 0.8) * 0.012;
    mouse.speed *= 0.94;

    // Сфера догоняет курсор с инерцией, затем продолжает мягко дрейфовать.
    group.rotation.y += (mouse.x * 0.7 + Math.sin(t * 0.22) * 0.09 - group.rotation.y) * 0.026;
    group.rotation.x += (-mouse.y * 0.48 + Math.sin(t * 0.31) * 0.07 - group.rotation.x) * 0.028;
    group.rotation.z += (mouse.x * 0.16 + Math.sin(t * 0.18) * 0.035 - group.rotation.z) * 0.023;
    group.position.y += (Math.sin(t * 0.38) * 0.12 - mouse.y * 0.3 - group.position.y) * 0.035;
    group.position.x += ((baseX + mouse.x * 0.58) - group.position.x) * 0.032;
    group.scale.setScalar(baseScale * (1 + Math.sin(t * 0.8) * 0.012));

    orbit.rotation.z += (mouse.x * 0.52 + Math.sin(t * 0.35) * 0.24 - orbit.rotation.z) * 0.045;
    orbit.rotation.x += (0.9 + mouse.y * 0.52 - orbit.rotation.x) * 0.04;
    orbit.rotation.y += (0.16 - mouse.x * 0.3 - orbit.rotation.y) * 0.04;

    glow.position.x = group.position.x;
    glow.material.opacity = 0.17 + Math.sin(t * 0.8) * 0.045;

    stars.rotation.y = t * 0.012;

    camera.position.x += (mouse.x * 0.32 - camera.position.x) * 0.035;
    camera.position.y += (-mouse.y * 0.25 - camera.position.y) * 0.035;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    baseX = window.innerWidth < 820 ? 0.65 : 1.45;
    baseScale = window.innerWidth < 820 ? 0.43 : 0.72;
    glow.scale.setScalar(8.2 * baseScale);
  });
})();
