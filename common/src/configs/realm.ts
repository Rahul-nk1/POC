import * as App from "@discovery/maestro";
import { getRealm as _getRealm } from "@discovery/client-core";
import {
  DEVELOPMENT_MODE,
  SONIC_ENDPOINT,
  SONIC_PROD_ENDPOINT,
  SONIC_TVE_REALM,
  USE_REALM_SERVICE,
  AUTH_DOMAIN,
  AUTH_PROD_DOMAIN,
} from "../env";
import * as M from "@discovery/prelude/lib/data/maybe";
import { SiteLookupKey } from "../constants";

const useConfig = DEVELOPMENT_MODE === false || USE_REALM_SERVICE;

const productToSiteLookupKey = (product = process.env.PRODUCT) =>
  product && product in SiteLookupKey ? M.of(product) : M.empty();

export const staticRealmConfig = {
  domain: SONIC_ENDPOINT || SONIC_PROD_ENDPOINT,
  realm: SONIC_TVE_REALM,
  environment: "test" as const,
  authDomain: AUTH_DOMAIN || AUTH_PROD_DOMAIN,
  siteLookupKey: M.fromMaybe(productToSiteLookupKey(), SiteLookupKey.tlc),
};

const staticRealmApp: typeof _getRealm = App.of(staticRealmConfig);

export const getRealm = useConfig ? _getRealm : staticRealmApp;
