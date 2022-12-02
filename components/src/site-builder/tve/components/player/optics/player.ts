import { Fold } from "@discovery/prelude/lib/control/lens";
import * as Optics from "@discovery/sonic-api-ng-optics";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";

type VideoType = "VIDEO" | "CHANNEL";
export const _Video = Fold.compose(
  Optics._Col2Video,
  Res._Response(),
  Fold.mapF((x) => ({
    id: x.id,
    type: "VIDEO" as VideoType,
    instigator: "MANUAL" as const,
  }))
);

export const _PrimaryChannel = Fold.compose(
  Optics._Col2Video,
  Optics._Video2PrimaryChannel,

  Res._Response(),
  Fold.mapF((x) => ({
    id: x.id,
    type: "CHANNEL" as VideoType,
    instigator: "MANUAL" as const,
  }))
);
