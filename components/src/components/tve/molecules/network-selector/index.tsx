import { cn } from "@discovery/classnames";
import * as L from "@discovery/prelude/lib/data/list";
import { compose } from "@discovery/prelude/lib/data/function";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as RD from "@discovery/prelude/lib/data/remote-data";
import * as Collections from "@discovery/sonic-api-ng/lib/api/cms/collections";
import * as CQ from "@discovery/sonic-api-ng/lib/api/common/query";
import * as Images from "@discovery/sonic-api-ng/lib/api/cms/images";

import { DEFAULT_DECORATORS } from "@discovery/common-tve/lib/constants";
import {
  useEventDataContext,
  triggerInteractionEvent,
  InteractionEvent,
} from "@discovery/common-tve/lib/eventing";
import {
  useCallback,
  useEffect,
  useSonicHttp,
  useGlobalState,
  useState,
} from "@discovery/common-tve/lib/hooks";
import { setToast } from "@discovery/components-tve/src/utils/toast";

import { HorizontalSlider } from "../horizontal-slider";
import { Tags } from "../../../../utils/types";

import Strings from "../../hardcoded.json";
import { Tab } from "./tab";
import { Subtabs } from "./subtabs";

import * as styles from "./styles.css";

export type NetworkSelectorTabType = {
  imageM: M.Maybe<Images.Attributes.Attributes>;
  titleM: M.Maybe<string>;
  linkedCollectionId?: string;
  playbackAllowedM?: M.Maybe<boolean>;
  id: string;
};

export type TabType = Omit<NetworkSelectorTabType, "linkedCollectionId">;

export const NetworkTabsHeader = <HandleClickParams extends TabType>({
  className,
  handleClick,
  isLoading,
  selectedNetwork,
  tabL,
}: {
  className?: string;
  isLoading: boolean;
  selectedNetwork: string;
  tabL: L.List<HandleClickParams>;
  handleClick: (tab: HandleClickParams) => void;
}) => {
  const [{ loggedIn }] = useGlobalState();

  const onClick = useCallback(
    (tab: HandleClickParams) => () => {
      handleClick(tab);
      /*
        explicitly checking for 'false', because some incarnations of network-
        selector will not have `playbackAllowedM` at the tab level
       */
      if (
        loggedIn &&
        tab.playbackAllowedM &&
        M.fromMaybe(tab.playbackAllowedM, true) === false
      ) {
        setToast(Strings.notEntitledToast);
      }
    },
    [handleClick, loggedIn]
  );

  const isSelected = useCallback(
    (tab: HandleClickParams) => selectedNetwork === tab.id,
    [selectedNetwork]
  );

  return (
    <div className={className}>
      <HorizontalSlider
        offsetButtons
        navButtonClassLeft={styles.moreButton}
        navButtonClassRight={styles.moreButton}
        classNames={{
          container: styles.slider,
        }}
      >
        <div className={styles.spacer}></div>
        {L.map((tab) => {
          const selected = isSelected(tab);
          const headerTag = selected ? Tags.h1 : Tags.div;

          return (
            <Tab
              isLoading={isLoading}
              key={tab.id}
              onClick={onClick(tab)}
              selected={selected}
              tab={tab}
              tag={headerTag}
            />
          );
        }, tabL)}
        <div className={styles.spacer}></div>
      </HorizontalSlider>
    </div>
  );
};

export type Props = {
  className?: string;
  handleClick?: (tab: TabType) => void;
  networkTabsClassName?: string;
  selected?: number;
  selectedNetworkId?: string;
  subtabs?: JSX.Element;
  subtabsClassName?: string;
  subtabsHeaderTag?: Tags;
  tabL: L.List<NetworkSelectorTabType>;
};

const params = compose(
  Collections.Query.One.lenses.decorators.set(
    CQ.Decorators.decorators(...DEFAULT_DECORATORS)
  )
)(Collections.Query.One.parameters);

export const NetworkSelector = ({
  className,
  handleClick = () => {},
  networkTabsClassName,
  selected = 0,
  selectedNetworkId = "",
  subtabs,
  subtabsClassName,
  subtabsHeaderTag = Tags.h2,
  tabL,
}: Props) => {
  // 1. We want to be able to call the collections endpoint, with the linkedCollectionId
  // that is part of a `Tab` that linkedCollectionId contains all the subtabs
  const [response, requestCollection] = useSonicHttp(
    Collections.Endpoints.getCollection
  );

  // 2. We want some local state to highlight the currently selectedNetwork
  const [selectedNetwork, setSelectedNetwork] = useState(selectedNetworkId);

  // Set up the click interaction event
  const { eventData } = useEventDataContext();
  const triggerClickEvent = useCallback(
    (networkTitle: string, alias: string) => {
      triggerInteractionEvent({
        ...eventData,
        content: { ...eventData.content, contentTitle: networkTitle },
        alias,
        interactionType: InteractionEvent.CLICK,
      });
    },
    [eventData]
  );

  // When the user clicks a Tab we want to set that one to the selected one
  // and fire away a network request to get the collection
  const localHandleClick = useCallback(
    (tab: NetworkSelectorTabType) => {
      handleClick(tab);
      setSelectedNetwork(tab.id);
      triggerClickEvent(M.fromMaybe(tab.titleM, ""), tab.id);

      if (tab.linkedCollectionId) {
        requestCollection(tab.linkedCollectionId, params);
      }
    },
    [handleClick, requestCollection, triggerClickEvent]
  );

  const initalTabM = M.alt(L.nth(selected, tabL), L.head(tabL));

  // 3. select and request the first tab's linked content
  useEffect(() => {
    M.map(localHandleClick, initalTabM);
    // Only do this when the component mounts, exhaustive-deps complains in eslint
    //eslint-disable-next-line
  }, []);

  // From the network request we can get the loading state.
  // we use this to display some loading animation on the tab
  const isLoading = RD.is.Loading(response);

  // First we have our horizontalSlider that has a bunch of Tab's
  // under that we have the Subtabs that takes the response from
  // the collections endpoint, Subtabs takes care of all the states
  // NotAsked, Loading, Success, or Failure
  return (
    <div className={cn(styles.container, className)}>
      <NetworkTabsHeader
        className={cn(styles.networkTabs, networkTabsClassName)}
        tabL={tabL}
        isLoading={isLoading}
        selectedNetwork={selectedNetwork}
        handleClick={localHandleClick}
      />
      <div className={styles.subtabsWrapper}>
        {subtabs || (
          <Subtabs
            className={subtabsClassName}
            data={response}
            headerTag={subtabsHeaderTag}
          />
        )}
      </div>
    </div>
  );
};
