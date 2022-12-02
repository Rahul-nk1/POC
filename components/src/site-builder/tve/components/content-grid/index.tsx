import { flow, pipe } from "fp-ts/function";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import * as CQ from "@discovery/sonic-api-ng/lib/api/common/query";
import * as RD from "@discovery/prelude/lib/data/remote-data";
import * as Collections from "@discovery/sonic-api-ng/lib/api/cms/collections";
import * as O from "fp-ts/Option";
import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as Optics from "@discovery/sonic-api-ng-optics";
import { Fold } from "@discovery/prelude/lib/control/lens";
import { usePageMeta } from "@discovery/components-tve/src/utils/hooks/use-page-meta";
import { staticRealmConfig } from "@discovery/common-tve/lib/configs/realm";
import { useMemo } from "@discovery/common-tve/lib/hooks";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import { mkComponentMapItem } from "@discovery/template-engine/lib/component-map";
import { _Col2Id, _Col2ColDataMeta } from "@discovery/sonic-api-ng-optics";
import {
  EventDataProvider,
  triggerVideoPlayerEvent,
} from "@discovery/common-tve/lib/eventing";
import { DEFAULT_DECORATORS } from "@discovery/common-tve/src/constants";

import {
  Kind as ContentKind,
  Content,
  Video,
} from "../../../../components/tve/molecules/card/types";
import { MainContainer } from "../../../../components/tve/atoms/main-container";
import {
  CommonGridProps,
  createContentGridPaginated,
} from "../../../../components/tve/organisms/content-grid";
import {
  StandardRail,
  PosterPrimaryRail,
  PosterSecondaryGrid,
  DetailGrid,
  DetailGridHighlight,
  HighlightMiniGrid,
  StandardSecondaryGrid,
} from "../../../../components/tve/organisms/grid";
import { Tags } from "../../../../utils/types";
import { InlineProps } from "../../utils/inline-rendering";
import {
  useCallback,
  useRef,
  useSonicHttp,
  useState,
  useWhenInView,
} from "@discovery/common-tve/src/hooks";

import {
  _Col2ContentGridCardData,
  _CollectionResponse2Content,
  _AsyncCollection,
  _AllowRemoval,
} from "./optics";
import { ContentGridAsyncShimmer } from "../../../../components/tve/organisms/content-grid-shimmer";
import { searchQueryParam } from "../../../../site-builder/tve/components/menu-bar";

import * as styles from "./styles.css";

type IntersectionObserverEntry = Parameters<
  Parameters<typeof useWhenInView>[1]
>[0];

export enum Kind {
  PosterPrimary = "poster-primary",
  PosterSecondary = "poster-secondary",
  Standard = "standard",
  StandardSecondary = "standard-secondary",
  Detail = "detail",
  DetailHighlight = "detail-highlight",
  HighlightMini = "highlight-mini",
}

export const isContentGridKind = (s: string): s is Kind =>
  Object.values(Kind).some((x) => x === s);

export const isVideo = (c: Content): c is Video => c.kind === ContentKind.Video;

export const gridMap: Record<Kind, React.FC<CommonGridProps>> = {
  [Kind.PosterPrimary]: PosterPrimaryRail,
  [Kind.PosterSecondary]: PosterSecondaryGrid,
  [Kind.Standard]: StandardRail,
  [Kind.Detail]: DetailGrid,
  [Kind.DetailHighlight]: DetailGridHighlight,
  [Kind.HighlightMini]: HighlightMiniGrid,
  [Kind.StandardSecondary]: StandardSecondaryGrid,
};

/**
 * @TODO -- seo /// don't prop sniff
 *    - currently, there's no other way to determine if a `ContentGrid`
 *      is on a show / playlist page
 *    - header tags need to change based on their context
 */
const getHeaderTag = ({
  aliasM,
  defaultHeaderTag = Tags.h2,
  defaultCardHeaderTag = Tags.h3,
  isPlayerPage = false,
}: {
  aliasM: M.Maybe<string>;
  defaultHeaderTag?: Tags;
  defaultCardHeaderTag?: Tags;
  isPlayerPage?: boolean;
}): {
  title: Tags;
  card: Tags;
} => {
  const defaultTags = {
    title: defaultHeaderTag,
    card: defaultCardHeaderTag ?? defaultHeaderTag,
  };

  if (M.is.Nothing(aliasM)) {
    return defaultTags;
  }

  /**
   * @NOTE -- major inconsitency here from sonic
   *    - `DetailGrid`s appear on video pages and on show pages
   *    - the only `DetailGrid` outside of the map below contains show episodes
   */
  const map = {
    "extra-clips-blueprint": isPlayerPage
      ? {
          title: Tags.h3,
          card: Tags.h4,
        }
      : {
          title: Tags.h2,
          card: Tags.h3,
        },
    "up-next---blueprint": {
      title: Tags.h3,
      card: Tags.h4,
    },
  };

  for (const [key, val] of Object.entries(map)) {
    if (M.equals(aliasM, M.of(key))) {
      return val;
    }
  }

  return defaultTags;
};

