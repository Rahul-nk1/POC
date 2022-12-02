import { getAnalyticsSessionState } from "@discovery/dni-central-auth-analytics-session-data";

declare global {
  interface Window {
    dataLayer: {
      push: (x: Record<string, string | number | boolean>) => boolean;
    };
  }
}

export const gtmInit = (sessionId?: string) => {
  if ("dataLayer" in window && window.dataLayer) {
    const pushed = window.dataLayer.push({
      "client-session-id": sessionId ?? getAnalyticsSessionState().id,
    });

    return (
      pushed &&
      window.dataLayer.push({
        event: "adtech-ready",
        label: true,
      })
    );
  }

  return false;
};
