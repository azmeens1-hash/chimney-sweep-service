// WarmNest Chimney — home-2.html only
var THEME_KEY = 'warmNestTheme';
var DIR_KEY = 'warmNestDir';

(function initThemeAndDirEarly() {
  var savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  var savedDir = localStorage.getItem(DIR_KEY);
  if (savedDir === 'rtl') document.documentElement.setAttribute('dir', 'rtl');
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

  var body = document.body;
  var pageKey = body.getAttribute('data-page');
  if (pageKey) {
    document.querySelectorAll('[data-page]').forEach(function (el) {
      if (el !== body && el.getAttribute('data-page') === pageKey) {
        el.setAttribute('aria-current', 'page');
      }
    });
  }

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
    var activeChild = dropdownMenu.querySelector('a[aria-current="page"]');
    if (activeChild) dropdownToggle.setAttribute('aria-current', 'page');
  }

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

// Generic fade-up reveal (quote cards, CTA) — same pattern as the rest of the site.
document.addEventListener('DOMContentLoaded', function () {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var byParent = new Map();
    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      if (!byParent.has(parent)) byParent.set(parent, []);
      byParent.get(parent).push(el);
    });
    byParent.forEach(function (list) {
      list.forEach(function (el, i) { el.style.transitionDelay = (i * 80) + 'ms'; });
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
  }
});

// Animated count-up for the "Real Results" stat numbers.
document.addEventListener('DOMContentLoaded', function () {
  var counters = document.querySelectorAll('.counter-value');
  if (!counters.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    if (reduceMotion) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    var duration = 1200;
    var start = null;
    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = target * eased;
      el.textContent = current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(function (el) { observer.observe(el); });
});