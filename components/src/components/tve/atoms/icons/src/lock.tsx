import { IconProps, IconTheme } from "./types";

/**
 * TODO -- better webpack config for dynamic asset loading
 *
 *  - currently, all variants of an icon are loaded ('require'd) at compile-time,
 *    which makes the resulting bundle size bigger than it needs to be
 *
 *  - for some reason, deciding which asset to load at *run-time* doesn't work
 *    (i.e., moving the `require` call inside `LockIcon` and only loading the
 *           requested asset)
 *
 *  - this probably has to do with how webpack resolves aliases via string-replacement,
 *    which is done at compile-time and not dynamically at run-time
 *
 *  -> things to investigate for optimisation
 *      - run-time webpack alias resolution (via config or `webpack-runtime-require`)
 *      - change to a run-time `import` call, but would then make the component async
 *      - investigate better tree-shaking to remove assets
 *        that aren't used after being imported
 *      - get around all of this by refactoring to include the icons via CSS
 *          (e.g., `FavoriteButton` or `MyListButton`)
 */

import lockBlack from "~global/icons/lock-black.svg";
import lockWhite from "~global/icons/lock.svg";
const ICON_PATHS = {
  lockBlack,
  lockWhite,
};

export const LockBlackIcon = ({ className }: Pick<IconProps, "className">) => (
  <img className={className} src={ICON_PATHS.lockBlack} alt="lock icon black" />
);

export const LockWhiteIcon = ({ className }: Pick<IconProps, "className">) => (
  <img className={className} src={ICON_PATHS.lockWhite} alt="lock icon white" />
);

export const LockIcon = ({ className, theme }: IconProps) =>
  theme === IconTheme.dark
    ? LockWhiteIcon({ className })
    : LockBlackIcon({ className });
