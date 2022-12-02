import { cn } from "@discovery/classnames";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import * as M from "@discovery/prelude/lib/data/maybe";
import { ImageData } from "@discovery/sonic-api-ng/lib/api/cms/images/resource";
import {
  useCallback,
  useGlobalState,
  useMemo,
} from "@discovery/common-tve/src/hooks";

import { HeroTemplate } from "../../../../site-builder/tve/components/hero";

import { MetadataProps, TweenRefs } from "../../organisms/hero/types";
import { MyListButton } from "../../atoms/my-list-button";
import { MyListButtonVariant } from "../../atoms/my-list-button/types";

import { useActiveVideoForShow } from "../../../../utils/hooks/use-active-video-for-show";
import { Translations } from "@discovery/components-luna/lib/components/translations";
import translations from "../../molecules/card/translations/keys.json";
import { Label } from "../../atoms/text";
import { renderCta } from "./render-cta";
import styles from "./styles.css";

type Props = Omit<
  MetadataProps,
  | "channelNameM"
  | "locked"
  | "showLogoM"
  | "tuneInTextM"
  | "plateDescriptionM"
  | "plateTitleM"
> &
  Pick<
    TweenRefs,
    | "refActiveVideo"
    | "refCtaButton"
    | "refFavoriteButton"
    | "refLiveBadge"
    | "refMetadataContainer"
    | "refProgressBar"
    | "shouldTween"
  > & {
    activeVideoForShowMRD?: ReturnType<typeof useActiveVideoForShow>;
    channelNameViewM?: M.Maybe<JSX.Element>;
    channelM?: M.Maybe<JSX.Element>;
    channelMobileM?: M.Maybe<JSX.Element>;
    className?: string;
    descriptionM?: M.Maybe<JSX.Element>;
    logoM?: M.Maybe<JSX.Element>;
    locked?: boolean;
    onLoadCtaButton?: () => void;
    onLoadFavoriteButton?: () => void;
    plateDescriptionM?: M.Maybe<string>;
    plateTitleM?: M.Maybe<string>;
    showCta?: boolean;
    isLiveM?: M.Maybe<boolean>;
    showLogoM?: M.Maybe<ImageData["attributes"]>;
    subtitleM?: M.Maybe<JSX.Element>;
    title: JSX.Element;
    tuneInTextM?: M.Maybe<string>;
  };

export const HeroMetadata = ({
  activeVideoForShowMRD,
  contentIdM = M.empty(),
  channelNameViewM = M.empty(),
  channelM = M.empty(),
  channelMobileM = M.empty(),
  className,
  descriptionM = M.empty(),
  kind,
  logoM = M.empty(),
  locked = false,
  plateCtaM = M.empty(),
  plateLinkM = M.empty(),
  showCta = true,
  isFavoriteM = M.of(false),
  isLiveM = M.of(false),
  subtitleM = M.empty(),
  templateId = HeroTemplate.Standard,
  title = <></>,
  refActiveVideo,
  refCtaButton,
  refFavoriteButton,
  refLiveBadge,
  refMetadataContainer,
  refProgressBar,
  shouldTween = false,
  onLoadCtaButton = () => {},
  onLoadFavoriteButton = () => {},
}: Props) => {
  const [{ loggedIn, loginUrlM }] = useGlobalState();

  /**
   * @TODO -- better page-detection logic
   *  - currently, we don't want to show "favorite" buttons on the homepage
   *  - since the homepage is the only page with a carousel,
   *    we can get around doing BAD string-based page detection
   *    by branching on `templateId`
   *
   *  -> this may lead to problems in the future if other pages implement
   *     hero carousels, but this does work well for now :)
   */

  const isCarousel = templateId === HeroTemplate.Carousel;

  const isFavorite = M.fromMaybe(isFavoriteM, false);

  const favoriteButtonM = isCarousel
    ? M.empty()
    : M.map(
        (contentId) => (
          <MyListButton
            className={cn(styles.favoriteButton, {
              [styles.willTween]: shouldTween,
            })}
            id={contentId}
            category={kind}
            isFavorited={isFavorite}
            variant={MyListButtonVariant.Hero}
            setGlobalFavoritedState={isCarousel ? false : true}
            _ref={refFavoriteButton}
            onLoad={onLoadFavoriteButton}
          />
        ),
        contentIdM
      );

  if (shouldTween && M.is.Nothing(favoriteButtonM)) {
    onLoadFavoriteButton();
  }

  /**
   * @NOTE -- no CTA buttons will render if the content's `limkM` is empty
   *  - if it renders, we want to fire separate `onLoad` events for each child
   *  - else, trigger `onLoad` events for all children
   */

  const onLoadFallback = useCallback(() => {
    onLoadCtaButton();
    onLoadFavoriteButton();
  }, [onLoadCtaButton, onLoadFavoriteButton]);

  const ctaM = useMemo(
    () =>
      showCta && activeVideoForShowMRD
        ? renderCta({
            activeVideoForShowMRD,
            className: cn({
              [styles.willTween]: shouldTween,
            }),
            favoriteButtonM,
            locked,
            loggedIn,
            loginUrlM,
            onLoad: onLoadCtaButton,
            onLoadFallback,
            plateCtaM,
            plateLinkM,
            ref: refCtaButton,
            refActiveVideo,
            refProgressBar,
            templateId,
            contentIdM,
            kind,
            isLiveM,
          })
        : M.empty(),
    [
      activeVideoForShowMRD,
      favoriteButtonM,
      locked,
      loggedIn,
      loginUrlM,
      onLoadCtaButton,
      onLoadFallback,
      refActiveVideo,
      refProgressBar,
      refCtaButton,
      plateCtaM,
      plateLinkM,
      shouldTween,
      showCta,
      templateId,
      contentIdM,
      kind,
      isLiveM,
    ]
  );

  if (!showCta) {
    onLoadCtaButton();
  }

  const buttonsM = M.map(
    () => (
      <div className={cn(styles.buttonStyles)}>
        <div className={styles.ctaContainer}>
          <RenderMaybe>{ctaM}</RenderMaybe>
        </div>
      </div>
    ),
    ctaM
  );

  const isLive = M.map(
    (isLive) =>
      isLive && (
        <Translations
          importP={(lang: string) =>
            import(`../../molecules/card/translations/${lang}/keys.json`)
          }
          fallbackImport={translations}
        >
          {(lookup) => (
            <Label
              className={cn(styles.liveBadge, {
                [styles.willTween]: shouldTween,
              })}
              _ref={refLiveBadge}
            >
              {lookup("cardLabel.live")}
            </Label>
          )}
        </Translations>
      ),
    isLiveM
  );

  return (
    <div
      className={cn(styles.metadataContainer, className, {
        [styles.carousel]: isCarousel,
        [styles.carouselMetadataContainer]: isCarousel,
      })}
      ref={refMetadataContainer}
    >
      <div className={styles.metadataLeft}>
        <RenderMaybe>{logoM}</RenderMaybe>
        {title}
        <RenderMaybe>
          {isLive}
          {subtitleM}
          {isCarousel ? descriptionM : M.empty()}
          {buttonsM}
          {channelNameViewM}
        </RenderMaybe>
      </div>
      <div className={cn(styles.metadataRight, styles.hideBelowSmall)}>
        {<RenderMaybe>{channelM}</RenderMaybe>}
      </div>
      <div className={cn(styles.metadataRight, styles.hideAboveSmall)}>
        {<RenderMaybe>{channelMobileM}</RenderMaybe>}
      </div>
    </div>
  );
};
