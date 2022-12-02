import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as M from "@discovery/prelude/lib/data/maybe";
import { Fold } from "@discovery/prelude/lib/control/lens";
import { PageResponseData } from "@discovery/sonic-api-ng/lib/api/cms/pages/resource";
import {
  Child,
  mkComponentMapItem,
} from "@discovery/template-engine/lib/component-map";
import {
  useCallback,
  useEffect,
  useGlobalState,
  useGlobalStateModifier,
  useMemo,
} from "@discovery/common-tve/lib/hooks";
import { GlobalState, _IsPlayerPage } from "@discovery/common-tve/lib/state";
import {
  PageTemplate,
  isPageTemplate,
} from "@discovery/common-tve/lib/constants";
import { PageMetaProvider } from "../../../../utils/hooks/use-page-meta";
import * as PO from "../page/optics";
import { ComponentId, PageComponentId } from "../../mapping";

import Option = O.Option;

export const isPageComponentId = (id: string): id is PageComponentId =>
  Object.values(PageComponentId).includes(id as PageComponentId);

export type Props = {
  templateIdM: Option<string>;
  pageComponentIdM: Option<string>;
  pageChannelNameM: Option<string>;
  collectionComponentIdM: Option<string>;
  defaultPageComponentId?: PageComponentId;
};

export const getProps = (data: PageResponseData): Props => {
  const templateIdM = Fold.preview(PO._PageTemplate, data);
  const pageComponentIdM = Fold.preview(PO._PageComponentId, data);
  const pageChannelNameM = Fold.preview(PO._PageChannelName, data);
  const collectionComponentIdM = Fold.preview(
    PO._Page2CollectionComponentId,
    data
  );

  return {
    collectionComponentIdM,
    templateIdM,
    pageComponentIdM,
    pageChannelNameM,
  };
};

export const PageWithContext = ({
  collectionComponentIdM,
  templateIdM,
  pageComponentIdM,
  pageChannelNameM,
  defaultPageComponentId = PageComponentId.Page,
  children,
}: Props & Child) => {
  /**
   * @TODO -- cleaner state <-> context connection
   *  - playlist player pages are overlaid atop a standard Page component
   *  - as such, it sets `isPlayerPage` via state, toggling on mount/unmount
   *  - `PageMetaContext` needs to reflect this value,
   *    without accidentally leaving `isPlayerPage === true`
   *    when the player unmounts (no page component id change)
   */
  const [_isPlayerPage] = useGlobalState(_IsPlayerPage);

  const isPlayerPage = useMemo(
    () =>
      _isPlayerPage ||
      M.foldMapConst(
        (collectionComponentId) => collectionComponentId === ComponentId.Player,
        false,
        collectionComponentIdM
      ),
    [_isPlayerPage, collectionComponentIdM]
  );

  /**
   * @TODO -- cleaner id fallback / inference
   *  - slightly cleaner than the original, but
   *    these optics still require a double fallback
   *  -> there must be a cleaner way :)
   */

  const templateId = useMemo(
    () =>
      pipe(
        templateIdM,
        O.chain(O.fromPredicate(isPageTemplate)),
        O.getOrElse(() => PageTemplate.Primary)
      ),
    [templateIdM]
  );

  const componentId = useMemo(
    () =>
      pipe(
        pageComponentIdM,
        O.chain(O.fromPredicate(isPageComponentId)),
        O.getOrElse(() => defaultPageComponentId)
      ),
    [pageComponentIdM, defaultPageComponentId]
  );

  /**
   * @TODO -- cleaner state <-> context connection
   *  - we need to pass `isPlayerPage` + `templateId` into `Footer`
   *  - `Footer` is technically a separate "app" and thus doesn't have access to context
   *  - we can't put all the context data here into Global State
   *    because of import / arch restrictions
   *  -> only add `templateId` for now
   *  -> also this pattern doesn't follow the `useState` React "hook" pattern,
   *     e.g., (const [state, setState] = useState()),
   *     is more verbose, and less performant
   */
  const updatedState = useCallback(
    (st: GlobalState) => ({
      ...st,
      isPlayerPage,
      templateId,
    }),
    [isPlayerPage, templateId]
  );

  const modifyState = useGlobalStateModifier(updatedState);

  useEffect(() => {
    modifyState();
  }, [modifyState]);

  return (
    <PageMetaProvider
      channelNameM={pageChannelNameM}
      componentId={componentId}
      isPlayerPage={isPlayerPage}
      templateId={templateId}
    >
      {children}
    </PageMetaProvider>
  );
};

// Not sure if that is ever used,
// but perhaps we could offload wrapping pages with this to template engine?
export const ComponentMapItem = mkComponentMapItem(
  getProps,
  () => PageWithContext
);
