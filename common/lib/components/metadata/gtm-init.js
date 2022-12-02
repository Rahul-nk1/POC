import { getAnalyticsSessionState } from "@discovery/dni-central-auth-analytics-session-data";
export const gtmInit = (sessionId) => {
    if ("dataLayer" in window && window.dataLayer) {
        const pushed = window.dataLayer.push({
            "client-session-id": sessionId !== null && sessionId !== void 0 ? sessionId : getAnalyticsSessionState().id,
        });
        return (pushed &&
            window.dataLayer.push({
                event: "adtech-ready",
                label: true,
            }));
    }
    return false;
};
//# sourceMappingURL=gtm-init.js.map