import {
  _Col2Image,
  _ColItem2Collection,
  _Image2Attributes,
  _Article2Attributes,
  _Col2Link,
  _LinkHref,
  _Col2Article,
  _Col2Items,
  _ColAttributes2Title,
  _LinkAttributes2Title,
  _LinkAttributes2Description,
} from "@discovery/sonic-api-ng-optics";
import { Fold, Lens } from "@discovery/prelude/lib/control/lens";
import * as M from "@discovery/prelude/lib/data/maybe";

export const _HeroImage = Fold.compose(
  _Col2Image,
  _Image2Attributes,
  Lens.prop("src")
);

export const _HeroTitle = Fold.compose(
  _Col2Article,
  _Article2Attributes,
  Lens.prop("title"),
  M._Just()
);

export const _HeroDescription = Fold.compose(
  _Col2Article,
  _Article2Attributes,
  Lens.prop("description"),
  M._Just()
);

export const _LearnMoreTitle = Fold.compose(
  _Col2Items,
  _ColItem2Collection,
  _ColAttributes2Title
);

export const _LearnMoreList = Fold.compose(
  _Col2Items,
  _ColItem2Collection,
  _Col2Image,
  Fold.map(
    ({ src, title, description }) => ({
      src: src,
      titleM: title,
      descriptionM: description,
    }),
    _Image2Attributes
  )
);

export const _FaqLink = Fold.compose(
  _Col2Link,
  Fold.liftM(
    (text, href, description) => ({ href, text, description }),
    Fold.compose(_LinkAttributes2Title, M._Just()),
    _LinkHref,
    Fold.compose(_LinkAttributes2Description, M._Just())
  )
);
