import * as M from "@discovery/prelude/lib/data/maybe";
import * as L from "@discovery/prelude/lib/data/list";
import * as CQ from "@discovery/sonic-api-ng/lib/api/common/query";
import * as RD from "@discovery/prelude/lib/data/remote-data";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import * as PrivateFilter from "@discovery/sonic-api-ng/lib/api/common/query/private-filter";
import * as Collections from "@discovery/sonic-api-ng/lib/api/cms/collections";
import { Fold } from "@discovery/prelude/lib/control/lens";
import { compose } from "@discovery/prelude/lib/data/function";
import { DataMeta } from "@discovery/components-tve/src/components/tve/organisms/content-grid/paginated";
import { SonicException } from "@discovery/sonic-api-ng/lib/app/sonic";
import { EventDataProvider } from "@discovery/common-tve/lib/eventing";
import { CollectionResponse } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import { DEFAULT_DECORATORS } from "@discovery/common-tve/lib/constants";
import {
  useState,
  useEffect,
  useCallback,
  useSonicHttp,
} from "@discovery/common-tve/lib/hooks";
import {
  ContentGrid,
  createContentGridPaginated,
} from "@discovery/components-tve/src/components/tve/organisms/content-grid";
import {
  _ColResponse2Col,
  _Col2ColDataMeta,
} from "@discovery/sonic-api-ng-optics";

import { Content } from "../../../../components/tve/molecules/card/types";
import { ListContainer } from "../../../../components/tve/atoms/list-container";
import { gridMap, Kind } from "../content-grid/index";
import { PaginationButton } from "../../../../components/tve/organisms/content-grid/paginated";
import { ScheduleviewShimmer } from "./ScheduleviewShimmer";
import { _Col2ContentGridCardData } from "../content-grid/optics";
import {
  DatePicker,
  DateTabType,
} from "../../../../components/tve/molecules/date-picker";
import {
  TabType,
  NetworkSelector,
} from "../../../../components/tve/molecules/network-selector";

import Strings from "../../../../components/tve/hardcoded.json";

import * as styles from "./styles.css";

type RDContent = RD.RemoteDataInFlight<
  SonicException,
  {
    contentL: L.List<Content>;
    metaM: M.Maybe<DataMeta>;
  }
>;

type FetchCardsType = {
  cardDataL: L.List<Content>;
  metaM: M.Maybe<DataMeta>;
  response: RD.RemoteData<SonicException, CollectionResponse>;
};

const currentTime = new Date();
const itemsToDisplay = 5;

const upNext = (contentL: L.List<Content>) =>
  L.filter(
    (content) =>
      content.kind === "video"
        ? M.fromMaybe(
            M.map(
              (scheduleStart) => scheduleStart > currentTime,
              content.scheduleStartM
            ),
            false
          )
        : false,
    contentL
  );

export const collectionRequest = (
  selectedDateStringM: M.Maybe<string>,
  selectedChannelM: M.Maybe<TabType>
) => (page: Collections.Query.One.Page) => {
  const date = M.fromMaybe(selectedDateStringM, "");
  const channel = M.fromMaybe(
    M.map(({ id }) => id, selectedChannelM),
    ""
  );
  return compose(
    Collections.Query.One.lenses.decorators.set(
      CQ.Decorators.decorators(...DEFAULT_DECORATORS)
    ),
    Collections.Query.One.lenses.include.set(CQ.Include.include("default")),
    Collections.Query.One.lenses.pf.set(
      PrivateFilter.pfs(
        PrivateFilter.pf(`pf[day]=${date}`),
        PrivateFilter.pf(`contentFilter[channel.id]=${channel}`)
      )
    ),
    Collections.Query.One.lenses.page.set(page)
  )(Collections.Query.One.parameters);
};

