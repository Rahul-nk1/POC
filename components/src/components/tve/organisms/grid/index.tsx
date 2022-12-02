import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { EventDataProvider } from "@discovery/common-tve/lib/eventing";
import {
  useState,
  useCallback,
  useEffect,
} from "@discovery/common-tve/lib/hooks";

import { GridPagination } from "../../organisms/content-grid/paginated";
import { HorizontalSlider } from "../../molecules/horizontal-slider";
import {
  Poster,
  PosterKind,
  Standard,
  Detailed,
  DetailedHighlight,
  DetailedHighlightMini,
  StandardKind,
} from "../../molecules/card";
import { CommonGridProps } from "../content-grid";
import { Tags } from "../../../../utils/types";

import * as cardStyles from "../../molecules/card/styles.css";
import * as styles from "./styles.css";

const onScrollRight = (_pagination?: GridPagination) => (
  pagesRemaining: number
) => {
  const pagination = _pagination ? _pagination : undefined;
  const pagesLeftM = M.join(M.of(pagination?.state.pagesLeftM));

  const possiblyPagesRemaining = Boolean(
    M.fromMaybe(
      M.map((pagesLeft) => pagesLeft > 0, pagesLeftM),
      false
    ) || pagination?.state.isLoading
  );

  const shouldPaginate = pagesRemaining <= 3;
  if (possiblyPagesRemaining && shouldPaginate) {
    pagination?.fetchMore();
  }
};

export const PosterPrimaryRail = ({
  contentL,
  onClick,
  onFavoriteChange,
  headerTag,
  cardHeaderTag,
  pagination: _pagination,
}: CommonGridProps) => {
  const scrollRightHandler = onScrollRight(_pagination);
  return (
    <HorizontalSlider
      onScrollRight={scrollRightHandler}
      classNames={{ rail: styles.hoverPadding, container: styles.slider }}
      navButtonClassLeft={cn(styles.navButtonsPosterRail, styles.navButtonLeft)}
      navButtonClassRight={cn(
        styles.navButtonsPosterRail,
        styles.navButtonRight
      )}
    >
      {L.mapWithIndex(
        (i, x) => (
          <EventDataProvider
            key={x.id}
            metaTag="PosterPrimaryRail"
            contentIndex={i}
            content={x}
          >
            <Poster
              content={x}
              headerTag={cardHeaderTag ?? headerTag}
              onClick={onClick}
              onFavoriteChange={onFavoriteChange}
              className={cardStyles.gridMargin}
              kind={PosterKind.Primary}
            />
          </EventDataProvider>
        ),
        contentL
      )}
    </HorizontalSlider>
  );
};

export const PosterSecondaryGrid = ({
  contentL,
  onClick,
  onFavoriteChange,
  paginationM,
}: CommonGridProps) => (
  <>
    <div className={styles.cardsPosterSecondary}>
      {L.mapWithIndex(
        (i, x) => (
          <EventDataProvider
            key={x.id}
            metaTag="PosterSecondaryGrid"
            contentIndex={i}
            content={x}
          >
            <Poster
              content={x}
              onClick={onClick}
              onFavoriteChange={onFavoriteChange}
              kind={PosterKind.Secondary}
            />
          </EventDataProvider>
        ),
        contentL
      )}
    </div>
    <RenderMaybe>{M.map((pagination) => pagination, paginationM)}</RenderMaybe>
  </>
);

export const StandardRail = ({
  contentL,
  showChannelLogo = true,
  onClick,
  onFavoriteChange,
  headerTag = Tags.h4,
  cardHeaderTag,
  pagination: _pagination,
}: CommonGridProps) => {
  const scrollRightHandler = onScrollRight(_pagination);

  const [innerRailRef, setInnerRailRef] = useState<HTMLDivElement | null>(null);
  const onEnter = useCallback(() => {
    if (innerRailRef) {
      innerRailRef.style.marginBottom = "-138px";
      innerRailRef.style.paddingBottom = "138px";
    }
  }, [innerRailRef]);

  const onLeave = useCallback(() => {
    if (innerRailRef) {
      innerRailRef.style.marginBottom = "";
      innerRailRef.style.paddingBottom = "";
    }
  }, [innerRailRef]);

  useEffect(() => {
    if (innerRailRef) {
      innerRailRef.addEventListener("mouseenter", onEnter);
      innerRailRef.addEventListener("mouseleave", onLeave);
    }

    return () => {
      if (innerRailRef) {
        innerRailRef.removeEventListener("mouseenter", onEnter);
        innerRailRef.removeEventListener("mouseleave", onLeave);
      }
    };
  }, [innerRailRef, onEnter, onLeave]);

  return (
    <HorizontalSlider
      onScrollRight={scrollRightHandler}
      classNames={{ rail: styles.hoverPadding, container: styles.slider }}
      innerRef={setInnerRailRef}
      navButtonClassLeft={cn(
        styles.navButtonsStandardRail,
        styles.navButtonLeft
      )}
      navButtonClassRight={cn(
        styles.navButtonsStandardRail,
        styles.navButtonRight
      )}
    >
      {L.mapWithIndex(
        (i, x) => (
          <EventDataProvider
            metaTag="StandardRail"
            contentIndex={i}
            content={x}
            key={x.id}
          >
            <Standard
              content={x}
              headerTag={cardHeaderTag ?? headerTag}
              showChannelLogo={showChannelLogo}
              onClick={onClick}
              onFavoriteChange={onFavoriteChange}
            />
          </EventDataProvider>
        ),
        contentL
      )}
    </HorizontalSlider>
  );
};

