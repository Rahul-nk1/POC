import { MouseEvent } from "react";
import { cn } from "@discovery/classnames";
import { Tabbable } from "@discovery/components-tve/src/utils/hooks/use-tabbable";
import { Tags } from "../../../../utils/types";
import * as styles from "./styles.css";

export type SkipLinkProps = {
  tag?: Tags;
  className?: string;
  text?: string;
};

const DEFAULT_TEXT = "Skip to Content";

export const SkipLink = ({
  tag: Comp = Tags.a,
  className,
  text = DEFAULT_TEXT,
}: SkipLinkProps) => {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    document.getElementById("app")?.focus();
  };

  return (
    <Tabbable tabIndex={0}>
      {({ className: accessibleClassName, ...tabbableProps }) => (
        <Comp
          className={cn(className, styles.skipLink, accessibleClassName)}
          href=""
          onClick={handleClick}
          {...tabbableProps}
        >
          {text}
        </Comp>
      )}
    </Tabbable>
  );
};
