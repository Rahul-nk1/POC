import * as M from "@discovery/prelude/lib/data/maybe";
import { VideoData } from "@discovery/sonic-api-ng/lib/api/content/videos/resource";

export const getProgressM = (attributes: VideoData["attributes"]) =>
  M.liftM(
    (position, completed, duration) => ({
      percent: (100 * position) / duration,
      completed,
    }),
    M.chain(({ position }) => position, attributes.viewingHistory),
    M.chain(({ completed }) => completed, attributes.viewingHistory),
    attributes.videoDuration
  );

export const getLiveProgressM = (attributes: VideoData["attributes"]) =>
  M.liftM(
    (scheduleStart, scheduleEnd) => {
      const timeLapsed =
        new Date().getTime() - new Date(scheduleStart).getTime();
      const duration =
        new Date(scheduleEnd).getTime() - new Date(scheduleStart).getTime();
      const percentage = (timeLapsed * 100) / duration;
      return {
        percent: Math.max(0, Math.min(100, percentage)),
        completed: false,
      };
    },
    attributes.scheduleStart,
    attributes.scheduleEnd
  );
