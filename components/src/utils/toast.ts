import { useEffect, useState } from "@discovery/common-tve/lib/hooks";

const ttl = 3000;

export enum ToastPriority {
  Default = 0,
  High = 1,
}

let _toast: JSX.Element | string = "";
let _priority = ToastPriority.Default;
let timer: ReturnType<typeof setTimeout>;

const listeners = new Set<(arg0: string | JSX.Element) => void>();
const broadcast = () => listeners.forEach((listener) => listener(_toast));

/** This is not a hook, it can be used in any scope */
export const setToast = (
  toast: JSX.Element | string,
  priority: ToastPriority = ToastPriority.Default
) => {
  if (priority >= _priority) {
    clearTimeout(timer);
    _toast = toast;
    _priority = priority;
    broadcast();

    timer = setTimeout(() => {
      // Clear current toast then broadcast
      _toast = "";
      _priority = ToastPriority.Default;
      broadcast();
    }, ttl);
  }
};

/**
 * This hook supplies updates to the toast messages. It is likely only consumed
 * in the UI Toaster component.
 */
export const useReadToast = () => {
  const [toast, setToast] = useState(_toast);

  useEffect(() => {
    // Create a new listener and add
    const listener = (newToast: string | JSX.Element) => setToast(newToast);
    listeners.add(listener);

    return () => {
      // Remove the listener
      listeners.delete(listener);
    };
  }, []);

  return toast;
};
