import * as L from "@discovery/prelude/lib/data/list";
import * as Optics from "@discovery/sonic-api-ng-optics";
import { Fold } from "@discovery/prelude/lib/control/lens";
import { useMemo } from "@discovery/common-tve/lib/hooks";
import { EventDataProvider } from "@discovery/common-tve/lib/eventing";

import { _Tabs } from "./optics";
import { InlineProps } from "../../utils/inline-rendering";
import { TemplateEngine } from "../../utils/inline-rendering";
import { mkComponentMapItem } from "@discovery/template-engine/lib/component-map";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";

import { TabbedComponent } from "../../../../components/tve/molecules/tabbed-component";

const getProps = (data: CollectionResponseData) => {
  const tabs = Fold.toList(_Tabs, data);
  const componentIdM = Fold.preview(Optics._Col2ComponentId, data);

  return {
    componentIdM,
    tabs,
  };
};

export type Props = ReturnType<typeof getProps> & InlineProps;

const View = ({ tabs, componentIdM, ...props }: Props) => {
  const tabsL = useMemo(
    () =>
      L.map(
        ({ collection, ...tab }) => ({
          ...tab,
          content: (
            <TemplateEngine
              response={collection}
              showTitle={false}
              showChannelLogo
              collectionRequest={props.collectionRequest}
              onClick={props.onClick}
            />
          ),
        }),
        tabs
      ),
    [tabs, props.collectionRequest, props.onClick]
  );

  return (
    <EventDataProvider componentIdM={componentIdM}>
      <TabbedComponent tabsL={tabsL} />
    </EventDataProvider>
  );
};

export const ComponentMapItem = mkComponentMapItem(getProps, () => View);
