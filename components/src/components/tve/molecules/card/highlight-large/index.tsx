import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { useImpression } from "@discovery/common-tve/lib/eventing";
import { useGlobalState } from "@discovery/common-tve/src/hooks";
import {
  InteractionEvent,
  useEventDataContext,
  triggerInteractionEvent,
} from "@discovery/common-tve/lib/eventing";

import { readInt } from "../../../../../utils/number";
import { MaybeLink } from "../../../atoms/link";
import { ProgressBar } from "../../../molecules/card/shared/progress-bar";
import { seasonAndEpisodeM } from "../../../../../utils/text";
import { CardImageFallback } from "../shared/card-image";
import { IconTheme, LockIcon } from "../../../atoms/icons";
import { H5, P, Sizes, Label } from "../../../atoms/text";
import { Kind as ContentKind, CardData } from "../../../molecules/card/types";
import { getTime, get12HourTimeMarkerM } from "../../../../../utils/date";
import { shouldDisplayLock, getCardLink } from "../../../molecules/card/utils";

import * as cardStyles from "../styles.css";
import * as styles from "./styles.css";

const imageMaxWidthMobile = M.fromMaybe(
  readInt(styles.imageMaxWidthMobile),
  600
);
const imageMaxWidthDesktop = M.fromMaybe(
  readInt(styles.imageMaxWidthDesktop),
  500
);

const timeDisplayM = (date: M.Maybe<Date>) =>
  M.liftM(
    (time, marker) => (
      <div className={styles.time}>
        <H5 className={styles.hour}>{time}</H5>
        <P size={Sizes.s}>{marker}</P>
      </div>
    ),
    M.map(getTime, date),
    get12HourTimeMarkerM(date)
  );

export const HighlightLarge = ({ content, className }: CardData) => {
  const [{ loggedIn, loginUrlM }] = useGlobalState();
  const { eventData } = useEventDataContext();
  const highlightRef = useImpression<HTMLDivElement>(() =>
    triggerInteractionEvent({
      ...eventData,
      interactionType: InteractionEvent.IMPRESSION,
    })
  );
  const lockedForAnonymous = shouldDisplayLock(content) && !loggedIn;
  const { hrefM, linkKind } = getCardLink({
    lockedForAnonymous,
    hrefM: content.linkM,
    loginUrlM,
  });
  return content.kind !== ContentKind.Video ? (
    <></>
  ) : (
    <MaybeLink
      kind={linkKind}
      openInNewWindow={false}
      hrefM={hrefM}
      className={cn(styles.container, className)}
      label={M.fromMaybe(content.titleM, "")}
    >
      {shouldDisplayLock(content) && (
        <LockIcon theme={IconTheme.dark} className={cardStyles.lockIcon} />
      )}
      <div
        ref={highlightRef}
        className={styles.imageContainer}
        data-sonic-type={content.kind}
        data-sonic-id={content.id}
      >
        <CardImageFallback
          images={content.imageFallbackList}
          imageMaxWidth={Math.max(imageMaxWidthDesktop, imageMaxWidthMobile)}
          altTextForImage={M.fromMaybe(content.showNameM, undefined)}
        />

        <RenderMaybe>
          {M.map(
            (progress) => (
              <ProgressBar progress={progress} />
            ),
            content.progressM
          )}
        </RenderMaybe>
        {/* TODO: ??? */}
        <Label className={styles.liveBadge}>LIVE</Label>
      </div>

      <div className={styles.infoContainer}>
        <RenderMaybe>
          {timeDisplayM(content.scheduleStartM)}
          {M.map(
            (seasonAndEpisode) => (
              <P size={Sizes.s} className={styles.episode}>
                {seasonAndEpisode}
              </P>
            ),
            seasonAndEpisodeM({
              seasonNumberM: content.seasonNumberM,
              episodeNumberM: content.episodeNumberM,
            })
          )}
          {M.map(
            (title) => (
              <P size={Sizes.l}>{title}</P>
            ),
            content.titleM
          )}
          {M.map(
            (rating) => (
              <P size={Sizes.xs} className={styles.rating}>
                {rating}
              </P>
            ),
            content.ratingM
          )}
          {M.map(
            (description) => (
              <P size={Sizes.xs} className={styles.description}>
                {description}
              </P>
            ),
            content.descriptionM
          )}
        </RenderMaybe>
      </div>
    </MaybeLink>
  );
};
