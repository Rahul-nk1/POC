import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import { List } from "@discovery/prelude/lib/data/list";
import { _Just } from "@discovery/prelude/lib/data/maybe";
import { Fold, Getter, Lens } from "@discovery/prelude/lib/control/lens";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import {
  EventDataProvider,
  triggerBrowseEvent,
} from "@discovery/common-tve/lib/eventing";
import { _Response } from "@discovery/sonic-api-ng/lib/japi/response";
import {
  Child,
  mkComponentMapItem,
} from "@discovery/template-engine/lib/component-map";
import { PageResponseData } from "@discovery/sonic-api-ng/lib/api/cms/pages/resource";
import { useEffect, useMemo } from "@discovery/common-tve/lib/hooks";
import {
  Metadata,
  MetadataProps,
} from "@discovery/common-tve/lib/components/metadata";

import { parseDefaultTabIndex } from "../../../../utils/default-tab-index";
import {
  NetworkSelector,
  NetworkSelectorTabType,
} from "../../../../components/tve/molecules/network-selector";
import { PageComponentId } from "../../mapping";
import { _NetWorkSelectorTabs, _Selected } from "./optics";
import { _PageAttributes } from "../page/optics";
import {
  PageWithContext,
  Props as ContextProps,
  getProps as getContextProps,
} from "../page-with-context";

import * as styles from "./styles.css";

import Option = O.Option;

const View = ({
  children,
  compIdM,
  tabs,
  selected,
  pageAttributesM,
}: ViewProps & Child) => {
  useEffect(() => triggerBrowseEvent(window.location), []);

  const metaM = useMemo(
    () =>
      pipe(
        pageAttributesM,
        O.map((pageAttributes) => <Metadata data={pageAttributes} />)
      ),
    [pageAttributesM]
  );

  return (
    <EventDataProvider componentIdM={compIdM}>
      <div className={styles.container}>
        <NetworkSelector tabL={tabs} selected={selected} />
        {children}
        <RenderMaybe>{metaM}</RenderMaybe>
      </div>
    </EventDataProvider>
  );
};

type ViewProps = {
  compIdM: Option<string>;
  selected: number;
  tabs: List<NetworkSelectorTabType>;
  pageAttributesM: Option<MetadataProps>;
};

type Props = ViewProps & { context: ContextProps };

const getProps = (data: PageResponseData): Props => {
  const tabs = Fold.toList(_NetWorkSelectorTabs, data);

  const compIdM = Fold.preview(
    Fold.compose(
      Getter.of<typeof data>(),
      _Response(),
      Lens.path("attributes", "component"),
      _Just(),
      Lens.prop("id")
    ),
    data
  );

  const selected = pipe(Fold.preview(_Selected, data), parseDefaultTabIndex);
  const pageAttributesM = Fold.preview(_PageAttributes, data);

  const context = getContextProps(data);

  return {
    compIdM,
    context,
    selected,
    pageAttributesM,
    tabs,
  };
};

export const TabbedPage = ({
  compIdM,
  context,
  selected,
  pageAttributesM,
  tabs,
  children,
}: Props & Child) => (
  <PageWithContext
    {...context}
    defaultPageComponentId={PageComponentId.TabbedPage}
  >
    <View
      tabs={tabs}
      compIdM={compIdM}
      selected={selected}
      pageAttributesM={pageAttributesM}
    >
      {children}
    </View>
  </PageWithContext>
);

export const ComponentMapItem = mkComponentMapItem(getProps, () => TabbedPage);
