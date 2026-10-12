// Light or Night. The visitor's own choice, if they've made one in this browser; otherwise Night, the default.
// Loads in each page's <head>, before anything paints, so a page never flashes the other theme. Every page's
// stylesheet keys Night to <html data-theme="dark">, which only this file sets (the markup starts there too,
// for anyone without scripts).
//
// The toggle is a button in each page's markup (<button class="theme-toggle">): the last item of the header's
// menu, and in the speaker notes' foot. Its sun or moon comes from site.css, keyed to the theme, so nothing
// appears late. This file says whether it's pressed, and saves a press.
(function () {
  var KEY = "first-builds-theme";
  var root = document.documentElement;
  var unsaved = null;   // a choice made in a private window, where nothing can be saved: kept for this page only

  function chosen() {
    if (unsaved) return unsaved;
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function theme() {
    return chosen() === "light" ? "light" : "dark";
  }

  function apply() {
    var t = theme();
    if (root.getAttribute("data-theme") !== t) {
      // One frame without transitions, so every color changes at once instead of some easing and some not
      root.classList.add("theme-switching");
      root.setAttribute("data-theme", t);
      requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove("theme-switching"); }); });
    }
    var buttons = document.querySelectorAll(".theme-toggle");
    for (var i = 0; i < buttons.length; i++) buttons[i].setAttribute("aria-pressed", String(t === "dark"));
  }

  function press() {
    var next = theme() === "dark" ? "light" : "dark";
    try { localStorage.setItem(KEY, next); unsaved = null; } catch (e) { unsaved = next; }
    apply();
  }

  apply();
  window.addEventListener("storage", function (event) { if (event.key === KEY) apply(); });   // a choice made in another tab, like the notes window
  document.addEventListener("DOMContentLoaded", function () {
    var buttons = document.querySelectorAll(".theme-toggle");
    for (var i = 0; i < buttons.length; i++) buttons[i].addEventListener("click", press);
    apply();
  });
})();
