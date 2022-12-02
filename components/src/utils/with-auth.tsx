import * as M from "@discovery/prelude/lib/data/maybe";
import * as App from "@discovery/maestro";
import * as Users from "@discovery/sonic-api-ng/lib/api/users/me";
import * as Partners from "@discovery/sonic-api-ng/lib/api/users/partners";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import { AuthService } from "@discovery/client-core/lib/startup/types";
import { SonicApiAppConfig } from "@discovery/sonic-api-ng/lib/config/app-config";
import { withApp, simpleComp } from "@discovery/template-engine-legacy";
import { _authURL } from "./authURL";

type Read = AuthService & SonicApiAppConfig;
type State = {
  userM?: M.Maybe<{ id: string; attributes: Users.Attributes.Attributes }>;
  partnerM?: M.Maybe<Partners.Attributes.Attributes>;
};
type Callback = ({
  data,
  loggedIn,
  authURL,
}: {
  data: CollectionResponseData;
  loggedIn: boolean;
  authURL: ReturnType<typeof _authURL>;
  userM: State["userM"];
  partnerM: State["partnerM"];
  baseURL: string;
  children: JSX.Element[];
}) => JSX.Element;
export const withAuth = (callback: Callback) =>
  withApp<JSX.Element, App.Reader<Read>, State, Read & State>(
    (read) =>
      simpleComp(({ data, children }) => {
        const {
          userM = M.empty(),
          partnerM = M.empty(),
          authService,
          sonicApiAppConfig,
        } = read;
        const loggedIn = M.maybe(
          false,
          (bool) => !bool,
          M.map((u) => u.attributes.anonymous, userM)
        );
        const baseURL = `${authService.protocol}://${authService.domain}`;
        const authURL = _authURL(baseURL, sonicApiAppConfig.domain);

        return callback({
          data,
          loggedIn,
          authURL,
          baseURL,
          userM,
          children,
          partnerM,
        });
      }),
    App.chainMerge(
      (u) =>
        App.map(
          (s) => ({
            ...u,
            ...s,
          }),
          App.ask<App.Reader<Read>>()
        ),
      App.get<State>()
    )
  );
