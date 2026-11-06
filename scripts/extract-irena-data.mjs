import fs from "fs";
import path from "path";

const root = path.resolve(".");

// Extract games from igre.html
const html = fs.readFileSync(path.join(root, "novi-sajt/igre.html"), "utf8");
const games = [];
const parts = html.split('<div class="category">');
parts.shift();

for (const part of parts) {
  const catMatch = part.match(/<h3 class="category-title">([^<]+)<\/h3>/);
  if (!catMatch) continue;
  const category = catMatch[1].trim();
  const re =
    /<div class="game-card"[^>]*data-title="([^"]+)"[^>]*data-meta="([^"]+)"[^>]*data-desc="([^"]+)"[^>]*data-tags="([^"]+)"[^>]*>[\s\S]*?<h4>([^<]+)<\/h4>/g;
  let m;
  while ((m = re.exec(part)) !== null) {
    games.push({
      title: m[1],
      meta: m[2],
      description: m[3],
      tags: m[4].split(",").map((t) => t.trim()),
      category,
      displayTitle: m[5],
    });
  }
}

const dataDir = path.join(root, "src/app/irena/data");
fs.mkdirSync(dataDir, { recursive: true });

const gamesTs = `export interface Game {
  title: string;
  meta: string;
  description: string;
  tags: string[];
  category: string;
  displayTitle: string;
}

export const GAMES: Game[] = ${JSON.stringify(games, null, 2)};
`;

fs.writeFileSync(path.join(dataDir, "games.ts"), gamesTs);
console.log(`Extracted ${games.length} games`);

// Scope global CSS
function scopeGlobalCss(content) {
  return content
    .replace(/^:root/gm, ".irena-site")
    .replace(/^html,\s*\nbody/gm, ".irena-site")
    .replace(/^html\s*\{/gm, ".irena-site {")
    .replace(/^body\s*\{/gm, ".irena-site {")
    .replace(/body\.nav-open/g, ".irena-site.nav-open")
    .replace(/url\("\.\.\/images\//g, 'url("/irena/images/')
    .replace(/url\("images\//g, 'url("/irena/images/');
}

const stylesDir = path.join(root, "src/app/irena/styles/pages");
fs.mkdirSync(stylesDir, { recursive: true });

const globalCss = fs.readFileSync(
  path.join(root, "novi-sajt/css/global.css"),
  "utf8",
);
fs.writeFileSync(
  path.join(root, "src/app/irena/styles/global.css"),
  scopeGlobalCss(globalCss),
);

const pageCssFiles = fs.readdirSync(path.join(root, "novi-sajt/css/pages"));
for (const file of pageCssFiles) {
  let css = fs.readFileSync(
    path.join(root, "novi-sajt/css/pages", file),
    "utf8",
  );
  css = css
    .replace(/url\("\.\.\/images\//g, 'url("/irena/images/')
    .replace(/url\("images\//g, 'url("/irena/images/');
  fs.writeFileSync(path.join(stylesDir, file), css);
}

console.log(`Copied ${pageCssFiles.length} page CSS files`);
