export declare type ScrollPosition = {
    width: number;
    height: number;
    x: number;
    y: number;
};
export declare type ScrollHookProps = {
    handleScroll: (pos: ScrollPosition) => void;
    minScrollDistance: number;
};
export declare const useScroll: ({ handleScroll, minScrollDistance, }: ScrollHookProps) => {
    currentPos: import("@discovery/orchestra/lib/dependencies").Reference<ScrollPosition>;
};
/**
 * this fake component is needed to wrap the hooks required to
 * conditionally fire `useScroll` --
 *
 * since hooks have to run every time a component renders,
 * and be on the top-level of a given component,
 * we can wrap the hooks in a component and
 * conditionally mount it in its parent
 */
export declare const ScrollHandler: ({ handleScroll, minScrollDistance, }: ScrollHookProps) => JSX.Element;
//# sourceMappingURL=scroll.d.ts.map