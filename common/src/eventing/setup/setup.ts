import * as M from "@discovery/prelude/lib/data/maybe";
import * as S from "@discovery/prelude/lib/data/stream";
import EventTracker, * as EventsLib from "@discovery/clients-js-events-lib";
import { ActionTypes } from "@discovery/clients-js-events-lib/lib/Session";
import { getOrientation } from "./utils";
import { config$ } from "./shared";
import { DEVELOPMENT_MODE } from "../../env";
import { getAnalyticsSessionState } from "@discovery/dni-central-auth-analytics-session-data";
import { Unpacked } from "@discovery/roadie";

const sendImmediately =
  DEVELOPMENT_MODE || window.location.href.includes("localhost");
/**
 * Stream for all the pushed events
 */
const [pushEvent, _event$] = S.createAdapter<{
  type: EventsLib.EventTypes;
  eventData: EventsLib.EventData;
}>();

// Multicast as it is a shared stream
const event$ = S.multicast(_event$);

/**
 * TODO: Not sure why but it seems like without the filter here, this produces
 *
 * |----[e]----[]----[e, e]---->
 *
 * please remove the filter if possible
 *
 */
const accEvents$ = S.scan<
  {
    type: EventsLib.EventTypes;
    eventData: EventsLib.EventData;
  },
  Array<{
    type: EventsLib.EventTypes;
    eventData: EventsLib.EventData;
  }>
>((x, y) => x.concat(y), [], event$);

/**
 * This produces the tracking event
 */
const doTrack = (
  {
    clientAttributes,
    productAttributes,
    eventTracker,
  }: Unpacked<typeof config$>,
  { type, eventData }: Unpacked<typeof event$>
) => {
  const orientation = getOrientation(window.screen.orientation?.type);
  const experiment = {};

  if (eventTracker.isSessionExpired()) {
    // getAnalyticsSessionState creates a new session if old one is expired
    eventTracker.sessionState = getAnalyticsSessionState();
  }

  const trackingCode = window.location.search.substring(1);

  eventTracker[sendImmediately ? "immediate" : "track"](
    clientAttributes,
    productAttributes,
    experiment,
    type,
    eventData,
    M.fromMaybe(orientation, undefined),
    trackingCode
  );

  // Flush queue if we are stopping our session

  if (
    type === EventsLib.EventTypes.SESSION &&
    eventData.action === ActionTypes.STOP
  ) {
    eventTracker.flushQueue();
  }
};

/**
 * This stream uses the accumulated events that gets pushed before we have the
 * proper configuration. It does it only once as we have `take(1)` on it
 * |--------------c----------c->  config$
 * |----[e]----------[e, e]---->  accEvents$
 * |--------------t|              initialTracking$ (take(1))
 */
const initialTracking$ = S.take(
  1,
  S.combine(
    (config, evs) => {
      evs.map((ev) => doTrack(config, ev));
    },
    config$,
    accEvents$
  )
);

/**
 * Without init, the batching will not work,
 * Event streams has an interval in their init method.
 */
const init$: S.Stream<EventTracker> = S.take(
  1,
  S.map(({ eventTracker }) => eventTracker.init(), config$)
);

/**
 * This stream combines the configuration stream and eventing stream to then
 * allow for firing effects `track`
 */
const tracking$ = S.snapshot(doTrack, config$, event$);

// Combine both tracking where we fire off any events that got accumulated
// before we got the proper configuration, then continue as regular.
const eventTracking$: S.Stream<void> = S.mergeArray([
  initialTracking$,
  tracking$,
]);

export { init$, eventTracking$, pushEvent, config$ };
