import { StandardShimmer, PosterShimmer, DetailShimmer } from "../";
import { PosterKind } from "../../../molecules/card";

export default {
  "Standard Shimmer": (
    <div style={{ display: "flex" }}>
      <StandardShimmer />
      <StandardShimmer />
      <StandardShimmer />
      <StandardShimmer />
    </div>
  ),
  "Poster Shimmer": (
    <>
      <PosterShimmer kind={PosterKind.Primary} />
      <PosterShimmer kind={PosterKind.Secondary} />
      <PosterShimmer kind={PosterKind.Primary} />
      <PosterShimmer kind={PosterKind.Secondary} />
    </>
  ),
  "Detail Shimmer": (
    <>
      <DetailShimmer />
      <DetailShimmer />
      <DetailShimmer />
      <DetailShimmer />
    </>
  ),
  "DetailHighlight Shimmer": (
    <>
      <DetailShimmer highlight />
      <DetailShimmer highlight />
      <DetailShimmer highlight />
      <DetailShimmer highlight />
    </>
  ),
  "DetailHighlightMini Shimmer": (
    <>
      <DetailShimmer miniHighlight />
      <DetailShimmer miniHighlight />
      <DetailShimmer miniHighlight />
      <DetailShimmer miniHighlight />
    </>
  ),
};
