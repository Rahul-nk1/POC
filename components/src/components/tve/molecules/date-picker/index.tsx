import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import { HorizontalSlider } from "../horizontal-slider";
import { Tab } from "./tab";
import {
  useEventDataContext,
  InteractionEvent,
  triggerInteractionEvent,
} from "@discovery/common-tve/lib/eventing";
import { useCallback } from "@discovery/common-tve/lib/hooks";
import * as styles from "./styles.css";

export type DateTabType = Tab;

export type Props = {
  tabs: L.List<Tab>;
  handleClick: (subtab: Tab) => void;
  selectedM: M.Maybe<string>;
};

export const DatePicker = ({ tabs, selectedM, handleClick }: Props) => {
  const { eventData } = useEventDataContext();
  const triggerClickEvent = useCallback(
    (tab: Tab) => {
      triggerInteractionEvent({
        ...eventData,
        content: {
          ...eventData.content,
          contentTitle: tab.id,
        },
        interactionType: InteractionEvent.CLICK,
      });
    },
    [eventData]
  );
  return (
    <HorizontalSlider classNames={{ container: styles.slider }}>
      <div className={styles.spacer}></div>
      {L.map((tab) => {
        const selected = M.equals(selectedM, M.of(tab.id));
        return (
          <Tab
            tab={tab}
            key={tab.id}
            selected={selected}
            onClick={() => {
              handleClick(tab);
              triggerClickEvent(tab);
            }}
          />
        );
      }, tabs)}
      <div className={styles.spacer}></div>
    </HorizontalSlider>
  );
};
