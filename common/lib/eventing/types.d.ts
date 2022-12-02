import { EventTypes, BrowseEventData, FormEventData, SearchEventData, UserProfileEventData, InteractionClickEventData, InteractionImpressionEventData, ErrorEventData, AuthenticationEventData, AccountEventData, VideoPlayerEventData } from "@discovery/clients-js-events-lib";
import { LogCustomized } from "@discovery/maestro-tourbus";
import { SessionStartEventData, SessionResumeEventData, SessionStopEventData } from "@discovery/clients-js-events-lib/lib/Session";
declare type AuthenticationEventObject = {
    type: EventTypes.AUTHENTICATION;
    data: AuthenticationEventData;
};
declare type ErrorEventObject = {
    type: EventTypes.ERROR;
    data: ErrorEventData;
};
declare type BrowseEventObject = {
    type: EventTypes.BROWSE;
    data: BrowseEventData;
};
declare type SessionEventObject = {
    type: EventTypes.SESSION;
    data: SessionStartEventData | SessionResumeEventData | SessionStopEventData;
};
declare type FormEventObject = {
    type: EventTypes.FORM;
    data: FormEventData;
};
declare type SearchEventObject = {
    type: EventTypes.SEARCH;
    data: SearchEventData;
};
declare type UserProfileEventObject = {
    type: EventTypes.USER_PROFILE;
    data: UserProfileEventData;
};
declare type InteractionEventObject = {
    type: EventTypes.INTERACTION;
    data: InteractionClickEventData | InteractionImpressionEventData;
};
declare type AccountEventTypeObject = {
    type: EventTypes.ACCOUNT;
    data: AccountEventData;
};
declare type VideoPlayerEventTypeObject = {
    type: EventTypes.VIDEO_PLAYER;
    data: VideoPlayerEventData;
};
declare type Events = AuthenticationEventObject | ErrorEventObject | BrowseEventObject | SessionEventObject | FormEventObject | SearchEventObject | UserProfileEventObject | InteractionEventObject | AccountEventTypeObject | VideoPlayerEventTypeObject;
declare type EventsLog = LogCustomized<Events>;
export { Events, EventsLog, AuthenticationEventObject, ErrorEventObject, BrowseEventObject, SessionEventObject, FormEventObject, SearchEventObject, UserProfileEventObject, InteractionEventObject, };
//# sourceMappingURL=types.d.ts.map