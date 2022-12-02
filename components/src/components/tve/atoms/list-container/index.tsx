import { cn } from "@discovery/classnames";

import * as styles from "./styles.css";

export const ListContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn(styles.listContainer, className)}>{children}</div>;
