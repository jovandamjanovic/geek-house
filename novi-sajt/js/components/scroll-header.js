// Adds scrolled state to the header.

export function initScrollHeader() {
  const header = document.querySelector(".header");

  if (!header) return false;

  function toggleHeaderState() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }

  toggleHeaderState();

  window.addEventListener("scroll", toggleHeaderState, { passive: true });

  return true;
}