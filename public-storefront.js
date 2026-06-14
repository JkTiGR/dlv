(function attachPublicStorefront(global) {
  "use strict";

  const location = global.location;
  const host = String(location && location.hostname || "").toLowerCase();
  const path = String(location && location.pathname || "");
  const isGithubDlv =
    host === "jktigr.github.io" &&
    (path === "/dlv" || path === "/dlv/" || path.startsWith("/dlv/"));

  const menuUrl = isGithubDlv
    ? `${location.origin}/dlv/menu.html`
    : new URL("menu.html", location.href).toString();

  const isMenuPage = isGithubDlv
    ? /\/menu\.html$/i.test(path)
    : /(?:^|\/)menu\.html$/i.test(path);

  function redirectToMenu() {
    if (!isGithubDlv || isMenuPage) return false;
    if (global.location.href === menuUrl) return false;
    global.location.replace(menuUrl);
    return true;
  }

  function hideElementById(id) {
    const el = global.document.getElementById(id);
    if (!el) return;
    el.hidden = true;
    el.setAttribute("aria-hidden", "true");
    if ("tabIndex" in el) el.tabIndex = -1;
  }

  function restrictMenuChrome() {
    if (!isGithubDlv) return;
    global.document.documentElement.classList.add("public-menu-only");

    [
      "burgerBtn",
      "navHome",
      "navKaraoke",
      "navProfil",
      "navAccount",
      "navOrders",
      "navContact",
      "dockProfil"
    ].forEach(hideElementById);

    const navMenu = global.document.getElementById("navMenu");
    if (navMenu) {
      navMenu.setAttribute("href", "#content");
      navMenu.setAttribute("aria-current", "page");
    }
  }

  global.DRAGON_PUBLIC_STOREFRONT = {
    isGithubDlv,
    isMenuPage,
    menuUrl,
    redirectToMenu,
    restrictMenuChrome
  };

  if (!redirectToMenu()) {
    global.document.addEventListener("DOMContentLoaded", restrictMenuChrome, { once: true });
  }
})(window);
