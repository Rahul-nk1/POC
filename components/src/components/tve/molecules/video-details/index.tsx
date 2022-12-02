import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import { VideoType } from "@discovery/sonic-api-ng/lib/api/content/videos/attributes";
import { useHistory } from "@discovery/common-tve/lib/hooks";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { Milliseconds } from "@discovery/nominal-time-ng";
import { CharacterLimit } from "@discovery/common-tve/lib/constants";

import { Link, LinkProps, LinkKind } from "../../atoms/link";
import { H1, H3, P, Kinds, Sizes, Text } from "../../atoms/text";
import { DurationRatingAirdate } from "../../molecules/card/shared/duration-rating-airdate";
import { Chevron } from "../../atoms/icons";
import { MyListButton, MyListButtonTheme } from "../../atoms/my-list-button";
import { seasonAndEpisodeM, Clamp } from "../../../../utils/text";
import { Tags } from "../../../../utils/types";

import * as styles from "./styles.css";

export type Props = {
  classNameM?: M.Maybe<string>;
  titleM?: M.Maybe<string>;
  descriptionM?: M.Maybe<string>;
  scheduleStartM?: M.Maybe<Date>;
  videoTypeM?: M.Maybe<VideoType>;
  channelIdM?: M.Maybe<string>;
  linkM?: M.Maybe<{ link: LinkProps; name: string }>;
  videoDurationM?: M.Maybe<Milliseconds>;
  ratingM?: M.Maybe<string>;
  airDateM?: M.Maybe<Date>;
  publishStartM?: M.Maybe<Date>;
  seasonNumberM?: M.Maybe<number>;
  episodeNumberM?: M.Maybe<number>;
  isFavoriteM?: M.Maybe<boolean>;
  showNameM?: M.Maybe<string>;
  kind?: string;
  isPlaylist?: boolean;
  isEpisode?: boolean;
  isListing?: boolean;
  id?: string;
};

export const VideoDetails = ({
  classNameM = M.empty(),
  titleM = M.empty(),
  descriptionM = M.empty(),
  linkM = M.empty(),
  channelIdM = M.empty(),
  videoDurationM = M.empty(),
  ratingM = M.empty(),
  airDateM = M.empty(),
  publishStartM = M.empty(),
  seasonNumberM = M.empty(),
  episodeNumberM = M.empty(),
  isFavoriteM = M.empty(),
  showNameM = M.empty(),
  isPlaylist = false,
  isListing = false,
  isEpisode = false,
  kind = "",
  id = "",
}: Props) => {
  const [, history] = useHistory();

  return (
    <div className={styles.container}>
      <div className={cn(styles.inner, classNameM)}>
        <RenderMaybe>
          {M.map(
            ({ name, link }) => (
              <Link
                {...link}
                onClick={(e) => {
                  if (
                    link.kind === LinkKind.eventListenerOnly &&
                    link.onClick
                  ) {
                    link.onClick?.(e);
                    return;
                  }
                  history.push(link.href, {
                    channelId: M.fromMaybe(channelIdM, undefined),
                  });
                }}
                className={styles.show}
                label={name}
              >
                <Chevron />
                <Text
                  className={styles.backLinkHeader}
                  kind={Kinds.title}
                  size={Sizes.m}
                  tag={Tags.h2}
                >
                  {name}
                </Text>
              </Link>
            ),
            linkM
          )}
        </RenderMaybe>

        {/* Title/Episode Name to be displayed in different places for VOD/Live and Playlist player */}
        <RenderMaybe>
          {M.map(
            (title) => (
              <H1
                className={
                  isListing
                    ? styles.title2
                    : cn(styles.title1, { [styles.title1to2]: isPlaylist })
                }
              >
                <Clamp str={title} maxLength={CharacterLimit.TITLE_LENGTH} />
              </H1>
            ),
            titleM
          )}
        </RenderMaybe>

        {/* Show Name to be displayed in different places for Live and Playlist player */}
        {(isListing || isPlaylist) && (
          <RenderMaybe>
            {M.map(
              (showName) => (
                <H3
                  className={
                    isListing
                      ? styles.title1
                      : cn(styles.title2, { [styles.title2to1]: isPlaylist })
                  }
                >
                  <Clamp
                    str={showName}
                    maxLength={CharacterLimit.TITLE_LENGTH}
                  />
                </H3>
              ),
              showNameM
            )}
          </RenderMaybe>
        )}

        {/* Description should be displayed in different places for VOD and Live/Playlist player */}
        <div
          className={cn(styles.description, {
            [styles.liveOrPlaylistDescription]: isListing || isPlaylist,
          })}
        >
          <RenderMaybe>
            {M.map(
              (description) => (
                <div
                  className={styles.descriptionDetails}
                  data-sonic-attribute="description"
                >
                  <P>
                    <Clamp
                      str={description}
                      maxLength={CharacterLimit.LONG_DESCRIPTION_LENGTH}
                    />
                  </P>
                </div>
              ),
              descriptionM
            )}
          </RenderMaybe>
        </div>

        {/* Secondary Metadata should be displayed in different places for VOD and Live/Playlist player */}
        <div
          className={cn(styles.secondaryMetadata, {
            [styles.liveOrPlaylistSecondaryMetadata]: isListing || isPlaylist,
          })}
        >
          <RenderMaybe>
            {M.map(
              (seasonAndEpisode) => (
                <P className={styles.seasonEpisode}>{seasonAndEpisode}</P>
              ),
              seasonAndEpisodeM({
                seasonNumberM: seasonNumberM,
                episodeNumberM: episodeNumberM,
              })
            )}
          </RenderMaybe>
          {/* Removing air date for Live player */}
          <DurationRatingAirdate
            videoDurationM={videoDurationM}
            ratingM={ratingM}
            airDateM={isListing ? M.empty() : airDateM}
            publishStartM={isListing ? M.empty() : publishStartM}
            className={styles.durationRatingAirdate}
          />
        </div>

        {/* Display My List button only for VOD and Playlist player */}
        {(isEpisode || isPlaylist) && (
          <MyListButton
            id={id}
            category={kind}
            isFavorited={M.fromMaybe(isFavoriteM, false)}
            theme={MyListButtonTheme.Light}
            className={cn(styles.myListButton, {
              [styles.playlistMyListButton]: isPlaylist,
            })}
            showToast
          />
        )}
      </div>
    </div>
  );
};

export default VideoDetails;
