import * as M from "@discovery/prelude/lib/data/maybe";
import * as Links from "@discovery/sonic-api-ng/lib/api/cms/links";
import * as E from "@discovery/prelude/lib/data/either";
import { head } from "@discovery/prelude/lib/data/iterable";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import * as V from "@discovery/prelude/lib/data/validated";
import {
  Collections,
  Images,
  CollectionItems,
} from "@discovery/sonic-api-ng/lib/api/cms";
import * as TaxonomyNode from "@discovery/sonic-api-ng/lib/api/cms/taxonomy-node";
import { Fold, Lens } from "@discovery/prelude/lib/control/lens";
import * as O from "@discovery/sonic-api-ng-optics";
import * as L from "@discovery/prelude/lib/data/list";
import {
  Article,
  Channel,
  Content,
  Image,
  Kind,
  Link,
  Show,
  Video,
} from "../../../../components/tve/molecules/card/types";
import {
  VideoData,
  VideoResponseData,
} from "@discovery/sonic-api-ng/lib/api/content/videos/resource";
import { ChannelData } from "@discovery/sonic-api-ng/lib/api/content/channels/resource";
import {
  ShowData,
  ShowResponseData,
} from "@discovery/sonic-api-ng/lib/api/content/shows/resource";
import { LinkData } from "@discovery/sonic-api-ng/lib/api/cms/links/resource";
import { ArticleData } from "@discovery/sonic-api-ng/lib/api/cms/articles/resource";
import { RouteData } from "@discovery/sonic-api-ng/lib/api/cms/routes/resource";
import {
  _ColResponse2Col,
  _GetCustomAttributesForComponent,
  _CollectionGetter,
  _Image2Attributes,
  _Col2Attributes,
} from "@discovery/sonic-api-ng-optics";
import {
  getProgressM,
  getLiveProgressM,
} from "../../../../utils/get-progress-m";
import { Kind as ContentGridKind } from ".";
import { _SecondaryImage } from "../../../../utils/optics/secondary-image";
import { Option } from "fp-ts/lib/Option";
import { just } from "@discovery/common-tve/src/optics/just";

const _Url = Fold.pre(
  Fold.compose(
    Res._Alt(
      Fold.compose(O._ColItem2Video, Res._Rel("routes")),
      Fold.compose(O._ColItem2Show, Res._Rel("routes")),
      Fold.compose(O._ColItem2Channel, Res._Rel("routes")),
      Fold.compose(O._ColItem2Link, Res._Rel("linkedContentRoutes"))
    ),
    Res._ForEach(),
    O._Route2AttributesFiltered({ canonical: true }),
    Lens.prop("url")
  )
);

// TODO: I dont think this is the perfect solution. We should have the lenses
// parameterized and then have component-creator send in which one it wants
// depending on template
const inImageOrder = (kind: ContentGridKind) => {
  switch (kind) {
    case "poster-secondary":
    case "poster-primary": {
      return Fold.alt(
        O._ImagesOfKind("poster_with_logo"),
        O._ImagesOfKind("poster"),
        O._ImagesOfKind("default")
      );
    }
    default: {
      return Fold.alt(
        O._ImagesOfKind("default"),
        O._ImagesOfKind("poster_with_logo"),
        O._ImagesOfKind("poster")
      );
    }
  }
};

// @TODO: evaluate if this is for ATVE also
// Some DPlus cards "expand" to show a different image when hovered so Content
// has to include an expandedImageM property to show
type Images = {
  imageM: M.Maybe<Images.Resource.ImageData["attributes"]>;
  expandedImageM: M.Maybe<Images.Resource.ImageData["attributes"]>;
};

const _Image = (
  kind: ContentGridKind
): Fold.Fold<CollectionItems.Resource.CollectionItemResponseData, Images> =>
  Fold.liftM(
    (imageM, expandedImageM) => ({ imageM, expandedImageM }),
    Fold.pre(
      Fold.compose(
        Res._Alt(
          Fold.compose(O._ColItem2Video, Res._Rel("images")),
          Fold.compose(O._ColItem2Show, Res._Rel("images")),
          Fold.compose(O._ColItem2Channel, Res._Rel("images")),
          Fold.compose(O._ColItem2Link, Res._Rel("images")),
          Fold.compose(
            O._ColItem2Image,
            Fold.mapF((r) => Res.map(L.of, r))
          )
          /**
           * TODO: This lens article to images does not exist, should we add it?
           * Fold.compose(O._ColItem2Article, O._Article2Images, Res._ForEach())
           */
        ),
        inImageOrder(kind),
        O._Image2Attributes
      )
    ),
    Fold.pre(_SecondaryImage)
  );

