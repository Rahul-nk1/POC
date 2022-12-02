import * as M from "@discovery/prelude/lib/data/maybe";
import { EventTypes } from "@discovery/clients-js-events-lib";
import {
  CategoryTypes,
  ActionTypes,
} from "@discovery/clients-js-events-lib/lib/UserProfile";

import { log } from "../setup";
import { getScreenName } from "./utils";

type Data = {
  action: ActionTypes;
  category: CategoryTypes;
  contentId: string;
};
type DataO = M.Maybe<Data>;

const getData = (
  id: string,
  wasFavorited: boolean,
  feature: CategoryTypes
): DataO => {
  const { pathname, href } = window.location;
  switch (feature) {
    case CategoryTypes.MYLIST:
      return M.of({
        action: wasFavorited ? ActionTypes.ON : ActionTypes.OFF,
        category: CategoryTypes.MYLIST,
        contentId: id,
        screenName: getScreenName(pathname),
        screenURI: href,
        assetLevel: "show",
        contentType: "show",
      });
    case CategoryTypes.INTERESTS:
    case CategoryTypes.PROFILE:
      return M.empty();
  }
};

const triggerUserProfileEvent = (
  id: string,
  wasFavorited: boolean,
  feature: CategoryTypes
) => {
  const _data = getData(id, wasFavorited, feature);

  M.map(
    (data) =>
      log({
        type: EventTypes.USER_PROFILE,
        data,
      }),
    _data
  );
};

export { CategoryTypes, triggerUserProfileEvent };
