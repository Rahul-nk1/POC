import * as O from "fp-ts/Option";
import * as RD from "@discovery/prelude/lib/data/remote-data";
import { memo } from "react";
import { pipe } from "fp-ts/function";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";

import { countResults } from "../search-overlay/optics";
import { RouteResponse } from "@discovery/sonic-api-ng/lib/api/cms/routes/resource";
import { TemplateEngine } from "../../../../site-builder/tve/utils/inline-rendering";
import { P, Kinds, Sizes } from "../../atoms/text";
import { SearchResultShimmer } from "./SearchResultShimmer";
import { useState, useEffect, useMemo } from "@discovery/common-tve/lib/hooks";

import Strings from "../../hardcoded.json";

import * as styles from "./styles.css";

import Option = O.Option;
import RemoteData = RD.RemoteData;

export type SearchRD = RemoteData<unknown, RouteResponse>;

export type Props = {
  warmStart: SearchRD;
  searchResult: SearchRD;
  onClose?: VoidFunction;
  searchText: string;
};

const Failure = () => <>{Strings.searchFailure}</>;

const Success = memo(
  ({
    data,
    onClick,
  }: {
    data: RouteResponse;
    onClick?: React.MouseEventHandler;
  }) => <TemplateEngine response={data} onClick={onClick} />
);

const DataListRenderer = ({
  content,
  onClick,
}: {
  content: SearchRD;
  onClick?: React.MouseEventHandler;
}) => {
  const [response, setData] = useState<Option<RouteResponse>>(O.none);

  // useEffect is necessary to keep old result in <Success> while searching (loading)
  // new content. It's avoiding a "jumpy" view on each loading state.
  useEffect(() => {
    if (RD.is.Success(content)) {
      setData(O.some(RD.fromSuccess(content)));
    }
  }, [content]);

  if (RD.is.Failure(content)) return <Failure />;
  if (RD.is.NotAsked(content)) return <></>;
  if (RD.is.Loading(content)) return <SearchResultShimmer />;

  return (
    <RenderMaybe>
      {pipe(
        response,
        O.map((data) => <Success data={data} onClick={onClick} />)
      )}
    </RenderMaybe>
  );
};

const NoResultsView = ({
  searchResult,
  searchText,
}: Pick<Props, "searchResult" | "searchText">) =>
  RD.fromRD(
    {
      notAsked: () => <></>,
      loading: () => <></>,
      failure: () => <></>,
      success: (dataL) => {
        const results = countResults(dataL);

        if (results > 0) return null;

        return (
          <div className={styles.noResults}>
            <P kind={Kinds.body} size={Sizes.l}>
              {`${Strings.noResults} "${searchText}"`}
            </P>
          </div>
        );
      },
    },
    searchResult
  );

export const SearchResults = ({
  warmStart,
  searchResult,
  onClose,
  searchText,
}: Props) => {
  const showWarmStartBelow = useMemo(
    () => RD.is.NotAsked(searchResult) || RD.is.Failure(searchResult),
    [searchResult]
  );

  return (
    <div className={styles.searchResults}>
      <NoResultsView searchResult={searchResult} searchText={searchText} />
      <div className={styles.result}>
        <DataListRenderer content={searchResult} onClick={onClose} />
      </div>
      {showWarmStartBelow && (
        <div className={styles.result}>
          <DataListRenderer content={warmStart} onClick={onClose} />
        </div>
      )}
    </div>
  );
};
