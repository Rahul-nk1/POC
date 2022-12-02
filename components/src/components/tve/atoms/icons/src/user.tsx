import userSvg from "~global/icons/user-sm.svg";
import userSvgBlack from "~global/icons/user-black.svg";
import { IconProps } from "..";

export type Props = IconProps & {
  black?: boolean;
};

/**
 * TODO -- refactor to use IconTheme
 */
export const User = ({ className, black = false }: Props) =>
  black ? (
    <img src={userSvgBlack} className={className} alt="user icon black" />
  ) : (
    <img src={userSvg} className={className} alt="user icon" />
  );
