import * as M from "@discovery/prelude/lib/data/maybe";
import * as Option from "fp-ts/Option";
import { cn } from "@discovery/classnames";
import { format } from "@discovery/roadie";
import { isMobile } from "@discovery/common-tve/lib/device-info";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { PageTemplate } from "@discovery/common-tve/lib/constants";
import { Translations } from "@discovery/components-luna/lib/components/translations";
import { useGlobalState } from "@discovery/common-tve/lib/hooks";
import { CharacterLimit } from "@discovery/common-tve/lib/constants";
import {
  useImpression,
  InteractionEvent,
  useEventDataContext,
  triggerInteractionEvent,
} from "@discovery/common-tve/lib/eventing";

import { Tags } from "../../../../../utils/types";
import { Badge } from "../../../molecules/card/shared/badge";
import { usePageMeta } from "../../../../../utils/hooks/use-page-meta";
import { ProgressBar } from "../../../molecules/card/shared/progress-bar";
import { useShortHeader } from "./header";
import { FavoriteButton } from "../../../atoms/favorite-button";
import { CardImageFallback } from "../shared/card-image";
import { IconTheme, LockIcon, PlayIcon } from "../../../atoms/icons";
import { DurationRatingAirdate } from "../../../molecules/card/shared/duration-rating-airdate";
import { LinkKind, MaybeLink } from "../../../atoms/link";
import { P, H5, Sizes, Weights, Label, Text, Kinds } from "../../../atoms/text";
import { Clamp, seasonAndEpisodeM } from "../../../../../utils/text";
import {
  getCardLink,
  useParentContent,
  shouldDisplayLock,
} from "../../../molecules/card/utils";
import {
  Kind,
  Content,
  CardData,
  VideoType,
} from "../../../molecules/card/types";

import translations from "../../../molecules/card/translations/keys.json";

import * as styles from "./styles.css";
import * as cardStyles from "../styles.css";

const title = (x: string, headerTag: DetailedProps["headerTag"] = Tags.h3) => (
  <Text
    className={styles.title}
    tag={headerTag}
    kind={Kinds.body}
    size={Sizes.l}
    weight={Weights.normal}
  >
    <Clamp str={x} maxLength={CharacterLimit.TITLE_LENGTH} />
  </Text>
);

const renderSeasonEpisode = (x: string) => (
  <P
    size={Sizes.xs}
    weight={Weights.semiBold}
    className={cn(styles.seasonNumberEpisodeNumber)}
  >
    <Clamp str={x} maxLength={CharacterLimit.TITLE_LENGTH} />
  </P>
);

const description = (x: string) => (
  <P className={styles.description} size={Sizes.m}>
    <Clamp str={x} maxLength={CharacterLimit.SHORT_DESCRIPTION_LENGTH} />
  </P>
);

const formatTime = (x: Date) => {
  const hoursAndMinutes = format(x, `h:mm`);
  const period = format(x, "a");
  return [hoursAndMinutes, period];
};

const rating = (x: string) => (
  <P size={Sizes.xs} className={styles.rating} weight={Weights.normal}>
    {x}
  </P>
);

const MobileDescription = ({ content }: { content: CardData["content"] }) =>
  content.kind === Kind.Video ? (
    <RenderMaybe>
      {M.map(
        (short) => (
          <div className={styles.mobileDescription}>
            <P size={Sizes.xs} className={styles.mobileDescriptionText}>
              <Clamp
                str={short}
                maxLength={CharacterLimit.SHORT_DESCRIPTION_LENGTH}
              />
            </P>
          </div>
        ),
        content.descriptionM
      )}
    </RenderMaybe>
  ) : (
    <></>
  );

const canBeFavorited = (content: Content) =>
  (content.kind === Kind.Show && !isMobile) ||
  (content.kind === Kind.Video &&
    M.equals(content.videoTypeM, M.of(VideoType.Episode)));

type DetailedProps = CardData & {
  isPlaylist?: boolean;
  useLargeImages?: boolean;
  isSchedule?: boolean;
  showTitleClassName?: string;
  textContainerClassName?: string;
};

