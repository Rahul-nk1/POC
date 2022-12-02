import { useEffect } from "@discovery/common-tve/lib/hooks";
import { isIOS } from "@discovery/common-tve/lib/device-info";

let lockCount = 0;
let iOSScrollPosY = 0;
const addALock = () => lockCount++;
const removeALock = () => lockCount--;

const iOSLockStart = () => {
  iOSScrollPosY = window.pageYOffset;
  document.body.style.position = "fixed";
  document.body.style.top = `-${iOSScrollPosY}px`;
};

const iOSLockStop = () => {
  document.body.style.removeProperty("position");
  document.body.style.removeProperty("top");
  window.scrollTo(0, iOSScrollPosY);
};

const reactToLockCountChange = () => {
  document.body.classList.toggle("scrollLock", lockCount > 0);

  if (isIOS) {
    const iOSAction = lockCount > 0 ? iOSLockStart : iOSLockStop;
    iOSAction();
  }
};

/**
 * This handles cases where multiple requests for screen lock may occur.
 * lockedWhen is optional. If you do not specify lockedWhen, the lock is applied
 * for the duration of the component's lifecycle.
 */
export const useScrollLock = (lockedWhen = true) => {
  useEffect(() => {
    if (lockedWhen) {
      addALock();
      reactToLockCountChange();
    }
    return () => {
      if (lockedWhen) {
        removeALock();
        reactToLockCountChange();
      }
    };
  }, [lockedWhen]);
};
