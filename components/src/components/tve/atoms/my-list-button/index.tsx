import * as RD from "@discovery/prelude/lib/data/remote-data";
import { cn } from "@discovery/classnames";
import { Tabbable } from "@discovery/components-tve/src/utils/hooks/use-tabbable";
import {
  useEffect,
  useState,
  useCallback,
} from "@discovery/common-tve/lib/hooks";
import {
  InteractionEvent,
  useEventDataContext,
  triggerInteractionEvent,
} from "@discovery/common-tve/lib/eventing";

export * from "./types";
import * as ToastMessages from "../favorite-button/toast-messages";
import { Icons } from "./icons";
import { useFavorite } from "../../../../utils/hooks/use-favorite";
import { getNextStatusClick } from "./actions";
import {
  Props,
  IconClasses,
  MyListButtonTheme,
  MyListButtonStatus,
  MyListButtonVariant,
} from "./types";
import { AriaRoles } from "../../../../utils/types";

import * as styles from "./styles.css";

const getIconClasses = (
  currentStatus: MyListButtonStatus,
  theme: MyListButtonTheme,
  variant: MyListButtonVariant = MyListButtonVariant.Default
) => {
  const baseClasses = {
    theme: theme === MyListButtonTheme.Light ? styles.light : styles.dark,
    variant: variant === MyListButtonVariant.Hero ? styles.hero : null,
  };

  switch (currentStatus) {
    case MyListButtonStatus.AddConfirm:
      return {
        ...baseClasses,
        icon: styles.plus,
        expand: styles.addForce,
      };
    case MyListButtonStatus.Added:
      return {
        ...baseClasses,
        icon: styles.check,
        expand: styles.remove,
      };
    case MyListButtonStatus.RemoveConfirm:
      return {
        ...baseClasses,
        icon: styles.check,
        expand: styles.removeForce,
      };
    case MyListButtonStatus.Default:
    case MyListButtonStatus.Init:
      return {
        ...baseClasses,
        icon: styles.plus,
        expand: styles.add,
      };
  }
};

export const MyListButton = ({
  id,
  _ref,
  category,
  className,
  labelClass,
  onFavoriteChange,
  showToast = true,
  onLoad = () => {},
  isFavorited = false,
  changeStatusOnClick = false,
  setGlobalFavoritedState = false,
  theme = MyListButtonTheme.Light,
  setFavoriteInDrawer = () => false,
  status = MyListButtonStatus.Default,
  variant = MyListButtonVariant.Default,
}: Props) => {
  const [favorited, setFavorite, response] = useFavorite(
    id,
    category,
    isFavorited,
    showToast,
    ToastMessages,
    setGlobalFavoritedState
  );
  const _status = favorited ? MyListButtonStatus.Added : status;
  const [currentStatus, setStatus] = useState(_status);
  const { eventData } = useEventDataContext();

  useEffect(() => {
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const nextStatus = getNextStatusClick(currentStatus);
      setFavorite();
      // This is to resolve the issue associated with favoriting state in MobileEpisodeDrawer
      setFavoriteInDrawer(!favorited);
      if (changeStatusOnClick) {
        setStatus(nextStatus);
      }
      triggerInteractionEvent({
        ...eventData,
        interactionType: InteractionEvent.CLICK,
        element: "mylist",
      });
    },
    [
      eventData,
      favorited,
      setStatus,
      setFavorite,
      currentStatus,
      setFavoriteInDrawer,
      changeStatusOnClick,
    ]
  );

  /**
   * Alter the applied classes based on the current state vs.
   * the "implied" state (via hover)
   */
  const classes: IconClasses = getIconClasses(currentStatus, theme, variant);

  return (
    <div
      className={cn(styles.myListButtonContainer, className)}
      onClick={handleClick}
      ref={_ref}
    >
      <Tabbable onSelectAction={handleClick} role={AriaRoles.button}>
        {({ className: accessibleClassName, ...tabbableProps }) => (
          <button
            className={cn(styles.button, classes.expand, accessibleClassName)}
            {...tabbableProps}
          >
            <Icons
              className={cn(styles.buttonContents, classes.theme)}
              classes={classes}
              label="MY LIST"
              theme={theme}
              variant={variant}
              labelClass={labelClass}
            />
          </button>
        )}
      </Tabbable>
    </div>
  );
};
