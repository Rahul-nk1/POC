import { Milliseconds } from "@discovery/nominal-time-ng";
import * as M from "@discovery/prelude/lib/data/maybe";
import { ImageData } from "@discovery/sonic-api-ng/lib/api/cms/images/resource";
import { RouteData } from "@discovery/sonic-api-ng/lib/api/cms/routes/resource";
import { VideoData } from "@discovery/sonic-api-ng/lib/api/content/videos/resource";
import { LinkKind } from "../../atoms/link";
import { Tags } from "../../../../utils/types";
import { ChannelData } from "@discovery/sonic-api-ng/lib/api/content/channels/resource";

export type Content = Video | Show | Channel | Link | Image | Article;

export const enum Kind {
  Video = "video",
  Show = "show",
  Channel = "channel",
  Link = "link",
  Image = "image",
  Article = "article",
}

/**
 * VideoType enum is non-maybe values from the Video.videoTypeM type, which is:
 *   VideoData["attributes"]["videoType"]
 */
export const enum VideoType {
  Episode = "EPISODE",
  Standalone = "STANDALONE",
  Clip = "CLIP",
  Trailer = "TRAILER",
  FollowUp = "FOLLOW_UP",
  Live = "LIVE",
  Listing = "LISTING",
}

type BaseContent = {
  descriptionM: M.Maybe<string>;
  expandedImageM: M.Maybe<ImageData["attributes"]>;
  id: string;
  imageM: M.Maybe<ImageData["attributes"]>;
  imageFallbackList?: Array<M.Maybe<ImageData["attributes"]>>;
  isFavoriteM?: M.Maybe<boolean>;
  linkM: M.Maybe<string>;
  titleM: M.Maybe<string>;
  channelAttrM?: M.Maybe<ChannelData["attributes"]>;
};

export type VideoProgress = {
  completed: boolean;
  percent: number;
};

export type Video = BaseContent & {
  airDateM: M.Maybe<Date>;
  badgeM: M.Maybe<string>;
  broadcastTypeM: VideoData["attributes"]["broadcastType"];
  channelIdM?: M.Maybe<string>;
  channelLogoM: M.Maybe<ImageData["attributes"]>;
  channelRouteM: M.Maybe<RouteData["attributes"]>;
  episodeNumberM: M.Maybe<number>;
  isFavoriteM?: M.Maybe<boolean>;
  isLiveM: M.Maybe<boolean>;
  isNewM: M.Maybe<boolean>;
  kind: Kind.Video;
  linkM: M.Maybe<string>;
  longDescriptionM: M.Maybe<string>;
  parentIdM: M.Maybe<string>;
  playbackAllowed: boolean;
  progressM: M.Maybe<VideoProgress>;
  publishStartM: M.Maybe<Date>;
  ratingM: M.Maybe<string>;
  scheduleEndM: M.Maybe<Date>;
  scheduleStartM: M.Maybe<Date>;
  seasonNumberM: M.Maybe<number>;
  showNameM: M.Maybe<string>;
  showUrlM: M.Maybe<string>;
  videoDurationM: M.Maybe<Milliseconds>;
  videoTypeM: VideoData["attributes"]["videoType"];
};

export type Show = BaseContent & {
  badgeM: M.Maybe<string>;
  channelLogoM: M.Maybe<ImageData["attributes"]>;
  channelRouteM: M.Maybe<RouteData["attributes"]>;
  kind: Kind.Show;
  longDescriptionM: M.Maybe<string>;
  seasonCountM: M.Maybe<number>;
};

export type Channel = BaseContent & {
  kind: Kind.Channel;
};

export type Link = BaseContent & {
  kind: Kind.Link;
};

export type Image = BaseContent & {
  kind: Kind.Image;
};

export type Article = BaseContent & {
  kind: Kind.Article;
};

export type CardData<T = Content> = {
  content: T;
  showChannelLogo?: boolean;
  className?: string;
  onClick?: (
    e: React.MouseEvent<Element, MouseEvent>,
    content: Content
  ) => void;
  onFavoriteChange?: (id: string, favorited: boolean) => void;
  linkKind?: LinkKind;
  headerTag?: Tags;
};
