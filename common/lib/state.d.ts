import { Option } from "fp-ts/lib/Option";
import { Lens } from "@discovery/prelude/lib/control/lens";
import * as Users from "@discovery/sonic-api-ng/lib/api/users/me";
import { PageTemplate } from "./constants";
export declare type User = {
    id: string;
    attributes: Users.Attributes.Attributes;
};
export declare type Partner = {
    name: string;
    logoUrl: Option<string>;
    helpUrl: Option<string>;
    homeUrl: Option<string>;
    displayPriority: Option<number>;
    transparentLogoUrl: Option<string>;
};
export declare type GlobalState = {
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
export declare const initialState: GlobalState;
export declare const _User: Lens.Lens<GlobalState, Option<User>>;
export declare const _Partner: Lens.Lens<GlobalState, Option<Partner>>;
export declare const _IsPlayerPage: Lens.Lens<GlobalState, boolean>;
export declare const _IsSearchOpen: Lens.Lens<GlobalState, boolean>;
//# sourceMappingURL=state.d.ts.map