export const DetailedHighlight = ({
  content,
  className,
  linkKind = LinkKind.internal,
  onClick = () => {},
}: DetailedProps) => {
  const [{ loggedIn, loginUrlM }] = useGlobalState();
  const scheduleStartM =
    content.kind === "video" ? content.scheduleStartM : M.empty();

  const lockedForAnonymous = shouldDisplayLock(content) && !loggedIn;
  const { hrefM, linkKind: modifiedLinkKind } = getCardLink({
    lockedForAnonymous,
    linkKind,
    hrefM: content.linkM,
    loginUrlM,
  });
  const { eventData } = useEventDataContext();

  const { isFavoriteM = M.empty() } = content;
  const isLiveM = content.kind === "video" ? content.isLiveM : M.empty();
  const isListing =
    content.kind === Kind.Video &&
    M.foldMapConst(
      (videoType) => videoType === "LISTING",
      false,
      content.videoTypeM
    );

  const detailedHighlightRef = useImpression<HTMLDivElement>(() =>
    triggerInteractionEvent({
      ...eventData,
      interactionType: InteractionEvent.IMPRESSION,
    })
  );

  const { channelNameM } = usePageMeta();

  return (
    <div
      ref={detailedHighlightRef}
      className={cn(
        cardStyles.container,
        styles.detailed,
        styles.detailedHighlight,
        className
      )}
      data-sonic-type={content.kind}
      data-sonic-id={content.id}
    >
      <MaybeLink
        kind={modifiedLinkKind}
        onClick={(e) => onClick(e, content)}
        hrefM={hrefM}
        openInNewWindow={false}
        label={Option.getOrElse(() => "")(channelNameM)}
      >
        <div className={styles.relativeContainer}>
          <div className={styles.imageContainer}>
            {shouldDisplayLock(content) && (
              <LockIcon
                theme={IconTheme.dark}
                className={cn(
                  cardStyles.lockIcon,
                  styles.onNowLockIcon,
                  styles.detailedLockPlayIcon
                )}
              />
            )}
            <RenderMaybe>
              {M.map(
                (isLive) =>
                  isLive && (
                    <Translations
                      importP={(lang: string) =>
                        import(
                          `../../../molecules/card/translations/${lang}/keys.json`
                        )
                      }
                      fallbackImport={translations}
                    >
                      {(lookup) => (
                        <Label className={cardStyles.liveBadge}>
                          {lookup("cardLabel.live")}
                        </Label>
                      )}
                    </Translations>
                  ),
                isLiveM
              )}
            </RenderMaybe>
            <div className={cardStyles.imageContainerInside}>
              <CardImageFallback
                images={content.imageFallbackList}
                altTextForImage={
                  content.kind === Kind.Video
                    ? M.fromMaybe(content.showNameM, undefined)
                    : M.fromMaybe(content.titleM, undefined)
                }
              />
              <RenderMaybe>
                {M.map(
                  (progress) => (
                    <ProgressBar
                      progress={progress}
                      containerClassName={styles.progressBarContainerLive}
                      className={styles.progressBar}
                    />
                  ),
                  content.kind === Kind.Video ? content.progressM : M.empty()
                )}
              </RenderMaybe>
            </div>
          </div>

          {canBeFavorited(content) && (
            <FavoriteButton
              id={content.id}
              isFavorited={M.fromMaybe(isFavoriteM, false)}
              category={content.kind}
              className={cn(cardStyles.favoriteBtn, styles.detailedFavoriteBtn)}
            />
          )}
        </div>
        <div className={styles.textContainer}>
          <RenderMaybe>
            {M.map((scheduleStart) => {
              const [hoursAndMinutes, period] = formatTime(scheduleStart);
              return (
                <div className={styles.time}>
                  <H5 className={styles.hour}>{hoursAndMinutes}</H5>
                  <P size={Sizes.s} className={styles.period}>
                    {period}
                  </P>
                </div>
              );
            }, scheduleStartM)}
          </RenderMaybe>
          <P>
            <RenderMaybe>
              {M.map(
                renderSeasonEpisode,
                content.kind === Kind.Video
                  ? seasonAndEpisodeM(content)
                  : M.empty()
              )}
              {isListing
                ? M.map(renderSeasonEpisode, content.titleM)
                : M.empty()}
            </RenderMaybe>
          </P>
          <RenderMaybe>
            {M.map(
              title,
              content.kind == Kind.Video ? content.showNameM : content.titleM
            )}
          </RenderMaybe>
          <RenderMaybe>
            {M.map(
              rating,
              content.kind == Kind.Video ? content.ratingM : M.empty()
            )}
          </RenderMaybe>

          <div className={styles.hideMobile}>
            {"descriptionM" in content && (
              <RenderMaybe>
                {M.map(description, content.descriptionM)}
              </RenderMaybe>
            )}
          </div>
          <MobileDescription content={content} />
        </div>
      </MaybeLink>
    </div>
  );
};

