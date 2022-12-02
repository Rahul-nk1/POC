import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import composeRefs from "@seznam/compose-react-refs";
import { useState, useCallback } from "@discovery/common-tve/lib/hooks";

import { Portal, PortalIds } from "@discovery/components-tve/src/utils/portals";
import { readInt } from "@discovery/components-tve/src/utils/number";
import { useScrollLock } from "@discovery/components-tve/src/utils/hooks/use-scroll-lock";
import { useClickOutside } from "@discovery/components-tve/src/utils/hooks/use-click-outside";
import { useDragController } from "./drag-controller";

import * as styles from "./styles.css";

const portalTransitionTime = M.fromMaybe(readInt(styles.transitionTime), 200);

export const BottomDrawer = ({
  close,
  children,
}: {
  children: JSX.Element | JSX.Element[];
  close: () => void;
}) => {
  useScrollLock();
  const [hide, setHide] = useState(false);

  /* Trigger the hide transition, then close the portal */
  const hideThenClose = useCallback(() => {
    setHide(true);
    setTimeout(close, portalTransitionTime);
  }, [close]);

  const drawerContainerRef = useClickOutside(hideThenClose);

  const [dragContainerRef, dragHandleRef, isDragging] = useDragController(
    close
  );

  return (
    <Portal id={PortalIds.BottomDrawer}>
      <>
        <div
          className={cn(styles.overlay, { [styles.hide]: hide })}
          onClick={hideThenClose}
        />
        <div
          ref={composeRefs(drawerContainerRef, dragContainerRef)}
          className={cn(styles.bottomDrawer, {
            [styles.hide]: hide,
            [styles.transition]: !isDragging,
          })}
        >
          <div className={styles.dragHandle} ref={dragHandleRef} />

          <div className={styles.drawerContent}>{children}</div>
        </div>
      </>
    </Portal>
  );
};
