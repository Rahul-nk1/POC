import * as O from "fp-ts/Option";
import { Fold } from "@discovery/prelude/lib/control/lens";
import * as Optics from "@discovery/sonic-api-ng-optics";
import { EventDataProvider } from "@discovery/common-tve/lib/eventing";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import { mkComponentMapItem } from "@discovery/template-engine/lib/component-map";
import { Reader } from "@discovery/common-tve/lib/reader";
import { useGlobalState, useMemo } from "@discovery/common-tve/lib/hooks";
import { _User, _Partner, User } from "@discovery/common-tve/lib/state";

import {
  MenuBar,
  Props as MenuBarProps,
} from "../../../../components/tve/organisms/menu-bar";
import { _LinkItems, _SiteLogo, _SiteMobileLogo } from "./optics";
import { deriveAuthURL, isLoggedIn } from "../../../../utils/auth";

export const searchQueryParam = "q";
/**
 * Observe that for this logic to work these need to be the same as the route URL of the
 * pages in Site Builder
 */
export const searchPath = "/search";
export const searchResultsPath = "/search/result";
export const isSearchPath = (s: string) => s.startsWith(searchPath);
// Omitted props come from Reader and GlobalState
type Props = Omit<
  MenuBarProps,
  "authURL" | "baseURL" | "partnerM" | "user" | "loggedIn"
> & { componentIdM: O.Option<string> };

const getProps = (data: CollectionResponseData): Props => {
  const componentIdM = Fold.preview(Optics._Col2ComponentId, data);
  const linksL = Fold.toList(_LinkItems, data);
  const logoM = Fold.preview(_SiteLogo, data);
  const mobileLogoM = Fold.preview(_SiteMobileLogo, data);

  return {
    componentIdM,
    linksL,
    logoM,
    mobileLogoM,
  };
};

export const mkMenuBar = (read: Reader) => {
  const { authURL, baseURL } = deriveAuthURL(read);
  return ({ componentIdM, linksL, logoM, mobileLogoM }: Props) => {
    const [partnerM] = useGlobalState(_Partner);
    const [userM] = useGlobalState(_User);
    const loggedIn = useMemo(() => isLoggedIn(userM), [userM]);

    const user = useMemo(
      () => ({
        nameM: O.chain((user: User) => user.attributes.username)(userM),
        idM: O.map((user: User) => user.id)(userM),
        loggedIn,
      }),
      [userM, loggedIn]
    );

    return (
      <EventDataProvider
        metaTag="menu-bar (component-creator)"
        componentIdM={componentIdM}
      >
        <MenuBar
          linksL={linksL}
          logoM={logoM}
          mobileLogoM={mobileLogoM}
          user={user}
          loggedIn={loggedIn}
          authURL={authURL}
          partnerM={partnerM}
          baseURL={baseURL}
        />
      </EventDataProvider>
    );
  };
};

export const ComponentMapItem = mkComponentMapItem(getProps, mkMenuBar);
