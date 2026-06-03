// Scroll-to-top button.

export function initScrollTop() {
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  if (!scrollToTopBtn) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("show");
      } else {
        scrollToTopBtn.classList.remove("show");
      }
    },
    { passive: true }
  );

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}