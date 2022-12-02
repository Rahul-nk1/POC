import {
  _Col2ComponentId,
  _PageGetter,
  _Page2Attributes,
  _Page2TemplateId,
  _Channel2Attributes,
  _PageAttributes2Component,
  _Page2Items,
  _PageItem2Collection,
  _Video2Attributes,
  _Show2Attributes,
} from "@discovery/sonic-api-ng-optics";
import * as Optics from "@discovery/sonic-api-ng-optics";
import { Fold, Lens } from "@discovery/prelude/lib/control/lens";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import * as M from "@discovery/prelude/lib/data/maybe";

export const _Page2CollectionComponentId = Fold.compose(
  _Page2Items,
  _PageItem2Collection,
  _Col2ComponentId
);

const _PageHeroImageAttributes = Fold.pre(
  Fold.compose(
    Optics._PageGetter,
    Optics._Page2Items,
    Optics._PageItem2Collection,
    Optics._Col2Image,
    Res._Response(),
    Lens.prop("attributes")
  )
);

const _PageImageAttributes = Fold.pre(
  Fold.compose(
    _PageGetter,
    Res._Rel("images"),
    Res._Response(),
    Fold._head(),
    Lens.prop("attributes")
  )
);

export const _PageTemplate = Fold.compose(_PageGetter, _Page2TemplateId);

export const _PageComponentId = Fold.compose(
  _PageGetter,
  _PageAttributes2Component,
  M._Just(),
  Lens.prop("id")
);

export const _PageAttributes = Fold.compose(
  _PageGetter,
  Fold.liftM(
    (pageImageAttrsM, attr) => ({
      title: M.alt(attr.title, attr.pageMetadataTitle),
      description: M.alt(attr.description, attr.pageMetadataDescription),
      keywords: attr.pageMetadataKeywords,
      author: attr.pageMetadataAuthor,
      image: M.map((imageAttrs) => imageAttrs.src, pageImageAttrsM),
    }),
    _PageImageAttributes,
    _Page2Attributes
  )
);
export const _PageChannelName = Fold.compose(
  _PageGetter,
  Res._RelAssoc("primaryContent", "channel"),
  _Channel2Attributes,
  Lens.prop("name")
);

export const _PageItemOverride = Fold.pre(
  Fold.compose(
    _PageGetter,
    _Page2Items,
    Res._Response(),
    Lens.prop("attributes")
  )
);

const _PageHeroAttributes = Fold.pre(
  Fold.compose(
    Optics._PageGetter,
    Optics._Page2Items,
    Optics._PageItemGetter,
    Optics._PageItem2Collection,
    Res._Response(),
    Lens.prop("attributes")
  )
);

export const _PlaylistPageAttributes = Fold.compose(
  _PageGetter,
  Fold.liftM(
    (pageImageAttrsM, heroImageAttrsM, attr, pageItemAttrsM, heroAttrsM) => ({
      title: M.concat(
        M.concat(
          M.chain((pageItemAttrs) => pageItemAttrs.title, pageItemAttrsM),
          M.chain((heroAttrs) => heroAttrs.title, heroAttrsM)
        ),
        M.concat(attr.title, attr.pageMetadataTitle)
      ),
      description: M.concat(
        M.concat(
          M.concat(
            M.chain((imageAttrs) => imageAttrs.description, heroImageAttrsM),
            M.chain((imageAttrs) => imageAttrs.description, pageImageAttrsM)
          ),
          attr.description
        ),
        attr.pageMetadataDescription
      ),
      keywords: attr.pageMetadataKeywords,
      author: attr.pageMetadataAuthor,
      image: M.map((imageAttrs) => imageAttrs.src, pageImageAttrsM),
    }),
    _PageImageAttributes,
    _PageHeroImageAttributes,
    _Page2Attributes,
    _PageItemOverride,
    _PageHeroAttributes
  )
);

export const _PagePrimaryContentVideoId = Fold.compose(
  _PageGetter,
  Res._RelAssoc("primaryContent", "video"),
  _Video2Attributes,
  Lens.prop("alternateId")
);

export const _PagePrimaryContentShowId = Fold.compose(
  _PageGetter,
  Res._RelAssoc("primaryContent", "show"),
  _Show2Attributes,
  Lens.prop("alternateId")
);
