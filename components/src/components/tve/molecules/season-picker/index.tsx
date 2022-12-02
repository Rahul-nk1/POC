import { cn } from "@discovery/classnames";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as L from "@discovery/prelude/lib/data/list";
import { Kinds, Sizes, Text } from "../../atoms/text";
import { Tags } from "../../../../utils/types";

import { useState, useCallback } from "@discovery/common-tve/lib/hooks";
import {
  useEventDataContext,
  triggerInteractionEvent,
  InteractionEvent,
} from "@discovery/common-tve/lib/eventing";
import { CharacterLimit } from "@discovery/common-tve/src/constants";
import { Clamp } from "../../../../utils/text";
import { AriaRoles } from "../../../../utils/types";

import { useClickOutside } from "../../../../utils/hooks/use-click-outside";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { MyListButton } from "../../atoms/my-list-button";
import { ScrollListener } from "../../atoms/scroll-listener/";

import * as styles from "./styles.css";
import { TabbableDropdown } from "@discovery/components-tve/src/utils/hooks/use-tabbable";

type Props = {
  className?: string;
  optionL: L.List<NavOption>;
  initialOptionM: M.Maybe<NavOption["id"]>;
  selectOption: (id: NavOption["id"]) => void;
  headingClassName?: string;
  headingText?: string;
  headerTag?: Tags;
  optionPrefix?: string;
  isFavoriteM: M.Maybe<boolean>;
  idM: M.Maybe<string>;
  titleM: M.Maybe<string>;
};

type HeadingTextProps = {
  isFavoriteM: M.Maybe<boolean>;
  idM: M.Maybe<string>;
  titleM: M.Maybe<string>;
};

export type NavOption = {
  id: string;
  value: M.Maybe<string>;
  parameter: string;
  l10nkey: M.Maybe<string>;
};

const heading = (
  headingText = "",
  headingClassName: string,
  headerTag = Tags.h4
) =>
  headingText && (
    <Text
      className={headingClassName}
      kind={Kinds.subtitle}
      size={Sizes.l}
      tag={headerTag}
    >
      {headingText}
    </Text>
  );

const renderTitleM = (titleM: M.Maybe<string>) =>
  M.map(
    (title) => (
      <Text
        className={styles.title}
        kind={Kinds.subtitle}
        size={Sizes.s}
        tag={Tags.h2}
      >
        <Clamp str={title} maxLength={CharacterLimit.TITLE_LENGTH} />
      </Text>
    ),
    titleM
  );

const favoriteButtonM = (idM: M.Maybe<string>, isFavoriteM: M.Maybe<boolean>) =>
  M.liftM(
    (contentId, isFavorite) => (
      <MyListButton
        id={contentId}
        category={"show"}
        isFavorited={isFavorite}
        setGlobalFavoritedState={true}
        labelClass={styles.myListButtonLabel}
      />
    ),
    idM,
    isFavoriteM
  );

export const SeasonPicker = ({
  className,
  optionL,
  initialOptionM,
  selectOption,
  headingClassName,
  headingText,
  headerTag = Tags.h4,
  optionPrefix,
  isFavoriteM,
  idM,
  titleM,
}: Props) => {
  const [open, setOpen] = useState(false);
  const containerRef = useClickOutside(() => setOpen(false));
  const [selectedSeasonM, setSelectedSeasonM] = useState(initialOptionM);

  // 7 is the maximum number of list items before the dropdown scrolls
  const isScrollable = L.length(optionL) > 7;

  const { eventData } = useEventDataContext();
  const triggerClickEvent = useCallback(
    (contentIndex: number, contentTitle: string) => {
      triggerInteractionEvent({
        ...eventData,
        contentIndex,
        content: { contentTitle, link: "" },
        interactionType: InteractionEvent.CLICK,
      });
    },
    [eventData]
  );

  const [isTopReached, setIsScrolled] = useState(false);

  if (!L.isEmpty(optionL)) {
    const selectBox = (
      <TabbableDropdown open={open} setOpen={setOpen}>
        {({
          containerEl,
          tabbableContainerProps: {
            className: accessibleClassName,
            ...tabbableContainerProps
          },
          tabbableItemPropsCallback,
        }) => (
          <div
            ref={(el) => {
              containerEl.current = el;
              containerRef.current = el;
            }}
            className={cn(styles.selectWrapper, accessibleClassName, {
              [styles.open]: open,
            })}
            onClick={() => setOpen(!open)}
            {...tabbableContainerProps}
            role={AriaRoles.listbox}
          >
            <RenderMaybe>
              {M.map(
                (selectedSeason) => (
                  <span>
                    {optionPrefix}
                    {selectedSeason}
                  </span>
                ),
                selectedSeasonM
              )}
            </RenderMaybe>
            <ul
              className={cn(styles.select, {
                [styles.open]: open,
                [styles.scroll]: isScrollable,
              })}
            >
              {L.mapWithIndex((i: number, o: NavOption) => {
                const option = M.fromMaybe(o.value, "Unknown");
                const title = `${optionPrefix}${option}`;
                const onClick = () => {
                  setSelectedSeasonM(o.value);
                  selectOption(option);
                  triggerClickEvent(i, title);
                };

                return (
                  <li
                    key={i}
                    onClick={onClick}
                    {...tabbableItemPropsCallback(onClick)}
                  >
                    <span>{title}</span>
                  </li>
                );
              }, optionL)}
            </ul>
          </div>
        )}
      </TabbableDropdown>
    );

    const disabledSelectBox = (
      <div className={cn(styles.selectWrapper, styles.chevronRemover)}>
        <RenderMaybe>
          {M.map(
            (selectedSeason) => (
              <span>
                {optionPrefix}
                {selectedSeason}
              </span>
            ),
            selectedSeasonM
          )}
        </RenderMaybe>
      </div>
    );

    return (
      <div className={styles.seasonHeadingContainer}>
        <ScrollListener setIsScrolled={setIsScrolled} />
        <div
          className={cn(styles.seasonWrapper, {
            [styles.scrollFixedContainer]: isTopReached,
          })}
        >
          {!isTopReached &&
            heading(headingText, headingClassName ?? styles.heading, headerTag)}
          {isTopReached && <RenderMaybe>{renderTitleM(titleM)}</RenderMaybe>}
          <div
            className={cn({
              [styles.scrollFixedRight]: isTopReached,
            })}
          >
            {isTopReached && (
              <RenderMaybe>{favoriteButtonM(idM, isFavoriteM)}</RenderMaybe>
            )}
            <div className={cn(styles.mainContainer, className)}>
              {optionL.length === 1 ? disabledSelectBox : selectBox}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};

export const HeadingTextTitle = ({
  isFavoriteM,
  idM,
  titleM,
}: HeadingTextProps) => {
  const [isTopReached, setIsScrolled] = useState(false);

  return (
    <RenderMaybe>
      {M.map(
        () => (
          <div className={styles.headingContainer}>
            <ScrollListener setIsScrolled={setIsScrolled} />
            <div
              className={cn(styles.seasonWrapper, {
                [styles.scrollFixedContainer]: isTopReached,
              })}
            >
              {isTopReached && (
                <RenderMaybe>{renderTitleM(titleM)}</RenderMaybe>
              )}
              <div className={styles.scrollFixedRight}>
                {isTopReached && (
                  <RenderMaybe>{favoriteButtonM(idM, isFavoriteM)}</RenderMaybe>
                )}
              </div>
            </div>
          </div>
        ),
        titleM
      )}
    </RenderMaybe>
  );
};
