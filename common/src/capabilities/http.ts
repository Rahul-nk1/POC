import * as F from "@discovery/prelude/lib/data/future";
import * as HTTP from "@discovery/maestro-http";
import { performance, PerformanceMarkers } from "../performance";
import { http as fetchHttp } from "@discovery/maestro-http/lib/impl/fetch";
import { triggerErrorEvent } from "../eventing";
import { ActionTypes } from "@discovery/clients-js-events-lib/lib/Error";

const http: HTTP.HTTP = {
  http: (x) => {
    performance.mark?.(PerformanceMarkers.request_start);

    const errorCase = (e: HTTP.HttpException) => {
      triggerErrorEvent(ActionTypes.INTERNAL, {
        code: "unknown",
        name: e.kind,
        message: e.message,
        type: e.type,
      });
      performance.mark?.(PerformanceMarkers.request_done);
      return e;
    };

    const successCase = (v: HTTP.HTTPResponse) => {
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
      performance.mark?.(PerformanceMarkers.request_done);
      return v;
    };

    return F.bimap<HTTP.HttpException, HTTP.HttpException>(errorCase)(
      successCase
    )(fetchHttp.http(x));
  },
};

export { http };
