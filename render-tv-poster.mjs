import { createRequire } from "module";

const require = createRequire(import.meta.url);
const sharp = require("/Users/ahmadmadani.saaid/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");

const source = new URL("./assets/original-poster.png", import.meta.url).pathname;
const output = new URL("./assets/poster-16x9-tv.png", import.meta.url).pathname;
const width = 1920;
const height = 1080;

const backgroundOverlay = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="rgba(255,255,255,0.26)"/>
    <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="8"/>
  </svg>
`);

const background = await sharp(source)
  .resize(width, height, { fit: "cover" })
  .blur(28)
  .modulate({ brightness: 0.92, saturation: 1.08 })
  .composite([{ input: backgroundOverlay }])
  .png()
  .toBuffer();

const foreground = await sharp(source)
  .resize({ height: 980, fit: "inside", withoutEnlargement: false })
  .png()
  .toBuffer();

const metadata = await sharp(foreground).metadata();
const posterLeft = Math.round((width - metadata.width) / 2);
const posterTop = Math.round((height - metadata.height) / 2);

const shadow = Buffer.from(`
  <svg width="${metadata.width + 80}" height="${metadata.height + 80}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="blur"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>
    <rect x="40" y="40" width="${metadata.width}" height="${metadata.height}" rx="18" fill="black" opacity="0.24" filter="url(#blur)"/>
  </svg>
`);

await sharp(background)
  .composite([
    { input: shadow, left: posterLeft - 40, top: posterTop - 40 },
    { input: foreground, left: posterLeft, top: posterTop },
  ])
  .png()
  .toFile(output);
