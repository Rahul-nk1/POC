import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as Pagination from "@discovery/orchestra/lib/pagination";
import {
  usePaginatedCollection,
  useState,
} from "@discovery/common-tve/lib/hooks";
import { triggerVideoPlayerEvent } from "@discovery/common-tve/lib/eventing";

import {
  PlaylistMetaType,
  usePlaylistMeta,
} from "@discovery/components-tve/src/utils/hooks/use-playlist-meta";

import { Content } from "../../../../components/tve/molecules/card";
import { LoadingType } from "../../../../components/tve/molecules/lazy-loader";
import {
  colRequest,
  PaginationButton,
} from "../../../../components/tve/organisms/content-grid/paginated";
import { _CollectionResponse2Content } from "../content-grid/optics";
import { Spinner } from "../../../../components/tve/atoms/spinner";
import { shouldPaginate } from "../../../../utils/render";

import { Props, LazyLoadedProps } from "./types";
import { PlaylistGridView } from "./playlist-grid-view";
import { PlayerView } from "./player-view";
import { isVideo } from "../content-grid";

import * as styles from "./styles.css";

export const View = ({
  collectionIdM = M.empty(),
  metaM = M.empty(),
  videoL,
  Player,
  titleM = M.empty(),
  descriptionM = M.empty(),
  lens = _CollectionResponse2Content,
  collectionRequest = colRequest,
  componentIdM = M.empty(),
  aliasM = M.empty(),
}: Props) => {
  const playlistMeta: PlaylistMetaType = usePlaylistMeta();

  const { playIndexM, setPlayIndexM } = playlistMeta;

  const _descriptionM = M.alt(playlistMeta.descriptionM, descriptionM);

  const [loadingType, setLoadingType] = useState(LoadingType.Manual);

  const onClick = (_: React.MouseEvent, content: Content) => {
    const index = L.findIndex((c) => c.id === content.id, paginatedContent);
    if (shouldPaginate<Content>(paginatedContent, index)) {
      Pagination.fetchMore(collectionRequest)(paginationContinue);
    }
    setPlayIndexM(M.of(index));
    if (isVideo(content)) {
      triggerVideoPlayerEvent(content.id);
    }
  };

  const meta = M.fromMaybe(metaM, {
    itemsCurrentPage: M.empty(),
    itemsPageSize: M.empty(),
    itemsTotalPages: M.empty(),
  });

  const [
    paginatedContent,
    paginationContinue,
  ] = usePaginatedCollection<Content>(
    M.fromMaybe(collectionIdM, ""),
    videoL,
    meta,
    lens
  );

  const lazyLoadedProps: LazyLoadedProps = {
    loadingType,
    onLoadMore: () => setLoadingType(LoadingType.Automatic),
    performPaginate: () =>
      Pagination.fetchMore(collectionRequest)(paginationContinue),
    paginationContinue,
    PaginationButton,
    Spinner,
    className: styles.paginationButton,
  };

  return M.foldMapConst(
    () => (
      <PlayerView
        collectionIdM={collectionIdM}
        Player={Player}
        titleM={titleM}
        collectionRequest={collectionRequest}
        playIndexM={playIndexM}
        setPlayIndexM={setPlayIndexM}
        loadingType={loadingType}
        paginatedContent={paginatedContent}
        paginationContinue={paginationContinue}
        onClick={onClick}
        lazyLoadedProps={lazyLoadedProps}
        componentIdM={componentIdM}
        aliasM={aliasM}
      />
    ),
    <PlaylistGridView
      descriptionM={_descriptionM}
      onClick={onClick}
      lazyLoadedProps={lazyLoadedProps}
      paginatedContent={paginatedContent}
      componentIdM={componentIdM}
      aliasM={aliasM}
    />,
    playIndexM
  );
};
