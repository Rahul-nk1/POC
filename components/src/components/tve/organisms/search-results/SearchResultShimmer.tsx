import * as L from "@discovery/prelude/lib/data/list";
import { getCount } from "../../molecules/network-selector/subtabs/SubtabShimmer";
import { PosterKind } from "../../molecules/card";
import { PosterShimmer } from "../content-grid-shimmer";

import * as styles from "../content-grid-shimmer/styles.css";

export const SearchResultShimmer = () => (
  <div className={styles.commonShimmerWrapper}>
    <div className={styles.commonTitleShimmer} />
    <div style={{ display: "flex" }}>
      {L.times(
        () => (
          <div className={styles.gridMargin}>
            <PosterShimmer kind={PosterKind.Primary} />
          </div>
        ),
        getCount()
      )}
    </div>
  </div>
);
