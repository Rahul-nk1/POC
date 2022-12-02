import * as RD from "@discovery/prelude/lib/data/remote-data";
import { cn } from "@discovery/classnames";
import { Tabbable } from "@discovery/components-tve/src/utils/hooks/use-tabbable/index";
import { useEffect, useCallback } from "@discovery/common-tve/lib/hooks";
import {
  InteractionEvent,
  useEventDataContext,
  triggerInteractionEvent,
} from "@discovery/common-tve/lib/eventing";

import * as ToastMessages from "../favorite-button/toast-messages";
import Strings from "../../hardcoded.json";
import { Icons } from "../favorite-button/icons";
import { useFavorite } from "../../../../utils/hooks/use-favorite";

import * as styles from "./styles.css";

export type RemoveFavoriteButtonProps = {
  id: string;
  category: string;
  className?: string;
  isFavorited?: boolean;
  onFavoriteChange?: (id: string, favorited: boolean) => void;
};

export const RemoveFavoriteButton = ({
  id,
  category,
  className,
  onFavoriteChange,
  isFavorited = false,
}: RemoveFavoriteButtonProps) => {
  const [favorited, setFavorite, response] = useFavorite(
    id,
    category,
    isFavorited,
    true,
    ToastMessages
  );
  const { eventData } = useEventDataContext();

  useEffect(() => {
    if (RD.is.Success(response)) {
      onFavoriteChange?.(id, favorited);
    }
  }, [id, favorited, response, onFavoriteChange]);

  const handleFavouriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setFavorite();
      triggerInteractionEvent({
        ...eventData,
        interactionType: InteractionEvent.CLICK,
        element: "mylist",
      });
    },
    [eventData, setFavorite]
  );

  return (
    <div className={cn(styles.favoriteButtonContainer, className, styles.left)}>
      <Tabbable>
        {({ className: accessibleClassName, ...tabbableProps }) => (
          <button
            className={cn(styles.button, styles.remove, accessibleClassName)}
            onClick={handleFavouriteClick}
            {...tabbableProps}
          >
            <Icons
              className={cn(styles.iconWrapper)}
              currentState={{ showText: true, text: Strings.removeText }}
              svgClassName={{
                checkMark: styles.checkmark,
                line1: styles.line1,
                line2: styles.line2,
              }}
            />
          </button>
        )}
      </Tabbable>
    </div>
  );
};
