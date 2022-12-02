import type { FC } from "react";
import { useEffect, useRef, useInView } from "@discovery/common-tve/lib/hooks";
import * as styles from "./styles.css";

type Props = {
  setIsScrolled: (isAtTop: boolean) => void;
};

export const ScrollListener: FC<Props> = ({ setIsScrolled }) => {
  const scrollTrigger = useRef(null);
  const isMounted = useRef(false);
  const { inView: isAtTop } = useInView(scrollTrigger, {
    root: { current: null },
    threshold: 0,
  });

  useEffect(() => {
    // inView will always be false before first render, so we need to wait until
    // after isMounted before triggering any transitions
    if (isMounted.current) {
      setIsScrolled(!isAtTop);
    } else {
      isMounted.current = true;
    }
  }, [isAtTop, setIsScrolled]);

  return <div className={styles.scrollTrigger} ref={scrollTrigger} />;
};
