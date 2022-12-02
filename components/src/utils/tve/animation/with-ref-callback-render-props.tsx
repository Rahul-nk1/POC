import * as M from "@discovery/prelude/lib/data/maybe";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import "requestidlecallback-polyfill";

import { useValidNodeSet } from "./use-valid-node-set";

/**
 * What is this for?
 *   tldr: typesafety, reduced boilerplate, correct HTMLElement ref collection
 *
 * Because:
 *  - Less boilerplate:
 *      collecting refs, checking for their instantiation
 *
 *  - Animation Controller uniformity:
 *      all animations can conform to needing only <NodeNames, State>.
 *      it's good to have some conformity, and if it can be simple, then it
 *        will make sense across the codebase.
 *
 *  - Declarative:
 *      by returning a Component, we are saying: animate its children.
 *
 *  - Defining required references:
 *      defining refs is prone to errors, e.g. which one is being used:
 *        refCallbacks | ref objects | non-stateful refCallbacks.
 *
 *  - Enforcing required references (typesafety):
 *      this HOC provides typesafety when defining the node names. If the node
 *        refs are set up with the wrong names, or the refCallback functions
 *        are not used, TS will tell you exactly what's wrong.
 *
 *  - Enforcing required references (instantiation):
 *      reference nodes can be null if they aren't used correctly, and they are null before
 *      useEffect / componentDidMount
 *
 *
 *  But... is it performant?
 *   - All the variables are wrapped in memoized callbacks
 *   - The processing only happens on initial render, very little "extra"
 *       processing is done.
 */

/**
 * @TODO:
 *
 *   Better Generics:
 *       The <S> states type is not inferred. The other 2 generics are inferred
 *       correctly.
 *
 *       It is too cumbersome to write the definitions for all of them, and
 *       then including them like this:
 *         withRefCallBackRenderProps<StatesType, NodeNamesType, ControllerType>(...)
 *
 *       So it's currently being ommitted:
 *
 *         withRefCallBackRenderProps(...)
 *
 *       The desired API would require explicit S type only, like this:
 *
 *         withRefCallBackRenderProps<StatesType>(...)
 *
 *       So we're waiting on this PR to get merged in:
 *         https://github.com/microsoft/TypeScript/pull/26349 🧨
 */

export type ControllerProps = {
  nodes: Record<string, HTMLElement>;
  state: unknown;
};

/**
 *  usage:
 *
 *  const YourAnimation = withRefCallBackRenderProps(
 *    nodeNames: ReadOnlyArray<string>
 *    ({ nodes, state }) => {
 *      ...your animation logic
 *      ...can use any hooks you want to use
 *      ...can return any jsx you want to insert
 *    },
 *  );
 */
export const withRefCallbackRenderProps = <
  S extends unknown,
  T extends string,
  N extends { [K in T]: El },
  R extends { [K in T]: <El extends Element>(el: El | null) => void },
  El extends Element
>(
  nodeNames: ReadonlyArray<T>,
  Controller: React.FunctionComponent<{
    nodes: N;
    state: S;
  }>
) => ({ state, children }: { state: S; children(refCallbacks: R): void }) => {
  const [nodesM, nodeSetters] = useValidNodeSet<T, N, R>(nodeNames);

  return (
    <>
      {children(nodeSetters)}
      <RenderMaybe>
        {M.liftM(
          (nodes) => (
            <Controller nodes={nodes} state={state} />
          ),
          nodesM
        )}
      </RenderMaybe>
    </>
  );
};
