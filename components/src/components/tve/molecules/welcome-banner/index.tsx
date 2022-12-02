import * as RD from "@discovery/prelude/lib/data/remote-data";
import { Translations } from "@discovery/components-luna/lib/components/translations";
import {
  useStorage,
  useGlobalState,
  useCallback,
  useEffect,
} from "@discovery/common-tve/src/hooks";
import { H5, P, Sizes } from "../../atoms/text";
import { Portal, PortalIds } from "../../../../utils/portals";
import translations from "./translations/keys.json";
import * as styles from "./styles.css";
import { Button, ButtonType } from "../../atoms/button";
import { LinkKind } from "../../atoms/link";
import logo from "~brand/img/logo.svg";

type StorageData = {
  isDismissed: boolean;
};

export const View = ({ onDismiss }: { onDismiss: () => void }) => {
  const [{ loginUrlM, loggedIn }] = useGlobalState();
  useEffect(() => {
    // This will cover an edge-case - when the user signs in
    // and signs out - the banner shouldn’t appear.
    // Not necessarily they click on "Link to Provider" button.
    if (loggedIn) {
      onDismiss();
    }
  }, [loggedIn, onDismiss]);
  return !loggedIn ? (
    <Translations
      importP={(lang: string) => import(`./translations/${lang}/keys.json`)}
      fallbackImport={translations}
    >
      {(lookup) => (
        <div className={styles.welcomeBanner}>
          <div className={styles.inner}>
            <img
              // TOSO: Use <SonicImage>
              src={logo}
              className={styles.logo}
            />
            <div className={styles.textGroup}>
              <H5 className={styles.header}>
                {lookup("page.welcomeBanner.header")}
              </H5>
              <P size={Sizes.s} className={styles.description}>
                {lookup("page.welcomeBanner.description")}
              </P>
            </div>
            <div className={styles.buttonGroup}>
              <Button
                linkM={loginUrlM}
                kind={LinkKind.external}
                openInNewWindow={false}
                type={ButtonType.outlined}
                className={styles.loginButton}
                label={lookup("page.welcomeBanner.linkButtonLabel")}
              />
              <Button
                onClick={onDismiss}
                kind={LinkKind.eventListenerOnly}
                type={ButtonType.text}
                className={styles.dismissButton}
                textClassName={styles.dismissTextStyle}
                label={lookup("page.welcomeBanner.dismissButtonLabel")}
              />
            </div>
          </div>
        </div>
      )}
    </Translations>
  ) : (
    <></>
  );
};
export const WelcomeBanner = () => {
  const [welcomeBannerRDI, setWelcomeBannerStorage] = useStorage<StorageData>(
    "welcome-banner"
  );
  const onDismiss = useCallback(
    () => setWelcomeBannerStorage({ isDismissed: true }),
    [setWelcomeBannerStorage]
  );
  return (
    <Portal id={PortalIds.WelcomeBanner}>
      {RD.fromRDI(
        {
          loading: () => <></>,
          failure: () => <View onDismiss={onDismiss} />,
          success: ({ isDismissed }) =>
            isDismissed ? <></> : <View onDismiss={onDismiss} />,
        },
        welcomeBannerRDI
      )}
    </Portal>
  );
};
