import { Fold } from "@discovery/prelude/lib/control/lens";
import * as O from "fp-ts/Option";
import * as Optics from "@discovery/sonic-api-ng-optics";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import * as Images from "@discovery/sonic-api-ng/lib/api/cms/images";
import * as Links from "@discovery/sonic-api-ng/lib/api/cms/links";

const oneToOneRelationshipsBackgroundImage = {
  cmpContextBackgroundImage: Images.Resource.target,
  cmpContextBackgroundImageMobile: Images.Resource.target,
};

export const _PromoBanner = Fold.compose(
  Optics._CollectionGetter,
  Fold.mapF(Res.addNewRelationships(oneToOneRelationshipsBackgroundImage)),
  Res._Rel("cmpContextBackgroundImage"),
  Optics._Image2Attributes
);

export const _PromoBannerMobile = Fold.compose(
  Optics._CollectionGetter,
  Fold.mapF(Res.addNewRelationships(oneToOneRelationshipsBackgroundImage)),
  Res._Rel("cmpContextBackgroundImageMobile"),
  Optics._Image2Attributes
);

const oneToOneRelationshipsLogo = {
  cmpContextLogo: Images.Resource.target,
  cmpContextMobileLogo: Images.Resource.target,
};

export const _PromoBannerLogo = Fold.compose(
  Optics._CollectionGetter,
  Fold.mapF(Res.addNewRelationships(oneToOneRelationshipsLogo)),
  Res._Rel("cmpContextLogo"),
  Optics._Image2Attributes
);

export const _PromoBannerLogoMobile = Fold.compose(
  Optics._CollectionGetter,
  Fold.mapF(Res.addNewRelationships(oneToOneRelationshipsLogo)),
  Res._Rel("cmpContextMobileLogo"),
  Optics._Image2Attributes
);

export const _PromoBannerSpectrumBar = Fold.compose(
  Optics._CollectionGetter,
  Fold.mapF(
    Res.addNewRelationships({ cmpContextSpectrumBar: Images.Resource.target })
  ),
  Res._Rel("cmpContextSpectrumBar"),
  Optics._Image2Attributes
);

const oneToOneRelationshipsCTA = {
  cmpContextBannerCta: Links.Resource.target,
};

const _PromoBannerCTA = Fold.compose(
  Optics._CollectionGetter,
  Fold.mapF(Res.addNewRelationships(oneToOneRelationshipsCTA)),
  Res._Rel("cmpContextBannerCta")
);

export const _CTALink = Fold.liftM(
  (href, title) => ({ href, title: O.getOrElse(() => "")(title) }),
  Fold.compose(_PromoBannerCTA, Optics._LinkHref),
  Fold.compose(_PromoBannerCTA, Optics._LinkAttributes2Title)
);

const oneToOneRelationshipsTerms = {
  cmpContextBannerTerms: Links.Resource.target,
};

const _PromoBannerTerms = Fold.compose(
  Optics._CollectionGetter,
  Fold.mapF(Res.addNewRelationships(oneToOneRelationshipsTerms)),
  Res._Rel("cmpContextBannerTerms")
);

export const _TermsLink = Fold.liftM(
  (href, title, description) => ({
    href,
    title: O.getOrElse(() => "")(title),
    description: O.getOrElse(() => "")(description),
  }),
  Fold.compose(_PromoBannerTerms, Optics._LinkHref),
  Fold.compose(_PromoBannerTerms, Optics._LinkAttributes2Title),
  Fold.compose(_PromoBannerTerms, Optics._LinkAttributes2Description)
);
