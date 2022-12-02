import { Fold, Lens } from "@discovery/prelude/lib/control/lens";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import * as Optics from "@discovery/sonic-api-ng-optics";
import * as Traversal from "@discovery/prelude/lib/control/lens/traversal";
import {
  _Route2Attributes,
  _ImageOfKind,
} from "@discovery/sonic-api-ng-optics";
import { CollectionItemResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collection-items/resource";
import { ImageData } from "@discovery/sonic-api-ng/lib/api/cms/images/resource";
import { HeroKind } from "../../../../components/tve/organisms/hero/types";
import { LinkKind } from "../../../../components/tve/atoms/link";
import { MetaLink } from "../../../../components/tve/molecules/hero-metadata/types";
import {
  _SecondaryImage,
  _FilterImagesByKind,
} from "../../../../utils/optics/secondary-image";
import { ImageRatio, isRatioM } from "../../../../utils/image";
import {
  ctaWatch,
  ctaChannel,
  ctaStart,
} from "@discovery/components-tve/src/components/tve/hardcoded-text";
import { _Video2ShowImageM } from "../content-grid/optics";

export enum LinkedContentType {
  Page = "page",
  Channel = "channel",
}

const _LinkToMetaLink = (kind: LinkKind) =>
  Fold.mapF(
    ({ url }: { url: string }): MetaLink => ({
      kind,
      url,
    })
  );

const _ColItem2ChannelDescription = Fold.compose(
  Optics._ColItem2Channel,
  Optics._Channel2Attributes,
  Lens.prop("description"),
  M._Just()
);

const _ColItem2ImageDescription = Fold.compose(
  Optics._ColItem2Image,
  Optics._Image2Attributes,
  Lens.prop("description"),
  M._Just()
);

const _ColItem2ImageTitle = Fold.compose(
  Optics._ColItem2Image,
  Optics._Image2Attributes,
  Lens.prop("title"),
  M._Just()
);

const _ColItem2LinkDescription = Fold.compose(
  Optics._ColItem2Link,
  Optics._Link2Attributes,
  Lens.prop("description"),
  M._Just()
);

const _ColItem2VideoImages = Fold.compose(
  Optics._ColItem2Video,
  Res._Rel("images")
);

const _ColItem2LinkImages = Fold.compose(
  Optics._ColItem2Link,
  Res._Rel("images")
);

const _ColItem2VideoName = Fold.compose(
  Optics._ColItem2Video,
  Optics._Video2Attributes,
  Lens.prop("name")
);

const _ColItem2PlaybackAllowed = Fold.compose(
  Optics._ColItem2Video,
  Optics._Video2Attributes,
  Lens.prop("playbackAllowed"),
  M._Just()
);

const _ColItem2ShowName = Fold.compose(
  Optics._ColItem2Show,
  Optics._Show2Attributes,
  Lens.prop("name")
);

const _ColItem2ImageName = Fold.compose(
  Optics._ColItem2Image,
  Optics._Image2Attributes,
  Lens.prop("title"),
  M._Just()
);

const _ColItem2LinkName = Fold.compose(
  Optics._ColItem2Link,
  Optics._Link2Attributes,
  Lens.prop("title"),
  M._Just()
);

const _ColItem2ShowDescription = Fold.compose(
  Optics._ColItem2Show,
  Optics._Show2Attributes,
  Lens.prop("description"),
  M._Just()
);

const _ColItem2VideoDescription = Fold.compose(
  Optics._ColItem2Video,
  Optics._Video2Attributes,
  Lens.prop("description"),
  M._Just()
);

const _ColItem2ShowImages = Fold.compose(
  Optics._ColItem2Show,
  Res._Rel("images")
);

const _ColItem2ChannelImages = Fold.compose(
  Optics._ColItem2Channel,
  Res._Rel("images")
);

const _ImagesOfKind = (kind: string) =>
  Fold.compose(
    Optics._ImagesGetter,
    Res._Response(),
    Fold._each(),
    Traversal._filtered((image) => image.attributes.kind === kind)
  );

export const _ColItem2ContentImage = (imageKind: string) =>
  Fold.alt(
    Fold.compose(_ColItem2VideoImages, _ImagesOfKind(imageKind)),
    Fold.compose(_ColItem2ShowImages, _ImagesOfKind(imageKind)),
    Fold.compose(_ColItem2ChannelImages, _ImagesOfKind(imageKind)),
    Fold.compose(_ColItem2LinkImages, _ImagesOfKind(imageKind))
  );

const _ColItem2ImageResponse = Fold.compose(
  Optics._ColItem2Image,
  Res._Response()
);

const _ColItem2ContentDesktopImage = Fold.compose(
  Fold.alt(_ColItem2ImageResponse, _ColItem2ContentImage("default")),
  Lens.prop("attributes")
);

const _DesktopImage = Fold.alt(_Video2ShowImageM, _ColItem2ContentDesktopImage);

export const _MobileImage = Fold.compose(
  Optics._ColItem2Image,
  Res._Response(),
  _FilterImagesByKind("alternate"),
  Lens.prop("attributes")
);

const _ColItem2VideoShowImages = Fold.compose(
  Optics._ColItem2Video,
  Res._Rel("show"),
  Res._Rel("images")
);

const _VideoShowImages2Logo = Fold.compose(
  _ColItem2VideoShowImages,
  _ImagesOfKind("logo")
);

const _Image = Fold.compose(
  Optics._CollectionItemGetter,
  Fold.mapF((data) => ({
    mobile: Fold.preview(_SecondaryImage, data),
    desktop: Fold.preview(_DesktopImage, data),
    logo: Fold.preview(
      Fold.compose(_ColItem2ContentImage("logo"), Lens.prop("attributes")),
      data
    ),
    videoShowLogo: Fold.preview(
      Fold.compose(_VideoShowImages2Logo, Lens.prop("attributes")),
      data
    ),
  }))
);

const _ColItem2ChannelName = Fold.compose(
  Optics._ColItem2Channel,
  Optics._Channel2Attributes,
  Lens.prop("name")
);

const _Name = Fold.alt(
  _ColItem2VideoName,
  _ColItem2ShowName,
  _ColItem2ChannelName,
  _ColItem2ImageName,
  _ColItem2LinkName
);

const _Description = Fold.alt(
  _ColItem2VideoDescription,
  _ColItem2ShowDescription,
  _ColItem2ChannelDescription,
  _ColItem2ImageDescription,
  _ColItem2LinkDescription
);

const _ColItemAttributes = Fold.compose(
  Optics._CollectionItemGetter,
  Res._Response(),
  Lens.prop("attributes")
);

const _Link = Fold.alt(
  Fold.compose(
    Optics._ColItem2Video,
    Optics._Video2Routes,
    _Route2Attributes,
    _LinkToMetaLink(LinkKind.internal)
  ),
  Fold.compose(
    Optics._ColItem2Show,
    Optics._Show2Routes,
    _Route2Attributes,
    _LinkToMetaLink(LinkKind.internal)
  ),
  Fold.compose(
    Optics._ColItem2Channel,
    Optics._Channel2Routes,
    _Route2Attributes,
    _LinkToMetaLink(LinkKind.internal)
  ),
  Fold.compose(
    Optics._ColItem2Link,
    Fold.alt(
      Fold.compose(
        Optics._Link2LinkedContentRoutes,
        _Route2Attributes,
        Lens.prop("url"),
        Fold.mapF((url) => ({ url })),
        _LinkToMetaLink(LinkKind.external)
      ),
      Fold.compose(
        Optics._Link2Attributes,
        Lens.prop("href"),
        Fold.mapF((urlM) => ({ url: M.fromMaybe(urlM, "") })),
        _LinkToMetaLink(LinkKind.external)
      ),
      Fold.compose(
        Optics._Link2LinkedContentRoutes,
        _Route2Attributes,
        _LinkToMetaLink(LinkKind.internal)
      )
    )
  )
);

const _Kind = Fold.alt(
  Fold.compose(
    Optics._ColItem2Video,
    Res._Response(),
    Fold.mapF(() => HeroKind.Video)
  ),
  Fold.compose(
    Optics._ColItem2Show,
    Res._Response(),
    Fold.mapF(() => HeroKind.Show)
  ),
  Fold.compose(
    Optics._ColItem2Channel,
    Res._Response(),
    Fold.mapF(() => HeroKind.Channel)
  ),
  Fold.compose(
    Optics._ColItem2Image,
    Res._Response(),
    Fold.mapF(() => HeroKind.Image)
  ),
  Fold.compose(
    Optics._ColItem2Link,
    Res._Response(),
    Fold.mapF(() => HeroKind.Link)
  )
);

const _LinkedContentType = Fold.compose(
  Optics._CollectionItemGetter,
  Optics._ColItem2Link,
  Optics._Link2Data,
  Lens.prop("relationships"),
  M._Just(),
  Lens.prop("linkedContent"),
  M._Just(),
  Lens.path("data", "type")
);

const getLinkFallbackCta = (typeM: M.Maybe<string>): M.Maybe<string> => {
  const type = M.fromMaybe(typeM, "");
  switch (type) {
    case LinkedContentType.Channel:
      return M.of(ctaChannel);
    case LinkedContentType.Page:
      return M.of(ctaStart);
    default:
      return M.empty();
  }
};

const getFallbackCta = (kind: HeroKind, typeM: M.Maybe<string>) => {
  switch (kind) {
    case HeroKind.Show:
      return M.of(ctaStart);
    case HeroKind.Video:
      return M.of(ctaWatch);
    case HeroKind.Channel:
      return M.of(ctaChannel);
    case HeroKind.Link:
      return getLinkFallbackCta(typeM);
    default:
      return M.empty();
  }
};

export const _ContentId = Fold.alt(
  Fold.compose(Optics._ColItem2Video, Optics._Video2Data, Lens.prop("id")),
  Fold.compose(Optics._ColItem2Show, Optics._Show2Data, Lens.prop("id")),
  Fold.compose(Optics._ColItem2Channel, Optics._Channel2Data, Lens.prop("id")),
  Fold.compose(Optics._ColItem2Image, Optics._Image2Data, Lens.prop("id")),
  Fold.compose(Optics._ColItem2Link, Optics._Link2Data, Lens.prop("id"))
);

type LinkAttr = {
  linkM: M.Maybe<MetaLink>;
  isLiveM: M.Maybe<boolean>;
  linkedContentTypeM: M.Maybe<string>;
};

const _CTA = Fold.compose(
  Optics._CollectionItemGetter,
  Optics._ColItem2Link,
  Optics._Link2Data,
  Lens.prop("relationships"),
  M._Just(),
  Lens.prop("linkedContent"),
  M._Just(),
  Lens.path("data", "type"),
  Fold.mapF((t) => t === HeroKind.Channel)
);

const _CTALink: Fold.Fold<CollectionItemResponseData, LinkAttr> = Fold.liftM(
  (linkM, isLiveM, linkedContentTypeM) => ({
    linkM,
    isLiveM,
    linkedContentTypeM,
  }),
  Fold.pre(_Link),
  Fold.pre(_CTA),
  Fold.pre(_LinkedContentType)
);

const _ChannelLogoForShowDesktop: Fold.Fold<
  CollectionItemResponseData,
  ImageData["attributes"]
> = Fold.compose(
  Optics._ColItem2Show,
  Fold.compose(
    Optics._Show2PrimaryChannel,
    Optics._Channel2Images,
    _ImageOfKind("logo_grayscale")
  ),
  Optics._Image2Attributes
);

const _ChannelLogoForShowMobile: Fold.Fold<
  CollectionItemResponseData,
  ImageData["attributes"]
> = Fold.compose(
  Optics._ColItem2Show,
  Fold.compose(
    Optics._Show2PrimaryChannel,
    Optics._Channel2Images,
    _ImageOfKind("logo_attribution")
  ),
  Optics._Image2Attributes
);

const _ShowIsFavorited = Fold.compose(
  Optics._ColItem2Show,
  Res._Response(),
  Lens.path("attributes", "isFavorite"),
  M._Just()
);

export const _ChannelAttr = Fold.pre(
  Fold.compose(
    Fold.concat(
      Fold.compose(Optics._ColItem2Video, Optics._Video2PrimaryChannel),
      Fold.compose(Optics._ColItem2Show, Optics._Show2PrimaryChannel)
    ),
    Optics._Channel2Attributes
  )
);

const _ChannelInfo = Fold.liftM(
  (channelLogoForShowDesktop, channelLogoForShowMobile, channelAttr) => ({
    channelLogoForShowDesktop,
    channelLogoForShowMobile,
    channelAttr,
  }),
  Fold.pre(_ChannelLogoForShowDesktop),
  Fold.pre(_ChannelLogoForShowMobile),
  _ChannelAttr
);

const _HeroMetaData = Fold.compose(
  Optics._CollectionItemGetter,
  Fold.liftM(
    (
      playbackAllowedM,
      descriptionM,
      imageDescriptionM,
      imageTitleM,
      ctaM,
      nameM,
      kind,
      colItemAttrM,
      channel,
      isFavoriteM
    ) => {
      const { linkM, isLiveM, linkedContentTypeM } = M.fromMaybe(ctaM, {
        linkM: M.empty(),
        isLiveM: M.empty(),
        linkedContentTypeM: M.empty(),
      });

      return {
        channelNameM: M.empty(),
        kind,
        plateDescriptionM: M.concat(
          M.concat(
            M.chain((attrs) => attrs.description, colItemAttrM),
            imageDescriptionM
          ),
          descriptionM
        ),
        plateLinkM: linkM,
        plateTitleM: M.concat(
          M.concat(
            M.chain((attrs) => attrs.title, colItemAttrM),
            imageTitleM
          ),
          nameM
        ),
        plateCtaM: M.concat(
          M.chain((attrs) => attrs.callToAction, colItemAttrM),
          getFallbackCta(kind, linkedContentTypeM)
        ),
        tuneInTextM: M.chain((attrs) => attrs.secondaryTitle, colItemAttrM),
        channelLogoM: channel.channelLogoForShowDesktop,
        channelLogoMobileM: channel.channelLogoForShowMobile,
        channelAttrM: channel.channelAttr,
        isFavoriteM,
        isLiveM,
        showLogoM: M.empty(),
        locked: M.foldMapConst(
          (playbackAllowed) => !playbackAllowed,
          false,
          playbackAllowedM
        ),
      };
    },
    Fold.pre(_ColItem2PlaybackAllowed),
    Fold.pre(_Description),
    Fold.pre(_ColItem2ImageDescription),
    Fold.pre(_ColItem2ImageTitle),
    Fold.pre(_CTALink),
    Fold.pre(_Name),
    _Kind,
    _ColItemAttributes,
    _ChannelInfo,
    Fold.pre(_ShowIsFavorited)
  )
);

const _ColItem2HeroData = Fold.liftM(
  (metaData, idM, attrs) => {
    const {
      mobile: mobileM,
      desktop: desktopM,
      logo: logoM,
      videoShowLogo: vLogoM,
    } = attrs;
    return {
      metadata: {
        ...metaData,
        showLogoM: metaData.kind === "video" ? vLogoM : logoM,
      },
      contentIdM: idM,
      mobileImageM: mobileM,
      imageM: desktopM,
    };
  },
  _HeroMetaData,
  Fold.pre(_ContentId),
  _Image
);

const _ColItem2HeroDataPlaylist = Fold.liftM(
  (metaData, idM, attrs) => {
    /**
     * we need to enforce proper aspect ratios on desktop vs mobile --
     *  - desktop -> Wide (16x9)
     *  - mobile -> Square (1x1)
     *
     *  -> otherwise, we should fall-back with the logo
     *
     * @TODO -- better image-ratio rejection
     *  - for some reason, we need to filter the images here *and*
     *    inside of the `Hero` component
     *
     * @TODO -- brand fallback image
     *  - we need a proper brand fallback image if the given image(s)
     *    aren't the proper aspect ratios
     *
     * @TODO -- fix data fragmentation
     *  - for playlist heroes (collections), they contain multiple collection items,
     *    each containing an image
     *  - the override data is located inside the 16x9 image (usually the first),
     *    BUT the mobile image is actually another collection item
     *  - because we only take the first collection item in non-carousel heroes,
     *    the mobile hero image will be excluded
     *
     */

    const { mobile: mobileM, desktop: desktopM, logo: logoM } = attrs;

    const desktopImageM = isRatioM(desktopM, ImageRatio.Wide);
    const mobileImageM = isRatioM(mobileM, ImageRatio.Square);

    return {
      metadata: {
        ...metaData,
        showLogoM: logoM,
      },
      contentIdM: idM,
      mobileImageM: mobileImageM,
      imageM: desktopImageM,
    };
  },
  _HeroMetaData,
  Fold.pre(_ContentId),
  _Image
);

export const _Col2HeroData = Fold.compose(Optics._Col2Items, _ColItem2HeroData);

export const _Col2HeroDataPlaylist = Fold.compose(
  Optics._Col2Items,
  _ColItem2HeroDataPlaylist
);
