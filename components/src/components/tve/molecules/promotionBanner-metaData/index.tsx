import { cn } from "@discovery/classnames"
import { SonicImage } from "../../atoms/sonic-image"
import * as O from "fp-ts/Option"
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe"
import { Button, ButtonType } from "../../atoms/button"
import { LinkKind } from "../../atoms/link"
import { H3, Kinds, P, Sizes } from "../../atoms/text"
import { Images } from "@discovery/sonic-api-ng/lib/api/cms"
import * as styles from "./styles.css"

type promotionBannerMetadtaProps = {
  titleM: O.Option<string>
  descriptionM: O.Option<string>
  promoLogoM: O.Option<Images.Attributes.Attributes>
  promoLogoMobileM: O.Option<Images.Attributes.Attributes>
  promoSpectrumbarM: O.Option<Images.Attributes.Attributes>
  ctaM: O.Option<{
    title: string
    href: string
  }>
}

export const PromotionBannerMetaData = (props: promotionBannerMetadtaProps) => {
  const iconSizeLarge = 1000
  return (
    <div className={styles.metadataContainer}>
      {O.fold(
        () => {
          return <></>
        },
        (promoLogo: Images.Attributes.Attributes) => {
          return (
            <SonicImage
              image={promoLogo}
              format="PNG"
              className={cn(styles.logo, styles.logoDesktop)}
              fallbackImageSize={{ width: iconSizeLarge }}
            />
          )
        }
      )(props.promoLogoM)}
      {O.fold(
        () => {
          return <></>
        },
        (logo: Images.Attributes.Attributes) => {
          return (
            <SonicImage
              image={logo}
              format="PNG"
              className={cn(styles.logo, styles.logoMobile)}
              fallbackImageSize={{ width: iconSizeLarge }}
            />
          )
        }
      )(props.promoLogoMobileM)}
      <H3 size={Sizes.l} kind={Kinds.section} className={styles.title}>
        <RenderMaybe>{props.titleM}</RenderMaybe>
      </H3>
      <SonicImage
        image={O.getOrElse(() => ({} as Images.Attributes.Attributes))(props.promoSpectrumbarM)}
        format="PNG"
        fallbackImageSize={{ width: 700 }}
        className={styles.promoSpectrumBar}
      />
      <P kind={Kinds.body} size={Sizes.m} className={styles.description}>
        <RenderMaybe>{props.descriptionM}</RenderMaybe>
      </P>
      {O.fold(
        () => <></>,
        (data: { title: string; href: string }) => (
          <Button
            label={data.title}
            linkM={O.of(data.href)}
            type={ButtonType.contained}
            kind={LinkKind.external}
            openInNewWindow={true}
            className={styles.ctaButton}
            textClassName={styles.ctaButtonText}
          />
        )
      )(props.ctaM)}
    </div>
  )
}
