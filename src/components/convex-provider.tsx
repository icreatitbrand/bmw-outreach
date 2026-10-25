"use client";

import { useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

/**
 * Guards against a missing deployment. When NEXT_PUBLIC_CONVEX_URL is not
 * set (as before first `npx convex dev`), children render without Convex
 * and the form surfaces a friendly "not configured" message on submit.
 */
export function ConvexProviderBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;

  const client = useMemo(() => {
    if (!url) return null;
    try {
      return new ConvexReactClient(url);
    } catch {
      console.error("[convex] invalid NEXT_PUBLIC_CONVEX_URL");
      return null;
    }
  }, [url]);

  if (client) {
    return <ConvexProvider client={client}>{children}</ConvexProvider>;
  }
  return <>{children}</>;
}
