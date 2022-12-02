import { cn } from "@discovery/classnames";
import type { Ref } from "../../../../utils/types";
import { Tags } from "../../../../utils/types";

import styles from "./styles.css";

/**
 * this logic allows us to dynamically infer classNames
 * rather than having to make a complete map of all the different
 * permutations of conditions that would result in speciifc class names
 * whilst limiting the additional code needed to add styles to this component
 */
const localStyles: Map<string, string> = new Map(Object.entries(styles));

export type TextProps = {
  className?: string;
  children: React.ReactNode;
  kind?: Kinds;
  size?: Sizes;
  tag?: Tags;
  weight?: Weights;
  decoration?: Decorations;
  style?: Styles;
  _ref?: Ref<Tags>;
};

export enum Kinds {
  none = "",
  body = "body",
  button = "button",
  card = "card",
  label = "label",
  marketing = "marketing",
  menubar = "menubar",
  microcopy = "microcopy",
  section = "section",
  small = "small",
  subtitle = "subtitle",
  title = "title",
}

export enum Sizes {
  none = "",
  xxs = "xxs",
  xs = "xs",
  s = "s",
  m = "m",
  l = "l",
  xl = "xl",
  subtitle = "subtitle",
  title = "title",
  helper = "helper",
}

// The Weights enum is following Mozilla standard:
// https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#Common_weight_name_mapping
export enum Weights {
  hairline = "hairline",
  thin = "thin", // same as hairline
  extraLight = "extraLight",
  ultraLight = "ultraLight", // same as extraLight
  light = "light",
  regular = "regular",
  normal = "normal", // same as regular
  medium = "medium",
  semiBold = "semiBold",
  demiBold = "demiBold", // same as semiBold
  bold = "bold",
  extraBold = "extraBold",
  ultraBold = "ultraBold", // same as extraBold
  heavy = "heavy",
  black = "black", // same as heavy
  extraBlack = "extraBlack",
  ultraBlack = "ultraBlack", // same as extraBlack
}

export enum Decorations {
  none = "none",
  underline = "underline",
}

export enum Styles {
  normal = "normal",
  italic = "italic",
}

const getTag = ({
  kind = Kinds.none,
  size = Sizes.none,
}: {
  kind?: Kinds;
  size?: Sizes;
}): Tags => {
  const tags = {
    [Tags.h1]: [Kinds.title, Sizes.m],
    [Tags.h2]: [Kinds.title, Sizes.s],
    [Tags.h3]: [Kinds.section, Sizes.l],
    [Tags.h4]: [Kinds.subtitle, Sizes.l],
    [Tags.h5]: [Kinds.subtitle, Sizes.s],
    [Tags.h6]: [Kinds.body, Sizes.l],
    [Tags.label]: [Kinds.label, null],
    [Tags.p]: [Kinds.body, null],
    [Tags.small]: [Kinds.microcopy, null],
  };

  return Object.entries(tags).reduce(
    (currentTag: Tags, [tag, [k, s]]) => {
      const t = tag as Tags;
      if (currentTag !== Tags.div) return currentTag;
      return k === kind && (s === null || s === size) ? t : currentTag;
    },
    Tags.div // default div tag
  );
};

const getClass = ({
  kind = Kinds.none,
  size = Sizes.none,
  cssMap,
}: {
  kind?: Kinds;
  size?: Sizes;
  weight?: Weights;
  decoration?: Decorations;
  style?: Styles;
  cssMap: typeof localStyles;
}) => {
  const separator = "____";

  const className = Object.entries({ kind: kind, size }).reduce(
    (pieces: string[], [name, value]) =>
      value ? [...pieces, `${name}__${value}`] : pieces,
    []
  );

  const localClass = cssMap.get(className.join(separator));

  return localClass ? localClass : className;
};

