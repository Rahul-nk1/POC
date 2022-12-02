import * as History from "@discovery/maestro-history";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as NE from "@discovery/prelude/lib/data/nonempty";
import * as CQ from "@discovery/sonic-api-ng/lib/api/common/query";
import * as App from "@discovery/maestro";
import * as Users from "@discovery/sonic-api-ng/lib/api/users/me";
import * as Query from "@discovery/sonic-api-ng/lib/api/cms/routes/query";
import * as Routes from "@discovery/sonic-api-ng/lib/api/cms/routes";
import * as EventsLib from "@discovery/clients-js-events-lib";
import * as ErrorPages from "@discovery/components-tve/lib/components/tve/molecules/error-pages";
import { head } from "@discovery/prelude/lib/data/iterable";
import { http } from "@discovery/common-tve/lib/capabilities";
import { render } from "@discovery/maestro-render/lib/impl/react";
import { Shimmer } from "@discovery/components-tve/lib/components/tve/atoms/spinner";
import { VERSION } from "@discovery/common-tve/lib/env";
import { envBrowser } from "@discovery/maestro-env-browser";
import { AuthService } from "@discovery/client-core/lib/startup/types";
import { SomeException } from "@discovery/prelude/lib/data/exception";
import { maestroHistory } from "@discovery/common-tve/lib/hooks";
import { SonicApiAppConfig } from "@discovery/sonic-api-ng/lib/config/app-config";
import { clientInformation } from "@discovery/common-tve/lib/device-info";
import { Sentry as _Sentry } from "@discovery/roadie";
import { Reader, PlayerConfig } from "@discovery/common-tve/lib/reader";
import { startupException, getRealmServiceUrl } from "@discovery/client-core";
import {
  performance,
  PerformanceMarkers,
} from "@discovery/common-tve/lib/performance";
import { DEFAULT_DECORATORS } from "@discovery/common-tve/lib/constants";
import {
  setEventingConfig,
  triggerBeforeUnloadEvent,
  triggerInitSessionEvent,
  triggerVisibilityChangeEvent,
} from "@discovery/common-tve/lib/eventing";

import { ResponseException } from "@discovery/sonic-api-ng/lib/japi/response";
import { SomeError } from "@discovery/sonic-api-ng/lib/japi";

import { fromComponentMap } from "@discovery/template-engine/lib/template-engine";
import { ComponentMap } from "@discovery/template-engine/lib/component-map";
import {
  mountCollection,
  mountRoutes,
} from "@discovery/template-engine/lib/mount";
import { getCollection } from "@discovery/sonic-api-ng/lib/api/cms/collections/endpoints";

import { userReq } from "./startup/user";
import { getRealm } from "./startup/realm";
import { PAGE_MAP } from "./mapping/page-mapper";
import { partnerReq } from "./startup/partner";
import { COMPONENT_MAP } from "./mapping/component-mapper";
import { renderErrorPage } from "./startup/error-page";
import { searchQueryParam } from "@discovery/components-tve/src/site-builder/tve/components/menu-bar";

const onError = (e: NE.NonEmpty<SomeError> | ResponseException) =>
  NE.isNonEmpty(e) ? (
    <ErrorPages.ErrorPage errors={e} />
  ) : (
    <ErrorPages.ErrorPageGeneric />
  );

const onLoad = Shimmer;

const componentMap: ComponentMap<Reader> = {
  ...PAGE_MAP,
  ...COMPONENT_MAP,
};

const Sentry = _Sentry.Original;

const APP_LOAD_TIME = "APP_LOAD_TIME";
performance.mark?.(PerformanceMarkers.app_load_time_start);

const getRoute = (path: string, params?: Routes.Query.Parameters) => ({
  location,
}: History.HistoryObject) => {
  const target = location.pathname === "/" ? `/${path}` : location.pathname;

  const [param, value] = location.search.split("=");

  const queryString = param === `?${searchQueryParam}` ? value : undefined;

  const defaultParams = Query.lenses.decorators.set(
    CQ.Decorators.decorators(...DEFAULT_DECORATORS)
  )(Query.parameters);

  const newParams =
    queryString && params
      ? Routes.Query.lenses.contentFilters.set(
          CQ.ContentFilters.contentFilters(
            CQ.ContentFilter.contentFilter(
              "query",
              encodeURIComponent(queryString)
            )
          )
        )(params)
      : defaultParams;

  return Routes.Endpoints.getRoute(target.slice(1) || "home", newParams);
};
export type State = {
  userM?: M.Maybe<{ id: string; attributes: Users.Attributes.Attributes }>;
};

