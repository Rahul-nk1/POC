import * as EventsLib from "@discovery/clients-js-events-lib";
import EventTracker from "@discovery/clients-js-events-lib/lib/EventTracker";
import { getParser } from "bowser";
import { getDeviceId } from "../../device-info";

const bowser = getParser(window.navigator.userAgent);

/**
 * Based on https://discoveryinc.atlassian.net/wiki/spaces/AAP/pages/1272153221/Client+Attributes
 */
const getClientAttributes = async (
  eventTracker: EventTracker
): Promise<EventsLib.ClientAttributes> => {
  const limitAdTracking = navigator.doNotTrack === "1";

  // Had to cast here as EventTracker is returning Promise<unknown>
  const getAdvertisingIds = () =>
    eventTracker.getAdvertisingIds() as Promise<string>;

  return {
    browser: {
      name: bowser.getBrowser().name,
      version: bowser.getBrowser().version,
    },
    os: {
      name: bowser.getOS().name ?? "unknown-client.os.name",
      version: bowser.getOS().version,
    },
    type: EventsLib.ClientTypes.WEB,
    id: await getDeviceId(),
    advertisingId: await getAdvertisingIds(),
    limitAdTracking,
    connectionType:
      navigator.connection?.type ?? EventsLib.ConnectionTypes.UNKNOWN,
  };
};

export { getClientAttributes };
