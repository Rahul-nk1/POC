import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";

import { Link, LinkKind } from "../../atoms/link";
import { P, Sizes } from "../../atoms/text";
import { Clamp } from "../../../../utils/text";

import { PartnerM } from "./types";
import * as styles from "./styles.css";

// Required default value for partnerUrls presumably overwritten by the incomming `partnerM`.
// TODO: Refactor this out in the future.
const partnerUrls: { [key: string]: string } = {
  xfinity: "https://tv.xfinity.com/",
};

/**
 * A link that allows user to log into provider.
 */
export const PartnerLogin = ({ partnerM }: { partnerM: PartnerM }) => {
  const partnerNameM = M.chain(
    (partner) => (partner.name ? M.of(partner.name) : M.empty()),
    partnerM
  );

  const partnerUrl = M.fromMaybe(
    M.chain(
      (partner) => M.of(partnerUrls[partner.name.toLowerCase()]),
      partnerM
    ),
    ""
  );

  return (
    <Link
      kind={partnerUrl ? LinkKind.external : LinkKind.eventListenerOnly}
      href={partnerUrl}
      label={M.fromMaybe(partnerNameM, "")}
      tabIndex={-1}
    >
      {M.foldMapConst(
        (logoUrl) => (
          <img
            // TODO: Use <SonicImage>
            className={styles.affiliateLogo}
            src={logoUrl}
            alt={M.fromMaybe(partnerNameM, "")}
          />
        ),
        <RenderMaybe>
          {M.map(
            (name) => (
              <P
                className={cn(styles.hideExtraSmall, styles.providerName)}
                size={Sizes.xxs}
              >
                <Clamp str={name} maxLength={30} />
              </P>
            ),
            partnerNameM
          )}
        </RenderMaybe>,
        M.chain((partner) => partner.transparentLogoUrl, partnerM)
      )}
    </Link>
  );
};
