import * as Collections from "@discovery/sonic-api-ng/lib/api/cms/collections";
import * as Fold from "@discovery/prelude/lib/control/lens/fold";
import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import { Continue } from "@discovery/orchestra/lib/pagination/types";

import { SonicException } from "@discovery/sonic-api-ng/lib/app/sonic";

import { Content } from "../../../../components/tve/molecules/card";
import { LoadingType } from "../../../../components/tve/molecules/lazy-loader";
import {
  DataMeta,
  PaginationButton,
} from "../../../../components/tve/organisms/content-grid/paginated";
import { Spinner } from "../../../../components/tve/atoms/spinner";
import { createPlayer } from "../../../../utils/tve/createPlayer";

export type Props = {
  videoL: L.List<Content>;
  collectionIdM?: M.Maybe<string>;
  metaM: M.Maybe<DataMeta>;
  lens?: Fold.Fold<Collections.Resource.CollectionResponse, Content>;
  collectionRequest?: (
    page: Collections.Query.One.Page
  ) => Collections.Query.One.Parameters;
  titleM?: M.Maybe<string>;
  descriptionM?: M.Maybe<string>;
  Player: ReturnType<typeof createPlayer>;
  componentIdM: M.Maybe<string>;
  aliasM: M.Maybe<string>;
};

export type LazyLoadedProps = {
  className?: string;
  loadingType: LoadingType;
  onLoadMore: () => void;
  performPaginate: () => void;
  paginationContinue: Continue<SonicException, Content>;
  PaginationButton: typeof PaginationButton;
  Spinner: typeof Spinner;
};

export type PlayerViewProps = {
  collectionIdM?: Props["collectionIdM"];
  titleM?: Props["titleM"];
  Player: Props["Player"];
  collectionRequest?: Props["collectionRequest"];
  playIndexM?: M.Maybe<number>;
  setPlayIndexM: (i: M.Maybe<number>) => void;
  loadingType: LoadingType;
  paginatedContent: L.List<Content>;
  paginationContinue: Continue<SonicException, Content>;
  onClick: (_: React.MouseEvent, content: Content) => void;
  lazyLoadedProps: LazyLoadedProps;
  componentIdM: Props["componentIdM"];
  aliasM: Props["aliasM"];
};

export type PlaylistGridProps = {
  descriptionM?: Props["descriptionM"];
  onClick: PlayerViewProps["onClick"];
  lazyLoadedProps: LazyLoadedProps;
  paginatedContent: PlayerViewProps["paginatedContent"];
  componentIdM: Props["componentIdM"];
  aliasM: Props["aliasM"];
};
