import * as React from "react";
import { mkBaseHooks } from "@discovery/orchestra/lib/base";
import { mkStorage } from "@discovery/orchestra/lib/storage";
import { mkDebounceDispatch } from "@discovery/orchestra/lib/debounce";
import { mkEvent, mkEventDispatcher } from "@discovery/orchestra/lib/event";
import {
  mkPaginated,
  mkPaginatedComponent,
  mkPaginatedCollection,
} from "@discovery/orchestra/lib/pagination";
import { mkHistory } from "@discovery/orchestra/lib/history";
import { mkInView } from "@discovery/orchestra/lib/intersection";
import { mkGlobalState } from "@discovery/orchestra/lib/global-state";
import { storage } from "@discovery/maestro-storage/lib/impl/local-storage";
import { json } from "@discovery/maestro-json/lib/impl/es5";
import { mkSonicHttp } from "@discovery/orchestra/lib/sonic-http";
import { envBrowser } from "@discovery/maestro-env-browser";
import { mkRealmConfig } from "@discovery/orchestra/lib/realm-config";
import * as F from "@discovery/prelude/lib/data/future";
import { history as initHistory } from "@discovery/maestro-history/lib/impl/window.history";

import { GlobalState, initialState } from "../state";
import { staticRealmConfig } from "../configs/realm";
import { DEVELOPMENT_MODE } from "../env";
import { clientInformation } from "../device-info";

const baseHooks = mkBaseHooks(React);

const staticConfigF = DEVELOPMENT_MODE
  ? F.resolve(staticRealmConfig)
  : undefined;

export const useRealmConfig = mkRealmConfig(staticConfigF);

export const useSonicHttp = mkSonicHttp({ ...baseHooks, useRealmConfig })({
  ...envBrowser,
  sonicApiConfig: {
    clientName: staticRealmConfig.siteLookupKey,
    clientHostname: window.location.hostname,
    protocol: "https",
    host: "sonic",
    features: ["asyncCollections"],
  },
  clientInformation: clientInformation,
});

const _history = initHistory();
const history = () => _history;
export const maestroHistory = history();

export const {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} = baseHooks;

export const usePaginatedCollection = mkPaginatedCollection({
  ...baseHooks,
  useSonicHttp,
})();

export const usePaginated = mkPaginated({
  ...baseHooks,
  usePaginatedCollection,
})();

export const Paginated = mkPaginatedComponent({ usePaginated });

export const { useLayoutEffect } = React;

export const useEvent = mkEvent(baseHooks)(window);
export const useDebounceDispatch = mkDebounceDispatch(baseHooks);
export const useDispatch = mkEventDispatcher(baseHooks)(window);
export const { useHistory } = mkHistory(baseHooks)({ ...history() });
export const { useWhenInView, useInView } = mkInView(baseHooks)({
  observer: window.IntersectionObserver,
});

export const {
  updateGlobalState,
  useGlobalState,
  useGlobalStateModifier,
} = mkGlobalState(baseHooks)<GlobalState>({
  initialState,
});

export const useStorage = mkStorage(baseHooks)({ ...storage, ...json });