export const StandardSecondaryGrid = ({
  contentL,
  showChannelLogo = true,
  onClick,
  onFavoriteChange,
  headerTag = Tags.h4,
  cardHeaderTag,
  paginationM,
}: CommonGridProps) => {
  const [innerRailRef, setInnerRailRef] = useState<HTMLDivElement | null>(null);
  const onEnter = useCallback(() => {
    if (innerRailRef) {
      innerRailRef.style.marginBottom = "-138px";
      innerRailRef.style.paddingBottom = "138px";
    }
  }, [innerRailRef]);

  const onLeave = useCallback(() => {
    if (innerRailRef) {
      innerRailRef.style.marginBottom = "";
      innerRailRef.style.paddingBottom = "";
    }
  }, [innerRailRef]);

  useEffect(() => {
    if (innerRailRef) {
      innerRailRef.addEventListener("mouseenter", onEnter);
      innerRailRef.addEventListener("mouseleave", onLeave);
    }

    return () => {
      if (innerRailRef) {
        innerRailRef.removeEventListener("mouseenter", onEnter);
        innerRailRef.removeEventListener("mouseleave", onLeave);
      }
    };
  }, [innerRailRef, onEnter, onLeave]);
  return (
    <>
      <div className={styles.cardsStandardSecondary} ref={setInnerRailRef}>
        {L.mapWithIndex(
          (i, x) => (
            <EventDataProvider
              key={x.id}
              metaTag="StandardSecondaryGrid"
              contentIndex={i}
            >
              <Standard
                content={x}
                headerTag={cardHeaderTag ?? headerTag}
                showChannelLogo={showChannelLogo}
                onClick={onClick}
                kind={StandardKind.Secondary}
                onFavoriteChange={onFavoriteChange}
              />
            </EventDataProvider>
          ),
          contentL
        )}
      </div>
      <RenderMaybe>
        {M.map((pagination) => pagination, paginationM)}
      </RenderMaybe>
    </>
  );
};

export const DetailGrid = ({
  contentL,
  onClick,
  paginationM,
  headerTag = Tags.h3,
  cardHeaderTag,
}: CommonGridProps) => (
  <div>
    {L.mapWithIndex(
      (i, x) => (
        <EventDataProvider
          metaTag="DetailGrid"
          contentIndex={i}
          content={x}
          key={x.id}
        >
          <Detailed
            headerTag={cardHeaderTag ?? headerTag}
            content={x}
            onClick={onClick}
          />
        </EventDataProvider>
      ),
      contentL
    )}
    <RenderMaybe>{M.map((pagination) => pagination, paginationM)}</RenderMaybe>
  </div>
);

export const DetailGridHighlight = ({ contentL, onClick }: CommonGridProps) => (
  <div>
    {L.mapWithIndex(
      (i, x) => (
        <EventDataProvider
          metaTag="DetailGridHighlight"
          contentIndex={i}
          content={x}
          key={x.id}
        >
          <DetailedHighlight content={x} onClick={onClick} />
        </EventDataProvider>
      ),
      contentL
    )}
  </div>
);

export const HighlightMiniGrid = ({
  contentL,
  onClick,
  paginationM,
}: CommonGridProps) => (
  <div>
    {L.mapWithIndex(
      (i, x) => (
        <EventDataProvider
          metaTag="HighlightMiniGrid"
          contentIndex={i}
          content={x}
          key={x.id}
        >
          <DetailedHighlightMini content={x} onClick={onClick} />
        </EventDataProvider>
      ),
      contentL
    )}
    <RenderMaybe>{M.map((pagination) => pagination, paginationM)}</RenderMaybe>
  </div>
);
