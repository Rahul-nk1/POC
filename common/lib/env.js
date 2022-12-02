var _a, _b;
import * as constants from "@discovery/client-core/webpack/constants";
export const DEVELOPMENT_MODE = process.env.BUILD_MODE === constants.DEVELOPMENT;
export const PRODUCTION_MODE = process.env.BUILD_MODE === constants.PRODUCTION;
// Can we guarantee Environmnet variables with nix ?
export const SONIC_ENDPOINT = process.env.PROXY_ENDPOINT || process.env.SONIC_ENDPOINT;
export const USE_REALM_SERVICE = Boolean(process.env.USE_REALM_SERVICE);
export const SONIC_PROD_ENDPOINT = "eu3-prod.disco-api.com";
export const SONIC_TVE_REALM = "go";
export const AUTH_PROD_DOMAIN = "prod-central-digital-auth-service.mercury.dnitv.com";
export const AUTH_DOMAIN = process.env.AUTH_DOMAIN;
export const SENTRY_DSN = DEVELOPMENT_MODE
    ? ""
    : "https://f5b4f29a913448a2964824d4a0bc108d@sentry.io/5185184";
export const LAST_COMMIT = process.env.LAST_COMMIT;
export const PRODUCT = process.env.PRODUCT;
export const VERSION = process.env.VERSION;
export const PERFORMANCE_MODE = ((_b = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.search) === null || _b === void 0 ? void 0 : _b.includes("performance")) || false;
//# sourceMappingURL=env.js.map