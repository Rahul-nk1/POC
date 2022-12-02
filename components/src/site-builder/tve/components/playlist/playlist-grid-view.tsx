import { constFalse } from "fp-ts/function";
import * as M from "@discovery/prelude/lib/data/maybe";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { CharacterLimit } from "@discovery/common-tve/src/constants";
import {
  useEffect,
  useGlobalStateModifier,
} from "@discovery/common-tve/lib/hooks";
import { _IsPlayerPage } from "@discovery/common-tve/lib/state";
import { EventDataProvider } from "@discovery/common-tve/lib/eventing";
import parse from "html-react-parser";

import { Tags } from "../../../../utils/types";
import { Content } from "../../../../components/tve/molecules/card";
import { Detailed } from "../../../../components/tve/molecules/card";
import { LinkKind } from "../../../../components/tve/atoms/link";
import { LazyLoader } from "../../../../components/tve/molecules/lazy-loader";
import { ListContainer } from "../../../../components/tve/atoms/list-container";
import { CollapsableText } from "../../../../components/tve/atoms/collapsable-text";
import { PlaylistGridProps } from "./types";
import { Kinds, Sizes, Text } from "../../../../components/tve/atoms/text";

import * as styles from "./styles.css";

export const PlaylistGridView = ({
  descriptionM = M.empty(),
  onClick,
  lazyLoadedProps,
  paginatedContent,
  componentIdM,
  aliasM,
}: PlaylistGridProps) => {
  /**
   * @TODO -- cleaner state <-> context connection
   *  - despite having PlaylistMetaContext and PageMetaContext,
   *    some footer presentation changes based on if we're on a Player page
   *  -> pipe this into Global State
   */

  const modifyState = useGlobalStateModifier(constFalse, _IsPlayerPage);

  useEffect(() => {
    modifyState();
  }, [modifyState]);

  return (
    <div className={styles.inner}>
      <ul className={styles.grid}>
        <li>
          <ListContainer className={styles.listContainer}>
            <LazyLoader<Content>
              {...lazyLoadedProps}
              paginatedContent={paginatedContent}
            >
              {(card) => (
                <EventDataProvider
                  content={card}
                  componentIdM={componentIdM}
                  alias={M.fromMaybe(aliasM, "")}
                >
                  <Detailed
                    showTitleClassName={styles.detailedCardShowTitle}
                    textContainerClassName={styles.detailedCardTextConainer}
                    key={card.id}
                    linkKind={LinkKind.eventListenerOnly}
                    onClick={onClick}
                    content={card}
                    headerTag={Tags.h2}
                    isPlaylist
                    useLargeImages
                  />
                </EventDataProvider>
              )}
            </LazyLoader>
          </ListContainer>
        </li>
        <RenderMaybe>
          {M.map(
            (description) => (
              <li className={styles.aboutSection}>
                <Text
                  className={styles.aboutHeader}
                  tag={Tags.h2}
                  kind={Kinds.subtitle}
                  size={Sizes.l}
                >
                  About
                </Text>
                <CollapsableText
                  text={parse(description)}
                  limitM={M.of(CharacterLimit.LONG_DESCRIPTION_LENGTH)}
                />
              </li>
            ),
            descriptionM
          )}
        </RenderMaybe>
      </ul>
    </div>
  );
};
