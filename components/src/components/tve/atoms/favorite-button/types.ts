export type TweenProps = {
  animationDuration?: number;
  direction?: FavoriteButtonDirection;
};

export type Props = TweenProps & {
  changeStatusOnClick?: boolean;
  className?: string;
  id: string;
  category: string;
  isFavorited?: boolean;
  onAdd?: (id?: string) => void;
  onClick?: (e?: Event, id?: string) => void;
  onFavoriteChange?: (id: string, favorited: boolean) => void;
  status?: FavoriteButtonStatus;
  text?: FavoriteButtonText;
};

export enum FavoriteButtonDirection {
  Left = "left",
  Right = "right",
}

export enum FavoriteButtonStatus {
  Init,
  Default,
  AddConfirm,
  Added,
  RemoveConfirm,
}

export type FavoriteButtonState = {
  showText: boolean;
  text: string;
};

export type FavoriteButtonText = {
  checkExpand: string;
  plusExpand: string;
};

export type IconClasses = {
  icon: string;
  expand: string;
};

export type svgClassName = {
  checkMark: string;
  line1: string;
  line2: string;
};

export type IconProps = {
  className: string;
  svgClassName: Record<keyof svgClassName, string>;
  currentState: FavoriteButtonState;
};
