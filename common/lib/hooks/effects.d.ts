import { Dependencies } from "@discovery/orchestra/lib/dependencies";
/** Run `f` when the component mounts, and if provided, when `deps` have changed. */
export declare const useEffectStart: (f: VoidFunction, deps?: Dependencies) => void;
/** Run `f` when the component unmounts, and if `deps` are provided,
 * on effect cleanup: {@link https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect}. */
export declare const useEffectCleanup: (f: VoidFunction, deps?: Dependencies) => void;
//# sourceMappingURL=effects.d.ts.map