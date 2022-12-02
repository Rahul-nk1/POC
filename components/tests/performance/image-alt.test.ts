import b from "benny";
// import * as M from "@discovery/prelude/data/maybe"
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

const descM = O.none as O.Option<string>;
const titleM = O.some("foo");
const propM = O.some("baz");
const descN: string | undefined = undefined;
const titleN: string | undefined = "foo";
const propN: string | undefined = "baz";

const O_concat = O.getFirstMonoid<string>().concat;

b.suite(
  "Getting an image's alt attribute",
  b.add("using fp-ts/alt()", () =>
    O.alt(() => O.alt(() => propM)(titleM))(descM)
  ),
  b.add("native", () => descN ?? titleN ?? propN),
  b.add("using fp-ts/pipe() + alt()", () =>
    pipe(
      descM,
      O.alt(() => titleM),
      O.alt(() => propM)
    )
  ),
  b.add("using fp-ts/getFirstMonoid() ", () =>
    O_concat(descM, O_concat(titleM, propM))
  ),

  b.cycle(),
  b.complete()
);
