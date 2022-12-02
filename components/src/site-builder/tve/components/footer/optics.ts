import { Fold, Traversal } from "@discovery/prelude/lib/control/lens";
import * as M from "@discovery/prelude/lib/data/maybe";
import {
  _Col2Link,
  _CollectionGetter,
  _Link2Data,
  _LinkHref,
  _Image2Attributes,
  _Link2Images,
  _Col2Items,
  _Col2Collection,
  _ColItem2Collection,
  _Col2Attributes,
  _ColItem2Link,
  _Link2Attributes,
  _ColAttributes2Title,
} from "@discovery/sonic-api-ng-optics";
import { Attributes } from "@discovery/sonic-api-ng/lib/api/cms/links";
import { LinkKind } from "../../../../components/tve/atoms/link";
import * as O from "fp-ts/Option";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";

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

//Extracting required things from the data for Footewr Link props
export const _LegalLinkProps = Fold.liftM(
  (href, data) => ({
    href,
    title: M.fromMaybe(data.attributes.title, ""),
    kind: kind2kind(data.attributes.kind),
  }),
  _LinkHref,
  _Link2Data
);

export const _SocialLinkPops = Fold.liftM(
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

//Extrcating legal,Social Media,And Copy Rights Link
const _ExtractFooterLegal = Fold.compose(
  _Col2Items,
  _ColItem2Collection,
  Traversal._filteredOn(
    _Col2Attributes,
    (x) => O.getOrElse(() => "")(x.name) === "web-footer-legal"
  ),
  _Col2Items,
  _ColItem2Link
);

const _ExtractFooterSocail = Fold.compose(
  _Col2Items,
  _ColItem2Collection,
  Traversal._filteredOn(
    _Col2Attributes,
    (x) => O.getOrElse(() => "")(x.name) === "web-footer-social"
  ),
  _Col2Items,
  _ColItem2Link
);

const _ExtractFooterCopyRights = Fold.compose(
  _Col2Items,
  _ColItem2Collection,
  Traversal._filteredOn(
    _Col2Attributes,
    (x) => O.getOrElse(() => "")(x.name) === "web-footer-copyright"
  )
);
//Composing Lens required For Getting Footer Liks
export const _LinkItems = Fold.compose(_ExtractFooterLegal, _LegalLinkProps);
export const _IconLinkItems = Fold.compose(
  _ExtractFooterSocail,
  _SocialLinkPops
);
export const _CopyRightsItem = Fold.compose(
  _ExtractFooterCopyRights,
  _ColAttributes2Title
);
