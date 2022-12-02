import * as M from "@discovery/prelude/lib/data/maybe";
import { Attributes as Image } from "@discovery/sonic-api-ng/lib/api/cms/images";

import { inRange } from "./number";

export enum ImageQuality {
  Blur = 30,
  Default = 60,
  Hero = 70,
}

export enum ImageRatio {
  Wide = "16x9",
  Default = "4x3",
  Square = "1x1",
}

export type ImageRatioMeta = null | {
  width: number;
  height: number;
};

const ImageRatioMap = {
  [ImageRatio.Wide]: {
    width: 16,
    height: 9,
  },
  [ImageRatio.Default]: {
    width: 4,
    height: 3,
  },
  [ImageRatio.Square]: {
    width: 1,
    height: 1,
  },
};

/**
 *  in the event all this floating-point image-aspect ratio deviates slightly,
 *  we want to give the ratios a slight tolerance, just in case
 */

const IMAGE_RATIO_TOLERANCE = 0.1;

export const isRatio = (dims: ImageRatioMeta, ratio: ImageRatio) => {
  if (!dims) {
    return false;
  }

  const imageRatio = dims.width / dims.height;
  const targetRatio = ImageRatioMap[ratio].width / ImageRatioMap[ratio].height;

  return inRange(imageRatio, targetRatio, IMAGE_RATIO_TOLERANCE);
};

export const isRatioM = (
  imageM: M.Maybe<Image.Attributes>,
  ratio: ImageRatio
) =>
  M.foldMapConst(
    (image) =>
      isRatio(
        {
          width: image.width,
          height: image.height,
        },
        ratio
      )
        ? imageM
        : M.empty(),
    M.empty(),
    imageM
  );
