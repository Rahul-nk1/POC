import * as M from "@discovery/prelude/lib/data/maybe";
import * as RD from "@discovery/prelude/lib/data/remote-data";
import { cn } from "@discovery/classnames";
import { head } from "@discovery/prelude/lib/data/iterable";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { Milliseconds } from "@discovery/nominal-time-ng";
import { CharacterLimit } from "@discovery/common-tve/lib/constants";
import { EventDataProvider } from "@discovery/common-tve/lib/eventing";
import {
  ctaResume,
  ctaWatch,
} from "@discovery/components-tve/src/components/tve/hardcoded-text";

import { HeroTemplate } from "../../../../site-builder/tve/components/hero";
import { LinkKind } from "../../atoms/link";
import { PlayNowButton } from "../../atoms/button";
import { H4, Kinds, P, Sizes, Text } from "../../atoms/text";
import { ProgressBar } from "../../molecules/card/shared/progress-bar";
import { MetaLink } from "./types";

import { Clamp } from "../../../../utils/text";
import type { Ref } from "../../../../utils/types";
import { Tags } from "../../../../utils/types";
import { getProgressM } from "../../../../utils/get-progress-m";
import { toShortDuration, toFullDate } from "../../../../utils/date";
import { useActiveVideoForShow } from "../../../../utils/hooks/use-active-video-for-show";
import { triggerVideoPlayerEvent } from "@discovery/common-tve/lib/eventing";
import { Kind } from "../../molecules/card";
import styles from "./styles.css";

type Props = {
  activeVideoForShowMRD: ReturnType<typeof useActiveVideoForShow>;
  className?: string;
  favoriteButtonM?: M.Maybe<JSX.Element>;
  locked: boolean;
  loggedIn: boolean;
  loginUrlM: M.Maybe<string>;
  onLoad?: () => void;
  onLoadFallback?: () => void;
  plateCtaM: M.Maybe<string>;
  plateLinkM: M.Maybe<MetaLink>;
  ref?: Ref<Tags>;
  refActiveVideo?: Ref<Tags>;
  refProgressBar?: Ref<Tags>;
  templateId?: HeroTemplate;
  contentIdM: M.Maybe<string>;
  kind: string;
  isLiveM: M.Maybe<boolean>;
};

/**
 * TODO -- better page-detection logic
 *    - currently, we don't want to show "LOCK" icons on the homepage
 *      ** even if the content is locked **
 *
 *    - since the homepage is the only page with a carousel,
 *      we can get around doing BAD string-based page detection
 *      by branching on `templateId`
 *
 *    -> this may lead to problems in the future if other pages implement
 *       hero carousels, but this does work well for now :)
 */

const getLinkKind = (linkM: M.Maybe<MetaLink>, locked: boolean) => {
  const _kind = locked ? LinkKind.external : LinkKind.internal;
  return M.foldMapConst((link) => link.kind ?? _kind, _kind, linkM);
};

export type PlayButtonMProps = Pick<
  Props,
  "className" | "onLoad" | "onLoadFallback" | "ref"
> & {
  ctaM: M.Maybe<string>;
  linkM: M.Maybe<MetaLink>;
  locked: boolean;
  templateId?: HeroTemplate;
  contentIdM: M.Maybe<string>;
  kind: string;
  isLiveM: M.Maybe<boolean>;
};

