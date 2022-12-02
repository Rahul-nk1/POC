import * as M from "@discovery/prelude/lib/data/maybe";
import * as RD from "@discovery/prelude/lib/data/remote-data";
import * as CQ from "@discovery/sonic-api-ng/lib/api/common/query";
import * as Query from "@discovery/sonic-api-ng/lib/api/cms/routes/query";
import { compose } from "@discovery/prelude/lib/data/function";
import { getRoute } from "@discovery/sonic-api-ng/lib/api/cms/routes/endpoints";
import {
  useCallback,
  useSonicHttp,
  useEffect,
  useRef,
} from "@discovery/common-tve/lib/hooks";
import { useLocationChange } from "@discovery/common-tve/lib/hooks/location";
import { triggerSearchEvent } from "@discovery/common-tve/lib/eventing";
import { DEFAULT_DECORATORS } from "@discovery/common-tve/lib/constants";

import { MainContainer } from "../../atoms/main-container";
import { ScrollListener } from "../../atoms/scroll-listener";
import { InlineCollectionRenderer } from "../../../../site-builder/tve/utils/inline-rendering";
import { SearchInput } from "../../molecules/search-input";
import { SearchResults } from "../search-results";
import { countResults } from "./optics";
import { routeRequest, isSearchTextLongEnough } from "./utils";
import Strings from "../../hardcoded.json";

import * as styles from "./styles.css";

export type ClassNames = Partial<Record<"container", string>>;
type SearchOverlayProps = {
  onClose: VoidFunction;
  setIsScrolled: (isScrolled: boolean) => void;
  classNames?: ClassNames;
};

const params = compose(
  Query.lenses.decorators.set(CQ.Decorators.decorators(...DEFAULT_DECORATORS))
)(Query.parameters);

export const SearchOverlay = ({
  onClose,
  setIsScrolled,
  classNames = {},
}: SearchOverlayProps) => {
  useLocationChange(onClose);
  const [warmStart, requestWarmStart] = useSonicHttp(getRoute);
  const [searchResult, requestSearchResult] = useSonicHttp(getRoute);
  // TODO: this is using useRef here as searchtext shouldnt really trigger a rerender.
  // IF for some reason this is needed, please change this to useState and
  // change the `triggerSearchEvent` effect accordingly
  const searchText = useRef("");

  const doWarmStart = useCallback(() => {
    requestWarmStart("search", params);
  }, [requestWarmStart]);

  const doSearch = useCallback(
    (text: string) => {
      searchText.current = text;
      if (isSearchTextLongEnough(text)) {
        requestSearchResult("search/result", routeRequest(text));
      }
    },
    [requestSearchResult]
  );

  // trigger the search event
  useEffect(() => {
    // search event do not allow for empty strings
    if (searchText.current !== "") {
      RD.map(
        (results) =>
          triggerSearchEvent({
            searchTerm: searchText.current,
            // search lib unfortunately coded `responseCode` as required.
            // Going teapot on them :) Please remove when possible
            responseCode: 418,
            // TODO: potential improvements can be done here as countResults and
            // hasLockedResults both by their own run the same optics
            resultsCount: countResults(results),
          }),
        searchResult
      );
    }
  }, [searchResult]);

  useEffect(() => {
    doWarmStart();
  }, [doWarmStart]);

  return (
    <div className={styles.searchOverlay}>
      <ScrollListener setIsScrolled={setIsScrolled} />
      <MainContainer classNameM={M.of(styles.searchInput)}>
        <SearchInput
          onChange={doSearch}
          placeholder={Strings.searchBarPlaceholder}
          onEscape={onClose}
          classNames={{
            container: classNames.container,
          }}
        />
        <SearchResults
          warmStart={warmStart}
          searchResult={
            // Make sure that we reset any results as soon as we start a valid search.
            // Avoids jank in the UI
            isSearchTextLongEnough(searchText.current)
              ? searchResult
              : RD.notAsked
          }
          onClose={onClose}
          searchText={searchText.current}
        />
      </MainContainer>
      <InlineCollectionRenderer collection="web-footer" />
    </div>
  );
};
