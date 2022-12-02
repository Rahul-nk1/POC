import { log } from "../setup";
import { EventTypes, } from "@discovery/clients-js-events-lib";
import { ActionTypes } from "@discovery/clients-js-events-lib/lib/VideoPlayer";
const triggerVideoPlayerEvent = (videoId) => {
    const data = {
        action: ActionTypes.START_CLICK,
        videoId,
    };
    return log({
        type: EventTypes.VIDEO_PLAYER,
        data,
    });
};
export { triggerVideoPlayerEvent };
//# sourceMappingURL=video-player.js.map