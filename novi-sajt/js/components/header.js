// Active menu state.

export function setActiveMenu() {
  const filename = (window.location.pathname.split("/").pop() || "").toLowerCase();

  const pages = [
    "o-klubu",
    "rezervacija",
    "dogadjaji",
    "igre",
    "shop",
    "blog",
    "kontakt",
  ];

  let activePage = "index";

  const matchedPage = pages.find((page) => filename.includes(page));

  if (matchedPage) {
    activePage = matchedPage;
  }

  document.querySelectorAll(".menu a[data-page]").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === activePage);
  });
}