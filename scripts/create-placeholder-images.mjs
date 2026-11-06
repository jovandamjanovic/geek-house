import fs from "fs";
import path from "path";

const root = path.resolve(".");
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC",
  "base64",
);

const images = [
  "logo.png",
  "atmosfera.webp",
  "atmosfera-1.webp",
  "atmosfera-2.webp",
  "o-klubu.webp",
  "dungeon.webp",
  "ravenloft.webp",
  "aleksandria.webp",
  "bivsa-arkada.webp",
  "igre.webp",
  "igre-1.webp",
  "igre-2.webp",
];

const imagesDir = path.join(root, "public/irena/images");
const assetsDir = path.join(root, "public/irena/assets");
fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });

for (const name of images) {
  fs.writeFileSync(path.join(imagesDir, name), png);
}
fs.writeFileSync(path.join(assetsDir, "favicon.png"), png);
console.log(`Created ${images.length + 1} placeholder images`);
