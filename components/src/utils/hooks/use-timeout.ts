import { useState, useRef, useEffect } from "@discovery/common-tve/lib/hooks";

type UseTimeout = {
  startTimeout: () => void;
  clearTimeout: () => void;
  isTimeoutActive: boolean;
};

/**
 * A setTimeout hook that calls a callback after a timeout duration
 * @param callback The callback to be invoked after timeout
 * @param duration Amount of time in ms after which to invoke
 */
export const useTimeout = (callback: () => void, duration = 0): UseTimeout => {
  const [isTimeoutActive, setIsTimeoutActive] = useState(false);
  const savedRefCallback = useRef<() => void>(() => {});

  useEffect(() => {
    savedRefCallback.current = callback;
  }, [callback]);

  const callbackFn = () => {
    savedRefCallback.current?.();
    clearTimeout();
  };

  const clearTimeout = () => setIsTimeoutActive(false);
  const startTimeout = () => setIsTimeoutActive(true);

  useEffect(() => {
    if (isTimeoutActive) {
      const timeout = window.setTimeout(callbackFn, duration);
      return () => {
        window.clearTimeout(timeout);
      };
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimeoutActive]);
  return {
    clearTimeout,
    startTimeout,
    isTimeoutActive,
  };
};
