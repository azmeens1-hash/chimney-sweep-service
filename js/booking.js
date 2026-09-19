/* ==========================================================================
   WarmNest Chimney — Booking page script
   No header/nav on this page, so besides the theme/RTL corner toggles,
   this only handles the booking form's validation and success state.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;

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

  /* ---------- booking form ---------- */
  var form = document.getElementById("booking-form");
  var successPanel = document.getElementById("booking-success");

  if (form && successPanel) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // No backend wired up yet — swap the form for a success message.
      form.hidden = true;
      successPanel.hidden = false;
      successPanel.focus();
    });
  }
})();