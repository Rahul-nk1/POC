import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as Partners from "@discovery/sonic-api-ng/lib/api/users/partners";
import { cn } from "@discovery/classnames";
import { ImageData } from "@discovery/sonic-api-ng/lib/api/cms/images/resource";
import { useLocationChange } from "@discovery/common-tve/lib/hooks/location";
import {
  PageTemplate,
  isPageTemplate,
} from "@discovery/common-tve/lib/constants";
import {
  useCallback,
  useState,
  useHistory,
  useEffect,
  useGlobalState,
  useGlobalStateModifier,
} from "@discovery/common-tve/lib/hooks";
import { GlobalState } from "@discovery/common-tve/lib/state";
import { EventDataProvider } from "@discovery/common-tve/lib/eventing";

import { P, Weights } from "../../atoms/text";
import { Link, LinkProps } from "../../atoms/link";
import { ScrollListener } from "../../atoms/scroll-listener";
import { FocusClear } from "../../atoms/focus-clear";
import { SkipLink } from "../../atoms/skip-link";
import { UserMenu } from "../../molecules/user-menu";
import { _authURL } from "../../../../utils/authURL";

import { SearchInput } from "../../molecules/search-input";
import { MainContainer } from "../../atoms/main-container";
import {
  searchQueryParam,
  searchPath,
  searchResultsPath,
  isSearchPath,
} from "../../../../site-builder/tve/components/menu-bar";
import { SiteLogo } from "./site-logo";
import { LinkIcon } from "./link-icon";
import * as styles from "./styles.css";

const searchResultsPathFromQuery = (searchText: string) =>
  `${searchResultsPath}?${searchQueryParam}=${encodeURIComponent(searchText)}`;

type ItemProps = LinkProps & {
  iconMobileM: M.Maybe<ImageData["attributes"]>;
  iconDesktopM: M.Maybe<ImageData["attributes"]>;
  title?: string;
};

export type Props = {
  authURL: ReturnType<typeof _authURL>;
  className?: string;
  linksL: L.List<ItemProps>;
  loggedIn: boolean;
  logoM: M.Maybe<ImageData["attributes"]>;
  mobileLogoM: M.Maybe<ImageData["attributes"]>;
  partnerM: M.Maybe<Partners.Attributes.Attributes>;
  user: {
    nameM: M.Maybe<string>;
    loggedIn: boolean;
    idM: M.Maybe<string>;
  };
  baseURL: string;
};

export const MenuBar = ({
  authURL,
  className,
  linksL,
  loggedIn,
  logoM,
  mobileLogoM,
  partnerM,
  user,
}: Props) => {
  const [changes, history] = useHistory();

  const isSearchPage = isSearchPath(changes.location.pathname);

  const doSearch = useCallback(
    (text: string) => {
      if (text.length === 0) {
        history.push(searchPath);
      } else {
        history.push(searchResultsPathFromQuery(text));
      }
    },
    [history]
  );

  const [authURLWithLocation, setAuthURLWithLocation] = useState(
    authURL(loggedIn ? "logout" : "login-affiliates")
  );

  const onLocationChange = useCallback(() => {
    setAuthURLWithLocation(authURL(loggedIn ? "logout" : "login-affiliates"));
  }, [loggedIn, authURL]);

  useLocationChange(onLocationChange);

  const updateState = useCallback(
    (st: GlobalState) => ({
      ...st,
      loggedIn,
      loginUrlM: M.of(authURLWithLocation),
      idM: user.idM,
    }),
    [authURLWithLocation, loggedIn, user]
  );
  const modifyState = useGlobalStateModifier(updateState);
  useEffect(() => {
    modifyState();
  }, [modifyState]);

  /* Sticky header transition */
  const [isScrolled, setIsScrolled] = useState(false);

  const [{ isPlayerPage, templateId }] = useGlobalState();
  const isSecondary =
    isPlayerPage ||
    (isPageTemplate(templateId) && templateId === PageTemplate.Secondary);

  const secondaryClassName = {
    [styles.secondary]: isSecondary,
  };
  const classes = cn(styles.navBar, secondaryClassName, className);

  return (
    <>
      <ScrollListener setIsScrolled={setIsScrolled} />

      <nav className={classes}>
        <FocusClear />
        <SkipLink />
        <div
          className={cn(styles.background, styles.fill, {
            [styles.filled]: isScrolled,
          })}
        />

        <div className={cn(styles.navBarInner, styles.fill)}>
          <SiteLogo
            logoM={M.alt(logoM, mobileLogoM)}
            className={styles.desktopLogo}
          />
          <SiteLogo
            logoM={M.alt(mobileLogoM, logoM)}
            className={styles.mobileLogo}
          />
          <div className={styles.flexed}>
            {L.mapWithIndex(
              (i, link) => (
                <EventDataProvider
                  key={`${link.kind}:${link.href}`}
                  metaTag="header (organisms/menu-bar)"
                  content={{
                    titleM: M.of(link.title),
                    linkM: M.of(link.href),
                  }}
                  contentIndex={i + 1}
                  element={`${link.title} icon`}
                >
                  <Link
                    kind={link.kind}
                    href={link.href}
                    className={cn(styles.navLink, styles.link, {
                      [styles.selected]:
                        changes.location.pathname === link.href,
                    })}
                    label={link.title}
                  >
                    <LinkIcon
                      iconM={link.iconMobileM}
                      className={styles.hideAboveMedium}
                    />
                    <LinkIcon
                      iconM={link.iconDesktopM}
                      className={styles.hideBelowMedium}
                    />

                    <P className={styles.indicator} weight={Weights.semiBold}>
                      {link.title}
                    </P>
                  </Link>
                </EventDataProvider>
              ),
              linksL
            )}
          </div>

          <div className={cn(styles.flexed, styles.rightLinks)}>
            <EventDataProvider contentIndex={L.length(linksL) + 1}>
              <UserMenu
                authURL={authURLWithLocation}
                user={user}
                partnerM={partnerM}
              />
            </EventDataProvider>
          </div>
        </div>
      </nav>
      {isSearchPage && (
        <EventDataProvider
          metaTag="search"
          element="search"
          content={{
            sectionTitleM: M.of("search"),
          }}
        >
          <MainContainer>
            <SearchInput onChange={doSearch} placeholder={"Search"} />
          </MainContainer>
        </EventDataProvider>
      )}
    </>
  );
};
