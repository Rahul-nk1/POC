export enum IconTheme {
  light, //default
  dark,
}

export type IconProps = {
  className?: string;
  smallIcon?: boolean;
  theme?: IconTheme;
};
