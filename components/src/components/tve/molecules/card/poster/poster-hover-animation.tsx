import gsap from "gsap";
import { ExpoScaleEase } from "gsap/EasePack";
import {
  useCallback,
  useState,
  useEffect,
  useEvent,
  useRef,
  useDebounceDispatch,
} from "@discovery/common-tve/lib/hooks";
import {
  getSafeScaleVars,
  invertScale,
  withRefCallbackRenderProps,
} from "@discovery/components-tve/src/utils/tve/animation";

gsap.registerPlugin(ExpoScaleEase);

const nodeNames = [
  "image",
  "imageOverlay",
  "metaBlock",
  "metaLeft",
  "metaRight",
  "border",
] as const;

export enum HoverStates {
  default,
  hasEntered,
  hasLeft,
}

type PosterNodes = {
  image: Element;
  imageOverlay: Element;
  metaBlock: Element;
  metaLeft: Element;
  metaRight: Element;
  border: Element;
};

type Dims = {
  width: number;
  height: number;
};

/**
 * The easing here is NOT used for the final animation
 * It is used to build timelines with a unified baseline
 */
const baseVars = {
  duration: 0.3,
  ease: "none",
  z: 0.01,
};

// This is the REAL easing that's used in the animations
const animationEasing = "power1.out";

// The cards must expand by 15.8px on each side, to stay inside the grid-gap
const expand = 31.6;
const moveDown = 12; // a design requirement, expanded poster shifted 12px down

const getDims = (el: Element): Dims => {
  const { width, height } = el.getBoundingClientRect();
  return { width, height };
};

const measure = (nodes: PosterNodes) => {
  // get imageDims and borderDims
  const imageDims = getDims(nodes.image);
  const borderDims = getDims(nodes.border);

  // get imageScale (x and y are the same)
  const scale = (imageDims.width + expand) / imageDims.width;
  const imageScale = {
    scaleX: scale,
    scaleY: scale,
  };

  // get top & left translations
  const leftTranslation = expand / 2;
  const extraHeight = imageDims.height * (scale - 1);
  const topTranslation = -(extraHeight / 2) + moveDown;
  const bottomTranslation = extraHeight / 2 + moveDown;

  // getBorderScale
  const borderScale = {
    scaleX: scale,
    scaleY: (borderDims.height + extraHeight) / borderDims.height,
  };

  // get metaBlockScale (only x scales)
  const metaBlockScale = {
    scaleX: scale,
    scaleY: 1,
  };

  // get expanded card width
  const expandedWidth = imageDims.width + expand;

  return {
    leftTranslation,
    topTranslation,
    bottomTranslation,
    imageScale,
    borderScale,
    metaBlockScale,
    expandedWidth,
  };
};

const imageTimeline = (
  nodes: PosterNodes,
  measurements: ReturnType<typeof measure>
) => {
  const { image, imageOverlay } = nodes;
  const {
    imageScale,
    leftTranslation,
    topTranslation,
    expandedWidth,
  } = measurements;

  const imageTl = gsap.timeline({ defaults: baseVars });

  imageTl.to(image, { ...imageScale, y: moveDown }, 0);

  // image overlay moves, and its width expands
  imageTl.to(
    imageOverlay,
    { x: -leftTranslation, y: topTranslation, width: expandedWidth },
    0
  );

  return imageTl;
};

const metaTimeline = (
  nodes: PosterNodes,
  measurements: ReturnType<typeof measure>
) => {
  const { metaBlock, metaLeft, metaRight } = nodes;
  const { metaBlockScale, bottomTranslation } = measurements;

  // get x axis safe scale vars with expo easing, and the inverse
  const metaScaleVars = getSafeScaleVars({ to: metaBlockScale });
  const metaScaleVarsInverse = getSafeScaleVars({
    to: invertScale(metaBlockScale),
  });

  const metaTl = gsap.timeline({ defaults: baseVars });

  // metaBlock scales and moves down
  metaTl.to(metaBlock, { ...metaScaleVars.x, y: bottomTranslation }, 0);

  // meta items scale inverse to metaBlock
  metaTl.to([metaLeft, metaRight], metaScaleVarsInverse.x, 0);

  return metaTl;
};

const createTimeline = (nodes: PosterNodes) => {
  const measurements = measure(nodes);

  const tl = gsap.timeline({ defaults: baseVars, paused: true });
  tl.add(imageTimeline(nodes, measurements), 0);
  tl.add(metaTimeline(nodes, measurements), 0);
  tl.to(nodes.border, { ...measurements.borderScale, y: moveDown }, 0);

  return tl;
};

export const PosterHoverAnimation = withRefCallbackRenderProps(
  nodeNames,
  ({ nodes, state }) => {
    const [timeline, setTimeline] = useState(createTimeline(nodes));
    const activeTween = useRef<gsap.core.Tween>(null);

    // On window resize, recreate the timeline
    const resetTimeline = useCallback(() => {
      setTimeline(createTimeline(nodes));
    }, [nodes]);
    const recreateTimeline = useDebounceDispatch(resetTimeline, 240, [
      resetTimeline,
    ]);

    const imageOverlayReset = {
      width: "100%",
    };

    useEvent("resize", () => {
      recreateTimeline();
      gsap.to(nodes.imageOverlay, imageOverlayReset);
    });

    const onEnter = useCallback(() => {
      const remainingDuration = baseVars.duration * (1 - timeline.progress());

      activeTween.current?.kill();
      activeTween.current = gsap.to(timeline, {
        progress: 1, // tween from current progress to 1 (done)
        duration: remainingDuration,
        ease: animationEasing,
      });
    }, [timeline]);

    const onLeave = useCallback(() => {
      const remainingDuration = baseVars.duration * (timeline.progress() - 0);

      activeTween.current?.kill();
      activeTween.current = gsap.to(timeline, {
        progress: 0, // tween from current progress to 0
        duration: remainingDuration,
        ease: animationEasing,
      });
    }, [timeline]);

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
