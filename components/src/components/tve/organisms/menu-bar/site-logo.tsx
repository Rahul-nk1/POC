import { cn } from "@discovery/classnames";
import * as M from "@discovery/prelude/lib/data/maybe";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { ImageData } from "@discovery/sonic-api-ng/lib/api/cms/images/resource";
import { EventDataProvider } from "@discovery/common-tve/lib/eventing";

import { Link, LinkKind } from "../../atoms/link";
import { SonicImage } from "../../atoms/sonic-image";
import { readInt } from "../../../../utils/number";

import * as styles from "./styles.css";

const logoMaxHeight = M.fromMaybe(readInt(styles.logoMaxHeight), 40);

type Props = {
  logoM: M.Maybe<ImageData["attributes"]>;
  className?: string;
};

export const SiteLogo = ({ logoM, className }: Props) => (
  <RenderMaybe>
    {M.map(
      (logo) => (
        <EventDataProvider
          metaTag="header (organisms/menu-bar)"
          content={{
            titleM: M.of("home"),
            linkM: M.of("/"),
          }}
        >
          <Link
            kind={LinkKind.internal}
            href="/"
            className={cn(styles.logo, className)}
            label="Home"
          >
            <SonicImage
              image={logo}
              format="PNG"
              className={styles.logoImg}
              imageSizes={{ default: [215, "px"] }} // default to max-width
              fallbackImageSize={{ height: logoMaxHeight }}
              alt={M.fromMaybe(logo.alias, undefined)}
            />
          </Link>
        </EventDataProvider>
      ),
      logoM
    )}
  </RenderMaybe>
);
