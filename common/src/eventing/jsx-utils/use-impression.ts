import { useEffect, useRef } from "react";

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

type ImpressionCallback = (
  e: Omit<IntersectionObserverEntry, "target">
) => void;

/**
 * Create a hook for tracking _impressions_.
 * @see https://www.marketingterms.com/dictionary/impression/
 *
 * @param options.delay It's good for performance to set a reasonable delay
 * @param options.root Leave unspecified to use the viewport as root
 */
export const mkImpression = (
  options: IntersectionObserverInit = {
    threshold: 0.5,
    delay: 50, // 3 frames
  }
) => {
  const callbackMap = new Map<Element, ImpressionCallback>();
  /** Share the IntersectionObserver instead of creating one for each observed target. */
  const observer = new IntersectionObserver((entries, observer) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        callbackMap.get(e.target)?.(e);
        /** Unobserve after first intersection. */
        observer.unobserve(e.target);
      }
    }
  }, options);

  return function useImpression<E extends Element>(
    callback: ImpressionCallback
  ) {
    /** Not a great pattern, but it makes this more compatible with the previous API... */
    const ref = useRef<E>(null);

    useEffect(() => {
      const target = ref.current;
      if (target == null) return;
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
