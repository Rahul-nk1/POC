import { log } from "../setup";
import { EventTypes, } from "@discovery/clients-js-events-lib";
import { ActionTypes as AuthenticationEvent } from "@discovery/clients-js-events-lib/lib/Authentication";
const triggerAuthenticationEvent = (actionType, affiliateId) => {
    const data = {
        action: actionType,
        affiliateId,
    };
    return log({
        type: EventTypes.AUTHENTICATION,
        data,
    });
};
const triggerLogoutEvent = (affiliateId) => triggerAuthenticationEvent(AuthenticationEvent.LOGOUT, affiliateId);
export { triggerAuthenticationEvent, triggerLogoutEvent, AuthenticationEvent };
//# sourceMappingURL=authentication.js.map