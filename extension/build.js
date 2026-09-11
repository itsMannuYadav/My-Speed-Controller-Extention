// Build script for the SpeedPilot extension. No framework — esbuild bundles each
// surface (background/content/popup/options/sidepanel) as a standalone IIFE, then
// static HTML/CSS/manifest/icons are copied alongside into dist/, which is what you
// point "Load unpacked" at in chrome://extensions or edge://extensions.
import * as esbuild from "esbuild";
import { rm, mkdir, cp } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const dist = path.join(root, "dist");

const args = process.argv.slice(2);
const watch = args.includes("--watch");
const production = args.includes("--mode=production") || !args.includes("--mode=development");

/** @type {Record<string,string>} entry name -> source file */
const entries = {
  background: "src/background/service-worker.ts",
  content: "src/content/content-script.ts",
  popup: "src/popup/popup.ts",
  options: "src/options/options.ts",
  sidepanel: "src/sidepanel/sidepanel.ts",
};

const staticFiles = [
  ["manifest.json", "manifest.json"],
  ["src/styles/tokens.css", "tokens.css"],
  ["src/popup/popup.html", "popup.html"],
  ["src/popup/popup.css", "popup.css"],
  ["src/options/options.html", "options.html"],
  ["src/options/options.css", "options.css"],
  ["src/sidepanel/sidepanel.html", "sidepanel.html"],
  ["src/sidepanel/sidepanel.css", "sidepanel.css"],
];

async function cleanDist() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
}

async function copyStatic() {
  await Promise.all(
    staticFiles.map(([from, to]) => cp(path.join(root, from), path.join(dist, to)))
  );
}

async function buildIcons() {
  await import("./scripts/build-icons.js");
}

async function run() {
  await cleanDist();

  const buildOptions = {
    entryPoints: Object.entries(entries).map(([name, entry]) => ({ in: path.join(root, entry), out: name })),
    bundle: true,
    outdir: dist,
    format: "iife",
    target: "es2021",
    platform: "browser",
    sourcemap: production ? false : "inline",
    minify: production,
    logLevel: "info",
    define: {
      "process.env.NODE_ENV": JSON.stringify(production ? "production" : "development"),
    },
  };

  if (watch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    await copyStatic();
    await buildIcons();
    console.log("[build] watching for changes… (static files/icons are copied once; re-run dev for those)");
  } else {
    await esbuild.build(buildOptions);
    await copyStatic();
    await buildIcons();
    console.log(`[build] done → ${path.relative(process.cwd(), dist)}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
