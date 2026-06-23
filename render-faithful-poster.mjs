import { createRequire } from "module";

const require = createRequire(import.meta.url);
const sharp = require("/Users/ahmadmadani.saaid/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");

const source = new URL("./assets/original-poster.png", import.meta.url).pathname;
const output = new URL("./assets/poster-16x9-faithful.png", import.meta.url).pathname;
const width = 1920;
const height = 1080;

const star = (cx, cy, r, fill = "#ffd53d") => {
  const points = [];
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? r : r * 0.45;
    points.push(`${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`);
  }
  return `<polygon points="${points.join(" ")}" fill="${fill}" stroke="#f5a400" stroke-width="4"/>`;
};

const background = Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="leftGlow" cx="30%" cy="35%" r="70%">
        <stop offset="0" stop-color="#fffef7"/>
        <stop offset="1" stop-color="#fff5dd"/>
      </radialGradient>
      <radialGradient id="rightGlow" cx="70%" cy="35%" r="70%">
        <stop offset="0" stop-color="#fffef7"/>
        <stop offset="1" stop-color="#fff1d7"/>
      </radialGradient>
      <filter id="softShadow">
        <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#6b341c" flood-opacity=".16"/>
      </filter>
    </defs>
    <rect width="960" height="1080" fill="url(#leftGlow)"/>
    <rect x="960" width="960" height="1080" fill="url(#rightGlow)"/>
    <circle cx="138" cy="190" r="88" fill="#e3f5ff"/>
    <circle cx="356" cy="430" r="90" fill="#fff0b8" opacity=".65"/>
    <circle cx="1710" cy="185" r="96" fill="#fff0b8" opacity=".75"/>
    <circle cx="1580" cy="705" r="98" fill="#dff7ff" opacity=".72"/>
    ${star(98, 70, 28)}
    ${star(480, 92, 24)}
    ${star(520, 290, 18)}
    ${star(1410, 96, 24)}
    ${star(1810, 355, 21)}
    ${star(1688, 995, 24)}
    ${star(230, 985, 24)}
    <rect x="586" y="0" width="748" height="1080" fill="#fffaf0" filter="url(#softShadow)"/>
  </svg>
`);

const base = await sharp(background).png().toBuffer();

const fullPoster = await sharp(source)
  .resize({ height, fit: "inside", withoutEnlargement: false })
  .png()
  .toBuffer();

const posterMeta = await sharp(fullPoster).metadata();
const posterLeft = Math.round((width - posterMeta.width) / 2);
const posterTop = Math.round((height - posterMeta.height) / 2);

await sharp(base)
  .composite([
    { input: fullPoster, left: posterLeft, top: posterTop },
  ])
  .png()
  .toFile(output);
