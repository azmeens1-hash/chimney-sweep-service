/* ==========================================================================
   WarmNest Chimney — Chimney Sweeping service detail page script
   Handles: mobile hamburger menu, Home dropdown, dark-mode toggle,
   RTL toggle, and the scroll-reveal animation for .reveal elements.
   Self-contained — does not depend on home.js.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- mobile hamburger menu ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navWrap = document.getElementById("primary-nav");

  function closeNav() {
    if (!navToggle || !navWrap) return;
    navToggle.setAttribute("aria-expanded", "false");
    navWrap.classList.remove("open");
  }

  function openNav() {
    if (!navToggle || !navWrap) return;
    navToggle.setAttribute("aria-expanded", "true");
    navWrap.classList.add("open");
  }

  if (navToggle && navWrap) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close the mobile menu once a nav link is followed.
    navWrap.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* ---------- Home dropdown (Home 1 / Home 2) ---------- */
  var dropdownToggle = document.querySelector(".dropdown-toggle");
  var dropdownMenu = document.querySelector(".dropdown-menu");

  function closeDropdown() {
    if (!dropdownToggle || !dropdownMenu) return;
    dropdownToggle.setAttribute("aria-expanded", "false");
    dropdownMenu.classList.remove("open");
  }

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", function (event) {
      event.stopPropagation();
      var isOpen = dropdownToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeDropdown();
      } else {
        dropdownToggle.setAttribute("aria-expanded", "true");
        dropdownMenu.classList.add("open");
      }
    });

    // Close the dropdown on outside click or Escape.
    document.addEventListener("click", function (event) {
      if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
        closeDropdown();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeDropdown();
        closeNav();
      }
    });
  }

  /* ---------- dark mode toggle ---------- */
  var THEME_KEY = "warmNestTheme";
  var themeToggle = document.querySelector(".theme-toggle");

  function syncThemeButton() {
    if (!themeToggle) return;
    var isDark = root.getAttribute("data-theme") === "dark";
    themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
  }

  if (themeToggle) {
    syncThemeButton();
    themeToggle.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      if (isDark) {
        root.removeAttribute("data-theme");
        localStorage.setItem(THEME_KEY, "light");
      } else {
        root.setAttribute("data-theme", "dark");
        localStorage.setItem(THEME_KEY, "dark");
      }
      syncThemeButton();
    });
  }

  /* ---------- RTL toggle ---------- */
  var DIR_KEY = "warmNestDir";
  var rtlToggle = document.querySelector(".rtl-toggle");

  function syncRtlButton() {
    if (!rtlToggle) return;
    var isRtl = root.getAttribute("dir") === "rtl";
    rtlToggle.setAttribute("aria-pressed", isRtl ? "true" : "false");
  }

  if (rtlToggle) {
    syncRtlButton();
    rtlToggle.addEventListener("click", function () {
      var isRtl = root.getAttribute("dir") === "rtl";
      if (isRtl) {
        root.removeAttribute("dir");
        localStorage.setItem(DIR_KEY, "ltr");
      } else {
        root.setAttribute("dir", "rtl");
        localStorage.setItem(DIR_KEY, "rtl");
      }
      syncRtlButton();
    });
  }

  /* ---------- scroll-reveal animation ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      // No IntersectionObserver support — just show everything.
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }
})();