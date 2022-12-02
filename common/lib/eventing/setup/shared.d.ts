import * as S from "@discovery/prelude/lib/data/stream";
import EventTracker, * as EventsLib from "@discovery/clients-js-events-lib";
declare type DeferredEventingConfig = {
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
declare const setEventingConfig: (event: DeferredEventingConfig) => void;
/**
 * Based on the deferredEventingConfig stream, this stream chains off it and
 * sets up the proper configuration to set up the EventTracker class and exposes
 * them for further usage
 */
declare const config$: S.Stream<{
    clientAttributes: EventsLib.ClientAttributes;
    productAttributes: EventsLib.ProductAttributes;
    eventTracker: EventTracker;
}>;
export { config$, setEventingConfig };
//# sourceMappingURL=shared.d.ts.map