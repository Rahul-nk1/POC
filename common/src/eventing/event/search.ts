import { log } from "../setup";
import { EventTypes, SearchEventData } from "@discovery/clients-js-events-lib";
import {
  ActionTypes,
  SearchMethodTypes,
} from "@discovery/clients-js-events-lib/lib/Search";
import { getScreenName } from "./utils";

type EventSearchInfo = Pick<
  SearchEventData,
  "searchTerm" | "resultsCount" | "responseCode" | "resultsList"
>;

const triggerSearchEvent = ({
  searchTerm,
  responseCode,
  resultsCount,
  resultsList,
}: EventSearchInfo) => {
  const data: SearchEventData = {
    // There is no filterUpdate functionality. update this accordingly when
    // needed
    action: ActionTypes.SEARCH,
    // Search method is always manual on web
    searchMethod: SearchMethodTypes.MANUAL,
    searchTerm: searchTerm,
    resultsCount: resultsCount,
    resultsList: resultsList,
    // There are not results pages for us
    resultsPageNum: 0, // first page
    // No way of sorting currently
    sortOrder: "default",
    // Responsecode should be optional. it apparently is not
    responseCode: responseCode,
    // Both screenURI and screenName is only used correctly if we had a /search
    // page. We currently dont have that
    screenName: getScreenName(location.pathname),
    screenURI: location.href,
  };

  return log({
    type: EventTypes.SEARCH,
    data,
  });
};

const triggerSearchAbandonedEvent = ({
  searchTerm,
  resultsCount,
}: EventSearchInfo) => {
  const data: SearchEventData = {
    action: ActionTypes.SEARCH_ABANDONED,
    // Search method is always manual on web
    searchMethod: SearchMethodTypes.MANUAL,
    searchTerm: searchTerm,
    resultsPageNum: 0,
    resultsCount: resultsCount,
    sortOrder: "default",
    // Both screenURI and screenName is only used correctly if we had a /search
    // page. We currently dont have that
    screenName: getScreenName(location.pathname),
    screenURI: location.href,
  };

  return log({
    type: EventTypes.SEARCH,
    data,
  });
};

export { triggerSearchEvent, triggerSearchAbandonedEvent };
