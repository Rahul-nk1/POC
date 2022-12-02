declare global {
    interface Window {
        dataLayer: {
            push: (x: Record<string, string | number | boolean>) => boolean;
        };
    }
}
export declare const gtmInit: (sessionId?: string | undefined) => boolean;
//# sourceMappingURL=gtm-init.d.ts.map