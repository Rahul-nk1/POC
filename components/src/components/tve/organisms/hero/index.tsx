import * as M from "@discovery/prelude/lib/data/maybe";
import { ImageData } from "@discovery/sonic-api-ng/lib/api/cms/images/resource";

import { HeroCover, HeroCoverSizes } from "../../molecules/hero-cover";
import { HeroTemplate } from "../../../../site-builder/tve/components/hero";
import {
  GenericMetadata,
  GenericMetadataProps,
} from "../../molecules/hero-metadata";

type HeroProps = {
  coverImageM?: M.Maybe<ImageData["attributes"]>;
  mobileCoverImageM?: M.Maybe<ImageData["attributes"]>;
  templateId: HeroTemplate;
  metadata: GenericMetadataProps;
};

export const Hero = ({
  coverImageM,
  templateId,
  mobileCoverImageM,
  metadata,
}: HeroProps) => (
  <>
    <HeroCover
      coverImageM={coverImageM}
      templateId={templateId}
      mobileCoverImageM={mobileCoverImageM}
      metadataViewM={M.of(<GenericMetadata {...metadata} />)}
    />
  </>
);
