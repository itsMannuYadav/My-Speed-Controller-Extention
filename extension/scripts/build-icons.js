// Rasterizes icons/icon.svg into the PNG sizes Chrome/Edge require for a MV3
// extension. Runs at build time only — sharp is a devDependency, the shipped
// extension contains plain PNGs, no image-processing runtime weight.
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const svgPath = path.join(root, "icons", "icon.svg");
const outDir = path.join(root, "dist", "icons");

const sizes = [16, 32, 48, 128];

async function main() {
  await mkdir(outDir, { recursive: true });
  const svg = readFileSync(svgPath);
  await Promise.all(
    sizes.map((size) =>
      sharp(svg, { density: 384 })
        .resize(size, size)
        .png()
        .toFile(path.join(outDir, `icon${size}.png`))
    )
  );
  console.log(`[icons] wrote ${sizes.length} sizes to ${path.relative(root, outDir)}`);
}

main().catch((err) => {
  console.error("[icons] failed:", err);
  process.exit(1);
});
