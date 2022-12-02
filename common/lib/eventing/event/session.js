import { log } from "../setup";
import { EventTypes } from "@discovery/clients-js-events-lib";
import { ActionTypes, StartTypes, } from "@discovery/clients-js-events-lib/lib/Session";
const triggerInitSessionEvent = (appLoadTime) => {
    const data = {
        action: ActionTypes.START,
        startType: StartTypes.COLD,
        appLoadTime,
    };
    log({
        type: EventTypes.SESSION,
        data,
    });
};
const triggerVisibilityChangeEvent = (visibilityState) => {
    const data = visibilityState === "visible"
        ? {
            action: ActionTypes.START,
            startType: StartTypes.RESUME,
        }
        : {
            action: ActionTypes.STOP,
        };
    log({
        type: EventTypes.SESSION,
        data,
    });
};
const triggerBeforeUnloadEvent = () => {
    const data = {
        action: ActionTypes.STOP,
    };
    log({
        type: EventTypes.SESSION,
        data,
    });
};
export { triggerInitSessionEvent, triggerVisibilityChangeEvent, triggerBeforeUnloadEvent, };
//# sourceMappingURL=session.js.map