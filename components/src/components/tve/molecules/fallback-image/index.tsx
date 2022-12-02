import { cn } from "@discovery/classnames";
import type { Ref } from "../../../../utils/types";
import { Tags } from "../../../../utils/types";

import * as styles from "./styles.css";

type Props = {
  className?: string;
  _ref?: Ref<Tags>;
};

export const FallbackImage = ({ className, _ref }: Props) => (
  <div className={cn(styles.noImage, className)} ref={_ref} />
);
