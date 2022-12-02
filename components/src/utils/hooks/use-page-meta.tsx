import { createContext } from "react";
import * as M from "@discovery/prelude/lib/data/maybe";
import { useContext, useMemo } from "@discovery/common-tve/lib/hooks";
import { PageTemplate } from "@discovery/common-tve/lib/constants";

import { PageComponentId } from "../../site-builder/tve/mapping";

export type PageMetaType = {
  channelNameM: M.Maybe<string>;
  componentId: PageComponentId;
  isPlayerPage: boolean;
  templateId: PageTemplate;
};

const initContext: PageMetaType = {
  channelNameM: M.empty(),
  componentId: PageComponentId.Page,
  isPlayerPage: false,
  templateId: PageTemplate.Primary,
};

const PageMetaContext = createContext(initContext);

type PageMetaProviderType = PageMetaType & {
  children?: JSX.Element;
};

export const PageMetaProvider = ({
  channelNameM = M.empty(),
  componentId,
  isPlayerPage = false,
  templateId,
  children,
}: PageMetaProviderType) => {
  const value = useMemo(
    () => ({
      channelNameM,
      componentId,
      isPlayerPage,
      templateId,
    }),
    [componentId, channelNameM, isPlayerPage, templateId]
  );

  return (
    <PageMetaContext.Provider value={value}>
      {children}
    </PageMetaContext.Provider>
  );
};

export const usePageMeta: () => PageMetaType = () =>
  useContext(PageMetaContext);
