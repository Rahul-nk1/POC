import * as O from "fp-ts/Option";
import * as L from "@discovery/prelude/lib/data/list";
import { Fold } from "@discovery/prelude/lib/control/lens";
import {
  _Col2ArticleRichTextContentEntityMap,
  _Col2ArticleRichTextContentBlocks,
} from "@discovery/sonic-api-ng-optics";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import { AST } from "../../../../components/tve/molecules/rich-text-data/types";
import {
  Article,
  ArticleProps as Props,
} from "../../../../components/tve/organisms/article";
import { mkComponentMapItem } from "@discovery/template-engine/lib/component-map";

type EntityRange = {
  key: number;
  length: number;
  offset: number;
};

type StyleRange = {
  length: number;
  offset: number;
  style: string;
};

/*
 * TODO: Investigate if it would be a good idea to use draftjs types for both the Sonic API
 * and the Article view types from AST, because Sonic is supposed to follow that specification.
 */
export const getRichTextContentBlocks = (data: CollectionResponseData) =>
  L.map(
    (x) => ({
      data: O.getOrElse(() => ({}))(x.data),
      depth: O.getOrElse(() => 0)(x.depth),
      key: O.getOrElse(() => Math.random().toString())(x.key),
      text: x.text,
      type: x.type,
      entityRanges: O.getOrElse<Array<EntityRange>>(() => [])(x.entityRanges),
      inlineStyleRanges: O.getOrElse<Array<StyleRange>>(() => [])(
        x.inlineStyleRanges
      ),
    }),
    Fold.toList(_Col2ArticleRichTextContentBlocks, data)
  );

const getProps = (data: CollectionResponseData): Props => {
  const blockL = getRichTextContentBlocks(data);

  const entityMapM = Fold.preview(_Col2ArticleRichTextContentEntityMap, data);
  const bodyM: O.Option<AST> = O.some({
    blocks: blockL.toJSON(),
    entityMap: O.getOrElse(() => ({}))(entityMapM),
  });

  return { bodyM };
};

export const ComponentMapItem = mkComponentMapItem(getProps, () => Article);
