import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import { isMobile } from "@discovery/common-tve/lib/device-info";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { Translations } from "@discovery/components-luna/lib/components/translations";
import { useImpression } from "@discovery/common-tve/lib/eventing";
import { CharacterLimit } from "@discovery/common-tve/lib/constants";
import { StateAction, Dispatch } from "@discovery/orchestra/lib/dependencies";
import {
  useState,
  useCallback,
  useGlobalState,
} from "@discovery/common-tve/lib/hooks";
import {
  InteractionEvent,
  useEventDataContext,
  triggerInteractionEvent,
} from "@discovery/common-tve/lib/eventing";

import translations from "../../../molecules/card/translations/keys.json";
import { Tags } from "../../../../../utils/types";
import { Badge } from "../../../molecules/card/shared/badge";
import { ctaWatch } from "../../../../tve/hardcoded-text";

import { MaybeLink } from "../../../atoms/link";
import { ProgressBar } from "../../../molecules/card/shared/progress-bar";
import { NetworkLogo } from "../../../molecules/card/shared/network-logo";
import { usePageMeta } from "../../../../../utils/hooks/use-page-meta";
import { BottomDrawer } from "../../../molecules/bottom-drawer";
import { PlayNowButton } from "../../../atoms/button";
import { FavoriteButton } from "../../../atoms/favorite-button";
import { toShortDurationM } from "../../../../../utils/date";
import { CardImageFallback } from "../shared/card-image";
import { IconTheme, LockIcon } from "../../../atoms/icons";
import { DurationRatingAirdate } from "../../../molecules/card/shared/duration-rating-airdate";
import { span, seasonAndEpisodeM, Clamp } from "../../../../../utils/text";
import { shouldDisplayLock, getCardLink } from "../../../molecules/card/utils";
import { H5, Kinds, Label, P, Sizes, Text, Weights } from "../../../atoms/text";
import {
  HoverStates,
  StandardHoverAnimation,
} from "./standard-hover-animation";
import {
  MyListButton,
  MyListButtonTheme,
  MyListButtonVariant,
} from "../../../atoms/my-list-button";
import {
  Kind,
  Video,
  CardData,
  VideoType,
  Content,
} from "../../../molecules/card/types";

import * as styles from "./styles.css";
import * as cardStyles from "../styles.css";
import { useAllowRemovalContext } from "../../../../../utils/hooks/use-removal";
import { RemoveFavoriteButton } from "../../../atoms/remove-favourite-button";

export enum StandardKind {
  Primary = "primary",
  Secondary = "secondary",
}

export type StandardCardData<T = Content> = CardData<T> & {
  kind?: StandardKind;
};

const EpisodeTitleOrShowName = ({
  content,
  headerTag = Tags.h3,
}: Pick<StandardCardData, "content" | "headerTag">) => (
  <Text
    className={cn(cardStyles.contentTitle, styles.paddedTitle)}
    kind={Kinds.card}
    size={Sizes.title}
    tag={headerTag}
    weight={Weights.semiBold}
  >
    {content.kind === Kind.Video &&
    !M.equals(content.showNameM, content.titleM) &&
    !M.equals(content.videoTypeM, M.of(VideoType.Clip)) ? (
      <Clamp
        str={M.fromMaybe(content.showNameM, "no show name")}
        maxLength={CharacterLimit.TITLE_LENGTH}
      />
    ) : (
      <Clamp
        str={M.fromMaybe(content.titleM, "no title")}
        maxLength={CharacterLimit.TITLE_LENGTH}
      />
    )}
  </Text>
);

type ImageBlockProps = Pick<StandardCardData, "content"> & {
  children?: React.ReactNode;
  imageOverlayRef?: React.Ref<HTMLDivElement>;
  imageRef?: React.Ref<HTMLDivElement>;
  isLive?: boolean;
};

