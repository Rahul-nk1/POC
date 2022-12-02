import * as M from "@discovery/prelude/lib/data/maybe";
import { Unpacked } from "@discovery/roadie";
import { State } from "./template-engine";

/**
 * This is a crude way of checking whether the user has a paid subscription and should be granted access to
 * the D+ site from the paywall. Sonic may re-design and provide a better solution in the near future.
 */
export const checkUserHasAccess = (
  user: NonNullable<Unpacked<State["userM"]>>
) =>
  M.fromMaybe(
    M.map(
      (packages) =>
        packages.includes("Free") &&
        packages.includes("Registered") &&
        packages.length >= 3,
      user.attributes.packages
    ),
    false
  );
