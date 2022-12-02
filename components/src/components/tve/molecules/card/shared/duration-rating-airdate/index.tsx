import { cn } from "@discovery/classnames";
import { Milliseconds } from "@discovery/nominal-time-ng";
import * as M from "@discovery/prelude/lib/data/maybe";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";

import { toShortDurationM, toAirDateLongM } from "../../../../../../utils/date";
import { span } from "../../../../../../utils/text";
import { P, Sizes, Weights } from "../../../../atoms/text";

import * as styles from "./styles.css";

export const DurationRatingAirdate = ({
  videoDurationM,
  ratingM,
  airDateM,
  publishStartM,
  className,
}: {
  videoDurationM: M.Maybe<Milliseconds>;
  ratingM: M.Maybe<string>;
  airDateM: M.Maybe<Date>;
  publishStartM: M.Maybe<Date>;
  className?: string;
}) => (
  <P
    size={Sizes.xs}
    weight={Weights.semiBold}
    className={cn(styles.durationRatingAirdate, className)}
  >
    <RenderMaybe>
      {M.map(span, toShortDurationM(videoDurationM))}
      {M.map(span, ratingM)}
      {M.map(span, toAirDateLongM(M.alt(airDateM, publishStartM)))}
    </RenderMaybe>
  </P>
);
