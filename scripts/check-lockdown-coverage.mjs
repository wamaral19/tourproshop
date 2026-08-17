#!/usr/bin/env node
/**
 * Fails the build if a page could serve during a lockdown without being meant to.
 *
 * Lockdown was originally one edge-side allowlist in proxy.ts, which made pages
 * added later dark by default. That isn't available on this stack — Next 16 runs
 * Proxy on the Node.js runtime and won't let it opt back to Edge, and
 * @opennextjs/cloudflare refuses to bundle Node middleware.
 *
 * Enforcement moved into the pages themselves (lib/lockdown.ts), which loses the
 * default. This check puts it back at build time: every app/**\/page.tsx must be
 * either on the allowlist in lib/site-mode.ts or call enforceLockdown(). A new
 * page that is neither stops the build instead of quietly serving.
 */
import fs from "node:fs";
import path from "node:path";
import { resolveSiteMode } from "./site-mode.mjs";

const ROOT = process.cwd();

function lockdownOn() {
  return resolveSiteMode().lockdown;
}

/** Route path for an app-router page file. */
function routeFor(file) {
  const route = file
    .replace(/^app/, "")
    .replace(/\/page\.tsx$/, "")
    .replace(/\/\([^/]+\)/g, ""); // route groups don't affect the URL
  return route === "" ? "/" : route;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(path.join(ROOT, dir))) {
    const rel = path.join(dir, entry);
    if (fs.statSync(path.join(ROOT, rel)).isDirectory()) walk(rel, out);
    else if (entry === "page.tsx") out.push(rel);
  }
  return out;
}

function allowlist() {
  const src = fs.readFileSync(path.join(ROOT, "lib", "site-mode.ts"), "utf8");
  const exact = src.match(/const ALLOWED_EXACT[^=]*=\s*\[([\s\S]*?)\];/);
  const prefixes = src.match(/const ALLOWED_PREFIXES[^=]*=\s*\[([\s\S]*?)\];/);
  const read = (m) => (m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : []);
  return { exact: read(exact), prefixes: read(prefixes) };
}

if (!lockdownOn()) {
  console.log("Lockdown is off — page coverage not enforced.");
  process.exit(0);
}

const { exact, prefixes } = allowlist();
const offenders = [];

for (const file of walk("app")) {
  const route = routeFor(file);
  // Dynamic segments can't be matched against a literal allowlist; they must
  // guard themselves.
  const isDynamic = route.includes("[");
  const allowed =
    !isDynamic &&
    (exact.includes(route) || prefixes.some((p) => route.startsWith(p)));
  if (allowed) continue;
  const src = fs.readFileSync(path.join(ROOT, file), "utf8");
  if (src.includes("enforceLockdown()")) continue;
  offenders.push({ file, route });
}

if (offenders.length > 0) {
  console.error(
    "\nLockdown coverage check failed. These pages would serve while the site is\n" +
      "locked down, and are neither on the allowlist in lib/site-mode.ts nor\n" +
      "calling enforceLockdown() from lib/lockdown.ts:\n",
  );
  for (const o of offenders) console.error(`  ${o.route.padEnd(24)} ${o.file}`);
  console.error(
    "\nAdd the route to ALLOWED_EXACT if it should stay up, or call\n" +
      "enforceLockdown() as the first statement of its component if it shouldn't.\n",
  );
  process.exit(1);
}

console.log("Lockdown coverage OK — every page is allowlisted or guarded.");
