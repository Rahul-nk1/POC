import { GoToPrev, GoToNext } from "..";

const noop = () => {};

export default {
  left: <GoToPrev onClick={noop} />,
  right: <GoToNext onClick={noop} />,
};
