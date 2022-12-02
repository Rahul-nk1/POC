import * as M from "@discovery/prelude/lib/data/maybe";
import React from "react";
import { TriggerInteractionEventArgs } from "../event/interaction";
declare type InteractionData = Omit<TriggerInteractionEventArgs, "interactionType">;
declare type PartialData = Partial<Omit<InteractionData, "content">> & {
    content?: Partial<InteractionData["content"]>;
};
declare type EventContextType = {
    eventData: InteractionData;
    contextMeta: Array<PartialData & {
        metaTag?: string;
    }>;
};
declare type Props = {
    content?: {
        id?: string;
        kind?: string;
        titleM?: M.Maybe<string>;
        linkM?: M.Maybe<string>;
        sectionTitleM?: M.Maybe<string>;
    };
    contentIndex?: number;
    componentIdM?: M.Maybe<string>;
    element?: string;
    children: React.ReactNode;
    metaTag?: string;
    ctx: EventContextType;
    alias?: string;
    searchTerm?: string;
};
/**
 * Consume eventData:
 *   const [eventData, contextMeta] = useEventDataContext()
 *     eventData:   formatted for InteractionEvents
 *     contextMeta: for development visibility
 *
 *   triggerInteractionEvent({
 *     ...eventData,
 *     interactionType: <InteractionEvent.CLICK | InteractionEvent.IMPRESSION>
 *   })
 *
 * Debugging:
 *   Log the `contextMeta` value to see how the eventData was created.
 */
declare const useEventDataContext: () => EventContextType;
/**
 * Provide eventData:
 *   Wrap a component with an <EventDataProvider> to start or add to a context
 *   tree, providing the above optional props.
 *
 *   Call `const [eventData, contextMeta] = useEventDataContext()` where the
 *   data is consumed, e.g. in the Impression wrapper (for impressions), or in
 *   Link, Button, .etc (for clicks). See `useEventDataContext` for more info.
 *
 * Optional parameter
 *     metaTag: for dev only, provide the name of the parent component or file
 *
 * Debugging:
 *   Be sure to use `key` prop if being used in an array:
 *     https://reactjs.org/docs/lists-and-keys.html
 *   See `useEventDataContext` for more
 */
declare const EventDataProvider: (props: Omit<Props, "ctx">) => JSX.Element;
export { EventDataProvider, useEventDataContext };
//# sourceMappingURL=context.d.ts.map