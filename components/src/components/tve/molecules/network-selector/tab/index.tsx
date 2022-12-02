import { cn } from "@discovery/classnames";
import * as M from "@discovery/prelude/lib/data/maybe";

import { useCallback } from "@discovery/common-tve/lib/hooks";
import { SonicImage } from "../../../atoms/sonic-image";

import { Tabbable } from "@discovery/components-tve/src/utils/hooks/use-tabbable/index";
import { Tags, AriaRoles } from "../../../../../utils/types";

import { TabType } from "../../network-selector";
import * as styles from "./styles.css";

type Props = {
  className?: string;
  isLoading: boolean;
  selected: boolean;
  tab: TabType;
  tag?: Tags;
  onClick: () => void;
};

const DEFAULT_IMAGE_WIDTH_PX = 140;

// Top level tab renders a logo or text
export const Tab = ({
  className,
  isLoading,
  onClick,
  selected,
  tab,
  tag = Tags.button,
}: Props) => {
  const { imageM, titleM, id } = tab;

  const _title = M.fromMaybe(titleM, "");

  // If image exist use that, fallback to title
  const LogoOrText = useCallback(() => {
    const titleBlock = (
      <span className={cn(styles.tab, styles.title)}>{_title}</span>
    );
    return M.maybe(
      titleBlock,
      (image) => (
        <SonicImage
          className={cn(styles.tab, styles.image)}
          alt={_title}
          image={image}
          format="PNG"
          imageSizes={{
            default: [DEFAULT_IMAGE_WIDTH_PX, "px"],
            maxWidthMediaQueries: [[799, "px", 80, "px"]],
          }}
          style={{
            //hack: because SonicImage has an inherent object-position of center top
            objectPosition: "",
          }}
          fallbackImageSize={{ width: DEFAULT_IMAGE_WIDTH_PX }}
        />
      ),
      imageM
    );
  }, [imageM, _title]);

  const TAG = tag;

  return (
    <Tabbable role={AriaRoles.button}>
      {({ className: accessibleClassName, ...tabbableProps }) => (
        <TAG
          key={id}
          onClick={onClick}
          className={cn(styles.logo, className, accessibleClassName, {
            [styles.selected]: selected,
            [styles.loading]: isLoading,
          })}
          {...tabbableProps}
        >
          <LogoOrText />
        </TAG>
      )}
    </Tabbable>
  );
};
