import * as M from "@discovery/prelude/lib/data/maybe";
import { BottomDrawer } from "../";
import { MobileEpisodeDrawer } from "../../card/standard";
import { Video, Kind } from "../../../molecules/card/types";
import { Milliseconds } from "@discovery/nominal-time-ng";

const videoContent: Video = {
  id: "2170727",
  kind: Kind.Video,
  videoTypeM: M.of("EPISODE"),
  broadcastTypeM: M.empty(),
  parentIdM: M.empty(),
  showNameM: M.of("90 Day Fiancé: What Now?"),
  showUrlM: M.empty(),
  progressM: M.empty(),
  titleM: M.of("David & Annie Pt. 3"),
  episodeNumberM: M.of(108),
  videoDurationM: M.of(2323266 as Milliseconds),
  seasonNumberM: M.of(3),
  ratingM: M.of("TV-PG"),
  airDateM: M.of(new Date()),
  isLiveM: M.of(false),
  publishStartM: M.of(new Date()),
  playbackAllowed: true,
  scheduleStartM: M.empty(),
  scheduleEndM: M.empty(),
  channelRouteM: M.of({
    url: "",
    canonical: true,
  }),
  descriptionM: M.of(
    "David has some big news for Annie regarding her visa status."
  ),
  isNewM: M.of(false),
  longDescriptionM: M.of(
    "David has some big news for Annie regarding her visa status, and Annie enjoys her first Halloween in the US surrounded by friends and family."
  ),
  imageM: M.empty(),
  expandedImageM: M.empty(),
  linkM: M.empty(),
  channelLogoM: M.empty(),
  badgeM: M.empty(),
};

export default {
  "Bottom Drawer": () => (
    <>
      <div id="bottom-drawer" />
      <BottomDrawer close={() => {}}>
        <MobileEpisodeDrawer
          isFavorite={true}
          setIsFavorite={() => {
            true;
          }}
          content={videoContent}
          onClick={() => {}}
        />
      </BottomDrawer>
    </>
  ),
};
