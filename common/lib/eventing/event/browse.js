import * as Option from "fp-ts/Option";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as S from "@discovery/prelude/lib/data/stream";
import * as EventsLib from "@discovery/clients-js-events-lib";
import { EventTypes } from "@discovery/clients-js-events-lib";
import { head } from "@discovery/prelude/lib/data/iterable";
import { fromMaybe } from "@discovery/prelude/lib/data/maybe";
import { getScreenName } from "./utils";
import { log } from "../setup";
import { performance, PerformanceMarkers } from "../../performance";
import { interactionEvent$ } from "./interaction";
import { maestroHistory } from "../../hooks";
import { pipe } from "fp-ts/function";
const CONTENT_LOAD_TIME = "CONTENT_LOAD_TIME";
const SCREEN_PAINT_TIME = "SCREEN_PAINT_TIME";
// The triggering of the event needs to be in a stream as we need the
// `InteractionEvent` that triggered the navigation to grab `referring*` information
const [triggerBrowseEvent, _browseEvent$] = S.createAdapter();
// Here we make sure that the browse event packages the interaction events information
const browseEvent$ = S.snapshot((interaction, { primaryContentIdM = M.empty(), contentTypeM = Option.none, pathname, href, }) => {
    var _a, _b, _c, _d;
    (_a = performance.measure) === null || _a === void 0 ? void 0 : _a.call(performance, CONTENT_LOAD_TIME, PerformanceMarkers.request_start, PerformanceMarkers.request_done);
    // TODO: this screen paint time needs to be revisited. Problem here is that we
    // do not know when any meaningful content has been rendered. This picks up as
    // soon as our `Page` component renders. This should probably be based on a
    // heuristic that checks if a child also has been rendered.
    (_b = performance.measure) === null || _b === void 0 ? void 0 : _b.call(performance, SCREEN_PAINT_TIME, PerformanceMarkers.request_done);
    const contentLoadTime = fromMaybe(head(performance
        .getEntriesByName(CONTENT_LOAD_TIME)
        .map((x) => Math.round(x.duration))), 0);
    const screenPaintTime = fromMaybe(head(performance
        .getEntriesByName(SCREEN_PAINT_TIME)
        .map((x) => Math.round(x.duration))), 0);
    const data = Object.assign(Object.assign({ action: EventsLib.Browse.ActionTypes.VIEW, 
        // TODO: we are allowed to ignore screentype for now. this is something we need to loop back to
        // For screentype we need to get help from sonic or do it in components
        // screenType: "video" as BrowseEventData["screenType"],
        screenName: getScreenName(pathname), screenURI: href, contentLoadTime,
        screenPaintTime }, M.fromMaybe(M.map((contentId) => ({ contentId }), primaryContentIdM), undefined)), pipe(contentTypeM, Option.map((contentType) => ({ contentType })), Option.getOrElse(() => ({}))));
    if (interaction !== null) {
        data.referringScreenURI = interaction.data.screenURI;
        data.referringScreenLocation = interaction.data.location;
        data.referringScreenName = interaction.data.screenName;
        data.referringLinkText = interaction.data.targetText;
        data.referringLocationPosition = interaction.data.locationPosition;
        data.referringElement = interaction.data.element;
        data.referringSearchTerm = interaction.data.searchTerm;
    }
    else {
        data.referringScreenURI = document.referrer;
    }
    log({
        type: EventTypes.BROWSE,
        data,
    });
    (_c = performance.clearMarks) === null || _c === void 0 ? void 0 : _c.call(performance);
    (_d = performance.clearMeasures) === null || _d === void 0 ? void 0 : _d.call(performance);
}, 
// Only sample the interactionEvents that triggered a history change. This
// lessens the risk of incorrect interaction event getting added to the browse
// event - except in the case of page
S.startWith(null, S.sample(interactionEvent$, maestroHistory.history.changes())), _browseEvent$);
S;
// This runs the stream. There should be a better to actually do this but this
// makes sure that the stream gets consumed TODO: We'll need to redesign how all
// the events get run
S.runEffects(browseEvent$, S.newDefaultScheduler());
export { triggerBrowseEvent };
//# sourceMappingURL=browse.js.map