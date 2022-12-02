import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as E from "@discovery/prelude/lib/data/either";
import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as RD from "@discovery/prelude/lib/data/remote-data";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import { useHistory } from "@discovery/common-tve/lib/hooks";
import { Fold, Lens } from "@discovery/prelude/lib/control/lens";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import { _Col2ContentGridCardData } from "../content-grid/optics";
import {
  record,
  optional,
  string,
} from "@discovery/prelude/lib/data/validated";
import {
  _Col2Id,
  _Col2ColDataMeta,
  _Col2ComponentId,
  _Show2Attributes,
  _Col2Video,
  _Video2Show,
  _Show2Data,
  _ColAttributes2Component,
  _ColAttributes2Alias,
} from "@discovery/sonic-api-ng-optics";
import { triggerVideoPlayerEvent } from "@discovery/common-tve/lib/eventing";
import { Content } from "../../../../components/tve/molecules/card/types";
import { NavOption } from "../../../../components/tve/molecules/season-picker";
import { View as DefaultView } from "./view";
import { View as ScheduleView } from "./schedule-view";
import { isVideo } from "../content-grid";
import {
  _Col2FilterOptions2NavOptionL,
  _Col2FilterInitiallySelectedNavOption,
  _Col2FilterInitiallySelectedSubtabId,
  _Col2Subtab,
  _NetworkSelectorChannels,
  _Col2TabbedContentType,
  _Selected,
} from "./optics";
import { useActiveVideoForShow } from "../../../../utils/hooks/use-active-video-for-show";
import { InlineProps } from "../../utils/inline-rendering";
import { mkComponentMapItem } from "@discovery/template-engine/lib/component-map";

const getDefaultProps = (data: CollectionResponseData) => {
  const metaM = Fold.preview(_Col2ColDataMeta, data);
  const componentIdM = Fold.preview(_Col2ComponentId, data);
  const aliasM = Fold.preview(_ColAttributes2Alias, data);
  const optionL = L.flatten(Fold.toList(_Col2FilterOptions2NavOptionL, data));

  const collectionMandatoryParamM = Fold.view(
    Fold.compose(
      _ColAttributes2Component,
      M._Just(),
      Lens.prop("mandatoryParams")
    ),
    data
  );
  const initialSelectedNavOptionM: M.Maybe<NavOption> = Fold.preview(
    _Col2FilterInitiallySelectedNavOption,
    data
  );

  const _Col2ShowAttributes = Fold.compose(
    _Col2Video,
    _Video2Show,
    _Show2Attributes
  );

  const aboutM = Fold.view(
    Fold.compose(_Col2ShowAttributes, Lens.prop("longDescription")),
    data
  );

  const isFavoriteM = Fold.view(
    Fold.compose(_Col2ShowAttributes, Lens.prop("isFavorite")),
    data
  );

  const idM = Fold.preview(
    Fold.compose(_Col2Video, _Video2Show, _Show2Data, Lens.prop("id")),
    data
  );

  const titleM = Fold.preview(
    Fold.compose(_Col2ShowAttributes, Lens.prop("name")),
    data
  );

  const headingText = "Full Episodes";
  const showAlternateIdM = Fold.preview(
    Fold.compose(
      _Col2Video,
      _Video2Show,
      Res._Response(),
      Lens.path("attributes", "alternateId")
    ),
    data
  );

  return {
    aboutM,
    collectionMandatoryParamM,
    componentIdM,
    headingText,
    idM,
    initialSelectedNavOptionM,
    isFavoriteM,
    metaM,
    optionL,
    titleM,
    showAlternateIdM,
    aliasM,
  };
};

type DefaultProps = ReturnType<typeof getDefaultProps> & {
  collectionIdM: M.Maybe<string>;
  cardDataL: L.List<Content>;
  onClick?: (e: React.MouseEvent, content: Content) => void;
};

const handleClick = (
  _: React.MouseEvent<Element, MouseEvent>,
  content: Content
): void => {
  if (isVideo(content)) {
    triggerVideoPlayerEvent(content.id);
  }
};

const TabbedContentDefault = ({
  collectionIdM,
  cardDataL,
  aboutM,
  collectionMandatoryParamM,
  componentIdM,
  headingText,
  idM,
  initialSelectedNavOptionM,
  isFavoriteM,
  metaM,
  optionL,
  titleM,
  showAlternateIdM,
  aliasM,
  onClick = handleClick,
}: DefaultProps) => {
  const activeVideoForShowMRD = useActiveVideoForShow(showAlternateIdM);

  return RD.fromRD(
    {
      notAsked: () => <></>,
      loading: () => <></>,
      failure: () => <></>,
      success: (activeVideoM) => {
        const activeSeasonNumber = M.chain(
          (activeVideo) => activeVideo.attributes.seasonNumber,
          activeVideoM
        );
        return (
          <DefaultView
            componentIdM={componentIdM}
            collectionIdM={collectionIdM}
            cardDataL={cardDataL}
            aboutM={aboutM}
            metaM={metaM}
            collectionMandatoryParamM={collectionMandatoryParamM}
            initialSelectedNavOptionM={initialSelectedNavOptionM}
            optionL={optionL}
            headingText={headingText}
            isFavoriteM={isFavoriteM}
            idM={idM}
            titleM={titleM}
            activeSeasonNumber={activeSeasonNumber}
            aliasM={aliasM}
            onClick={onClick}
          />
        );
      },
    },
    activeVideoForShowMRD
  );
};
/* TODO: This may come in handy, perhaps define it next to view
 * type DefaultProps = ReturnType<typeof getDefaultProps> & {
 *   collectionIdM: M.Maybe<string>;
 *   cardDataL: L.List<Content>;
 *   showTitle: boolean;
 * };
 *  */

