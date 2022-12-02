import * as M from "@discovery/prelude/lib/data/maybe";
import { ImageData } from "@discovery/sonic-api-ng/lib/api/cms/images/resource";
import { Milliseconds } from "@discovery/nominal-time-ng";

import { Video, Kind } from "../../../molecules/card/types";
import {
  Poster,
  Standard,
  Detailed,
  PosterKind,
  HighlightLarge,
  DetailedHighlight,
} from "..";

const dummyImage: ImageData["attributes"] = {
  alias: M.empty(),
  cropCenter: M.empty(),
  default: M.empty(),
  description: M.empty(),
  height: 50,
  kind: "kind",
  src:
    "https://us1-test-images.disco-api.com/2020/02/06/9eed9aa0-4941-383e-8e9f-a2b46554d9e4.jpeg?bf=0&f=jpg&p=true&q=85&w=400",
  title: M.empty(),
  width: 50,
};

const dummyEpisodeContent: Video = {
  id: "15",
  kind: Kind.Video,
  videoTypeM: M.of("EPISODE"),
  broadcastTypeM: M.of("REPLAY"),
  parentIdM: M.of("123354"),
  showNameM: M.of("Dummy Show Name"),
  showUrlM: M.empty(),
  progressM: M.empty(),
  titleM: M.of("Dummy Title"),
  episodeNumberM: M.of(4),
  videoDurationM: M.of(2323266 as Milliseconds),
  seasonNumberM: M.of(2),
  ratingM: M.of("NC-17"),
  airDateM: M.of(new Date()),
  isLiveM: M.of(false),
  publishStartM: M.of(new Date()),
  playbackAllowed: true,
  scheduleStartM: M.of(new Date(new Date().getTime() - 15 * 60 * 1000)),
  scheduleEndM: M.of(new Date(new Date().getTime() + 45 * 60 * 1000)),
  channelRouteM: M.of({
    url: "",
    canonical: true,
  }),
  descriptionM: M.of(
    "Dummy description, stuff stuff stuff and some more stuff we want the description to be a bit longer"
  ),
  isNewM: M.of(false),
  longDescriptionM: M.empty(),
  imageM: M.of(dummyImage),
  expandedImageM: M.empty(),
  linkM: M.empty(),
  channelLogoM: M.empty(),
  badgeM: M.empty(),
};

const dummyClipContent: Video = {
  ...dummyEpisodeContent,
  videoTypeM: M.of("CLIP"),
  showNameM: M.of("My big fat pimple poppin"),
};

const withProgressBar: Video = {
  ...dummyEpisodeContent,
  progressM: M.of({
    percent: 66.5,
    completed: false,
  }),
};

export default {
  "Standard - Episode": <Standard content={dummyEpisodeContent} />,
  "Standard - Clip": <Standard content={dummyClipContent} />,
  Standard: <Standard content={dummyEpisodeContent} />,
  "Standard w/ Progress Bar": <Standard content={withProgressBar} />,
  Detailed: <Detailed content={dummyEpisodeContent} />,
  "Poster - primary": (
    <Poster content={dummyEpisodeContent} kind={PosterKind.Primary} />
  ),
  "Poster - secondary": (
    <Poster content={dummyEpisodeContent} kind={PosterKind.Secondary} />
  ),
  "Detailed Highlight": <DetailedHighlight content={dummyEpisodeContent} />,
  "Highlight Large": <HighlightLarge content={withProgressBar} />,
};
