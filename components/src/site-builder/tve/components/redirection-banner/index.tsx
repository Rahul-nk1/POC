import { Fold } from "@discovery/prelude/lib/control/lens";
import * as Optics from "@discovery/sonic-api-ng-optics";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import { mkComponentMapItem } from "@discovery/template-engine/lib/component-map";
import { EventDataProvider } from "@discovery/common-tve/src/eventing";
import { _CollectionGetter } from "@discovery/sonic-api-ng-optics";

const getProps = (data: CollectionResponseData) => {
  const componentIdM = Fold.preview(Optics._Col2ComponentId, data);
  console.log(_RedirectionBannerLogo);
  return componentIdM;
};
const ReidrectionBanner = (props: any) => (
  <EventDataProvider componentIdM={props.componentIdM}>
    <div>hai</div>
  </EventDataProvider>
);

export const ComponentMapItem = mkComponentMapItem(
  getProps,
  () => ReidrectionBanner
);
