import { log } from "../setup";
import {
  EventTypes,
  AuthenticationEventData,
} from "@discovery/clients-js-events-lib";
import { ActionTypes as AuthenticationEvent } from "@discovery/clients-js-events-lib/lib/Authentication";

const triggerAuthenticationEvent = (
  actionType: AuthenticationEvent,
  affiliateId: AuthenticationEventData["affiliateId"]
) => {
  const data: AuthenticationEventData = {
    action: actionType,
    affiliateId,
  };

  return log({
    type: EventTypes.AUTHENTICATION,
    data,
  });
};

const triggerLogoutEvent = (
  affiliateId: AuthenticationEventData["affiliateId"]
) => triggerAuthenticationEvent(AuthenticationEvent.LOGOUT, affiliateId);

export { triggerAuthenticationEvent, triggerLogoutEvent, AuthenticationEvent };
