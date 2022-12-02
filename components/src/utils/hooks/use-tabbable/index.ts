import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import {
  useState,
  useMemo,
  useCallback,
  useRef,
} from "@discovery/common-tve/lib/hooks";
import { cn } from "@discovery/classnames";
import { Reference } from "@discovery/orchestra/lib/dependencies";
import { AriaRoles } from "../../types";

import styles from "./style.css";

export const lastTab = { timestamp: 0 };

export enum Keys {
  Enter = "Enter",
  Escape = "Escape",
  Tab = "Tab",
  Space = " ",
  Left = "ArrowLeft",
  Right = "ArrowRight",
  Down = "ArrowDown",
  Up = "ArrowUp",
}

type Options = {
  scrollIntoView?: boolean;
  onSelectAction?: (e?: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  accessibleKeyList?: Array<string>;
  tabIndex?: number;
  customKeyActions?: {
    [key in Keys]?: () => void;
  };
  role?: keyof typeof AriaRoles;
};

/**
 * This function handles centering any element that was tabbed to, if the
 * scrollIntoView flag is present. The browser native flag, "scrollIntoView",
 * was not as precise as needed, it was shifting large parts of the page,
 * causing other content to shift off screen horizontally.
 */
const scrollToCenter = (el: HTMLElement, parent: HTMLElement) => {
  const boundaryPadding = 0.15; // 10%

  const { offsetLeft: left, offsetWidth: width } = el;
  const right = left + width;

  const { scrollLeft, clientWidth: parentWidth } = parent;
  const scrollRight = scrollLeft + parentWidth;

  const moveToCenter = () => {
    const centeredOffset = left - parentWidth / 2 + width / 2;
    parent.scrollTo({
      left: Math.max(0, centeredOffset),
    });
  };

  if (left < scrollLeft + parentWidth * boundaryPadding) {
    moveToCenter();
  } else if (right > scrollRight - parentWidth * boundaryPadding) {
    moveToCenter();
  }
};

/**
 * Returns a set of props that will enable tabbable accessible navigation.
 *
 * Beware of the `className` that is returned:
 *   Typescript WILL alert you if the `tabbableProps.className` is overwriting
 *   a className placed before it, but:
 *     it will NOT warn you if your className comes AFTER!
 */
export const useTabbable = ({
  scrollIntoView,
  onSelectAction,
  accessibleKeyList,
  tabIndex = 0,
  customKeyActions = {},
  role,
}: Options = {}) => {
  const [wasTabbedTo, setWasTabbedTo] = useState(false);

  const tabbableProps = useMemo(
    () => ({
      className: cn({
        [styles.accessibleOutline]: wasTabbedTo,
        [styles.noOutline]: !wasTabbedTo,
      }),
      tabIndex,
      onBlur: () => setWasTabbedTo(false),
      /* The 'tab' listener is in keyup, because focus has not happened
      until after keydown */
      onKeyUp: (e: React.KeyboardEvent<HTMLElement>) => {
        if ((accessibleKeyList || [Keys.Tab]).includes(e.key)) {
          lastTab.timestamp = Date.now();
          setWasTabbedTo(true);

          const el = e.currentTarget;
          const parent = e.currentTarget.parentElement;
          if (scrollIntoView && parent) {
            scrollToCenter(el, parent);
          }
        }
      },
      /* The custom key listeners are in keydown, so they can override
      stop propagation to native keydown listeners */
      onKeyDown: (e: React.KeyboardEvent) => {
        let usedCustomAction = false;

        Object.entries(customKeyActions).forEach(([trigger, action]) => {
          if (action && trigger === e.key) {
            e.stopPropagation();
            action();
            usedCustomAction = true;
          }
        });

        if (
          !usedCustomAction &&
          onSelectAction &&
          [Keys.Space, Keys.Enter].includes(e.key as Keys)
        ) {
          e.stopPropagation();
          onSelectAction(e);
        }
      },
      role,
    }),
    [
      wasTabbedTo,
      scrollIntoView,
      onSelectAction,
      accessibleKeyList,
      tabIndex,
      customKeyActions,
      role,
    ]
  );

  return tabbableProps;
};

/**
 * RenderProps option for useTabbable. This provides a unique context for hooks
 * when tabbability needs to be applied to multiple mapped elements.
 */
type TabbableProps = Options & {
  children(props: ReturnType<typeof useTabbable>): JSX.Element;
};

export const Tabbable = ({ children, ...options }: TabbableProps) =>
  children(useTabbable(options));

type DropdownOptions<T extends HTMLElement> = Options & {
  open: boolean;
  setOpen: (open: boolean) => void;
  containerEl: Reference<T | null>;
};

/**
 * Dropdowns are more complex. This hook requires an internal list of list
 * elements.
 *
 * Two sets of props are returned:
 *   1 tabbableContainerProps
 *       for the container, to add generic tabbability, and kick off tabbable
 *         list navigation
 *   2 tabbableItemPropsCallback
 *       for each list item, adding the action (onClick / enter) and navigation
 */
export const useTabbableForDropdowns = <T extends HTMLElement>({
  open,
  setOpen,
  containerEl,
  ...options
}: DropdownOptions<T>) => {
  const tabbableProps = useTabbable({
    ...options,
    accessibleKeyList: [
      Keys.Down,
      Keys.Right,
      Keys.Up,
      Keys.Left,
      Keys.Tab,
      Keys.Escape,
    ],
  });
  const [optionsL, setOptionsL] = useState<L.List<HTMLLIElement>>(L.empty());

  /** TabbaleContainer will NOT send an action */
  const onKeyDown = useCallback(
    (action?: () => void) => (e: React.KeyboardEvent) => {
      const isLastOption = () => {
        // using M.equals causes a "Maximum call stack size exceeded" error
        const last = M.fromMaybe(L.last(optionsL), undefined);
        return e.currentTarget === last;
      };

      if (e.key === Keys.Escape) {
        // close the dropdown and move focus to the container
        e.preventDefault();
        setOpen(false);
        containerEl.current?.focus();
      } else if (e.key === Keys.Tab && isLastOption()) {
        e.stopPropagation();
        setOpen(false);
      } else if (
        [
          Keys.Enter,
          Keys.Space,
          Keys.Left,
          Keys.Right,
          Keys.Down,
          Keys.Up,
        ].includes(e.key as Keys)
      ) {
        e.preventDefault();
        e.stopPropagation();

        if (!open) {
          // if not open, all Keys except Escape and Tab will open the dropdown
          setOpen(true);
        } else if ([Keys.Enter, Keys.Space].includes(e.key as Keys)) {
          if (action) {
            // if there's an action, Enter and Space will trigger action()
            action();
          } else {
            /* isContainer */
            // if this is the container, the action is to close the dropdown
            setOpen(false);
          }
        } else {
          // remaining arrow keys trigger circular navigation through list
          const i = L.indexOf(e.currentTarget, optionsL);
          const next = L.nth(i + 1, optionsL);
          const first = L.head(optionsL);
          const prev = L.nth(i - 1, optionsL);
          const last = L.last(optionsL);

          if ([Keys.Down, Keys.Right].includes(e.key as Keys)) {
            M.map((el) => el.focus(), M.alt(next, first));
          } else if ([Keys.Up, Keys.Left].includes(e.key as Keys)) {
            M.map((el) => el.focus(), M.alt(prev, last));
          }
        }
      }
    },
    [open, setOpen, containerEl, optionsL]
  );

  const tabbableContainerProps = useMemo(
    () => ({
      ...tabbableProps,
      onKeyDown: onKeyDown(), // tabbaleContainer MUST send `undefined` action
    }),
    [tabbableProps, onKeyDown]
  );

  const tabbableItemPropsCallback = useCallback(
    (onOptionSelect: () => void, options: { insertAt?: number } = {}) => ({
      ...tabbableProps,
      tabIndex: open ? 0 : -1,
      ref: (el: HTMLLIElement) => {
        setOptionsL((prevOptionsL) => {
          const { insertAt } = options;
          const notFound = el && !L.contains(el, prevOptionsL);
          return notFound
            ? insertAt !== undefined
              ? L.insert(insertAt, el, prevOptionsL)
              : L.append(el, prevOptionsL)
            : prevOptionsL;
        });
      },
      onKeyDown: onKeyDown(onOptionSelect),
    }),
    [tabbableProps, onKeyDown, open]
  );

  return [tabbableContainerProps, tabbableItemPropsCallback] as const;
};

export type TabbableItemPropsCallback = (
  onOptionSelect: () => void,
  options?: {
    insertAt?: number;
  }
) => ReturnType<typeof useTabbableForDropdowns>[0];

/**
 * RenderProps option for useTabbableForDropdowns.
 */
type TabbableDropdownProps<T extends HTMLElement> = Omit<
  DropdownOptions<T>,
  "containerEl"
> & {
  children(props: {
    containerEl: Reference<T | null>;
    tabbableContainerProps: ReturnType<typeof useTabbableForDropdowns>[0];
    tabbableItemPropsCallback: TabbableItemPropsCallback;
  }): JSX.Element;
};

export const TabbableDropdown = <T extends HTMLElement>({
  children,
  ...props
}: TabbableDropdownProps<T>) => {
  const containerEl = useRef<T>(null);
  const [
    tabbableContainerProps,
    tabbableItemPropsCallback,
  ] = useTabbableForDropdowns({ containerEl, ...props });

  return children({
    containerEl,
    tabbableContainerProps,
    tabbableItemPropsCallback,
  });
};
