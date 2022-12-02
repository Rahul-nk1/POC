import * as M from "@discovery/prelude/lib/data/maybe";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { SonicImage } from "../../atoms/sonic-image";
import Text from "../../atoms/text";
import { Attributes as Image } from "@discovery/sonic-api-ng/lib/api/cms/images";
import { RenderBlocks } from "../rich-text-data";
import { AST } from "../rich-text-data/types";
import * as styles from "./styles.css";

export type Props = {
  bodyM?: M.Maybe<AST>;
  backgroundImageM?: M.Maybe<Image.Attributes>;
};

export const ErrorWall = ({
  bodyM = M.empty(),
  backgroundImageM = M.empty(),
}: Props) => (
  <div className={styles.base}>
    <RenderMaybe>
      {M.map(
        (image) => (
          <SonicImage
            className={styles.backgroundImage}
            image={image}
            format="JPG"
            imageSizes={{ default: [1920, "px"] }}
            fallbackImageSize={{ width: 1920 }}
          />
        ),
        backgroundImageM
      )}
    </RenderMaybe>
    <div className={styles.inner}>
      <RenderMaybe>
        {M.map(
          (body) => (
            <Text className={styles.message}>
              <RenderBlocks ast={body} />
            </Text>
          ),
          bodyM
        )}
      </RenderMaybe>
    </div>
  </div>
);
