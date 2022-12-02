import { useEffect, useHistory } from "@discovery/common-tve/src/hooks";

export const FocusClear = () => {
  const [{ location }] = useHistory();

  useEffect(() => {
    document.getElementById("shell")?.focus();
  }, [location.pathname]);

  return <></>;
};
