import * as S from "@discovery/prelude/lib/data/stream";
import EventTracker from "@discovery/clients-js-events-lib";
import { getProductAttributes } from "./product-attributes";
import { getClientAttributes } from "./client-attributes";
import { getAnalyticsSessionState } from "@discovery/dni-central-auth-analytics-session-data";
const httpMethod = (p, v) => (url, data, httpMethodOptions) => fetch(url, Object.assign(Object.assign({ method: "POST", body: JSON.stringify(data) }, httpMethodOptions), { headers: {
        "x-disco-client": `WEB:unknown:${p}:${v}`,
    }, credentials: "include", keepalive: true }));
const createSettings = (sessionState) => (p, v) => ({
    httpMethod: httpMethod(p, v),
    sessionState,
});
/**
 * The stream contains all the deferred configuration needed for eventing
 * The `setEventingConfig` function pushes values into the stream
 */
const [setEventingConfig, deferredEventingConfig$,] = S.createAdapter();
/**
 * Based on the deferredEventingConfig stream, this stream chains off it and
 * sets up the proper configuration to set up the EventTracker class and exposes
 * them for further usage
 */
const config$ = S.hold(S.chain(({ product, name, version, sonicEndpoint, advertisingConfiguration }) => {
    const eventTracker = new EventTracker(`${sonicEndpoint.protocol}://${sonicEndpoint.domain}/events/v1`, Object.assign(Object.assign({}, createSettings(getAnalyticsSessionState())(name, version)), { advertisingConfiguration: advertisingConfiguration }));
    const clientAttributes$ = S.fromPromise(getClientAttributes(eventTracker));
    const productAttributes$ = S.fromPromise(getProductAttributes({ product, name }));
    return S.combine((clientAttributes, productAttributes) => ({
        clientAttributes,
        productAttributes,
        eventTracker,
    }), clientAttributes$, productAttributes$);
}, deferredEventingConfig$));
export { config$, setEventingConfig };
//# sourceMappingURL=shared.js.map