import {
  useState,
  useSonicHttp,
  useEffect,
  useGlobalState,
  useRef,
} from "@discovery/common-tve/lib/hooks";
import { SonicException } from "@discovery/sonic-api-ng/lib/app/sonic";
import * as Users from "@discovery/sonic-api-ng/lib/api/users/favorites";
import * as RD from "@discovery/prelude/lib/data/remote-data";
import {
  triggerUserProfileEvent,
  CategoryTypes,
} from "@discovery/common-tve/lib/eventing";
import { setToast } from "../toast";

enum Category {
  show = "show",
  video = "video",
}

type Msg = JSX.Element | string;

export type ToastMessages = {
  ErrorAddingShowToList: Msg;
  AddedShowToList: Msg;
  ErrorRemovingShowFromList: Msg;
  RemovedShowFromList: Msg;
  ErrorAddingEpisodeToList: Msg;
  AddedEpisodeToList: Msg;
  ErrorRemovingEpisodeFromList: Msg;
  RemovedEpisodeFromList: Msg;
  LoginMessage: Msg;
  Unknown: Msg;
};

const getToast = ({
  toastMessages,
  category,
  isFavorited,
  error = false,
}: {
  toastMessages: ToastMessages;
  category: string | Category;
  isFavorited: boolean;
  error?: boolean;
}) => {
  if (category === Category.show) {
    if (isFavorited) {
      if (error) {
        return toastMessages.ErrorAddingShowToList;
      }

      return toastMessages.AddedShowToList;
    } else {
      if (error) {
        return toastMessages.ErrorRemovingShowFromList;
      }

      return toastMessages.RemovedShowFromList;
    }
  } else if (category === Category.video) {
    if (isFavorited) {
      if (error) {
        return toastMessages.ErrorAddingEpisodeToList;
      }

      return toastMessages.AddedEpisodeToList;
    } else {
      if (error) {
        return toastMessages.ErrorRemovingEpisodeFromList;
      }

      return toastMessages.RemovedEpisodeFromList;
    }
  }

  return toastMessages.Unknown;
};

const useRDSetFavorited = ({
  response,
  setIsFavorited,
  category,
  showToast,
  isFavorited,
  id,
  toastMessages,
}: {
  response: RD.RemoteData<SonicException, unknown>;
  setIsFavorited: (favorited: boolean) => void;
  category: string | Category;
  showToast: boolean;
  isFavorited: boolean;
  id: string;
  toastMessages: ToastMessages;
}) => {
  useEffect(() => {
    let error;

    if (RD.is.Success(response)) {
      triggerUserProfileEvent(id, isFavorited, CategoryTypes.MYLIST);
      setIsFavorited(isFavorited);
      error = false;
    } else if (RD.is.Failure(response)) {
      error = true;
    }

    if (!showToast) {
      return;
    }

    // `error` will only be defined if a call was made
    if (error !== undefined) {
      const toast = getToast({
        toastMessages,
        category,
        isFavorited,
        error,
      });

      setToast(toast);
    }
  }, [
    id,
    isFavorited,
    setIsFavorited,
    response,
    category,
    showToast,
    toastMessages,
  ]);
};

export const useFavorite = (
  id: string,
  category: string,
  isFavorite: boolean,
  showToast = true,
  toastMessages: ToastMessages,
  setGlobalFavoritedState?: boolean
): [boolean, () => void, RD.RemoteData<SonicException, unknown>] => {
  const [{ loggedIn }] = useGlobalState();

  const [isFavorited, setIsFavorited] = useState(isFavorite);

  const [postResponse, postFavorite] = useSonicHttp(
    Users.Endpoints.postFavorite
  );

  const [deleteResponse, deleteFavorite] = useSonicHttp(
    Users.Endpoints.deleteFavorite
  );

  /**
   * set up the effects to run when an item is either -
   *   favorited (POST)
   *   -or- deleted (DELETE)
   *
   * the effects will update isFavorited via setState, which will cause
   * the parent component to re-render with updated state,
   * as well as cascading the effects to trigger the user-profile-event
   */
  useRDSetFavorited({
    toastMessages,
    response: postResponse,
    setIsFavorited,
    category,
    showToast,
    isFavorited: true,
    id,
  });
  useRDSetFavorited({
    toastMessages,
    response: deleteResponse,
    setIsFavorited,
    category,
    showToast,
    isFavorited: false,
    id,
  });

  const [globalState, setGlobalState] = useGlobalState();

  useEffect(() => {
    if (globalState.isFavoritedGlobalId === id) {
      setIsFavorited(globalState.isFavoritedGlobal);
    }
  }, [globalState.isFavoritedGlobal, globalState.isFavoritedGlobalId, id]);

  const previousIsFavorited = useRef(isFavorited);
  useEffect(() => {
    if (isFavorited != previousIsFavorited.current && setGlobalFavoritedState) {
      previousIsFavorited.current = isFavorited;
      setGlobalState({
        ...globalState,
        isFavoritedGlobal: isFavorited,
        isFavoritedGlobalId: id,
      });
    }
  }, [setGlobalState, isFavorited, globalState, id, setGlobalFavoritedState]);

  const setFavorite = () => {
    // https://discoveryinc.atlassian.net/browse/AWC-526
    if (!loggedIn) {
      setToast(toastMessages.LoginMessage);
      return;
    }

    const action = isFavorited ? deleteFavorite : postFavorite;
    action(id, category);
  };
  return [
    isFavorited,
    setFavorite,
    isFavorited ? deleteResponse : postResponse,
  ];
};
