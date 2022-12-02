import { useEffect, useRef } from "react";
/**
 * Create a hook for tracking _impressions_.
 * @see https://www.marketingterms.com/dictionary/impression/
 *
 * @param options.delay It's good for performance to set a reasonable delay
 * @param options.root Leave unspecified to use the viewport as root
 */
export const mkImpression = (options = {
    threshold: 0.5,
    delay: 50,
}) => {
    const callbackMap = new Map();
    /** Share the IntersectionObserver instead of creating one for each observed target. */
    const observer = new IntersectionObserver((entries, observer) => {
        var _a;
        for (const e of entries) {
            if (e.isIntersecting) {
                (_a = callbackMap.get(e.target)) === null || _a === void 0 ? void 0 : _a(e);
                /** Unobserve after first intersection. */
                observer.unobserve(e.target);
            }
        }
    }, options);
    return function useImpression(callback) {
        /** Not a great pattern, but it makes this more compatible with the previous API... */
        const ref = useRef(null);
        useEffect(() => {
            const target = ref.current;
            if (target == null)
                return;
            if (callbackMap.has(target)) {
                console.warn("useImpression: Already observing", target);
                return;
            }
            callbackMap.set(target, callback);
            observer.observe(target);
            return () => {
                observer.unobserve(target);
                callbackMap.delete(target);
            };
        }, [ref, callback]);
        return ref;
    };
};
export const useImpression = mkImpression();
//# sourceMappingURL=use-impression.js.map