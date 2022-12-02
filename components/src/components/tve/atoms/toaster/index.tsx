import { useEffect, useState } from "@discovery/common-tve/lib/hooks";
import { useReadToast } from "../../../../utils/toast";
import { Portal, PortalIds } from "../../../../utils/portals";

import * as styles from "./styles.css";

export type ToastProps = {
  className: string;
  msg: JSX.Element | string;
};

let timer: ReturnType<typeof setTimeout>;
let uniqueKey = 0;

type Toast = { msg: JSX.Element | string; key: number };
export const Toaster = ({
  toast: Toast,
}: {
  toast: (props: ToastProps) => JSX.Element;
}) => {
  const toast = useReadToast();
  const [toastIn, setIncomingToast] = useState<Toast>({ msg: "", key: -2 });
  const [toastOut, setOutgoingToast] = useState<Toast>({ msg: "", key: -1 });

  useEffect(() => {
    setIncomingToast({ msg: toast, key: uniqueKey++ });
    return () => {
      setOutgoingToast({ msg: toast, key: uniqueKey++ });
      clearTimeout(timer);
      timer = setTimeout(() => {
        setOutgoingToast({ msg: "", key: uniqueKey++ });
      }, 1000);
    };
  }, [toast]);

  return (
    <Portal id={PortalIds.Toast}>
      <>
        {toastIn.msg && (
          <Toast
            className={styles.reveal}
            key={toastIn.key}
            msg={toastIn.msg}
          />
        )}
        {toastOut.msg && (
          <Toast
            className={styles.hide}
            key={toastOut.key}
            msg={toastOut.msg}
          />
        )}
      </>
    </Portal>
  );
};
