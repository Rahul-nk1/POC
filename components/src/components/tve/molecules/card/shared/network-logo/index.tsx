import { memo } from "react";
import { cn } from "@discovery/classnames";
import * as M from "@discovery/prelude/lib/data/maybe";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { ThunderImage } from "../../../../atoms/sonic-image";
import { Content, Kind } from "../../../../molecules/card/types";
import * as styles from "./styles.css";

type NetworkLogoProps = {
  content: Content;
  className?: string;
  imageClassName?: string;
};
export const NetworkLogo = memo(
  ({ content, className, imageClassName }: NetworkLogoProps) => {
    const { channelAttrM = M.empty() } = content;
    return content.kind === Kind.Video || content.kind === Kind.Show ? (
      <RenderMaybe>
        {M.map((image) => {
          const imageAttrs = {
            title: M.maybe(
              image.title,
              (attrs) => M.alt(image.title, M.of(attrs.name)),
              channelAttrM
            ),
            description: M.maybe(
              image.description,
              (attrs) => M.alt(image.description, M.of(attrs.name)),
              channelAttrM
            ),
          };

          return (
            <div className={cn(styles.networkLogoContainer, className)}>
              <ThunderImage
                // TODO: Bring SonicImage back when it is more performant.
                className={cn(styles.networkLogo, imageClassName)}
                src={image.src}
                title={imageAttrs.title}
                description={imageAttrs.description}
                width={32}
                format="PNG"
              />
            </div>
          );
        }, content.channelLogoM)}
      </RenderMaybe>
    ) : (
      <></>
    );
  }
);
