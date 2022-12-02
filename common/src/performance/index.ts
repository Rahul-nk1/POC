enum PerformanceMarkers {
  "request_start" = "request_start",
  "request_done" = "request_done",
  "app_load_time_start" = "app_load_time_start",
  "app_load_time_end" = "app_load_time_end",
  "render_start" = "render_start",
  "render_end" = "render_end",
}

/**
 * This type makes sure that the `Performance` type follows the markers that
 * we define. It is normally typed as `string`
 */
type SafePerformance = Pick<Performance, "getEntriesByName"> & {
  mark?(mark: PerformanceMarkers): void;
  measure?(
    name: string,
    startMark?: PerformanceMarkers,
    endMark?: PerformanceMarkers
  ): void;
  clearMarks?(mark?: PerformanceMarkers): void;
  clearMeasures?(mark?: PerformanceMarkers): void;
};

const { performance: unsafePerformance }: { performance: Performance } = window;

const safeMark = (mark: PerformanceMarkers) => {
  try {
    unsafePerformance.mark(mark?.toString());
  } catch (e) {
    console.warn(e);
  }
};

/* DO NOT remove the try-catch around performance.measure */
/*
  There is a "bug" in performance: if you call .measure() with a mark that does
  not exist, it will throw an error, and the site will break. This can be seen
  by clicking "Shows", then clicking "On Now" before "Shows" loads.
 */
const safeMeasure = (
  name: string,
  startMark?: PerformanceMarkers,
  endMark?: PerformanceMarkers
) => {
  try {
    unsafePerformance.measure(name, startMark?.toString(), endMark?.toString());
  } catch (e) {
    console.warn(e);
  }
};
/* DO NOT remove the try-catch around performance.measure */

const safeGetEntriesByName = (name: string) => {
  try {
    return unsafePerformance.getEntriesByName(name);
  } catch (e) {
    console.warn(e);
    return [];
  }
};

const safeClearMarks = (mark?: PerformanceMarkers) => {
  try {
    unsafePerformance.clearMarks(mark?.toString());
  } catch (e) {
    console.warn(e);
  }
};

const safeClearMeasures = () => {
  try {
    unsafePerformance.clearMeasures();
  } catch (e) {
    console.warn(e);
  }
};

/**
 * This enforces that we use only the try/catch-wrapoed versions of all
 * the performance functions, because Safari 10 does not support performance
 */
const performance: SafePerformance = {
  measure: safeMeasure,
  mark: safeMark,
  getEntriesByName: safeGetEntriesByName,
  clearMarks: safeClearMarks,
  clearMeasures: safeClearMeasures,
};

export { performance, PerformanceMarkers };
