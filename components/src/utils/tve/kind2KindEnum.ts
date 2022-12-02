import { Attributes } from "@discovery/sonic-api-ng/lib/api/cms/links";
import { LinkKind } from "../../components/tve/atoms/link";

export const kind2KindEnum = (
  kind: Attributes.Attributes["kind"]
): LinkKind => {
  switch (kind) {
    case "External Link":
      return LinkKind.external;
    case "Iframe":
      return LinkKind.iframe;
    case "Internal Link":
    default:
      return LinkKind.internal;
  }
};
