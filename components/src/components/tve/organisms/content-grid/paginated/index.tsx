import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as CQ from "@discovery/sonic-api-ng/lib/api/common/query";
import * as Fold from "@discovery/prelude/lib/control/lens/fold";
import * as Pagination from "@discovery/orchestra/lib/pagination";
import * as Collections from "@discovery/sonic-api-ng/lib/api/cms/collections";
import { compose } from "@discovery/prelude/lib/data/function";
import { DEFAULT_DECORATORS } from "@discovery/common-tve/lib/constants";
import {
  useEventDataContext,
  triggerInteractionEvent,
  InteractionEvent,
} from "@discovery/common-tve/lib/eventing";
import {
  usePaginatedCollection,
  useState,
  useGlobalState,
  useCallback,
  useEffect,
} from "@discovery/common-tve/lib/hooks";
import { AllowRemovalProvider } from "@discovery/components-tve/src/utils/hooks/use-removal";
import { Spinner } from "../../../atoms/spinner";

import { Content } from "../../../molecules/card/types";
import { getPaginationState } from "../../../molecules/lazy-loader";
import { LazyTrigger } from "./lazy-trigger";
import { ContentGrid, CommonGridProps } from "..";
import { usePageMeta } from "../../../../../utils/hooks/use-page-meta";
import { Tags } from "../../../../../utils/types";

import * as styles from "./styles.css";
import { Kind } from "../../../../../site-builder/tve/components/content-grid";

export type DataMeta = {
  itemsCurrentPage: M.Maybe<number>;
  itemsPageSize: M.Maybe<number>;
  itemsTotalPages: M.Maybe<number>;
};

export type GridPagination = {
  state: {
    hasMore: boolean;
    pagesLeftM: M.Maybe<number>;
    isLoading: boolean;
  };
  fetchMore: () => void;
};

export const colRequest = (page: Collections.Query.One.Page) =>
  compose(
    Collections.Query.One.lenses.include.set(CQ.Include.include("default")),
    Collections.Query.One.lenses.decorators.set(
      CQ.Decorators.decorators(...DEFAULT_DECORATORS)
    ),
    Collections.Query.One.lenses.page.set(page)
  )(Collections.Query.One.parameters);

enum ButtonTitle {
  ShowMore = "More",
}

/* To check Up Next section's of respective player page, so that modification doesn't apply for other content grids data */
const checkPlayerPageUpNext = ({
  aliasM,
  isPlayerPage,
}: {
  aliasM: M.Maybe<string>;
  isPlayerPage: boolean;
}) => {
  enum Alias {
    Live = "foad-next-collection",
    VOD = "up-next---blueprint",
  }

  if (
    isPlayerPage &&
    (M.equals(aliasM, M.of(Alias.VOD)) || M.equals(aliasM, M.of(Alias.Live)))
  ) {
    return true;
  }
  return false;
};

export const PaginationButton = ({
  // TODO consolidate show and loading into state = "show" | "loading" | "dontShow"
  show,
  loading,
  onClick,
  title = ButtonTitle.ShowMore,
}: {
  show: boolean;
  loading: boolean;
  onClick: () => void;
  title?: string;
}) => {
  const { eventData } = useEventDataContext();

  const triggerClickEvent = () => {
    triggerInteractionEvent({
      ...eventData,
      content: {
        ...eventData.content,
        contentTitle: title,
      },
      interactionType: InteractionEvent.CLICK,
    });
  };
  const click = () => {
    onClick();
    triggerClickEvent();
  };
  return (
    <div className={styles.paginateButtonContainer}>
      {show && (
        <button className={styles.paginateButton} onClick={click}>
          {title}
        </button>
      )}

      {loading && <Spinner />}
    </div>
  );
};

// const AllowRemoval = React.createContext(false);
// export const useAllowRemoval: () => boolean = () => useContext(AllowRemoval);

