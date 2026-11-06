import { setActiveMenu } from "./components/header.js";
import { setupMobileNav } from "./components/mobile-nav.js";
import { initScrollHeader } from "./components/scroll-header.js";
import { initOpenStatus } from "./components/open-status.js";
import { initLightbox } from "./components/lightbox.js";
import { initScrollTop } from "./components/scroll-top.js";

import { loadPartial } from "./utils/partials.js";

import { initAtmosferaSlideshow } from "./pages/home.js";
import { initGameSearch, initGameModal, initFeaturedCards } from "./pages/igre.js";
import { initCustomTopicSelect, initContactForm, prefillContactFromURL } from "./pages/kontakt.js";
import { initShopPage } from "./pages/shop.js";

async function init() {
  // Load shared partials.
  await loadPartial("site-header", "partials/header.html");
  await loadPartial("site-footer", "partials/footer.html");

  // Header.
  setupMobileNav();
  setActiveMenu();
  initScrollHeader();

  // Shared UI.
  initScrollTop();
  initLightbox();
  initOpenStatus();

  // Page modules.
  initAtmosferaSlideshow();

  initGameSearch();
  initGameModal();
  initFeaturedCards();

  initContactForm();
  prefillContactFromURL();
  initCustomTopicSelect();

  initShopPage();

  // Footer year.
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

init();