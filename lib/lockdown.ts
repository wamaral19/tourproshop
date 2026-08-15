import { redirect } from "next/navigation";
import { LOCKDOWN } from "./site-mode";

/**
 * Sends a visitor to the coming-soon notice while the site is locked down.
 *
 * Call this first in any page that must not serve during a lockdown. It is a
 * no-op with the flag off, so guarded pages behave normally the rest of the
 * time.
 *
 * This used to live in `proxy.ts` as a single edge-side allowlist, which was
 * the better design — one chokepoint, and pages added later were dark by
 * default. It can't be: Next 16 runs Proxy on the Node.js runtime and refuses
 * the `runtime` config option, and @opennextjs/cloudflare rejects Node
 * middleware outright, so the deploy fails at bundle time.
 *
 * `scripts/check-lockdown-coverage.mjs` restores the safety the allowlist gave
 * us — it fails the build if a page is neither on the allowlist nor guarded
 * here, so a new page still can't quietly serve during a lockdown.
 */
export function enforceLockdown(): void {
  if (LOCKDOWN) redirect("/");
}
