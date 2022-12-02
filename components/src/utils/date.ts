import * as M from "@discovery/prelude/lib/data/maybe";
import { Milliseconds } from "@discovery/nominal-time-ng";
import { ms2Hmmss, padZero, format } from "@discovery/roadie";

export const getTime = (date: Date) =>
  `${padZero(date.getHours())}:${padZero(date.getMinutes())}`;

export const get12HourTimeMarkerM = (valueM: M.Maybe<Date>) =>
  M.map((value) => format(value, "a..aaa"), valueM);

export const toScheduleTime = (
  startM: M.Maybe<Date>,
  endM: M.Maybe<Date>
): M.Maybe<string> =>
  M.liftM2(
    (start, end) => `${start} - ${end}`,
    M.map(getTime, startM),
    M.map(getTime, endM)
  );

export const toDuration = (duration: Milliseconds): string =>
  ms2Hmmss(duration);

export const toDurationM = (
  durationM: M.Maybe<Milliseconds>
): M.Maybe<string> => M.map((value) => ms2Hmmss(value), durationM);

export const toShortDuration = (duration: Milliseconds): string => {
  const h = Math.floor(duration / 3600000);
  const m = duration < 60000 ? 1 : Math.floor((duration % 3600000) / 60000);
  return `${h ? `${h}h ` : ""}${m}m`;
};

export const toShortDurationM = (
  durationM: M.Maybe<Milliseconds>
): M.Maybe<string> => M.map(toShortDuration, durationM);

export const toAirDate = (date: Date) =>
  date.toLocaleDateString("en-us", { weekday: "short" });

export const toAirDateM = (dateM: M.Maybe<Date>) => M.map(toAirDate, dateM);

export const toFullDate = (date: Date) => date.toLocaleDateString("en-us");

export const toAirDateLongM = (dateM: M.Maybe<Date>) =>
  M.map(toFullDate, dateM);
