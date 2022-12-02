import { cn } from "@discovery/classnames";
import * as M from "@discovery/prelude/lib/data/maybe";

import { Tags } from "../../../../utils/types";

import * as styles from "./styles.css";

export enum HeaderVariants {
  headingOne = "headingOne",
  headingTwo = "headingTwo",
  headingThree = "headingThree",
  headingFour = "headingFour",
  headingFive = "headingFive",
  headingSix = "headingSix",
  normal = "normal",
  largeTag = "largeTag",
  smallTag = "smallTag",
}

export type Props = {
  children: React.ReactNode;
  classNameM?: M.Maybe<string>;
  dataSonicAttrM?: M.Maybe<string>;
  tag: Tags;
  variant: HeaderVariants;
};

export const Typography = ({
  classNameM = M.empty(),
  dataSonicAttrM = M.empty(),
  variant,
  children,
  tag,
}: Props) => {
  const Component = tag;

  return (
    <Component
      className={cn(
        styles.heading,
        {
          [styles.headingOne]: variant === HeaderVariants.headingOne,
          [styles.headingTwo]: variant === HeaderVariants.headingTwo,
          [styles.headingThree]: variant === HeaderVariants.headingThree,
          [styles.headingFour]: variant === HeaderVariants.headingFour,
          [styles.headingFive]: variant === HeaderVariants.headingFive,
          [styles.headingSix]: variant === HeaderVariants.headingSix,
          [styles.largeTag]: variant === HeaderVariants.largeTag,
          [styles.normal]: variant === HeaderVariants.normal,
          [styles.smallTag]: variant === HeaderVariants.smallTag,
        },
        classNameM
      )}
      {...M.foldMapConst(
        (x: string): Record<string, string> => ({ "data-sonic-attribute": x }),
        {},
        dataSonicAttrM
      )}
    >
      {children}
    </Component>
  );
};
