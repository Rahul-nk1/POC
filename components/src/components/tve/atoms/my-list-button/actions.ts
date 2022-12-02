import { MyListButtonStatus } from "./types";

export const getNextStatusClick = (currentStatus: MyListButtonStatus) => {
  switch (currentStatus) {
    case MyListButtonStatus.Default:
      return MyListButtonStatus.Added;
    case MyListButtonStatus.AddConfirm:
      return MyListButtonStatus.RemoveConfirm;
    case MyListButtonStatus.RemoveConfirm:
      return MyListButtonStatus.AddConfirm;
    case MyListButtonStatus.Added:
    case MyListButtonStatus.Init:
      return MyListButtonStatus.Default;
  }
};
