import * as M from "@discovery/prelude/lib/data/maybe";
import { AuthService } from "@discovery/client-core/lib/startup/types";
import { SonicApiAppConfig } from "@discovery/sonic-api-ng/lib/config/app-config";
import {
  createPlayer as createTvePlayer,
  playerConfig,
  Environment,
  Flags,
} from "@discovery/sonic-player-tve";
import { getDeviceId } from "@discovery/common-tve/lib/device-info";

export { PlayerProps } from "@discovery/sonic-player-tve";
export type PlayerConfig = {
  playerConfig: {
    environment: string;
  };
};

type Read = AuthService & SonicApiAppConfig & PlayerConfig;

const PRODUCT_NAME = "discovery-atve"; // TODO:?

export const createPlayer = (read: Read, flags?: Flags) => {
  const ENV =
    read.playerConfig.environment === "test"
      ? Environment.TEST
      : Environment.PROD;
  const baseConfig = playerConfig({ env: ENV });
  const conf = {
    ...baseConfig,
    flags: {
      ...baseConfig.flags,
      ...flags,
    },
    env: {
      APP_NAME: read.sonicApiAppConfig.clientName,
      HOST: read.sonicApiAppConfig.domain,
      SONIC_REALM: read.sonicApiAppConfig.realm,
      // give the lookup key if it exists
      SITE_LOOKUP_KEY: M.fromMaybe(
        read.sonicApiAppConfig.siteLookupKey,
        undefined
      ),
    },
    auth: {
      returnUrl: encodeURIComponent(window.location.href),
      host: read.authService.domain,
    },
  };

  return createTvePlayer(
    {
      ...conf,
      eventStreamConfig: {
        product: PRODUCT_NAME,
      },
    },
    {
      getDeviceId: getDeviceId,
    }
  );
};
