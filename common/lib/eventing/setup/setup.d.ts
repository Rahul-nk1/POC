import * as S from "@discovery/prelude/lib/data/stream";
import EventTracker, * as EventsLib from "@discovery/clients-js-events-lib";
import { config$ } from "./shared";
/**
 * Stream for all the pushed events
 */
declare const pushEvent: (event: {
    type: EventsLib.EventTypes;
    eventData: EventsLib.EventData;
}) => void;
/**
 * Without init, the batching will not work,
 * Event streams has an interval in their init method.
 */
declare const init$: S.Stream<EventTracker>;
declare const eventTracking$: S.Stream<void>;
export { init$, eventTracking$, pushEvent, config$ };
//# sourceMappingURL=setup.d.ts.map