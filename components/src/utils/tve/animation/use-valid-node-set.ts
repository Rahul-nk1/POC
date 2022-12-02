import * as M from "@discovery/prelude/lib/data/maybe";
import {
  useCallback,
  useState,
  useMemo,
} from "@discovery/common-tve/lib/hooks";

/**
 * Gathers HTMLElements
 * Accepts ...nodeNames<string[]>
 * Returns [nodes, nodeSetters]
 *   nodes = null | a complete map of {name -> HTMLElement}
 *   nodeSetters = a complete map of {name -> refCallback()}
 */
export const useValidNodeSet = <
  T extends string,
  N extends { [K in T]: Element },
  R extends { [K in T]: <El extends Element>(el: El) => void }
>(
  nodeNames: ReadonlyArray<T>
) => {
  const [nodes, setNodes] = useState({} as N);

  /* Create 1 pair: { name: refCallback() } */
  const createNodeSetter = useCallback(
    (name: keyof N) => ({
      [name]: (el: Element) => {
        // only update state if node changed
        if (nodes[name] !== el) {
          // use previousState spread, so all updates can occur in same loop
          setNodes((others) => ({ ...others, [name]: el }));
        }
      },
    }),
    [nodes, setNodes]
  );

  const nodeSetters = useMemo(
    () => Object.assign({}, ...nodeNames.map(createNodeSetter)),
    [createNodeSetter, nodeNames]
  ) as R;

  const nodesM = useMemo(() => {
    const valid = nodeNames.every((n) => Boolean(nodes[n]));
    return valid ? M.of(nodes) : M.empty();
  }, [nodeNames, nodes]);

  return [nodesM, nodeSetters] as const;
};
