import { cn } from "@discovery/classnames";
import * as M from "@discovery/prelude/lib/data/maybe";
import { useEffect } from "@discovery/common-tve/lib/hooks";

import { IconTheme, LockIcon, PlayIcon } from "../../../tve/atoms/icons";
import type { Ref } from "../../../../utils/types";
import { Tags } from "../../../../utils/types";

import { Kinds, Sizes, Text } from "../text";
import { Link, LinkKind } from "../link";

import * as styles from "./styles.css";

export enum ButtonType {
  contained, // default
  outlined,
  text,
}

export interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  innerClassName?: string;
  kind?: LinkKind;
  linkM?: M.Maybe<string>;
  locked?: boolean;
  onClick?: React.MouseEventHandler;
  onLoad?: () => void;
  openInNewWindow?: boolean;
  textClassName?: string;
  smallIcon?: boolean;
  theme?: IconTheme;
  type?: ButtonType;
  label: string;
  _ref?: Ref<Tags>;
}

const renderIcon = (icon: React.ReactNode, className?: string) => (
  <div className={cn(styles.icon, className)}>{icon}</div>
);

export const Button = ({
  children,
  className,
  iconClassName,
  innerClassName,
  textClassName,
  icon,
  onClick,
  openInNewWindow,
  linkM = M.empty(),
  type = ButtonType.contained,
  theme = IconTheme.light,
  kind = LinkKind.internal,
  label,
  _ref,
}: ButtonProps) => (
  <Link
    kind={kind}
    href={M.fromMaybe(linkM, "")}
    openInNewWindow={openInNewWindow}
    onClick={onClick}
    className={cn(className, styles.button, {
      [styles.contained]: type === ButtonType.contained,
      [styles.outlined]: type === ButtonType.outlined,
      [styles.text]: type === ButtonType.text,
      [styles.dark]: theme === IconTheme.dark,
    })}
    label={label}
    _ref={_ref}
  >
    <div className={cn(styles.inner, innerClassName)}>
      {icon && renderIcon(icon, iconClassName)}
      <Text className={textClassName} kind={Kinds.button} size={Sizes.m}>
        {children ?? label}
      </Text>
    </div>
  </Link>
);

export const PlayNowButton = (props: ButtonProps) => {
  const {
    locked = false,
    theme = IconTheme.light,
    smallIcon,
    className,
  } = props;

  useEffect(() => {
    props.onLoad && props.onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const icon = locked ? (
    <LockIcon theme={theme} />
  ) : (
    <PlayIcon smallIcon={smallIcon} theme={theme} />
  );

  return <Button {...props} icon={icon} className={className} />;
};
