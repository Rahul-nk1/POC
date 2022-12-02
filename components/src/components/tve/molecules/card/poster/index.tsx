import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import { isMobile } from "@discovery/common-tve/lib/device-info";
import { CharacterLimit } from "@discovery/common-tve/lib/constants";
import {
  useState,
  useCallback,
  useGlobalState,
} from "@discovery/common-tve/lib/hooks";
import {
  useImpression,
  InteractionEvent,
  useEventDataContext,
  triggerInteractionEvent,
} from "@discovery/common-tve/lib/eventing";

import { Tags } from "../../../../../utils/types";
import { Clamp } from "../../../../../utils/text";
import { Badge } from "../shared/badge";
import { MaybeLink } from "../../../atoms/link";
import { NetworkLogo } from "../shared/network-logo";
import { FavoriteButton } from "../../../atoms/favorite-button";
import { CardData, Kind } from "../types";
import { CardImageFallback } from "../shared/card-image";
import { IconTheme, LockIcon } from "../../../atoms/icons";
import { Kinds, Sizes, Text, Weights } from "../../../atoms/text";
import { shouldDisplayLock, getCardLink } from "../utils";
import { PosterHoverAnimation, HoverStates } from "./poster-hover-animation";

import * as styles from "./styles.css";
import * as cardStyles from "../styles.css";
import { useAllowRemovalContext } from "@discovery/components-tve/src/utils/hooks/use-removal";
import { RemoveFavoriteButton } from "@discovery/components-tve/src/components/tve/atoms/remove-favourite-button";

export enum PosterKind {
  Primary = "primary",
  Secondary = "secondary",
}

export type PosterCardData = CardData & { kind: PosterKind };

export const Poster = ({
  content,
  className,
  onClick,
  onFavoriteChange,
  kind,
  headerTag = Tags.h3,
}: PosterCardData) => {
  const [{ loggedIn, loginUrlM }] = useGlobalState();
  const [hoverState, setHoverState] = useState(HoverStates.default);
  const { eventData } = useEventDataContext();
  const allowRemoval = useAllowRemovalContext();

  const impressionCallback = useCallback(() => {
    triggerInteractionEvent({
      ...eventData,
      interactionType: InteractionEvent.IMPRESSION,
    });
  }, [eventData]);
  const posterRef = useImpression<HTMLDivElement>(impressionCallback);

  const lockedForAnonymous = shouldDisplayLock(content) && !loggedIn;
  const { hrefM, linkKind } = getCardLink({
    lockedForAnonymous,
    hrefM: content.linkM,
    loginUrlM,
  });
  const canBeFavorited =
    (content.kind === Kind.Show && !isMobile) || content.kind !== Kind.Show;
  const { isFavoriteM = M.empty() } = content;

  const imageOverlayChildren = (
    <>
      <Badge content={content} className={cardStyles.badge} />

      {canBeFavorited &&
        (allowRemoval ? (
          <RemoveFavoriteButton
            id={content.id}
            isFavorited={M.fromMaybe(isFavoriteM, false)}
            category={content.kind}
            className={cn(cardStyles.favoriteBtn, styles.favoriteBtnPoster)}
            onFavoriteChange={onFavoriteChange}
          />
        ) : (
          <FavoriteButton
            id={content.id}
            isFavorited={M.fromMaybe(isFavoriteM, false)}
            category={content.kind}
            className={cn(cardStyles.favoriteBtn, styles.favoriteBtnPoster)}
            onFavoriteChange={onFavoriteChange}
          />
        ))}
      {shouldDisplayLock(content) && (
        <LockIcon theme={IconTheme.dark} className={cardStyles.lockIcon} />
      )}
    </>
  );

  return (
    <PosterHoverAnimation state={hoverState}>
      {({ image, imageOverlay, metaBlock, metaLeft, metaRight, border }) => (
        <div
          ref={posterRef}
          className={cn(
            cardStyles.container,
            styles.poster,
            className,
            styles[kind]
          )}
          onMouseEnter={({ currentTarget }) => {
            const focussed = document.activeElement as HTMLElement;
            if (!currentTarget.contains(focussed) && focussed?.blur) {
              focussed.blur();
            }
            setHoverState(HoverStates.hasEntered);
          }}
          onMouseLeave={() => setHoverState(HoverStates.hasLeft)}
          onFocus={() => setHoverState(HoverStates.hasEntered)}
          onBlur={({ currentTarget }) => {
            // if the focus has moved to an inner element, don't fire onBlur
            // the timeout prevents a janky offHover then onHover effect, it
            //   accounts for the time between tab keydown and tab keyup events
            setTimeout(() => {
              if (!currentTarget.contains(document.activeElement)) {
                setHoverState(HoverStates.hasLeft);
              }
            }, 100);
          }}
          data-sonic-type={content.kind}
          data-sonic-id={content.id}
        >
          <MaybeLink
            kind={linkKind}
            hrefM={hrefM}
            openInNewWindow={false}
            className={styles.link}
            onClick={(ev) => onClick && onClick(ev, content)}
            label={M.fromMaybe(content.titleM, "")}
          >
            <div className={styles.borderBlock} ref={border}></div>

            <div className={styles.imageContainer} ref={image}>
              <div className={cardStyles.imageContainerInside}>
                <CardImageFallback
                  images={content.imageFallbackList}
                  altTextForImage={M.fromMaybe(content.titleM, undefined)}
                />
              </div>
            </div>

            <div className={styles.imageOverlayContainer} ref={imageOverlay}>
              {imageOverlayChildren}
            </div>

            <div
              className={cn(cardStyles.metaDataInner, styles.metaDataInner)}
              ref={metaBlock}
            >
              <div className={cardStyles.metaDataRow}>
                <div ref={metaLeft} className={styles.metaLeft}>
                  <Text
                    kind={Kinds.card}
                    size={Sizes.title}
                    tag={headerTag}
                    weight={Weights.semiBold}
                    className={cn(cardStyles.contentTitle, styles.contentTitle)}
                  >
                    <Clamp
                      str={M.fromMaybe(content.titleM, "no title")}
                      maxLength={CharacterLimit.TITLE_LENGTH}
                    />
                  </Text>
                </div>

                <div className={styles.metaRight} ref={metaRight}>
                  <NetworkLogo content={content} className={styles.metaRight} />
                </div>
              </div>
            </div>
          </MaybeLink>
        </div>
      )}
    </PosterHoverAnimation>
  );
};
