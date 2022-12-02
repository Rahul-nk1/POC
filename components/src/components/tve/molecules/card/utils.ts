import * as M from "@discovery/prelude/lib/data/maybe";
import * as O from "@discovery/sonic-api-ng-optics";
import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import * as RD from "@discovery/prelude/lib/data/remote-data";
import * as Fold from "@discovery/prelude/lib/control/lens/fold";
import * as Lens from "@discovery/prelude/lib/control/lens/lens";
import { compose } from "@discovery/prelude/lib/data/function";
import * as CQ from "@discovery/sonic-api-ng/lib/api/common/query";
import {
  _VideoResponseGetter,
  _Video2Attributes,
  _Video2Routes,
} from "@discovery/sonic-api-ng-optics";
import * as Videos from "@discovery/sonic-api-ng/lib/api/content/videos";
import { useEffect, useSonicHttp } from "@discovery/common-tve/lib/hooks";

import { Content, Kind } from "./types";
import { LinkKind } from "../../atoms/link";
import { _updateURL } from "../../../../utils/authURL";

export const shouldDisplayLock = (content: Content) => {
  const isLiveM = content.kind === "video" ? content.isLiveM : M.empty();
  const isLive = Option.getOrElse(() => false)(isLiveM);
  const { channelAttrM = M.empty() } = content;
  const channelPlaybackAllowed = Option.getOrElse(() => false)(
    pipe(
      channelAttrM,
      Option.chain(({ playbackAllowed }) => playbackAllowed)
    )
  );

  return (
    content.kind === Kind.Video &&
    (isLive ? !channelPlaybackAllowed : !content.playbackAllowed)
  );
};

type GetLink = {
  lockedForAnonymous: boolean;
  hrefM: M.Maybe<string>;
  loginUrlM: M.Maybe<string>;
  linkKind?: LinkKind;
};

/**
 * Will return affiliate login link if the user not signed in
 * instead of the card link
 */
export const getCardLink = ({
  lockedForAnonymous,
  hrefM,
  loginUrlM,
  linkKind = LinkKind.internal,
}: GetLink) =>
  lockedForAnonymous
    ? {
        hrefM: M.liftM(
          _updateURL,
          loginUrlM,
          M.map(
            (href) => ({
              key: "returnUrl",
              value: `${window.location.origin}${href}`,
            }),
            hrefM
          )
        ),
        linkKind: LinkKind.external,
      }
    : { hrefM, linkKind };

// TODO fix this in core so we can use that instead of patching
export const _VideoResponse2Video = Fold.map(
  (res) => Res.map((x) => x.data, res),
  _VideoResponseGetter
);

const params = compose(
  Videos.Query.lenses.decorators.set(
    CQ.Decorators.decorators("playbackAllowed")
  )
)(Videos.Query.parameters);

export const useParentContent = (content: Content): Content => {
  const [parentVideoRD, getParentVideo] = useSonicHttp(
    Videos.Endpoints.getVideo
  );
  // Must be declared as var for use in useEffect.
  const { kind } = content;
  // Type checker fails if we use kind variable from above. So we must use content.kind
  const videoTypeM = content.kind === "video" ? content.videoTypeM : M.empty();
  const parentIdM = content.kind === "video" ? content.parentIdM : M.empty();

  useEffect(() => {
    const effectM = M.map(
      (parentId) =>
        kind === "video" && M.equals(videoTypeM, M.of("LISTING"))
          ? () => getParentVideo(parentId, params)
          : () => {},
      parentIdM
    );

    const effect = M.fromMaybe(effectM, () => {});

    effect();
  }, [kind, videoTypeM, parentIdM, getParentVideo]);

  const linklessContent: Content = { ...content, linkM: M.empty() };

  if (!M.equals(videoTypeM, M.of("LISTING"))) {
    return content;
  }

  return RD.fromRD(
    {
      notAsked: () => linklessContent,
      loading: () => linklessContent,
      failure: () => linklessContent,
      success: (content) => content,
    },
    RD.chain((parentVideoRes) => {
      const parentAttributesM = Fold.preview(
        Fold.compose(_VideoResponse2Video, _Video2Attributes),
        parentVideoRes
      );
      const linkM = Fold.preview(
        Fold.compose(
          _VideoResponse2Video,
          _Video2Routes,
          O._Route2AttributesFiltered({ canonical: true }),
          Lens.prop("url")
        ),
        parentVideoRes
      );

      const parentContentM = M.map(
        (attr) => ({
          ...content,
          playbackAllowed: M.fromMaybe(attr.playbackAllowed, true),
          linkM,
        }),
        parentAttributesM
      );

      return M.fromMaybe(
        M.map((parentContent) => RD.success(parentContent), parentContentM),
        RD.failure(new Error("Failed to validate data"))
      );
    }, parentVideoRD)
  );
};
