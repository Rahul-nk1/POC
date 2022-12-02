import * as M from "@discovery/prelude/lib/data/maybe";

import { ErrorWall } from "..";

const blocks = [
  {
    data: {},
    depth: 0,
    entityRanges: [],
    inlineStyleRanges: [],
    key: "8f7eq",
    text:
      "Streaming access is available only when you are located in the U.S. and certain U.S. territories.",
    type: "unstyled",
  },
];

export default {
  default: (
    <ErrorWall
      backgroundImageM={M.of({
        alias: M.of("xxx"),
        kind: "default",
        default: M.empty(),
        height: 1920,
        width: 916,
        src:
          "https://us1-test-images.disco-api.com/2020/8/26/910239dd-dca0-4d52-8c88-a3941128d123.jpg?bf=0&f=jpg&p=true&q=85&w=1920",
        title: M.of("Bg"),
        description: M.of("Bg"),
        cropCenter: M.empty(),
      })}
      bodyM={M.of({ blocks, entityMap: {} })}
    />
  ),
};
