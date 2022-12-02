import { none } from "fp-ts/lib/Option";
import { Lens } from "@discovery/prelude/lib/control/lens";
import { PageTemplate } from "./constants";
// TODO: We should break out global state into Dplus and TVE equivalents.
export const initialState = {
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
export const _User = Lens.prop("userM");
export const _Partner = Lens.prop("partnerM");
export const _IsPlayerPage = Lens.prop("isPlayerPage");
export const _IsSearchOpen = Lens.prop("isSearchOpen");
//# sourceMappingURL=state.js.map