import * as L from "@discovery/prelude/lib/data/list";
import { cn } from "@discovery/classnames";
import { PosterKind } from "../../card";
import { PosterShimmer } from "../../../organisms/content-grid-shimmer";

import * as styles from "./styles.css";
import * as gridStyles from "../../../organisms/grid/styles.css";
import * as networkSelectorStyles from "../styles.css";

const POSTER_SEC_CARD_COUNT = 9;

export const getCount = () => {
  const { clientWidth } = document.body;
  switch (true) {
    case clientWidth < 480:
      return 3;
    case clientWidth < 768:
      return 4;
    case clientWidth < 1024:
      return 5;
    case clientWidth < 1440:
      return 7;
    default:
      return 10;
  }
};

export const SubtabShimmer = () => (
  <div className={networkSelectorStyles.subtabsWrapper}>
    <div className={cn(styles.subtabs, styles.subtabsShimmer)}>
      {L.times(
        (i) => (
          <div key={i} className={cn(styles.subtab, styles.shimmerBackground)}>
            <button
              className={cn(styles.subtabButton, styles.subtabButtonShimmer)}
            />
          </div>
        ),
        getCount()
      )}
    </div>
    <div className={gridStyles.cardsPosterSecondary}>
      {L.times(
        (i) => (
          <PosterShimmer key={i} kind={PosterKind.Secondary} />
        ),
        POSTER_SEC_CARD_COUNT
      )}
    </div>
  </div>
);
