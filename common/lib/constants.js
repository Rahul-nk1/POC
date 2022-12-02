import * as M from "@discovery/prelude/lib/data/maybe";
export var SiteLookupKey;
(function (SiteLookupKey) {
    SiteLookupKey["ahc"] = "ahc";
    SiteLookupKey["apl"] = "apl";
    SiteLookupKey["cook"] = "cook";
    SiteLookupKey["dam"] = "dam";
    SiteLookupKey["des"] = "des";
    SiteLookupKey["dfc"] = "dfc";
    SiteLookupKey["diy"] = "diy";
    SiteLookupKey["dlf"] = "dlf";
    SiteLookupKey["dsc"] = "dsc";
    SiteLookupKey["dsf"] = "dsf";
    SiteLookupKey["food"] = "food";
    SiteLookupKey["hgtv"] = "hgtv";
    SiteLookupKey["ids"] = "ids";
    SiteLookupKey["own"] = "own";
    SiteLookupKey["sci"] = "sci";
    SiteLookupKey["tlc"] = "tlc";
    SiteLookupKey["trav"] = "trav";
    SiteLookupKey["vel"] = "vel";
})(SiteLookupKey || (SiteLookupKey = {}));
export var CharacterLimit;
(function (CharacterLimit) {
    CharacterLimit[CharacterLimit["TITLE_LENGTH"] = 52] = "TITLE_LENGTH";
    CharacterLimit[CharacterLimit["TUNE_IN_LENGTH"] = 40] = "TUNE_IN_LENGTH";
    CharacterLimit[CharacterLimit["SHORT_DESCRIPTION_LENGTH"] = 80] = "SHORT_DESCRIPTION_LENGTH";
    CharacterLimit[CharacterLimit["CTA_MAX_LENGTH"] = 17] = "CTA_MAX_LENGTH";
    CharacterLimit[CharacterLimit["LONG_DESCRIPTION_LENGTH"] = 300] = "LONG_DESCRIPTION_LENGTH";
})(CharacterLimit || (CharacterLimit = {}));
export const getSiteLookupKeyM = (product) => product && product in SiteLookupKey
    ? M.of(product)
    : M.empty();
export const SITE_LOOKUP_KEY_M = getSiteLookupKeyM(process.env.PRODUCT);
export const DEFAULT_DECORATORS = [
    "viewingHistory",
    "isFavorite",
    "playbackAllowed",
];
export var PageTemplate;
(function (PageTemplate) {
    PageTemplate["Primary"] = "primary";
    PageTemplate["Secondary"] = "secondary";
})(PageTemplate || (PageTemplate = {}));
export const isPageTemplate = (id) => Object.values(PageTemplate).includes(id);
// On these paths, mobile roadblock page will not be shown
export const LEGAL_PAGES = [
    "/terms",
    "/gift-terms-conditions",
    "/visitor-agreement",
];
//# sourceMappingURL=constants.js.map