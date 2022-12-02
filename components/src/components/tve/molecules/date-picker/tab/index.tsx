import * as R from "@discovery/roadie";
import { cn } from "@discovery/classnames";
import { useMemo } from "@discovery/common-tve/lib/hooks";

import { Tabbable } from "@discovery/components-tve/src/utils/hooks/use-tabbable";
import { AriaRoles } from "../../../../../utils/types";

import { H5, P, Sizes, Weights } from "../../../atoms/text";
import * as styles from "./styles.css";

export type Tab = {
  id: string;
  value: Date;
};

type Props = {
  tab: Tab;
  selected: boolean;
  onClick: () => void;
};

const DEFAULT_TODAY_STR = "Today";

//TODO: Use proper functions from @discovery for date related functions below
const now = new Date();

const getDateMeta = (date: Date) => ({
  isToday: R.isToday(now)(date),
  date: date.getDate(),
  dayOfWeek: date.toLocaleDateString("en-us", { weekday: "short" }),
  month: date.toLocaleString("default", { month: "short" }),
});

export const Tab = ({ tab, selected, onClick }: Props) => {
  const { value } = tab;

  const bottomBarStyles = useMemo(
    () => cn(styles.bottomBar, { [styles.selected]: selected }),
    [selected]
  );

  const dateMeta = useMemo(() => getDateMeta(value), [value]);

  const dateStyles = useMemo(
    () => cn(styles.monthDateText, { [styles.selected]: selected }),
    [selected]
  );

  const dayOfWeekStr = useMemo(
    () => (dateMeta.isToday ? DEFAULT_TODAY_STR : dateMeta.dayOfWeek),
    [dateMeta]
  );

  const dateStr = `${dateMeta.month} ${dateMeta.date}`;

  /**
   * TODO -- 'xxs' size variant used here and in comps,
   * but not in official web type ramp (please rectify with design)
   */

  return (
    <Tabbable onSelectAction={onClick} role={AriaRoles.button}>
      {({ className: accessibleClassName, ...tabbableProps }) => (
        <div
          className={cn(styles.dateBox, accessibleClassName, {
            [styles.selected]: selected,
          })}
          onClick={onClick}
          {...tabbableProps}
        >
          <div className={styles.dayOfWeek}>
            <H5>{dayOfWeekStr}</H5>
          </div>
          <div className={styles.date}>
            <P size={Sizes.xxs} weight={Weights.bold} className={dateStyles}>
              {dateStr}
            </P>
          </div>
          <div className={bottomBarStyles}></div>
        </div>
      )}
    </Tabbable>
  );
};
