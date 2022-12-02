import * as EventsLib from "@discovery/clients-js-events-lib";
import EventTracker from "@discovery/clients-js-events-lib/lib/EventTracker";
/**
 * Based on https://discoveryinc.atlassian.net/wiki/spaces/AAP/pages/1272153221/Client+Attributes
 */
declare const getClientAttributes: (eventTracker: EventTracker) => Promise<EventsLib.ClientAttributes>;
export { getClientAttributes };
//# sourceMappingURL=client-attributes.d.ts.map