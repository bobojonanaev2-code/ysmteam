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

/* Плавное затухание колеса; сенсорная прокрутка остаётся нативной. */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine = window.matchMedia('(pointer: fine)');
  var frame = 0, target = window.scrollY, previousTime = 0, lastWritten = window.scrollY;
  var oldBehavior = '', direction = 0;
  function stop() {
    if (frame) cancelAnimationFrame(frame);
    if (frame) document.documentElement.style.scrollBehavior = oldBehavior;
    frame = 0; target = window.scrollY; direction = 0;
  }
  function tick(time) {
    var dt = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    var max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    target = Math.max(0, Math.min(max, target));
    var current = window.scrollY;
    var next = current + (target - current) * (1 - Math.exp(-dt / 0.16));
    if (Math.abs(target - current) < 1.1) next = target;
    window.scrollTo({ top: next, left: window.scrollX, behavior: 'instant' });
    lastWritten = window.scrollY;
    if (next === target) { stop(); return; }
    frame = requestAnimationFrame(tick);
  }
  function nestedScroll(element, delta) {
    for (var node = element; node && node !== document.body && node !== document.documentElement; node = node.parentElement) {
      if (node.matches('textarea,select,[contenteditable="true"]')) return true;
      var style = getComputedStyle(node);
      if (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1 &&
          (delta < 0 ? node.scrollTop > 0 : node.scrollTop + node.clientHeight < node.scrollHeight - 1)) return true;
      if (/(contain|none)/.test(style.overscrollBehaviorY)) return true;
    }
    return false;
  }
  window.addEventListener('wheel', function (event) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || reduced.matches || !fine.matches || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (getComputedStyle(document.body).overflowY === 'hidden' || nestedScroll(event.target, event.deltaY)) { stop(); return; }
    var delta = event.deltaY * (event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? innerHeight : 1);
    if (!delta || !event.cancelable) return;
    var nextDirection = Math.sign(delta);
    if (!frame || (direction && direction !== nextDirection)) target = window.scrollY;
    target = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, target + delta));
    direction = nextDirection;
    event.preventDefault();
    if (!frame) {
      oldBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      previousTime = performance.now(); lastWritten = window.scrollY;
      frame = requestAnimationFrame(tick);
    }
  }, { passive: false });
  window.addEventListener('scroll', function () {
    if (frame && Math.abs(window.scrollY - lastWritten) > 3) stop();
  }, { passive: true });
  ['pointerdown', 'touchstart', 'keydown', 'resize', 'hashchange', 'pagehide'].forEach(function (name) {
    window.addEventListener(name, stop, { passive: true });
  });
  reduced.addEventListener('change', stop);
})();


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
  var ctx, music, effects, ambience, echo, voices = [], timer = null;
  var desired = true, chordIndex = 0, lastPointerSound = -1000;
  // A quiet, unhurried D-major / B-minor / G-major / A-sus ambient piece.
  var chords = [[146.83, 220, 277.18, 329.63], [123.47, 185, 220, 293.66],
    [98, 146.83, 185, 246.94], [110, 164.81, 220, 293.66]];
  var melodies = [[440, 554.37, 659.25], [587.33, 440, 369.99],
    [493.88, 369.99, 293.66], [329.63, 440, 293.66]];
  try { desired = localStorage.getItem('cybercraft-sound') !== 'off'; } catch (_) {}

  function refreshUI() {
    var audible = desired && ctx && ctx.state === 'running' && !document.hidden;
    if (!btn) return;
    btn.classList.toggle('is-on', !!audible);
    btn.setAttribute('aria-pressed', String(!!audible));
    btn.setAttribute('aria-label', audible ? 'Выключить звук' : 'Включить звук');
    if (label) label.textContent = audible ? 'Звук: вкл' : desired ? 'Включить звук' : 'Звук: выкл';
  }

  function ensureCtx() {
    if (ctx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    music = ctx.createGain(); music.gain.value = 0; music.connect(ctx.destination);
    effects = ctx.createGain(); effects.gain.value = desired ? 1 : 0; effects.connect(ctx.destination);
    ambience = ctx.createBiquadFilter();
    ambience.type = 'lowpass'; ambience.frequency.value = 1700; ambience.Q.value = 0.35;
    ambience.connect(music);
    // A quiet filtered echo gives the sparse notes space without a sharp attack.
    echo = ctx.createDelay(2); echo.delayTime.value = 0.72;
    var feedback = ctx.createGain(); feedback.gain.value = 0.22;
    var echoFilter = ctx.createBiquadFilter(); echoFilter.frequency.value = 1100;
    var wet = ctx.createGain(); wet.gain.value = 0.2;
    echo.connect(echoFilter); echoFilter.connect(feedback); feedback.connect(echo);
    echoFilter.connect(wet); wet.connect(ambience);
    ctx.addEventListener('statechange', function () {
      if (ctx.state === 'running' && desired && !document.hidden) beginMusic();
      else { clearInterval(timer); timer = null; }
      refreshUI();
    });
    return true;
  }

  function note(frequency, start, duration, volume, attack, detune) {
    var osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = frequency; osc.detune.value = detune || 0;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain); gain.connect(ambience); gain.connect(echo);
    var voice = { osc: osc, gain: gain };
    voices.push(voice);
    osc.onended = function () {
      osc.disconnect(); gain.disconnect();
      var index = voices.indexOf(voice);
      if (index !== -1) voices.splice(index, 1);
    };
    osc.start(start); osc.stop(start + duration + 0.05);
  }

  function phrase() {
    if (!desired || document.hidden || ctx.state !== 'running') return;
    var start = ctx.currentTime + 0.04;
    var index = chordIndex++ % chords.length;
    chords[index].forEach(function (frequency, i) {
      note(frequency, start, 11, 0.045, 1.8, i % 2 ? 3 : -3);
    });
    melodies[index].forEach(function (frequency, i) {
      // Rounded, quiet bell notes, with long spaces and no percussion.
      note(frequency, start + 0.45 + i * 2.6, 4.4, 0.038, 0.09);
      note(frequency * 2, start + 0.45 + i * 2.6, 1.6, 0.004, 0.06);
    });
  }

  function clearNotes() {
    voices.slice().forEach(function (voice) {
      try { voice.osc.stop(); } catch (_) {}
    });
  }

  function beginMusic() {
    if (!desired || document.hidden || ctx.state !== 'running') return;
    music.gain.setTargetAtTime(0.34, ctx.currentTime, 0.45);
    effects.gain.setTargetAtTime(1, ctx.currentTime, 0.01);
    if (timer !== null) return;
    phrase();
    timer = setInterval(phrase, 8000);
  }

  function unlock() {
    if (!desired || document.hidden) return Promise.resolve(false);
    try {
      if (!ensureCtx()) return Promise.resolve(false);
      if (ctx.state === 'running') { beginMusic(); refreshUI(); return Promise.resolve(true); }
      // Retry in each trusted gesture even if an earlier autoplay request is pending.
      return ctx.resume().then(function () {
        beginMusic(); refreshUI();
        return desired && ctx.state === 'running';
      }, function () { refreshUI(); return false; });
    } catch (_) { refreshUI(); return Promise.resolve(false); }
  }

  function playClick() {
    return unlock().then(function (ready) {
      if (!ready || !desired) return;
      var now = ctx.currentTime, osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(760, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.055);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.085, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
      osc.connect(gain); gain.connect(effects);
      osc.onended = function () { osc.disconnect(); gain.disconnect(); };
      osc.start(now); osc.stop(now + 0.085);
    });
  }

  if (btn) btn.addEventListener('click', function () {
    var audible = desired && ctx && ctx.state === 'running';
    desired = !audible;
    try { localStorage.setItem('cybercraft-sound', desired ? 'on' : 'off'); } catch (_) {}
    if (desired) { unlock(); playClick(); }
    else {
      clearInterval(timer); timer = null;
      clearNotes();
      if (ctx) {
        music.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
        effects.gain.setTargetAtTime(0, ctx.currentTime, 0.01);
      }
    }
    refreshUI();
  });

  var interactive = 'a[href],button,input[type="submit"],[role="button"],.srow';
  document.addEventListener('pointerdown', function (event) {
    if (!event.isTrusted || event.button !== 0) return;
    var control = event.target.closest(interactive);
    if (control && control.closest('.sound-toggle')) return;
    unlock();
    if (control && !control.disabled) { lastPointerSound = performance.now(); playClick(); }
  }, { capture: true, passive: true });
  document.addEventListener('keydown', function (event) {
    if (event.isTrusted && !event.repeat && !event.target.closest('.sound-toggle')) unlock();
  }, { capture: true });
  document.addEventListener('click', function (event) {
    var control = event.target.closest(interactive);
    if (!control || control.disabled || control.closest('.sound-toggle')) return;
    if (event.detail === 0 || performance.now() - lastPointerSound > 600) playClick();
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearInterval(timer); timer = null;
      clearNotes();
      if (ctx && ctx.state === 'running') ctx.suspend().catch(function () {});
    } else unlock();
    refreshUI();
  });
  window.addEventListener('pageshow', function () { unlock(); });
  // Request autoplay as soon as this script loads. If blocked, trusted gestures retry.
  unlock();
  refreshUI();
  return { playClick: playClick };
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
  var cage = new THREE.Group();
  group.add(cage);
  cage.add(globeNodes);

  var edgeSubdivisions = 8;
  var networkBaseLines = new Float32Array(networkEdges.length * edgeSubdivisions * 2 * 3);
  var networkLinePositions = new Float32Array(networkBaseLines.length);
  function writeEdgePoint(a, b, progress, offset) {
    var ax = networkBase[a * 3], ay = networkBase[a * 3 + 1], az = networkBase[a * 3 + 2];
    var bx = networkBase[b * 3], by = networkBase[b * 3 + 1], bz = networkBase[b * 3 + 2];
    // Straight original edges at rest, continuously bent samples on hover.
    networkBaseLines[offset] = ax + (bx - ax) * progress;
    networkBaseLines[offset + 1] = ay + (by - ay) * progress;
    networkBaseLines[offset + 2] = az + (bz - az) * progress;
  }

  var lineCursor = 0;
  for (var ei = 0; ei < networkEdges.length; ei++) {
    var edge = networkEdges[ei];
    for (var si = 0; si < edgeSubdivisions; si++) {
      writeEdgePoint(edge[0], edge[1], si / edgeSubdivisions, lineCursor);
      writeEdgePoint(edge[0], edge[1], (si + 1) / edgeSubdivisions, lineCursor + 3);
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
  cage.add(networkLines);

  // The cage stays transparent: no surface mesh or hover fill.

  var orbit = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.018, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0xffad78, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  orbit.rotation.set(0.9, 0.16, -0.34);
  orbit.scale.set(1.2, 0.48, 1);
  orbit.renderOrder = 4;
  group.add(orbit);

  // Soft light around the existing orbit, with no surface covering the cage.
  var orbitHalo = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.065, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0xff6a21, transparent: true, opacity: 0.11,
      blending: THREE.AdditiveBlending, depthWrite: false })
  );
  orbit.add(orbitHalo);

  var clock = new THREE.Clock();
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var elapsed = 0, deformation = 0;
  var cursorDirection = new THREE.Vector3(0, 0, 1);
  var worldHoverDirection = new THREE.Vector3(0, 0, 1);
  var targetDirection = new THREE.Vector3();
  var pointerNdc = new THREE.Vector3(), pointerWorld = new THREE.Vector3();
  var groupWorldPosition = new THREE.Vector3(), cageQuaternion = new THREE.Quaternion();
  var pointerRay = new THREE.Ray(), hitSphere = new THREE.Sphere();

  function deformPointInto(target, offset, bx, by, bz, t, amount) {
    var length = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
    var nx = bx / length, ny = by / length, nz = bz / length;
    var facing = THREE.MathUtils.clamp(nx * cursorDirection.x + ny * cursorDirection.y + nz * cursorDirection.z, -1, 1);
    // A broad continuous field bends edge interiors as well as their endpoints.
    var focus = Math.exp(-(1 - facing) / 0.38);
    var wave = Math.sin(t * 1.5 + nx * 2.1 + ny * 1.7) * 0.012;
    var radial = 1 + amount * focus * (-0.115 + wave);
    var pull = amount * focus * 0.075;
    target[offset] = bx * radial + (cursorDirection.x - nx * facing) * sphereRadius * pull;
    target[offset + 1] = by * radial + (cursorDirection.y - ny * facing) * sphereRadius * pull;
    target[offset + 2] = bz * radial + (cursorDirection.z - nz * facing) * sphereRadius * pull;
  }

  (function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.05);
    var calm = reducedMotion.matches;
    elapsed += calm ? 0 : dt;
    var t = elapsed, follow = 1 - Math.exp(-dt * 2.4);

    // The wireframe turns continuously, independent of cursor movement.
    cage.rotation.set(Math.sin(t * 0.13) * 0.13, t * 0.16, t * 0.025);
    group.rotation.x += ((calm ? 0 : -mouse.y * 0.16) - group.rotation.x) * follow;
    group.rotation.y += ((calm ? 0 : mouse.x * 0.2) - group.rotation.y) * follow;
    group.rotation.z = Math.sin(t * 0.19) * 0.035;
    group.position.x += (baseX + (calm ? 0 : mouse.x * 0.22) - group.position.x) * follow;
    group.position.y += (Math.sin(t * 0.38) * 0.12 - (calm ? 0 : mouse.y * 0.12) - group.position.y) * follow;
    group.scale.setScalar(baseScale);
    emblem.rotation.y = Math.sin(t * 0.28) * 0.17;
    emblem.rotation.x = Math.sin(t * 0.21) * 0.08;
    orbit.rotation.set(0.9 + Math.sin(t * 0.24) * 0.18, t * 0.12, -0.34 + Math.sin(t * 0.32) * 0.18);

    camera.position.x += ((calm ? 0 : mouse.x * 0.18) - camera.position.x) * follow;
    camera.position.y += ((calm ? 0 : -mouse.y * 0.15) - camera.position.y) * follow;
    camera.lookAt(scene.position);
    camera.updateMatrixWorld();
    group.updateMatrixWorld(true);
    group.getWorldPosition(groupWorldPosition);
    hitSphere.center.copy(groupWorldPosition);
    hitSphere.radius = sphereRadius * baseScale;
    pointerNdc.set(mouse.x, -mouse.y, 0.5).unproject(camera);
    pointerRay.origin.copy(camera.position);
    pointerRay.direction.copy(pointerNdc).sub(camera.position).normalize();
    var hit = mouse.active && !calm && pointerRay.intersectSphere(hitSphere, pointerWorld);
    var presence = 0;
    if (hit) {
      targetDirection.copy(pointerWorld).sub(groupWorldPosition).normalize();
      worldHoverDirection.lerp(targetDirection, 1 - Math.exp(-dt * 5)).normalize();
      var distance = Math.sqrt(pointerRay.distanceSqToPoint(groupWorldPosition)) / hitSphere.radius;
      presence = 1 - THREE.MathUtils.smoothstep(distance, 0.88, 1);
    }
    cage.getWorldQuaternion(cageQuaternion);
    cursorDirection.copy(worldHoverDirection).applyQuaternion(cageQuaternion.invert()).normalize();
    deformation += (presence - deformation) * (1 - Math.exp(-dt / (presence > deformation ? 0.24 : 0.42)));
    for (var li = 0; li < networkBaseLines.length; li += 3) {
      deformPointInto(networkLinePositions, li, networkBaseLines[li], networkBaseLines[li + 1], networkBaseLines[li + 2], t, deformation);
    }
    networkLineAttribute.needsUpdate = true;
    for (var ni = 0; ni < networkBase.length; ni += 3) {
      deformPointInto(networkPointPositions, ni, networkBase[ni], networkBase[ni + 1], networkBase[ni + 2], t, deformation);
    }
    networkPointsGeometry.attributes.position.needsUpdate = true;
    networkMaterial.opacity = 0.24 + Math.sin(t * 0.8) * 0.012;
    glow.position.x = group.position.x;
    glow.position.y = group.position.y;
    glow.material.opacity = 0.34 + Math.sin(t * 0.8) * 0.035;
    stars.rotation.y = t * 0.012;
    mouse.speed *= Math.exp(-dt * 4);
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
