declare global {
    /**
     * IntersectionObserver v2 extensions, all optional as not all browsers support these yet.
     * @see https://developers.google.com/web/updates/2019/02/intersectionobserver-v2
     */
    interface IntersectionObserverEntry {
        isVisible?: boolean;
    }
    interface IntersectionObserverInit {
        delay?: number;
        trackVisibility?: boolean;
    }
}
declare type ImpressionCallback = (e: Omit<IntersectionObserverEntry, "target">) => void;
/**
 * Create a hook for tracking _impressions_.
 * @see https://www.marketingterms.com/dictionary/impression/
 *
 * @param options.delay It's good for performance to set a reasonable delay
 * @param options.root Leave unspecified to use the viewport as root
 */
export declare const mkImpression: (options?: IntersectionObserverInit) => <E extends Element>(callback: ImpressionCallback) => import("react").RefObject<E>;
export declare const useImpression: <E extends Element>(callback: ImpressionCallback) => import("react").RefObject<E>;
export {};
//# sourceMappingURL=use-impression.d.ts.map