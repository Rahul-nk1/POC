import * as M from "@discovery/prelude/lib/data/maybe";
import {
  useEffect,
  useCallback,
  useRef,
  useState,
} from "@discovery/common-tve/lib/hooks";

import { readInt } from "../../../../utils/number";
import * as styles from "./styles.css";

const portalTransitionTime = M.fromMaybe(readInt(styles.transitionTime), 200);

enum DragState {
  Rest,
  SnapToVisible,
  SnapToHidden,
}

const getEventY = (event: TouchEvent) => event.targetTouches[0]?.clientY;

/**
 * This drag controller creates the refs that are needed for the drag animations
 * This could be reworked to use GSAP's draggable plugin.
 *
 * A global GSAP timeline would be a great way to remove animation stutters when
 * there are multiple animations on the screen at once, e.g. when the hero
 * transitions at the same time as the drawer is revealed. Because GSAP is good
 * at handling multiple animations responsibly.
 */
export const useDragController = (close: () => void) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragState, setDragState] = useState(DragState.Rest);

  /**
   * The below refs are used for animations and we don't need to update state
   * and cause re-renders, and we don't want to redefine these functions
   * over and over again when their values change.
   *
   * The animationRequestPending flag is used to block animation requests if
   * one is pending, so we don't cause unnecessary DOM paints or renders.
   */
  const animationRequestPending = useRef(false);
  const _isDragging = useRef(false);

  const touchOffset = useRef(0);
  const translateY = useRef(0);
  const startingY = useRef(0);

  const setPortalY = useCallback((y: string) => {
    const container = containerRef?.current;
    if (container) {
      animationRequestPending.current = true;
      window.requestAnimationFrame(() => {
        container.style.transform = `translateY(${y})`;
        animationRequestPending.current = false;
      });
    }
  }, []);

  /* Touch Start */
  const dragStart = useCallback((event: TouchEvent) => {
    const container = containerRef?.current;
    const eventY = getEventY(event);
    if (container && eventY !== undefined) {
      _isDragging.current = true;
      startingY.current = window.innerHeight - container.offsetHeight;
      touchOffset.current = eventY - startingY.current;
      setIsDragging(true);
    }
  }, []);

  /* Touch Move */
  const move = useCallback(
    (event: TouchEvent) => {
      const eventY = getEventY(event);
      if (
        _isDragging.current &&
        !animationRequestPending.current &&
        eventY !== undefined
      ) {
        const y = eventY - startingY.current - touchOffset.current;

        if (y > 0) {
          animationRequestPending.current = true;
          translateY.current = y;
          setPortalY(`${y}px`);
        }
      }
    },
    [setPortalY]
  );

  /* Touch End */
  const drop = useCallback(() => {
    const container = containerRef?.current;
    if (_isDragging.current && container) {
      const y = translateY.current;
      const height = container.offsetHeight;

      const keepOpen = y < height / 2;
      setDragState(keepOpen ? DragState.SnapToVisible : DragState.SnapToHidden);
    }
  }, []);

  /* After "drop", snap to position */
  useEffect(() => {
    switch (dragState) {
      case DragState.SnapToVisible:
        setIsDragging(false);
        setPortalY("0px");
        setTimeout(() => {
          _isDragging.current = false;
          setDragState(DragState.Rest);
        }, portalTransitionTime);
        break;
      case DragState.SnapToHidden:
        setIsDragging(false);
        setPortalY("100%");
        setTimeout(close, portalTransitionTime);
        break;
      case DragState.Rest:
        break;
    }
  }, [dragState, close, setPortalY]);

  useEffect(() => {
    /* Attach the drag events */
    const dragHandle = dragHandleRef?.current;
    if (dragHandle) {
      dragHandle.addEventListener("touchstart", dragStart);
      document.addEventListener("touchmove", move);
      document.addEventListener("touchend", drop);
    }

    return () => {
      /* Remove the drag events */
      if (dragHandle) {
        dragHandle.removeEventListener("touchstart", dragStart);
        document.removeEventListener("touchmove", move);
        document.removeEventListener("touchend", drop);
      }
    };
  }, [dragStart, drop, move]);

  return [containerRef, dragHandleRef, isDragging] as const;
};
