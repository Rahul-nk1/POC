import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import { ImageData } from "@discovery/sonic-api-ng/lib/api/cms/images/resource";
import { useCallback, useEffect } from "@discovery/common-tve/lib/hooks";
import { CharacterLimit } from "@discovery/common-tve/src/constants";
import { ChannelData } from "@discovery/sonic-api-ng/lib/api/content/channels/resource";

import { HeroTemplate } from "../../../../site-builder/tve/components/hero";

import {
  HeroAttrs,
  LoadMapItem,
  MetadataProps,
  TweenRefs,
} from "../../organisms/hero/types";
import { SonicImage } from "../../atoms/sonic-image";
import { Details } from "../../atoms/body-text";
import { H4, P, Kinds, Sizes, Text } from "../../atoms/text";

import { GenericImageFallback } from "../generic-image-fallback";
import { ChannelLogo } from "./channel-logo";
import { HeroMetadata } from "./view";

import { Clamp } from "../../../../utils/text";
import type { Ref } from "../../../../utils/types";
import { Tags } from "../../../../utils/types";
import { useActiveVideoForShow } from "../../../../utils/hooks/use-active-video-for-show";

import styles from "./styles.css";

export type GenericMetadataProps = HeroAttrs &
  MetadataProps &
  TweenRefs & {
    className?: string;
    activeVideoForShowMRD: ReturnType<typeof useActiveVideoForShow>;
    setComponentLoaded?: (x: LoadMapItem) => void;
  };

type TitleTextBlockProps = {
  className?: string;
  charLimit?: number;
  onLoad?: () => void;
  titleTag: Tags;
  titleText?: string;
  _ref?: Ref<Tags>;
};