export const Detailed = ({
  content: initialContent,
  className,
  showTitleClassName,
  textContainerClassName,
  linkKind = LinkKind.internal,
  isPlaylist = false,
  isSchedule = false,
  onClick = () => {},
  headerTag = Tags.h3,
}: DetailedProps) => {
  const [{ loggedIn, loginUrlM }] = useGlobalState();
  const content = useParentContent(initialContent);
  const scheduleStartM =
    content.kind === "video" ? content.scheduleStartM : M.empty();
  const isLiveM = content.kind === "video" ? content.isLiveM : M.empty();
  const isListing =
    content.kind === Kind.Video &&
    M.foldMapConst(
      (videoType) => videoType === "LISTING",
      false,
      content.videoTypeM
    );
  const { eventData } = useEventDataContext();
  const detailedRef = useImpression<HTMLDivElement>(() =>
    triggerInteractionEvent({
      ...eventData,
      interactionType: InteractionEvent.IMPRESSION,
    })
  );

  const lockedForAnonymous = shouldDisplayLock(content) && !loggedIn;
  const { hrefM, linkKind: modifiedLinkKind } = getCardLink({
    lockedForAnonymous,
    linkKind,
    hrefM: content.linkM,
    loginUrlM,
  });
  const { isFavoriteM = M.empty() } = content;
  const { templateId: pageTemplate } = usePageMeta();

  const detailedHighlightMini = isSchedule
    ? pageTemplate === PageTemplate.Secondary
      ? cn(styles.detailedHighlightMini, styles.cardSeparatorLivePlayer)
      : cn(
          styles.detailedHighlightMini,
          styles.fullWidth,
          styles.cardSeparatorLiveNow
        )
    : "";
  const Header = ({
    content,
    isPlaylist,
  }: {
    content: Content;
    isPlaylist?: boolean;
  }) => {
    const shortHeader = useShortHeader();

    return (
      <>
        {content.kind === Kind.Video && (
          <P className={styles.episodeTitleOuter}>
            <RenderMaybe>
              {isPlaylist
                ? M.map(
                    (showTitle) => (
                      <P className={cn(styles.showTitle, showTitleClassName)}>
                        <Clamp
                          str={showTitle}
                          maxLength={CharacterLimit.TITLE_LENGTH}
                        />
                      </P>
                    ),
                    content.showNameM
                  )
                : M.map(
                    renderSeasonEpisode,
                    content.kind === Kind.Video
                      ? seasonAndEpisodeM(content)
                      : M.empty()
                  )}

              {isListing
                ? M.map(renderSeasonEpisode, content.titleM)
                : M.empty()}
            </RenderMaybe>
          </P>
        )}

        <RenderMaybe>
          {M.map(
            (text) => title(text, headerTag),
            shortHeader
              ? content.titleM
              : content.kind == Kind.Video && !isPlaylist && isListing
              ? content.showNameM
              : content.titleM
          )}
        </RenderMaybe>
      </>
    );
  };
  return (
    <div
      ref={detailedRef}
      className={cn(
        cardStyles.container,
        styles.detailed,
        className,
        detailedHighlightMini
      )}
      data-sonic-type={content.kind}
      data-sonic-id={content.id}
    >
      <MaybeLink
        kind={modifiedLinkKind}
        onClick={(e) => onClick(e, content)}
        hrefM={hrefM}
        openInNewWindow={false}
        label={M.fromMaybe(content.titleM, "")}
      >
        <div
          className={cn(styles.innerContainer, {
            [styles.withoutTimeContainer]: !isSchedule,
          })}
        >
          {isSchedule && (
            <div className={styles.timeContainer}>
              <RenderMaybe>
                {M.map((scheduleStart) => {
                  const [hoursAndMinutes, period] = formatTime(scheduleStart);
                  return (
                    <>
                      <H5 className={styles.hour}>{hoursAndMinutes}</H5>
                      <P size={Sizes.s} className={styles.period}>
                        {period}
                      </P>
                    </>
                  );
                }, scheduleStartM)}
              </RenderMaybe>
            </div>
          )}
          <div className={styles.relativeContainer}>
            <div className={cn(styles.imageContainer)}>
              {shouldDisplayLock(content) ? (
                <RenderMaybe>
                  {M.map(
                    () => (
                      <LockIcon
                        theme={IconTheme.dark}
                        className={cn(
                          cardStyles.lockIcon,
                          styles.onNowLockIcon,
                          styles.detailedLockPlayIcon
                        )}
                      />
                    ),
                    hrefM
                  )}
                </RenderMaybe>
              ) : (
                <RenderMaybe>
                  {M.map(
                    () => (
                      <PlayIcon
                        theme={IconTheme.dark}
                        className={cn(
                          cardStyles.playIcon,
                          styles.detailedLockPlayIcon
                        )}
                      />
                    ),
                    hrefM
                  )}
                </RenderMaybe>
              )}
              <RenderMaybe>
                {M.map(
                  (isLive) =>
                    isLive && (
                      <Translations
                        importP={(lang: string) =>
                          import(
                            `../../../molecules/card/translations/${lang}/keys.json`
                          )
                        }
                        fallbackImport={translations}
                      >
                        {(lookup) => (
                          <Label className={cardStyles.liveBadge}>
                            {lookup("cardLabel.live")}
                          </Label>
                        )}
                      </Translations>
                    ),
                  isLiveM
                )}
              </RenderMaybe>
              <div className={styles.badge}>
                <Badge content={content} className={cardStyles.badge} />
              </div>

              <div
                className={cn(
                  cardStyles.imageContainerInside,
                  styles.detailedImageContainerInside
                )}
              >
                <CardImageFallback
                  images={content.imageFallbackList}
                  altTextForImage={
                    content.kind === Kind.Video
                      ? M.fromMaybe(content.showNameM, undefined)
                      : M.fromMaybe(content.titleM, undefined)
                  }
                />
              </div>

              <RenderMaybe>
                {M.map(
                  (progress) => (
                    <ProgressBar progress={progress} />
                  ),
                  content.kind === Kind.Video ? content.progressM : M.empty()
                )}
              </RenderMaybe>
            </div>

            {canBeFavorited(content) && (
              <FavoriteButton
                id={content.id}
                isFavorited={M.fromMaybe(isFavoriteM, false)}
                category={content.kind}
                className={cn(
                  cardStyles.favoriteBtn,
                  styles.detailedFavoriteBtn
                )}
              />
            )}
          </div>

          <div className={cn(styles.textContainer, textContainerClassName)}>
            <Header isPlaylist={isPlaylist} content={content} />
            {content.kind === Kind.Video ? (
              <DurationRatingAirdate
                videoDurationM={content.videoDurationM}
                ratingM={content.ratingM}
                airDateM={isSchedule ? M.empty() : content.airDateM}
                publishStartM={isSchedule ? M.empty() : content.publishStartM}
                className={styles.durationRatingAirdate}
              />
            ) : (
              <></>
            )}

            <div className={styles.hideMobile}>
              {"descriptionM" in content && (
                <RenderMaybe>
                  {M.map(description, content.descriptionM)}
                </RenderMaybe>
              )}
            </div>
          </div>
          {/* TODO: Don’t pass the entirety of content */}
          <MobileDescription content={content} />
        </div>
      </MaybeLink>
    </div>
  );
};

export const DetailedHighlightMini = (props: DetailedProps) => (
  <Detailed {...props} isSchedule={true} />
);
