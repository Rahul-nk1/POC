import { cn } from "@discovery/classnames";
import * as M from "@discovery/prelude/lib/data/maybe";
import { useCallback, useEffect } from "@discovery/common-tve/lib/hooks";

import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { ImageData } from "@discovery/sonic-api-ng/lib/api/cms/images/resource";

import { HeroTemplate } from "../../../../site-builder/tve/components/hero";
import type { Ref } from "../../../../utils/types";
import { Tags } from "../../../../utils/types";

import { LoadMapItem } from "../../organisms/hero/types";
import { FallbackImage } from "../fallback-image";

import { CSSCover } from "./css-cover";
import * as styles from "./styles.css";

export enum HeroCoverFlavors {
  Fading = "fading",
  Image = "image",
}

export enum HeroCoverSizes {
  Basic = "basic",
  Compact = "compact",
}

export type Props = {
  className?: string;
  coverImageM?: M.Maybe<ImageData["attributes"]>;
  flavorM?: M.Maybe<HeroCoverFlavors>;
  metadataViewM?: M.Maybe<JSX.Element>;
  mobileCoverImageM?: M.Maybe<ImageData["attributes"]>;
  setComponentLoaded?: (x: LoadMapItem) => void;
  shouldTween?: boolean;
  templateId: HeroTemplate;
  altTextForImage?: string;
  _ref?: Ref<Tags>;
};

export const HeroCover = ({
  className,
  coverImageM = M.empty(),
  metadataViewM = M.empty(),
  mobileCoverImageM = M.empty(),
  setComponentLoaded,
  shouldTween = false,
  templateId,
  altTextForImage,
  _ref,
}: Props) => {
  // TODO: Deactivated due to error in Bowser
  //const msBrowser = browser.is("edge") || browser.is("internet explorer");
  // TODO: Use luna image SonicImage rather than utils from luna image
  const metaDataViewM = M.map(
    (metadata) => (
      <div className={styles.metadataWideContainer}>
        <div className={styles.metadataWrapper}>{metadata}</div>
      </div>
    ),
    metadataViewM
  );

  const setImageLoaded = useCallback(() => {
    if (shouldTween && setComponentLoaded) {
      setComponentLoaded({
        coverImage: true,
      } as LoadMapItem);
    }
  }, [shouldTween, setComponentLoaded]);

  const coverImageView = useCallback(
    (coverImage: ImageData["attributes"], className: string) => (
      <CSSCover
        templateId={templateId}
        className={className}
        image={coverImage}
        altTextForImage={altTextForImage}
        onLoad={setImageLoaded}
        _ref={_ref}
      />
    ),
    [_ref, setImageLoaded, templateId, altTextForImage]
  );

  const Fallback = ({ className }: Pick<Props, "className" | "_ref">) => {
    useEffect(() => setImageLoaded(), []);

    return <FallbackImage className={className} />;
  };

  const _coverImage = M.maybe(
    <Fallback className={cn(styles.cssCover, styles.coverImage)} />,
    (coverImage) => coverImageView(coverImage, styles.coverImage),
    coverImageM
  );

  const _mobileCoverImage = M.maybe(
    <Fallback className={cn(styles.cssCover, styles.coverImageMobile)} />,
    (coverImage) => coverImageView(coverImage, styles.coverImageMobile),
    mobileCoverImageM
  );

  return (
    <div className={cn(className, styles.heroCoverContainer)}>
      <div className={cn({ [styles.willTween]: shouldTween })} ref={_ref}>
        {_coverImage}
        {_mobileCoverImage}
      </div>
      <div className={styles.background}></div>
      <RenderMaybe>{metaDataViewM}</RenderMaybe>
    </div>
  );
};
