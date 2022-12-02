import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import {
  _Page2Attributes,
  _Page2Items,
  _PageItem2Collection,
} from "@discovery/sonic-api-ng-optics";
import {
  mkComponentMapItem,
  Child,
} from "@discovery/template-engine/lib/component-map";
import { triggerBrowseEvent } from "@discovery/common-tve/lib/eventing";
import * as L from "@discovery/prelude/lib/data/list";
import { Fold } from "@discovery/prelude/lib/control/lens";
import * as Lens from "@discovery/prelude/lib/control/lens/lens";
import { PageResponseData } from "@discovery/sonic-api-ng/lib/api/cms/pages/resource";
import { useEffect } from "@discovery/common-tve/lib/hooks";

import { triggerSearchEvent } from "@discovery/common-tve/lib/eventing";
import { NoResultsView } from "../../../../components/tve/organisms/no-results-view";
import { searchQueryParam } from "../../../../site-builder/tve/components/menu-bar";
import { _Col2ContentGridCardData } from "../../../../site-builder/tve/components/content-grid/optics";

import * as styles from "./styles.css";

const _FlatResults = Fold.compose(
  _Page2Items,
  _PageItem2Collection,
  _Col2ContentGridCardData
);

const hasNoResults = (data: PageResponseData) => {
  const searchData = L.toArray(Fold.toList(_FlatResults, data));

  const resultsList = searchData.map((data) => ({
    contentId: data.id,
    contentType: data.kind,
  }));

  const searchText =
    new URLSearchParams(window.location.search).get(searchQueryParam) || "";
  const pageAliasM = Fold.preview(
    Fold.compose(_Page2Attributes, Lens.prop("alias"), M._Just()),
    data
  );

  if (searchText !== "") {
    triggerSearchEvent({
      searchTerm: searchText,
      // search lib unfortunately coded `responseCode` as required.
      responseCode: 418,
      resultsList: resultsList,
      resultsCount: searchData.length,
    });
  }

  return (
    M.equals(M.of("search-results-page"), pageAliasM) &&
    L.isEmpty(Fold.toList(_FlatResults, data))
  );
};

const getProps = (data: PageResponseData) => {
  const resultsEmpty = hasNoResults(data);
  return {
    resultsEmpty,
  };
};

export type Props = ReturnType<typeof getProps>;

export const SearchPage = ({ resultsEmpty, children }: Props & Child) => {
  useEffect(() => triggerBrowseEvent(window.location), []);

  return (
    <div className={cn(styles.container, { [styles.noResult]: resultsEmpty })}>
      {resultsEmpty ? <NoResultsView /> : children}
    </div>
  );
};

export const ComponentMapItem = mkComponentMapItem(getProps, () => SearchPage);
