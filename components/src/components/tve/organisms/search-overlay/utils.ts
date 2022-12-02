import * as Routes from "@discovery/sonic-api-ng/lib/api/cms/routes";
import * as Query from "@discovery/sonic-api-ng/lib/api/cms/routes/query";
import * as CQ from "@discovery/sonic-api-ng/lib/api/common/query";
import { compose } from "@discovery/prelude/lib/data/function";
import { DEFAULT_DECORATORS } from "@discovery/common-tve/lib/constants";

export const routeRequest = (query: string): Routes.Query.Parameters =>
  compose(
    Query.lenses.decorators.set(
      CQ.Decorators.decorators(...DEFAULT_DECORATORS)
    ),
    Query.lenses.contentFilters.set(
      CQ.ContentFilters.contentFilters(
        CQ.ContentFilter.contentFilter("query", encodeURIComponent(query))
      )
    )
  )(Routes.Query.parameters);

export const isSearchTextLongEnough = (query: string) =>
  query.replace(/\s/g, "").length >= 1;
