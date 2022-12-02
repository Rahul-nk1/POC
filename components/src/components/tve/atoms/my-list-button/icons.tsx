import { cn } from "@discovery/classnames";

import { TransparentSVG } from "../transparent-svg";
import { MyListButtonTheme, MyListButtonVariant, IconProps } from "./types";

import * as styles from "./styles.css";

export const Icons = ({
  className,
  label,
  theme,
  variant = MyListButtonVariant.Default,
  labelClass,
}: IconProps) => {
  const themeClass =
    theme === MyListButtonTheme.Light ? styles.light : styles.dark;

  const variantClass =
    variant === MyListButtonVariant.Hero ? styles.hero : null;
  return (
    <div className={className}>
      <span className={cn(styles.iconWrapper, themeClass)}>
        <TransparentSVG
          checkmarkClass={styles.checkmark}
          line1Class={styles.line1}
          line2Class={styles.line2}
        />
      </span>
      <span className={cn(labelClass, styles.label, variantClass, themeClass)}>
        {label}
      </span>
    </div>
  );
};
