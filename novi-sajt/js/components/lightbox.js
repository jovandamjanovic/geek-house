// Image lightbox for room photos.

export function initLightbox() {
  const lightbox = document.getElementById("imageLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeButton = document.querySelector(".lightbox-close");

  if (!lightbox || !lightboxImg || !closeButton) return;

  function openLightbox(image) {
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt || "Pregled slike";
    lightbox.classList.remove("hidden");
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightboxImg.src = "";
  }

  document.querySelectorAll(".room-image").forEach((image) => {
    image.addEventListener("click", () => {
      openLightbox(image);
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.classList.contains("hidden")) {
      closeLightbox();
    }
  });
}