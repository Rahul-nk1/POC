import { Fold, Lens } from "@discovery/prelude/lib/control/lens";
import * as M from "@discovery/prelude/lib/data/maybe";
import { head } from "@discovery/prelude/lib/data/iterable";
import * as Optics from "@discovery/sonic-api-ng-optics";
import { toScheduleTime, toDurationM } from "../../../../../utils/date";
import { LinkKind } from "../../../../../components/tve/atoms/link";
import { _Video2ShowLink, _Video2ShowName } from "./show";
import { Kind } from "../../../../../components/tve/molecules/card";

const _ColItem2VideoAttribute = Fold.compose(
  Optics._ColItem2Video,
  Optics._Video2Attributes
);

const _ColItem2ChannelId = Fold.pre(
  Fold.compose(
    Optics._ColItem2Video,
    Optics._Video2PrimaryChannel,
    Optics._Channel2Data,
    Lens.prop("id")
  )
);

const _PrimaryChannelLogo = Fold.pre(
  Fold.compose(
    Optics._ColItem2Video,
    Optics._Video2PrimaryChannel,
    Optics._Channel2ImagesOfKind("logo"),
    Optics._Image2Attributes,
    Lens.prop("src")
  )
);

const scheduleLinkM = M.of({
  name: "Full Live Schedule",
  link: {
    href: "/live-now",
    kind: LinkKind.eventListenerOnly,
  },
});

export const _VideoDetailsProps = Fold.compose(
  Optics._Col2Items,
  Fold.liftM(
    (channelIdM, attributes, linkM, channelIconM, showNameM) => {
      const isLive = M.foldMapConst(
        (videoType) => videoType === "LIVE",
        false,
        attributes.videoType
      );

      const isListing = M.foldMapConst(
        (videoType) => videoType === "LISTING",
        false,
        attributes.videoType
      );

      const isEpisode = M.foldMapConst(
        (videoType) => videoType === "EPISODE",
        false,
        attributes.videoType
      );

      const ratingM = M.map(
        (q) => q.code,
        M.chain(
          (contentRatings) => head(contentRatings),
          attributes.contentRatings
        )
      );

      return {
        titleM: M.of(attributes.name),
        showNameM: showNameM,
        isFavoriteM: attributes.isFavorite,
        kind: Kind.Video,
        descriptionM: attributes.description,
        secondaryTitleM: attributes.secondaryTitle,
        timestampM: isLive
          ? toScheduleTime(attributes.scheduleStart, attributes.scheduleEnd)
          : toDurationM(attributes.videoDuration),
        scheduleStartM: attributes.scheduleStart,
        publishStartM: attributes.publishStart,
        ratingM,
        airDateM: attributes.airDate,
        episodeNumberM: attributes.episodeNumber,
        seasonNumberM: attributes.seasonNumber,
        videoTypeM: attributes.videoType,
        videoDurationM: attributes.videoDuration,
        linkM: isListing ? scheduleLinkM : linkM,
        channelIdM: isListing ? channelIdM : M.empty(),
        channelIconM,
        isEpisode,
        isListing,
      };
    },
    _ColItem2ChannelId,
    _ColItem2VideoAttribute,
    _Video2ShowLink,
    _PrimaryChannelLogo,
    _Video2ShowName
  )
);
