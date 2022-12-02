import * as M from "@discovery/prelude/lib/data/maybe";
import { Fold, Lens } from "@discovery/prelude/lib/control/lens";
import { compose } from "@discovery/prelude/lib/data/function";
import * as CQ from "@discovery/sonic-api-ng/lib/api/common/query";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import { useSonicHttp, useEffect } from "@discovery/common-tve/lib/hooks";
import * as RD from "@discovery/prelude/lib/data/remote-data";
import {
  _Video2Routes,
  _Route2Attributes,
  _Video2Data,
} from "@discovery/sonic-api-ng-optics";
import * as Query from "@discovery/sonic-api-ng/lib/api/content/videos/query";
import {
  Response2Endpoint,
  getEndpoint,
} from "@discovery/sonic-api-ng/lib/api/common/endpoints";
import { Resource } from "@discovery/sonic-api-ng/lib/api/content/videos";
import { toQueryString } from "@discovery/sonic-api-ng/lib/query";
import { DEFAULT_DECORATORS } from "@discovery/common-tve/lib/constants";

// TODO: Currently getActiveVideoForShow from core, doesn’t accept
// params such as decorators. We need to find out the
// viewingHistory.
export const getActiveVideoForShowEndpoint = (
  showAlternateId: string,
  params: Query.Parameters = Query.parameters
): Response2Endpoint<Resource.VideoResponse> =>
  getEndpoint(
    Resource.videoRelationships,
    Resource.video,
    `/content/videos/${showAlternateId}/activeVideoForShow${toQueryString(
      Query.toQuery(params)
    )}`
  );

export const useActiveVideoForShow = (
  alternateIdM: M.Maybe<string>,
  isJIPShow?: boolean
) => {
  const alternateId = M.fromMaybe(alternateIdM, undefined);
  const [response, getActiveVideoForShow] = useSonicHttp(
    getActiveVideoForShowEndpoint
  );

  useEffect(() => {
    if (alternateId && !isJIPShow) {
      getActiveVideoForShow(
        alternateId,
        compose(
          Query.lenses.decorators.set(
            CQ.Decorators.decorators(...DEFAULT_DECORATORS)
          )
        )(Query.parameters)
      );
    }
  }, [getActiveVideoForShow, isJIPShow, alternateId]);
  return RD.map((newData) => {
    const activeVideoM = Fold.preview(
      Fold.liftM(
        (url, attributes, viewingHistory) => ({
          url,
          attributes,
          viewingHistory,
        }),
        Fold.compose(_Video2Routes, _Route2Attributes, Lens.prop("url")),
        Fold.compose(_Video2Data, Lens.prop("attributes")),
        Fold.compose(
          _Video2Data,
          Lens.path("attributes", "viewingHistory"),
          M._Just()
        )
      ),
      Res.map(({ data }) => data, newData)
    );
    return activeVideoM;
  }, response);
};
