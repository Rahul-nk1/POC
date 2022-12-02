import * as L from "@discovery/prelude/lib/data/list";
import { cn } from "@discovery/classnames";
import { useEffect } from "@discovery/common-tve/src/hooks";

import { PosterKind } from "../../molecules/card";
import { MainContainer } from "../main-container";
import { ScheduleviewShimmer } from "../../../../site-builder/tve/components/tabbed-content/ScheduleviewShimmer";
import {
  getCount,
  SubtabShimmer,
} from "../../molecules/network-selector/subtabs/SubtabShimmer";
import {
  DetailShimmer,
  PosterShimmer,
  StandardShimmer,
} from "../../organisms/content-grid-shimmer";

import * as styles from "./styles.css";
import * as shimmerStyles from "../../organisms/content-grid-shimmer/styles.css";

const Dot = (props: { n: number; className: string }) => (
  <div className={cn(styles.bounce, props.className)} />
);

export type SpinnerType = {
  className?: string;
};

export const Spinner = (props?: SpinnerType) => (
  <div className={cn(styles.spinner, props?.className)}>
    <Dot n={1} className={styles.n1} />
    <Dot n={2} className={styles.n2} />
    <Dot n={3} className={styles.n3} />
  </div>
);

export const SpinnerPage = (props?: SpinnerType) => (
  <div className={cn(styles.spinnerPage, props?.className)}>
    <Spinner />
  </div>
);

export const PageContainer = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => <div className={styles.container}>{children}</div>;

export const HeroCardShimmer = ({
  isCarousel = false,
  isCompact = false,
}: {
  isCarousel?: boolean;
  isCompact?: boolean;
}): JSX.Element => (
  <div className={styles.heroContainer}>
    <div
      className={cn(styles.innerContainer, {
        [styles.carousel]: isCarousel,
        [styles.compact]: isCompact,
      })}
    >
      <div className={styles.metadataWideContainer}>
        <div className={styles.metadataWrapper}>
          <div
            className={cn(
              styles.metadataContainer,
              styles.carouselMetadataContainer,
              styles.single
            )}
          >
            <div className={styles.metadataLeft}>
              <div className={styles.imageTitleBar}></div>
              {!isCompact && (
                <>
                  <div className={styles.tuneInBar}></div>
                  <div className={styles.descripitonBar}></div>
                </>
              )}
              <div className={styles.buttonBar}></div>
            </div>
            <div className={styles.metadataRight}>
              <div className={styles.networkLogoBar}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const HomePage = (): JSX.Element => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <PageContainer>
      <HeroCardShimmer isCarousel />
      <MainContainer>
        <div className={shimmerStyles.commonShimmerWrapper}>
          <div className={shimmerStyles.commonTitleShimmer} />
          <div style={{ display: "flex" }}>
            {L.times(
              (i) => (
                <div key={i} className={styles.gridMargin}>
                  <StandardShimmer />
                </div>
              ),
              getCount()
            )}
          </div>
        </div>
        <div className={shimmerStyles.commonShimmerWrapper}>
          <div className={shimmerStyles.commonTitleShimmer} />
          <div style={{ display: "flex" }}>
            {L.times(
              (i) => (
                <div key={i} className={styles.gridMargin}>
                  <PosterShimmer kind={PosterKind.Primary} />
                </div>
              ),
              getCount()
            )}
          </div>
        </div>
      </MainContainer>
    </PageContainer>
  );
};

export const ShowPageShimmer = (): JSX.Element => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <PageContainer>
      <HeroCardShimmer isCompact />
      <div className={styles.inner}>
        <div className={shimmerStyles.commonTitleShimmer} />
        {L.times(
          (i) => (
            <DetailShimmer key={i} />
          ),
          3
        )}
      </div>
    </PageContainer>
  );
};

export const TabbedShowsPageShimmer = (): JSX.Element => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <PageContainer>
      <div style={{ marginBottom: "32px", width: "100%" }}>
        <div className={styles.networkTabs}>
          <div className={styles.slider}></div>
        </div>
        <SubtabShimmer />
      </div>
    </PageContainer>
  );
};

export const LiveNowPageShimmer = (): JSX.Element => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <PageContainer>
      <div style={{ width: "100%" }}>
        <div className={styles.networkTabs}>
          <div className={styles.slider}></div>
        </div>
        <div className={styles.subtabs}>
          {L.times(
            (i) => (
              <div key={i} className={styles.dateBox}>
                <div className={styles.dayOfWeek} />
                <div className={styles.date} />
                <div className={styles.bottomBar} />
              </div>
            ),
            8
          )}
        </div>
        <div className={styles.listContainerSchedule}>
          <ScheduleviewShimmer />
        </div>
      </div>
    </PageContainer>
  );
};

export const Shimmer = (): JSX.Element => {
  const shortsPathName = window.location.pathname.split("/")[1];
  const path = window.location.pathname;
  const pathName = shortsPathName === "show" ? shortsPathName : path;
  switch (pathName) {
    case "/":
      return <HomePage />;
    case "show":
      return <ShowPageShimmer />;
    case "/shows":
    case "/tabbed-shows":
      return <TabbedShowsPageShimmer />;
    case "/live-now":
      return <LiveNowPageShimmer />;
    default:
      return <SpinnerPage />;
  }
};
