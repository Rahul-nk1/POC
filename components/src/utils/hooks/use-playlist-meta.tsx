import { createContext } from "react";
import { useContext, useMemo, useState } from "@discovery/common-tve/lib/hooks";
import * as M from "@discovery/prelude/lib/data/maybe";

export type PlaylistMetaType = {
  titleM: M.Maybe<string>;
  descriptionM: M.Maybe<string>;
  playIndexM: M.Maybe<number>;
  setPlayIndexM: (i: M.Maybe<number>) => void;
};

const initContext: PlaylistMetaType = {
  titleM: M.empty(),
  descriptionM: M.empty(),
  playIndexM: M.empty(),
  setPlayIndexM: () => {},
};

const PlaylistMetaContext = createContext(initContext);

type PlaylistMetaProviderType = Omit<PlaylistMetaType, "setPlayIndexM"> & {
  children: JSX.Element;
};

export const PlaylistMetaProvider = ({
  titleM = initContext.titleM,
  descriptionM = initContext.descriptionM,
  playIndexM = initContext.playIndexM,
  children,
}: PlaylistMetaProviderType) => {
  const [_playIndexM, _setPlayIndexM] = useState<M.Maybe<number>>(playIndexM);

  const value = useMemo(
    () => ({
      titleM,
      descriptionM,
      playIndexM: _playIndexM,
      setPlayIndexM: _setPlayIndexM,
    }),
    [_playIndexM, descriptionM, titleM]
  );

  return (
    <PlaylistMetaContext.Provider value={value}>
      {children}
    </PlaylistMetaContext.Provider>
  );
};

export const usePlaylistMeta: () => PlaylistMetaType = () =>
  useContext(PlaylistMetaContext);
