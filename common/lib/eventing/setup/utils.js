import * as EventsLib from "@discovery/clients-js-events-lib";
import * as M from "@discovery/prelude/lib/data/maybe";
const getOrientation = (orientation) => {
    switch (orientation) {
        case "portrait-primary":
        case "portrait-secondary":
            return M.of(EventsLib.OrientationTypes.PORTRAIT);
        case "landscape-primary":
        case "landscape-secondary":
            return M.of(EventsLib.OrientationTypes.LANDSCAPE);
        default:
            return M.empty();
    }
};
export { getOrientation };
//# sourceMappingURL=utils.js.map