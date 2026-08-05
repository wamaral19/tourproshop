// Typed helpers around the Meta Pixel (`fbq`) global that the inline init
// script in app/layout.tsx installs. Every function no-ops safely if the pixel
// hasn't loaded yet (SSR, ad-blockers, before hydration).

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type TrackParams = Record<string, unknown>;

/** Fire a standard Meta Pixel event. No-ops if the pixel isn't available. */
export function fbTrack(event: string, params?: TrackParams) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

/**
 * The site's primary conversion: an email / waitlist signup. Fired from every
 * interest-capture form on success. `params` can carry Meta's optional custom
 * data (e.g. `content_name`, `content_category`) for reporting and optimization.
 */
export function trackLead(params?: TrackParams) {
  fbTrack("Lead", params);
}

/** Re-fire PageView on client-side (SPA) navigation. */
export function trackPageView() {
  fbTrack("PageView");
}
