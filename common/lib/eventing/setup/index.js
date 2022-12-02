import * as M from "@discovery/prelude/lib/data/maybe";
import * as S from "@discovery/prelude/lib/data/stream";
import * as EventsLib from "@discovery/clients-js-events-lib";
import { mkLogBus } from "@discovery/maestro-tourbus";
import { EventTypes } from "@discovery/clients-js-events-lib";
import { eventTracking$, pushEvent, config$, init$ } from "./setup";
import { setEventingConfig } from "./shared";
import { PERFORMANCE_MODE } from "../../env";
const event = (type, eventData) => pushEvent({ type, eventData });
const track = (log) => {
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
const eventsLibLogListener = {
    transform: (l) => M.of(l.custom),
    log: (l) => track(l),
};
const logBus = mkLogBus();
const log = (e) => logBus.log({ custom: e });
const registerListener = (...ls) => {
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
//# sourceMappingURL=index.js.map