const getScheduleProps = (data: CollectionResponseData) => {
  const initialSelectedNetworkM = Fold.preview(_Selected, data);

  const componentIdM = Fold.preview(_Col2ComponentId, data);
  const aliasM = Fold.preview(_ColAttributes2Alias, data);
  const metaM = Fold.preview(_Col2ColDataMeta, data);
  const daysL = Fold.toList(_Col2Subtab, data);
  const initialSelectedSubtabIdM = Fold.preview(
    _Col2FilterInitiallySelectedSubtabId,
    data
  );

  const initialSelectedSubtabM = M.chain(
    (initialSelectedSubtabId) =>
      L.find((day) => day.id === initialSelectedSubtabId, daysL),
    initialSelectedSubtabIdM
  );

  const daysNotInPastL = L.filter(
    (day) =>
      M.foldMapConst(
        (initial) => initial.value <= day.value,
        false,
        initialSelectedSubtabM
      ),
    daysL
  );

  const subtabL = L.map((subtab) => {
    const subtabM = M.map(
      (id) => (subtab.id === id ? { ...subtab, title: "Today" } : subtab),
      initialSelectedSubtabIdM
    );

    return M.fromMaybe(subtabM, subtab);
  }, daysNotInPastL);

  const networkSelectorChannelL = Fold.toList(_NetworkSelectorChannels, data);

  return {
    componentIdM,
    initialSelectedSubtabIdM,
    initialSelectedNetworkM,
    metaM,
    networkSelectorChannelL,
    subtabL,
    aliasM,
  };
};

type ScheduleProps = ReturnType<typeof getScheduleProps> & {
  collectionIdM: M.Maybe<string>;
  cardDataL: L.List<Content>;
  onClick?: (e: React.MouseEvent, content: Content) => void;
};

const TabbedContentSchedule = ({
  collectionIdM,
  cardDataL,
  componentIdM,
  initialSelectedSubtabIdM,
  initialSelectedNetworkM,
  metaM,
  networkSelectorChannelL,
  subtabL,
  aliasM,
  onClick = handleClick,
}: ScheduleProps) => {
  const [changes] = useHistory();
  const state = E.fromEither(
    changes.state.get(record({ channelId: optional(string) })),
    { channelId: O.none }
  );

  return (
    <ScheduleView
      componentIdM={componentIdM}
      collectionIdM={collectionIdM}
      cardDataL={cardDataL}
      metaM={metaM}
      aliasM={aliasM}
      networkSelectorChannelL={networkSelectorChannelL}
      initialSelectedNetworkM={M.alt(initialSelectedNetworkM, state.channelId)}
      initialSelectedSubtabIdM={initialSelectedSubtabIdM}
      subtabL={subtabL}
      onClick={onClick}
    />
  );
};

/* TODO: Porhaps inline ScheduleProps and DefaultProps */
const getProps = (data: CollectionResponseData) => {
  const collectionIdM = Fold.preview(_Col2Id, data);
  const tabbedContentTypeM = Fold.preview(_Col2TabbedContentType, data);
  const cardDataL = Fold.toList(_Col2ContentGridCardData, data);

  const schedule = getScheduleProps(data);
  const def = getDefaultProps(data);

  return {
    cardDataL,
    collectionIdM,
    tabbedContentTypeM,
    schedule,
    def,
  };
};

type Props = ReturnType<typeof getProps> &
  InlineProps & {
    schedule: ReturnType<typeof getScheduleProps>;
    def: ReturnType<typeof getDefaultProps>;
    showTitle?: boolean;
  };

export const TabbedContent = ({
  cardDataL,
  collectionIdM,
  tabbedContentTypeM,
  showTitle = true,
  schedule,
  def,
}: Props) => {
  // Getting initial data from collection
  const tabbedContentDefault = (
    <TabbedContentDefault
      {...{
        ...def,
        cardDataL,
        collectionIdM,
        showTitle,
      }}
    />
  );

  const component = pipe(
    tabbedContentTypeM,
    O.map((tabbedContentType) => {
      switch (tabbedContentType) {
        case "day":
          return (
            <TabbedContentSchedule
              {...{
                ...schedule,
                cardDataL,
                collectionIdM,
                showTitle,
              }}
            />
          );
        case "letter":
        case "seasonNumber":
        default:
          return tabbedContentDefault;
      }
    }),
    O.getOrElse(() => tabbedContentDefault)
  );

  return component;
};

export const ComponentMapItem = mkComponentMapItem(
  getProps,
  () => TabbedContent
);
