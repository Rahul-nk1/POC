import * as Option from "fp-ts/Option";
import { Fold } from "@discovery/prelude/lib/control/lens";
import { _Col2ArticleRichTextContentEntityMap } from "@discovery/sonic-api-ng-optics";
import {
  ErrorWall,
  Props,
} from "../../../../components/tve/molecules/error-wall";
import { _BackgroundImage } from "./optics";
import { AST } from "../../../../components/tve/molecules/rich-text-data/types";
import { getRichTextContentBlocks } from "../../../tve/components/article";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import { mkComponentMapItem } from "@discovery/template-engine/lib/component-map";

export const getProps = (data: CollectionResponseData): Props => {
  const blockL = getRichTextContentBlocks(data);
  const entityMapM = Fold.preview(_Col2ArticleRichTextContentEntityMap, data);
  const bodyM: Option.Option<AST> = Option.some({
    blocks: blockL.toJSON(),
    entityMap: Option.getOrElse(() => ({}))(entityMapM),
  });
  const backgroundImageM = Fold.preview(_BackgroundImage, data);

  return { bodyM, backgroundImageM };
};

export const ComponentMapItem = mkComponentMapItem(getProps, () => ErrorWall);
