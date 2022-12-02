declare enum PerformanceMarkers {
    "request_start" = "request_start",
    "request_done" = "request_done",
    "app_load_time_start" = "app_load_time_start",
    "app_load_time_end" = "app_load_time_end",
    "render_start" = "render_start",
    "render_end" = "render_end"
}
/**
 * This type makes sure that the `Performance` type follows the markers that
 * we define. It is normally typed as `string`
 */
declare type SafePerformance = Pick<Performance, "getEntriesByName"> & {
    mark?(mark: PerformanceMarkers): void;
    measure?(name: string, startMark?: PerformanceMarkers, endMark?: PerformanceMarkers): void;
    clearMarks?(mark?: PerformanceMarkers): void;
    clearMeasures?(mark?: PerformanceMarkers): void;
};
/**
 * This enforces that we use only the try/catch-wrapoed versions of all
 * the performance functions, because Safari 10 does not support performance
 */
declare const performance: SafePerformance;
export { performance, PerformanceMarkers };
//# sourceMappingURL=index.d.ts.map