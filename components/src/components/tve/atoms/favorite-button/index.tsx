import * as RD from "@discovery/prelude/lib/data/remote-data";
import { cn } from "@discovery/classnames";
import {
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "@discovery/common-tve/lib/hooks";
import { Tabbable } from "@discovery/components-tve/src/utils/hooks/use-tabbable/index";
import {
  InteractionEvent,
  useEventDataContext,
  triggerInteractionEvent,
} from "@discovery/common-tve/lib/eventing";

import * as ToastMessages from "./toast-messages";
import { Icons } from "./icons";
import { useFavorite } from "../../../../utils/hooks/use-favorite";
import { defaultText } from "./defaults";
import { getNextStatusClick } from "./actions";
import {
  Props,
  IconClasses,
  FavoriteButtonState,
  FavoriteButtonStatus,
  FavoriteButtonDirection,
} from "./types";

import * as styles from "./styles.css";

const plusIconStyle = styles.plus;
const checkIconStyle = styles.check;
const getIconClasses = (currentStatus: FavoriteButtonStatus) => {
  switch (currentStatus) {
    case FavoriteButtonStatus.AddConfirm:
      return {
        icon: plusIconStyle,
        expand: styles.addForce,
      };
    case FavoriteButtonStatus.Added:
      return {
        icon: checkIconStyle,
        expand: styles.remove,
      };
    case FavoriteButtonStatus.RemoveConfirm:
      return {
        icon: checkIconStyle,
        expand: styles.removeForce,
      };
    case FavoriteButtonStatus.Default:
    case FavoriteButtonStatus.Init:
      return {
        icon: plusIconStyle,
        expand: styles.add,
      };
  }
};

export const FavoriteButton = ({
  id,
  category,
  className,
  onFavoriteChange,
  text = defaultText,
  isFavorited = false,
  changeStatusOnClick = false,
  status = FavoriteButtonStatus.Default,
  direction = FavoriteButtonDirection.Left,
}: Props) => {
  const [favorited, setFavorite, response] = useFavorite(
    id,
    category,
    isFavorited,
    true,
    ToastMessages
  );
  const _status = favorited ? FavoriteButtonStatus.Added : status;
  const [currentStatus, setStatus] = useState(_status);
  const { eventData } = useEventDataContext();

  /**
   * if `status` or `isFavorited` props change outside this component,
   * `currentStatus` WILL NOT UPDATE unless we manually `setStatus` via
   * an effect hook.
   *
   * this allows us to toggle the state/status of this button based on
   * the response from the `favorite` API endpoint, rather than just
   * if the button was clicked
   */
  useEffect(() => {
    setStatus(_status);
    if (RD.is.Success(response)) {
      onFavoriteChange?.(id, favorited);
      setStatus(_status);
    }
  }, [_status, id, favorited, response, onFavoriteChange]);

  const animationDirectionClass =
    direction === FavoriteButtonDirection.Left ? styles.left : styles.right;

  const states = useMemo<Record<FavoriteButtonStatus, FavoriteButtonState>>(
    () => ({
      [FavoriteButtonStatus.Init]: {
        text: text.plusExpand,
        showText: false,
      },
      [FavoriteButtonStatus.Default]: {
        text: text.plusExpand,
        showText: false,
      },
      [FavoriteButtonStatus.AddConfirm]: {
        text: text.plusExpand,
        showText: true,
      },
      [FavoriteButtonStatus.Added]: {
        text: text.checkExpand,
        showText: false,
      },
      [FavoriteButtonStatus.RemoveConfirm]: {
        text: text.checkExpand,
        showText: true,
      },
    }),
    [text]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const nextStatus = getNextStatusClick(currentStatus);
      setFavorite();
      if (changeStatusOnClick) {
        setStatus(nextStatus);
      }
      triggerInteractionEvent({
        ...eventData,
        interactionType: InteractionEvent.CLICK,
        element: "mylist",
      });
    },
    [eventData, changeStatusOnClick, setStatus, currentStatus, setFavorite]
  );

  /**
   * Alter the applied classes based on the current state vs.
   * the "implied" state (via hover)
   */
  const classes: IconClasses = getIconClasses(currentStatus);

  return (
    <div
      className={cn(
        styles.favoriteButtonContainer,
        className,
        animationDirectionClass
      )}
    >
      <Tabbable>
        {({ className: accessibleClassName, ...tabbableProps }) => (
          <button
            className={cn(styles.button, classes.expand, accessibleClassName)}
            onClick={handleClick}
            {...tabbableProps}
          >
            <Icons
              className={cn(styles.iconWrapper, animationDirectionClass)}
              currentState={states[currentStatus]}
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
