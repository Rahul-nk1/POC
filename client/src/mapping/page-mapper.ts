import { DEVELOPMENT_MODE } from "@discovery/common-tve/lib/env";
import { PageComponentId } from "@discovery/components-tve/lib/site-builder/tve/mapping";
import * as Info from "@discovery/components-luna/lib/template-engine/info-page";
import * as Noop from "@discovery/components-luna/lib/template-engine/noop-component";
import * as Page from "@discovery/components-tve/lib/site-builder/tve/pages/page";
import * as PlaylistPage from "@discovery/components-tve/lib/site-builder/tve/pages/playlist-page";
import * as TabbedPage from "@discovery/components-tve/lib/site-builder/tve/pages/tabbed-page";
import * as SearchPage from "@discovery/components-tve/lib/site-builder/tve/pages/search-page";

import { ComponentMap } from "@discovery/template-engine/lib/component-map";
import { Reader } from "@discovery/common-tve/lib/reader";

const INFO: ComponentMap<Reader> = {
  default: DEVELOPMENT_MODE ? Info.ComponentMapItem : Noop.ComponentMapItem,
};

export const PAGE_MAP: ComponentMap<Reader> = {
  ...INFO,
  [PageComponentId.Page]: Page.ComponentMapItem,
  [PageComponentId.PlaylistPage]: PlaylistPage.ComponentMapItem,
  [PageComponentId.TabbedPage]: TabbedPage.ComponentMapItem,
  [PageComponentId.SearchPage]: SearchPage.ComponentMapItem,
};
