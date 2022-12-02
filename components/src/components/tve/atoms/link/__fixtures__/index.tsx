import { Link, LinkKind } from "../";

const props = {
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
  "internal link": (
    <Link href={props.internal.href} kind={props.internal.kind}>
      {props.internal.title}
    </Link>
  ),
  "external link": (
    <Link href={props.external.href} kind={props.external.kind}>
      {props.external.title}
    </Link>
  ),
  "open in new window": (
    <Link
      href={props.external.href}
      kind={props.external.kind}
      openInNewWindow={true}
    >
      {props.external.title}
    </Link>
  ),
  "custom onClick handler": (
    <Link
      href={props.external.href}
      kind={props.external.kind}
      onClick={props.handleClick}
    >
      {props.external.title}
    </Link>
  ),
};
