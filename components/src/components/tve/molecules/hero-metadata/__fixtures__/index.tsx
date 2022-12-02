import { GenericMetadata, GenericMetadataProps } from "../generic";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as styles from "../styles.css";
import { HeroKind } from "../../../organisms/hero/types";
import { Images } from "@discovery/sonic-api-ng/lib/api/cms";
import { HeroTemplate } from "../../../../../site-builder/tve/components/hero";

const dummyImage: Images.Attributes.Attributes = {
  alias: M.empty(),
  cropCenter: M.empty(),
  default: M.of(false),
  description: M.empty(),
  height: 100,
  kind: "poster",
  src:
    "https://us1-test-images.disco-api.com/2020/07/21/ffb36650-87fc-327c-b042-f0d0f419ee68.png",
  title: M.empty(),
  width: 100,
};

const activeVideoObject = JSON.parse(
  `{"tag":"Success","type":"Tag","value":{"_tag":"Some","value":{"url":"/video/7-little-johnstons/birds-and-bees-make-babies","attributes":{"airDate":{"_tag":"Some","value":"2015-04-01T02:00:00.000Z"},"alternateId":"birds-and-bees-make-babies","availabilityWindows":{"_tag":"Some","value":[{"package":"Tlc","playableEnd":{"_tag":"Some","value":"2029-12-31T05:00:00.000Z"},"playableStart":"2015-09-24T04:00:00.000Z"}]},"broadcastType":{"_tag":"None"},"clearkeyEnabled":false,"contentDescriptors":{"_tag":"Some","value":[{"system":"US-TV","code":"L"},{"system":"US-TV","code":"D"}]},"contentRatings":{"_tag":"Some","value":[{"system":"US-TV","code":"TV-PG"}]},"customAttributes":{"_tag":"Some","value":{}},"description":{"_tag":"Some","value":"The Johnstons receive a shocking call from school."},"downloadWindow":{"_tag":"None"},"drmEnabled":false,"earliestPlayableStart":{"_tag":"Some","value":"2015-09-24T04:00:00.000Z"},"episodeNumber":{"_tag":"Some","value":1},"geoRestrictions":{"_tag":"Some","value":{"countries":["world"],"mode":"permit"}},"identifiers":{"analyticsId":{"_tag":"Some","value":"6f0b5256-5f32-4347-9bcc-2b2428c3ace6"},"epgId":{"_tag":"None"},"freewheel":"6f0b5256-5f32-4347-9bcc-2b2428c3ace6","originalMediaId":"149485.001.01.002"},"isExpiring":{"_tag":"Some","value":false},"isFavorite":{"_tag":"Some","value":false},"isNew":{"_tag":"Some","value":false},"isNextEpisode":{"_tag":"None"},"longDescription":{"_tag":"Some","value":"Trent and Amber Johnston are in the middle of renovating their dream home from top to bottom while raising five children. As they prepare for Anna and Elizabeth's first formal dance, they receive a shocking call from school."},"materialType":{"_tag":"None"},"minimumAge":{"_tag":"None"},"name":"Birds and Bees Make Babies","packages":{"_tag":"Some","value":["Tlc"]},"path":{"_tag":"Some","value":"7-little-johnstons/birds-and-bees-make-babies"},"publishEnd":{"_tag":"Some","value":"2029-12-31T05:00:00.000Z"},"publishStart":{"_tag":"Some","value":"2015-09-24T04:00:00.000Z"},"rating":{"_tag":"None"},"rights":{"embeddable":false},"scheduleEnd":{"_tag":"None"},"scheduleStart":{"_tag":"None"},"seasonNumber":{"_tag":"Some","value":1},"secondaryTitle":{"_tag":"None"},"sourceSystemId":"6f0b5256-5f32-4347-9bcc-2b2428c3ace6","sourceSystemName":{"_tag":"Some","value":"vdp"},"videoDuration":{"_tag":"Some","value":2520253},"videoResolution":{"_tag":"None"},"videoType":{"_tag":"Some","value":"EPISODE"},"viewingHistory":{"_tag":"Some","value":{"completed":{"_tag":"None"},"lastStartedTimestamp":{"_tag":"None"},"position":{"_tag":"None"},"viewed":false}},"playbackAllowed":{"_tag":"Some","value":true}},"viewingHistory":{"completed":{"_tag":"None"},"lastStartedTimestamp":{"_tag":"None"},"position":{"_tag":"None"},"viewed":false}}}}`
);

const metadataProps: GenericMetadataProps = {
  className: styles.basic,
  channelNameM: M.empty(),
  kind: HeroKind.Show,
  locked: false,
  contentIdM: M.of("696"),
  plateCtaM: M.of("Watch Now"),
  plateDescriptionM: M.of(
    "Discover how the Slaton sisters achieve their weight-loss journey."
  ),
  plateLinkM: M.empty(),
  plateTitleM: M.of("1000-lb Sisters"),
  isLiveM: M.of(false),
  isFavoriteM: M.of(false),
  showLogoM: M.of(dummyImage),
  templateId: HeroTemplate.Carousel,
  tuneInTextM: M.of("Tuesday's at 8PM Eastern"),
  activeVideoForShowMRD: activeVideoObject,
};

export default {
  carousel: <GenericMetadata {...metadataProps} />,
  standard: (
    <GenericMetadata
      {...{ ...metadataProps, templateId: HeroTemplate.Standard }}
    />
  ),
};
