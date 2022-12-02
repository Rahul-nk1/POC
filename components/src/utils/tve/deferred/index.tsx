/**
 * `Deferred` re-composes a Promise to allow it to be called externally
 *  - the type definitions for `resolve` and `reject` were copied
 *    from the internal (new Promise((resolve, reject) => ())) parameters
 *
 *  - due to TypeScript, a simpler implementation is infeasible, such as -
 *
 *    let res, rej;
 *    const p = new Promise((resolve, reject) => {
 *      res = resolve;
 *      rej = reject;
 *    });
 *    p.resolve = res;    <- triggers a "variable used before declared" error
 *    p.reject = rej;     <- also violates the `Promise` type structure
 *
 *  -> so we implement an intermediate promise as well as a bespoke data object
 *    - as a result, `Deferred` is an async function
 *
 *  -> to utilise this in a component, wrap the `await` call in an intermediate function, which is wrapped inside a `useEffect` hook -
 *
 *    useEffect(() => {
 *      const f = async () => {
 *        const bar = await Deferred();
 *        ...
 *        <
 *          possibly set `bar` in a `useState` hook to re-render the component
 *          when this resolves
 *        >
 *      };
 *      f();
 *    }, [deps]);
 */

export type DeferredType<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export const Deferred = async <T,>() => {
  let resolve: DeferredType<T>["resolve"], reject: DeferredType<T>["reject"];

  type initType<T> = {
    resolve: DeferredType<T>["resolve"];
    reject: DeferredType<T>["reject"];
  };

  let initResolve: DeferredType<initType<T>>["resolve"];

  const init = new Promise<initType<T>>((_resolve, _reject) => {
    initResolve = _resolve;
  });

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;

    initResolve({
      resolve,
      reject,
    });
  });

  return init.then(
    ({ resolve, reject }) =>
      ({
        promise,
        resolve,
        reject,
      } as DeferredType<T>)
  );
};