const oneToOneRelationships = { txBadges: TaxonomyNode.Resource.target };

const _Video2Badge = Fold.pre(
  Fold.compose(
    O._ColItem2Video,
    Fold.mapF(Res.addNewRelationships(oneToOneRelationships)),
    Res._Rel("txBadges"),
    Res._Response()
  )
);

const _Show2Badge = Fold.pre(
  Fold.compose(
    O._ColItem2Show,
    Fold.mapF(Res.addNewRelationships(oneToOneRelationships)),
    Res._Rel("txBadges"),
    Res._Response()
  )
);

export const _AsyncCollection = Fold.compose(
  _Col2Attributes,
  Lens.prop("async"),
  M._Just()
);

export const _Badge = (
  foldAdapter: Fold.Fold<
    CollectionItems.Resource.CollectionItemResponseData,
    Option<TaxonomyNode.Resource.TaxonomyNodeData>
  >
) =>
  Fold.pre(
    Fold.compose(
      foldAdapter,
      Fold.compose(
        Fold.mapF((dataM) =>
          M.foldMapConst(
            (taxonomies) =>
              L.isList<TaxonomyNode.Resource.TaxonomyNodeData>(taxonomies)
                ? L.head(taxonomies)
                : L.head(L.of(taxonomies)),
            M.empty(),
            dataM
          )
        ),
        M._Just(),
        Lens.path("attributes", "name"),
        M._Just()
      )
    )
  );

export const _ShowName: Fold.Fold<
  CollectionItems.Resource.CollectionItemResponseData,
  M.Maybe<string>
> = Fold.pre(
  Fold.compose(
    O._ColItem2Video,
    O._Video2Show,
    O._Show2Attributes,
    Lens.prop("name")
  )
);

export const _VideoShowUrl: Fold.Fold<
  CollectionItems.Resource.CollectionItemResponseData,
  M.Maybe<string>
> = Fold.pre(
  Fold.compose(
    O._ColItem2Video,
    O._Video2Show,
    O._Show2Routes,
    O._Route2AttributesFiltered({ canonical: true }),
    Lens.prop("url")
  )
);

const _Video2ChannelLogoImage: Fold.Fold<
  VideoResponseData,
  Images.Resource.ImagesResponseData
> = Fold.compose(O._Video2PrimaryChannel, Res._Rel("images"));

const _Show2ChannelLogoImage: Fold.Fold<
  ShowResponseData,
  Images.Resource.ImagesResponseData
> = Fold.compose(O._Show2PrimaryChannel, Res._Rel("images"));

export const _ChannelLogoImage: Fold.Fold<
  CollectionItems.Resource.CollectionItemResponseData,
  M.Maybe<Images.Resource.ImageData["attributes"]>
> = Fold.pre(
  Fold.compose(
    Res._Alt(
      Fold.compose(O._ColItem2Video, _Video2ChannelLogoImage),
      Fold.compose(O._ColItem2Show, _Show2ChannelLogoImage)
    ),
    Res._Alt(
      O._ImagesOfKind("logo_attribution"),
      O._ImagesOfKind("logo_grayscale"),
      O._ImagesOfKind("logo"),
      O._ImagesOfKind("default")
    ),
    O._Image2Attributes
  )
);

const parentRelValidation = V.record({
  parent: just(
    V.record({
      data: V.record({ id: V.string, type: V.literal("video") }),
    })
  ),
});

const _ParentId: Fold.Fold<
  CollectionItems.Resource.CollectionItemResponseData,
  M.Maybe<string>
> = Fold.compose(
  O._ColItem2Video,
  Fold.mapF((r) => Res.map((x) => x.relationships, r)),
  Res._Response(),
  M._Just(),
  Fold.mapF((rel) => {
    // HACK we are doing manual validation because Sonic sends back bad data!
    // It provides an id for the parent object, but no corresponding object in the
    // `included` list, so normal validation fails. So we just have to get the ID
    // now and manually fetch the video data later.
    const relE = V.validate(parentRelValidation, rel);
    const parentIdM = E.foldMapConst(
      (rel) => M.map((parent) => parent.data.id, rel.parent),
      M.empty(),
      relE
    );
    return parentIdM;
  })
);

const _Video2ChannelRoute: Fold.Fold<
  VideoResponseData,
  RouteData["attributes"]
> = Fold.compose(
  Fold.compose(O._Video2PrimaryChannel, O._Channel2Routes),
  O._Route2Attributes
);

const _Show2ChannelRoute: Fold.Fold<
  ShowResponseData,
  RouteData["attributes"]