const fetchCards = ({
  cardDataL,
  metaM,
  response,
}: FetchCardsType): RDContent =>
  RD.fromRD(
    {
      notAsked: () =>
        RD.success({
          contentL: cardDataL,
          metaM: metaM,
        }) as RDContent,
      loading: () => RD.loading,
      failure: (e) => RD.failure(e) as RDContent,
      success: (newData) => {
        const metaM = Fold.preview(
          Fold.compose(_ColResponse2Col, _Col2ColDataMeta),
          newData
        );

        const contentL = Fold.toList(
          _Col2ContentGridCardData,
          Res.map(({ data }) => data, newData)
        );

        return RD.success({
          contentL,
          metaM,
        }) as RDContent;
      },
    },
    response
  );

export const View = ({
  componentIdM,
  collectionIdM,
  cardDataL,
  networkSelectorChannelL,
  initialSelectedNetworkM,
  initialSelectedSubtabIdM,
  subtabL,
  metaM,
  aliasM,
  onClick,
}: {
  componentIdM: M.Maybe<string>;
  collectionIdM: M.Maybe<string>;
  cardDataL: L.List<Content>;
  networkSelectorChannelL: L.List<TabType>;
  initialSelectedNetworkM: M.Maybe<string>;
  initialSelectedSubtabIdM: M.Maybe<string>;
  metaM: M.Maybe<DataMeta>;
  subtabL: L.List<DateTabType>;
  aliasM: M.Maybe<string>;
  onClick?: (e: React.MouseEvent, content: Content) => void;
}) => {
  /**
   * TODO -- netowrk selector inversion of control
   *    - ideally, we should be able to toggle the "selected" network in this component
   *      via `setSelectedChannelId`, which would the re-render `NetworkSelector` with
   *      the properly-selected network
   *
   *    - currently, both this component and `NetworkSelector` track state independently
   *      of each other, but the two states are equivalent, so the components work
   *
   *    - the biggest difference si that this component tracks _which_ tab was selected;
   *      `NetworkSelector` tracks the _index_ of the selected tab
   *
   *    - `tabbed-page` does not have its own state-tracking logic and uses the internal
   *      logic of `NetworkSelector`
   *
   *    - refactoring this component + `NetworkSelector` + `tabbed-page` requires a
   *      heavier lift than expected
   *
   *    -> we're going to "plant the seed" for now and only use `selectedChannelId`
   *       for the initial network selection
   *
   *    - `setSelectedChannel` (which returns `tab` data) doesn't tell us the index
   *      that was selected, we'll need some more logic/refactoring to get it to do that,
   *      and then call `setSelectedChannelId` with that value
   */

  const selectedChannelId = L.findIndex(
    (o) => M.equals(initialSelectedNetworkM, M.of(o.id)),
    networkSelectorChannelL
  );

  const [selectedChannelM, setSelectedChannel] = useState<M.Maybe<TabType>>(
    L.head(
      L.alt(
        L.filter(
          (o) => M.equals(initialSelectedNetworkM, M.of(o.id)),
          networkSelectorChannelL
        ),
        networkSelectorChannelL
      )
    )
  );

  const [selectedDateStringM, setSelectedDateStringM] = useState<
    M.Maybe<string>
  >(initialSelectedSubtabIdM);

  const [response, getCollection] = useSonicHttp(
    Collections.Endpoints.getCollection
  );

  const [slicedL, setContentL] = useState<L.List<Content>>(L.empty());

  const cards = fetchCards({
    cardDataL,
    metaM,
    response,
  });

  useEffect(() => {
    const params = collectionRequest(
      selectedDateStringM,
      selectedChannelM
    )(Collections.Query.One.parameters.page);
    setContentL(L.empty());
    M.map((collectionId) => getCollection(collectionId, params), collectionIdM);
    /**
     * TODO -- network selector inversion of control
     *    -> we'd call `setSelectedChannelId` here
     */
  }, [selectedDateStringM, selectedChannelM, collectionIdM, getCollection]);

  const localHandleClick = useCallback(
    (tab: TabType) => {
      const channelM = L.find((o) => o.id === tab.id, networkSelectorChannelL);

      setSelectedChannel(channelM);
    },
    [networkSelectorChannelL]
  );

  /**
   * TODO -- refactor this so `NetworkSelector` can figure out
   *   the subtab logic on its own
   */

  const localHandleClickSubtabs = useCallback(
    (subtab: DateTabType) => setSelectedDateStringM(M.of(subtab.id)),
    []
  );
  const Subtabs = (
    <EventDataProvider
      componentIdM={componentIdM}
      alias={M.fromMaybe(aliasM, "")}
    >
      <DatePicker
        tabs={subtabL}
        handleClick={localHandleClickSubtabs}
        selectedM={selectedDateStringM}
      />
    </EventDataProvider>
  );

  return (
    <div className={styles.container}>
      <EventDataProvider componentIdM={componentIdM}>
        <NetworkSelector
          tabL={networkSelectorChannelL}
          handleClick={localHandleClick}
          subtabs={Subtabs}
          selected={selectedChannelId}
        />
      </EventDataProvider>
      <ListContainer className={styles.listContainerSchedule}>
        {RD.fromRDI(
          {
            loading: () => (
              <ScheduleviewShimmer selectedDateStringM={selectedDateStringM} />
            ),
            failure: () => <></> /* TODO Error page */,
            success: ({ contentL, metaM }) => {
              const onNowL = L.filter(
                (content) =>
                  content.kind === "video"
                    ? M.fromMaybe(
                        M.liftM(
                          (scheduleStart, scheduleEnd) =>
                            scheduleStart < currentTime &&
                            scheduleEnd > currentTime,
                          content.scheduleStartM,
                          content.scheduleEndM
                        ),
                        false
                      )
                    : false,
                contentL
              );
              const ContentGridPaginatedHighlight = createContentGridPaginated(
                gridMap[Kind.DetailHighlight]
              );
              const Grid = gridMap[Kind.HighlightMini];

              const channelNameM = M.fromMaybe(
                M.map(
                  (selectedChannel) => selectedChannel.titleM,
                  selectedChannelM
                ),
                M.empty()
              );

              const upNextM = M.of(Strings.upNext);
              const channelTitleM = M.liftM(
                (channel, upNext) => `${upNext} on ${channel}`,
                channelNameM,
                upNextM
              );
              const upNextTitleM = M.alt(channelTitleM, upNextM);

              return (
                <EventDataProvider
                  componentIdM={componentIdM}
                  alias={M.fromMaybe(aliasM, "")}
                >
                  <ContentGridPaginatedHighlight
                    contentL={onNowL}
                    titleM={M.of("On Now")}
                    collectionIdM={collectionIdM}
                    metaM={metaM}
                    lens={Fold.compose(
                      _ColResponse2Col,
                      _Col2ContentGridCardData
                    )}
                    collectionRequest={collectionRequest(
                      selectedDateStringM,
                      selectedChannelM
                    )}
                    gridType={Kind.DetailHighlight}
                    onClick={onClick}
                  />
                  <ContentGrid
                    isEmpty={L.isEmpty(slicedL) && L.isEmpty(upNext(contentL))}
                    titleM={upNextTitleM}
                  >
                    <Grid
                      contentL={
                        slicedL.length > 0
                          ? slicedL
                          : L.slice(0, itemsToDisplay, upNext(contentL))
                      }
                      paginationM={
                        upNext(contentL).length > itemsToDisplay &&
                        slicedL.length < itemsToDisplay
                          ? M.of(
                              <PaginationButton
                                show={true}
                                loading={false}
                                onClick={() => setContentL(upNext(contentL))}
                                title={"More"}
                              />
                            )
                          : M.empty()
                      }
                      onClick={onClick}
                    />
                  </ContentGrid>
                </EventDataProvider>
              );
            },
          },
          cards
        )}
      </ListContainer>
    </div>
  );
};
