// Atmosfera section background slideshow.

export function initAtmosferaSlideshow() {
  const atmosfera = document.querySelector(".atmosfera");

  if (!atmosfera) return;

  const images = [
    "images/atmosfera.webp",
    "images/atmosfera-1.webp",
    "images/atmosfera-2.webp",
  ];

  let currentImage = 0;

  function setBackground(image) {
    atmosfera.style.backgroundImage = `
      linear-gradient(
        to bottom,
        rgba(8, 20, 35, 0.35),
        rgba(8, 20, 35, 0.75)
      ),
      url("${image}")
    `;
  }

  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  setBackground(images[currentImage]);

  setInterval(() => {
    currentImage = (currentImage + 1) % images.length;
    setBackground(images[currentImage]);
  }, 3000);
}