import { LinkKind } from "./../../atoms/link";

export enum MetadataFlavors {
  Basic = "basic",
  Compact = "compact",
}

export type MetaLink = {
  url: string;
  kind: LinkKind;
};
