import gsap from "gsap";
import { Deferred } from "../../../../utils/tve/deferred";

import { LoadMapDeferred, LoadMapKind, TweenProps } from "./types";

export const getLoadMapDeferred = async (
  kind: LoadMapKind = LoadMapKind.Default
): Promise<LoadMapDeferred<boolean>> => {
  const coverImage = await Deferred<boolean>();
  const showLogo = await Deferred<boolean>();
  const ctaButton = await Deferred<boolean>();
  const favoriteButton = await Deferred<boolean>();
  const channelLogo = await Deferred<boolean>();

  /**
   * since we're using `await` above, this function needs to be `async`
   * and thus return a `Promise`
   */
  return new Promise((resolve) =>
    resolve({
      coverImage,
      showLogo,
      ctaButton,
      favoriteButton,
      ...(kind !== LoadMapKind.Playlist ? { channelLogo } : {}),
    })
  );
};

export const tweenCoverImage = ({ duration, tweenRefs }: TweenProps) => {
  if (tweenRefs.refCoverImage?.current) {
    gsap.from(tweenRefs.refCoverImage.current, {
      duration,
      autoAlpha: 0,
      scale: 1.02,
      transformOrigin: "center bottom",
    });

    return true;
  }

  return false;
};

// These defaults apply to each tween animation below
const defaultTween = (duration: number) => ({
  autoAlpha: 0,
  duration,
  y: "+12",
});

export const tweenMetadata = ({
  duration,
  tweenRefs,
  onComplete,
}: TweenProps) => {
  const tl = gsap.timeline({ defaults: defaultTween(duration), onComplete });

  // The conainer animates differently
  const containerRef = tweenRefs.refMetadataContainer?.current;
  if (containerRef) {
    tl.to(containerRef, { autoAlpha: 1, y: "0" });
  }

  // These all have the same animation
  // If they ever need different animations, add a `tweenOverrides` property
  const tweens = [
    { position: "+=0.24", ref: tweenRefs.refShowLogo?.current },
    { position: "-=0.16", ref: tweenRefs.refTuneInText?.current },
    { position: "<", ref: tweenRefs.refLiveBadge?.current },
    { position: "-=0.2", ref: tweenRefs.refActiveVideo?.current },
    { position: "-=0.12", ref: tweenRefs.refCtaButton?.current },
    { position: "-=0.06", ref: tweenRefs.refFavoriteButton?.current },
    { position: "-=0.06", ref: tweenRefs.refProgressBar?.current },
    { position: "-=0.06", ref: tweenRefs.refChannelLogo?.current },
    { position: "-=0.06", ref: tweenRefs.refChannelLogoMobile?.current },
  ];

  tweens.forEach(({ ref, position }) => ref && tl.from(ref, {}, position));

  const didAnimate = !!containerRef || tweens.some(({ ref }) => !!ref);
  return didAnimate;
};
