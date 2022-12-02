import * as RD from "@discovery/prelude/lib/data/remote-data";
import * as M from "@discovery/prelude/lib/data/maybe";

import { GenericMetadataProps } from "../../../molecules/hero-metadata";
import { Hero } from "../";
import { HeroKind, HeroProps, CompactMetadataProps } from "../types";
import { HeroTemplate } from "../../../../../site-builder/tve/components/hero";

const metadata: GenericMetadataProps | CompactMetadataProps = {
  plateTitleM: M.of("Wahlgrens värld"),
  plateDescriptionM: M.of(
    "Pernilla Wahlgren och hennes färgstarka familj i ett öppenhjärtigt och personligt porträtt där allt kan hända, känslorna går på högvarv och ingen dag är den andra lik. Det är fokus på Pernilla och Bianca, men vi träffar även andra i klanen Wahlgren."
  ),
  plateLinkM: M.empty(),
  plateCtaM: M.empty(),
  channelNameM: M.of("Kanal 5"),
  isLiveM: M.of(true),
  // packages: [],
  kind: HeroKind.Channel,
  tuneInTextM: M.of("Season"),
  showLogoM: M.empty(),
  activeVideoForShowMRD: RD.success(M.empty()),
  locked: false,
};

export const props = (
  metadata: GenericMetadataProps
): Omit<HeroProps, "heroType"> => ({
  coverImageM: M.empty(),
  templateId: HeroTemplate.Standard,
  metadataM: M.of(metadata),
});

export default <Hero {...props(metadata)} />;
