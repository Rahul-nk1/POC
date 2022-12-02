import { FavoriteButtonStatus } from "./types";

export const getNextStatusClick = (currentStatus: FavoriteButtonStatus) => {
  switch (currentStatus) {
    case FavoriteButtonStatus.Default:
      return FavoriteButtonStatus.Added;
    case FavoriteButtonStatus.AddConfirm:
      return FavoriteButtonStatus.RemoveConfirm;
    case FavoriteButtonStatus.RemoveConfirm:
      return FavoriteButtonStatus.AddConfirm;
    case FavoriteButtonStatus.Added:
    case FavoriteButtonStatus.Init:
      return FavoriteButtonStatus.Default;
  }
};
