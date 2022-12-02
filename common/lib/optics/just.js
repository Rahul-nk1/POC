import * as E from "@discovery/prelude/lib/data/either";
import * as M from "@discovery/prelude/lib/data/maybe";
import { fromValidate, validate, validationException, } from "@discovery/prelude/lib/data/validated";
// TODO consider moving this into core.
export const just = (t) => fromValidate((x) => M.isMaybe(x)
    ? M.maybe(E.left(validationException(`Expected value to be a Just, it has type ${typeof x}.`)), (value) => E.map((validated) => M.unsafeJust(validated), validate(t, value)), x)
    : E.left(validationException(`Expected value to be a Maybe, it has type ${typeof x}.`)));
//# sourceMappingURL=just.js.map