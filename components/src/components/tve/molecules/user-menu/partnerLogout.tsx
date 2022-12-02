import * as M from "@discovery/prelude/lib/data/maybe";
import {
  EventDataProvider,
  triggerLogoutEvent,
} from "@discovery/common-tve/lib/eventing";
import { noop } from "@discovery/prelude/lib/function";

import { P, Sizes, Weights } from "../../atoms/text";
import { Link, LinkKind } from "../../atoms/link";

import Strings from "../../hardcoded.json";
import { User, PartnerM } from "./types";
import * as styles from "./styles.css";

/**
 * A link that allows user to log out of their provider.
 */
export const PartnerLogout = ({
  user,
  authURL,
  partnerM,
}: {
  user: User;
  authURL: string;
  partnerM: PartnerM;
}) => {
  const linkData: { text: string; onClick: () => void } = user.loggedIn
    ? {
        text: Strings.unLinkTvProvider,
        onClick: M.foldMapConst(
          (partner) => () => triggerLogoutEvent(partner.name),
          noop,
          partnerM
        ),
      }
    : {
        text: Strings.linkTvProvider,
        onClick: noop,
      };
  return (
    <EventDataProvider
      metaTag={linkData.text}
      element={linkData.text}
      content={{
        linkM: M.of(authURL),
        titleM: M.of(linkData.text),
        sectionTitleM: M.of(linkData.text),
      }}
    >
      <Link
        onClick={linkData.onClick}
        href={authURL}
        kind={LinkKind.external}
        openInNewWindow={false}
        className={styles.auth}
        label={linkData.text}
        tabIndex={-1}
      >
        <P
          className={styles.linkUnlinkParagraph}
          size={Sizes.xs}
          weight={Weights.semiBold}
        >
          {linkData.text}
        </P>
      </Link>
    </EventDataProvider>
  );
};
