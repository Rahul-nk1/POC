import { constFalse, pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as M from "@discovery/prelude/lib/data/maybe";
import { head } from "@discovery/prelude/lib/data/iterable";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { Fold } from "@discovery/prelude/lib/control/lens";
import {
  Child,
  mkComponentMapItem,
} from "@discovery/template-engine/lib/component-map";
import { VideoData } from "@discovery/sonic-api-ng/lib/api/content/videos/resource";
import {
  useEffect,
  useGlobalStateModifier,
  useGlobalState,
  useState,
  useRef,
  useMemo,
} from "@discovery/common-tve/lib/hooks";
import { _IsPlayerPage, _IsSearchOpen } from "@discovery/common-tve/lib/state";
import { Reader } from "@discovery/common-tve/lib/reader";
import { createPlayer, PlayerProps } from "../../../../utils/tve/createPlayer";
import { PlayerImperativeInterface } from "@discovery/sonic-player-tve";
import { _Video, _PrimaryChannel, _VideoDetailsProps } from "./optics";
import { VideoDetails } from "../../../../components/tve/molecules/video-details";
import * as styles from "./styles.css";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";

type VideoResponse = {
  data: [VideoData];
  meta: {
    fromCollectionId?: string;
  };
};

export const VideoWrapper = ({ children }: Child) => {
  const modifyStateUnmount = useGlobalStateModifier(constFalse, _IsPlayerPage);

  useEffect(
    () => () => modifyStateUnmount(),
    /**
     * we only want this to run on unmount, since `isPlayerPage`
     * will toggle to `true` in the `Page` component-creator,
     * since this component's ID is `Player`, unlike the Playlist player overlay.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className={styles.videoWrapper}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
};

const View = ({
  Player,
  streamId,
}: {
  Player: ReturnType<typeof createPlayer>;
  streamId: PlayerProps["streamId"];
}) => {
  const [isSearchOpen] = useGlobalState(_IsSearchOpen);
  const playerRef = useRef<PlayerImperativeInterface>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(false);
  const [wasSearchOpen, setWasSearchOpen] = useState(false);
  useEffect(() => {
    if (playerRef.current) {
      const { pause, play } = playerRef.current;

      if (isSearchOpen) {
        if (!wasSearchOpen) setWasPlaying(isPlaying);
        pause();
      } else if (wasSearchOpen && wasPlaying) {
        setWasPlaying(false);
        play();
      }
      setWasSearchOpen(isSearchOpen);
    }
  }, [isSearchOpen, isPlaying, wasSearchOpen, wasPlaying]);

  return useMemo(
    () => (
      <Player
        ref={playerRef}
        streamId={streamId}
        callbacks={{
          onPlayNext: (responseData: VideoResponse) => {
            M.map(
              ({ attributes }) =>
                window.location.assign(`/video/${attributes.path}`),
              M.chain(
                (video: Iterable<VideoData>) => head(video),
                M.of(responseData?.data)
              )
            );
          },
          onPlay: () => setPlaying(true),
          onPause: () => setPlaying(false),
        }}
      />
    ),
    [streamId, Player]
  );
};

const getProps = (data: CollectionResponseData) => {
  const videoPropsM = Fold.preview(_VideoDetailsProps, data);

  // If the video is a listing video, grab the `primaryChannel`,
  // else grab the `video` attached to it.
  const streamIdM = pipe(
    videoPropsM,
    O.chain(({ isListing }) =>
      isListing
        ? Fold.preview(_PrimaryChannel, data)
        : Fold.preview(_Video, data)
    )
  );

  return {
    streamIdM,
    videoPropsM,
  };
};

type Props = ReturnType<typeof getProps>;

// TODO the any below is because we do not use the State right now
// eslint-disable-next-line
const mkPlayer = (read: Reader) => {
  const Player = createPlayer(read);

  return ({ videoPropsM, streamIdM }: Props) => (
    <div className={styles.playerBackground}>
      <div className={styles.videoContainer}>
        <div className={styles.videoElementWrapper}>
          <div className={styles.videoElement}>
            <VideoWrapper>
              <RenderMaybe>
                {M.map(
                  (streamId) => (
                    <View Player={Player} streamId={streamId} />
                  ),
                  streamIdM
                )}
              </RenderMaybe>
            </VideoWrapper>
          </div>
        </div>
        <div id="spacer" className={styles.spacer} />
        <RenderMaybe>
          {M.liftA2(
            (videoProps) => (streamId) => {
              const props = {
                ...videoProps,
                id: streamId.id,
              };
              return <VideoDetails {...props} />;
            },
            videoPropsM,
            streamIdM
          )}
        </RenderMaybe>
      </div>
    </div>
  );
};

export const ComponentMapItem = mkComponentMapItem(getProps, mkPlayer);
