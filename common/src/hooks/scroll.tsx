import { useEffect, useCallback, useRef } from "../hooks";

export type ScrollPosition = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type ScrollHookProps = {
  handleScroll: (pos: ScrollPosition) => void;
  minScrollDistance: number;
};

const getScrollPosition = ({
  win = window,
  doc = document.documentElement,
} = {}): ScrollPosition => ({
  x: (win.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
  y: (win.pageYOffset || doc.scrollTop) - (doc.clientTop || 0),
  width: win.innerWidth,
  height: win.innerHeight,
});

const isInBounds = (a: number, b: number, bound: number) =>
  a <= b + bound && a >= b - bound;

const didScroll = ({
  currentPos,
  newPos,
  minScrollDistance = 0,
}: {
  currentPos: ScrollPosition;
  newPos: ScrollPosition;
  minScrollDistance?: number;
}) =>
  !(
    isInBounds(newPos.x, currentPos.x, minScrollDistance) &&
    isInBounds(newPos.y, currentPos.y, minScrollDistance)
  );

export const useScroll = ({
  handleScroll,
  minScrollDistance = 0,
}: ScrollHookProps) => {
  const initialPosition = getScrollPosition();
  const currentPos = useRef(initialPosition);

  const onScroll = useCallback(() => {
    const newPos = getScrollPosition();
    const _currentPos = currentPos.current;

    if (
      didScroll({
        currentPos: _currentPos,
        newPos,
        minScrollDistance,
      })
    ) {
      currentPos.current = newPos;

      handleScroll(currentPos.current);
    }
  }, [minScrollDistance, handleScroll]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return { currentPos };
};

/**
 * this fake component is needed to wrap the hooks required to
 * conditionally fire `useScroll` --
 *
 * since hooks have to run every time a component renders,
 * and be on the top-level of a given component,
 * we can wrap the hooks in a component and
 * conditionally mount it in its parent
 */
export const ScrollHandler = ({
  handleScroll,
  minScrollDistance,
}: ScrollHookProps) => {
  const onScroll = useCallback(handleScroll, [handleScroll]);

  useScroll({
    handleScroll: onScroll,
    minScrollDistance,
  });

  return <></>;
};