const ImageBlock = ({
  content,
  imageOverlayRef,
  imageRef,
  children,
  isLive,
}: ImageBlockProps) => {
  const progressBarStyles = isLive
    ? styles.progressBarLive
    : styles.progressBar;
  const progressBarContainerStyles = isLive
    ? styles.progressBarContainerLive
    : styles.progressBarContainer;

  return (
    <div className={styles.imageContainer}>
      <div className={styles.imageContainerContent} ref={imageRef}>
        {shouldDisplayLock(content) && (
          <LockIcon theme={IconTheme.dark} className={cardStyles.lockIcon} />
        )}
        <div className={cardStyles.imageContainerInside}>
          <CardImageFallback
            images={content.imageFallbackList}
            altTextForImage={
              content.kind == Kind.Video
                ? M.fromMaybe(content.showNameM, undefined)
                : M.fromMaybe(content.titleM, undefined)
            }
          />
          <RenderMaybe>
            {M.map(
              (progress) => (
                <ProgressBar
                  progress={progress}
                  className={progressBarStyles}
                  containerClassName={progressBarContainerStyles}
                />
              ),
              content.kind === Kind.Video ? content.progressM : M.empty()
            )}
          </RenderMaybe>
        </div>
      </div>
      <div className={styles.imageContainerOverlay} ref={imageOverlayRef}>
        {children}
        {!isLive && <Badge content={content} className={cardStyles.badge} />}
      </div>
    </div>
  );
};

type TextBlockProps = Pick<
  StandardCardData,
  "content" | "showChannelLogo" | "headerTag"
> & {
  metaBackgroundRef?: React.Ref<HTMLDivElement>;
  descriptionRef?: React.Ref<HTMLDivElement>;
  titleRef?: React.Ref<HTMLDivElement>;
  showKebab?: boolean;
  onKebabClick?: (e: React.MouseEvent) => void;
};
const TextBlock = ({
  content,
  showChannelLogo,
  metaBackgroundRef,
  descriptionRef,
  titleRef,
  showKebab = false,
  onKebabClick = (_e: React.MouseEvent) => {},
  headerTag = Tags.h3,
}: TextBlockProps) => {
  const { isPlayerPage } = usePageMeta();
  return (
    <div className={styles.metaDataContainer}>
      <div
        className={cn(styles.hoverBackground, {
          [styles.hoverBackgroundPlayer]: isPlayerPage,
        })}
        ref={metaBackgroundRef}
      />
      <div
        className={cn(cardStyles.metaDataInner, styles.metaDataInner)}
        ref={titleRef}
      >
        <div className={styles.metaLeft}>
          <EpisodeTitleOrShowName content={content} headerTag={headerTag} />
          <P
            size={Sizes.xs}
            className={cn(cardStyles.subtitle, styles.subtitle)}
          >
            {/* TODO: Don’t pass the entirety of content */}
            {content.kind === Kind.Video && <VideoSubtitle content={content} />}
          </P>
        </div>

        {/* TODO: Don’t pass the entirety of content, because that would be too clean and simple? or... */}
        {showChannelLogo && (
          <NetworkLogo content={content} className={styles.metaRight} />
        )}
      </div>

      {showKebab && <div onClick={onKebabClick} className={styles.kebab} />}

      {(content.kind === Kind.Video ||
        content.kind === Kind.Show ||
        content.kind === Kind.Link) && (
        <div className={styles.description} ref={descriptionRef}>
          <RenderMaybe>
            {M.map(
              (x) => (
                <P size={Sizes.s}>
                  <Clamp
                    str={x}
                    maxLength={CharacterLimit.SHORT_DESCRIPTION_LENGTH}
                  />
                </P>
              ),
              content.descriptionM
            )}
          </RenderMaybe>
        </div>
      )}
    </div>
  );
};

const VideoEpisodeMeta = ({
  content,
}: Pick<StandardCardData<Video>, "content">) => (
  <RenderMaybe>
    {M.map(span, seasonAndEpisodeM(content))}
    {M.map(span, content.titleM)}
  </RenderMaybe>
);

