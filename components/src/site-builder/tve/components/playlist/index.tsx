import * as L from "@discovery/prelude/lib/data/list";
import { Fold } from "@discovery/prelude/lib/control/lens";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import { mkComponentMapItem } from "@discovery/template-engine/lib/component-map";
import { Reader } from "@discovery/common-tve/lib/reader";
import { Kind } from "../../../../components/tve/molecules/card";
import { _Col2ContentGridCardData } from "../content-grid/optics";
import { View } from "./view";
import { createPlayer } from "../../../../utils/tve/createPlayer";
import {
  _Col2Id,
  _Col2ColDataMeta,
  _ColAttributes2Title,
  _ColAttributes2Description,
  _Col2ComponentId,
  _ColAttributes2Alias,
} from "@discovery/sonic-api-ng-optics";

const getProps = (data: CollectionResponseData) => {
  const metaM = Fold.preview(_Col2ColDataMeta, data);
  const collectionIdM = Fold.preview(_Col2Id, data);
  const componentIdM = Fold.preview(_Col2ComponentId, data);

  const videoL = L.filter(
    (d) => d.kind === Kind.Video,
    Fold.toList(_Col2ContentGridCardData, data)
  );
  const titleM = Fold.view(_ColAttributes2Title, data);
  const descriptionM = Fold.view(_ColAttributes2Description, data);
  const aliasM = Fold.preview(_ColAttributes2Alias, data);

  return {
    collectionIdM,
    descriptionM,
    metaM,
    titleM,
    videoL,
    componentIdM,
    aliasM,
  };
};

type Props = ReturnType<typeof getProps>;

const mkPlaylist = (read: Reader) => {
  const Player = createPlayer(read);

  return ({
    collectionIdM,
    descriptionM,
    metaM,
    titleM,
    videoL,
    componentIdM,
    aliasM,
  }: Props) => (
    <View
      titleM={titleM}
      descriptionM={descriptionM}
      videoL={videoL}
      Player={Player}
      metaM={metaM}
      collectionIdM={collectionIdM}
      componentIdM={componentIdM}
      aliasM={aliasM}
    />
  );
};

export const ComponentMapItem = mkComponentMapItem(getProps, mkPlaylist);
