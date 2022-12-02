import * as S from "@discovery/prelude/lib/data/stream";
import * as EventsLib from "@discovery/clients-js-events-lib";
import { ActionTypes as InteractionEvent } from "@discovery/clients-js-events-lib/lib/Interaction";
import { InteractionEventObject } from "../types";
declare type TriggerInteractionEventArgs = {
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
declare const triggerInteractionEvent: ({ interactionType, content, contentIndex, componentId, element, alias, searchTerm, }: TriggerInteractionEventArgs) => void;
declare const interactionEvent$: S.Stream<InteractionEventObject>;
export { InteractionEvent, TriggerInteractionEventArgs, triggerInteractionEvent, interactionEvent$, };
//# sourceMappingURL=interaction.d.ts.map