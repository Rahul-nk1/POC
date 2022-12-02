import * as M from "@discovery/prelude/lib/data/maybe";

export enum SiteLookupKey {
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
  vel = "vel",
}

export enum CharacterLimit {
  TITLE_LENGTH = 52,
  TUNE_IN_LENGTH = 40,
  SHORT_DESCRIPTION_LENGTH = 80,
  CTA_MAX_LENGTH = 17,
  LONG_DESCRIPTION_LENGTH = 300,
}

export const getSiteLookupKeyM = (product?: string) =>
  product && product in SiteLookupKey
    ? M.of(product as SiteLookupKey)
    : M.empty();

export const SITE_LOOKUP_KEY_M = getSiteLookupKeyM(process.env.PRODUCT);

export const DEFAULT_DECORATORS = [
  "viewingHistory",
  "isFavorite",
  "playbackAllowed",
] as const;

export enum PageTemplate {
  Primary = "primary",
  Secondary = "secondary",
}

export const isPageTemplate = (id: string): id is PageTemplate =>
  Object.values(PageTemplate).includes(id as PageTemplate);

// On these paths, mobile roadblock page will not be shown
export const LEGAL_PAGES = [
  "/terms",
  "/gift-terms-conditions",
  "/visitor-agreement",
];
