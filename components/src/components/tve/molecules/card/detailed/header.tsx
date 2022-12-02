import { useContext } from "@discovery/common-tve/lib/hooks";

const ShortHeader = React.createContext(false);

export const ShortHeaderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => <ShortHeader.Provider value={true}>{children}</ShortHeader.Provider>;

/**
 * This returns true when called in a descendent of a ShortHeaderProvider.
 * Use this value for hide detailed show title
 */
export const useShortHeader: () => boolean = () => useContext(ShortHeader);
