import { cn } from "@discovery/classnames";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { Images } from "@discovery/sonic-api-ng/lib/api/cms";
import * as O from "fp-ts/Option";
import * as M from "@discovery/prelude/lib/data/maybe";
import { Button, ButtonType } from "../../atoms/button";
import { MainContainer } from "../../atoms/main-container";
import { H3, Kinds, P, Sizes, Span } from "../../atoms/text";
import { SonicImage } from "../../atoms/sonic-image";
import { Link, LinkKind } from "../../atoms/link";
import { readInt } from "../../../../utils/number";
import * as styles from "./style.css";

export type PromotionBannerProps = {
  componentIdM?: O.Option<string>;
  titleM: O.Option<string>;
  descriptionM: O.Option<string>;
  promoBackgroundM: O.Option<Images.Attributes.Attributes>;
  promoBackgroundMobileM: O.Option<Images.Attributes.Attributes>;
  promoLogoM: O.Option<Images.Attributes.Attributes>;
  promoLogoMobileM: O.Option<Images.Attributes.Attributes>;
  promoSpectrumbarM: O.Option<Images.Attributes.Attributes>;
  ctaM: O.Option<{
    title: string;
    href: string;
  }>;
};

export const PromotionBanner = ({
  titleM,
  descriptionM,
  promoBackgroundM,
  promoBackgroundMobileM,
  promoLogoM,
  promoLogoMobileM,
  promoSpectrumbarM,
  ctaM,
}: PromotionBannerProps) => {
  const iconSizeLarge = 1000;
  if (O.isNone(promoBackgroundM)) {
    return null;
  }
  return (
    <MainContainer classNameM={O.of(styles.bannerContainer)}>
      <div className={styles.container}>
        <div className={styles.metadataContainer}>
          <SonicImage
            image={O.getOrElse(() => ({} as Images.Attributes.Attributes))(
              promoLogoM
            )}
            format="PNG"
            className={cn(styles.logo, styles.logoDesktop)}
            fallbackImageSize={{ width: iconSizeLarge }}
          />
          <SonicImage
            image={O.getOrElse(() => ({} as Images.Attributes.Attributes))(
              promoLogoMobileM
            )}
            format="PNG"
            className={cn(styles.logo, styles.logoMobile)}
            fallbackImageSize={{ width: iconSizeLarge }}
          />
          <H3 size={Sizes.l} kind={Kinds.section} className={styles.title}>
            <RenderMaybe>{titleM}</RenderMaybe>
          </H3>
          <SonicImage
            image={O.getOrElse(() => ({} as Images.Attributes.Attributes))(
              promoSpectrumbarM
            )}
            format="PNG"
            fallbackImageSize={{ width: 700 }}
            className={styles.promoSpectrumBar}
          ></SonicImage>
          <P kind={Kinds.body} size={Sizes.m} className={styles.description}>
            <RenderMaybe>{descriptionM}</RenderMaybe>
          </P>
          {console.log(descriptionM)}
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
          )(ctaM)}
        </div>

        <SonicImage
          image={O.getOrElse(() => ({} as Images.Attributes.Attributes))(
            promoBackgroundM
          )}
          format="PNG"
          className={cn(styles.cssCoverImage, styles.cssCoverImageDesktop)}
          fallbackImageSize={{ width: iconSizeLarge }}
        />
        <SonicImage
          image={O.getOrElse(() => ({} as Images.Attributes.Attributes))(
            promoBackgroundMobileM
          )}
          format="PNG"
          className={cn(styles.cssCoverImage, styles.cssCoverImageMobile)}
          fallbackImageSize={{ width: iconSizeLarge }}
        />
      </div>
    </MainContainer>
  );
};
