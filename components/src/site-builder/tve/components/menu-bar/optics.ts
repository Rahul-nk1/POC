import { Fold, Traversal } from "@discovery/prelude/lib/control/lens";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import * as Images from "@discovery/sonic-api-ng/lib/api/cms/images";
import {
  _Col2Link,
  _CollectionGetter,
  _Link2Data,
  _LinkHref,
  _Image2Attributes,
  _Link2Images,
} from "@discovery/sonic-api-ng-optics";
import { Attributes } from "@discovery/sonic-api-ng/lib/api/cms/links";

import { LinkKind } from "../../../../components/tve/atoms/link";

export const kind2kind = (
  kind: Attributes.Attributes["kind"]
): LinkKind.internal | LinkKind.external =>
  kind === "Internal Link" ? LinkKind.internal : LinkKind.external;

const _Icon = (kind: string) =>
  Fold.compose(
    _Link2Images,
    Traversal._filteredOn(_Image2Attributes, (x) => x.kind === kind),
    _Image2Attributes
  );

export const _LinkProps = Fold.liftM(
  (iconDefaultM, iconAlternateM, href, data) => ({
    /** In the Sonic CMS:
      default image needs to be center/center - this is mobile
      alternate image needs to be center/right - this is desktop */
    iconMobileM: M.alt(iconDefaultM, iconAlternateM),
    iconDesktopM: M.alt(iconAlternateM, iconDefaultM),
    href,
    title: M.fromMaybe(data.attributes.title, ""),
    kind: kind2kind(data.attributes.kind),
  }),
  Fold.pre(_Icon("default")),
  Fold.pre(_Icon("alternate")),
  _LinkHref,
  _Link2Data
);

export const _LinkItems = Fold.compose(_Col2Link, _LinkProps);

const oneToOneRelationships = {
  cmpContextHeaderLogo: Images.Resource.target,
  cmpContextHeaderMobileLogo: Images.Resource.target,
};

export const _SiteLogo = Fold.compose(
  _CollectionGetter,
  Fold.mapF(Res.addNewRelationships(oneToOneRelationships)),
  Res._Rel("cmpContextHeaderLogo"),
  _Image2Attributes
);

export const _SiteMobileLogo = Fold.compose(
  _CollectionGetter,
  Fold.mapF(Res.addNewRelationships(oneToOneRelationships)),
  Res._Rel("cmpContextHeaderMobileLogo"),
  _Image2Attributes
);
