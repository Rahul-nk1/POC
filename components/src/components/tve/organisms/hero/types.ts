import * as M from "@discovery/prelude/lib/data/maybe";
import { ChannelData } from "@discovery/sonic-api-ng/lib/api/content/channels/resource";
import { ImageData } from "@discovery/sonic-api-ng/lib/api/cms/images/resource";
import { useActiveVideoForShow } from "../../../../utils/hooks/use-active-video-for-show";

import { HeroCoverSizes } from "../../molecules/hero-cover";
import { MetaLink } from "../../molecules/hero-metadata";
import { HeroTemplate } from "../../../../site-builder/tve/components/hero";

import { DeferredType } from "../../../../utils/tve/deferred";
import type { Ref } from "../../../../utils/types";
import { Tags } from "../../../../utils/types";

export enum LoadMapKind {
  Default = "default",
  Playlist = "playlist",
}
export interface LoadMap {
  channelLogo: boolean;
  coverImage: boolean;
  ctaButton: boolean;
  favoriteButton: boolean;
  showLogo: boolean;
}

export type LoadMapItem = Record<keyof LoadMap, boolean>;

export interface LoadMapDeferred<T> {
  channelLogo?: DeferredType<T>;
  coverImage: DeferredType<T>;
  ctaButton: DeferredType<T>;
  favoriteButton: DeferredType<T>;
  showLogo: DeferredType<T>;
}

export type TweenProps = {
  duration: number;
  tweenRefs: TweenRefs;
  onComplete?: () => void;
};

/**
 * @NOTE -- `refChannelLogo` is `HTMLImageElement` rather than `HTMLDivElement`
 *    - because `ChannelLogo` exports an HTML `img` tag rather than a wrapped component
 */
export interface TweenRefs {
  refActiveVideo?: Ref<Tags>;
  refChannelLogo?: Ref<Tags>;
  refChannelLogoMobile?: Ref<Tags>;
  refCoverImage?: Ref<Tags>;
  refCtaButton?: Ref<Tags>;
  refDescription?: Ref<Tags>;
  refFavoriteButton?: Ref<Tags>;
  refLiveBadge?: Ref<Tags>;
  refMetadataContainer?: Ref<Tags>;
  refProgressBar?: Ref<Tags>;
  refShowLogo?: Ref<Tags>;
  refTuneInText?: Ref<Tags>;
  shouldTween?: boolean;
}

export type MetadataProps = {
  channelLogoM?: M.Maybe<ImageData["attributes"]>;
  channelLogoMobileM?: M.Maybe<ImageData["attributes"]>;
  channelAttrM?: M.Maybe<ChannelData["attributes"]>;
  channelNameM: M.Maybe<string>;
  contentIdM?: M.Maybe<string>;
  kind: HeroKind;
  locked: boolean;
  plateCtaM: M.Maybe<string>;
  plateDescriptionM: M.Maybe<string>;
  plateLinkM: M.Maybe<MetaLink>;
  plateTitleM: M.Maybe<string>;
  isFavoriteM?: M.Maybe<boolean>;
  isLiveM?: M.Maybe<boolean>;
  showLogoM: M.Maybe<ImageData["attributes"]>;
  templateId?: HeroTemplate;
  tuneInTextM: M.Maybe<string>;
};

export type CompactMetadataProps = MetadataProps & {
  activeVideoForShowMRD: ReturnType<typeof useActiveVideoForShow>;
  className?: string;
  contentIdM: M.Maybe<string>;
};

export type HeroAttrs = {
  isCarousel?: boolean;
  isCompact?: boolean;
  isPlaylist?: boolean;
  isPrimary?: boolean;
};

export type HeroProps = HeroAttrs & {
  activeVideoForShowAlternateIdM?: M.Maybe<string>;
  className?: string;
  contentIdM?: M.Maybe<string>;
  contentIndex?: number;
  coverImageM?: M.Maybe<ImageData["attributes"]>;
  coverSizeM?: M.Maybe<HeroCoverSizes>;
  metadataM?: M.Maybe<MetadataProps>;
  mobileCoverImageM?: M.Maybe<ImageData["attributes"]>;
  onClick?: (e: MouseEvent) => void;
  templateId: HeroTemplate;
};

export enum HeroKind {
  Article = "article",
  Channel = "channel",
  Generic = "generic",
  Image = "image",
  Link = "link",
  Show = "show",
  Video = "video",
}

export const getHeroTemplate = (templateId: string) => {
  switch (templateId) {
    case "carousel":
      return HeroTemplate.Carousel;
    case "playlist":
      return HeroTemplate.Playlist;
    case "standard":
    default:
      return HeroTemplate.Standard;
  }
};
