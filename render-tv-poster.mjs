import { createRequire } from "module";

const require = createRequire(import.meta.url);
const sharp = require("/Users/ahmadmadani.saaid/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");

const source = new URL("./assets/original-poster.png", import.meta.url).pathname;
const output = new URL("./assets/poster-16x9-tv.png", import.meta.url).pathname;
const width = 1920;
const height = 1080;

const background = await sharp({
  create: {
    width,
    height,
    channels: 4,
    background: "#fff8ea",
  },
})
  .png()
  .toBuffer();

const foreground = await sharp(source)
  .resize({ height, fit: "inside", withoutEnlargement: false })
  .png()
  .toBuffer();

const metadata = await sharp(foreground).metadata();
const posterLeft = Math.round((width - metadata.width) / 2);
const posterTop = Math.round((height - metadata.height) / 2);

await sharp(background)
  .composite([
    { input: foreground, left: posterLeft, top: posterTop },
  ])
  .png()
  .toFile(output);
