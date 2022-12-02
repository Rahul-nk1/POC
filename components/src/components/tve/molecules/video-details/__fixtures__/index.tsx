import * as M from "@discovery/prelude/lib/data/maybe";
import { Milliseconds } from "@discovery/nominal-time-ng";

import { VideoDetails } from "../";

export default {
  "All attributes": (
    <VideoDetails
      titleM={M.of("Cycling: Paris Nice. Gear up for a fascinating race")}
      descriptionM={M.of(
        `Gear up for a fascinating “Race to the Sun"! See stage 2 of racing and have an opportunity to see which riders are in the best form.`
      )}
      videoTypeM={M.of("EPISODE")}
      videoDurationM={M.of(123123123 as Milliseconds)}
      ratingM={M.of("TV-14")}
      airDateM={M.of(new Date())}
      publishStartM={M.of(new Date())}
      seasonNumberM={M.of(1)}
      episodeNumberM={M.of(1)}
      isFavoriteM={M.of(false)}
      isEpisode={true}
    />
  ),
  "Missing sport": (
    <VideoDetails
      titleM={M.of("Cycling: Paris Nice")}
      descriptionM={M.of(
        `Gear up for a fascinating “Race to the Sun"! See stage 2 of racing and have an opportunity to see which riders are in the best form.`
      )}
    />
  ),
  "Missing start time": (
    <VideoDetails
      titleM={M.of("Cycling: Paris Nice")}
      descriptionM={M.of(
        `Gear up for a fascinating “Race to the Sun"! See stage 2 of racing and have an opportunity to see which riders are in the best form.`
      )}
    />
  ),
  "Missing event": (
    <VideoDetails
      titleM={M.of("Cycling: Paris Nice")}
      descriptionM={M.of(
        `Gear up for a fascinating “Race to the Sun"! See stage 2 of racing and have an opportunity to see which riders are in the best form.`
      )}
    />
  ),
  "Missing channel and description": (
    <VideoDetails titleM={M.of("Cycling: Paris Nice")} />
  ),
  "Missing leg": (
    <VideoDetails
      titleM={M.of("Cycling: Paris Nice")}
      descriptionM={M.of(
        `Gear up for a fascinating “Race to the Sun"! See stage 2 of racing and have an opportunity to see which riders are in the best form.`
      )}
    />
  ),
};
