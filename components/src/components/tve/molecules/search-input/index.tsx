import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import * as styles from "./styles.css";
import {
  useCallback,
  useDebounceDispatch,
  useState,
  useEffect,
  useHistory,
} from "@discovery/common-tve/lib/hooks";
import { searchQueryParam } from "../../../../site-builder/tve/components/menu-bar";
import {
  useEventDataContext,
  triggerInteractionEvent,
  InteractionEvent,
} from "@discovery/common-tve/src/eventing";

export type ClassNames = Partial<Record<"container" | "clear", string>>;

export type Props = {
  onChange: (text: string) => void;
  onEscape?: VoidFunction;
  placeholder?: string;
  debounceDelay?: number;
  classNames?: ClassNames;
};

export const SearchInput = ({
  onChange,
  onEscape,
  placeholder,
  debounceDelay = 500,
  classNames = {},
}: Props) => {
  const [searchText, setSearchText] = useState("");
  const [changes] = useHistory();
  const { eventData } = useEventDataContext();

  useEffect(() => {
    // If the user changes the search query with navigation, for example by using the back
    // button then we need to update input state to reflect the new query.

    // TODO HACK it might be neater to use useHistory changes for this, but it currently appears to
    // have a bug that prevents us from doing so.
    const query =
      new URLSearchParams(window.location.search).get(searchQueryParam) || "";

    setSearchText(query);
  }, [changes]);

  const debouncedChange = useDebounceDispatch(onChange, debounceDelay, [
    onChange,
  ]);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const textM = M.of(e.target.value);

      M.map((text) => {
        setSearchText(text);
        debouncedChange(text);
      }, textM);
    },
    [debouncedChange, setSearchText]
  );

  const handleClick = () => {
    setSearchText("");
    debouncedChange("");
    triggerInteractionEvent({
      ...eventData,
      element: "clear_search",
      interactionType: InteractionEvent.CLICK,
    });
  };

  const handleEscape = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && onEscape) {
        onEscape();
      }
    },
    [onEscape]
  );

  return (
    <div className={cn(styles.searchInputContainer, classNames.container)}>
      <input
        type="text"
        autoComplete="on"
        autoFocus
        placeholder={placeholder}
        value={searchText}
        onChange={handleChange}
        onKeyDown={handleEscape}
      />
      {searchText.length > 0 && (
        <div
          className={cn(styles.searchClearIcon, classNames.clear)}
          onClick={handleClick}
        ></div>
      )}
    </div>
  );
};
