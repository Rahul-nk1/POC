import * as Option from "fp-ts/Option";
import { flow } from "fp-ts/function";
import { _authURL } from "./authURL";
import { User } from "@discovery/common-tve/lib/state";
import { Reader } from "@discovery/common-tve/lib/reader";

export type AuthURL = {
  authURL: ReturnType<typeof _authURL>;
  baseURL: string;
};

export const deriveAuthURL = (read: Reader) => {
  const baseURL = `${read.authService.protocol}://${read.authService.domain}`;
  const authURL = _authURL(baseURL, read.sonicApiAppConfig.domain);

  return {
    baseURL,
    authURL,
  };
};

export const isLoggedIn = flow(
  Option.map((u: User) => u.attributes.anonymous),
  Option.fold(
    () => false,
    (anon) => !anon
  )
);
