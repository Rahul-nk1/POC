import { cn } from "@discovery/classnames";
import { useCallback } from "@discovery/common-tve/lib/hooks";
import {
  triggerInteractionEvent,
  InteractionEvent,
  useEventDataContext,
} from "@discovery/common-tve/lib/eventing";

import { P, Weights } from "../../atoms/text";
import { Search as SearchIcon } from "../../atoms/icons";
import Strings from "../../hardcoded.json";

import * as styles from "./styles.css";

export const Search = ({ onClick }: { onClick: () => void }) => {
  const { eventData } = useEventDataContext();
  const triggerClickEvent = useCallback(() => {
    triggerInteractionEvent({
      ...eventData,
      interactionType: InteractionEvent.CLICK,
    });
    onClick();
  }, [eventData, onClick]);

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) =>
        e.key === "Enter" && triggerClickEvent()
      }
      onClick={triggerClickEvent}
      className={cn(styles.link, styles.searchButton)}
      aria-label={Strings.searchText}
    >
      <SearchIcon className={styles.icon} />
      <P
        weight={Weights.semiBold}
        className={cn(
          styles.indicator,
          styles.hideBelowSmall,
          styles.withoutLeftMargin
        )}
      >
        {Strings.searchText}
      </P>
    </div>
  );
};
