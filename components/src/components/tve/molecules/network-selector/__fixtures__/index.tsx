import * as L from "@discovery/prelude/lib/data/list";
import { NetworkSelector, Props } from "..";
import * as M from "@discovery/prelude/lib/data/maybe";
import { SubtabShimmer } from "../subtabs/SubtabShimmer";

const networkSelectorResponse = L.list(
  {
    imageM: M.empty(),
    titleM: M.of("All"),
    linkedCollectionId: "125973585162481324329562405209738737781",
    id: "tabbed-shows-page-toplevel-tab-all",
  },
  {
    imageM: M.of({
      alias: M.of("animal-planet"),
      kind: "logo",
      default: M.empty(),
      height: 128,
      width: 128,
      src:
        "https://us1-test-images.disco-api.com/2020/2/13/3a2f8ecc-ef8f-4de1-8135-61d544eeea5a.png",
      title: M.empty(),
      description: M.empty(),
      cropCenter: M.empty(),
    }),
    titleM: M.of("Animal Planet"),
    linkedCollectionId: "89313429572160353853984318857793486803",
    id: "tabbed-shows-page-toplevel-tab-animal-planet",
  },
  {
    imageM: M.of({
      alias: M.of("tlc-logo"),
      kind: "default",
      default: M.empty(),
      height: 150,
      width: 300,
      src:
        "https://us1-test-images.disco-api.com/2020/3/5/a3261778-8fd8-4239-83b4-92cca5e2121d.png",
      title: M.of("Tlc Logo"),
      description: M.of("The learning channel logo"),
      cropCenter: M.empty(),
    }),
    titleM: M.of("Tlc"),
    linkedCollectionId: "228436717810440461968617371472789138865",
    id: "tabbed-shows-page-toplevel-tab-tlc",
  }
);

// TODO: imageM above is not correct
const dummyNetworkSelectorTabs: Props["tabL"] = networkSelectorResponse;

export default {
  default: (
    <div
      style={{
        width: "70vw",
        height: "100%",
        margin: "2vw",
        backgroundColor: "black",
      }}
    >
      <NetworkSelector tabL={dummyNetworkSelectorTabs} />
    </div>
  ),
  "Subtab Shimmer": <SubtabShimmer />,
};
