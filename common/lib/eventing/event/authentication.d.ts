import { AuthenticationEventData } from "@discovery/clients-js-events-lib";
import { ActionTypes as AuthenticationEvent } from "@discovery/clients-js-events-lib/lib/Authentication";
declare const triggerAuthenticationEvent: (actionType: AuthenticationEvent, affiliateId: AuthenticationEventData["affiliateId"]) => void;
declare const triggerLogoutEvent: (affiliateId: AuthenticationEventData["affiliateId"]) => void;
export { triggerAuthenticationEvent, triggerLogoutEvent, AuthenticationEvent };
//# sourceMappingURL=authentication.d.ts.map