> = Fold.compose(
  Fold.compose(O._Show2PrimaryChannel, O._Channel2Routes),
  O._Route2Attributes
);

export const _ChannelRoute: Fold.Fold<
  CollectionItems.Resource.CollectionItemResponseData,
  M.Maybe<RouteData["attributes"]>
> = Fold.pre(
  Fold.alt(
    Fold.compose(O._ColItem2Video, _Video2ChannelRoute),
    Fold.compose(O._ColItem2Show, _Show2ChannelRoute)
  )
);

export const _ChannelAttr: Fold.Fold<
  CollectionItems.Resource.CollectionItemResponseData,
  M.Maybe<ChannelData["attributes"]>
> = Fold.pre(
  Fold.compose(
    Fold.concat(
      Fold.compose(O._ColItem2Video, O._Video2PrimaryChannel),
      Fold.compose(O._ColItem2Show, O._Show2PrimaryChannel)
    ),
    O._Channel2Attributes
  )
);

type ChannelInfo = {
  image: M.Maybe<Images.Resource.ImageData["attributes"]>;
  route: M.Maybe<RouteData["attributes"]>;
  channelAttr: M.Maybe<ChannelData["attributes"]>;
};

const _ChannelInfo: Fold.Fold<
  CollectionItems.Resource.CollectionItemResponseData,
  ChannelInfo
> = Fold.liftM(
  (image, route, channelAttr) => ({
    image,
    route,
    channelAttr,
  }),
  _ChannelLogoImage,
  _ChannelRoute,
  _ChannelAttr
);

// eslint-disable-next-line @typescript-eslint/ban-types
type NotNull = {};

// TODO: This is not a great abstraction. Please improve
// ImageM needs to be the last one so we can get a `imageM -> Output`
type AdapterBasic<Input extends NotNull, Output extends NotNull> = (
  data: Input,
  pathM: M.Maybe<string>
) => ({ imageM, expandedImageM }: Images) => Output;

type AdapterWithBadge<Input extends NotNull, Output extends NotNull> = (
  data: Input,
  pathM: M.Maybe<string>
) => ({ imageM, expandedImageM }: Images) => Output;

type AdapterWithChannel<Input extends NotNull, Output extends NotNull> = (
  data: Input,
  pathM: M.Maybe<string>,
  channel: ChannelInfo,
  badgeM: M.Maybe<string>
) => ({ imageM, expandedImageM }: Images) => Output;

type AdapterWithChannelAndShow<
  Input extends NotNull,
  Output extends NotNull
> = (
  data: Input,
  pathM: M.Maybe<string>,
  channelAttrM: ChannelInfo,
  badgeM: M.Maybe<string>,
  showNameM: M.Maybe<string>,
  parent: M.Maybe<string>,
  showUrlM: M.Maybe<string>
) => ({ imageM, expandedImageM }: Images) => Output;

const _mergeContent = <
  Video extends NotNull,
  Show extends NotNull,
  Channel extends NotNull,
  Link extends NotNull,
  Image extends NotNull,
  Article extends NotNull
>({
  videoAdapter,
  showAdapter,
  channelAdapter,
  linkAdapter,
  imageAdapter,
  articleAdapter,
}: {
  videoAdapter: AdapterWithChannelAndShow<VideoData, Video>;
  showAdapter: AdapterWithChannel<ShowData, Show>;
  channelAdapter: AdapterWithBadge<ChannelData, Channel>;
  linkAdapter: AdapterBasic<LinkData, Link>;
  imageAdapter: AdapterBasic<Images.Resource.ImageData, Image>;
  articleAdapter: AdapterBasic<ArticleData, Article>;
}): Fold.Fold<
  CollectionItems.Resource.CollectionItemResponseData,
  ({
    imageM,
    expandedImageM,
  }: Images) => Video | Show | Channel | Link | Image | Article
> =>
  Fold.alt<
    CollectionItems.Resource.CollectionItemResponseData,
    ({
      imageM,
      expandedImageM,
    }: Images) => Video | Show | Channel | Link | Image | Article
  >(
    Fold.liftM(
      videoAdapter,
      Fold.compose(O._ColItem2Video, O._Video2Data),
      _Url,
      _ChannelInfo,
      _ShowName,
      _VideoShowUrl,
      _Badge(_Video2Badge),
      _ParentId
    ),
    Fold.liftM(
      showAdapter,
      Fold.compose(O._ColItem2Show, O._Show2Data),
      _Url,
      _ChannelInfo,
      _Badge(_Show2Badge)
    ),
    Fold.liftM(
      channelAdapter,
      Fold.compose(O._ColItem2Channel, O._Channel2Data),
      _Url
    ),
    Fold.liftM(linkAdapter, Fold.compose(O._ColItem2Link, O._Link2Data), _Url),
    Fold.liftM(
      imageAdapter,
      Fold.compose(O._ColItem2Image, O._Image2Data),
      _Url
    ),
    Fold.liftM(
      articleAdapter,
      Fold.compose(O._ColItem2Article, O._Article2Data),
      _Url
    )
  );

