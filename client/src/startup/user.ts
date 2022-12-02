import * as M from "@discovery/prelude/lib/data/maybe";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import * as App from "@discovery/maestro";
import * as Optics from "@discovery/sonic-api-ng-optics";
import * as User from "@discovery/sonic-api-ng/lib/api/users/me";
import { Fold, Lens } from "@discovery/prelude/lib/control/lens";
import { startupException } from "@discovery/client-core/lib/startup/startup-exception";
import { storage as cookieStorage } from "@discovery/maestro-storage/lib/impl/cookie";
import { createStore, Storage, remove } from "@discovery/maestro-storage";
import {
  JsonParser,
  jsonParserException,
  JSONValue,
} from "@discovery/maestro-json";
import * as History from "@discovery/maestro-history";
import { string } from "@discovery/prelude/lib/data/validated";
import { AuthService } from "@discovery/client-core/lib/startup/types";
import { _authURL } from "@discovery/components-tve/lib/utils/authURL";
import { SonicApiAppConfig } from "@discovery/sonic-api-ng/lib/config/app-config";
import { tryImpure } from "@discovery/prelude/lib/function/impure";
import * as Users from "@discovery/sonic-api-ng/lib/api/users/me";

import { updateGlobalState } from "@discovery/common-tve/lib/hooks";
import { _User as _UserState } from "@discovery/common-tve/lib/state";

const _User = Fold.compose(
  Optics._UserResponse2User,
  Res._Response(),
  Fold.liftM(
    (id, attributes) => ({ id, attributes }),
    Lens.prop("id"),
    Lens.prop("attributes")
  )
);

const EOS_LEGACY_TOKEN = "eosAf";
const AUTH_NEW_TOKEN = "gauthmt";

const legacyTokenStorage = createStore(string, EOS_LEGACY_TOKEN);
const newTokenStorage = createStore(string, AUTH_NEW_TOKEN);

const urlDecoderNOTJSON = {
  json: {
    fromString: (s: string) =>
      tryImpure(
        // legacy eosAf cookie is encoded string so decode it to get JSON
        () => decodeURIComponent(s),
        () => jsonParserException(`Failed fromString`)
      ),
    toString: (o: JSONValue) =>
      tryImpure(
        // we only need property r in the JSON that is extracted from the legacy cookie
        () => JSON.parse(String(o)).r,
        () => jsonParserException(`Failed toString`)
      ),
  },
};

const cookieTokenEffects = App.local(
  (r: Storage & JsonParser) => ({
    ...r,
    storage: cookieStorage().storage,
    json: urlDecoderNOTJSON.json,
  }),
  App.chainMerge(
    // 3. if write is success, remove the legacy token
    // TODO: this needs to be changed to `remove` operator that exist on legacyTokenStorage. Should be there for >2.5.1
    () => remove(EOS_LEGACY_TOKEN),
    App.chainMerge(
      // 2 write it to the new token storage
      (x) => newTokenStorage.write(x),

      // 1. read the legacy token
      legacyTokenStorage.read
    )
  )
);

const checkCookieAndRedirect = App.chainMerge(
  () =>
    App.chainMerge(
      ({ authService, sonicApiAppConfig }) =>
        App.chainMerge(
          () =>
            // if everything went fine with all the cookie effects, we'll do a
            // history redirect to auth
            History.redirect(
              _authURL(
                `${authService.protocol}://${authService.domain}`,
                sonicApiAppConfig.domain
              )("gauth-migration")
            ),
          // This contains everything that needs to be done on a cookie storage level
          cookieTokenEffects
        ),
      // Make sure to read from reader to get necessary information for auth redirect
      App.ask<App.Reader<AuthService & SonicApiAppConfig>>()
    ),
  // TODO: this is just to help the types. A bit painful currently but should be temporary
  App.get<{
    userM: M.Maybe<{ id: string; attributes: Users.Attributes.Attributes }>;
  }>()
);

const updateGlobalUser = updateGlobalState(_UserState);

const setUser = (userRes: User.Resource.UserResponse) => {
  const userM = Fold.preview(_User, userRes);
  updateGlobalUser((_oldUserM) => userM);

  return App.chainMerge(
    () =>
      App.modify<{ userM: typeof userM }>((s) => ({
        ...s,
        userM,
      })),
    App.fromMaybe(userM, startupException("No user"))
  );
};

const userApp = (userRes: User.Resource.UserResponse) => {
  const userM = Fold.preview(_User, userRes);

  const isAnonymous = M.foldMapConst(
    ({ attributes }) => attributes.anonymous,
    true,
    userM
  );

  if (isAnonymous) {
    // check the cookie and redirect. if anything fails in that, just set the
    // user as normally and continue
    return App.recover(() => setUser(userRes), checkCookieAndRedirect);
  } else {
    return setUser(userRes);
  }
};

export const userReq = App.chainMerge(userApp, User.Endpoints.getMe());
