export type Scale = {
  scaleX: number;
  scaleY: number;
};

export const invertScale = ({ scaleX, scaleY }: Scale) => ({
  scaleX: 1 / scaleX,
  scaleY: 1 / scaleY,
});

const unitScale = { scaleX: 1, scaleY: 1 };

/* The GSAP expoScale function will BREAK if `expoScale(1, 1)` is attempted */
const safeEaseScale = (from: number, to: number) =>
  from === to ? "none" : `expoScale(${from}, ${to})`;

/**
 * Returns an "x" and "y" set of gsap.TweenVars for scaling, providing correct
 * easing for each axis.
 *
 * Scaling requires special easing, otherwise it will appear to stretch during
 * animating.
 *
 * Because these animations scale differently on the x-axis vs. the y-axis, a
 * different easing is set for each axis.
 *
 * One set of x and y easings are needed for the container, and an inverse set
 * is needed for any content inside the container.
 */
export const getSafeScaleVars = ({
  from = unitScale,
  to = unitScale,
}: {
  from?: Scale;
  to?: Scale;
}) => ({
  y: { ease: safeEaseScale(from.scaleY, to.scaleY), scaleY: to.scaleY },
  x: { ease: safeEaseScale(from.scaleX, to.scaleX), scaleX: to.scaleX },
});
