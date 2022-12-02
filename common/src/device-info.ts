import Bowser, { OS_MAP } from "bowser";
import { storedIdentity } from "@discovery/maestro-identity";
import * as App from "@discovery/maestro";
import * as M from "@discovery/prelude/lib/data/maybe";
import { envBrowser, getDeviceInfo } from "@discovery/maestro-env-browser";
import { ClientInformation } from "@discovery/sonic-api-ng/lib/config/app-config";
import { SITE_LOOKUP_KEY_M } from "./constants";
import { VERSION } from "./env";

const parser = Bowser.getParser(window.navigator.userAgent);

export enum PLATFORMS_MAP {
  tablet = "tablet",
  mobile = "mobile",
  desktop = "desktop",
  tv = "tv",
}

export const isIOS = parser.getOSName() === "iOS";

/**
 * @NOTE - iPad Safari user-agent problem
 *  - Mobile Safari (iPad, iOS 13.3) reports a "desktop" user-agent,
 *    which forces Bowser to report it as a "desktop" device,
 *    circumventing necessary checks for "mobile" devices
 *
 *  -> current "best" workaround is to detect for CSS ":hover" support,
 *    via `window.matchMedia`
 */

const canHover = window.matchMedia("(hover: hover)").matches;

export const isMobile = (() => {
  if (!canHover) {
    return true;
  }

  switch (parser.getPlatformType(true)) {
    case PLATFORMS_MAP.tablet:
    case PLATFORMS_MAP.mobile:
      return true;
    case PLATFORMS_MAP.desktop:
    case PLATFORMS_MAP.tv:
    default:
      return false;
  }
})();

export const getOperatingSystem = (): ReturnType<typeof parser.getOS> => {
  const os = parser.getOS();
  // iOS 13 on iPad is now acting like a MacOS, hence we need to have a check
  // whether the user can hover or not.
  const ipadOS = !canHover && os.name === OS_MAP.MacOS;
  if (ipadOS) {
    return { name: OS_MAP.iOS };
  } else {
    return os;
  }
};

// If we have a native app in user’s OS, we display the mobile road block page.
export const hasNativeAppForUsersOS = () => {
  switch (getOperatingSystem().name) {
    case OS_MAP.iOS:
    case OS_MAP.Android:
      return true;
    default:
      return false;
  }
};

/**
 * Allows one to grab the device id from either local storage (if exist) or
 * generate a new one.
 *
 * envBrowser uses `indexedDB -> localStorage -> cookieStorage -> * sessionStorage`
 * in priority order and also uses `fingerprintjs2` as id generator
 */
export const getDeviceId = () =>
  App.run(storedIdentity)({ ...envBrowser }, {}).then(([_, v]) => v);

export const clientInformation: ClientInformation["clientInformation"] = {
  application: {
    name: M.fromMaybe<string>(SITE_LOOKUP_KEY_M, "no application.name"),
    version: VERSION ?? "no application.version",
  },
  ...getDeviceInfo(),
};
