import { EventDataProvider } from "@discovery/common-tve/src/eventing"
import { Fold } from "@discovery/prelude/lib/control/lens"
import * as Optics from "@discovery/sonic-api-ng-optics"
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource"
import { mkComponentMapItem } from "@discovery/template-engine/lib/component-map"

import {
  PromotionBanner as PromoBanner,
  PromotionBannerProps
} from "../../../../components/tve/organisms/promotoin-banner"
import {
  _CTALink,
  _PromoBanner,
  _PromoBannerLogo,
  _PromoBannerLogoMobile,
  _PromoBannerMobile,
  _PromoBannerSpectrumBar
} from "./optic"

const getProps = (data: CollectionResponseData) => {
  const componentIdM = Fold.preview(Optics._Col2ComponentId, data)
  const titleM = Fold.view(Optics._ColAttributes2Title, data)
  const descriptionM = Fold.view(Optics._ColAttributes2Description, data)
  const promoBackgroundM = Fold.preview(_PromoBanner, data)
  const promoBackgroundMobileM = Fold.preview(_PromoBannerMobile, data)
  const promoLogoM = Fold.preview(_PromoBannerLogo, data)
  const promoLogoMobileM = Fold.preview(_PromoBannerLogoMobile, data)
  const promoSpectrumbarM = Fold.preview(_PromoBannerSpectrumBar, data)
  const ctaM = Fold.preview(_CTALink, data)

  return {
    componentIdM,
    titleM,
    descriptionM,
    promoBackgroundM,
    promoBackgroundMobileM,
    promoLogoM,
    promoLogoMobileM,
    promoSpectrumbarM,
    ctaM
  }
}

export const PromotionBanner = (props: PromotionBannerProps) => (
  <EventDataProvider componentIdM={props.componentIdM}>
    <PromoBanner {...props} />
  </EventDataProvider>
)

export const ComponentMapItem = mkComponentMapItem(getProps, () => PromotionBanner)
