#!/usr/bin/env node
/**
 * Audits the repo for references to players who are supposed to be dark.
 *
 * Most surfaces drop a hidden player automatically: the storefront reads the
 * catalog, and the marketing pages read the chains in lib/marketing-assets.ts.
 * What neither covers is prose, one-off pitch pages, and files on disk whose
 * *names* carry a player's name. This is the net for those.
 *
 * Run it after adding a slug to HIDDEN_PLAYERS:
 *
 *   npm run audit:dark
 *
 * Exit code 1 means something still names a dark player and needs a human
 * decision — usually rewriting a sentence or deleting an asset. It is not wired
 * into `npm run build` on purpose: a failing audit should stop a person, not a
 * deploy that might be shipping the takedown itself.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

/** Directories worth scanning. node_modules/.next/.git are never interesting. */
const CODE_DIRS = ["app", "components", "lib", "data", "docs", "scripts"];
const ASSET_DIRS = ["public"];

/** Files that legitimately name every player and must not be flagged. */
const ALLOWED_FILES = new Set([
  "data/owgr.json",
  "lib/players.ts",
  "lib/player-image-map.generated.ts",
  "lib/player-images.ts",
  "lib/products.ts",
  "lib/sponsors.ts",
  "lib/marketing-assets.ts",
  "scripts/audit-dark-players.mjs",
  "scripts/generate-player-image-map.mjs",
  "docs/going-dark.md",
  // The roster schema doc: its worked example is a real roster row by nature,
  // and it is a repo file, not a public surface.
  "data/README.md",
  // Build artifact. It maps original asset paths to their published /media/
  // URLs, so it necessarily contains the names — but it is gitignored and never
  // rendered; only the opaque right-hand side reaches the browser.
  "lib/media-map.generated.ts",
]);

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(join(ROOT, dir));
  } catch {
    return out;
  }
  for (const entry of entries) {
    const rel = join(dir, entry);
    const stat = statSync(join(ROOT, rel));
    if (stat.isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}

/** Reads HIDDEN_PLAYERS out of lib/players.ts without importing TypeScript. */
function readHiddenSlugs() {
  const src = readFileSync(join(ROOT, "lib/players.ts"), "utf8");
  const block = src.match(
    /HIDDEN_PLAYERS[^=]*=\s*new Set\(\s*\[([\s\S]*?)\]\s*\)/,
  );
  if (!block) throw new Error("Could not find HIDDEN_PLAYERS in lib/players.ts");
  return [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

/** Reads every player's display name out of the roster, keyed by slug. */
function readRosterNames() {
  const roster = JSON.parse(readFileSync(join(ROOT, "data/owgr.json"), "utf8"));
  const byslug = new Map();
  for (const player of roster.players ?? []) byslug.set(player.slug, player.name);
  return byslug;
}

/** Lowercase, letters and digits only. Collapses "Sung Jae Im Polo" and
 *  "sungjae-im" onto the same string so spacing choices in filenames can't
 *  hide an asset from the audit. */
function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Every spelling of a player worth grepping for: the slug, the name, and the
 * surname on its own — which is what catches prose like "Cam Young" and folders
 * like "Cam Young Polo" that never spell the full roster name.
 *
 * The surname alone will occasionally match something unrelated (a dark Justin
 * Rose would flag the word "rose"). That is the right trade for an audit: a
 * false positive costs a glance, a miss costs a player's name staying up.
 */
function needlesFor(slug, name) {
  const needles = new Set([slug, slug.replace(/-/g, " ")]);
  if (name) {
    needles.add(name);
    const surname = name.split(" ").slice(1).join(" ");
    if (surname.length >= 5) needles.add(surname);
  }
  return [...needles].filter((n) => n.length >= 5);
}

const hidden = readHiddenSlugs();
if (hidden.length === 0) {
  console.log("No players in HIDDEN_PLAYERS — nothing to audit.");
  process.exit(0);
}

const names = readRosterNames();
const codeFiles = CODE_DIRS.flatMap((d) => walk(d)).filter((f) =>
  /\.(ts|tsx|js|mjs|json|md|css)$/.test(f),
);
const assetFiles = ASSET_DIRS.flatMap((d) => walk(d));

/**
 * A file is "gated" when it already consults the hidden-player state itself —
 * it imports isPlayerHidden, or renders through a marketing-asset chain. Those
 * files mention dark players on purpose (a tagged gallery item, a pitch page
 * that 404s itself) and drop them at render time, so they are reported for
 * review rather than counted as failures. Everything else naming a dark player
 * is a real edit somebody has to make.
 */
const GATE_MARKERS = ["isPlayerHidden", "pickLiveImage", "pickLiveImages"];

function isGated(text) {
  return GATE_MARKERS.some((marker) => text.includes(marker));
}

const findings = [];

for (const slug of hidden) {
  const name = names.get(slug);
  const needles = needlesFor(slug, name);
  const label = name ? `${name} (${slug})` : slug;

  for (const file of codeFiles) {
    if (ALLOWED_FILES.has(file)) continue;
    const text = readFileSync(join(ROOT, file), "utf8");
    const kind = isGated(text) ? "gated" : "code";
    text.split("\n").forEach((line, i) => {
      for (const needle of needles) {
        if (line.toLowerCase().includes(needle.toLowerCase())) {
          findings.push({
            kind,
            label,
            where: `${file}:${i + 1}`,
            detail: line.trim().slice(0, 120),
          });
          return;
        }
      }
    });
  }

  const normalizedNeedles = needles.map(normalize);
  for (const file of assetFiles) {
    const haystack = normalize(file);
    if (normalizedNeedles.some((needle) => haystack.includes(needle))) {
      findings.push({ kind: "asset", label, where: file, detail: "" });
    }
  }
}

console.log(`Dark players: ${hidden.join(", ")}\n`);

if (findings.length === 0) {
  console.log("Clean — nothing in the repo names a dark player.");
  process.exit(0);
}

const code = findings.filter((f) => f.kind === "code");
const gated = findings.filter((f) => f.kind === "gated");
const assets = findings.filter((f) => f.kind === "asset");

if (code.length > 0) {
  console.log(`NEEDS AN EDIT — code and copy naming a dark player (${code.length}):`);
  for (const f of code) console.log(`  ${f.where}  [${f.label}]  ${f.detail}`);
  console.log("");
}

if (gated.length > 0) {
  const files = [...new Set(gated.map((f) => f.where.split(":")[0]))];
  console.log(
    `Handled automatically — these files drop dark players at render time (${files.length}):`,
  );
  for (const file of files) console.log(`  ${file}`);
  console.log("");
}

if (assets.length > 0) {
  const byLabel = new Map();
  for (const f of assets) {
    if (!byLabel.has(f.label)) byLabel.set(f.label, []);
    byLabel.get(f.label).push(f.where);
  }
  console.log(`Files on disk whose path names a dark player (${assets.length}):`);
  for (const [label, files] of byLabel) {
    console.log(`  [${label}] ${files.length} files, e.g.`);
    for (const file of files.slice(0, 3)) console.log(`    ${file}`);
  }
  console.log(
    "\n  These are unreferenced once the pages above are clean, but the URLs stay",
  );
  console.log(
    "  publicly fetchable by anyone who knows them. See docs/going-dark.md.",
  );
  console.log("");
}

if (code.length > 0) {
  console.log("Audit failed — resolve the references above, then re-run.");
  process.exit(1);
}

console.log("No code changes needed. Review the asset list above if this is a");
console.log("rights-holder takedown rather than a routine delisting.");
process.exit(0);
