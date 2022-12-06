import { cn } from "@discovery/classnames"
import { Images } from "@discovery/sonic-api-ng/lib/api/cms"
import * as O from "fp-ts/Option"
import { MainContainer } from "../../atoms/main-container"
import { SonicImage } from "../../atoms/sonic-image"
import * as styles from "./style.css"
import { PromotionBannerMetaData } from "../../molecules/promotionBanner-metaData"

export type PromotionBannerProps = {
  componentIdM?: O.Option<string>
  titleM: O.Option<string>
  descriptionM: O.Option<string>
  promoBackgroundM: O.Option<Images.Attributes.Attributes>
  promoBackgroundMobileM: O.Option<Images.Attributes.Attributes>
  promoLogoM: O.Option<Images.Attributes.Attributes>
  promoLogoMobileM: O.Option<Images.Attributes.Attributes>
  promoSpectrumbarM: O.Option<Images.Attributes.Attributes>
  ctaM: O.Option<{
    title: string
    href: string
  }>
}

export const PromotionBanner = ({
  titleM,
  descriptionM,
  promoBackgroundM,
  promoBackgroundMobileM,
  promoLogoM,
  promoLogoMobileM,
  promoSpectrumbarM,
  ctaM
}: PromotionBannerProps) => {
  const iconSizeLarge = 1000
  if (O.isNone(promoBackgroundM)) {
    return null
  }
  return (
    <MainContainer classNameM={O.of(styles.bannerContainer)}>
      <div className={styles.container}>
        <PromotionBannerMetaData
          titleM={titleM}
          descriptionM={descriptionM}
          promoLogoM={promoLogoM}
          promoLogoMobileM={promoLogoMobileM}
          promoSpectrumbarM={promoSpectrumbarM}
          ctaM={ctaM}
        />
        {O.fold(
          () => {
            return <></>
          },
          (backgroundImage: Images.Attributes.Attributes) => {
            return (
              <SonicImage
                image={backgroundImage}
                format="PNG"
                className={cn(styles.cssCoverImage, styles.cssCoverImageDesktop)}
                fallbackImageSize={{ width: iconSizeLarge }}
              />
            )
          }
        )(promoBackgroundM)}

        {O.fold(
          () => {
            return <></>
          },
          (backgroundImageM: Images.Attributes.Attributes) => {
            return (
              <SonicImage
                image={backgroundImageM}
                format="PNG"
                className={cn(styles.cssCoverImage, styles.cssCoverImageMobile)}
                fallbackImageSize={{ width: iconSizeLarge }}
              />
            )
          }
        )(promoBackgroundMobileM)}
      </div>
    </MainContainer>
  )
}
