import { Spinner } from "..";

const styles = {
  width: "100%",
  height: "100%",
  backgroundColor: "#000",
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
} as const;

export default {
  "Dark background, full screen": (
    <div style={styles}>
      <Spinner />
    </div>
  ),
};
