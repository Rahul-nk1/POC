import { constFalse, constTrue } from "fp-ts/function";
import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as Pagination from "@discovery/orchestra/lib/pagination";
import { head } from "@discovery/prelude/lib/data/iterable";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import {
  videoAssetExternal,
  playlistExternal,
} from "@discovery/sonic-player-tve";
import {
  useEffect,
  useGlobalStateModifier,
  useGlobalState,
  useState,
  useRef,
  useMemo,
} from "@discovery/common-tve/lib/hooks";
import { EventDataProvider } from "@discovery/common-tve/lib/eventing";
import { _IsSearchOpen, _IsPlayerPage } from "@discovery/common-tve/lib/state";

import { LinkKind } from "../../../../components/tve/atoms/link";
import { H3 } from "../../../../components/tve/atoms/text";
import { ListContainer } from "../../../../components/tve/atoms/list-container";
import { Content } from "../../../../components/tve/molecules/card";
import {
  LazyLoader,
  LoadingType,
} from "../../../../components/tve/molecules/lazy-loader";
import { colRequest } from "../../../../components/tve/organisms/content-grid/paginated";
import { VideoDetails } from "../../../../components/tve/molecules/video-details";
import { Detailed } from "../../../../components/tve/molecules/card";
import { useScrollLock } from "../../../../utils/hooks/use-scroll-lock";
import { shouldPaginate } from "../../../../utils/render";
import { Tags } from "../../../../utils/types";
import { VideoWrapper } from "../player";
import { PlayerViewProps } from "./types";
import { PlayerImperativeInterface } from "@discovery/sonic-player-tve";
import Strings from "../../../../components/tve/hardcoded.json";
import * as styles from "./styles.css";
import { InlineCollectionRenderer } from "../../utils/inline-rendering";

const View = ({
  Player,
  collectionId,
  video,
  collectionRequest = colRequest,
  paginationContinue,
  paginatedContent,
  setPlayIndexM,
}: {
  Player: PlayerViewProps["Player"];
  collectionId: string;
  video: Content;
  collectionRequest: PlayerViewProps["collectionRequest"];
  paginationContinue: PlayerViewProps["paginationContinue"];
  paginatedContent: PlayerViewProps["paginatedContent"];
  setPlayIndexM: PlayerViewProps["setPlayIndexM"];
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
        key={video.id}
        streamId={playlistExternal({
          collectionId,
          currentAsset: videoAssetExternal(video.id),
        })}
        callbacks={{
          onPlayNext: (responseData) => {
            const idM = M.map(
              ({ id }) => id,
              M.chain((video) => head(video), M.of(responseData?.data))
            );
            const indexM = M.map(
              (id) => L.findIndex((c) => c.id === id, paginatedContent),
              idM
            );
            if (
              shouldPaginate<Content>(paginatedContent, M.fromMaybe(indexM, 0))
            ) {
              Pagination.fetchMore(collectionRequest)(paginationContinue);
            }
            setPlayIndexM(indexM);
          },
          onPlay: () => setPlaying(true),
          onPause: () => setPlaying(false),
        }}
      />
    ),
    [
      collectionId,
      collectionRequest,
      paginationContinue,
      paginatedContent,
      setPlayIndexM,
      video,
      Player,
    ]
  );
};

export const PlayerView = ({
  collectionIdM = M.empty(),
  Player,
  titleM = M.empty(),
  collectionRequest = colRequest,
  playIndexM = M.empty(),
  setPlayIndexM,
  loadingType,
  paginatedContent,
  paginationContinue,
  onClick,
  lazyLoadedProps,
  componentIdM,
  aliasM,
}: PlayerViewProps) => {
  /**
   * @TODO -- cleaner state <-> context connection
   *  - despite having PlaylistMetaContext and PageMetaContext,
   *    some footer presentation changes based on if we're on a Player page
   *  - way too much code here to toggle one state variable
   *  -> pipe this into Global State
   *
   * @TODO -- refactor layout
   *  - this Player is NOT the same as the VOD player and is overlaid atop
   *    the Playilst Grid View via `position: fixed`
   *  - while being a bad CSS hack, we also do not display the footer here
   *  - the URL doesn't change
   *  - back buttons don't work properly
   *  - no footer!
   */

  const modifyState = useGlobalStateModifier(constTrue, _IsPlayerPage);
  const modifyStateUnmount = useGlobalStateModifier(constFalse, _IsPlayerPage);

  useEffect(() => {
    modifyState();

    return () => {
      modifyStateUnmount();
    };
    // we only want this to run on mount + unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If there is a played content, we lock the scroll
  const isScrollLocked = M.foldMapConst(() => true, false, playIndexM);
  useScrollLock(isScrollLocked);

  return (
    <RenderMaybe>
      {M.chain(
        (playIndex) =>
          M.map((video) => {
            const videoLength = L.length(paginatedContent);
            const start = playIndex + 1;
            const end =
              loadingType === LoadingType.Automatic ? videoLength : start + 3;
            const isUpNextVisible = start < videoLength;
            const isSeeAllButtonVisible = videoLength > end;
            const linkM = M.map(
              (name) => ({
                name,
                link: {
                  onClick: () => {
                    setPlayIndexM(M.empty());
                  },
                  href: "",
                  kind: LinkKind.eventListenerOnly,
                },
              }),
              titleM
            );

            return (
              <div className={styles.container}>
                <div className={styles.videoContainer}>
                  <div className={styles.videoElementWrapper} key={video.id}>
                    <div className={styles.videoElement}>
                      <VideoWrapper>
                        <RenderMaybe>
                          {M.map(
                            (collectionId) => (
                              <View
                                Player={Player}
                                collectionId={collectionId}
                                video={video}
                                paginationContinue={paginationContinue}
                                paginatedContent={paginatedContent}
                                collectionRequest={collectionRequest}
                                setPlayIndexM={setPlayIndexM}
                              />
                            ),
                            collectionIdM
                          )}
                        </RenderMaybe>
                      </VideoWrapper>
                    </div>
                  </div>
                  <div id="spacer" className={styles.spacer} />
                  <VideoDetails {...video} isPlaylist linkM={linkM} />
                </div>
                {isUpNextVisible && (
                  <div className={styles.upNext}>
                    <ListContainer>
                      <H3 className={styles.upNextHeader}>{Strings.upNext}</H3>
                      <LazyLoader<Content>
                        {...lazyLoadedProps}
                        showLoadMoreButton={isSeeAllButtonVisible}
                        paginatedContent={L.slice(start, end, paginatedContent)}
                      >
                        {(card) => (
                          <EventDataProvider
                            content={card}
                            componentIdM={componentIdM}
                            alias={M.fromMaybe(aliasM, "")}
                          >
                            <Detailed
                              key={card.id}
                              headerTag={Tags.h4}
                              linkKind={LinkKind.eventListenerOnly}
                              onClick={onClick}
                              content={card}
                              isPlaylist
                              useLargeImages
                            />
                          </EventDataProvider>
                        )}
                      </LazyLoader>
                    </ListContainer>
                  </div>
                )}
                <InlineCollectionRenderer collection="web-footer" />
              </div>
            );
          }, L.nth(playIndex, paginatedContent)),
        playIndexM
      )}
    </RenderMaybe>
  );
};