const VideoSubtitle = ({
  content,
}: Pick<StandardCardData<Video>, "content">) => (
  <RenderMaybe>
    {M.map((videoType) => {
      switch (videoType) {
        case VideoType.Episode:
          return <VideoEpisodeMeta content={content} />;
        case VideoType.Listing:
          return <VideoEpisodeMeta content={content} />;
        case VideoType.Clip:
          return (
            <RenderMaybe>
              {M.map(span, toShortDurationM(content.videoDurationM))}
              {M.map(span, content.showNameM)}
            </RenderMaybe>
          );
        // @TODO: add subtitles for other types:
        case VideoType.Standalone:
          return <VideoEpisodeMeta content={content} />;
        case VideoType.Trailer:
        case VideoType.FollowUp:
        case VideoType.Live:
          return <VideoEpisodeMeta content={content} />;
        default:
          return <></>;
      }
    }, content.videoTypeM)}
  </RenderMaybe>
);

export const MobileEpisodeDrawer = ({
  content,
  onClick,
  onFavoriteChange,
  isFavorite,
  setIsFavorite,
}: Pick<StandardCardData<Video>, "content" | "onClick" | "onFavoriteChange"> & {
  isFavorite: boolean;
  setIsFavorite: Dispatch<StateAction<boolean>>;
}) => (
  <div className={styles.drawer}>
    <P
      size={Sizes.m}
      weight={Weights.semiBold}
      className={cn(cardStyles.contentTitle, styles.title, styles.paddedTitle)}
    >
      <RenderMaybe>
        {M.map(
          (title) => (
            <Clamp str={title} maxLength={CharacterLimit.TITLE_LENGTH} />
          ),
          content.kind == Kind.Video ? content.showNameM : content.titleM
        )}
      </RenderMaybe>
    </P>
    <H5 className={cn(cardStyles.subtitle, styles.subtitle)}>
      <VideoSubtitle content={content} />
    </H5>
    <DurationRatingAirdate
      className={styles.durationRatingAirdate}
      {...content}
    />
    <div className={styles.description}>
      <RenderMaybe>
        {M.map(
          (x) => (
            <P className={styles.drawerDescription}>
              <Clamp
                str={x}
                maxLength={CharacterLimit.SHORT_DESCRIPTION_LENGTH}
              />
            </P>
          ),
          content.descriptionM
        )}
      </RenderMaybe>
    </div>
    <div className={styles.drawerButtons}>
      <PlayNowButton
        theme={IconTheme.dark}
        onClick={(ev) => onClick && onClick(ev, content)}
        iconClassName={styles.playButtonIcon}
        linkM={content.linkM}
        className={styles.playButton}
        label={ctaWatch}
        smallIcon={true}
        textClassName={styles.ctaTextContainer}
      />

      <MyListButton
        id={content.id}
        category={content.kind}
        isFavorited={isFavorite}
        setFavoriteInDrawer={setIsFavorite}
        theme={MyListButtonTheme.Dark}
        variant={MyListButtonVariant.Hero}
        className={styles.myListButton}
        showToast={false}
        onFavoriteChange={onFavoriteChange}
      />
    </div>
  </div>
);

export const StandardWithDrawer = ({
  content,
  showChannelLogo,
  className,
  headerTag = Tags.h3,
  onClick, // @TODO: figure out a better way to close search overlay besides prop drilling onClicks
  onFavoriteChange,

  kind = StandardKind.Primary,
}: StandardCardData<Video>) => {
  const [{ loggedIn, loginUrlM }] = useGlobalState();
  const { eventData } = useEventDataContext();
  const standardRef = useImpression<HTMLDivElement>(() =>
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
  const [showDrawer, setShowDrawer] = useState(false);
  const { isFavoriteM = M.empty() } = content;
  const [isFavorite, setIsFavorite] = useState(M.fromMaybe(isFavoriteM, false));

  return (
    <div
      ref={standardRef}
      className={cn(cardStyles.container, styles.standard, className, {
        [cardStyles.gridMargin]: kind != StandardKind.Secondary,
      })}
      data-sonic-type={content.kind}
      data-sonic-id={content.id}
    >
      <MaybeLink
        kind={linkKind}
        openInNewWindow={false}
        hrefM={hrefM}
        onClick={(ev) => onClick && onClick(ev, content)}
        label={M.fromMaybe(content.titleM, "")}
      >
        <ImageBlock content={content} />
        <TextBlock
          content={content}
          headerTag={headerTag}
          showChannelLogo={showChannelLogo}
          showKebab
          onKebabClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDrawer(true);
          }}
        />
      </MaybeLink>
      {showDrawer && (
        <BottomDrawer close={() => setShowDrawer(false)}>
          <MobileEpisodeDrawer
            isFavorite={isFavorite}
            setIsFavorite={setIsFavorite}
            content={content}
            onClick={onClick}
            onFavoriteChange={onFavoriteChange}
          />
        </BottomDrawer>
      )}
    </div>
  );
};

