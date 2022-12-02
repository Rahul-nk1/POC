import * as ReactDOM from "react-dom";
import { ErrorPageGeneric } from "@discovery/components-tve/src/components/tve/molecules/error-pages";

export const renderErrorPage = (root: HTMLElement) =>
  ReactDOM.render(
    <>
      <ErrorPageGeneric />
      <div
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          position: "fixed",
        }}
      >
        Unexpected client error
      </div>
    </>,
    root
  );
