export declare enum SiteLookupKey {
    ahc = "ahc",
    apl = "apl",
    cook = "cook",
    dam = "dam",
    des = "des",
    dfc = "dfc",
    diy = "diy",
    dlf = "dlf",
    dsc = "dsc",
    dsf = "dsf",
    food = "food",
    hgtv = "hgtv",
    ids = "ids",
    own = "own",
    sci = "sci",
    tlc = "tlc",
    trav = "trav",
    vel = "vel"
}
export declare enum CharacterLimit {
    TITLE_LENGTH = 52,
    TUNE_IN_LENGTH = 40,
    SHORT_DESCRIPTION_LENGTH = 80,
    CTA_MAX_LENGTH = 17,
    LONG_DESCRIPTION_LENGTH = 300
}
export declare const getSiteLookupKeyM: (product?: string | undefined) => import("fp-ts/lib/Option").Option<SiteLookupKey>;
export declare const SITE_LOOKUP_KEY_M: import("fp-ts/lib/Option").Option<SiteLookupKey>;
export declare const DEFAULT_DECORATORS: readonly ["viewingHistory", "isFavorite", "playbackAllowed"];
export declare enum PageTemplate {
    Primary = "primary",
    Secondary = "secondary"
}
export declare const isPageTemplate: (id: string) => id is PageTemplate;
export declare const LEGAL_PAGES: string[];
//# sourceMappingURL=constants.d.ts.map