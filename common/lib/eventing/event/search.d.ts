import { SearchEventData } from "@discovery/clients-js-events-lib";
declare type EventSearchInfo = Pick<SearchEventData, "searchTerm" | "resultsCount" | "responseCode" | "resultsList">;
declare const triggerSearchEvent: ({ searchTerm, responseCode, resultsCount, resultsList, }: EventSearchInfo) => void;
declare const triggerSearchAbandonedEvent: ({ searchTerm, resultsCount, }: EventSearchInfo) => void;
export { triggerSearchEvent, triggerSearchAbandonedEvent };
//# sourceMappingURL=search.d.ts.map