const TitleTextBlock = ({
  className,
  charLimit = CharacterLimit.TITLE_LENGTH,
  onLoad = () => {},
  titleTag,
  titleText,
  _ref,
}: TitleTextBlockProps) => {
  useEffect(() => {
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return titleText && titleText !== "" ? (
    <Text
      className={cn(styles.titleContainer, className)}
      kind={Kinds.title}
      size={Sizes.m}
      tag={titleTag}
      _ref={_ref}
    >
      <Clamp str={titleText} maxLength={charLimit} />
    </Text>
  ) : (
    <></>
  );
};

export const GenericMetadata = ({
  className,
  // isCompact = false,
  // isPrimary = false,
  activeVideoForShowMRD,
  channelLogoM = M.empty(),
  channelAttrM = M.empty(),
  channelLogoMobileM = M.empty(),
  channelNameM,
  contentIdM = M.empty(),
  isCarousel = false,
  isFavoriteM = M.of(false),
  isLiveM = M.of(false),
  isPlaylist = false,
  kind,
  locked,
  plateCtaM,
  plateDescriptionM,
  plateLinkM,
  plateTitleM,
  refActiveVideo,
  refChannelLogo,
  refChannelLogoMobile,
  refCtaButton,
  refDescription,
  refFavoriteButton,
  refLiveBadge,
  refMetadataContainer,
  refProgressBar,
  refShowLogo,
  refTuneInText,
  setComponentLoaded,
  shouldTween = false,
  showLogoM,
  templateId = HeroTemplate.Standard,
  tuneInTextM,
}: GenericMetadataProps) => {
  const isStandard = templateId === HeroTemplate.Standard;
  const isEmpty = (item: ImageData["attributes"]) =>
    Object.keys(item).length === 0;

  /**
   * image fallback :)
   *  -> render show title text if logo exists but fails to load
   *  - hopefully the title text is also supplied (since it's a Maybe)
   *  - text block is unnecessarily rendered if a show logo exists + doesn't error,
   *    but it's not expensive
   *
   * seo /// header tags
   *  - based on specs, we need to change the tag given to hero titles
   *    on the homepage vs. inner pages
   *  - this includes images, which now have alt text added
   */

  const _titleText = M.fromMaybe(plateTitleM, "");

  const _titleTag = isCarousel ? Tags.h2 : Tags.h1;

  const showLogoLoaded = useCallback(() => {
    if (shouldTween && setComponentLoaded) {
      setComponentLoaded({
        showLogo: true,
      } as LoadMapItem);
    }
  }, [shouldTween, setComponentLoaded]);

  const channelLogoLoaded = useCallback(() => {
    if (shouldTween && !isPlaylist && setComponentLoaded) {
      setComponentLoaded({
        channelLogo: true,
      } as LoadMapItem);
    }
  }, [shouldTween, isPlaylist, setComponentLoaded]);

  const ctaButtonLoaded = useCallback(() => {
    if (shouldTween && setComponentLoaded) {
      setComponentLoaded({
        ctaButton: true,
      } as LoadMapItem);
    }
  }, [shouldTween, setComponentLoaded]);

  const favoriteButtonLoaded = useCallback(() => {
    if (shouldTween && setComponentLoaded) {
      setComponentLoaded({
        favoriteButton: true,
      } as LoadMapItem);
    }
  }, [shouldTween, setComponentLoaded]);

  const titleTextBlock = (
    <TitleTextBlock
      className={cn({
        [styles.willTween]: shouldTween,
        [styles.carouselTitleContainer]: isCarousel,
      })}
      onLoad={showLogoLoaded}
      titleTag={_titleTag}
      titleText={_titleText}
      _ref={refShowLogo}
    />
  );

  const title = M.maybe(
    titleTextBlock,
    (showLogo) => (
      <GenericImageFallback
        fallback={titleTextBlock}
        images={[showLogo]}
        isEmpty={isEmpty}
        render={({ currentImageProps, handleError }) => (
          <Text
            className={cn(styles.showLogoHeaderTag, {
              [styles.willTween]: shouldTween,
            })}
            kind={Kinds.title}
            size={Sizes.m}
            tag={_titleTag}
            _ref={refShowLogo}
          >
            <SonicImage
              className={cn(styles.showLogo, {
                [styles.carouselShowLogo]: isCarousel,
                [styles.standardShowLogo]: isStandard,
                [styles.carouselObjectPosition]: isCarousel,
              })}
              alt={_titleText}
              extraImageWidths={[188, 220, 360, 480]}
              fallbackImageSize={{ width: 480 }}
              format="PNG"
              image={currentImageProps}
              imageSizes={{ default: [600, "px"] }} // default to max-width
              onError={handleError}
              onLoad={showLogoLoaded}
              style={{
                //hack: because SonicImage has an inherent object-position of center top, the only, quote, "good" option to override that for "tablet-only" was to negate it with empty-string
                objectPosition: "",
                objectFit: "contain",
              }}
            />
          </Text>
        )}
      />
    ),
    showLogoM
  );

  const subtitleM = M.map(
    (tuneInText) => (
      <H4
        className={cn(styles.tuneTextContainer, {
          [styles.willTween]: shouldTween,
        })}
        _ref={refTuneInText}
      >
        <Clamp str={tuneInText} maxLength={CharacterLimit.TUNE_IN_LENGTH} />
      </H4>
    ),
    tuneInTextM
  );

  const descriptionM = M.map(
    (desc) => (
      <P
        className={cn(styles.descriptionContainer, {
          [styles.willTween]: shouldTween,
        })}
        _ref={refDescription}
      >
        <Clamp str={desc} maxLength={CharacterLimit.SHORT_DESCRIPTION_LENGTH} />
      </P>
    ),
    plateDescriptionM
  );

  /**
   * @NOTE --`channelLogoLoaded` only needs to run if it's not a carousel
   *  - channel logo is only displayed on show pages, not playlist
   *  - channel logo does not animate (yet), so we don't need to apply `styles.willTween`   *
   */

  type DeviceType = {
    mobile: boolean;
  };

  const makeChannelLogo = (
    channelLogo: M.Maybe<ImageData["attributes"]>,
    deviceType: DeviceType,
    channelAttrM: M.Maybe<ChannelData["attributes"]>
  ) => {
    const alt = M.map((title) => title.name, channelAttrM);
    return M.map(
      (channelLogo) => (
        <GenericImageFallback
          fallback={<></>}
          images={[channelLogo]}
          isEmpty={isEmpty}
          render={({ currentImageProps, handleError }) => (
            <ChannelLogo
              className={cn(styles.channelLogoGeneric, {
                [styles.willTween]: shouldTween && !isPlaylist,
              })}
              logo={currentImageProps}
              onLoad={channelLogoLoaded}
              onError={(e) => {
                channelLogoLoaded();
                if (e !== undefined) {
                  handleError(e);
                }
              }}
              onAbort={(e) => {
                channelLogoLoaded();
                if (e !== undefined) {
                  handleError(e);
                }
              }}
              _ref={deviceType.mobile ? refChannelLogoMobile : refChannelLogo}
              alt={M.fromMaybe(alt, "")}
            />
          )}
        />
      ),
      channelLogo
    );
  };
  const getChannelLogo = (
    channelLogo: M.Maybe<ImageData["attributes"]>,
    deviceType: DeviceType,
    channelAttrM: M.Maybe<ChannelData["attributes"]>
  ) => {
    if (M.is.Nothing(channelLogo) || isCarousel) {
      channelLogoLoaded();
      return M.empty();
    } else {
      return makeChannelLogo(channelLogo, deviceType, channelAttrM);
    }
  };

  const channelM = getChannelLogo(
      channelLogoM,
      { mobile: false },
      channelAttrM
    ),
    channelMobileM = getChannelLogo(
      channelLogoMobileM,
      { mobile: true },
      channelAttrM
    );

  const channelNameViewM = M.map(
    (channel) => <Details>{channel}</Details>,
    channelNameM
  );

  const classes = cn(styles.basic, className);

  return (
    <HeroMetadata
      className={classes}
      activeVideoForShowMRD={activeVideoForShowMRD}
      channelM={channelM}
      channelMobileM={channelMobileM}
      channelNameViewM={channelNameViewM}
      contentIdM={contentIdM}
      descriptionM={descriptionM}
      isFavoriteM={isFavoriteM}
      isLiveM={isLiveM}
      kind={kind}
      locked={locked}
      onLoadCtaButton={ctaButtonLoaded}
      onLoadFavoriteButton={favoriteButtonLoaded}
      plateCtaM={plateCtaM}
      plateLinkM={plateLinkM}
      refActiveVideo={refActiveVideo}
      refCtaButton={refCtaButton}
      refFavoriteButton={refFavoriteButton}
      refLiveBadge={refLiveBadge}
      refMetadataContainer={refMetadataContainer}
      refProgressBar={refProgressBar}
      shouldTween={shouldTween}
      subtitleM={subtitleM}
      templateId={templateId}
      title={title}
    />
  );
};
