import { cn } from "@discovery/classnames";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as styles from "./styles.css";

export const MainContainer = ({
  children,
  classNameM = M.empty(),
}: {
  children: React.ReactNode;
  classNameM?: M.Maybe<string>;
}) => <div className={cn(styles.mainContainer, classNameM)}>{children}</div>;
