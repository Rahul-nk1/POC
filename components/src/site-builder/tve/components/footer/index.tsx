import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource"
import { mkComponentMapItem } from "@discovery/template-engine/lib/component-map"
import { EventDataProvider } from "@discovery/common-tve/lib/eventing"
import { Fold } from "@discovery/prelude/lib/control/lens"
import { _IconLinkItems, _LinkItems, _CopyRightsItem } from "./optics"
import * as Optics from "@discovery/sonic-api-ng-optics"
import { Footer } from "../../../../components/tve/organisms/footer"

const getProps = (data: CollectionResponseData) => {
  const componentIdM = Fold.preview(Optics._Col2ComponentId, data)
  const linksL = Fold.toList(_LinkItems, data)
  const iconsLinksL = Fold.toList(_IconLinkItems, data)
  const copyrights = Fold.view(_CopyRightsItem, data)
  return {
    componentIdM,
    linksL,
    iconsLinksL,
    copyrights
  }
}
type Props = ReturnType<typeof getProps>
export const FooterComponent = ({ componentIdM, linksL, iconsLinksL, copyrights }: Props) => {
  return (
    <EventDataProvider metaTag="web-footer (component-creator)" componentIdM={componentIdM}>
      <Footer linksL={linksL} iconLinksL={iconsLinksL} title={copyrights} />
    </EventDataProvider>
  )
}
export const ComponentMapItem = mkComponentMapItem(getProps, () => FooterComponent)
