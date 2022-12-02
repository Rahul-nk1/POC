import * as O from "fp-ts/Option";
import * as M from "@discovery/prelude/lib/data/maybe";
import { Fold } from "@discovery/prelude/lib/control/lens";
import { PageResponseData } from "@discovery/sonic-api-ng/lib/api/cms/pages/resource";
import {
  Child,
  mkComponentMapItem,
} from "@discovery/template-engine/lib/component-map";
import { useMemo } from "@discovery/common-tve/lib/hooks";

import { PlaylistMetaProvider } from "../../../../utils/hooks/use-playlist-meta";

import { _PlaylistPageAttributes } from "../page/optics";
import { Props as ViewProps, View } from "../page/view";
import {
  PageWithContext,
  Props as ContextProps,
  getProps as getContextProps,
} from "../page-with-context";

type Props = ViewProps & {
  context: ContextProps;
};

const getProps = (data: PageResponseData): Props => {
  const pageAttributesM = Fold.preview(_PlaylistPageAttributes, data);
  const context = getContextProps(data);

  return { context, pageAttributesM };
};

const PlaylistPage = ({
  context,
  pageAttributesM,
  children,
}: Props & Child) => {
  const value = useMemo(
    () =>
      M.foldMapConst(
        (pageAttributes) => ({
          titleM: pageAttributes.title,
          descriptionM: pageAttributes.description,
        }),
        {
          titleM: O.none,
          descriptionM: O.none,
        },
        pageAttributesM
      ),
    [pageAttributesM]
  );

  return (
    <PageWithContext {...context}>
      <PlaylistMetaProvider
        titleM={value.titleM}
        descriptionM={value.descriptionM}
        playIndexM={O.none}
      >
        <View pageAttributesM={pageAttributesM}>{children}</View>
      </PlaylistMetaProvider>
    </PageWithContext>
  );
};

export const ComponentMapItem = mkComponentMapItem(
  getProps,
  () => PlaylistPage
);
