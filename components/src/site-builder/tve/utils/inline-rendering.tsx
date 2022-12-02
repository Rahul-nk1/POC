/**
 * This module defines extra utilities used when rendering _inline_ resopnses.
 */
import { memo } from "react";
import { pipe } from "fp-ts/function";
import * as Option from "fp-ts/Option";
import * as L from "@discovery/prelude/lib/data/list";
import * as Remote from "@discovery/prelude/lib/data/remote-data";
import { Collections } from "@discovery/sonic-api-ng/lib/api/cms";
import * as Query from "@discovery/sonic-api-ng/lib/api/cms/routes/query";
import * as CQ from "@discovery/sonic-api-ng/lib/api/common/query";
import { DEFAULT_DECORATORS } from "@discovery/common-tve/lib/constants";
import { getRoute } from "@discovery/sonic-api-ng/lib/api/cms/routes/endpoints";
import { getCollection } from "@discovery/sonic-api-ng/lib/api/cms/collections/endpoints";
import { triggerVideoPlayerEvent } from "@discovery/common-tve/lib/eventing";
import {
  useCallback,
  useEffect,
  useSonicHttp,
  useMemo,
} from "@discovery/common-tve/lib/hooks";

import * as Annotate from "@discovery/template-engine/lib/annotate";
import {
  Child,
  ComponentMap,
  mkComponentMapItem,
} from "@discovery/template-engine/lib/component-map";
import {
  TemplateEngineResponse,
  fromAlgebra,
} from "@discovery/template-engine/lib/template-engine";
import { Breadcrumbs } from "@discovery/template-engine/lib/transformers/breadcrumbs";
import { Algebra2 } from "@discovery/template-engine/lib/utils/rec";
import { Content, Kind } from "../../../components/tve/molecules/card/types";

import { ComponentId } from "../mapping";
import * as ContentGrid from "../components/content-grid";
import * as TabbedContent from "../components/tabbed-content";
import * as Hero from "../components/hero";

/**
 * Extra props that will be injected when components are rendered inline.
 */
export type InlineProps = {
  showTitle?: boolean;
  showChannelLogo?: boolean;
  onClick?: (e: React.MouseEvent, content: Content) => void;
  collectionRequest?: (
    page: Collections.Query.One.Page
  ) => Collections.Query.One.Parameters;
};

export type TemplateEngineProps = {
  response: TemplateEngineResponse;
};

export const params = Query.lenses.decorators.set(
  CQ.Decorators.decorators(...DEFAULT_DECORATORS)
)(Query.parameters);

function mkInlineAlgebra(
  shared: InlineProps,
  componentMap: ComponentMap<Record<string, never>>
): Algebra2<Annotate.URI, Breadcrumbs, JSX.Element> {
  return function (node: Annotate.AnnNode<Breadcrumbs, JSX.Element>) {
    return pipe(
      node,
      Option.fromPredicate(Annotate.isNotNil),
      Option.chain(({ id, children, response, annotation }) =>
        pipe(
          // Option<Rank2ComponentMapItem>: fetch Rank2ComponentMapItem from component map
          Option.fromNullable(componentMap[id]),
          // In case we don't find the component default to "default",
          // which is enforced to be in the component map
          Option.alt(() => {
            console.info(
              "%cNo mapping for",
              "background: linear-gradient(90deg,violet,lime)",
              id
            );

            return Option.some(componentMap.default);
          }),
          // Option<Node<_>>: apply the function to get actual Node
          Option.ap(Option.some(undefined)),
          // Option<React.ComponentType>: extract the component,
          Option.map((nb) => {
            const Comp = nb.Component(
              {},
              annotation.breadcrumbs
            ) as React.ComponentType;
            const props = nb.getProps(response);

            return (
              <Comp {...shared} {...props}>
                {L.toArray(children)}
              </Comp>
            );
          })
        )
      ),
      Option.getOrElse(() => (null as unknown) as JSX.Element)
    );
  };
}

// TODO: This should be in `components-luna'
// and it is starting from v4.0.2
const PassThrough = mkComponentMapItem(
  () => undefined,
  () => ({ children }: Child) => <>{children}</>
);

export const inlineMap: ComponentMap<Record<string, never>> = {
  [ComponentId.ContentGrid]: ContentGrid.ComponentMapItem,
  [ComponentId.TabbedContent]: TabbedContent.ComponentMapItem,
  [ComponentId.Hero]: Hero.ComponentMapItem,
  default: PassThrough,
};

export const TemplateEngine = memo(
  ({
    response,
    showTitle,
    showChannelLogo,
    onClick,
    collectionRequest,
  }: InlineProps & TemplateEngineProps) => {
    const templateEngine = useMemo(
      () =>
        fromAlgebra(
          mkInlineAlgebra(
            { showTitle, showChannelLogo, onClick, collectionRequest },
            inlineMap
          )
        ),
      [showTitle, showChannelLogo, onClick, collectionRequest]
    );

    const view = useMemo(() => templateEngine(response), [
      templateEngine,
      response,
    ]);

    return view;
  }
);

const noop = () => (null as unknown) as JSX.Element;

export const InlineRouteRenderer = memo(({ route }: { route: string }) => {
  const [remote, request] = useSonicHttp(getRoute);

  useEffect(() => {
    const withoutSlash = route.replace(/^\//, "");
    request(withoutSlash, params);
  }, [route, request]);

  const handleClick: NonNullable<InlineProps["onClick"]> = useCallback(
    (_, content) => {
      if (content.kind === Kind.Video) {
        triggerVideoPlayerEvent(content.id);
      }
    },
    []
  );

  return Remote.fromRD(
    {
      notAsked: noop,
      loading: noop,
      failure: noop,
      success: (response) => (
        <TemplateEngine response={response} onClick={handleClick} />
      ),
    },
    remote
  );
});

export const InlineCollectionRenderer = memo(
  ({ collection }: { collection: string }) => {
    const [remote, request] = useSonicHttp(getCollection);

    useEffect(() => {
      request(collection);
    }, [collection, request]);

    return Remote.fromRD(
      {
        notAsked: noop,
        loading: noop,
        failure: noop,
        success: (response) => <TemplateEngine response={response} />,
      },
      remote
    );
  }
);
