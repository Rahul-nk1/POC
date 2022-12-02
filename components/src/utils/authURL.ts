import { UrlSearchParams } from "./types";

export const _authURL = (base: string, host: string) => (
  path: string,
  config: {
    extraParams?: string[];
    excludePathname?: boolean; // Used for returning to "paywall" without pathname on sign out.
  } = {}
) => {
  const { href, pathname } = window.location;
  const { extraParams = [], excludePathname } = config;
  const returnUrl = excludePathname ? href.replace(pathname, "/") : href;

  return `${base}/${path}?returnUrl=${encodeURI(returnUrl)}&hostUrl=${host}${
    extraParams.length > 0 ? "&".concat(extraParams.join("&")) : ""
  }`;
};

export const _updateURL = (
  baseUrl: string,
  params: UrlSearchParams
): string => {
  const url = new URL(baseUrl);
  const search_params = url.searchParams;
  search_params.set(params.key, params.value);
  url.search = search_params.toString();

  return url.toString();
};
