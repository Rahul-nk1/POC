import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import { cn } from "@discovery/classnames";
import { Child } from "@discovery/template-engine/lib/component-map";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { PageTemplate } from "@discovery/common-tve/lib/constants";
import {
  Metadata,
  MetadataProps,
} from "@discovery/common-tve/lib/components/metadata";
import { gtmInit } from "@discovery/common-tve/lib/components/metadata/gtm-init";
import { useEffect, useMemo } from "@discovery/common-tve/lib/hooks";
import { usePageMeta } from "@discovery/components-tve/src/utils/hooks/use-page-meta";
import { triggerBrowseEvent } from "@discovery/common-tve/lib/eventing";

import * as styles from "./styles.css";

import Option = O.Option;

export type Props = {
  pageAttributesM: Option<MetadataProps>;
  contentTypeM?: Option<string>;
};

export const View = ({
  pageAttributesM,
  contentTypeM,
  children,
}: Props & Child) => {
  const metaM = useMemo(
    () =>
      pipe(
        pageAttributesM,
        O.map((pageAttributes) => <Metadata data={pageAttributes} />)
      ),
    [pageAttributesM]
  );

  useEffect(() => {
    gtmInit();
    triggerBrowseEvent({
      pathname: window.location.pathname,
      href: window.location.href,
      contentTypeM: contentTypeM,
    });
  }, [contentTypeM]);

  const { isPlayerPage, templateId } = usePageMeta();

  const classes = cn(styles.container, {
    [styles.darkBackground]: templateId === PageTemplate.Secondary,
    [styles.topPadding]: isPlayerPage,
  });

  return (
    <div className={classes}>
      <RenderMaybe>{metaM}</RenderMaybe>
      {children}
    </div>
  );
};
