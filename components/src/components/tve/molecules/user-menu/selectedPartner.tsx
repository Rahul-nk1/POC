import { cn } from "@discovery/classnames";
import * as M from "@discovery/prelude/lib/data/maybe";
import { EventDataProvider } from "@discovery/common-tve/lib/eventing";
import { Link, LinkKind } from "../../atoms/link";
import { P, Weights } from "../../atoms/text";
import { User as UserIcon } from "../../atoms/icons";

import { PartnerLogin } from "./partnerLogin";
import { PartnerM } from "./types";
import {
  triggerAuthenticationEvent,
  AuthenticationEvent,
} from "@discovery/common-tve/lib/eventing";

import Strings from "../../hardcoded.json";
import { discoveryGlobalIdentity } from "../../hardcoded-text";

import * as styles from "./styles.css";

type SelectedPartnerProps = {
  loggedIn: boolean;
  authURL: string;
  partnerM: PartnerM;
  setTouchStart?: () => void;
  onMouseEnter?: () => void;
  onClick?: () => void;
};

/**
 * Formerly PersistentNavItem, this subcomponent of {@link user-menu} renders the logo of the selected partner/provider/affiliate
 * and opens the dropdown when hovered.
 */
export const SelectedPartner = ({
  loggedIn,
  authURL,
  partnerM,
  setTouchStart,
  onMouseEnter,
  onClick,
}: SelectedPartnerProps) => {
  const handleClick = () =>
    triggerAuthenticationEvent(
      AuthenticationEvent.LOGIN,
      discoveryGlobalIdentity
    );

  return loggedIn ? (
    <div
      onMouseEnter={onMouseEnter}
      onTouchStart={setTouchStart}
      onClick={onClick}
      className={cn(styles.userButton)}
    >
      <PartnerLogin partnerM={partnerM} />
      <UserIcon className={styles.icon} />
    </div>
  ) : (
    <EventDataProvider
      content={{
        linkM: M.of(authURL),
        titleM: M.of(Strings.linkTvProvider),
      }}
      element={Strings.linkTvProvider}
    >
      <Link
        kind={LinkKind.external}
        openInNewWindow={false}
        href={authURL}
        className={cn(styles.userButton, styles.lockHoverBackground)}
        label={Strings.linkTvProvider}
        onClick={handleClick}
        tabIndex={0}
      >
        <P weight={Weights.semiBold} className={styles.hideExtraSmall}>
          {Strings.linkTvProvider}
        </P>
        <UserIcon className={styles.icon} />
      </Link>
    </EventDataProvider>
  );
};
