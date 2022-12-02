import { useEffect, useRef } from "@discovery/common-tve/lib/hooks";

export const useClickOutside = (handleClickOutside: () => void) => {
  const containerEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerEl.current?.contains(e.target as Node)) {
        handleClickOutside();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [handleClickOutside]);

  return containerEl;
};
