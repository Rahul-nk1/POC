import { Fold, Lens } from "@discovery/prelude/lib/control/lens";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import {
  record,
  optional,
  string,
} from "@discovery/prelude/lib/data/validated";
import {
  _Link2Attributes,
  _PageGetter,
  _LinkGetter,
  _GetCustomAttributesForPage,
  _Page2Items,
  _PageItem2Link,
} from "@discovery/sonic-api-ng-optics";
import * as M from "@discovery/prelude/lib/data/maybe";
import { PageResponseData } from "@discovery/sonic-api-ng/lib/api/cms/pages/resource";

import { NetworkSelectorTabType } from "../../../../components/tve/molecules/network-selector";

const _CollectionId = Fold.compose(
  _LinkGetter,
  Res._Response(),
  Lens.prop("relationships"),
  M._Just(),
  Lens.prop("linkedContent"),
  M._Just(),
  Lens.path("data", "id")
);

/**
 * TODO -- this really should be the same as `_NetworkSelectorChannels`
 *    in `component-creators/tabbed-content/optics.ts`
 *    but isn't because of how CMS data is set up
 */
export const _NetWorkSelectorTabs: Fold.Fold<
  PageResponseData,
  NetworkSelectorTabType
> = Fold.compose(
  _PageGetter,
  _Page2Items,
  _PageItem2Link,
  Fold.liftM(
    (imageM, attr, collectionId) => ({
      imageM,
      titleM: attr.title,
      linkedCollectionId: collectionId,
      id: attr.alias,
    }),
    Fold.pre(
      Fold.compose(
        Res._Rel("images"),
        Res._Response(),
        Fold._head(),
        Lens.prop("attributes")
      )
    ),
    _Link2Attributes,
    _CollectionId
  )
);

const validator = record({ defaultTabIndex: optional(string) });

export const _Selected = Fold.compose(
  _PageGetter,
  _GetCustomAttributesForPage(validator),
  Lens.prop("defaultTabIndex"),
  M._Just()
);
