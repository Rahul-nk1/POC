import { useState } from "@discovery/common-tve/lib/hooks";
import { MyListButton } from "../";
import {
  MyListButtonStatus,
  MyListButtonTheme,
  MyListButtonVariant,
} from "../types";
import * as styles from "../styles.css";

const MyListButtonWithClick = ({
  isFavorited = false,
  variant = MyListButtonVariant.Default,
}) => {
  const [favorite, setFavorite] = useState(isFavorited);

  const onClick = () => setFavorite(!favorite);

  return (
    <MyListButton
      className={styles.fixtureContainer}
      id="1"
      category="show"
      isFavorited={favorite}
      onClick={onClick}
      variant={variant}
    />
  );
};

export default {
  "default view (light)": (
    <MyListButton
      changeStatusOnClick
      className={styles.fixtureContainer}
      id="1"
      category="show"
      isFavorited={false}
    />
  ),
  "default view (dark)": (
    <MyListButton
      changeStatusOnClick
      className={styles.fixtureContainer}
      id="1"
      category="show"
      isFavorited={false}
      theme={MyListButtonTheme.Dark}
    />
  ),
  "hero view (light, default)": (
    <MyListButton
      changeStatusOnClick
      className={styles.fixtureContainer}
      id="1"
      category="show"
      isFavorited={false}
      variant={MyListButtonVariant.Hero}
    />
  ),
  "default view w/ onClick": <MyListButtonWithClick />,
  "hero view w/ onClick": (
    <MyListButtonWithClick variant={MyListButtonVariant.Hero} />
  ),
  "add confirm": (
    <MyListButton
      className={styles.fixtureContainer}
      id="1"
      category="show"
      status={MyListButtonStatus.AddConfirm}
    />
  ),
  added: (
    <MyListButton
      className={styles.fixtureContainer}
      id="1"
      category="show"
      status={MyListButtonStatus.Added}
    />
  ),
  "remove confirm": (
    <MyListButton
      className={styles.fixtureContainer}
      id="1"
      category="show"
      status={MyListButtonStatus.RemoveConfirm}
    />
  ),
  favorited: (
    <MyListButton
      className={styles.fixtureContainer}
      isFavorited
      id="1"
      category="show"
    />
  ),
  "favorited w/ onClick": <MyListButtonWithClick isFavorited />,
  "hero favorited w/ onClick": (
    <MyListButtonWithClick isFavorited variant={MyListButtonVariant.Hero} />
  ),
};
