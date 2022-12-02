import * as S from "@discovery/prelude/lib/data/stream";
import EventTracker, * as EventsLib from "@discovery/clients-js-events-lib";
import { getProductAttributes } from "./product-attributes";
import { getClientAttributes } from "./client-attributes";
import { getAnalyticsSessionState } from "@discovery/dni-central-auth-analytics-session-data";

const httpMethod = (p: string, v: string): EventsLib.Settings["httpMethod"] => (
  url,
  data,
  httpMethodOptions
) =>
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    ...httpMethodOptions,
    headers: {
      "x-disco-client": `WEB:unknown:${p}:${v}`,
    },
    credentials: "include",
    keepalive: true,
  });

const createSettings = (sessionState: EventsLib.SessionState) => (
  p: string,
  v: string
): EventsLib.Settings => ({
  httpMethod: httpMethod(p, v),
  sessionState,
});

type DeferredEventingConfig = {
  product: EventsLib.Products;
  name: EventsLib.ProductNames;
  version: string;
  advertisingConfiguration: EventsLib.AdvertisingConfiguration;
  sonicEndpoint: {
    domain: string;
    protocol: string;
  };
};

/**
 * The stream contains all the deferred configuration needed for eventing
 * The `setEventingConfig` function pushes values into the stream
 */
const [
  setEventingConfig,
  deferredEventingConfig$,
] = S.createAdapter<DeferredEventingConfig>();

/**
 * Based on the deferredEventingConfig stream, this stream chains off it and
 * sets up the proper configuration to set up the EventTracker class and exposes
 * them for further usage
 */
const config$ = S.hold(
  S.chain(
    ({ product, name, version, sonicEndpoint, advertisingConfiguration }) => {
      const eventTracker = new EventTracker(
        `${sonicEndpoint.protocol}://${sonicEndpoint.domain}/events/v1`,
        {
          ...createSettings(getAnalyticsSessionState())(name, version),
          advertisingConfiguration: advertisingConfiguration,
        }
      );
      const clientAttributes$ = S.fromPromise(
        getClientAttributes(eventTracker)
      );
      const productAttributes$ = S.fromPromise(
        getProductAttributes({ product, name })
      );

      return S.combine(
        (clientAttributes, productAttributes) => ({
          clientAttributes,
          productAttributes,
          eventTracker,
        }),
        clientAttributes$,
        productAttributes$
      );
    },
    deferredEventingConfig$
  )
);

export { config$, setEventingConfig };
