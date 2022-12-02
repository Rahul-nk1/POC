import { useInView, useEffect, useRef } from "@discovery/common-tve/lib/hooks";

import * as styles from "./styles.css";
import { Spinner } from "../../../atoms/spinner";

export const LazyTrigger = ({
  onTrigger,
  show,
  loading,
}: {
  onTrigger: () => void;
  show: boolean;
  loading: boolean;
}) => {
  const lazyTrigger = useRef<HTMLDivElement>(null);
  const { inView } = useInView(lazyTrigger, {
    root: { current: null },
    threshold: 1,
  });

  useEffect(() => {
    if (inView && show && !loading) {
      onTrigger();
    }
  }, [inView, onTrigger, show, loading]);

  return (
    <div className={styles.paginateButtonContainer}>
      <div className={styles.lazyTrigger} ref={lazyTrigger} />
      {loading && <Spinner />}
    </div>
  );
};
