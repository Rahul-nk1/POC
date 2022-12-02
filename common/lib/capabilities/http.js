import * as F from "@discovery/prelude/lib/data/future";
import { performance, PerformanceMarkers } from "../performance";
import { http as fetchHttp } from "@discovery/maestro-http/lib/impl/fetch";
import { triggerErrorEvent } from "../eventing";
import { ActionTypes } from "@discovery/clients-js-events-lib/lib/Error";
const http = {
    http: (x) => {
        var _a;
        (_a = performance.mark) === null || _a === void 0 ? void 0 : _a.call(performance, PerformanceMarkers.request_start);
        const errorCase = (e) => {
            var _a;
            triggerErrorEvent(ActionTypes.INTERNAL, {
                code: "unknown",
                name: e.kind,
                message: e.message,
                type: e.type,
            });
            (_a = performance.mark) === null || _a === void 0 ? void 0 : _a.call(performance, PerformanceMarkers.request_done);
            return e;
        };
        const successCase = (v) => {
            var _a;
            const statusCode = v.status;
            if (400 <= statusCode && statusCode < 600) {
                triggerErrorEvent(ActionTypes.INTERNAL, {
                    code: `${statusCode}`,
                    // TODO: Name could perhaps be extracted from the v.body and grab the
                    // error that sonic gives us. Loop back if needed
                    // https://discoveryinc.atlassian.net/wiki/spaces/DATA/pages/1247445209/Events+v2+Luna+Clients+-+2.2.0+Thunder
                    name: "unknown http error",
                    message: v.statusText,
                    type: "apiError",
                });
            }
            (_a = performance.mark) === null || _a === void 0 ? void 0 : _a.call(performance, PerformanceMarkers.request_done);
            return v;
        };
        return F.bimap(errorCase)(successCase)(fetchHttp.http(x));
    },
};
export { http };
//# sourceMappingURL=http.js.map