import * as M from "@discovery/prelude/lib/data/maybe";
import React, { Component } from "react";
import { TriggerInteractionEventArgs } from "../event/interaction";
import { useContext } from "../../hooks";

type InteractionData = Omit<TriggerInteractionEventArgs, "interactionType">;

type PartialData = Partial<Omit<InteractionData, "content">> & {
  content?: Partial<InteractionData["content"]>;
};

type EventContextType = {
  eventData: InteractionData;
  contextMeta: Array<PartialData & { metaTag?: string }>;
};

const contextInitialValue: EventContextType = {
  eventData: {
    content: {
      id: undefined,
      kind: "",
      contentTitle: "",
      sectionTitle: "",
      link: "",
    },
    contentIndex: 0, // default for items NOT found in an array
    componentId: "",
    element: undefined,
    alias: "",
  },
  contextMeta: [],
};

const EventDataContext = React.createContext(contextInitialValue);

type Props = {
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

const buildContext = (data: Props): EventContextType => {
  const {
    content,
    contentIndex,
    componentIdM,
    element,
    ctx,
    metaTag,
    alias,
    searchTerm,
  } = data;

  /* Get only the updated values */
  const updatedValues = {
    ...(contentIndex !== undefined && { contentIndex }),
    ...(componentIdM && {
      componentId: M.fromMaybe(componentIdM, undefined),
    }),
    ...(alias && { alias }),
    ...(element && { element }),
    ...(content && {
      content: {
        ...(content.id && { id: content.id }),
        ...(content.kind !== undefined && { kind: content.kind }),
        ...(content.titleM && {
          contentTitle: M.fromMaybe(content.titleM, ""),
        }),
        ...(content.sectionTitleM && {
          sectionTitle: M.fromMaybe(content.sectionTitleM, ""),
        }),
        ...(content.linkM && { link: M.fromMaybe(content.linkM, "") }),
      },
    }),
    ...(searchTerm && { searchTerm }),
  };

  const newData = {
    ...ctx.eventData,
    ...updatedValues,
    content: {
      ...ctx.eventData.content,
      ...(updatedValues.content || {}),
    },
  };

  return {
    eventData: newData,
    contextMeta: [...ctx.contextMeta, { ...updatedValues, metaTag }],
  };
};

class ContextManager extends Component<Props, EventContextType> {
  constructor(props: Props) {
    super(props);
    this.state = buildContext(props);
  }

  updateCurrentContext = () => {
    this.setState(buildContext(this.props));
  };

  render() {
    return (
      <EventDataContext.Provider
        value={this.state}
        children={this.props.children}
      />
    );
  }
}

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
const useEventDataContext: () => EventContextType = () =>
  useContext(EventDataContext);

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
const EventDataProvider = (props: Omit<Props, "ctx">) => {
  const ctx = useEventDataContext();
  return <ContextManager {...props} ctx={ctx} />;
};

export { EventDataProvider, useEventDataContext };
