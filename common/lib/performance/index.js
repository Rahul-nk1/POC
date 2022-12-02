var PerformanceMarkers;
(function (PerformanceMarkers) {
    PerformanceMarkers["request_start"] = "request_start";
    PerformanceMarkers["request_done"] = "request_done";
    PerformanceMarkers["app_load_time_start"] = "app_load_time_start";
    PerformanceMarkers["app_load_time_end"] = "app_load_time_end";
    PerformanceMarkers["render_start"] = "render_start";
    PerformanceMarkers["render_end"] = "render_end";
})(PerformanceMarkers || (PerformanceMarkers = {}));
const { performance: unsafePerformance } = window;
const safeMark = (mark) => {
    try {
        unsafePerformance.mark(mark === null || mark === void 0 ? void 0 : mark.toString());
    }
    catch (e) {
        console.warn(e);
    }
};
/* DO NOT remove the try-catch around performance.measure */
/*
  There is a "bug" in performance: if you call .measure() with a mark that does
  not exist, it will throw an error, and the site will break. This can be seen
  by clicking "Shows", then clicking "On Now" before "Shows" loads.
 */
const safeMeasure = (name, startMark, endMark) => {
    try {
        unsafePerformance.measure(name, startMark === null || startMark === void 0 ? void 0 : startMark.toString(), endMark === null || endMark === void 0 ? void 0 : endMark.toString());
    }
    catch (e) {
        console.warn(e);
    }
};
/* DO NOT remove the try-catch around performance.measure */
const safeGetEntriesByName = (name) => {
    try {
        return unsafePerformance.getEntriesByName(name);
    }
    catch (e) {
        console.warn(e);
        return [];
    }
};
const safeClearMarks = (mark) => {
    try {
        unsafePerformance.clearMarks(mark === null || mark === void 0 ? void 0 : mark.toString());
    }
    catch (e) {
        console.warn(e);
    }
};
const safeClearMeasures = () => {
    try {
        unsafePerformance.clearMeasures();
    }
    catch (e) {
        console.warn(e);
    }
};
/**
 * This enforces that we use only the try/catch-wrapoed versions of all
 * the performance functions, because Safari 10 does not support performance
 */
const performance = {
    measure: safeMeasure,
    mark: safeMark,
    getEntriesByName: safeGetEntriesByName,
    clearMarks: safeClearMarks,
    clearMeasures: safeClearMeasures,
};
export { performance, PerformanceMarkers };
//# sourceMappingURL=index.js.map