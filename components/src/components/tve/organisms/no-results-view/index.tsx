import * as M from "@discovery/prelude/lib/data/maybe";
import * as L from "@discovery/prelude/lib/data/list";
import {
  useState,
  useEffect,
  useHistory,
} from "@discovery/common-tve/lib/hooks";
import * as RD from "@discovery/prelude/lib/data/remote-data";
import * as Collections from "@discovery/sonic-api-ng/lib/api/cms/collections";
import * as Query from "@discovery/sonic-api-ng/lib/api/cms/routes/query";
import * as CQ from "@discovery/sonic-api-ng/lib/api/common/query";
import { compose } from "@discovery/prelude/lib/data/function";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import { DEFAULT_DECORATORS } from "@discovery/common-tve/lib/constants";

import { searchQueryParam } from "../../../../site-builder/tve/components/menu-bar";
import { InlineRouteRenderer } from "../../../../site-builder/tve/utils/inline-rendering";
import { P, Kinds, Sizes } from "../../atoms/text";
import Strings from "../../hardcoded.json";

import * as styles from "./styles.css";

export type SearchRD = RD.RemoteData<unknown, L.List<CollectionResponseData>>;

export type Props = {
  warmStart: SearchRD;
  searchResult: SearchRD;
  searchText: string;
  collectionRequest?: (
    page: Collections.Query.One.Page
  ) => Collections.Query.One.Parameters;
};

export const routeRequestWarmStart = compose(
  Query.lenses.decorators.set(CQ.Decorators.decorators(...DEFAULT_DECORATORS))
)(Query.parameters);

export const NoResultsView = () => {
  const [changes] = useHistory();

  const [searchText, setSearchText] = useState<string>(
    M.fromMaybe(changes.searchParams.get(searchQueryParam), "")
  );

  useEffect(() => {
    // If the user changes the search query with navigation, for example by using the back
    // button then we need to update input state to reflect the new query.

    // There appears to be a bug in changes.searchParams.get that causes it to fire in the wrong order
    // and send us None when it shouldn't. To solve this we only update SearchTextM when it is Just.
    const query =
      new URLSearchParams(window.location.search).get(searchQueryParam) || "";

    setSearchText(query);
  }, [changes]);

  return (
    <>
      <div className={styles.noResults}>
        <P kind={Kinds.body} size={Sizes.l}>
          {`${Strings.noResults} "${searchText}"`}
        </P>
      </div>
      <div className={styles.result}>
        <InlineRouteRenderer route="search" />
      </div>
    </>
  );
};
