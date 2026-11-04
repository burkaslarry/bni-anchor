import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(__dirname, "..");
const publicImages = path.join(webRoot, "public", "images");
const repoImages = path.join(webRoot, "..", "images");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

if (!fs.existsSync(repoImages)) {
  console.warn("prepare-public: repo images/ not found, skipping copy");
  process.exit(0);
}

if (fs.existsSync(publicImages)) {
  const stat = fs.lstatSync(publicImages);
  if (stat.isSymbolicLink()) fs.unlinkSync(publicImages);
}

copyDir(repoImages, publicImages);
console.log("prepare-public: copied images to public/images");
