import { log } from "../setup";
import { EventTypes, ErrorEventData } from "@discovery/clients-js-events-lib";
import { ActionTypes } from "@discovery/clients-js-events-lib/lib/Error";
import { getScreenName } from "./utils";

type EventErrorInfo = Pick<
  ErrorEventData,
  "code" | "name" | "message" | "type"
>;

const triggerErrorEvent = (
  actionType: ActionTypes,
  { code, name, message, type }: EventErrorInfo
) => {
  const data: ErrorEventData = {
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

const triggerInternalErrorEvent = (info: EventErrorInfo) =>
  triggerErrorEvent(ActionTypes.INTERNAL, info);

const triggerUserFacingErrorEvent = (info: EventErrorInfo) =>
  triggerErrorEvent(ActionTypes.USER_FACING, info);

export {
  triggerErrorEvent,
  triggerInternalErrorEvent,
  triggerUserFacingErrorEvent,
  EventErrorInfo,
};
