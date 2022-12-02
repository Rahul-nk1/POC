import {
  EventTypes,
  BrowseEventData,
  FormEventData,
  SearchEventData,
  UserProfileEventData,
  InteractionClickEventData,
  InteractionImpressionEventData,
  ErrorEventData,
  AuthenticationEventData,
  AccountEventData,
  VideoPlayerEventData,
} from "@discovery/clients-js-events-lib";
import { LogCustomized } from "@discovery/maestro-tourbus";
import {
  SessionStartEventData,
  SessionResumeEventData,
  SessionStopEventData,
} from "@discovery/clients-js-events-lib/lib/Session";

type AuthenticationEventObject = {
  type: EventTypes.AUTHENTICATION;
  data: AuthenticationEventData;
};
type ErrorEventObject = {
  type: EventTypes.ERROR;
  data: ErrorEventData;
};
type BrowseEventObject = {
  type: EventTypes.BROWSE;
  data: BrowseEventData;
};
type SessionEventObject = {
  type: EventTypes.SESSION;
  data: SessionStartEventData | SessionResumeEventData | SessionStopEventData;
};
type FormEventObject = {
  type: EventTypes.FORM;
  data: FormEventData;
};
type SearchEventObject = {
  type: EventTypes.SEARCH;
  data: SearchEventData;
};
type UserProfileEventObject = {
  type: EventTypes.USER_PROFILE;
  data: UserProfileEventData;
};
type InteractionEventObject = {
  type: EventTypes.INTERACTION;
  data: InteractionClickEventData | InteractionImpressionEventData;
};
type AccountEventTypeObject = {
  type: EventTypes.ACCOUNT;
  data: AccountEventData;
};
type VideoPlayerEventTypeObject = {
  type: EventTypes.VIDEO_PLAYER;
  data: VideoPlayerEventData;
};

type Events =
  | AuthenticationEventObject
  | ErrorEventObject
  | BrowseEventObject
  | SessionEventObject
  | FormEventObject
  | SearchEventObject
  | UserProfileEventObject
  | InteractionEventObject
  | AccountEventTypeObject
  | VideoPlayerEventTypeObject;

type EventsLog = LogCustomized<Events>;

export {
  Events,
  EventsLog,
  AuthenticationEventObject,
  ErrorEventObject,
  BrowseEventObject,
  SessionEventObject,
  FormEventObject,
  SearchEventObject,
  UserProfileEventObject,
  InteractionEventObject,
};
