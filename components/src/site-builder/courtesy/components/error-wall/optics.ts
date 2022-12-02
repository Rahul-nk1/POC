import { Fold } from "@discovery/prelude/lib/control/lens";
import * as Optics from "@discovery/sonic-api-ng-optics";

export const _BackgroundImage = Fold.compose(
  Optics._Col2Image,
  Optics._Image2Attributes
);
