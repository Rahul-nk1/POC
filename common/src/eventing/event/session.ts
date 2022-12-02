import { log } from "../setup";
import { EventTypes } from "@discovery/clients-js-events-lib";
import {
  ActionTypes,
  StartTypes,
  SessionResumeEventData,
} from "@discovery/clients-js-events-lib/lib/Session";
import { SessionStartEventData } from "@discovery/clients-js-events-lib/lib/Session";
import { SessionStopEventData } from "@discovery/clients-js-events-lib/lib/Session";

const triggerInitSessionEvent = (appLoadTime: number) => {
  const data: SessionStartEventData = {
    action: ActionTypes.START,
    startType: StartTypes.COLD,
    appLoadTime,
  };

  log({
    type: EventTypes.SESSION,
    data,
  });
};

const triggerVisibilityChangeEvent = (visibilityState: VisibilityState) => {
  const data: SessionResumeEventData | SessionStopEventData =
    visibilityState === "visible"
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
  const data: SessionStopEventData = {
    action: ActionTypes.STOP,
  };

  log({
    type: EventTypes.SESSION,
    data,
  });
};

export {
  triggerInitSessionEvent,
  triggerVisibilityChangeEvent,
  triggerBeforeUnloadEvent,
};
