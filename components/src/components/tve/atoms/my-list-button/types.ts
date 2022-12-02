import { StateAction, Dispatch } from "@discovery/orchestra/lib/dependencies";
import type { Ref } from "../../../../utils/types";
import { Tags } from "../../../../utils/types";

export type Props = {
  changeStatusOnClick?: boolean;
  className?: string;
  id: string;
  category: string;
  isFavorited?: boolean;
  onAdd?: (id?: string) => void;
  onClick?: (e?: Event, id?: string) => void;
  onLoad?: () => void;
  // TODO: Combine these 9,11 into one: onFavoriteClick
  setFavoriteInDrawer?: Dispatch<StateAction<boolean>>;
  onFavoriteChange?: (id: string, favorited: boolean) => void;
  onRemove?: (id?: string) => void;
  status?: MyListButtonStatus;
  text?: string;
  theme?: MyListButtonTheme;
  variant?: MyListButtonVariant;
  showToast?: boolean;
  setGlobalFavoritedState?: boolean;
  _ref?: Ref<Tags>;
  labelClass?: string;
};

export enum MyListButtonStatus {
  Init,
  Default,
  AddConfirm,
  Added,
  RemoveConfirm,
}

export enum MyListButtonTheme {
  Light = "light",
  Dark = "dark",
}

export enum MyListButtonVariant {
  Default,
  Hero,
}

export type IconClasses = {
  icon: string;
  expand: string;
  theme: string;
};

export type IconProps = {
  className: string;
  classes: IconClasses;
  label?: string;
  theme: MyListButtonTheme;
  variant?: MyListButtonVariant;
  labelClass?: string;
};
