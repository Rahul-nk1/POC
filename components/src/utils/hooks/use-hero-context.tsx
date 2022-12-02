import { createContext } from "react";
import { useContext, useState, useMemo } from "@discovery/common-tve/lib/hooks";

export type HeroContextType = {
  metadataAnimationComplete: boolean;
  setMetadataAnimationComplete: () => void;
  test: number;
};

const initContext = {
  metadataAnimationComplete: false,
  setMetadataAnimationComplete: () => {},
};

const HeroContext = createContext(initContext);

export const HeroContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [metadataAnimationComplete, setMetadataAnimationComplete] = useState(
    false
  );
  const value = useMemo(
    () => ({
      metadataAnimationComplete,
      setMetadataAnimationComplete: () => setMetadataAnimationComplete(true),
    }),
    [metadataAnimationComplete]
  );

  return <HeroContext.Provider value={value}>{children}</HeroContext.Provider>;
};

export const useHeroContext: () => HeroContextType = () =>
  useContext(HeroContext);
