import * as O from "fp-ts/Option";
import * as M from "@discovery/prelude/lib/data/maybe";
import { Fold, Lens } from "@discovery/prelude/lib/control/lens";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import { CollectionResponse } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import {
  _CollectionGetter,
  _Col2Collection,
  _ColResponse2Col,
  _Col2Attributes,
  _Channel2Attributes,
  _CollectionResponseGetter,
  _GetCustomAttributesForComponent,
} from "@discovery/sonic-api-ng-optics";
import * as Channels from "@discovery/sonic-api-ng/lib/api/content/channels";
import {
  record,
  optional,
  string,
} from "@discovery/prelude/lib/data/validated";

const oneToOneRelationships = {
  entitlementsChannel: Channels.Resource.target,
};

export const _PlaybackAllowed = Fold.compose(
  _CollectionResponseGetter,
  _ColResponse2Col,
  Fold.mapF(Res.addNewRelationships(oneToOneRelationships)),
  Res._Rel("entitlementsChannel"),
  _Channel2Attributes,
  Fold.mapF((attrs) => attrs.playbackAllowed),
  M._Just()
);

export const _Subtab = Fold.compose(
  _CollectionResponseGetter,
  _ColResponse2Col,
  _Col2Collection,
  Fold.liftM(
    (_col, attr, title) => ({
      // TODO: Make into CollectionResponseData once Core template engine supports that.
      col: Res.map(
        (data) => ({ data, included: O.none, meta: O.none }),
        _col
      ) as CollectionResponse,
      title: title,
      id: attr.alias,
    }),
    _CollectionGetter,
    _Col2Attributes,
    Fold.compose(_Col2Attributes, Lens.prop("title"), M._Just())
  )
);

const validator = record({ defaultTabIndex: optional(string) });

export const _Selected = Fold.compose(
  _CollectionResponseGetter,
  _ColResponse2Col,
  _GetCustomAttributesForComponent(validator),
  Lens.prop("defaultTabIndex"),
  M._Just()
);
