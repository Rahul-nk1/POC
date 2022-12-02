import * as O from "fp-ts/Option";
import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";

import {
  DetailShimmer,
  PaginationShimmerButton,
} from "../../../../components/tve/organisms/content-grid-shimmer";

import * as styles from "../../../../components/tve/organisms/content-grid-shimmer/styles.css";

const currentDate = new Date()
  .toISOString()
  .replace(/T.*/, "")
  .split("-")
  .join("-");

export const ScheduleviewShimmer = ({
  selectedDateStringM = M.of(currentDate),
}: {
  selectedDateStringM?: O.Option<string>;
}) => (
  <>
    {O.getOrElse(() => "")(selectedDateStringM) === currentDate && (
      <div className={styles.commonShimmerWrapper}>
        <div className={styles.commonTitleShimmer} />
        <DetailShimmer highlight />
      </div>
    )}
    <div className={styles.commonTitleShimmer} />
    {L.times(
      (i) => (
        <DetailShimmer key={i} miniHighlight />
      ),
      5
    )}
    <PaginationShimmerButton />
  </>
);
