import { cn } from "@discovery/classnames";
import * as M from "@discovery/prelude/lib/data/maybe";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { ImageData } from "@discovery/sonic-api-ng/lib/api/cms/images/resource";
import { SonicImage } from "../../atoms/sonic-image";

import { readInt } from "../../../../utils/number";

import * as styles from "./styles.css";

const iconSizeLarge = M.fromMaybe(readInt(styles.iconSizeLarge), 40);

type Props = {
  iconM: M.Maybe<ImageData["attributes"]>;
  className?: string;
};

export const LinkIcon = ({ iconM, className }: Props) => (
  <RenderMaybe>
    {M.map(
      (image) => (
        <SonicImage
          image={image}
          format="PNG"
          className={cn(styles.icon, className)}
          imageSizes={{ default: [iconSizeLarge, "px"] }}
          fallbackImageSize={{ width: iconSizeLarge }}
          alt={M.fromMaybe(image.alias, undefined)}
        />
      ),
      iconM
    )}
  </RenderMaybe>
);
