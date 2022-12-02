import { useContext } from "@discovery/common-tve/lib/hooks";
import { createContext } from "react";

const AllowRemoval = createContext(false);

export const AllowRemovalProvider = ({
  value,
  children,
}: {
  value: boolean;
  children?: JSX.Element;
}) => <AllowRemoval.Provider value={value}>{children}</AllowRemoval.Provider>;

export const useAllowRemovalContext: () => boolean = () =>
  useContext(AllowRemoval);
