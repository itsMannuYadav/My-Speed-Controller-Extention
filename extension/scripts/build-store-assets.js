// Generates the Chrome Web Store / Edge Add-ons listing graphics from icons/icon.svg:
//   store/promo-small-440x280.png, store/promo-marquee-1400x560.png, store-logo-300.png
import sharp from "sharp";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const icon = readFileSync(path.join(root, "icons/icon.svg"), "utf8");
const inner = icon.slice(icon.indexOf("<defs>"), icon.lastIndexOf("</svg>"));
const tpl = readFileSync(path.join(root, "store/promo.svg.tpl"), "utf8");

function fill(vars) {
  let s = tpl;
  for (const [k, v] of Object.entries(vars).sort((a, b) => b[0].length - a[0].length)) s = s.split(k).join(String(v));
  return s;
}

const small = { W: 440, H: 280, IX: 36, IY: 76, IS: 1.0, TX: 176, TY: 128, TY2: 160, TY3: 200, FS: 40, FS2: 15, FS3: 11, HY1: 40, HY2: 238, HY3: 252, WS1: 120, WS2: 90, WS3: 150, ICON: inner };
const marquee = { W: 1400, H: 560, IX: 150, IY: 150, IS: 2.0, TX: 450, TY: 290, TY2: 350, TY3: 420, FS: 110, FS2: 38, FS3: 22, HY1: 90, HY2: 480, HY3: 510, WS1: 300, WS2: 220, WS3: 380, ICON: inner };

await sharp(Buffer.from(fill(small))).png().toFile(path.join(root, "store/promo-small-440x280.png"));
await sharp(Buffer.from(fill(marquee))).png().toFile(path.join(root, "store/promo-marquee-1400x560.png"));
await sharp(Buffer.from(icon), { density: 600 }).resize(300, 300).png().toFile(path.join(root, "store-logo-300.png"));
console.log("[store] assets written");
