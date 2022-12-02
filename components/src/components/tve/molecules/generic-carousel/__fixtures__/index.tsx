import * as M from "@discovery/prelude/lib/data/maybe";
import * as L from "@discovery/prelude/lib/data/list";
import * as NE from "@discovery/prelude/lib/data/nonempty";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { HeroTemplate } from "../../../../../site-builder/tve/components/hero";
import { GoToNext, GoToPrev } from "../../../atoms/carousel-nav";
import { Hero as HeroViewTVE } from "../../../../../components/tve/organisms/hero";
import { HeroKind } from "../../../organisms/hero/types";
import { HeroCoverSizes } from "../../../../../components/tve/molecules/hero-cover";
import { GenericCarousel } from "../";

import * as styles from "../../../../../site-builder/tve/components/hero/styles.css";

const DEFAULT_ADVANCE_TIME_S = 5;

const heroItemsL = L.list(
  {
    contentIdM: M.of("2873"),
    imageM: M.of({
      alias: M.empty(),
      kind: "default",
      default: M.of(true),
      height: 3000,
      width: 4000,
      src:
        "https://us1-test-images.disco-api.com/2020/10/28/e11ad6f9-9b40-3323-97b4-a4713e7d6381.jpeg",
      title: M.empty(),
      description: M.empty(),
      cropCenter: M.empty(),
    }),

    metadata: {
      channelLogoM: M.empty(),
      channelNameM: M.empty(),
      isFavoriteM: M.of(false),
      isLiveM: M.empty(),
      kind: HeroKind.Show,
      locked: false,
      plateCtaM: M.of("Watch Now"),
      plateDescriptionM: M.of(
        "Buddy Valastro works to make his New Jersey bakery a household name."
      ),
      plateLinkM: M.of({
        kind: 1,
        url: "/show/cake-boss-tlc",
      }),
      plateTitleM: M.of("Cake boss"),
      showLogoM: M.of({
        alias: M.empty(),
        kind: "logo",
        default: M.of(true),
        height: 1300,
        width: 4320,
        src:
          "https://us1-prod-images.disco-api.com/2020/09/21/d381ee1c-43c9-3bbc-9463-7145db00fd66.png",
        title: M.empty(),
        description: M.empty(),
        cropCenter: M.empty(),
      }),
      tuneInTextM: M.of("Series Premiere"),
    },
    mobileImageM: M.of({
      alias: M.empty(),
      kind: "cover_artwork",
      default: M.of(true),
      height: 3000,
      width: 3000,
      src:
        "https://us1-test-images.disco-api.com/2020/05/11/1a5009eb-3193-32f9-8389-399207991d6b.jpeg",
      title: M.empty(),
      description: M.empty(),
      cropCenter: M.empty(),
    }),
  },
  {
    contentIdM: M.of("1764"),
    imageM: M.of({
      alias: M.empty(),
      kind: "default",
      default: M.of(true),
      height: 2160,
      width: 3840,
      src:
        "https://us1-prod-images.disco-api.com/2020/06/02/ecb53fef-284d-34e8-9242-fffc3bc71874.jpeg",
      title: M.empty(),
      description: M.empty(),
      cropCenter: M.empty(),
    }),

    metadata: {
      channelLogoM: M.empty(),
      channelNameM: M.empty(),
      isFavoriteM: M.of(false),
      isLiveM: M.empty(),
      kind: HeroKind.Show,
      locked: false,
      plateCtaM: M.of("Watch Now"),
      plateDescriptionM: M.of(
        "These four outrageous mother-daughter duos take their bonds to the extreme!"
      ),
      plateLinkM: M.of({
        kind: 1,
        url: "/show/smothered",
      }),
      plateTitleM: M.of("sMothered"),
      showLogoM: M.of({
        alias: M.empty(),
        kind: "logo",
        default: M.of(true),
        height: 311,
        width: 1800,
        src:
          "https://us1-prod-images.disco-api.com/2020/07/30/9f9b3851-c28d-3037-85eb-caf8b0f12dc9.png",
        title: M.empty(),
        description: M.empty(),
        cropCenter: M.empty(),
      }),
      tuneInTextM: M.of("Series Premiere"),
    },
    mobileImageM: M.of({
      alias: M.empty(),
      kind: "cover_artwork",
      default: M.of(true),
      height: 3000,
      width: 3000,
      src:
        "https://us1-prod-images.disco-api.com/2020/06/02/cb64f65f-97a1-397e-8be0-09c929030873.png",
      title: M.empty(),
      description: M.empty(),
      cropCenter: M.empty(),
    }),
  }
);

const heroViewL = L.map(
  ({ imageM, mobileImageM, metadata, contentIdM }) => () => (
    <HeroViewTVE
      activeVideoForShowAlternateIdM={M.empty()}
      coverImageM={imageM}
      mobileCoverImageM={mobileImageM}
      templateId={HeroTemplate.Carousel}
      coverSizeM={M.of(HeroCoverSizes.Basic)}
      metadataM={M.of(metadata)}
      contentIdM={contentIdM}
    />
  ),
  heroItemsL
);

const heroViewLM = NE.fromList(heroViewL);

export default {
  "GenericCarousel - Hero Carousel": (
    <RenderMaybe>
      {M.map(
        (heroViewNEL) => (
          <GenericCarousel
            itemL={heroViewNEL}
            autoAdvanceIntervalSec={DEFAULT_ADVANCE_TIME_S}
            classNames={{
              ...styles,
              carousel: styles.carousel,
            }}
            NextButton={GoToNext}
            PrevButton={GoToPrev}
          />
        ),
        heroViewLM
      )}
    </RenderMaybe>
  ),
};