export const StandardDefault = ({
  content,
  showChannelLogo,
  className,
  onClick,
  onFavoriteChange,
  canBeFavorited,
  headerTag = Tags.h3,
  kind = StandardKind.Primary,
}: StandardCardData & { canBeFavorited: boolean }) => {
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
  const standardRef = useImpression<HTMLDivElement>(impressionCallback);

  const isLiveM = content.kind === "video" ? content.isLiveM : M.empty();
  const isLive = M.fromMaybe(isLiveM, false);

  const lockedForAnonymous = shouldDisplayLock(content) && !loggedIn;
  const { hrefM, linkKind } = getCardLink({
    lockedForAnonymous,
    hrefM: content.linkM,
    loginUrlM,
  });
  const { isFavoriteM = M.empty() } = content;

  const imageOverlayChildren = (
    <>
      {canBeFavorited &&
        (allowRemoval ? (
          <RemoveFavoriteButton
            id={content.id}
            isFavorited={M.fromMaybe(isFavoriteM, false)}
            category={content.kind}
            className={cn(cardStyles.favoriteBtn, styles.favoriteBtnStandard)}
            onFavoriteChange={onFavoriteChange}
          />
        ) : (
          <FavoriteButton
            id={content.id}
            isFavorited={M.fromMaybe(isFavoriteM, false)}
            category={content.kind}
            className={cn(cardStyles.favoriteBtn, styles.favoriteBtnStandard)}
            onFavoriteChange={onFavoriteChange}
          />
        ))}
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
    </>
  );

  return (
    <StandardHoverAnimation state={hoverState}>
      {({ image, imageOverlay, metaBackground, description, title }) => (
        <div
          ref={standardRef}
          className={cn(cardStyles.container, styles.standard, className, {
            [cardStyles.gridMargin]: kind != StandardKind.Secondary,
          })}
          data-sonic-type={content.kind}
          data-sonic-id={content.id}
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
        >
          <MaybeLink
            kind={linkKind}
            openInNewWindow={false}
            hrefM={hrefM}
            onClick={(ev) => onClick && onClick(ev, content)}
            label={M.fromMaybe(content.titleM, "")}
          >
            <ImageBlock
              content={content}
              imageRef={image}
              imageOverlayRef={imageOverlay}
              isLive={isLive}
            >
              {imageOverlayChildren}
            </ImageBlock>
            <TextBlock
              content={content}
              showChannelLogo={showChannelLogo}
              metaBackgroundRef={metaBackground}
              descriptionRef={description}
              titleRef={title}
              headerTag={headerTag}
            />
          </MaybeLink>
        </div>
      )}
    </StandardHoverAnimation>
  );
};

const isEpisode = (props: StandardCardData): props is StandardCardData<Video> =>
  props.content.kind === Kind.Video &&
  (M.equals(props.content.videoTypeM, M.of(VideoType.Episode)) ||
    M.equals(props.content.videoTypeM, M.of(VideoType.Listing)));

export const Standard = (props: StandardCardData) =>
  isMobile && isEpisode(props) ? (
    <StandardWithDrawer {...props} />
  ) : (
    <StandardDefault {...props} canBeFavorited={isEpisode(props)} />
  );
