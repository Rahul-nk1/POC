import { Fold } from "@discovery/prelude/lib/control/lens";
import * as Option from "fp-ts/Option";
import { PageResponseData } from "@discovery/sonic-api-ng/lib/api/cms/pages/resource";
import { _Page2TemplateId } from "@discovery/sonic-api-ng-optics";
import * as L from "@discovery/prelude/lib/data/list";
import { pipe } from "fp-ts/function";

import {
  Child,
  mkComponentMapItem,
} from "@discovery/template-engine/lib/component-map";
import {
  useLayoutEffect,
  useEffect,
  useGlobalStateModifier,
} from "@discovery/common-tve/lib/hooks";
import { GlobalState } from "@discovery/common-tve/lib/state";

import { ComponentId, PageComponentId } from "../../../tve/mapping";

import {
  _Page2CollectionComponentId,
  _PageAttributes,
  _PagePrimaryContentShowId,
  _PagePrimaryContentVideoId,
} from "./optics";

import { Props as ViewProps, View } from "./view";
import {
  PageWithContext,
  Props as ContextProps,
  getProps as getContextProps,
} from "../page-with-context";
import { Kind } from "../../../../components/tve/molecules/card";

type Props = ViewProps & {
  context: ContextProps;
  templateIdM: Option.Option<string>;
  contentTypeM: Option.Option<string>;
};

const getProps = (data: PageResponseData): Props => {
  const pageAttributesM = Fold.preview(_PageAttributes, data);
  const context = getContextProps(data);
  const templateIdM = Fold.preview(_Page2TemplateId, data);
  const primaryVideoContentIdM = Fold.preview(_PagePrimaryContentVideoId, data);
  const primaryShowContentIdM = Fold.preview(_PagePrimaryContentShowId, data);
  const contentTypeM = pipe(
    L.find(
      (c) => c === ComponentId.Playlist,
      Fold.toList(_Page2CollectionComponentId, data)
    ),
    Option.alt(() =>
      Option.isSome(primaryShowContentIdM)
        ? Option.fromNullable(Kind.Show.toString())
        : Option.none
    ),
    Option.alt(() =>
      Option.isSome(primaryVideoContentIdM)
        ? Option.fromNullable(Kind.Video.toString())
        : Option.none
    )
  );
  return { pageAttributesM, context, templateIdM, contentTypeM };
};

const Page = ({
  context,
  pageAttributesM,
  children,
  templateIdM,
  contentTypeM,
}: Props & Child) => {
  const updateState = (st: GlobalState) => ({
    ...st,
    currentPage: {
      componentId: PageComponentId.Page,
      templateIdM,
    },
  });
  const modifyState = useGlobalStateModifier(updateState);

  useEffect(() => {
    modifyState();
  }, [modifyState]);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0 });
  });

  return (
    <PageWithContext {...context}>
      <View pageAttributesM={pageAttributesM} contentTypeM={contentTypeM}>
        {children}
      </View>
    </PageWithContext>
  );
};

export const ComponentMapItem = mkComponentMapItem(getProps, () => Page);
