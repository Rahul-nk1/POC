import { pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import { cn } from "@discovery/classnames"
import { Fold, Lens } from "@discovery/prelude/lib/control/lens"
import * as Res from "@discovery/sonic-api-ng/lib/japi/response"
import * as M from "@discovery/prelude/lib/data/maybe"
import * as L from "@discovery/prelude/lib/data/list"
import * as NE from "@discovery/prelude/lib/data/nonempty"
import * as Optics from "@discovery/sonic-api-ng-optics"
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource"
import { mkComponentMapItem } from "@discovery/template-engine/lib/component-map"
import { EventDataProvider } from "@discovery/common-tve/lib/eventing"
import { useMemo } from "@discovery/common-tve/lib/hooks"
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe"
import { usePageMeta } from "@discovery/components-tve/src/utils/hooks/use-page-meta"
import { Hero as HeroView } from "../../../../components/tve/organisms/hero"
import { useActiveVideoForShow } from "../../../../utils/hooks/use-active-video-for-show"
import { GenericCarousel } from "../../../../components/tve/molecules/generic-carousel"
import { GoToNext, GoToPrev } from "../../../../components/tve/atoms/carousel-nav"

import { PageComponentId } from "../../mapping"

import { HeroContextProvider } from "../../../../utils/hooks/use-hero-context"
import {
  PlaylistMetaType,
  usePlaylistMeta
} from "@discovery/components-tve/src/utils/hooks/use-playlist-meta"
import { safeNthItemRenderer } from "../../../../utils/render"

import { _Col2HeroData, _Col2HeroDataPlaylist, _MobileImage } from "./optics"
import * as styles from "./styles.css"
import { InlineProps } from "../../utils/inline-rendering"
import * as RD from "@discovery/prelude/lib/data/remote-data"

const DEFAULT_ADVANCE_TIME_S = 5
const MAX_HERO_ITEMS = 13

export enum HeroTemplate {
  Primary = "primary",
  Carousel = "carousel",
  Playlist = "playlist",
  Standard = "standard"
}

// I placed these here to have a common source of truth
// TODO: Fix this, perhaps break out into two component-creators
export enum HeroTemplateTVE {
  Carousel = "carousel",
  Playlist = "playlist",
  Standard = "standard"
}

const getHeroTemplate = (templateId: string) => {
  switch (templateId) {
    case "primary":
    // eslint-disable-next-line
    case "highlight": // TODO: Deprecated July 2020, remove once no longer in use in Site Builder
      return HeroTemplate.Primary
    case "carousel":
      return HeroTemplate.Carousel
    case "playlist":
      return HeroTemplate.Playlist
    case "standard":
    default:
      return HeroTemplate.Standard
  }
}

const getProps = (data: CollectionResponseData) => {
  const componentIdM = Fold.preview(Optics._Col2ComponentId, data)
  const aliasM = Fold.preview(Optics._ColAttributes2Alias, data)
  const templateId = pipe(
    Fold.preview(Optics._Col2TemplateId, data),
    O.map(getHeroTemplate),
    O.getOrElse(() => HeroTemplate.Standard)
  )

  const showAlternateIdM = Fold.preview(
    Fold.compose(Optics._Col2Show, Res._Response(), Lens.path("attributes", "alternateId")),
    data
  )
  const isCarousel = templateId === HeroTemplate.Carousel
  const isPrimary = templateId === HeroTemplate.Primary

  const heroDataL = Fold.toList(_Col2HeroData, data)
  const heroDataPlaylistL = Fold.toList(_Col2HeroDataPlaylist, data)

  const heroMobileImageM = Fold.preview(Fold.compose(Optics._Col2Items, _MobileImage), data)

  return {
    componentIdM,
    aliasM,
    templateId,
    showAlternateIdM,
    isCarousel,
    isPrimary,
    heroDataL,
    heroDataPlaylistL,
    heroMobileImageM
  }
}

type Props = ReturnType<typeof getProps> & InlineProps

const Hero = ({
  componentIdM,
  templateId,
  showAlternateIdM,
  isCarousel,
  isPrimary,
  heroDataL,
  heroDataPlaylistL,
  heroMobileImageM,
  aliasM
}: Props) => {
  const { componentId } = usePageMeta()

  const isPlaylist = useMemo(
    () => componentId === PageComponentId.PlaylistPage || templateId === HeroTemplate.Playlist,
    [componentId, templateId]
  )

  const heroData = useMemo(
    () => L.take(MAX_HERO_ITEMS, isPlaylist ? heroDataPlaylistL : heroDataL),
    [isPlaylist, heroDataPlaylistL, heroDataL]
  )

  const heroItemLimitL = useMemo(() => (isCarousel ? heroData : L.take(1, heroData)), [
    isCarousel,
    heroData
  ])

  const playlistMeta: PlaylistMetaType = usePlaylistMeta()
  const playlistHeroItemsL = L.map((item) => {
    const overrideTitle = {
      ...item,
      metadata: {
        ...item.metadata,
        plateTitleM: M.concat(playlistMeta.titleM, item.metadata.plateTitleM)
      }
    }
    return overrideTitle
  }, heroItemLimitL)

  const heroItemsL = isPlaylist ? playlistHeroItemsL : heroItemLimitL
  /**
   * @TODO -- fix data fragmentation
   *  - for playlist heroes (collections), they contain multiple collection items,
   *    each containing an image
   *  - the override data is located inside the 16x9 image (usually the first),
   *    BUT the mobile image is actually another collection item
   *  - because we only take the first collection item in non-carousel heroes,
   *    the mobile hero image will be excluded
   *
   *  -> manually get the mobile hero image from optics
   */

  const isCompact = useMemo(
    () =>
      !isPrimary &&
      ((O.isSome(showAlternateIdM) && L.length(heroData) === 1) || // shows
        (!O.isSome(showAlternateIdM) && L.length(heroData) > 1)), // playlists
    [isPrimary, heroData, showAlternateIdM]
  )

  const activeVideoForShowAlternateIdM = useMemo(() => (!isCarousel ? showAlternateIdM : O.none), [
    isCarousel,
    showAlternateIdM
  ])

  const heroViewLM = useMemo(
    () =>
      NE.fromList(
        L.mapWithIndex(
          (i, { imageM, mobileImageM, metadata, contentIdM }) => () => (
            <EventDataProvider
              content={{ id: O.toUndefined(contentIdM) }}
              contentIndex={i}
              componentIdM={componentIdM}
              alias={O.getOrElse(() => "")(aliasM)}>
              <HeroView
                coverImageM={imageM}
                mobileCoverImageM={mobileImageM}
                templateId={templateId}
                metadata={{
                  ...metadata,
                  activeVideoForShowMRD: useActiveVideoForShow(activeVideoForShowAlternateIdM)
                }}></HeroView>
            </EventDataProvider>
          ),
          heroItemsL
        )
      ),
    [templateId, heroItemsL, componentIdM]
  )

  const localClasses = useMemo(
    () =>
      cn(styles.heroContainer, {
        [styles.single]: !isCarousel,
        [styles.compact]: isCompact
      }),
    [isCarousel, isCompact]
  )

  return (
    <HeroContextProvider>
      <div className={localClasses}>
        <RenderMaybe>
          {M.map(
            (heroViewNEL) =>
              isCarousel ? (
                <EventDataProvider metaTag="GenericCarousel" componentIdM={componentIdM}>
                  <GenericCarousel
                    itemL={heroViewNEL}
                    autoAdvanceIntervalSec={DEFAULT_ADVANCE_TIME_S}
                    classNames={{
                      ...styles,
                      carousel: isCompact ? styles.compactCarousel : styles.carousel
                    }}
                    NextButton={GoToNext}
                    PrevButton={GoToPrev}
                  />
                </EventDataProvider>
              ) : (
                safeNthItemRenderer(0, heroViewNEL)
              ),
            heroViewLM
          )}
        </RenderMaybe>
      </div>
    </HeroContextProvider>
  )
}

export const ComponentMapItem = mkComponentMapItem(getProps, () => Hero)
