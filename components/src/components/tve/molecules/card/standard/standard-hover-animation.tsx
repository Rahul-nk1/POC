import gsap from "gsap";
import {
  useCallback,
  useState,
  useEffect,
  useEvent,
  useDebounceDispatch,
} from "@discovery/common-tve/lib/hooks";
import { withRefCallbackRenderProps } from "../../../../../utils/tve/animation";

const nodeNames = [
  "image",
  "imageOverlay",
  "metaBackground",
  "description",
  "title",
] as const;

export enum HoverStates {
  default,
  hasEntered,
  hasLeft,
}

type Dims = {
  width: number;
  height: number;
};

// The cards must expand by 15.8px on each side, to stay inside the grid-gap
const expand = 31.6;

/**
 * Basic tweenVars used for cardHovers, including z: 0.01 to force gpu
 * acceleration.
 */
const tweenVars = {
  duration: 0.3,
  z: 0.01,
};

const getDims = (el: Element): Dims => {
  const { width, height } = el.getBoundingClientRect();
  return { width, height };
};

export const StandardHoverAnimation = withRefCallbackRenderProps(
  nodeNames,
  ({ nodes, state }) => {
    const [imageDims, setImageDims] = useState(getDims(nodes.image));

    /* Create the image dimension measuring callback, and a debounced version */
    const measure = useCallback(() => setImageDims(getDims(nodes.image)), [
      nodes.image,
    ]);
    const measureDebounced = useDebounceDispatch(measure, 240, [measure]);

    /* Measure immediately and also on window.resize */
    useEffect(() => measure(), [measure]);
    useEvent("resize", () => measureDebounced());

    /* Create the animation callbacks */
    const onEnter = useCallback(() => {
      const scaleRatio = expand / imageDims.width;
      const scale = 1 + scaleRatio;
      const scalePercent = scaleRatio * 100;

      const imageHover = {
        ...tweenVars,
        transformOrigin: "bottom",
        scale,
      };
      const imageOverlayHover = {
        ...tweenVars,
        top: `${-scalePercent}%`,
        right: `${-scalePercent / 2}%`,
        left: `${-scalePercent / 2}%`,
        transformOrigin: "bottom",
      };
      const metaBackgroundHover = {
        ...tweenVars,
        transformOrigin: "top",
        opacity: 1,
        scaleX: scale,
        scaleY: 1.25 * scale,
      };
      const descriptionHover = {
        ...tweenVars,
        opacity: 1,
      };
      gsap.to(nodes.image, imageHover);
      gsap.to(nodes.imageOverlay, imageOverlayHover);
      gsap.to(nodes.metaBackground, metaBackgroundHover);
      gsap.to(nodes.description, descriptionHover);
      gsap.to(nodes.title, descriptionHover);
    }, [imageDims, nodes]);

    const onLeave = useCallback(() => {
      const imageReset = {
        ...tweenVars,
        scale: 1.001, // prevents a 1px "scaleY jump"
      };
      const imageOverlayReset = {
        ...tweenVars,
        top: "0%",
        right: "0%",
        left: "0%",
      };
      const metaBackgroundReset = {
        ...tweenVars,
        opacity: 0,
        scale: 1,
      };
      const descriptionReset = {
        ...tweenVars,
        opacity: 0,
        scale: 1,
      };
      gsap.to(nodes.image, imageReset);
      gsap.to(nodes.imageOverlay, imageOverlayReset);
      gsap.to(nodes.metaBackground, metaBackgroundReset);
      gsap.to(nodes.description, descriptionReset);
    }, [nodes]);

    /* Perform the animation on isHovered change */
    useEffect(() => {
      switch (state) {
        case HoverStates.hasEntered:
          onEnter();
          break;
        case HoverStates.hasLeft:
          onLeave();
          break;
        default:
          break;
      }
    }, [state, onLeave, onEnter]);

    return <></>;
  }
);
