import { useRef, useEffect } from "@discovery/common-tve/src/hooks";
import { Keys } from ".";

const tabbableElements =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const useFocusTrapper = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === Keys.Tab) {
        const containedTabbables =
          containerRef.current?.querySelectorAll(tabbableElements) || [];

        const firstTabbable = containedTabbables[0] as HTMLDivElement;
        const lastTabbable = containedTabbables[
          containedTabbables.length - 1
        ] as HTMLDivElement;

        if (e.shiftKey) {
          // if shift key pressed for shift + tab combination
          if (document.activeElement === firstTabbable) {
            lastTabbable?.focus(); // add focus for the last focusable element
            e.preventDefault();
          }
        } else {
          // if tab key is pressed
          if (document.activeElement === lastTabbable) {
            // if focused has reached to last focusable element then focus first focusable element after pressing tab
            firstTabbable?.focus(); // add focus for the first focusable element
            e.preventDefault();
          }
        }
      }
    };

    const onKeyUp = () => {
      const focussed = document.activeElement as HTMLElement;
      if (!containerRef.current?.contains(focussed)) {
        const firstTabbable = containerRef.current?.querySelector(
          tabbableElements
        ) as HTMLDivElement;
        firstTabbable?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return containerRef;
};

type FocusTrapperProps = {
  children(props: ReturnType<typeof useFocusTrapper>): JSX.Element;
};

export const FocusTrapper = ({ children }: FocusTrapperProps) =>
  children(useFocusTrapper());
