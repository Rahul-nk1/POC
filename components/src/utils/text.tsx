import * as M from "@discovery/prelude/lib/data/maybe";
import { memo } from "react";

export const ELLIPSES = String.fromCharCode(8230);
export const DEFAULT_CLAMP_LENGTH = 17;

export type ClampProps = {
  str: string;
  maxLength: number;
};

export const Clamp = memo(({ str, maxLength }: ClampProps) => {
  const strClamp = str.slice(0, maxLength);
  const ellipses = str.length > maxLength ? ELLIPSES : "";

  return (
    <>
      {strClamp}
      {ellipses}
    </>
  );
});

/**
 * TODO -- migrate this to `Text` component
 *
 * For when you need multiple text items in one row, and you need to wrap in
 * them in spans, because they need specific padding.
 *
 * Suggested usage:
 *   <P>
 *     <RenderMaybe>
 *       {M.map(span, textFooM)}
 *       {M.map(span, textBarM)}
 *       {M.map(span, textBazM)}
 *     <RenderMaybe>
 *   </P>
 */
export const span = (x: React.ReactNode, className?: string) => (
  <span className={className}>{x}</span>
);

/** Combine seasonM, episodeM and titleM */
export const seasonAndEpisodeAndTitleM = ({
  seasonNumberM,
  episodeNumberM,
  titleM,
}: {
  seasonNumberM: M.Maybe<number>;
  episodeNumberM: M.Maybe<number>;
  titleM: M.Maybe<string>;
}) => {
  const season = M.maybe("", (s) => `S${s}`, seasonNumberM);
  const episode = M.maybe("", (e) => `E${e}`, episodeNumberM);
  const title = M.maybe("", (t) => `${t}`, titleM);
  const text = [season, episode, title].join(" ").trim();
  return text.length > 0 ? M.of(text) : M.empty();
};

/** Combine seasonM and episodeM */
export const seasonAndEpisodeM = ({
  seasonNumberM,
  episodeNumberM,
}: {
  seasonNumberM: M.Maybe<number>;
  episodeNumberM: M.Maybe<number>;
}) => {
  const season = M.maybe("", (s) => `S${s}`, seasonNumberM);
  const episode = M.maybe("", (e) => `E${e}`, episodeNumberM);
  const text = [season, episode].join(" ").trim();
  return text.length > 0 ? M.of(text) : M.empty();
};

/** @deprecated Use `<Clamp>` */
export const truncateText = (text: string, maxSize: number) =>
  text.length > maxSize ? `${text.substr(0, maxSize)}...` : text;
