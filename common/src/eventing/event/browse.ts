import * as Option from "fp-ts/Option";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as S from "@discovery/prelude/lib/data/stream";
import * as EventsLib from "@discovery/clients-js-events-lib";
import { EventTypes, BrowseEventData } from "@discovery/clients-js-events-lib";
import { head } from "@discovery/prelude/lib/data/iterable";
import { fromMaybe } from "@discovery/prelude/lib/data/maybe";
import { getScreenName } from "./utils";
import { log } from "../setup";
import { performance, PerformanceMarkers } from "../../performance";
import { interactionEvent$ } from "./interaction";
import { maestroHistory } from "../../hooks";
import { InteractionEventObject } from "../types";
import { pipe } from "fp-ts/function";

const CONTENT_LOAD_TIME = "CONTENT_LOAD_TIME";
const SCREEN_PAINT_TIME = "SCREEN_PAINT_TIME";

// The triggering of the event needs to be in a stream as we need the
// `InteractionEvent` that triggered the navigation to grab `referring*` information
const [triggerBrowseEvent, _browseEvent$] = S.createAdapter<{
  href: Location["href"];
  pathname: Location["pathname"];
  primaryContentIdM?: M.Maybe<string>;
  contentTypeM?: Option.Option<string>;
}>();

// Here we make sure that the browse event packages the interaction events information
const browseEvent$ = S.snapshot(
  (
    interaction: InteractionEventObject | null,
    {
      primaryContentIdM = M.empty(),
      contentTypeM = Option.none,
      pathname,
      href,
    }
  ) => {
    performance.measure?.(
      CONTENT_LOAD_TIME,
      PerformanceMarkers.request_start,
      PerformanceMarkers.request_done
    );
    // TODO: this screen paint time needs to be revisited. Problem here is that we
    // do not know when any meaningful content has been rendered. This picks up as
    // soon as our `Page` component renders. This should probably be based on a
    // heuristic that checks if a child also has been rendered.
    performance.measure?.(SCREEN_PAINT_TIME, PerformanceMarkers.request_done);
    const contentLoadTime = fromMaybe(
      head(
        performance
          .getEntriesByName(CONTENT_LOAD_TIME)
          .map((x) => Math.round(x.duration))
      ),
      0
    );
    const screenPaintTime = fromMaybe(
      head(
        performance
          .getEntriesByName(SCREEN_PAINT_TIME)
          .map((x) => Math.round(x.duration))
      ),
      0
    );

    const data: BrowseEventData = {
      action: EventsLib.Browse.ActionTypes.VIEW,
      // TODO: we are allowed to ignore screentype for now. this is something we need to loop back to
      // For screentype we need to get help from sonic or do it in components
      // screenType: "video" as BrowseEventData["screenType"],
      screenName: getScreenName(pathname),
      screenURI: href,
      contentLoadTime,
      screenPaintTime,
      ...M.fromMaybe(
        M.map((contentId) => ({ contentId }), primaryContentIdM),
        undefined
      ),
      ...pipe(
        contentTypeM,
        Option.map((contentType) => ({ contentType })),
        Option.getOrElse(() => ({}))
      ),
    };

    if (interaction !== null) {
      data.referringScreenURI = interaction.data.screenURI;
      data.referringScreenLocation = interaction.data.location;
      data.referringScreenName = interaction.data.screenName;
      data.referringLinkText = interaction.data.targetText;
      data.referringLocationPosition = interaction.data.locationPosition;
      data.referringElement = (interaction.data as EventsLib.InteractionClickEventData).element;
      data.referringSearchTerm = (interaction.data as EventsLib.InteractionClickEventData).searchTerm;
    } else {
      data.referringScreenURI = document.referrer;
    }

    log({
      type: EventTypes.BROWSE,
      data,
    });

    performance.clearMarks?.();
    performance.clearMeasures?.();
  },

  // Only sample the interactionEvents that triggered a history change. This
  // lessens the risk of incorrect interaction event getting added to the browse
  // event - except in the case of page
  S.startWith(
    null,
    S.sample(interactionEvent$, maestroHistory.history.changes())
  ),
  _browseEvent$
);

S;

// This runs the stream. There should be a better to actually do this but this
// makes sure that the stream gets consumed TODO: We'll need to redesign how all
// the events get run
S.runEffects(browseEvent$, S.newDefaultScheduler());

export { triggerBrowseEvent };
