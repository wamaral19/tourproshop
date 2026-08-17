#!/usr/bin/env node
/**
 * Deletes withheld photography from the built assets before they're uploaded.
 *
 * Everything under public/ is copied into .open-next/assets and served by
 * Cloudflare's static asset layer, which no page guard sits in front of. Taking
 * a file out of the markup therefore isn't the same as taking it off the site:
 * the original URL stays fetchable by anyone who knows it (docs/going-dark.md
 * § Assets). This closes that for the files in DARK_HIDDEN_MEDIA, so a
 * withheld shot 404s on the public worker.
 *
 * Runs between `opennextjs-cloudflare build` and deploy/upload/preview. Only
 * the locked build has anything to prune — `withheldMedia` returns nothing for
 * a full build, so the password-gated worker still serves every file.
 *
 * It edits the build output, never public/, so the working tree is untouched
 * and the next build starts from the complete set again.
 */
import fs from "node:fs";
import path from "node:path";
import { withheldMedia } from "./dark-media.mjs";

const ROOT = process.cwd();
const ASSETS = path.join(ROOT, ".open-next", "assets");

const withheld = [...withheldMedia(ROOT)];

if (withheld.length === 0) {
  console.log("No withheld media for this build — assets left as built.");
  process.exit(0);
}

if (!fs.existsSync(ASSETS)) {
  console.error(
    `\nCannot prune withheld media: ${path.relative(ROOT, ASSETS)} does not ` +
      `exist.\nRun this after \`opennextjs-cloudflare build\`, not before.\n`,
  );
  process.exit(1);
}

let pruned = 0;
const absent = [];
for (const src of withheld) {
  // `src` is a URL path; on disk it's the literal filename, spaces and all.
  const file = path.join(ASSETS, decodeURIComponent(src));
  if (!fs.existsSync(file)) {
    absent.push(src);
    continue;
  }
  fs.rmSync(file);
  pruned += 1;
}

console.log(`Pruned ${pruned} withheld file(s) from .open-next/assets.`);
if (absent.length > 0) {
  // Not fatal: a path can be listed before its file lands, or after it's moved
  // out of public/ for good. Worth saying out loud either way.
  console.warn(
    `  ${absent.length} withheld path(s) weren't in the build to begin with:`,
  );
  for (const src of absent) console.warn(`    ${src}`);
}
