"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackPageView } from "@/lib/meta-pixel";

/**
 * Fires a Meta Pixel PageView on client-side route changes. The initial page
 * load is already tracked by the inline init script in the root layout, so we
 * skip the first render here to avoid double-counting that first view.
 */
export function MetaPixelEvents() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackPageView();
  }, [pathname]);

  return null;
}
