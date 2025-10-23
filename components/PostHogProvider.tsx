"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Skip PostHog initialization if in development mode
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("test")) {
      return;
    }

    // Initialize PostHog
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST as string,
    });
  }, []);

  return <>{children}</>;
}
