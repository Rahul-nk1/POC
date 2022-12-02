import { cn } from "@discovery/classnames";

import { useClickOutside } from "../../../../utils/hooks/use-click-outside";
import { useState, useHistory } from "@discovery/common-tve/lib/hooks";

import { PartnerLogout } from "./partnerLogout";
import { SelectedPartner } from "./selectedPartner";

import { User, PartnerM } from "./types";
import * as styles from "./styles.css";

import {
  TabbableDropdown,
  TabbableItemPropsCallback,
} from "@discovery/components-tve/src/utils/hooks/use-tabbable";
import { AriaRoles } from "../../../../utils/types";

/**
 * Displays partner/provider/affiliate link {@link PartnerLogin} (when logged out) and
 * selected partner/provider/affiliate {@link SelectedPartner}  (when logged in)
 * Composes a number of sub link components which are visible on hover or click:
 * Unlink Provider {@link PartnerLogout}
 */
const UserMenu = ({
  authURL,
  user,
  partnerM,
}: {
  authURL: string;
  user: User;
  partnerM: PartnerM;
}) => {
  const [open, setOpen] = useState(false);
  const [, { redirect }] = useHistory();
  const containerRef = useClickOutside(() => setOpen(false));

  const getDropdownOptionsProps = (
    tabbableCallback: TabbableItemPropsCallback,
    redirect: (path: string) => void,
    redirectParams: string,
    role: string
  ) => ({ ...tabbableCallback(() => redirect(redirectParams)), role });
  return (
    <TabbableDropdown open={open} setOpen={setOpen} role={AriaRoles.listbox}>
      {({
        containerEl,
        tabbableContainerProps: {
          className: accessibleClassName,
          ...tabbableContainerProps
        },
        tabbableItemPropsCallback,
      }) => (
        <div
          ref={(el) => {
            containerEl.current = el;
            containerRef.current = el;
          }}
          className={cn(accessibleClassName)}
          {...(user.loggedIn && tabbableContainerProps)}
        >
          <SelectedPartner
            onMouseEnter={() => setOpen(true)}
            onClick={() => setOpen(true)}
            loggedIn={user.loggedIn}
            authURL={authURL}
            partnerM={partnerM}
          />
          <div
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className={cn(styles.userMenuContainer, {
              [styles.openMenu]: open,
            })}
          >
            <div className={styles.userDropdown}>
              <ul>
                <li
                  {...getDropdownOptionsProps(
                    tabbableItemPropsCallback,
                    redirect,
                    authURL,
                    AriaRoles.option
                  )}
                >
                  <PartnerLogout
                    user={user}
                    authURL={authURL}
                    partnerM={partnerM}
                  />
                </li>
              </ul>
            </div>
            <SelectedPartner
              onMouseEnter={() => setOpen(true)}
              loggedIn={user.loggedIn}
              authURL={authURL}
              partnerM={partnerM}
            />
          </div>
        </div>
      )}
    </TabbableDropdown>
  );
};

export { UserMenu };
