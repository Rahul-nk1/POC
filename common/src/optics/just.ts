import * as E from "@discovery/prelude/lib/data/either";
import * as M from "@discovery/prelude/lib/data/maybe";
import {
  Validated,
  fromValidate,
  validate,
  validationException,
} from "@discovery/prelude/lib/data/validated";

// TODO consider moving this into core.
export const just = <A>(t: Validated<A>): Validated<M.Just<A>> =>
  fromValidate((x) =>
    M.isMaybe(x)
      ? M.maybe(
          E.left(
            validationException(
              `Expected value to be a Just, it has type ${typeof x}.`
            )
          ),
          (value) =>
            E.map(
              (validated) => M.unsafeJust(validated) as M.Just<A>,
              validate(t, value)
            ),
          x
        )
      : E.left(
          validationException(
            `Expected value to be a Maybe, it has type ${typeof x}.`
          )
        )
  );
