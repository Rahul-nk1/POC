import { DEVELOPMENT_MODE } from "@discovery/common-tve/lib/env";
import { ComponentId } from "@discovery/components-tve/lib/site-builder/tve/mapping";
import { ComponentId as ComponentIdCourtesy } from "@discovery/components-tve/lib/site-builder/courtesy/mapping";
import * as Info from "@discovery/components-luna/lib/template-engine/info-page";
import * as Noop from "@discovery/components-luna/lib/template-engine/noop-component";
import * as Article from "@discovery/components-tve/lib/site-builder/tve/components/article";
import * as Playlist from "@discovery/components-tve/lib/site-builder/tve/components/playlist";
import * as CampaignHero from "@discovery/components-tve/lib/site-builder/tve/components/campaign-hero";
import * as MenuBar from "@discovery/components-tve/lib/site-builder/tve/components/menu-bar";
import * as TabbedContent from "@discovery/components-tve/lib/site-builder/tve/components/tabbed-content";
import * as TabbedComponent from "@discovery/components-tve/lib/site-builder/tve/components/tabbed-component";
import * as Player from "@discovery/components-tve/lib/site-builder/tve/components/player";
import * as ErrorWall from "@discovery/components-tve/lib/site-builder/courtesy/components/error-wall";
import { ComponentMap } from "@discovery/template-engine/lib/component-map";
import { Reader } from "@discovery/common-tve/lib/reader";
import * as Hero from "@discovery/components-tve/lib/site-builder/tve/components/hero";
import * as ContentGrid from "@discovery/components-tve/lib/site-builder/tve/components/content-grid";
import * as Footer from "@discovery/components-tve/lib/site-builder/tve/components/footer";
import * as PromotionBanner from "@discovery/components-tve/lib/site-builder/tve/components/promotion-banner";
import * as RedirectionBanner from "@discovery/components-tve/lib/site-builder/tve/components/redirection-banner";
const INFO: ComponentMap<Reader> = {
  default: DEVELOPMENT_MODE ? Info.ComponentMapItem : Noop.ComponentMapItem,
};

/**
 * Courtesy components are fetched from the "courtesy" publishing site whenever Sonic deems user to be
 * "geo-blocked"
 */
const COURTESY_COMPONENTS: ComponentMap<Reader> = {
  ...INFO,
  [ComponentIdCourtesy.ErrorWall]: ErrorWall.ComponentMapItem,
};

export const COMPONENT_MAP: ComponentMap<Reader> = {
  ...INFO,
  [ComponentId.Article]: Article.ComponentMapItem,
  [ComponentId.CampaignHero]: CampaignHero.ComponentMapItem,
  [ComponentId.MenuBar]: MenuBar.ComponentMapItem,
  [ComponentId.Playlist]: Playlist.ComponentMapItem,
  [ComponentId.Player]: Player.ComponentMapItem,
  [ComponentId.TabbedContent]: TabbedContent.ComponentMapItem,
  [ComponentId.TabbedComponent]: TabbedComponent.ComponentMapItem,
  [ComponentId.Hero]: Hero.ComponentMapItem,
  [ComponentId.ContentGrid]: ContentGrid.ComponentMapItem,
  [ComponentId.Footer]: Footer.ComponentMapItem,
  [ComponentId.PromotionBanner]: PromotionBanner.ComponentMapItem,
  [ComponentId.RedirectionBanner]: RedirectionBanner.ComponentMapItem,
  ...COURTESY_COMPONENTS,
};
