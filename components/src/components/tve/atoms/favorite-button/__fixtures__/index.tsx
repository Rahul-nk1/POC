import { useState } from "@discovery/common-tve/lib/hooks";

import { FavoriteButton } from "../";
import { FavoriteButtonStatus, FavoriteButtonDirection } from "../types";
import * as styles from "../styles.css";

const FavoriteButtonWithClick = ({ isFavorited = false }) => {
  const [favorite, setFavorite] = useState(isFavorited);

  const onClick = () => setFavorite(!favorite);

  return (
    <FavoriteButton
      className={styles.fixtureContainer}
      id="1"
      category="show"
      isFavorited={favorite}
      onClick={onClick}
    />
  );
};

export default {
  "default view": (
    <FavoriteButton
      changeStatusOnClick
      className={styles.fixtureContainer}
      id="1"
      category="show"
      isFavorited={false}
    />
  ),
  "default view w/ onClick": <FavoriteButtonWithClick />,
  "add confirm": (
    <FavoriteButton
      changeStatusOnClick
      className={styles.fixtureContainer}
      id="1"
      category="show"
      status={FavoriteButtonStatus.AddConfirm}
    />
  ),
  added: (
    <FavoriteButton
      changeStatusOnClick
      className={styles.fixtureContainer}
      id="1"
      category="show"
      status={FavoriteButtonStatus.Added}
    />
  ),
  "remove confirm": (
    <FavoriteButton
      changeStatusOnClick
      className={styles.fixtureContainer}
      id="1"
      category="show"
      status={FavoriteButtonStatus.RemoveConfirm}
    />
  ),
  "dtc FavoriteButton": (
    <FavoriteButton
      changeStatusOnClick
      direction={FavoriteButtonDirection.Right}
      id={"123"}
      isFavorited={false}
      category="show"
      className={styles.fixtureContainer}
    />
  ),
  favorited: (
    <FavoriteButton
      changeStatusOnClick
      className={styles.fixtureContainer}
      isFavorited
      id="1"
      category="show"
    />
  ),
  "favorited w/ onClick": <FavoriteButtonWithClick isFavorited />,
};
