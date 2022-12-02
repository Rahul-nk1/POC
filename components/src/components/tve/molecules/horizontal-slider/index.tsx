import { cn } from "@discovery/classnames";
import composeRefs from "@seznam/compose-react-refs";
import {
  useCallback,
  useInView,
  useRef,
} from "@discovery/common-tve/lib/hooks";
import { asyncGetBoundingClientRect } from "@discovery/roadie";

import { GoToPrev, GoToNext } from "../../atoms/carousel-nav";
import * as styles from "./styles.css";

enum Direction {
  left,
  right,
}

// This delay is for the scrollBy to finish and then trigger API
const fetchMoreDelay = 500;

export type ClassNames = Partial<Record<"container" | "rail", string>>;

type Props = {
  children: React.ReactNode;
  classNames?: ClassNames;
  navButtonClassLeft?: string;
  navButtonClassRight?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
  innerRef?: React.Ref<HTMLDivElement>;
  offsetButtons?: boolean;
  onScrollRight?: (pagesRemaining: number) => void;
};

/**
 * Used for wrapping items that are wider than their parent, adds nav buttons.
 * Defaults to traveling full width of parent per click, or you can set a
 * percent of parent travel distance.
 */
export const HorizontalSlider = ({
  children,
  classNames = {},
  navButtonClassLeft,
  navButtonClassRight,
  containerRef,
  innerRef,
  offsetButtons = false,
  onScrollRight = () => {},
}: Props) => {
  /* Setting up Intersection Observer for left and right triggers */
  // Probably passing a seeter into ref would fix this
  const container = useRef<HTMLDivElement>(null);
  const ioOptions = { threshold: 1, root: container };
  const leftTrigger = useRef<HTMLDivElement>(null);
  const rightTrigger = useRef<HTMLDivElement>(null);
  const { inView: inViewLeft } = useInView(leftTrigger, ioOptions);
  const { inView: inViewRight } = useInView(rightTrigger, ioOptions);

  /* The inner channel and its scroll control */
  const inner = useRef<HTMLDivElement>(document.body as HTMLDivElement);
  const scroll = useCallback(
    async (direction: Direction) => {
      const el = inner.current;
      const reverse = direction === Direction.left;
      const { width } = await asyncGetBoundingClientRect(el);
      el.scrollBy({ left: reverse ? -1 * width : width });

      if (rightTrigger.current && direction === Direction.right) {
        const { left } = await asyncGetBoundingClientRect(rightTrigger.current);
        const pagesRemaining = Math.floor(left / width - 1);
        setTimeout(() => {
          onScrollRight(pagesRemaining);
        }, fetchMoreDelay);
      }
    },
    [onScrollRight]
  );

  /* Prevent the nav buttons from flashing on screen during page load */
  const showNavButtons = inner.current.scrollWidth > inner.current.offsetWidth;

  return (
    <div
      className={cn(styles.horizontalSlider, classNames.container)}
      ref={composeRefs(container, containerRef)}
    >
      <div
        className={cn(styles.inner, classNames.rail)}
        ref={composeRefs(inner, innerRef)}
      >
        <div ref={leftTrigger} className={styles.triggerLeft} />
        {children}
        <div ref={rightTrigger} className={styles.triggerRight} />
      </div>

      <GoToPrev
        onClick={() => scroll(Direction.left)}
        className={cn(styles.moreLeft, navButtonClassLeft, {
          [styles.show]: !inViewLeft && showNavButtons,
          [styles.offset]: offsetButtons,
        })}
        tabIndex={-1}
      />
      <GoToNext
        onClick={() => scroll(Direction.right)}
        className={cn(styles.moreRight, navButtonClassRight, {
          [styles.show]: !inViewRight && showNavButtons,
          [styles.offset]: offsetButtons,
        })}
        tabIndex={-1}
      />
    </div>
  );
};
