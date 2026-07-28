// Generates the PWA icons in public/icons from an inline SVG. Run once (or after
// changing the artwork): node scripts/generate-icons.mjs (requires devDep sharp).
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "icons");

// Amber full-bleed tile with a dark fridge, open door revealing a lit interior.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#f2a93b"/>
  <rect x="146" y="86" width="220" height="340" rx="28" fill="#1a1512"/>
  <rect x="166" y="106" width="180" height="130" rx="12" fill="#f5eee3"/>
  <rect x="166" y="252" width="180" height="154" rx="12" fill="#322a21"/>
  <rect x="182" y="122" width="34" height="44" rx="8" fill="#96c26e"/>
  <rect x="226" y="122" width="52" height="30" rx="8" fill="#e07b56"/>
  <rect x="182" y="176" width="148" height="14" rx="7" fill="#d9cdb8"/>
  <rect x="182" y="200" width="112" height="14" rx="7" fill="#d9cdb8"/>
  <rect x="330" y="270" width="14" height="86" rx="7" fill="#f2a93b"/>
</svg>`;

await mkdir(outDir, { recursive: true });
const buf = Buffer.from(svg);
await sharp(buf).resize(192, 192).png().toFile(path.join(outDir, "icon-192.png"));
await sharp(buf).resize(512, 512).png().toFile(path.join(outDir, "icon-512.png"));
await sharp(buf)
  .resize(512, 512)
  .png()
  .toFile(path.join(outDir, "icon-maskable-512.png"));
console.log("icons written to public/icons");
