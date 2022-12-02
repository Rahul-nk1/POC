import * as M from "@discovery/prelude/lib/data/maybe";
import * as Images from "@discovery/sonic-api-ng/lib/api/cms/images";
import { LinkImage } from "../";
import { LinkKind } from "../../link";

const DEFAULT_IMAGE = {
  src:
    "https://api.discovery.com/v1/images/589c8fc86b66d1357608313f?aspectRatio=original&width=105&height=&key=3020a40c2356a645b4b4",
  width: 105,
  height: 95,
};

const image: Images.Attributes.Attributes = {
  ...DEFAULT_IMAGE,
  alias: M.empty(),
  cropCenter: M.empty(),
  description: M.empty(),
  default: M.empty(),
  kind: "default",
  title: M.empty(),
};

const props = {
  image,
  internal: {
    href: "/shows",
    kind: LinkKind.internal,
    title: "Internal Link",
  },
  external: {
    href: "//www.discovery.com",
    kind: LinkKind.external,
    title: "Visit Discovery.com",
  },
  handleClick: () => {
    alert("clicked!");
  },
};

export default {
  "internal link + image": (
    <LinkImage
      image={props.image}
      href={props.internal.href}
      kind={props.internal.kind}
    >
      <>{props.internal.title}</>
    </LinkImage>
  ),
  "image link only": (
    <LinkImage
      image={props.image}
      imageSizes={{ default: [props.image.width, "px"] }}
      href={props.internal.href}
      kind={props.internal.kind}
    />
  ),
  "image link + click handler": (
    <LinkImage
      image={props.image}
      imageSizes={{ default: [props.image.width, "px"] }}
      href={props.external.href}
      kind={props.external.kind}
      onClick={props.handleClick}
    />
  ),
  "image link + new window": (
    <LinkImage
      image={props.image}
      imageSizes={{ default: [props.image.width, "px"] }}
      href={props.external.href}
      kind={props.external.kind}
      openInNewWindow={true}
    />
  ),
};