/**
 * Useful abstraction when you want to pick out video, show, channel, link, image and article data from a
 * collection item and convert each of those into a type to be used as props to some component.
 * Imagine the usecase where you want to populate a "Hero" component with the title or some other data from
 * whichever of these data types has been put as a child to that component in the Sonic Site Builder.
 */
export const mergeContent = <
  Video extends NotNull,
  Show extends NotNull,
  Channel extends NotNull,
  Link extends NotNull,
  Image extends NotNull,
  Article extends NotNull
>(adapters: {
  videoAdapter: AdapterWithChannelAndShow<VideoData, Video>;
  showAdapter: AdapterWithChannel<ShowData, Show>;
  channelAdapter: AdapterWithBadge<ChannelData, Channel>;
  linkAdapter: AdapterBasic<LinkData, Link>;
  imageAdapter: AdapterBasic<Images.Resource.ImageData, Image>;
  articleAdapter: AdapterBasic<ArticleData, Article>;
}) => (
  template: ContentGridKind
): Fold.Fold<
  CollectionItems.Resource.CollectionItemResponseData,
  Video | Show | Channel | Link | Image | Article
> =>
  // Grab the image based on template. Then use it on the adapters that all have
  // been partially applied until `imageM -> Output` is left. We then use `ap`
  // to apply the `imageM` to the function
  Fold.ap(_mergeContent(adapters), _Image(template));

/**
 * TODO: These are partially done.
 * Missing attributes need to be added and also missing types of sum-type Content.
 */
export const buildVideoCardProps = (
  { attributes, id }: VideoData,
  path: M.Maybe<string>,
  channel: ChannelInfo,
  showNameM: M.Maybe<string>,
  showUrlM: M.Maybe<string>,
  badgeM: M.Maybe<string>,
  parentIdM: M.Maybe<string>
) => ({ imageM, expandedImageM }: Images): Video => {
  const ratingM = M.map(
    (q) => q.code,
    M.chain((contentRatings) => head(contentRatings), attributes.contentRatings)
  );

  const isLiveM = M.liftM(
    (start, end) => {
      const now = new Date();
      return now >= start && now <= end;
    },
    attributes.scheduleStart,
    attributes.scheduleEnd
  );

  const progressM = M.fromMaybe(isLiveM, false)
    ? getLiveProgressM(attributes)
    : getProgressM(attributes);

  const channelIdM = M.liftM(
    (attr) => M.fromMaybe(attr.channelCode, ""),
    channel.channelAttr
  );

  const playbackAllowed = M.fromMaybe(attributes.playbackAllowed, true);

  return {
    id,
    isFavoriteM: attributes.isFavorite,
    isNewM: attributes.isNew,
    kind: Kind.Video,
    videoTypeM: attributes.videoType,
    titleM: M.of(attributes.name),
    descriptionM: attributes.description,
    scheduleStartM: attributes.scheduleStart,
    scheduleEndM: attributes.scheduleEnd,
    isLiveM,
    imageM,
    expandedImageM,
    linkM: M.fromMaybe(isLiveM, false)
      ? M.map((channelRoute) => channelRoute.url, channel.route)
      : path,
    progressM,
    channelLogoM: channel.image,
    channelRouteM: channel.route,
    channelAttrM: channel.channelAttr,
    channelIdM,
    showNameM,
    showUrlM,
    playbackAllowed,
    badgeM,
    airDateM: attributes.airDate,
    publishStartM: attributes.publishStart,
    ratingM,
    episodeNumberM: attributes.episodeNumber,
    longDescriptionM: M.alt(attributes.longDescription, attributes.description),
    seasonNumberM: attributes.seasonNumber,
    videoDurationM: attributes.videoDuration,
    broadcastTypeM: attributes.broadcastType,
    parentIdM,
  };
};

export const buildShowCardProps = (
  { attributes, id }: ShowData,
  path: M.Maybe<string>,
  channel: ChannelInfo,
  badgeM: M.Maybe<string>
) => ({ imageM, expandedImageM }: Images): Show => {
  const seasonCountM = M.map(
    (seasons) => seasons.length,
    attributes.seasonNumbers
  );
  return {
    id,
    kind: Kind.Show,
    titleM: M.of(attributes.name),
    descriptionM: attributes.description,
    longDescriptionM: M.alt(attributes.longDescription, attributes.description),
    imageM,
    expandedImageM,
    isFavoriteM: attributes.isFavorite,
    linkM: path,
    channelLogoM: channel.image,
    channelRouteM: channel.route,
    channelAttrM: channel.channelAttr,
    badgeM,
    seasonCountM,
  };
};

