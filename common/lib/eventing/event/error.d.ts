import { ErrorEventData } from "@discovery/clients-js-events-lib";
import { ActionTypes } from "@discovery/clients-js-events-lib/lib/Error";
declare type EventErrorInfo = Pick<ErrorEventData, "code" | "name" | "message" | "type">;
declare const triggerErrorEvent: (actionType: ActionTypes, { code, name, message, type }: EventErrorInfo) => void;
declare const triggerInternalErrorEvent: (info: EventErrorInfo) => void;
declare const triggerUserFacingErrorEvent: (info: EventErrorInfo) => void;
export { triggerErrorEvent, triggerInternalErrorEvent, triggerUserFacingErrorEvent, EventErrorInfo, };
//# sourceMappingURL=error.d.ts.map