/* ============================================================
   Sunshine — interactions
   scroll reveal · rain canvas · lightbox · progress · audio
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Photo fallback ----------
     If a real photo isn't in assets/photos/ yet, show the placeholder
     so the layout never breaks. Replace the files and this goes away. */
  var PLACEHOLDER = 'assets/photos/_placeholder.svg';
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.src.indexOf('_placeholder.svg') === -1) {
      t.src = PLACEHOLDER;
      t.classList.add('is-placeholder');
    }
  }, true);

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Scroll progress ---------- */
  var bar = document.getElementById('progressBar');
  function onScroll() {
    var h = document.documentElement;
    var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
    if (bar) bar.style.width = (scrolled * 100) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Rain canvas ---------- */
  function Rain(canvas, opts) {
    if (!canvas || reduceMotion) return;
    opts = opts || {};
    var ctx = canvas.getContext('2d');
    var drops = [];
    var count = opts.count || 140;
    var w, h, raf, visible = true;

    function resize() {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    function seed() {
      drops = [];
      for (var i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * w,
          y: Math.random() * h,
          len: (8 + Math.random() * 18) * devicePixelRatio,
          speed: (4 + Math.random() * 7) * devicePixelRatio,
          op: 0.08 + Math.random() * 0.22
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        ctx.strokeStyle = 'rgba(200,215,245,' + d.op + ')';
        ctx.lineWidth = 1.1 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1.2 * devicePixelRatio, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        d.x -= 0.5 * devicePixelRatio;
        if (d.y > h) { d.y = -d.len; d.x = Math.random() * w; }
      }
      raf = requestAnimationFrame(draw);
    }
    function start() { if (!raf) draw(); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    resize(); seed(); start();
    window.addEventListener('resize', function () { resize(); seed(); });

    // pause when offscreen (perf)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          visible = e.isIntersecting;
          if (visible) start(); else stop();
        });
      }, { threshold: 0 }).observe(canvas);
    }
  }

  Rain(document.getElementById('rainCanvasMumbai'), { count: 200 });
  Rain(document.getElementById('rainCanvasLetter'), { count: 70 });

  /* ---------- 3D tilt on gallery cards ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.g-item').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'rotateY(' + (px * 12) + 'deg) rotateX(' + (-py * 12) + 'deg) translateZ(10px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var lbList = [];
  var lbIndex = 0;

  function collectLightboxImages() {
    lbList = Array.prototype.slice.call(
      document.querySelectorAll('.gallery img, .ms-gallery img, .ms-photo img, .intro-photo img')
    );
  }
  collectLightboxImages();

  function openLb(i) {
    lbIndex = i;
    lbImg.src = lbList[i].src;
    lbImg.alt = lbList[i].alt || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function step(dir) {
    lbIndex = (lbIndex + dir + lbList.length) % lbList.length;
    lbImg.src = lbList[lbIndex].src;
    lbImg.alt = lbList[lbIndex].alt || '';
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.matches('.gallery img, .ms-gallery img, .ms-photo img, .intro-photo img')) {
      collectLightboxImages();
      openLb(lbList.indexOf(t));
    }
  });
  if (lbClose) lbClose.addEventListener('click', closeLb);
  if (lbPrev) lbPrev.addEventListener('click', function () { step(-1); });
  if (lbNext) lbNext.addEventListener('click', function () { step(1); });
  if (lb) lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* ---------- Replay button ---------- */
  var replay = document.getElementById('replayBtn');
  if (replay) {
    replay.addEventListener('click', function () {
      document.getElementById('hero').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Audio ambience ---------- */
  var audio = document.getElementById('ambience');
  var player = document.getElementById('player');
  var playBtn = document.getElementById('playBtn');
  var muteBtn = document.getElementById('muteBtn');
  var stateEl = document.getElementById('playerState');
  var TARGET_VOL = 0.4;

  function setState(txt) { if (stateEl) stateEl.textContent = txt; }

  if (player && audio && playBtn) {
    // Play / pause
    playBtn.addEventListener('click', function () {
      if (audio.paused) {
        audio.volume = 0;
        var p = audio.play();
        if (p && p.catch) {
          p.then(function () {
            fade(audio, 0, audio.muted ? 0 : TARGET_VOL, 1200);
          }).catch(function () {
            // no file present, or blocked by the browser
            setState('add a song file');
          });
        }
      } else {
        fade(audio, audio.volume, 0, 500, function () { audio.pause(); });
      }
    });

    // Mute / unmute
    if (muteBtn) {
      muteBtn.addEventListener('click', function () {
        audio.muted = !audio.muted;
        player.classList.toggle('muted', audio.muted);
        muteBtn.setAttribute('aria-label', audio.muted ? 'Unmute' : 'Mute');
        muteBtn.title = audio.muted ? 'Unmute' : 'Mute';
        if (!audio.muted && !audio.paused) fade(audio, audio.volume, TARGET_VOL, 500);
      });
    }

    // Keep UI in sync with real audio state (covers all code paths)
    audio.addEventListener('play', function () {
      player.classList.add('playing');
      playBtn.setAttribute('aria-label', 'Pause music');
      playBtn.title = 'Pause';
      setState('now playing');
    });
    audio.addEventListener('pause', function () {
      player.classList.remove('playing');
      playBtn.setAttribute('aria-label', 'Play music');
      playBtn.title = 'Play';
      setState('paused');
    });
    audio.addEventListener('error', function () { setState('add a song file'); });
  }

  function fade(el, from, to, ms, done) {
    var start = performance.now();
    (function tick(now) {
      var t = Math.min((now - start) / ms, 1);
      el.volume = Math.max(0, Math.min(1, from + (to - from) * t));
      if (t < 1) requestAnimationFrame(tick); else if (done) done();
    })(performance.now());
  }

  // Try to begin playback softly (used when she enters the story).
  // Silently no-ops if there's no audio file or the browser blocks it;
  // she can always use the play button.
  function startAmbienceIfAvailable() {
    if (!audio) return;
    if (!audio.paused) return;
    audio.volume = 0;
    var p = audio.play();
    if (p && p.then) {
      p.then(function () { fade(audio, 0, audio.muted ? 0 : TARGET_VOL, 1400); })
       .catch(function () { /* blocked or missing file; leave UI on 'tap to play' */ });
    }
  }

   
  /* ---------- Auto-start the music ----------
     Browsers block sound from auto-playing until the visitor interacts with
     the page. So we try immediately (works in some cases), and otherwise start
     on her very first interaction anywhere — tap, click, key, or scroll — so it
     feels automatic. */
  if (audio) {
    // 1) optimistic attempt on load
    startAmbienceIfAvailable();

    // 2) guaranteed start on first interaction
    var kickoff = function () {
      startAmbienceIfAvailable();
      window.removeEventListener('pointerdown', kickoff);
      window.removeEventListener('keydown', kickoff);
      window.removeEventListener('touchstart', kickoff);
      window.removeEventListener('scroll', kickoff);
    };
    window.addEventListener('pointerdown', kickoff, { passive: true });
    window.addEventListener('keydown', kickoff);
    window.addEventListener('touchstart', kickoff, { passive: true });
    window.addEventListener('scroll', kickoff, { passive: true });
  }

  /* ============================================================
     QUIZ GATE
     ============================================================ */
  var quiz = document.getElementById('quiz');
  if (quiz) {
    document.body.classList.add('quiz-open');

    var stage = document.getElementById('quizStage');
    var cards = quiz.querySelectorAll('.quiz-card');

    // Questions only Shagun would know. correct = index of the right option.
    var QUESTIONS = [
      {
        q: 'Where did two strangers first start talking?',
        options: ['Instagram DMs', 'Snapchat', 'A dating app', 'Through friends'],
        correct: 1,
        right: 'Snapchat. One random text, and here we are.',
        wrong: 'Close, but it was Snapchat. One random text changed everything.'
      },
      {
        q: 'What year did our story begin?',
        options: ['2017', '2018', '2019', '2020'],
        correct: 2,
        right: 'February 2019. The start of our seven years.',
        wrong: 'It was February 2019, where our seven years began.'
      },
      {
        q: 'What do I call you?',
        options: ['Jaan', 'Sunshine', 'Cutie', 'Shagu'],
        correct: 1,
        right: 'Sunshine. Always and only.',
        wrong: 'You know this one, you are my Sunshine.'
      },
      {
        q: 'Which city did we finally meet in?',
        options: ['Delhi', 'Bengaluru', 'Mumbai', 'Goa'],
        correct: 2,
        right: 'Mumbai. The night everything became real.',
        wrong: 'It was Mumbai, the night everything became real.'
      },
      {
        q: 'Complete our line: "You water me, and ___"',
        options: ['you hold me', 'I water you', 'you keep me', 'I keep you'],
        correct: 1,
        right: 'and I water you. Our four favourite words.',
        wrong: 'and I water you, our four favourite words.'
      },
      {
        q: 'What is the one word for what you give me?',
        options: ['Khushi', 'Sukoon', 'Pyaar', 'Ishq'],
        correct: 1,
        right: 'Sukoon. Peace. That is you, to me.',
        wrong: 'Sukoon, peace. That is exactly what you are to me.'
      }
    ];

    var idx = 0;

    function showCard(step) {
      cards.forEach(function (c) {
        c.classList.toggle('active', c.getAttribute('data-step') === step);
      });
    }

    function renderQuestion() {
      var item = QUESTIONS[idx];
      // progress dots
      var dots = '<div class="quiz-progress">';
      for (var i = 0; i < QUESTIONS.length; i++) {
        var cls = i < idx ? 'done' : (i === idx ? 'current' : '');
        dots += '<span class="' + cls + '"></span>';
      }
      dots += '</div>';

      var opts = '<div class="quiz-options">';
      item.options.forEach(function (o, i) {
        opts += '<button class="quiz-opt" data-i="' + i + '">' + o + '</button>';
      });
      opts += '</div>';

      stage.innerHTML =
        '<div class="quiz-card active" data-step="q">' +
          dots +
          '<p class="quiz-q">' + item.q + '</p>' +
          opts +
          '<p class="quiz-react" id="quizReact"></p>' +
        '</div>';

      // show only the stage card
      cards.forEach(function (c) { c.classList.remove('active'); });

      var react = document.getElementById('quizReact');
      var buttons = stage.querySelectorAll('.quiz-opt');
      buttons.forEach(function (b) {
        b.addEventListener('click', function () {
          var chosen = parseInt(b.getAttribute('data-i'), 10);
          var isRight = chosen === item.correct;
          buttons.forEach(function (x) { x.disabled = true; });
          buttons[item.correct].classList.add('correct');
          if (!isRight) b.classList.add('wrong');
          react.textContent = isRight ? item.right : item.wrong;
          react.classList.add('show');
          burst(isRight ? 10 : 5);
          setTimeout(function () {
            idx++;
            if (idx < QUESTIONS.length) {
              renderQuestion();
            } else {
              finish();
            }
          }, 1500);
        });
      });
    }

    function finish() {
      stage.innerHTML = '';
      var hearts = document.getElementById('quizHearts');
      if (hearts) hearts.textContent = '♥ ♥ ♥';
      showCard('done');
      burst(26);
    }

    function closeQuiz() {
      quiz.classList.add('hidden');
      document.body.classList.remove('quiz-open');
      setTimeout(function () {
        if (quiz && quiz.parentNode) quiz.parentNode.removeChild(quiz);
      }, 900);
      var hero = document.getElementById('hero');
      if (hero) hero.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    quiz.addEventListener('click', function (e) {
      var action = e.target.getAttribute('data-action');
      if (action === 'start') { idx = 0; renderQuestion(); }
      else if (action === 'skip') { closeQuiz(); }
      else if (action === 'enter') {
        startAmbienceIfAvailable(); // her tap counts as the interaction browsers require
        closeQuiz();
      }
    });

    /* tiny heart/sparkle burst */
    function burst(n) {
      if (reduceMotion) return;
      for (var i = 0; i < n; i++) {
        (function () {
          var s = document.createElement('span');
          s.textContent = Math.random() > 0.5 ? '♥' : '✦';
          s.style.cssText =
            'position:fixed;z-index:600;pointer-events:none;' +
            'left:' + (40 + Math.random() * 20) + 'vw;' +
            'top:' + (45 + Math.random() * 15) + 'vh;' +
            'font-size:' + (12 + Math.random() * 18) + 'px;' +
            'color:' + (Math.random() > 0.5 ? '#e9b872' : '#e58a9a') + ';' +
            'opacity:1;transition:transform 1.1s ease-out,opacity 1.1s ease-out;';
          document.body.appendChild(s);
          requestAnimationFrame(function () {
            var dx = (Math.random() - 0.5) * 260;
            var dy = -(80 + Math.random() * 200);
            s.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (Math.random() * 120 - 60) + 'deg)';
            s.style.opacity = '0';
          });
          setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 1200);
        })();
      }
    }
  }

  /* ---------- Subtle hero parallax ---------- */
  if (!reduceMotion) {
    var heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (heroContent && y < window.innerHeight) {
        heroContent.style.transform = 'translateY(' + (y * 0.25) + 'px)';
        heroContent.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.8)));
      }
    }, { passive: true });
  }
})();
