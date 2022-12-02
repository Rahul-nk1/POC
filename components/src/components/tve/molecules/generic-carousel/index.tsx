import type { ComponentType } from "react";
import { cn } from "@discovery/classnames";
import * as NE from "@discovery/prelude/lib/data/nonempty";
import {
  useEventDataContext,
  triggerInteractionEvent,
  InteractionEvent,
} from "@discovery/common-tve/lib/eventing";
import {
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "@discovery/common-tve/lib/hooks";

import { CarouselNavProps } from "../../atoms/carousel-nav";
import { mod } from "../../../../utils/number";
import { ItemProps, safeNthItemRenderer } from "../../../../utils/render";

import { PageIndicator } from "./page-indicator";
import * as styles from "./styles.css";

export type IndexMapper = (index: number) => number;
export type ClassNames = Partial<
  Record<"carousel" | "goToPrev" | "goToNext" | "carouselCurrent", string>
>;

export interface Props {
  itemL: NE.NonEmpty<ComponentType<ItemProps>>;
  indexMapper?: IndexMapper;
  autoAdvanceIntervalSec: number;
  classNames: ClassNames;
  NextButton: ComponentType<CarouselNavProps>;
  PrevButton: ComponentType<CarouselNavProps>;
}

const defaultIndexMapper = (len: number) => (i: number) =>
  len !== 0 ? mod(i, len) : 0;

/**
 * _GENERIC_ carousel component.
 * * * * * * * * * * * * * * * *
 * This component is NOT part of the Hero.
 * It works with any child component.
 */
export const GenericCarousel = ({
  itemL,
  indexMapper = defaultIndexMapper(NE.length(itemL)),
  autoAdvanceIntervalSec,
  classNames,
  NextButton,
  PrevButton,
}: Props) => {
  const { eventData } = useEventDataContext();
  const [idx, setIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const nextIdx = useMemo(() => indexMapper(idx + 1), [indexMapper, idx]);
  const [manuallyAdvanced, setManuallyAdvanced] = useState(false);
  const itemCount = useMemo(() => NE.length(itemL), [itemL]);
  const autoAdvance = useCallback(() => {
    setProgressPercent((progressPercent) => {
      if (!manuallyAdvanced && !hovered) {
        progressPercent = progressPercent + 5;
        if (progressPercent === 100) {
          setIdx((p) => indexMapper(p + 1));
          progressPercent = 0;
        }
      }
      if (manuallyAdvanced) {
        progressPercent = 100;
      }
      return progressPercent;
    });
  }, [indexMapper, manuallyAdvanced, hovered]);
  const currentItem = useMemo(() => safeNthItemRenderer(idx, itemL), [
    itemL,
    idx,
  ]);
  const nextItem = useMemo(() => safeNthItemRenderer(nextIdx, itemL), [
    itemL,
    nextIdx,
  ]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let tid: ReturnType<typeof setInterval>;
    if (isReady) {
      tid = setInterval(autoAdvance, autoAdvanceIntervalSec * 1000 * 0.05);
    }

    return () => clearInterval(tid);
  }, [autoAdvanceIntervalSec, autoAdvance, isReady]);

  const goTo = useCallback(
    (d: number) => () => {
      setIdx((p) => indexMapper(p + d));
      setManuallyAdvanced(true);
      setProgressPercent(0);
      triggerInteractionEvent({
        ...eventData,
        content: {
          ...eventData.content,
          id: "chevron",
        },
        contentIndex: idx,
        componentId: "hero",
        interactionType: InteractionEvent.CLICK,
      });
    },
    [indexMapper, eventData, idx]
  );
  const goToPrev = goTo(-1);
  const goToNext = goTo(+1);

  return (
    <div
      className={cn(styles.container, classNames.carousel)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onLoad={() => {
        setIsReady(true);
      }}
    >
      {/* The nav buttons come first, for accessibility tabIndex order */}
      {itemCount > 1 && (
        <>
          <PageIndicator
            autoAdvanceIntervalSec={autoAdvanceIntervalSec}
            hovered={hovered}
            manuallyAdvanced={manuallyAdvanced}
            progressPercent={progressPercent}
            currentIndex={idx}
            itemCount={itemCount}
          />
          <PrevButton onClick={goToPrev} className={classNames.goToPrev} />
          <NextButton onClick={goToNext} className={classNames.goToNext} />

          <div className={styles.nextItem} key={nextIdx}>
            {nextItem}
          </div>
        </>
      )}
      <div
        className={cn(styles.currentItem, classNames.carouselCurrent)}
        key={idx}
      >
        {currentItem}
      </div>
    </div>
  );
};
