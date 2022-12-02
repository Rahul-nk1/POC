import { useMemo } from "@discovery/common-tve/lib/hooks";
import { SonicImage as CoreSonicImage } from "@discovery/components-luna/lib/components/atoms/image";
import * as O from "fp-ts/lib/Option";
import { FC, memo } from "react";
export type { Sizes } from "@discovery/components-luna/lib/components/atoms/image"; //eslint-disable-line

type SlimmedSonicImageProps = Parameters<typeof CoreSonicImage>[0];

/**
 * Just a wrapper around core <SonicImage>, to avoid re-renders.
 *
 * This is done here and not in core because React specific functions (`memo`) are not available to core.
 * It could be passed to an `mkSonicImage`-style function, however that would be a breaking change for all clients.
 */
export const SonicImage: FC<SlimmedSonicImageProps> = memo(CoreSonicImage);

const fmconcat = O.getFirstMonoid<string>().concat;

type LiteSonicImageProps = Pick<
  SlimmedSonicImageProps,
  | "className"
  | "blur"
  | "format"
  | "quality"
  | "onAbort"
  | "onError"
  | "onLoad"
  | "alt"
> &
  Pick<SlimmedSonicImageProps["image"], "src" | "title" | "description"> & {
    width: number;
  };

const densities = [1, 2, 4];
/**
 * Try to  **only** take primitive props for performance!
 * @deprecated use `SonicImage` once it's been improved
 */
export const ThunderImage = memo(
  ({
    className,
    blur,
    format,
    quality = 85,
    src,
    width,
    title,
    description,
    alt,
    ...rest
  }: LiteSonicImageProps) => {
    /** Sonic accepts floating point blur and quality, but not width..  */
    const bf = useMemo(() => (blur ? `&bf=${blur}` : ""), [blur]);
    const f = useMemo(() => (format ? `&f=${format}` : ""), [format]);
    const q = useMemo(() => (quality ? `&q=${quality}` : ""), [quality]);
    const p = "&p=true";
    const srcSet = densities
      .map((d) => `${src}?w=${Math.ceil(width * d)}${bf}${f}${p}${q} ${d}x`)
      .join(",");
    /** Do NOT change to `alt`, `concat` seems to be a mangitude faster */
    const _alt = useMemo(() => O.toUndefined(fmconcat(description, title)), [
      description,
      title,
    ]);

    return (
      <img {...rest} alt={alt || _alt} className={className} srcSet={srcSet} />
    );
  }
);