const getProps = (data: CollectionResponseData) => {
  const componentIdM = Fold.preview(Optics._Col2ComponentId, data);
  const kind = pipe(
    Fold.preview(Optics._Col2TemplateId, data),
    O.filter(isContentGridKind),
    O.getOrElse(() => Kind.Standard)
  );
  const titleM = Fold.view(Optics._ColAttributes2Title, data);
  const aliasM = Fold.preview(Optics._ColAttributes2Alias, data);

  // this works for now,
  // but there are other implementations of content grid for detail cards
  // we will need other template types, or other ways to differentiate
  const classNameM =
    kind === Kind.Detail || kind === Kind.HighlightMini
      ? O.some(styles.upNext)
      : O.none;

  const metaM = Fold.preview(_Col2ColDataMeta, data);
  const collectionIdM = Fold.preview(_Col2Id, data);
  const contentGridData = Fold.toList(_Col2ContentGridCardData, data);

  const contentL = pipe(contentGridData, (l: L.List<Content>) =>
    L.sortBy((item: Content) => {
      const channelId: string = pipe(
        item,
        O.fromPredicate(isVideo),
        O.chain((video: Video) => video?.channelIdM ?? O.none),
        O.getOrElse(() => "")
      );

      return channelId.toUpperCase() ===
        staticRealmConfig.siteLookupKey.toUpperCase()
        ? -1
        : 1;
    }, l)
  );

  const asyncCollection = pipe(
    Fold.preview(_AsyncCollection, data),
    O.getOrElse(() => false)
  );

  const allowRemoval = pipe(
    Fold.preview(_AllowRemoval, data),
    O.getOrElse(() => false)
  );

  return {
    componentIdM,
    kind,
    titleM,
    aliasM,
    metaM,
    classNameM,
    collectionIdM,
    contentL,
    asyncCollection,
    allowRemoval,
  };
};

type Props = ReturnType<typeof getProps> & InlineProps;

const params = Collections.Query.One.lenses.decorators.set(
  CQ.Decorators.decorators(...DEFAULT_DECORATORS)
)(Collections.Query.One.parameters);

const createContentGridPaginatedFromKind = flow(
  (k: Kind) => gridMap[k],
  createContentGridPaginated
);

const handleClick = (
  _: React.MouseEvent<Element, MouseEvent>,
  content: Content
): void => {
  if (isVideo(content)) {
    triggerVideoPlayerEvent(content.id);
  }
};

const ContentGrid = ({
  componentIdM,
  kind,
  titleM,
  aliasM,
  metaM,
  classNameM,
  collectionIdM,
  contentL,
  asyncCollection,
  allowRemoval,
  showChannelLogo = true,
  showTitle = true,
  onClick = handleClick,
  collectionRequest,
}: Props) => {
  const ContentGridPaginated = useMemo(
    () => createContentGridPaginatedFromKind(kind),
    [kind]
  );

  const triggerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const { isPlayerPage } = usePageMeta();
  const headerTag = useMemo(() => getHeaderTag({ aliasM, isPlayerPage }), [
    aliasM,
    isPlayerPage,
  ]);

  const title = useMemo(
    () => pipe(titleM, O.chain(O.fromPredicate((_) => showTitle))),
    [titleM, showTitle]
  );

  const [response, getCollection] = useSonicHttp(
    Collections.Endpoints.getCollection
  );

  const asyncResults: {
    contentL: Props["contentL"];
    metaM: Props["metaM"];
  } = RD.fromRD(
    {
      notAsked: () => ({
        metaM: M.empty(),
        contentL: L.empty(),
      }),
      loading: () => ({
        metaM: M.empty(),
        contentL: L.empty(),
      }),
      failure: () => ({
        metaM: M.empty(),
        contentL: L.empty(),
      }),
      success: (newData) => {
        const data = Res.map(({ data }) => data, newData);
        return {
          metaM: Fold.preview(_Col2ColDataMeta, data),
          contentL: pipe(
            Fold.toList(_Col2ContentGridCardData, data),
            (l: L.List<Content>) =>
              L.sortBy((item: Content) => {
                const channelId: string = pipe(
                  item,
                  O.fromPredicate(isVideo),
                  O.chain((video: Video) => video?.channelIdM ?? O.none),
                  O.getOrElse(() => "")
                );

                return channelId.toUpperCase() ===
                  staticRealmConfig.siteLookupKey.toUpperCase()
                  ? -1
                  : 1;
              }, l)
          ),
        };
      },
    },
    response
  );

  const inViewCheck = useCallback(
    ({ isIntersecting }: IntersectionObserverEntry) => {
      setIsInView(isIntersecting);
      if (isIntersecting && asyncCollection && RD.is.NotAsked(response)) {
        getCollection(M.fromMaybe(collectionIdM, ""), params);
      }
    },
    [asyncCollection, response, collectionIdM, getCollection]
  );

  useWhenInView(triggerRef, inViewCheck, {
    root: { current: null },
    rootMargin: "100px",
  });

  const isFetchingAsyncCollection = asyncCollection && !RD.is.Success(response);
  const searchTerm =
    new URLSearchParams(location.search).get(searchQueryParam) || undefined;
  return (
    <MainContainer classNameM={classNameM}>
      <ContentGridAsyncShimmer
        kind={kind}
        triggerRef={triggerRef}
        titleM={title}
        isInView={isInView}
        isFetchingAsyncCollection={isFetchingAsyncCollection}
      >
        <EventDataProvider
          componentIdM={componentIdM}
          alias={M.fromMaybe(aliasM, "")}
          searchTerm={searchTerm}
        >
          <ContentGridPaginated
            aliasM={aliasM}
            autoPagination
            collectionIdM={collectionIdM}
            allowRemoval={allowRemoval}
            contentL={asyncCollection ? asyncResults.contentL : contentL}
            headerTag={headerTag.title}
            cardHeaderTag={headerTag.card}
            lens={_CollectionResponse2Content}
            metaM={asyncCollection ? asyncResults.metaM : metaM}
            onClick={onClick}
            collectionRequest={collectionRequest}
            showChannelLogo={showChannelLogo}
            titleM={title}
            gridType={kind}
          />
        </EventDataProvider>
      </ContentGridAsyncShimmer>
    </MainContainer>
  );
};

export const ComponentMapItem = mkComponentMapItem(getProps, () => ContentGrid);
