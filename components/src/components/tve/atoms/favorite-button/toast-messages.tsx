import * as styles from "./styles.css";
import { User as UserIcon } from "../icons";
import Strings from "../../hardcoded.json";

const MyListAction = ({ children }: { children: string }) => (
  <>
    {children} <UserIcon className={styles.toastIcon} black /> My List
  </>
);

export const AddedShowToList = <MyListAction>{Strings.showAdded}</MyListAction>;

export const ErrorAddingShowToList = (
  <MyListAction>{Strings.errorAddingShow}</MyListAction>
);

export const RemovedShowFromList = (
  <MyListAction>{Strings.showRemoved}</MyListAction>
);

export const ErrorRemovingShowFromList = (
  <MyListAction>{Strings.errorAddingShow}</MyListAction>
);

export const AddedEpisodeToList = (
  <MyListAction>{Strings.episodeAdded}</MyListAction>
);

export const ErrorAddingEpisodeToList = (
  <MyListAction>{Strings.errorAddingEpisode}</MyListAction>
);

export const RemovedEpisodeFromList = (
  <MyListAction>{Strings.episodeRemoved}</MyListAction>
);

export const ErrorRemovingEpisodeFromList = (
  <MyListAction>{Strings.errorRemovingEpisode}</MyListAction>
);

export const LoginMessage = (
  <MyListAction>{Strings.linkToAddToMyList}</MyListAction>
);

export const Unknown = Strings.unknownError;