const buildChannelCardProps = (
  { attributes, id }: ChannelData,
  path: M.Maybe<string>
) => ({ imageM, expandedImageM }: Images): Channel => ({
  id,
  kind: Kind.Channel,
  titleM: M.of(attributes.name),
  descriptionM: attributes.description,
  imageM,
  expandedImageM,
  linkM: path,
});

const buildLinkCardProps = (
  { attributes, id }: LinkData,
  path: M.Maybe<string>
) => ({ imageM, expandedImageM }: Images): Link => ({
  id,
  kind: Kind.Link,
  titleM: attributes.title,
  descriptionM: attributes.description,
  imageM,
  expandedImageM,
  linkM: path,
});

const buildImageCardProps = (
  { attributes, id }: Images.Resource.ImageData,
  path: M.Maybe<string>
) => ({ imageM, expandedImageM }: Images): Image => ({
  id,
  kind: Kind.Image,
  titleM: attributes.title,
  descriptionM: attributes.description,
  imageM,
  expandedImageM,
  linkM: path,
});

const buildArticleCardProps = (
  { attributes, id }: ArticleData,
  path: M.Maybe<string>
) => ({ imageM, expandedImageM }: Images): Article => ({
  id,
  kind: Kind.Article,
  titleM: attributes.name,
  descriptionM: attributes.description,
  imageM,
  expandedImageM,
  linkM: path,
});

// Apply all the adapters
const _ContentGridData = mergeContent({
  videoAdapter: buildVideoCardProps,
  showAdapter: buildShowCardProps,
  channelAdapter: buildChannelCardProps,
  linkAdapter: buildLinkCardProps,
  imageAdapter: buildImageCardProps,
  articleAdapter: buildArticleCardProps,
});

export const _Col2ContentGridCardData: Fold.Fold<
  Collections.Resource.CollectionResponseData,
  Content
> = Fold.chain(
  // TODO: Based on template id, this grabs different images. Should be parameterized instead
  (x) =>
    Fold.compose(
      O._Col2Items,
      Fold.liftM(
        (gridData, colItemAttrM, overrideImageM, showImageM) => {
          const imageM = M.alt(overrideImageM, gridData.imageM);

          return {
            ...gridData,
            ...{
              titleM: M.concat(
                M.chain((attrs) => attrs.title, colItemAttrM),
                gridData.titleM
              ),
              descriptionM: M.concat(
                M.chain((attrs) => attrs.description, colItemAttrM),
                gridData.descriptionM
              ),
              imageM,
            },
            imageFallbackList: [imageM, showImageM],
          };
        },
        _ContentGridData(x as ContentGridKind),
        _ColItemAttributes,
        Fold.pre(_ColItemOverrideImage),
        Fold.pre(_Video2ShowImageM)
      )
    ),
  O._Col2TemplateId
);

export const _CollectionResponse2Content: Fold.Fold<
  Collections.Resource.CollectionResponse,
  Content
> = Fold.compose(_ColResponse2Col, _Col2ContentGridCardData);

const validator = V.record({ allowRemoval: V.optional(V.boolean) });

export const _AllowRemoval = Fold.compose(
  _CollectionGetter,
  _GetCustomAttributesForComponent(validator),
  Lens.prop("allowRemoval"),
  M._Just()
);

const oneToOneRelationshipsCta = { cmpContextLink: Links.Resource.target };
const _CTA = Fold.compose(
  O._CollectionGetter,
  Fold.mapF(Res.addNewRelationships(oneToOneRelationshipsCta)),
  Res._Rel("cmpContextLink")
);

export const _CTALink = Fold.liftM(
  (href, title) => ({ href, title }),
  Fold.compose(_CTA, O._LinkHref),
  Fold.compose(_CTA, O._LinkAttributes2Title)
);

export const _ColItemAttributes = Fold.compose(
  O._CollectionItemGetter,
  Res._Response(),
  Lens.prop("attributes")
);

export const _ColItemOverrideImage = Fold.compose(
  O._CollectionItemGetter,
  Res._Rel("images"),
  Res._ForEach(),
  _Image2Attributes
);

export const _Video2ShowImageM = Fold.compose(
  O._ColItem2Video,
  O._Video2Show,
  O._Show2Images,
  _Image2Attributes
);
