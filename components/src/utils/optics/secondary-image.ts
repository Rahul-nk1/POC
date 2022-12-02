import { Fold, Lens } from "@discovery/prelude/lib/control/lens";
import * as Traversal from "@discovery/prelude/lib/control/lens/traversal";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as L from "@discovery/prelude/lib/data/list";
import * as Optics from "@discovery/sonic-api-ng-optics";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import { ImageData } from "@discovery/sonic-api-ng/lib/api/cms/images/resource";

export enum ImageType {
  Default = "default",
  CoverArtwork = "cover_artwork",
  Logo = "logo",
  Poster = "poster",
  PosterWithLogo = "poster_with_logo",
}

export const _FilterImagesByKind = (kind: string) =>
  Traversal._filtered((image: ImageData) => image.attributes.kind === kind);

export const _ImagesOfKind = (kind: string) =>
  Fold.compose(
    Optics._ImagesGetter,
    Res._Response(),
    Fold._each(),
    _FilterImagesByKind(kind)
  );

const _ColItem2ShowImages = Fold.compose(
  Optics._ColItem2Show,
  Res._Rel("images")
);

const _ColItem2ChannelImages = Fold.compose(
  Optics._ColItem2Channel,
  Res._Rel("images")
);

const _ColItem2LinkImages = Fold.compose(
  Optics._ColItem2Link,
  Res._Rel("images")
);

const getSquarestImage = (imagesL: L.List<ImageData>) => {
  const sortedImagesL = L.sortBy((image) => {
    const { height, width } = image.attributes;
    // We get the ratio from smaller side / bigger side so that it is always < 1
    const [smallerSide, biggerSide] =
      height > width ? [width, height] : [height, width];
    const ratio = smallerSide / biggerSide;
    // Return the difference between the ratio and 1
    return 1 - ratio;
  }, imagesL);
  return L.head(sortedImagesL);
};

const _mkSecondaryImage = (imageKind: string) =>
  Fold.compose(
    Fold.alt(
      // In videos we use the mobile image from their related show.
      Fold.compose(
        Optics._ColItem2Video,
        Res._Rel("show"),
        Res._Rel("images"),
        _ImagesOfKind(imageKind)
      ),
      // Shows should always have their own mobile image with kind "cover_artwork".
      Fold.compose(_ColItem2ShowImages, _ImagesOfKind(imageKind)),
      // TODO revisit this. We just grab the squarest looking image we can find here. Which is bad!
      Fold.compose(
        _ColItem2ChannelImages,
        Res._Response(),
        Fold.mapF(getSquarestImage),
        M._Just()
      ),
      // Links should have a mobile image with kind "alternate".
      Fold.compose(_ColItem2LinkImages, _ImagesOfKind("alternate"))
    ),
    Lens.prop("attributes")
  );

/**
 * TODO: Keeping to prevent PR approval from ATVE. This should be removed in
 * the future and replaced with _SecondaryImageSquare
 */
export const _SecondaryImage = _mkSecondaryImage("cover_artwork");

export const _SecondaryImageSquare = _mkSecondaryImage(ImageType.CoverArtwork);

export const _SecondaryImagePoster = _mkSecondaryImage(ImageType.Poster);

export const _SecondaryImageDefault = _mkSecondaryImage(ImageType.Default);
