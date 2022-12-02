import * as ImgUtils from "@discovery/components-luna/lib/utils/image";
import * as styles from "./styles.css";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { Typography } from "@discovery/theming";
import { Translations } from "@discovery/components-luna/lib/components/translations";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as L from "@discovery/prelude/lib/data/list";
import { Button } from "../../atoms/button";
import translations from "./translations/keys.json";
import { cn } from "@discovery/classnames";
import { MainContainer } from "../../atoms/main-container";
import { Chevron } from "../../atoms/icons";
import { useState } from "@discovery/common-tve/lib/hooks";
import { LinkKind } from "../../atoms/link";

export type Props = {
  titleM: M.Maybe<string>;
  descriptionM: M.Maybe<string>;
  learnMoreTitleM: M.Maybe<string>;
  heroImageM: M.Maybe<string>;
  learnMoreL: L.List<{
    src: string;
    titleM?: M.Maybe<string>;
    descriptionM?: M.Maybe<string>;
  }>;
  faqLinkM: M.Maybe<{
    href: string;
    text: string;
    description: string;
  }>;
  authURL: (path: string) => string;
};

export const CampaignHero = ({
  titleM,
  heroImageM,
  descriptionM,
  learnMoreTitleM,
  faqLinkM,
  learnMoreL,
  authURL,
}: Props) => {
  const style = M.foldMapConst(
    (heroImage: string): Record<string, string> => ({
      backgroundImage: `url(${heroImage})`,
    }),
    {},
    heroImageM
  );
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      style={style}
      className={cn(styles.wrapper, { [styles.collapsed]: !isActive })}
    >
      <MainContainer>
        <RenderMaybe>
          {M.map(
            (title) => (
              <Typography.H1>{title}</Typography.H1>
            ),
            titleM
          )}
          {M.map(
            (description) => (
              <Typography.SubHeader3 className={styles.subHeader}>
                {description}{" "}
                <a
                  tabIndex={0}
                  href=""
                  className={styles.primaryLink}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsActive(!isActive);
                  }}
                >
                  <Translations
                    importP={(lang: string) =>
                      import(`./translations/${lang}/keys.json`)
                    }
                    fallbackImport={translations}
                  >
                    {(lookup) => lookup("campaignHero.learnMore")}
                  </Translations>
                  <Chevron
                    className={cn(styles.chevron, {
                      [styles.activeChevron]: isActive,
                    })}
                  />
                </a>
              </Typography.SubHeader3>
            ),
            descriptionM
          )}
        </RenderMaybe>

        <Translations
          importP={(lang: string) => import(`./translations/${lang}/keys.json`)}
          fallbackImport={translations}
        >
          {(lookup) => {
            const text = lookup("campaignHero.subscribe");
            return (
              <Button
                className={cn(M.of(styles.subscribeButton))}
                linkM={M.of(authURL("login-affiliates"))}
                kind={LinkKind.external}
                label={text}
              />
            );
          }}
        </Translations>
        {isActive && (
          <div className={styles.subscriptionIncluded}>
            <RenderMaybe>
              {M.map(
                (title) => (
                  <Typography.SubHeader3 className={styles.learnMoreTitle}>
                    <span>{title}</span>
                  </Typography.SubHeader3>
                ),
                learnMoreTitleM
              )}
            </RenderMaybe>
            <div className={cn(M.of(styles.logos))}>
              {L.toArray(
                L.mapWithIndex(
                  (
                    index,
                    { src, titleM = M.empty(), descriptionM = M.empty() }
                  ) => (
                    <li key={index}>
                      <img
                        // TODO: Use <SonicImage>
                        src={ImgUtils.resizeH(40, src)}
                      />
                      <RenderMaybe>
                        {M.map(
                          (title) => (
                            <Typography.H3>{title}</Typography.H3>
                          ),
                          titleM
                        )}
                        {M.map(
                          (description) => (
                            <Typography.SubHeader2>
                              {description}
                            </Typography.SubHeader2>
                          ),
                          descriptionM
                        )}
                      </RenderMaybe>
                    </li>
                  ),
                  learnMoreL
                )
              )}
            </div>
            <RenderMaybe>
              {M.map(
                ({ href, text, description }) => (
                  <Typography.Paragraph className={styles.faq}>
                    {description}
                    <div className={styles.divider} />
                    <a href={href} className={styles.primaryLink}>
                      {text}
                    </a>
                  </Typography.Paragraph>
                ),
                faqLinkM
              )}
            </RenderMaybe>
          </div>
        )}
      </MainContainer>
    </div>
  );
};
