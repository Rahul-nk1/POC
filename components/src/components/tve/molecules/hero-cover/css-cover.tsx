import { cn } from "@discovery/classnames";
import { useEffect } from "@discovery/common-tve/lib/hooks";
import { ImageData } from "@discovery/sonic-api-ng/lib/api/cms/images/resource";

import { HeroTemplate } from "../../../../site-builder/tve/components/hero";
import { SonicImage } from "../../atoms/sonic-image";
import { FallbackImage } from "../../molecules/fallback-image";
import type { Ref } from "../../../../utils/types";
import { Tags } from "../../../../utils/types";
import { GenericImageFallback } from "../generic-image-fallback";

import * as styles from "./styles.css";

type Props = {
  className?: string;
  image: ImageData["attributes"];
  onLoad?: (e?: React.SyntheticEvent<Element, Event>) => void;
  templateId: HeroTemplate;
  altTextForImage?: string;
  _ref?: Ref<Tags>;
};

const isEmpty = (item: ImageData["attributes"]) =>
  Object.keys(item).length === 0;

export const CSSCover = ({
  className,
  image,
  onLoad = () => {},
  templateId,
  _ref,
  altTextForImage,
}: Props) => {
  const isCarousel = templateId === HeroTemplate.Carousel;

  const Fallback = () => {
    useEffect(() => onLoad(), []);

    return <FallbackImage _ref={_ref} />;
  };

  return (
    <div
      className={cn(styles.cssCover, className, {
        [styles.linearGradient]: isCarousel,
        [styles.radialGradient]: !isCarousel,
      })}
    >
      <GenericImageFallback
        fallback={<Fallback />}
        images={[image]}
        isEmpty={isEmpty}
        render={({ currentImageProps, handleError }) => {
          const currImgProps = {
            ...currentImageProps,
            description: image.title,
            title: image.description,
          };
          return (
            <div ref={_ref}>
              <SonicImage
                className={styles.cssCoverImage}
                image={currImgProps}
                onError={handleError}
                onLoad={onLoad}
                format="JPG"
                imageSizes={{ default: [100, "vw"] }}
                fallbackImageSize={{ width: 1920 }}
                alt={altTextForImage}
              />
            </div>
          );
        }}
      />
    </div>
  );
};
