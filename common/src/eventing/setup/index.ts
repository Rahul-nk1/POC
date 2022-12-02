import * as M from "@discovery/prelude/lib/data/maybe";
import * as S from "@discovery/prelude/lib/data/stream";
import * as EventsLib from "@discovery/clients-js-events-lib";
import { mkLogBus, LogListener } from "@discovery/maestro-tourbus";
import { EventTypes, EventData } from "@discovery/clients-js-events-lib";
import { EventsLog, Events } from "../types";
import { eventTracking$, pushEvent, config$, init$ } from "./setup";
import { setEventingConfig } from "./shared";
import { PERFORMANCE_MODE } from "../../env";

const event = (type: EventTypes, eventData: EventData): void =>
  pushEvent({ type, eventData });

const track = (log: Events) => {
  switch (log.type) {
    case EventTypes.BROWSE:
      event(EventTypes.BROWSE, log.data);
      break;
    case EventTypes.SESSION:
      event(EventTypes.SESSION, log.data);
      break;
    case EventTypes.FORM:
      break;
    case EventTypes.SEARCH:
      event(EventsLib.EventTypes.SEARCH, log.data);
      break;
    case EventTypes.USER_PROFILE:
      event(EventsLib.EventTypes.USER_PROFILE, log.data);
      break;
    case EventTypes.INTERACTION:
      event(EventsLib.EventTypes.INTERACTION, log.data);
      break;
    case EventTypes.ERROR:
      event(EventsLib.EventTypes.ERROR, log.data);
      break;
    case EventTypes.AUTHENTICATION:
      event(EventsLib.EventTypes.AUTHENTICATION, log.data);
      break;
    case EventTypes.VIDEO_PLAYER:
      event(EventsLib.EventTypes.VIDEO_PLAYER, log.data);
      break;
  }
};

const eventsLibLogListener: LogListener<Events, EventsLog> = {
  transform: (l) => M.of(l.custom),
  log: (l) => track(l),
};

const logBus = mkLogBus<EventsLog>();
const log = (e: Events) => logBus.log({ custom: e });

const registerListener = (...ls: Array<LogListener<Events, EventsLog>>) => {
  // typescript needs anonymous function here to get correct types
  ls.map((l) => logBus.registerListener(l));
};

// Do not register anything if performance mode
if (!PERFORMANCE_MODE) {
  registerListener(eventsLibLogListener);

  // TODO: see if we can have a better place to run this
  S.runEffects(S.merge(eventTracking$, init$))(S.newDefaultScheduler());
}

export { log, setEventingConfig, event, config$ };
