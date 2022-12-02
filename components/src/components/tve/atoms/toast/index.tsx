import { cn } from "@discovery/classnames";
import { H6 } from "../text";
import { ToastProps } from "../toaster";
import * as styles from "./styles.css";

export const Toast = ({ msg, className }: ToastProps) => (
  <div className={styles.toastContainer}>
    <H6 className={cn(styles.toast, className)}>{msg}</H6>
  </div>
);
