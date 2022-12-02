import { Fold } from "@discovery/prelude/lib/control/lens";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import { mkComponentMapItem } from "@discovery/template-engine/lib/component-map";
import { Reader } from "@discovery/common-tve/lib/reader";
import {
  _HeroImage,
  _LearnMoreList,
  _FaqLink,
  _HeroDescription,
  _HeroTitle,
  _LearnMoreTitle,
} from "./optics";
import { deriveAuthURL } from "../../../../utils/auth";
import {
  CampaignHero,
  Props as CampaignHeroProps,
} from "../../../../components/tve/organisms/campaign-hero";

type Props = Omit<CampaignHeroProps, "authURL">;

const getProps = (data: CollectionResponseData): Props => {
  const heroImageM = Fold.preview(_HeroImage, data);
  const titleM = Fold.preview(_HeroTitle, data);
  const descriptionM = Fold.preview(_HeroDescription, data);
  const learnMoreTitleM = Fold.view(_LearnMoreTitle, data);
  const faqLinkM = Fold.preview(_FaqLink, data);
  const learnMoreL = Fold.toList(_LearnMoreList, data);

  return {
    heroImageM,
    titleM,
    descriptionM,
    learnMoreTitleM,
    faqLinkM,
    learnMoreL,
  };
};

const mkCampaignHero = (reader: Reader) => {
  const { authURL } = deriveAuthURL(reader);
  return ({
    heroImageM,
    titleM,
    descriptionM,
    learnMoreTitleM,
    faqLinkM,
    learnMoreL,
  }: Props) => (
    <CampaignHero
      heroImageM={heroImageM}
      titleM={titleM}
      descriptionM={descriptionM}
      learnMoreTitleM={learnMoreTitleM}
      faqLinkM={faqLinkM}
      learnMoreL={learnMoreL}
      authURL={authURL}
    />
  );
};

export const ComponentMapItem = mkComponentMapItem(getProps, mkCampaignHero);
