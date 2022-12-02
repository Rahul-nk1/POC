import { cn } from "@discovery/classnames";

import { VideoProgress } from "../../../../molecules/card/types";
import * as styles from "./styles.css";

type ProgressBarProps = {
  className?: string;
  containerClassName?: string;
  progress: VideoProgress;
};

export const ProgressBar = ({
  progress: { completed, percent },
  className,
  containerClassName,
}: ProgressBarProps) => (
  <div className={cn(styles.progressBarContainer, containerClassName)}>
    <div
      className={cn(styles.progressBar, className, {
        [styles.completed]: completed,
      })}
      style={{ width: `${percent}%` }}
    />
  </div>
);
