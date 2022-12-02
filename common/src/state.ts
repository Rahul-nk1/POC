import { Option, none } from "fp-ts/lib/Option";
import { Lens } from "@discovery/prelude/lib/control/lens";
import * as Users from "@discovery/sonic-api-ng/lib/api/users/me";
import { PageTemplate } from "./constants";

export type User = {
  id: string;
  attributes: Users.Attributes.Attributes;
};

export type Partner = {
  name: string;
  logoUrl: Option<string>;
  helpUrl: Option<string>;
  homeUrl: Option<string>;
  displayPriority: Option<number>;
  transparentLogoUrl: Option<string>;
};

export type GlobalState = {
  userM: Option<User>;
  partnerM: Option<Partner>;
  loggedIn: boolean;
  loginUrlM: Option<string>;
  idM: Option<string>;
  isPlayerPage: boolean;
  isSearchOpen: boolean;
  templateId: PageTemplate;
  isFavoritedGlobal: boolean;
  isFavoritedGlobalId: string;
};

// TODO: We should break out global state into Dplus and TVE equivalents.
export const initialState: GlobalState = {
  userM: none,
  partnerM: none,
  loggedIn: false,
  loginUrlM: none,
  idM: none,
  isPlayerPage: false,
  isSearchOpen: false,
  templateId: PageTemplate.Primary,
  isFavoritedGlobal: false,
  isFavoritedGlobalId: "",
};

export const _User = Lens.prop<GlobalState, "userM">("userM");

export const _Partner = Lens.prop<GlobalState, "partnerM">("partnerM");

export const _IsPlayerPage = Lens.prop<GlobalState, "isPlayerPage">(
  "isPlayerPage"
);

export const _IsSearchOpen = Lens.prop<GlobalState, "isSearchOpen">(
  "isSearchOpen"
);
