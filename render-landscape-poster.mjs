import { createRequire } from "module";
import { writeFile } from "fs/promises";

const require = createRequire(import.meta.url);
const sharp = require("/Users/ahmadmadani.saaid/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");

const svgPath = new URL("./assets/poster-16x9-landscape.svg", import.meta.url).pathname;
const pngPath = new URL("./assets/poster-16x9-landscape.png", import.meta.url).pathname;
const width = 1920;
const height = 1080;

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const text = (value, x, y, options = {}) => {
  const {
    size = 32,
    fill = "#111827",
    weight = 800,
    anchor = "start",
    family = "Arial Rounded MT Bold, Arial, sans-serif",
    letterSpacing = 0,
  } = options;

  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${letterSpacing}">${esc(value)}</text>`;
};

const lines = (items, x, y, options = {}) =>
  items
    .map((item, index) =>
      text(item, x, y + index * (options.lineHeight ?? options.size * 1.18), options)
    )
    .join("");

const rounded = (x, y, w, h, fill, stroke, sw = 3, dash = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${dash ? `stroke-dasharray="${dash}"` : ""}/>`;

const star = (cx, cy, r, fill = "#ffd22e") => {
  const points = [];
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? r : r * 0.44;
    points.push(`${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`);
  }
  return `<polygon points="${points.join(" ")}" fill="${fill}" stroke="#f5a400" stroke-width="3"/>`;
};

const badge = (n, x, y, fill) => `
  <circle cx="${x}" cy="${y}" r="38" fill="${fill}" stroke="rgba(255,255,255,.8)" stroke-width="5"/>
  ${text(n, x, y + 13, { size: 44, fill: "#fff", anchor: "middle", weight: 900 })}
`;

const cardTitle = (n, title, x, y, color) => `
  ${badge(n, x + 50, y + 56, color)}
  ${lines(title, x + 100, y + 44, { size: 29, fill: color, weight: 900, lineHeight: 32 })}
`;

const pill = (x, y, w, label, color, icon = "star") => {
  const shape =
    icon === "cone"
      ? `<polygon points="${x + 22},${y + 11} ${x + 40},${y + 45} ${x + 4},${y + 45}" fill="#ff6b00"/>`
      : icon === "flag"
        ? `<rect x="${x + 8}" y="${y + 13}" width="30" height="26" fill="#111827"/><rect x="${x + 8}" y="${y + 13}" width="15" height="13" fill="#fff"/><line x1="${x + 8}" y1="${y + 10}" x2="${x + 8}" y2="${y + 48}" stroke="#6b7280" stroke-width="5"/>`
        : icon === "puzzle"
          ? `<rect x="${x + 8}" y="${y + 13}" width="32" height="32" rx="7" fill="#2094ff"/>`
          : star(x + 24, y + 29, 22);
  return `
    <rect x="${x}" y="${y}" width="${w}" height="50" rx="15" fill="${color}" opacity=".18"/>
    ${shape}
    ${text(label, x + 58, y + 34, { size: 23, fill: "#171717", weight: 800 })}
  `;
};

const choice = (x, y, label, color, icon) => {
  const iconMarkup =
    icon === "robot"
      ? `<rect x="${x + 33}" y="${y + 9}" width="48" height="43" rx="12" fill="#28c7e8" stroke="#0369a1" stroke-width="3"/><circle cx="${x + 49}" cy="${y + 31}" r="5" fill="#111"/><circle cx="${x + 66}" cy="${y + 31}" r="5" fill="#111"/><line x1="${x + 57}" y1="${y + 7}" x2="${x + 57}" y2="${y - 7}" stroke="#0369a1" stroke-width="4"/><circle cx="${x + 57}" cy="${y - 10}" r="6" fill="#86efac"/>`
      : icon === "hero"
        ? `<circle cx="${x + 57}" cy="${y + 32}" r="30" fill="#ffbf7a"/><path d="M${x + 27} ${y + 62} Q${x + 57} ${y + 42} ${x + 87} ${y + 62}" fill="#2563eb"/><rect x="${x + 33}" y="${y + 24}" width="48" height="13" rx="7" fill="#0f172a"/>`
        : icon === "monster"
          ? `<path d="M${x + 28} ${y + 48} Q${x + 30} ${y + 7} ${x + 57} ${y + 7} Q${x + 84} ${y + 7} ${x + 86} ${y + 48} Q${x + 86} ${y + 74} ${x + 57} ${y + 74} Q${x + 28} ${y + 74} ${x + 28} ${y + 48}Z" fill="#7ac943"/><circle cx="${x + 57}" cy="${y + 33}" r="13" fill="#fff"/><circle cx="${x + 57}" cy="${y + 33}" r="6" fill="#111"/>`
          : icon === "cupcake"
            ? `<path d="M${x + 31} ${y + 36} Q${x + 57} ${y + 5} ${x + 83} ${y + 36}" fill="#ffd1e6"/><rect x="${x + 37}" y="${y + 36}" width="41" height="36" rx="8" fill="#d98945"/>`
            : icon === "person"
              ? `<circle cx="${x + 57}" cy="${y + 31}" r="28" fill="#ffbf7a"/><path d="M${x + 31} ${y + 26} Q${x + 57} ${y + 1} ${x + 83} ${y + 26}" fill="#6b341c"/><path d="M${x + 27} ${y + 72} Q${x + 57} ${y + 49} ${x + 87} ${y + 72}" fill="#32c765"/>`
              : `<circle cx="${x + 57}" cy="${y + 36}" r="30" fill="${color}"/><path d="M${x + 34} ${y + 20} L${x + 19} ${y + 8} L${x + 25} ${y + 31}" fill="${color}"/><path d="M${x + 80} ${y + 20} L${x + 95} ${y + 8} L${x + 89} ${y + 31}" fill="${color}"/><circle cx="${x + 48}" cy="${y + 35}" r="5" fill="#111"/><circle cx="${x + 66}" cy="${y + 35}" r="5" fill="#111"/><path d="M${x + 48} ${y + 49} Q${x + 57} ${y + 57} ${x + 66} ${y + 49}" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>`;

  return `
    <g>
      ${iconMarkup}
      ${text(label, x + 57, y + 99, { size: 17, fill: "#172070", anchor: "middle", weight: 900 })}
    </g>
  `;
};

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity=".12"/>
    </filter>
    <linearGradient id="warm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fffdf4"/>
      <stop offset="1" stop-color="#fff2cf"/>
    </linearGradient>
  </defs>

  <rect width="1920" height="1080" fill="url(#warm)"/>
  ${star(125, 70, 28)}
  ${star(1740, 80, 30)}
  ${star(1620, 1010, 20)}
  ${star(90, 1010, 20)}
  <circle cx="145" cy="190" r="78" fill="#36c86b" opacity=".2"/>
  <circle cx="1785" cy="190" r="78" fill="#ff8a00" opacity=".17"/>

  <g filter="url(#shadow)">
    <path d="M625 28 H1295 Q1334 28 1344 62 L1295 96 H625 L576 62 Q586 28 625 28Z" fill="#6b46c1"/>
    ${text("BRING YOUR KID DAY", 960, 76, { size: 42, fill: "#fff", anchor: "middle", weight: 900 })}
  </g>

  <g>
    <rect x="74" y="65" width="145" height="96" rx="42" fill="#4f62d7" stroke="#243a9b" stroke-width="5" transform="rotate(-12 146 113)"/>
    <circle cx="174" cy="104" r="10" fill="#ffd33d"/>
    <circle cx="196" cy="122" r="10" fill="#ffd33d"/>
    <rect x="105" y="105" width="54" height="14" rx="7" fill="#ffd33d" transform="rotate(-12 132 112)"/>
    <rect x="125" y="85" width="14" height="54" rx="7" fill="#ffd33d" transform="rotate(-12 132 112)"/>
    <path d="M1720 57 H1838 L1817 143 H1741Z" fill="#ffca28" stroke="#f59e0b" stroke-width="6"/>
    <path d="M1718 75 Q1668 75 1687 132 Q1698 165 1734 151" fill="none" stroke="#f59e0b" stroke-width="12"/>
    <path d="M1838 75 Q1888 75 1869 132 Q1858 165 1822 151" fill="none" stroke="#f59e0b" stroke-width="12"/>
    ${star(1779, 105, 33, "#ffb300")}
  </g>

  ${text("BUILD A GAME", 960, 158, { size: 84, fill: "#125ac6", anchor: "middle", weight: 900 })}
  ${text("WITH", 800, 224, { size: 48, fill: "#6b46c1", anchor: "middle", weight: 900 })}
  <rect x="870" y="181" width="330" height="64" rx="25" fill="#4338ca"/>
  ${text("CODEX", 1035, 230, { size: 58, fill: "#fff", anchor: "middle", weight: 900 })}
  <rect x="595" y="252" width="730" height="58" rx="21" fill="#fff1a8" stroke="#f5bd24" stroke-width="3" stroke-dasharray="8 7"/>
  ${text("Pick a character, imagine your game, and build it together with your parent!", 960, 290, { size: 29, fill: "#172070", anchor: "middle", weight: 900 })}

  <g filter="url(#shadow)">
    ${rounded(40, 320, 590, 270, "#f5fbff", "#2d9cff", 3, "9 7")}
    ${cardTitle("1", ["CHOOSE YOUR", "CHARACTER"], 40, 320, "#1c70d8")}
    ${lines(["Pick a character for your game.", "It could be:"], 170, 425, { size: 23, fill: "#111", weight: 800, lineHeight: 29 })}
    ${choice(76, 476, "AN ANIMAL", "#ff9f1c", "cat")}
    ${choice(244, 476, "A ROBOT", "#22d3ee", "robot")}
    ${choice(412, 476, "A SUPERHERO", "#2563eb", "hero")}

    ${rounded(665, 320, 590, 270, "#f8fff0", "#71bf36", 3, "9 7")}
    ${cardTitle("2", ["DECIDE THE", "GAME IDEA"], 665, 320, "#48a808")}
    ${lines(["Think about what your character", "needs to do. For example:"], 795, 425, { size: 23, fill: "#111", weight: 800, lineHeight: 29 })}
    ${pill(790, 488, 410, "Collect stars", "#8bc34a", "star")}
    ${pill(790, 542, 410, "Avoid obstacles", "#8bc34a", "cone")}

    ${rounded(1290, 320, 590, 270, "#fff7f7", "#ff557d", 3, "9 7")}
    ${cardTitle("3", ["TELL CODEX", "WHAT TO BUILD"], 1290, 320, "#ee4266")}
    ${lines(["With your parent, write a simple", "instruction for Codex."], 1420, 425, { size: 23, fill: "#111", weight: 800, lineHeight: 29 })}
    <path d="M1408 486 H1832 Q1850 486 1850 504 V564 Q1850 582 1832 582 H1462 L1428 610 V582 H1408 Q1390 582 1390 564 V504 Q1390 486 1408 486Z" fill="#fff" stroke="#2d9cff" stroke-width="5"/>
    ${lines(["Build a game where a cat", "collects stars and avoids dogs."], 1428, 529, { size: 25, fill: "#172070", weight: 900, lineHeight: 31 })}
  </g>

  <g filter="url(#shadow)">
    ${rounded(40, 620, 590, 250, "#fbf8ff", "#8b5cf6", 3, "9 7")}
    ${cardTitle("4", ["TEST THE GAME"], 40, 620, "#6b46c1")}
    ${lines(["Play the game and see what happens!"], 170, 714, { size: 23, fill: "#111", weight: 800 })}
    <rect x="82" y="750" width="505" height="92" rx="16" fill="#66c7ff"/>
    <rect x="82" y="815" width="505" height="27" fill="#20b65b"/>
    <rect x="100" y="766" width="86" height="42" rx="10" fill="#1767bd"/>
    ${text("SCORE", 143, 785, { size: 17, fill: "#fff", anchor: "middle", weight: 900 })}
    ${text("120", 143, 806, { size: 23, fill: "#fff", anchor: "middle", weight: 900 })}
    ${star(330, 795, 28)}
    <circle cx="214" cy="808" r="32" fill="#ff9f1c"/>
    <circle cx="205" cy="800" r="5" fill="#111"/><circle cx="224" cy="800" r="5" fill="#111"/>

    ${rounded(665, 620, 590, 250, "#fff8ef", "#ff8a00", 3, "9 7")}
    ${cardTitle("5", ["MAKE IT BETTER"], 665, 620, "#ff6b00")}
    ${lines(["Ask Codex to add new things, like:"], 795, 714, { size: 23, fill: "#111", weight: 800 })}
    ${pill(790, 750, 410, "More characters", "#ffcc80", "puzzle")}
    ${pill(790, 805, 410, "Sound effects", "#ffcc80", "flag")}

    ${rounded(1290, 620, 590, 250, "#f0ffff", "#15b8c8", 3, "9 7")}
    ${cardTitle("6", ["SHOW YOUR GAME!"], 1290, 620, "#0ea5a8")}
    ${lines(["Show your game to others", "and tell them:"], 1420, 714, { size: 23, fill: "#111", weight: 800, lineHeight: 29 })}
    <rect x="1405" y="770" width="385" height="45" rx="18" fill="#fff" stroke="#31bfd3" stroke-width="3"/>
    ${text("Who your character is", 1475, 800, { size: 20, fill: "#111", weight: 800 })}
    <rect x="1405" y="825" width="385" height="45" rx="18" fill="#fff" stroke="#31bfd3" stroke-width="3"/>
    ${text("What the goal of the game is", 1475, 855, { size: 20, fill: "#111", weight: 800 })}
  </g>

  <g filter="url(#shadow)">
    <rect x="40" y="898" width="710" height="118" rx="25" fill="#fff" stroke="#9d73dc" stroke-width="3" stroke-dasharray="9 7"/>
    <rect x="40" y="898" width="710" height="42" rx="25" fill="#8b5cf6"/>
    ${text("PARENT ROLE", 395, 928, { size: 27, fill: "#fff", anchor: "middle", weight: 900 })}
    <circle cx="82" cy="960" r="15" fill="#4caf14"/><path d="M74 959 L81 967 L93 952" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    ${text("Help your child describe their idea clearly", 110, 968, { size: 19, fill: "#172070", weight: 800 })}
    <circle cx="82" cy="995" r="15" fill="#4caf14"/><path d="M74 994 L81 1002 L93 987" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    ${text("Type the instructions in Codex and test together", 110, 1003, { size: 19, fill: "#172070", weight: 800 })}

    <rect x="790" y="898" width="1090" height="118" rx="25" fill="#e7f7ff" stroke="#38bdf8" stroke-width="3"/>
    <rect x="870" y="910" width="330" height="38" rx="16" fill="#1267bd"/>
    ${text("EXAMPLE PROMPT", 1035, 937, { size: 24, fill: "#fff", anchor: "middle", weight: 900 })}
    ${lines(["Create a simple game where a dragon flies through the sky collecting gems", "and avoiding clouds. Add a score counter and a fun background."], 835, 973, { size: 23, fill: "#172070", weight: 800, lineHeight: 29 })}
    <path d="M1728 934 Q1798 916 1840 964 Q1798 1007 1728 990 Q1672 973 1728 934Z" fill="#ff6b00" stroke="#c2410c" stroke-width="4"/>
    <circle cx="1765" cy="955" r="8" fill="#111"/>
    ${star(1700, 1007, 16, "#38bdf8")}
  </g>

  <rect x="0" y="1032" width="1920" height="48" fill="#0757b8"/>
  ${star(320, 1056, 18)}
  ${text("BE CREATIVE. HAVE FUN. BUILD YOUR GAME TOGETHER!", 960, 1065, { size: 32, fill: "#fff", anchor: "middle", weight: 900 })}
  ${star(1600, 1056, 18)}
</svg>`;

await writeFile(svgPath, svg);
await sharp(Buffer.from(svg)).png().toFile(pngPath);
