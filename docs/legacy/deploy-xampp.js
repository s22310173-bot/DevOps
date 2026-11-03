import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const HTDOCS = process.env.HTDOCS || "C:/xampp/htdocs";
// Folder build TERPISAH dari folder source di htdocs, supaya source
// (src/, server/, .env) tidak pernah bisa diakses lewat HTTP.
const TARGET_NAME = "prjocetdevops-app";
const target = join(HTDOCS, TARGET_NAME);
const dist = new URL("../dist", import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  "$1",
);

if (!existsSync(dist)) {
  console.error(`Build tidak ditemukan: ${dist}`);
  console.error("Jalankan `npm run build` terlebih dahulu.");
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(dist, target, { recursive: true });

console.log(`Frontend dideploy ke ${target}`);
console.log(`Buka: http://localhost/${TARGET_NAME}/`);