const runMainApp = ({
  sonicApiAppConfig,
  authService,
  playerConfig,
}: SonicApiAppConfig & AuthService & PlayerConfig) => {
  const app = App.chainMerge(() => {
    const templateEngine = fromComponentMap(componentMap, {
      sonicApiAppConfig,
      authService,
      playerConfig,
      clientInformation,
    });

    const hApp = mountCollection(
      "header",
      templateEngine,
      getCollection("web-menubar")
    );

    const fApp = mountCollection(
      "footer",
      templateEngine,
      getCollection("web-footer")
    );

    const bApp = mountRoutes(
      "app",
      templateEngine,
      getRoute(
        "home",
        Query.lenses.decorators.set(
          CQ.Decorators.decorators(...DEFAULT_DECORATORS)
        )(Query.parameters)
      ),
      {
        onLoad,
        onError,
      }
    );

    return App.sequentialA(hApp, bApp, fApp);
  }, App.sequential(userReq, partnerReq));

  const run = App.run(app);

  const appM = M.liftM3(
    (appRoot: HTMLElement, headerRoot: HTMLElement, footerRoot: HTMLElement) =>
      App.fromPromise(
        run(
          {
            ...{
              ...envBrowser,
              // Overwrite the envBrowser http as we have performance markers in ours
              http: http.http,
            },
            ...maestroHistory,
            ...render({ app: appRoot, header: headerRoot, footer: footerRoot }),
            ask: () => ({
              sonicApiAppConfig,
              authService,
              playerConfig,
              clientInformation: clientInformation,
            }),
          },
          { userM: M.empty(), partnerM: M.empty() }
        ).then(() => {
          document.getElementById("remove-loader")?.remove();
        }),
        (e) => startupException("Something went wrong", e as SomeException)
      ),
    M.of(document.getElementById("app")),
    M.of(document.getElementById("header")),
    M.of(document.getElementById("footer"))
  );

  return M.fromMaybe(appM, App.fail(startupException("No Mounting points")));
};

export const main = () => {
  /** Session events **/
  document.addEventListener("visibilitychange", () =>
    triggerVisibilityChangeEvent(document.visibilityState)
  );
  window.addEventListener("beforeunload", triggerBeforeUnloadEvent);

  const app = App.chainMerge((realm) => {
    const version = VERSION ?? "DEV";
    setEventingConfig({
      product: EventsLib.Products.DISCOVERY_ATVE,
      name:
        realm.siteLookupKey &&
        realm.siteLookupKey.toUpperCase() in EventsLib.ProductNames
          ? (realm.siteLookupKey as EventsLib.ProductNames)
          : // Realistically, this will never happen
            ("unknown-productName" as EventsLib.ProductNames),
      version: version,
      // TODO: these values are to be added
      advertisingConfiguration: {
        adobeOrganizationId: "BC501253513148ED0A490D45",
        comScoreId: "31602802",
      },
      sonicEndpoint: {
        domain: realm.domain,
        protocol: "https",
      },
    });
    return runMainApp({
      sonicApiAppConfig: {
        domain: realm.domain,
        realm: realm.realm,
        // Fallbacks to the old value if siteLookupKey doesnt exist
        clientName: realm.siteLookupKey || window.location.hostname,
        protocol: "https",
        version: version,
        host: "sonic",
        siteLookupKey: M.of(realm.siteLookupKey),
        clientHostname: window.location.hostname,
        features: ["asyncCollections"],
      },
      authService: {
        domain: realm.authDomain,
        protocol: "https",
      },
      playerConfig: {
        environment: realm.environment,
      },
    });
  }, getRealm);

  const run = App.run(app);

  return run(
    {
      ...envBrowser,
      ...maestroHistory,
      ask: () => ({
        // Providing this hostname will instruct realm service to return correct response
        hostname: window.location.hostname,
        realmServiceConfig: {
          realmServiceUrl: getRealmServiceUrl(),
        },
      }),
    },
    { userM: M.empty() }
  )
    .then(() => {
      performance.mark?.(PerformanceMarkers.app_load_time_end);
      performance.measure?.(
        APP_LOAD_TIME,
        PerformanceMarkers.app_load_time_start,
        PerformanceMarkers.app_load_time_end
      );
      const appLoadTime = M.fromMaybe(
        head(
          performance
            .getEntriesByName(APP_LOAD_TIME)
            .map((x) => Math.round(x.duration))
        ),
        0
      );
      triggerInitSessionEvent(appLoadTime);
    })
    .catch((error) => {
      const body = document.getElementById("app");
      if (body) {
        renderErrorPage(body);
      }

      /**
       * TODO
       * Remove when we have a proper Error tracking and use logbus
       */
      Sentry.configureScope(function (scope) {
        scope.setExtra("error", error);
        scope.setTag("area", "Concert");
        scope.setLevel(Sentry.Severity.Fatal);
        let kind = "unknown";
        if (error.kind) {
          kind = error.kind;
        } else if (Array.isArray(error)) {
          for (const e of error) {
            if (e.kind) {
              kind = e.kind;
              break;
            }
          }
        }
        Sentry.captureMessage(`Concert Error: ${kind}`);
      });

      return console.error("Something went wrong", error);
    });
};
