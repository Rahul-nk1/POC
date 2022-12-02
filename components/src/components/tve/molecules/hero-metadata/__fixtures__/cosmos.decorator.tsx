export default (props: { children: React.ReactNode }) => (
  <div
    style={{
      padding: "1em 2em",
      backdropFilter: "invert(76%)",
      height: "100vh",
      width: "100vw",
      boxSizing: "border-box",
      color: "#fff",
    }}
  >
    <div style={{ display: "inline-block" }}>{props.children}</div>
  </div>
);
