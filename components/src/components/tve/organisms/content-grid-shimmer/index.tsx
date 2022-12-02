import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import { PageTemplate } from "@discovery/common-tve/lib/constants";

import { Kind } from "../../../../site-builder/tve/components/content-grid";
import { getCount } from "../../molecules/network-selector/subtabs/SubtabShimmer";
import { PosterKind } from "../../molecules/card";
import { ContentGrid } from "../content-grid";
import { usePageMeta } from "../../../../utils/hooks/use-page-meta";

import * as styles from "./styles.css";
import * as cardStyles from "../../molecules/card/styles.css";
import * as detailStyles from "../../molecules/card/detailed/styles.css";
import * as posterStyles from "../../molecules/card/poster/styles.css";
import * as standardStyles from "../../molecules/card/standard/styles.css";

export const PaginationShimmerButton = () => (
  <div className={styles.paginateShimmerButtonContainer}>
    <div className={styles.paginateShimmerButton} />
  </div>
);

export const StandardShimmer = () => (
  <>
    <div
      className={cn(
        cardStyles.container,
        cardStyles.gridMargin,
        standardStyles.standard
      )}
    >
      <div className={standardStyles.imageContainer}>
        <div className={standardStyles.imageContainerContent}>
          <div className={cardStyles.imageContainerInside}>
            <div className={styles.image} />
          </div>
        </div>
      </div>
      <div className={standardStyles.metaDataContainer}>
        <div className={standardStyles.hoverBackground} />
        <div
          className={cn(cardStyles.metaDataInner, standardStyles.metaDataInner)}
        >
          <div className={cn(standardStyles.metaLeft)}>
            <div className={cn(styles.shimmerTitle)}></div>
          </div>
          <div className={standardStyles.metaRight}>
            <div className={cn(styles.shimmerChannelLogo)}></div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export const PosterShimmer = (props: { kind: PosterKind }) => (
  <>
    <div
      className={cn(
        cardStyles.container,
        posterStyles.poster,
        posterStyles[props.kind]
      )}
    >
      <div className={posterStyles.imageContainer}>
        <div className={cardStyles.imageContainerInside}>
          <div className={styles.image}></div>
        </div>
      </div>
      <div className={cn(cardStyles.metaDataInner, posterStyles.metaDataInner)}>
        <div className={cardStyles.metaDataRow}>
          <div className={posterStyles.metaLeft}>
            <div className={styles.shimmerTitle}></div>
          </div>

          <div className={posterStyles.metaRight}>
            <div className={styles.shimmerChannelLogo}></div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export const DetailShimmer = (props: {
  miniHighlight?: boolean;
  highlight?: boolean;
}) => {
  const { templateId: pageTemplate } = usePageMeta();
  const detailedHighlightMini = props.miniHighlight
    ? pageTemplate === PageTemplate.Secondary
      ? cn(
          detailStyles.detailedHighlightMini,
          detailStyles.cardSeparatorLivePlayer
        )
      : cn(
          detailStyles.detailedHighlightMini,
          detailStyles.fullWidth,
          detailStyles.cardSeparatorLiveNow
        )
    : "";
  return (
    <>
      <div
        className={cn(
          cardStyles.container,
          detailStyles.detailed,
          props.highlight
            ? detailStyles.detailedHighlight
            : detailedHighlightMini
        )}
      >
        <div
          className={
            props.highlight
              ? ""
              : cn(detailStyles.innerContainer, {
                  [detailStyles.withoutTimeContainer]: !props.miniHighlight,
                })
          }
        >
          {props.miniHighlight && (
            <div className={detailStyles.timeContainer}>
              <div className={styles.secondRow} />
            </div>
          )}
          <div className={detailStyles.relativeContainer}>
            <div className={cn(detailStyles.imageContainer)}>
              <div
                className={cn(cardStyles.imageContainerInside, {
                  [detailStyles.detailedImageContainerInside]: !props.highlight,
                })}
              >
                <div className={styles.image} />
              </div>
            </div>
          </div>
          <div className={cn(detailStyles.textContainer, styles.outer)}>
            <div
              className={cn(
                {
                  [detailStyles.seasonNumberEpisodeNumber]: !props.highlight,
                },
                styles.firstRow
              )}
            />
            <div className={styles.secondRow} />
            <div className={styles.thirdRow} />
            {props.highlight ? (
              <>
                <div className={styles.fourthRow} />
                <div className={styles.fifthRow} />
              </>
            ) : (
              <div
                className={cn(detailStyles.hideMobile, styles.hideBwMobileTab)}
              >
                <div className={styles.fourthRow} />
                <div className={styles.fifthRow} />
              </div>
            )}
          </div>
          {!props.highlight && (
            <div
              className={cn(
                detailStyles.mobileDescription,
                styles.showBwMobileTab
              )}
            >
              <div className={styles.fourthRow} />
              <div className={styles.fifthRow} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

type Props = {
  kind: Kind;
};

const RailShimmer = ({ kind }: { kind: Props["kind"] }) => {
  switch (kind) {
    case Kind.PosterPrimary: {
      return (
        <div className={styles.gridMargin}>
          <PosterShimmer kind={PosterKind.Primary} />
        </div>
      );
    }
    case Kind.PosterSecondary: {
      return (
        <div className={styles.gridMargin}>
          <PosterShimmer kind={PosterKind.Secondary} />
        </div>
      );
    }
    case Kind.Standard: {
      return (
        <div className={styles.gridMargin}>
          <StandardShimmer />
        </div>
      );
    }
    case Kind.StandardSecondary: {
      return <StandardShimmer />;
    }
    case Kind.Detail: {
      return <DetailShimmer />;
    }
    case Kind.DetailHighlight: {
      return <DetailShimmer highlight />;
    }
    case Kind.HighlightMini: {
      return <DetailShimmer miniHighlight />;
    }
  }
};

type AsyncShimmerProps = {
  kind: Kind;
  isInView: boolean;
  titleM: M.Maybe<string>;
  isFetchingAsyncCollection: boolean;
  triggerRef?: React.Ref<HTMLDivElement>;
};

export const ContentGridAsyncShimmer: React.FC<AsyncShimmerProps> = ({
  children,
  kind,
  isInView,
  titleM,
  isFetchingAsyncCollection,
  triggerRef,
}) =>
  isInView && !isFetchingAsyncCollection ? (
    <>{children}</>
  ) : (
    <div ref={triggerRef} className={styles.container}>
      <ContentGrid titleM={titleM} isEmpty={false}>
        <div
          className={cn({
            [styles.shimmerContainer]: kind !== Kind.Detail,
          })}
        >
          {L.times(
            (index) => (
              <RailShimmer key={index} kind={kind} />
            ),
            getCount()
          )}
        </div>
      </ContentGrid>
    </div>
  );
