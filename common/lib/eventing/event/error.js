import { log } from "../setup";
import { EventTypes } from "@discovery/clients-js-events-lib";
import { ActionTypes } from "@discovery/clients-js-events-lib/lib/Error";
import { getScreenName } from "./utils";
const triggerErrorEvent = (actionType, { code, name, message, type }) => {
    const data = {
        action: actionType,
        type: type,
        code: code,
        name: name,
        message: message,
        screenName: getScreenName(location.pathname),
        screenURI: location.href,
    };
    return log({
        type: EventTypes.ERROR,
        data,
    });
};
const triggerInternalErrorEvent = (info) => triggerErrorEvent(ActionTypes.INTERNAL, info);
const triggerUserFacingErrorEvent = (info) => triggerErrorEvent(ActionTypes.USER_FACING, info);
export { triggerErrorEvent, triggerInternalErrorEvent, triggerUserFacingErrorEvent, };
//# sourceMappingURL=error.js.map