export const getPlayButtonM = ({
  className,
  ctaM,
  linkM,
  locked,
  onLoad,
  onLoadFallback,
  ref,
  templateId = HeroTemplate.Standard,
  contentIdM,
  kind,
  isLiveM,
}: PlayButtonMProps) => {
  const isLive = M.fromMaybe(isLiveM, undefined);

  const handleClick = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.stopPropagation();
    if (kind === Kind.Video || isLive) {
      triggerVideoPlayerEvent(M.fromMaybe(contentIdM, ""));
    }
  };

  if (onLoad && (M.is.Nothing(ctaM) || M.is.Nothing(linkM))) {
    if (onLoadFallback) {
      onLoadFallback();
    } else if (onLoad) {
      onLoad();
    }
  }

  return M.liftM(
    (cta, link) => (
      <EventDataProvider
        metaTag="button (molecules/generic)"
        content={{
          titleM: M.of(cta),
          linkM: M.map(({ url }) => url, linkM),
        }}
        element="heroctabutton"
      >
        <PlayNowButton
          linkM={M.of(link.url)}
          locked={locked && templateId !== HeroTemplate.Carousel}
          kind={getLinkKind(linkM, locked)}
          openInNewWindow={false}
          className={cn(
            styles.cta,
            {
              [styles.ctaLocked]: Boolean(locked),
            },
            className
          )}
          iconClassName={cn(styles.ctaIcon, {
            [styles.ctaIconVisible]: cta !== "",
            [styles.ctaLocked]: locked && templateId !== HeroTemplate.Carousel,
          })}
          innerClassName={styles.ctaInner}
          textClassName={styles.ctaTextContainer}
          onClick={handleClick}
          label={cta}
          onLoad={onLoad}
          _ref={ref}
        >
          <Text className={styles.ctaText} kind={Kinds.button} size={Sizes.m}>
            <Clamp str={cta} maxLength={CharacterLimit.CTA_MAX_LENGTH} />
          </Text>
        </PlayNowButton>
      </EventDataProvider>
    ),
    ctaM,
    linkM
  );
};

