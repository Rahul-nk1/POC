import * as S from "@discovery/prelude/lib/data/stream";
import * as EventsLib from "@discovery/clients-js-events-lib";
import { ActionTypes as InteractionEvent } from "@discovery/clients-js-events-lib/lib/Interaction";
import { getScreenName } from "./utils";
import { InteractionEventObject } from "../types";
import { log } from "../setup";

type TriggerInteractionEventArgs = {
  interactionType: InteractionEvent;
  content: {
    id?: EventsLib.InteractionClickEventData["contentId"];
    kind?: string;
    contentTitle?: string;
    sectionTitle?: string;
    link: string;
  };
  contentIndex: number;
  componentId: string;
  element?: string;
  alias: string;
  searchTerm?: string;
};
const triggerInteractionEvent = ({
  interactionType,
  content,
  contentIndex,
  componentId,
  element,
  alias,
  searchTerm,
}: TriggerInteractionEventArgs) => {
  const { location } = window;
  const screenName = getScreenName(location.pathname);
  const { contentTitle } = content;
  //TODO Temp. solution to get location details till we get location from response
  const locationStr = `${screenName}|${componentId}|${alias}`;

  const data: EventsLib.InteractionClickEventData = {
    action: interactionType,
    contentId: content.id,
    contentType: content.kind,
    screenName: screenName,
    screenURI: location.href,
    location: locationStr,
    locationPosition: contentIndex,
    // element is not used for IMPRESSION events
    element: interactionType === InteractionEvent.CLICK ? element : undefined,
    targetText: contentTitle,
    targetURI: new URL(content.link, location.href).href,
    searchTerm,
    //TODO: Need to get personalized info from sonic. Sonic does not currently
    //send it. Some comments are here:
    //https://discoveryinc.atlassian.net/browse/LDW-3308

    //personalized: true,
  };

  const event: InteractionEventObject = {
    type: EventsLib.EventTypes.INTERACTION,
    data,
  };

  log(event);
  // Push the events to the interactionevent stream
  pushInteractionEvent(event);
};
// Interaction event stream here is needed as there are some events such as
// `browse` that wants to know what triggered it
const [pushInteractionEvent, interactionEvent$]: [
  (event: InteractionEventObject) => void,
  S.Stream<InteractionEventObject>
] = S.createAdapter<InteractionEventObject>();

export {
  InteractionEvent,
  TriggerInteractionEventArgs,
  triggerInteractionEvent,
  interactionEvent$,
};
