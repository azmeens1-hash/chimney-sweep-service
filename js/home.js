// WarmNest Chimney — home.html only
// Testimonial carousel: autoplay with pause on hover/focus, manual arrows + dots,
// respects prefers-reduced-motion by disabling autoplay (controls still work).
// WarmNest Chimney — shared header/footer behaviour
// Shared localStorage keys so every page (and any future dashboard) stays in sync.
var THEME_KEY = 'warmNestTheme';   // 'light' | 'dark'
var DIR_KEY = 'warmNestDir';       // 'ltr' | 'rtl'

(function initThemeAndDirEarly() {
  // Applied before DOMContentLoaded elsewhere would cause a flash; run immediately.
  var savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  var savedDir = localStorage.getItem(DIR_KEY);
  if (savedDir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var navWrap = document.querySelector('.nav-wrap');

  if (toggle && navWrap) {
    toggle.addEventListener('click', function () {
      var isOpen = navWrap.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navWrap.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navWrap.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Mark current page's nav link using a data-page attribute set per page
  var body = document.body;
  var pageKey = body.getAttribute('data-page');
  if (pageKey) {
    document.querySelectorAll('[data-page]').forEach(function (el) {
      if (el !== body && el.getAttribute('data-page') === pageKey) {
        el.setAttribute('aria-current', 'page');
      }
    });
  }

  // Home 1 / Home 2 dropdown
  var dropdownToggle = document.querySelector('.dropdown-toggle');
  var dropdownMenu = document.querySelector('.dropdown-menu');
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdownMenu.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!dropdownMenu.contains(e.target) && e.target !== dropdownToggle) {
        dropdownMenu.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdownMenu.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
    // If either Home page is current, show the dropdown toggle itself as active
    var activeChild = dropdownMenu.querySelector('a[aria-current="page"]');
    if (activeChild) {
      dropdownToggle.setAttribute('aria-current', 'page');
    }
  }

  // Dark / light mode toggle
  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(THEME_KEY, 'light');
        themeBtn.setAttribute('aria-pressed', 'false');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(THEME_KEY, 'dark');
        themeBtn.setAttribute('aria-pressed', 'true');
      }
    });
    themeBtn.setAttribute('aria-pressed', document.documentElement.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
  }

  // RTL / LTR toggle
  var dirBtn = document.querySelector('.rtl-toggle');
  if (dirBtn) {
    var syncDirLabel = function () {
      var isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      dirBtn.textContent = isRtl ? 'LTR' : 'RTL';
      dirBtn.setAttribute('aria-pressed', isRtl ? 'true' : 'false');
    };
    syncDirLabel();
    dirBtn.addEventListener('click', function () {
      var isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      if (isRtl) {
        document.documentElement.removeAttribute('dir');
        localStorage.setItem(DIR_KEY, 'ltr');
      } else {
        document.documentElement.setAttribute('dir', 'rtl');
        localStorage.setItem(DIR_KEY, 'rtl');
      }
      syncDirLabel();
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  var root = document.getElementById('testimonial-carousel');
  if (!root) return;

  var track = document.getElementById('testimonial-track');
  var slides = track.querySelectorAll('.testimonial-slide');
  var dotsWrap = document.getElementById('testimonial-dots');
  var prevBtn = document.getElementById('testimonial-prev');
  var nextBtn = document.getElementById('testimonial-next');
  var status = document.getElementById('testimonial-status');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var current = 0;
  var total = slides.length;
  var autoplayId = null;
  var AUTOPLAY_MS = 6000;

  // Build dots
  var dots = [];
  for (var i = 0; i < total; i++) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1) + ' of ' + total);
    dot.addEventListener('click', (function (index) {
      return function () { goTo(index, true); };
    })(i));
    dotsWrap.appendChild(dot);
    dots.push(dot);
  }

  function render() {
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) {
      d.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
    if (status) {
      status.textContent = 'Testimonial ' + (current + 1) + ' of ' + total;
    }
  }

  function goTo(index, userInitiated) {
    current = (index + total) % total;
    render();
    if (userInitiated) restartAutoplay();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    if (reduceMotion || total <= 1) return;
    stopAutoplay();
    autoplayId = window.setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  prevBtn.addEventListener('click', function () { goTo(current - 1, true); });
  nextBtn.addEventListener('click', function () { goTo(current + 1, true); });

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', startAutoplay);

  render();
  startAutoplay();
});

// Scroll-reveal for card grids (hazard, services, trust, process, stats).
// One shared pattern, staggered per grid, skipped entirely for reduced motion.
document.addEventListener('DOMContentLoaded', function () {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  // Stagger delay based on position among siblings that share the same parent.
  var byParent = new Map();
  revealEls.forEach(function (el) {
    var parent = el.parentElement;
    if (!byParent.has(parent)) byParent.set(parent, []);
    byParent.get(parent).push(el);
  });
  byParent.forEach(function (list) {
    list.forEach(function (el, i) {
      el.style.transitionDelay = (i * 80) + 'ms';
    });
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(function (el) { observer.observe(el); });

  // Safety net: some browsers/screenshot-capture tools don't reliably fire
  // IntersectionObserver callbacks (seen on Edge), which leaves .reveal
  // elements permanently at opacity:0 — the exact "cards missing/blank
  // section" symptom. Force everything visible after a short delay so
  // content is never lost, even if the staggered scroll animation didn't
  // get a chance to run.
  window.setTimeout(function () {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    observer.disconnect();
  }, 1500);
});