export const Text = ({
  className = "",
  children,
  kind,
  size = Sizes.m,
  tag,
  weight,
  style,
  decoration,
  _ref,
}: TextProps) => {
  const classes = [
    getClass({
      kind,
      size,
      cssMap: localStyles,
    }),
    style && localStyles.get(`style__${style}`),
    decoration && localStyles.get(`decoration__${decoration}`),
    weight && localStyles.get(`weight__${weight}`),
    ...(className ? [className] : []),
  ];

  const TAG =
    tag ??
    getTag({
      kind,
      size,
    });

  return (
    <TAG className={cn(classes)} ref={_ref}>
      {children}
    </TAG>
  );
};

export type TextView = (props: TextProps) => JSX.Element;

export const H1: TextView = ({
  className = "",
  children,
  kind = Kinds.title,
  size = Sizes.m,
  weight,
  _ref,
}) => (
  <Text
    className={className}
    tag={Tags.h1}
    kind={kind}
    size={size}
    weight={weight}
    _ref={_ref}
  >
    {children}
  </Text>
);

export const H2: TextView = ({
  className = "",
  children,
  kind = Kinds.title,
  size = Sizes.m,
  weight,
}) => (
  <Text
    className={className}
    tag={Tags.h2}
    kind={kind}
    size={size}
    weight={weight}
  >
    {children}
  </Text>
);

export const H3: TextView = ({
  className = "",
  children,
  kind = Kinds.section,
  size = Sizes.l,
  weight,
}) => (
  <Text
    className={className}
    tag={Tags.h3}
    kind={kind}
    size={size}
    weight={weight}
  >
    {children}
  </Text>
);

export const H4: TextView = ({
  className = "",
  children,
  kind = Kinds.subtitle,
  size = Sizes.l,
  weight,
  _ref,
}) => (
  <Text
    className={className}
    tag={Tags.h4}
    kind={kind}
    size={size}
    weight={weight}
    _ref={_ref}
  >
    {children}
  </Text>
);

export const H5: TextView = ({
  className = "",
  children,
  kind = Kinds.subtitle,
  size = Sizes.s,
  weight,
}) => (
  <Text
    className={className}
    tag={Tags.h5}
    kind={kind}
    size={size}
    weight={weight}
  >
    {children}
  </Text>
);

export const H6: TextView = ({
  className = "",
  children,
  kind = Kinds.body,
  size = Sizes.l,
  weight,
}) => (
  <Text
    className={className}
    tag={Tags.h6}
    kind={kind}
    size={size}
    weight={weight}
  >
    {children}
  </Text>
);

export const P: TextView = ({
  className = "",
  children,
  decoration = Decorations.none,
  kind = Kinds.body,
  size = Sizes.m,
  style = Styles.normal,
  weight = Weights.regular,
  _ref,
}) => (
  <Text
    className={className}
    kind={kind}
    size={size}
    weight={weight}
    style={style}
    decoration={decoration}
    _ref={_ref}
  >
    {children}
  </Text>
);

export const Span: TextView = ({
  className = "",
  children,
  decoration = Decorations.none,
  kind = Kinds.body,
  size = Sizes.none,
  style = Styles.normal,
  weight,
}) => (
  <Text
    className={className}
    decoration={decoration}
    kind={kind}
    size={size}
    style={style}
    tag={Tags.span}
    weight={weight}
  >
    {children}
  </Text>
);

export const Bold: TextView = ({ className = "", children }) => (
  <Text
    className={className}
    kind={Kinds.body}
    size={Sizes.m}
    weight={Weights.heavy}
  >
    {children}
  </Text>
);

export const Label: TextView = ({
  className = "",
  children,
  size = Sizes.title,
  weight = Weights.regular,
  _ref,
}) => (
  <Text
    className={className}
    kind={Kinds.label}
    size={size}
    weight={weight}
    _ref={_ref}
  >
    {children}
  </Text>
);

export const ButtonText: TextView = ({
  className = "",
  children,
  size = Sizes.m,
  weight = Weights.regular,
}) => (
  <Text className={className} kind={Kinds.button} size={size} weight={weight}>
    {children}
  </Text>
);

export const Small: TextView = ({
  className = "",
  children,
  weight = Weights.regular,
}) => (
  <Text className={className} kind={Kinds.microcopy} weight={weight}>
    {children}
  </Text>
);

export default Text;
