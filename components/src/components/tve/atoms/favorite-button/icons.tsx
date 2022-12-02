import { cn } from "@discovery/classnames";

import { IconProps } from "./types";
import { TransparentSVG } from "../transparent-svg";

import * as styles from "./styles.css";

export const Icons = ({ className, currentState, svgClassName }: IconProps) => (
  <div className={className}>
    <span
      className={cn(styles.label, {
        [styles.opaque]: currentState.showText,
      })}
    >
      {currentState.text}
    </span>
    <TransparentSVG
      checkmarkClass={svgClassName.checkMark}
      line1Class={svgClassName.line1}
      line2Class={svgClassName.line2}
    />
  </div>
);
