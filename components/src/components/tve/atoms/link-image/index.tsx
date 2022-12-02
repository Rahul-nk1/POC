import { cn } from "@discovery/classnames";
import * as Images from "@discovery/sonic-api-ng/lib/api/cms/images";
import { Sizes as SonicImageSizes } from "@discovery/components-luna/lib/components/atoms/image/types";
import { ImageFormat } from "@discovery/components-luna/lib/utils/image";
import { SonicImage } from "../../atoms/sonic-image";
import { Link, LinkProps } from "../link";
import * as M from "@discovery/prelude/lib/data/maybe";

export type LinkImageProps = LinkProps & {
  extraImageWidths?: number[];
  fallbackImageWidth?: number;
  format?: ImageFormat;
  image: Images.Attributes.Attributes;
  imageClassName?: string;
  imageSizes?: SonicImageSizes;
  children?: JSX.Element;
};

const DEFAULT_IMAGE_FALLBACK_WIDTH = 1280;
const DEFAULT_IMAGE_FORMAT_TRANSPARENT: ImageFormat = "PNG";
const DEFAULT_IMAGE_SIZE: SonicImageSizes = {
  default: [40, "px"],
};
const DEFAULT_IMAGE_WIDTHS = [320, 1366, 1980];

export const LinkImage = ({
  children,
  className,
  extraImageWidths = DEFAULT_IMAGE_WIDTHS,
  fallbackImageWidth = DEFAULT_IMAGE_FALLBACK_WIDTH,
  format = DEFAULT_IMAGE_FORMAT_TRANSPARENT,
  href,
  image,
  imageClassName,
  imageSizes = DEFAULT_IMAGE_SIZE,
  kind,
  onClick,
  openInNewWindow = false,
  role,
  label,
}: LinkImageProps) => (
  <Link
    className={className}
    href={href}
    kind={kind}
    onClick={onClick}
    openInNewWindow={openInNewWindow}
    role={role}
    label={label}
  >
    <span className={cn(imageClassName)}>
      <SonicImage
        className={""}
        extraImageWidths={extraImageWidths}
        fallbackImageSize={{ width: fallbackImageWidth }}
        format={format}
        image={image}
        imageSizes={imageSizes}
        style={{ objectPosition: "center" }}
        alt={M.fromMaybe(image.alias, undefined)}
      />
    </span>
    {children}
  </Link>
);
