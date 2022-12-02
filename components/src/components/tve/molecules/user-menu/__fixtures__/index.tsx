import * as M from "@discovery/prelude/lib/data/maybe";
import { UserMenu } from "../";
import * as styles from "../../../organisms/menu-bar/styles.css";

const authURL =
  "https://prod-central-digital-auth-service.mercury.dnitv.com/logout?returnUrl=https://test-tve-tlc.concert.mercury.dnitv.com&hostUrl=us1-test-direct.mercury.dnitv.com";

const loggedInUser = {
  nameM: M.of("discovery_user@discovery.com"),
  loggedIn: true,
  idM: M.of("USERID:go:c39ff969-b30f-4332-90c9-15de8c96e20b"),
};
const nonLoggedInUser = {
  nameM: M.empty(),
  loggedIn: false,
  idM: M.empty(),
};

const partnerM = M.of({
  transparentLogoUrl: M.of(
    "https://partner-logos-prod.disco-api.com/DirecTV_logo_white.png"
  ),
  displayPriority: M.empty(),
  helpUrl: M.empty(),
  homeUrl: M.empty(),
  logoUrl: M.of(
    "https://partner-logos-prod.disco-api.com/DirecTV_logo_color.png"
  ),
  name: "DIRECTV",
});

export default {
  "Logged-in User": (
    <div className={styles.flexed}>
      <div className={styles.rightLinks}>
        <UserMenu authURL={authURL} user={loggedInUser} partnerM={partnerM} />
      </div>
    </div>
  ),
  "Non logged-in User": (
    <div className={styles.flexed}>
      <div className={styles.rightLinks}>
        <UserMenu
          authURL={authURL}
          user={nonLoggedInUser}
          partnerM={partnerM}
        />
      </div>
    </div>
  ),
};
