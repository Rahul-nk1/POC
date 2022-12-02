import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import { DatePicker, Props } from "..";

const scheduleDataResponse = [
  {
    id: "1",
    value: new Date(),
  },
  {
    id: "2",
    value: new Date(2020, 3, 14),
  },
  {
    id: "3",
    value: new Date(2020, 3, 15),
  },
  {
    id: "4",
    value: new Date(2020, 3, 16),
  },
  {
    id: "5",
    value: new Date(2020, 3, 17),
  },
  {
    id: "6",
    value: new Date(2020, 3, 18),
  },
  {
    id: "7",
    value: new Date(2020, 3, 19),
  },
];

const dummyDateSelectorTabs = L.from(scheduleDataResponse) as Props["tabs"];

export default {
  default: (
    <div
      style={{
        width: "70vw",
        height: "100%",
        margin: "2vw",
        backgroundColor: "#200000",
      }}
    >
      <DatePicker
        tabs={dummyDateSelectorTabs}
        handleClick={() => {}}
        selectedM={M.of("3")}
      />
    </div>
  ),
};
