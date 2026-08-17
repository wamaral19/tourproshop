/**
 * Resolves the build-time site flags from the environment.
 *
 * One codebase, two deploys: the public worker builds locked down, and the
 * password-gated worker builds the full storefront. Which one you get is chosen
 * here, at build time, not at runtime — see scripts/generate-site-mode.mjs for
 * why that distinction matters.
 *
 * Shared by the generator and by the build checks so they can never disagree
 * about which build is being produced.
 *
 * Locked is the default for an unset environment. That is deliberate: a build
 * that forgets to say what it is comes out dark, not naked.
 */

/**
 * @param {Record<string, string | undefined>} [env]
 * @returns {{ mode: "locked" | "full", lockdown: boolean, hidePlayerNames: boolean, preview: boolean }}
 */
export function resolveSiteMode(env = process.env) {
  const mode = env.SITE_MODE === "full" ? "full" : "locked";
  const lockdown = mode === "locked";
  return {
    mode,
    lockdown,
    // Lockdown implies hidden names; the full build can still opt into hiding
    // them on its own, which is what happens when the storefront comes back
    // before the naming rights do.
    hidePlayerNames: lockdown || env.HIDE_PLAYER_NAMES === "true",
    // Marks the build as the password-gated one. Keeps the Meta Pixel and the
    // indexers off it, and is separate from `mode` because a full build could
    // one day be the public one.
    preview: env.SITE_PREVIEW === "true",
  };
}
