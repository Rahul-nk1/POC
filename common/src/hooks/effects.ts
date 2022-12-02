import { useEffect } from ".";
import { Dependencies } from "@discovery/orchestra/lib/dependencies";

/** Run `f` when the component mounts, and if provided, when `deps` have changed. */
export const useEffectStart = (f: VoidFunction, deps: Dependencies = []) =>
  useEffect(f, deps); // eslint-disable-line react-hooks/exhaustive-deps

/** Run `f` when the component unmounts, and if `deps` are provided,
 * on effect cleanup: {@link https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect}. */
export const useEffectCleanup = (f: VoidFunction, deps: Dependencies = []) =>
  useEffect(() => f, deps); // eslint-disable-line react-hooks/exhaustive-deps
