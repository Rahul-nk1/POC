import * as RD from "@discovery/prelude/lib/data/remote-data";
import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import { CollectionResponse } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import { Fold } from "@discovery/prelude/lib/control/lens";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { SonicException } from "@discovery/sonic-api-ng/lib/app/sonic";
import {
  useCallback,
  useState,
  useGlobalState,
  useEffect,
} from "@discovery/common-tve/lib/hooks";

import {
  useEventDataContext,
  triggerInteractionEvent,
  InteractionEvent,
  triggerVideoPlayerEvent,
} from "@discovery/common-tve/lib/eventing";

import { TemplateEngine } from "../../../../../site-builder/tve/utils/inline-rendering";
//---------------------------------

import { Tabbable } from "@discovery/components-tve/src/utils/hooks/use-tabbable/index";
import { setToast } from "@discovery/components-tve/src/utils/toast";
import { Kind } from "../../../molecules/card";
import { MainContainer } from "../../../atoms/main-container";
import { HorizontalSlider } from "../../horizontal-slider";
import { parseDefaultTabIndex } from "../../../../../utils/default-tab-index";
import { Tags, AriaRoles } from "../../../../../utils/types";

import Strings from "../../../hardcoded.json";
import * as O from "./optics";

import * as styles from "./styles.css";
import { SubtabShimmer } from "./SubtabShimmer";

export type SubtabType = {
  id: string;
  title: string;
  subtitle?: string;
};

// Subtab is just a title that the users clicks
export const Subtab = ({
  tab,
  selectedTabM,
  handleClick,
  headerTag = Tags.div,
}: {
  tab: SubtabType;
  selectedTabM: M.Maybe<string>;
  handleClick: (subtab: SubtabType) => void;
  headerTag?: Tags;
}) => {
  const selected = M.equals(selectedTabM, M.of(tab.id));
  const onClick = useCallback(
    (localTab: SubtabType) => () => handleClick(localTab),
    [handleClick]
  );
  const TAG = headerTag;

  return (
    <TAG
      className={cn(styles.subtab, {
        [styles.selected]: selected,
      })}
    >
      <Tabbable role={AriaRoles.button}>
        {({ className: accessibleClassName, ...tabbableProps }) => (
          <button
            className={cn(styles.subtabButton, accessibleClassName)}
            onClick={onClick(tab)}
            {...tabbableProps}
          >
            <span className={styles.buttonText}>{tab.title}</span>
            {/* TODO style this */}
            {tab.subtitle && <div>{tab.subtitle}</div>}
          </button>
        )}
      </Tabbable>
    </TAG>
  );
};

// View for all subTabs
export const SubtabsView = ({
  className,
  tabs,
  handleClick,
  headerTag = Tags.div,
  selectedTabM,
}: {
  className?: string;
  tabs: L.List<SubtabType>;
  handleClick: (subtab: SubtabType) => void;
  headerTag?: Tags;
  selectedTabM: M.Maybe<string>;
}) => (
  <div className={className}>
    <HorizontalSlider
      classNames={{
        container: styles.subtabs,
        rail: styles.inner,
      }}
      navButtonClassLeft={styles.moreButton}
      navButtonClassRight={styles.moreButton}
    >
      {L.toArray(tabs).map((tab, i) => (
        <Subtab
          tab={tab}
          key={i}
          selectedTabM={selectedTabM}
          handleClick={handleClick}
          headerTag={headerTag}
        />
      ))}
    </HorizontalSlider>
  </div>
);

// Success takes the response of the collections endpoint
// and picks out all the Subtab's
// A subtab is just an id (used to show selected one)
// A title that the user clicks to select a subtab ("popular" | "editors choice" | etc)
// And the data is picked out of the Response Type this the given straight to the
// component-creator for `content-grid` and that takes care of own it's own rendering
type SuccessType = {
  className?: string;
  data: CollectionResponse;
  headerTag?: Tags;
};

const Success = ({ className, data, headerTag = Tags.div }: SuccessType) => {
  const { eventData } = useEventDataContext();
  const triggerClickEvent = useCallback(
    (subtabTitle: string, alias: string) => {
      triggerInteractionEvent({
        ...eventData,
        content: { ...eventData.content, contentTitle: subtabTitle },
        alias,
        interactionType: InteractionEvent.CLICK,
      });
    },
    [eventData]
  );

  const [{ loggedIn }] = useGlobalState();

  const playbackAllowed = M.fromMaybe(
    Fold.preview(O._PlaybackAllowed, data),
    true
  );

  useEffect(() => {
    if (loggedIn && !playbackAllowed) {
      setToast(Strings.notEntitledToast);
    }
  }, [loggedIn, playbackAllowed]);

  const subtabsWithColL = Fold.toList(O._Subtab, data);
  const selectedM = Fold.preview(O._Selected, data);
  const selected = parseDefaultTabIndex(selectedM);
  // Pick the tab at index selected from subtabsL. Failing that, pick the first one.
  // Failing that, be nothing.
  const initalTabM = M.alt(
    L.nth(selected, subtabsWithColL),
    L.head(subtabsWithColL)
  );

  // 1.  tabIdM for selected tab
  const [tabIdM, setTabIdM] = useState<M.Maybe<string>>(
    M.map((t) => t.id, initalTabM)
  );

  // Callback from clicks on a Subtab, sets the new state where that tab is selected
  // and it's data is rendered
  const onSubtabClick = (tab: SubtabType) => {
    setTabIdM(M.of(tab.id));
    triggerClickEvent(tab.title, tab.id);
  };

  // Take the data and render a content-grid with it
  // In the future this should be able to use the site-builder-interpreter
  const ContentGrid = () => {
    const subtabM = L.find(
      (subtab) => M.foldMapConst((tabId) => tabId === subtab.id, false, tabIdM),
      subtabsWithColL
    );

    return (
      <RenderMaybe>
        {M.map(
          (subtab) => (
            <MainContainer>
              <TemplateEngine
                response={subtab.col}
                showTitle={false}
                onClick={(_, content) => {
                  if (content.kind === Kind.Video) {
                    triggerVideoPlayerEvent(content.id);
                  }
                }}
              />
            </MainContainer>
          ),
          subtabM
        )}
      </RenderMaybe>
    );
  };

  return (
    <>
      <SubtabsView
        className={className}
        tabs={subtabsWithColL}
        handleClick={onSubtabClick}
        headerTag={headerTag}
        selectedTabM={tabIdM}
      />
      <ContentGrid />
    </>
  );
};

// Subtabs component takes the request to the collections endpoint,
// and produces a view for all possible states of the request
export const Subtabs = ({
  className,
  data,
  headerTag = Tags.div,
}: {
  className?: string;
  data: RD.RemoteData<SonicException, CollectionResponse>;
  headerTag?: Tags;
}) =>
  RD.fromRD(
    {
      notAsked: () => <SubtabShimmer />,
      loading: () => <SubtabShimmer />,
      success: (res) => (
        <Success className={className} data={res} headerTag={headerTag} />
      ),
      failure: (err) => <p style={{ color: "white" }}>{JSON.stringify(err)}</p>,
    },
    data
  );