export const createContentGridPaginated = (
  Grid: React.FC<CommonGridProps>
) => ({
  titleM,
  aliasM = M.empty(),
  collectionIdM = M.empty(),
  contentL,
  allowRemoval = false,
  showChannelLogo,
  onClick,
  metaM,
  lens,
  collectionRequest = colRequest,
  autoPagination = false,
  isEmptyMessageM = M.empty(),
  headerTag = Tags.h3,
  cardHeaderTag = Tags.h4,
}: {
  titleM: M.Maybe<string>;
  showChannelLogo?: boolean;
  aliasM?: M.Maybe<string>;
  onClick?: CommonGridProps["onClick"];
  contentL: L.List<Content>;
  allowRemoval?: boolean;
  collectionIdM: M.Maybe<string>;
  metaM: M.Maybe<DataMeta>;
  lens: Fold.Fold<Collections.Resource.CollectionResponse, Content>;
  collectionRequest?: (
    page: Collections.Query.One.Page
  ) => Collections.Query.One.Parameters;
  autoPagination?: boolean;
  isEmptyMessageM?: M.Maybe<string>;
  headerTag?: CommonGridProps["headerTag"];
  cardHeaderTag?: CommonGridProps["cardHeaderTag"];
  gridType: Kind;
}) => {
  const initialMeta = M.fromMaybe(metaM, {
    itemsCurrentPage: M.empty(),
    itemsPageSize: M.empty(),
    itemsTotalPages: M.empty(),
  });

  const { channelNameM } = usePageMeta();
  const channelTitleM = M.liftM(
    (channel, title) => `${title} on ${channel}`,
    channelNameM,
    titleM
  );
  const sectionTitleM = M.alt(channelTitleM, titleM);

  const [paginatedContent, cont] = usePaginatedCollection<Content>(
    M.fromMaybe(collectionIdM, ""),
    contentL,
    initialMeta,
    lens
  );

  const paginationState = getPaginationState(cont);
  const [showButton, setShowButton] = useState(paginationState.showButton);
  const [{ isPlayerPage }] = useGlobalState();
  // autoPagination is meant to initialize component in the way it will
  // lazyload new content without pressing button beforehand
  const [isLazy, setIsLazy] = useState(isPlayerPage ? false : autoPagination);

  const [removedItemsL, setRemovedItemsL] = useState<L.List<string>>(L.empty());

  const fetchMore = useCallback(() => {
    Pagination.fetchMore(collectionRequest)(cont);

    setIsLazy(true);
  }, [collectionRequest, cont]);

  /* AWC-856, paginate locally for Up Next section's of VOD and Live Player page */
  const start = 0;
  const INITIAL_VISIBALITY = 3;
  const [visibility, setVisibility] = useState(INITIAL_VISIBALITY);
  const fetchMoreForPlayerPageUpNext = useCallback(() => {
    setVisibility((prev) => prev + contentL.length);
    setShowButton(false);
  }, [contentL]);
  type Meta = {
    itemsCurrentPage: number;
    itemsPageSize: number;
    itemsTotalPages: number;
  };
  const [paginatedMetaM, setPaginatedMetaM] = useState<M.Maybe<Meta>>(
    M.empty()
  );

  useEffect(() => {
    if (Pagination.is.Done(cont)) {
      setPaginatedMetaM(M.of(cont.value[1]));
    } else if (Pagination.is.HasMore(cont) || Pagination.is.Failure(cont)) {
      setPaginatedMetaM(M.of(cont.value[2]));
    }
  }, [cont]);
  const pagination: GridPagination = {
    state: {
      hasMore: Pagination.is.HasMore(cont) || Pagination.is.Failure(cont),
      pagesLeftM: M.map(
        (meta) => meta.itemsTotalPages - meta.itemsCurrentPage,
        paginatedMetaM
      ),
      isLoading: Pagination.is.Loading(cont),
    },
    fetchMore: fetchMore,
  };
  return (
    <AllowRemovalProvider value={allowRemoval}>
      <ContentGrid
        aliasM={aliasM}
        isEmptyMessageM={isEmptyMessageM}
        headerTag={headerTag}
        isEmpty={L.isEmpty(contentL)}
        titleM={sectionTitleM}
      >
        <Grid
          showChannelLogo={showChannelLogo}
          contentL={
            checkPlayerPageUpNext({ aliasM, isPlayerPage })
              ? L.slice(
                  start,
                  visibility,
                  L.filter(
                    (content) => !L.includes(content.id, removedItemsL),
                    contentL
                  )
                )
              : L.filter(
                  (content) => !L.includes(content.id, removedItemsL),
                  paginatedContent
                )
          }
          headerTag={headerTag}
          cardHeaderTag={cardHeaderTag}
          onClick={onClick}
          onFavoriteChange={(id, favorited) => {
            if (allowRemoval && favorited) {
              setRemovedItemsL((l) => L.append(id, l));
            }
          }}
          pagination={pagination}
          paginationM={M.map(
            () =>
              isLazy ? (
                <LazyTrigger
                  onTrigger={fetchMore}
                  show={showButton}
                  loading={paginationState.loading}
                />
              ) : (
                <PaginationButton
                  show={
                    /* This is to use more button differently as "showButton" state works on different pagination functionality */
                    checkPlayerPageUpNext({ aliasM, isPlayerPage })
                      ? contentL.length > visibility
                        ? true
                        : false
                      : showButton
                  }
                  loading={paginationState.loading}
                  onClick={
                    isPlayerPage ? fetchMoreForPlayerPageUpNext : fetchMore
                  }
                  title={ButtonTitle.ShowMore}
                />
              ),
            collectionIdM
          )}
        />
      </ContentGrid>
    </AllowRemovalProvider>
  );
};
