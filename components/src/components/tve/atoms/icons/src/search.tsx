import searchSvg from "~global/icons/search-white.svg";
import { IconProps } from "..";

export const Search = ({ className }: IconProps) => (
  <img src={searchSvg} className={className} alt="search icon" />
);
