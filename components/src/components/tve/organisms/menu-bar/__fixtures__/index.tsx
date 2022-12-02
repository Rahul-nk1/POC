import * as M from "@discovery/prelude/lib/data/maybe";
import * as L from "@discovery/prelude/lib/data/list";
import { LinkKind } from "../../../atoms/link";
import { MenuBar } from "../";

const imageDefaultProps = {
  default: M.empty(),
  title: M.empty(),
  description: M.empty(),
  cropCenter: M.empty(),
};

const logo = {
  ...imageDefaultProps,
  alias: M.of("tlc-site-logo"),
  kind: "logo",
  height: 120,
  width: 249,
  src:
    "https://us1-test-images.disco-api.com/2020/3/31/78051c5e-b378-4696-82f1-69c93a86ebfd.png",
};

const links = [
  {
    iconMobileM: M.of({
      ...imageDefaultProps,
      alias: M.of("web-menu-item-shows-default"),
      src:
        "https://us1-test-images.disco-api.com/2020/3/31/798132f2-2a58-42ba-9ecc-91ca0503ba95.png",
      height: 132,
      width: 132,
      kind: "default",
    }),
    iconDesktopM: M.of({
      ...imageDefaultProps,
      alias: M.of("web-menu-item-shows-alternate"),
      src:
        "https://us1-test-images.disco-api.com/2020/4/7/ace1917d-8a41-4aba-8500-d6176a74e323.png",
      height: 88,
      width: 88,
      kind: "alternate",
    }),
    href: "/tabbed-shows",
    title: "Shows",
    kind: LinkKind.internal,
  },
  {
    iconMobileM: M.of({
      ...imageDefaultProps,
      alias: M.of("web-menu-item-live-now-default"),
      src:
        "https://us1-test-images.disco-api.com/2020/3/15/0eb53caf-52c9-483d-804f-ac7d5ca8dbaf.png",
      height: 128,
      width: 128,
      kind: "default",
    }),
    iconDesktopM: M.of({
      ...imageDefaultProps,
      alias: M.of("web-menu-item-live-now-alternate"),
      src:
        "https://us1-test-images.disco-api.com/2020/4/7/cdcf23d6-429c-4e95-9f6b-a49819b75d42.png",
      height: 88,
      width: 88,
      kind: "alternate",
    }),
    href: "/live-now",
    title: "On Now",
    kind: LinkKind.internal,
  },
];

export default {
  default: (
    <MenuBar
      loggedIn={true}
      authURL={() => ""}
      linksL={L.from(links)}
      logoM={M.of(logo)}
      mobileLogoM={M.of(logo)}
      partnerM={M.of({
        transparentLogoUrl: M.empty(),
        displayPriority: M.empty(),
        helpUrl: M.empty(),
        homeUrl: M.empty(),
        logoUrl: M.empty(),
        name: "Xfinity",
      })}
      user={{
        nameM: M.empty(),
        loggedIn: false,
        idM: M.empty(),
      }}
      baseURL={""}
    />
  ),
};
