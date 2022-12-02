import * as L from "@discovery/prelude/lib/data/list";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import * as Option from "fp-ts/Option";
import * as Optics from "@discovery/sonic-api-ng-optics";
import { Fold } from "@discovery/prelude/lib/control/lens";
import { _Just } from "@discovery/prelude/lib/data/maybe";
import { CollectionResponse } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";

export const _Tabs = Fold.compose(
  Optics._Col2Collection,
  Fold.liftM(
    (collection, id, title, alias) => {
      const collectionItems = Fold.toList(Optics._Col2Items, collection);
      const firstPageItemCount = L.length(collectionItems);
      // TODO: Make into CollectionResponseData once Core template engine supports that.
      const resp = Res.map(
        (data) => ({ data, included: Option.none, meta: Option.none }),
        collection
      ) as CollectionResponse;

      return {
        collection: resp,
        id,
        title,
        alias,
        items: {
          firstPageItemCount,
        },
      };
    },
    Optics._CollectionGetter,
    Optics._Col2Id,
    Fold.compose(Optics._ColAttributes2Title, _Just()),
    Optics._ColAttributes2Alias
  )
);
