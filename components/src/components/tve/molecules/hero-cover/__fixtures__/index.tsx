import * as M from "@discovery/prelude/lib/data/maybe";
import { HeroCover } from "../";
import * as Images from "@discovery/sonic-api-ng/lib/api/cms/images";
import { HeroTemplate } from "../../../../../site-builder/tve/components/hero";

const dummyImage: Images.Attributes.Attributes = {
  alias: M.empty(),
  cropCenter: M.empty(),
  default: M.of(false),
  description: M.empty(),
  height: 100,
  kind: "poster",
  src:
    "https://eu1-test-images.disco-api.com/2017/07/14/show-1279-1500036952880.jpg?w=1080&f=jpeg&p=true&q=75",
  title: M.empty(),
  width: 100,
};

export default {
  "Hero flavor - Basic": (
    <HeroCover
      templateId={HeroTemplate.Standard}
      coverImageM={M.of(dummyImage)}
      metadataViewM={M.empty()}
    />
  ),
  "Hero flavor - Compact": (
    <HeroCover
      templateId={HeroTemplate.Standard}
      coverImageM={M.of(dummyImage)}
      metadataViewM={M.empty()}
    />
  ),
};
