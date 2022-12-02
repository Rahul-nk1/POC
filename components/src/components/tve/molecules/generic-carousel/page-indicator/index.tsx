import { useMemo } from "@discovery/common-tve/lib/hooks";
import * as L from "@discovery/prelude/lib/data/list";
import { cn } from "@discovery/classnames";

import * as styles from "./styles.css";
import { useHeroContext } from "../../../../../utils/hooks/use-hero-context";

export interface Props {
  hovered: boolean;
  manuallyAdvanced: boolean;
  autoAdvanceIntervalSec: number;
  progressPercent: number;
  itemCount: number;
  currentIndex: number;
}

export const PageIndicator = ({
  hovered,
  manuallyAdvanced,
  autoAdvanceIntervalSec,
  itemCount,
  currentIndex,
}: Props) => {
  const pages = useMemo(() => L.range(0, itemCount), [itemCount]);

  const heroCtx = useHeroContext();
  return (
    <div
      className={cn(styles.container, {
        [styles.show]: heroCtx.metadataAnimationComplete,
      })}
    >
      {/* <Test val="in page indicator" /> */}
      {L.map((i) => {
        const isSelected = i === currentIndex;
        const isPassed = i <= currentIndex;
        return (
          <div key={i} className={styles.indicatorPill}>
            <div
              style={{
                width: `${isPassed ? 100 : 0}%`,
                animationPlayState:
                  hovered || manuallyAdvanced ? "paused" : "running",
                animationDuration: `${autoAdvanceIntervalSec}s`,
              }}
              className={cn({
                [styles.progressIndicator]: isSelected && !manuallyAdvanced,
                [styles.selectedPill]: isSelected || isPassed,
              })}
            />
          </div>
        );
      }, pages)}
    </div>
  );
};
