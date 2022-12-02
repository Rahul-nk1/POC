import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import { useState, useGlobalState } from "@discovery/common-tve/lib/hooks";
import { Tabbable } from "@discovery/components-tve/src/utils/hooks/use-tabbable";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import {
  InteractionEvent,
  useEventDataContext,
  triggerInteractionEvent,
} from "@discovery/common-tve/lib/eventing";

import { Tags, AriaRoles } from "../../../../utils/types";
import Strings from "../../hardcoded.json";

import * as styles from "./styles.css";
import { P, Weights } from "../../atoms/text";
import { Link, LinkKind } from "../../atoms/link";

export type Props = {
  tabsL: L.List<{
    content: JSX.Element;
    title: string;
    id: string;
    alias: string;
    items: {
      firstPageItemCount: number;
    };
  }>;
};

const MyListTabHeader = ({
  onClick,
  active,
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  active: boolean;
  children: React.ReactNode;
}) => {
  const TAG = Tags.p;
  return (
    <Tabbable onSelectAction={onClick} role={AriaRoles.tab}>
      {({ className, ...tabbableProps }) => (
        <div className={active ? styles.selected : undefined}>
          <TAG
            className={cn(styles.tab, styles.indicator, className, {})}
            onClick={onClick}
            {...tabbableProps}
          >
            {children}
          </TAG>
          <div></div>
        </div>
      )}
    </Tabbable>
  );
};

const View = ({
  tabsL,
  selectedTabId,
  setSelectedTabId,
}: {
  tabsL: Props["tabsL"];
  selectedTabId: string;
  setSelectedTabId: (id: string) => void;
}) => {
  const { eventData } = useEventDataContext();
  const [{ loggedIn, loginUrlM }] = useGlobalState();

  return (
    <div className={styles.container}>
      <div className={styles.myListTabs} role={AriaRoles.tabpanel}>
        <div className={styles.tabsContainer}>
          <Tags.h1 className={styles.myListTitle}>My List</Tags.h1>
          <div className={styles.tabs}>
            {L.mapWithIndex(
              (i, { title, id, alias }) => (
                <MyListTabHeader
                  key={i}
                  onClick={() => {
                    setSelectedTabId(id),
                      triggerInteractionEvent({
                        ...eventData,
                        contentIndex: i,
                        alias,
                        interactionType: InteractionEvent.CLICK,
                      });
                  }}
                  active={id === selectedTabId}
                >
                  {title}
                </MyListTabHeader>
              ),
              tabsL
            )}
          </div>
        </div>
      </div>

      {!loggedIn ? (
        <div className={styles.linkProviderContainer}>
          <P weight={Weights.semiBold} className={styles.linkProviderToView}>
            {Strings.linkProviderToViewMyList}
          </P>
          <Link
            kind={LinkKind.external}
            openInNewWindow={false}
            href={M.fromMaybe(loginUrlM, "")}
            label={Strings.linkTvProvider}
          >
            <P weight={Weights.semiBold} className={styles.underline}>
              {Strings.linkTvProvider}
            </P>
          </Link>
        </div>
      ) : (
        L.map(
          ({ content, id }) => (
            <div
              key={id}
              className={cn(styles.tabContent, {
                [styles.visible]: id === selectedTabId,
              })}
            >
              {content}
            </div>
          ),
          tabsL
        )
      )}
    </div>
  );
};

export const TabbedComponent = ({ tabsL }: Props) => {
  const initialTabM = L.head(tabsL);
  const [selectedTabIdM, setSelectedTabIdM] = useState(
    M.map((tab) => tab.id, initialTabM)
  );

  return (
    <RenderMaybe>
      {M.map((selectedTabId) => {
        const setSelectedTabId = (id: string) => setSelectedTabIdM(M.of(id));

        return (
          <View
            tabsL={tabsL}
            selectedTabId={selectedTabId}
            setSelectedTabId={setSelectedTabId}
          />
        );
      }, selectedTabIdM)}
    </RenderMaybe>
  );
};
