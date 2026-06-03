// Mobile navigation menu.

export function setupMobileNav() {
  const toggleButton = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".menu");
  const backdrop = document.querySelector(".nav-backdrop");

  if (!toggleButton || !menu || !backdrop) return;

  function openNav() {
    document.body.classList.add("nav-open");
    backdrop.hidden = false;
    toggleButton.setAttribute("aria-expanded", "true");
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    backdrop.hidden = true;
    toggleButton.setAttribute("aria-expanded", "false");
  }

  toggleButton.addEventListener("click", () => {
    if (document.body.classList.contains("nav-open")) {
      closeNav();
    } else {
      openNav();
    }
  });

  backdrop.addEventListener("click", closeNav);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeNav();
    }
  });
}