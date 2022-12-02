import { cn } from "@discovery/classnames";

import { Tabbable } from "@discovery/components-tve/src/utils/hooks/use-tabbable";
import * as styles from "./styles.css";

export type CarouselNavProps = {
  className?: string;
  onClick: (e: React.MouseEvent) => void;
  tabIndex?: number;
};

enum NavDirection {
  Prev = "Previous",
  Next = "Next",
}

type TabbableNavProps = CarouselNavProps & {
  direction: NavDirection;
};

const TabbableNav = ({
  className,
  onClick,
  tabIndex,
  direction,
}: TabbableNavProps) => (
  <Tabbable>
    {({ className: accessibleClassName, onKeyUp, onBlur }) => (
      <button
        onClick={onClick}
        className={cn(className, accessibleClassName, {
          [styles.goToNext]: direction === NavDirection.Next,
          [styles.goToPrev]: direction === NavDirection.Prev,
        })}
        aria-label={direction}
        tabIndex={tabIndex}
        onKeyUp={onKeyUp}
        onBlur={onBlur}
      />
    )}
  </Tabbable>
);

export const GoToPrev = (props: CarouselNavProps) => (
  <TabbableNav {...props} direction={NavDirection.Prev} />
);

export const GoToNext = (props: CarouselNavProps) => (
  <TabbableNav {...props} direction={NavDirection.Next} />
);
