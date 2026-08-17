/**
 * The withheld-photography list, read out of lib/dark-media.ts for the build
 * scripts.
 *
 * Same trick as scripts/check-lockdown-coverage.mjs reading the lockdown
 * allowlist: the list lives with the code that renders from it, and the scripts
 * parse the literal rather than keeping a second copy that could drift.
 */
import fs from "node:fs";
import path from "node:path";
import { resolveSiteMode } from "./site-mode.mjs";

/** @returns {string[]} every `src` path listed in DARK_HIDDEN_MEDIA. */
export function readDarkHiddenMedia(root = process.cwd()) {
  const src = fs.readFileSync(path.join(root, "lib", "dark-media.ts"), "utf8");
  const match = src.match(/const DARK_HIDDEN_MEDIA[^=]*=\s*\[([\s\S]*?)\];/);
  if (!match) {
    throw new Error(
      "Could not read DARK_HIDDEN_MEDIA out of lib/dark-media.ts — did the " +
        "declaration change shape?",
    );
  }
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

/**
 * The paths actually withheld from the build being produced: the list while
 * locked down, nothing at all in the full build, which is the whole point of
 * the lever.
 *
 * @returns {Set<string>}
 */
export function withheldMedia(root = process.cwd(), env = process.env) {
  if (!resolveSiteMode(env).lockdown) return new Set();
  return new Set(readDarkHiddenMedia(root));
}
