import * as EventsLib from "@discovery/clients-js-events-lib"
import { getParser } from "bowser"
import { getDeviceId } from "../../device-info"
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }

const bowser = getParser(window.navigator.userAgent)
/**
 * Based on https://discoveryinc.atlassian.net/wiki/spaces/AAP/pages/1272153221/Client+Attributes
 */
const getClientAttributes = (eventTracker) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c
    const limitAdTracking = navigator.doNotTrack === "1"
    // Had to cast here as EventTracker is returning Promise<unknown>
    const getAdvertisingIds = () => eventTracker.getAdvertisingIds()
    return {
      browser: {
        name: bowser.getBrowser().name,
        version: bowser.getBrowser().version
      },
      os: {
        name: (_a = bowser.getOS().name) !== null && _a !== void 0 ? _a : "unknown-client.os.name",
        version: bowser.getOS().version
      },
      type: EventsLib.ClientTypes.WEB,
      id: yield getDeviceId(),
      advertisingId: yield getAdvertisingIds(),
      limitAdTracking,
      connectionType:
        (_c = (_b = navigator.connection) === null || _b === void 0 ? void 0 : _b.type) !== null &&
        _c !== void 0
          ? _c
          : EventsLib.ConnectionTypes.UNKNOWN
    }
  })
export { getClientAttributes }
//# sourceMappingURL=client-attributes.js.map
