import * as M from "@discovery/prelude/lib/data/maybe";
import * as L from "@discovery/prelude/lib/data/list";
import { Milliseconds } from "@discovery/nominal-time-ng";
import {
  gridMap,
  Kind,
} from "../../../../../site-builder/tve/components/content-grid";
import { PaginationButton } from "../../../../tve/organisms/content-grid/paginated";
import { Video, Kind as contentKind } from "../../../molecules/card/types";
import { MainContainer } from "../../../atoms/main-container";
import { ContentGrid } from "../";
import * as styles from "../styles.css";
const dummyImage = M.of({
  alias: M.empty(),
  kind: "poster_with_logo",
  default: M.of(true),
  height: 2160,
  width: 2560,
  src:
    "https://us1-test-images.disco-api.com/2020/07/07/b4cf0f99-5861-3800-8647-b4d3c23a54db.jpeg",
  title: M.empty(),
  description: M.empty(),
  cropCenter: M.empty(),
});

const videoContent: Video = {
  id: "",
  kind: contentKind.Video,
  videoTypeM: M.of("EPISODE"),
  broadcastTypeM: M.empty(),
  parentIdM: M.empty(),
  showNameM: M.of("90 Day Fiancé: What Now?"),
  showUrlM: M.empty(),
  titleM: M.of("David & Annie Pt. 3"),
  episodeNumberM: M.of(108),
  videoDurationM: M.of(2323266 as Milliseconds),
  seasonNumberM: M.of(3),
  ratingM: M.of("TV-PG"),
  airDateM: M.of(new Date(2021, 0, 11)),
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
    "David has some big news for Annie regarding her visa status, and Annie enjoys her first Halloween in the US surrounded by friends and family."
  ),
  isNewM: M.of(false),
  longDescriptionM: M.of(
    "David has some big news for Annie regarding her visa status, and Annie enjoys her first Halloween in the US surrounded by friends and family."
  ),
  imageM: dummyImage,
  imageFallbackList: Array(dummyImage),
  expandedImageM: M.empty(),
  linkM: M.empty(),
  channelLogoM: M.empty(),
  badgeM: M.empty(),
  progressM: M.of({
    percent: 66.5,
    completed: false,
  }),
};

const content = L.from([
  { ...videoContent, id: "1" },
  { ...videoContent, id: "2" },
  { ...videoContent, id: "3" },
  { ...videoContent, id: "4" },
  { ...videoContent, id: "5" },
]);

const StandardGrid = gridMap[Kind.Standard];
const PosterPrimaryGrid = gridMap[Kind.PosterPrimary];
const PosterSecondaryGrid = gridMap[Kind.PosterSecondary];
const DetailGrid = gridMap[Kind.Detail];

export default {
  "ContentGrid - Standard": (
    <MainContainer classNameM={M.of(styles.sectionTitleFixture)}>
      <ContentGrid isEmpty={false} titleM={M.of("Section Title")}>
        <StandardGrid
          contentL={content}
          paginationM={M.of(
            <PaginationButton
              show={true}
              loading={false}
              onClick={() => {}}
              title={"More"}
            />
          )}
        />
      </ContentGrid>
    </MainContainer>
  ),
  "ContentGrid - PosterPrimary": (
    <MainContainer>
      <ContentGrid isEmpty={false} titleM={M.of("Section Title")}>
        <PosterPrimaryGrid
          contentL={content}
          paginationM={M.of(
            <PaginationButton
              show={true}
              loading={false}
              onClick={() => {}}
              title={"More"}
            />
          )}
        />
      </ContentGrid>
    </MainContainer>
  ),
  "ContentGrid - PosterSecondary": (
    <MainContainer>
      <ContentGrid isEmpty={false} titleM={M.of("Section Title")}>
        <PosterSecondaryGrid
          contentL={content}
          paginationM={M.of(
            <PaginationButton
              show={true}
              loading={false}
              onClick={() => {}}
              title={"More"}
            />
          )}
        />
      </ContentGrid>
    </MainContainer>
  ),
  "ContentGrid - Detail": (
    <MainContainer>
      <ContentGrid isEmpty={false} titleM={M.of("Section Title")}>
        <DetailGrid
          contentL={content}
          paginationM={M.of(
            <PaginationButton
              show={true}
              loading={false}
              onClick={() => {}}
              title={"More"}
            />
          )}
        />
      </ContentGrid>
    </MainContainer>
  ),
};
