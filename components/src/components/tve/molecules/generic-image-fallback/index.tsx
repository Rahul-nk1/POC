import { useState } from "@discovery/common-tve/lib/hooks";
import { FallbackImage } from "../fallback-image";

type ImageEvent = React.SyntheticEvent<Element, Event> | undefined;

/**
 * @NOTE -- `T` refers to the props for the fallback component / image itself
 */

type RenderProps<T> = {
  fallback: JSX.Element;
  handleError: (e: ImageEvent) => void;
  currentImageProps: T;
};

type GenericImageFallbackProps<T> = {
  fallback?: JSX.Element;
  images: Array<T>;
  isEmpty: (obj: T) => boolean;
  render: (args: RenderProps<T>) => JSX.Element;
};

export const GenericImageFallback = <T,>({
  fallback = <FallbackImage />,
  images = [],
  isEmpty,
  render,
}: GenericImageFallbackProps<T>) => {
  const [index, setIndex] = useState(0);

  /**
   * @NOTE -- `isEmpty` needs to be a prop to allow this generic component
   *         to operate on `Maybe` and non-Maybe types
   *
   * @TODO -- streamline image fallback
   *  - since we can't pass a function reference as the fallback to M.maybe(),
   *  - if we still have images in the array, increment index and return null
   *  - if we're out of images, return fallback image
   */

  const image = images[index];

  if (
    !images.length ||
    index >= images.length ||
    image === null ||
    image === undefined ||
    isEmpty(image)
  ) {
    if (index < images.length - 1) {
      setIndex(index + 1);
      return null;
    }

    return fallback;
  }

  const handleError = (_: ImageEvent) => {
    setIndex(index + 1);
  };

  return render({
    fallback,
    handleError,
    currentImageProps: image,
  });
};
