import { memo } from "react";
import * as M from "@discovery/prelude/lib/data/maybe";
import { ThunderImage } from "../../../../atoms/sonic-image";

import { Content } from "../../types";
import { FallbackImage } from "../../../fallback-image";
import { GenericImageFallback } from "../../../generic-image-fallback";

type CardImageProps = {
  imageM: Content["imageM"];
  imageMaxWidth?: number;
  className?: string;
  fallback?: JSX.Element;
  handleError?: React.ImgHTMLAttributes<Element>["onError"];
  altTextForImage?: string;
};

export const CardImage = memo(
  ({
    className,
    fallback = <FallbackImage />,
    handleError = () => {},
    imageMaxWidth = 400,
    imageM = M.empty(),
    altTextForImage,
  }: CardImageProps) =>
    M.maybe(
      fallback,
      (image) => (
        <ThunderImage
          className={className}
          description={M.empty()}
          onError={handleError}
          src={image.src}
          title={M.empty()}
          width={imageMaxWidth}
          alt={altTextForImage}
        />
      ),
      imageM
    ),
  (prevProps, nextProps) => M.equals(prevProps.imageM, nextProps.imageM)
);

type CardImageFallbackProps = Omit<CardImageProps, "imageM"> & {
  images?: Array<Content["imageM"]>;
};

export const CardImageFallback = ({
  className,
  images = [],
  altTextForImage,
}: CardImageFallbackProps) => {
  /**
   * @TODO -- streamline image fallback
   *  - there are three references to `fallback` below
   *  - would be nice to combine them into one fallback with cleaner logic
   */

  const isEmpty = (item: Content["imageM"]) => M.is.Nothing(item);

  return (
    <GenericImageFallback
      images={images}
      isEmpty={isEmpty}
      render={({ currentImageProps, handleError }) => (
        <CardImage
          className={className}
          handleError={handleError}
          imageM={currentImageProps}
          altTextForImage={altTextForImage}
        />
      )}
    />
  );
};
