import * as Pagination from "@discovery/orchestra/lib/pagination";
import { SonicException } from "@discovery/sonic-api-ng/lib/app/sonic";
import {
  useEffect,
  useRef,
  useWhenInView,
  useState,
} from "@discovery/common-tve/lib/hooks";
import * as L from "@discovery/prelude/lib/data/list";

type PaginationState = {
  showButton: boolean;
  loading: boolean;
};
// TODO: the failure state here should map to an error state of the button.
// instead of Pagination -> {showButton boolean, loading: boolean}
// it should be Pagination -> JSX
export function getPaginationState<T>(
  paginationContinue: Pagination.Continue<SonicException, T>
): PaginationState {
  return Pagination.is.HasMore(paginationContinue)
    ? {
        showButton: true,
        loading: false,
      }
    : Pagination.is.Done(paginationContinue)
    ? {
        showButton: false,
        loading: false,
      }
    : Pagination.is.Loading(paginationContinue)
    ? {
        showButton: false,
        loading: true,
      }
    : Pagination.is.Failure(paginationContinue)
    ? {
        showButton: true,
        loading: false,
      }
    : { showButton: false, loading: false };
}
export enum LoadingType {
  Automatic,
  Manual,
}

/**
 * Props:
 * @paginatedContent List of paginated content
 * @loadingType Pagination Button will appear if it is Manual
 * @onLoadMore Callback function once the pagination button is clicked
 * @performPaginate Callback function to perform pagination, usePaginatedCollection hook
 * @paginationContinue PaginationContinue from usePaginatedCollection hook.
 * @paginationButtonLabel Button label
 * @PaginationButton A pagination button component
 * @Spinner A loading indicator component when the pagination occurs
 * @className Class name to be applied to the pagination button
 * @children Render Props ({ List item <T> })
 */

export function LazyLoader<T>({
  children,
  loadingType,
  onLoadMore,
  paginationContinue,
  paginatedContent,
  performPaginate,
  Spinner,
  PaginationButton,
  className,
  paginationButtonLabel = "See more",
  showLoadMoreButton,
}: {
  loadingType: LoadingType;
  onLoadMore: () => void;
  paginationContinue: Pagination.Continue<SonicException, T>;
  performPaginate: () => void;
  paginatedContent: L.List<T>;
  children: (card: T) => JSX.Element;
  Spinner: React.ReactType;
  paginationButtonLabel?: string;
  PaginationButton: React.ReactType;
  className?: string;
  showLoadMoreButton?: boolean;
}) {
  const lazyLoaderRef = useRef<HTMLDivElement>(null);
  const [inView, setIsInView] = useState(false);

  useWhenInView(
    lazyLoaderRef,
    ({ isIntersecting }) => setIsInView(isIntersecting),
    {
      threshold: 1,
      root: { current: null },
      rootMargin: "100px",
    }
  );
  const paginationState = getPaginationState<T>(paginationContinue);
  useEffect(() => {
    if (
      inView &&
      !paginationState.loading &&
      paginationState.showButton &&
      loadingType === LoadingType.Automatic
    ) {
      performPaginate();
    }
  }, [inView, loadingType, performPaginate, paginationState]);

  return (
    <>
      {L.map(children, paginatedContent)}
      <div className={className} ref={lazyLoaderRef}>
        {loadingType === LoadingType.Manual && (
          <PaginationButton
            show={showLoadMoreButton || paginationState.showButton}
            loading={paginationState.loading}
            onClick={onLoadMore}
            title={paginationButtonLabel}
          />
        )}
        {paginationState.loading && <Spinner />}
      </div>
    </>
  );
}
