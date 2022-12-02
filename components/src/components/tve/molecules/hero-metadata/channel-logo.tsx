import type { FC } from "react";
import { cn } from "@discovery/classnames";
import { Attributes as ImageAttributes } from "@discovery/sonic-api-ng/lib/api/cms/images/attributes";

import type { Ref } from "../../../../utils/types";
import { Tags } from "../../../../utils/types";

import * as styles from "./styles.css";

type Props = {
  alt?: string;
  className?: string;
  height?: string | number;
  logo: ImageAttributes;
  onAbort?: (e?: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onError?: (e?: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: (e?: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  _ref?: Ref<Tags>;
};

/**
 * TODO -- enhance SonicImage so it can scale by *only* height
 *  - currently, SonicImage can only scale via width
 *  - these network logos change in width but need to maintain their height
 *  - as well as bottom-right position/padding
 *
 *  -> filed as https://github.com/DNI-Mercury/cd_concert_project/issues/1333
 *
 *  -> perhaps we should also incorporate srcSet and other features from SonicImage
 *     in the interim, but this definitely works for now
 *
 * TODO -- add 'width' property to fix dynamic scaling
 *  - it turns out you can proportionally scale <img> tags via CSS
 *  - IF there are no `width` or `height` attributes applied
 */

export const ChannelLogo: FC<Props> = ({
  alt,
  className,
  height,
  logo,
  onAbort = () => {},
  onError = () => {},
  onLoad = () => {},
  _ref,
}) => (
  <img
    // TODO: Use <SonicImage>
    className={cn(styles.channelLogo, className)}
    onLoad={onLoad}
    onError={onError}
    onAbort={onAbort}
    height={height}
    alt={alt}
    src={logo.src}
    ref={_ref}
  />
);
