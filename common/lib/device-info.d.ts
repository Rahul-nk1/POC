import Bowser from "bowser";
import { ClientInformation } from "@discovery/sonic-api-ng/lib/config/app-config";
declare const parser: Bowser.Parser.Parser;
export declare enum PLATFORMS_MAP {
    tablet = "tablet",
    mobile = "mobile",
    desktop = "desktop",
    tv = "tv"
}
export declare const isIOS: boolean;
export declare const isMobile: boolean;
export declare const getOperatingSystem: () => ReturnType<typeof parser.getOS>;
export declare const hasNativeAppForUsersOS: () => boolean;
/**
 * Allows one to grab the device id from either local storage (if exist) or
 * generate a new one.
 *
 * envBrowser uses `indexedDB -> localStorage -> cookieStorage -> * sessionStorage`
 * in priority order and also uses `fingerprintjs2` as id generator
 */
export declare const getDeviceId: () => Promise<string>;
export declare const clientInformation: ClientInformation["clientInformation"];
export {};
//# sourceMappingURL=device-info.d.ts.map