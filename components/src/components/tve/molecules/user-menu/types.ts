import * as M from "@discovery/prelude/lib/data/maybe";
import * as Partners from "@discovery/sonic-api-ng/lib/api/users/partners";

// Types shared between multiple sub components
export type User = {
  nameM: M.Maybe<string>;
  loggedIn: boolean;
};

export type PartnerM = M.Maybe<Partners.Attributes.Attributes>;
