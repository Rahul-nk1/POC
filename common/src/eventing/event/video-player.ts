import { log } from "../setup";
import {
  EventTypes,
  VideoPlayerEventData,
} from "@discovery/clients-js-events-lib";
import { ActionTypes } from "@discovery/clients-js-events-lib/lib/VideoPlayer";

const triggerVideoPlayerEvent = (videoId: VideoPlayerEventData["videoId"]) => {
  const data: VideoPlayerEventData = {
    action: ActionTypes.START_CLICK,
    videoId,
  };

  return log({
    type: EventTypes.VIDEO_PLAYER,
    data,
  });
};

export { triggerVideoPlayerEvent };
