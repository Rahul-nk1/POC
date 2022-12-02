import searchSvg from "~global/icons/search-white.svg"; // TODO: Set icons from CSS, so we can use var(--brand-variables
import userSvg from "~global/icons/user-sm.svg";

export type Props = {
  className: string;
};

export const SearchIcon = ({ className }: Props) => (
  <img src={searchSvg} className={className} />
);

export const UserIcon = ({ className }: Props) => (
  <img src={userSvg} className={className} />
);