export const renderCta = ({
  activeVideoForShowMRD,
  className,
  favoriteButtonM = M.empty(),
  locked,
  loggedIn,
  loginUrlM,
  onLoad,
  onLoadFallback,
  plateCtaM,
  plateLinkM,
  ref,
  refActiveVideo,
  refProgressBar,
  templateId = HeroTemplate.Standard,
  contentIdM,
  kind,
  isLiveM,
}: Props) => {
  const lockedForAnonymous = !loggedIn && locked;
  const loginLinkM = M.map(
    (url) => ({ url, kind: LinkKind.external }),
    loginUrlM
  );
  const linkM = lockedForAnonymous ? loginLinkM : plateLinkM;
  return RD.fromRD(
    {
      notAsked: () =>
        getPlayButtonM({
          className,
          ctaM: plateCtaM,
          linkM,
          locked,
          onLoad,
          onLoadFallback,
          ref,
          templateId,
          contentIdM,
          kind,
          isLiveM,
        }),
      loading: () =>
        getPlayButtonM({
          className,
          ctaM: M.of(""),
          linkM,
          locked,
          onLoad,
          onLoadFallback,
          ref,
          templateId,
          contentIdM,
          kind,
          isLiveM,
        }),
      failure: () =>
        getPlayButtonM({
          className,
          ctaM: plateCtaM,
          linkM,
          locked,
          onLoad,
          onLoadFallback,
          ref,
          templateId,
          contentIdM,
          kind,
          isLiveM,
        }),
      success: (activeVideoM) => {
        const playbackAllowed = M.foldMapConst(
          ({ attributes: { playbackAllowed } }) =>
            M.fromMaybe(playbackAllowed, true),
          true,
          activeVideoM
        );
        const locked = !playbackAllowed;
        const activeVideoLinkM: M.Maybe<MetaLink> = M.map(
          ({ url }) => ({ url, kind: LinkKind.internal }),
          activeVideoM
        );
        const linkM = !loggedIn && locked ? loginLinkM : activeVideoLinkM;

        const completed = M.fromMaybe(
          M.chain(
            (activeVideo) => activeVideo.viewingHistory.completed,
            activeVideoM
          ),
          false
        );
        const viewed = M.fromMaybe(
          M.map(
            (activeVideo) => activeVideo.viewingHistory.viewed,
            activeVideoM
          ),
          false
        );

        const position = M.fromMaybe(
          M.chain(
            (activeVideo) => activeVideo.viewingHistory.position,
            activeVideoM
          ),
          0 as Milliseconds
        );
        const ratingM = M.chain(
          ({ attributes }) =>
            M.map(
              (q) => q.code,
              M.chain(
                (contentRatings) => head(contentRatings),
                attributes.contentRatings
              )
            ),
          activeVideoM
        );

        const resumeVideoM = viewed ? activeVideoM : M.empty();

        const ctaTitle = () =>
          completed || position === 0 ? ctaWatch : ctaResume;

        const isCarousel = templateId === HeroTemplate.Carousel;

        return M.alt(
          M.map(
            ({ attributes }) => (
              <div className={styles.ctaActiveVideoForShow}>
                <div
                  className={cn({
                    [styles.willTween]: !isCarousel,
                  })}
                  ref={refActiveVideo}
                >
                  <H4 className={styles.episodeHeader}>
                    <RenderMaybe>
                      {M.liftM(
                        (seasonNumber, episodeNumber) => (
                          <span
                            className={styles.paddingRightSmall}
                          >{`S${seasonNumber} E${episodeNumber}`}</span>
                        ),
                        attributes.seasonNumber,
                        attributes.episodeNumber
                      )}
                      {M.of(
                        <Clamp
                          str={attributes.name}
                          maxLength={CharacterLimit.TITLE_LENGTH}
                        />
                      )}
                    </RenderMaybe>
                  </H4>
                  <P className={styles.episodeInfo}>
                    <RenderMaybe>
                      {M.map(
                        (videoDuration) => (
                          <span className={styles.paddingRightSmall}>
                            {toShortDuration(videoDuration)}
                          </span>
                        ),
                        attributes.videoDuration
                      )}
                      {M.map(
                        (rating) => (
                          <span className={styles.paddingRightSmall}>
                            {rating}
                          </span>
                        ),
                        ratingM
                      )}
                      {M.map(
                        (publishStart) => toFullDate(publishStart),
                        M.alt(attributes.airDate, attributes.publishStart)
                      )}
                    </RenderMaybe>
                  </P>
                </div>
                <div className={styles.ctaButtonContainer}>
                  <div className={styles.ctaStatusContainer}>
                    <RenderMaybe>
                      {getPlayButtonM({
                        className,
                        ctaM: M.alt(
                          M.map(() => ctaTitle(), linkM),
                          plateCtaM
                        ),
                        linkM: M.alt(linkM, plateLinkM),
                        locked,
                        onLoad,
                        onLoadFallback,
                        ref,
                        templateId,
                        contentIdM,
                        kind: Kind.Video,
                        isLiveM,
                      })}
                    </RenderMaybe>
                    {!completed && (
                      <RenderMaybe>
                        {M.map(
                          (progress) => (
                            <div
                              className={cn(styles.ctaProgressBarWrapper, {
                                [styles.willTween]: !isCarousel,
                              })}
                              ref={refProgressBar}
                            >
                              <ProgressBar
                                className={styles.ctaProgressBar}
                                progress={progress}
                              />
                            </div>
                          ),
                          getProgressM(attributes)
                        )}
                      </RenderMaybe>
                    )}
                  </div>
                  <RenderMaybe>{favoriteButtonM}</RenderMaybe>
                </div>
              </div>
            ),
            resumeVideoM
          ),
          M.map(
            (playButton) => (
              <div className={styles.ctaButtonContainer}>
                <div className={styles.ctaStatusContainer}>{playButton}</div>
                <RenderMaybe>{favoriteButtonM}</RenderMaybe>
              </div>
            ),
            getPlayButtonM({
              className,
              ctaM: M.of(ctaTitle()),
              linkM,
              locked,
              onLoad,
              onLoadFallback,
              ref,
              templateId,
              contentIdM,
              kind: Kind.Video,
              isLiveM,
            })
          )
        );
      },
    },
    activeVideoForShowMRD
  );
};
