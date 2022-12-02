import type { FC } from "react";
import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import {
  useHistory,
  useCallback,
  useMemo,
} from "@discovery/common-tve/lib/hooks";
import {
  triggerInteractionEvent,
  InteractionEvent,
  useEventDataContext,
} from "@discovery/common-tve/lib/eventing";

import { Tabbable } from "@discovery/components-tve/src/utils/hooks/use-tabbable";
import type { Ref } from "../../../../utils/types";
import { Tags } from "../../../../utils/types";

export enum LinkKind {
  iframe,
  internal,
  external,
  eventListenerOnly,
}

export type LinkProps = {
  tag?: Tags;
  className?: string;
  href: string;
  kind: LinkKind;
  onClick?: (e: React.MouseEvent) => void;
  openInNewWindow?: boolean;
  role?: string;
  _ref?: Ref<Tags>;
  /** For accessibility, aria-label */
  label?: string;
  tabIndex?: number;
};

const launchable = ["mailto", "tel"];

const isLaunchable = (link: string) =>
  launchable.some((v) => link.startsWith(`${v}:`));

export const Link: FC<LinkProps> = ({
  tag: Comp = Tags.a,
  className,
  children,
  href,
  kind,
  onClick,
  openInNewWindow,
  role = "link",
  label,
  tabIndex = 0,
  _ref,
}) => {
  const shouldOpenInNewWindow = openInNewWindow ?? kind === LinkKind.external;
  const rel = kind === LinkKind.external ? "noopener" : undefined;

  const [
    {
      location: { href: currentUrl },
    },
    { push, redirect },
  ] = useHistory();
  const isSelf = useMemo(
    () => isLaunchable(href) || kind === LinkKind.internal,
    [kind, href]
  );
  const target = useMemo(() => (shouldOpenInNewWindow ? "_blank" : undefined), [
    shouldOpenInNewWindow,
  ]);

  /* Eventing */
  const { eventData } = useEventDataContext();
  const triggerClickEvent = useCallback(() => {
    triggerInteractionEvent({
      ...eventData,
      interactionType: InteractionEvent.CLICK,
    });
  }, [eventData]);

  /* Navigation */
  const navigate = useCallback(() => {
    if (kind !== LinkKind.eventListenerOnly) {
      if (shouldOpenInNewWindow) {
        open(href, target);
      } else if (isSelf) {
        push(href, { prevUrl: currentUrl });
      } else {
        redirect(href);
      }
    }
  }, [
    isSelf,
    push,
    kind,
    redirect,
    href,
    currentUrl,
    shouldOpenInNewWindow,
    target,
  ]);

  /* Click handler */
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      triggerClickEvent();
      onClick?.(event);
      if (
        !event.ctrlKey && // on Windows & Unix: open in new tab, on Mac: opens the context menu, we don't even get the click
        !event.metaKey && // on Mac (⌘): open in new tab, on Windows (⊞): ??, on Unix: nothing?
        event.button === 0
      ) {
        event.preventDefault();
        navigate();
      }
    },
    [onClick, triggerClickEvent, navigate]
  );

  return (
    <Tabbable tabIndex={tabIndex}>
      {({ className: accessibleClassName, ...tabbableProps }) => (
        <Comp
          className={cn(className, accessibleClassName)}
          href={href}
          onClick={handleClick}
          role={role}
          target={target}
          aria-label={label}
          rel={rel}
          ref={_ref}
          {...tabbableProps}
        >
          {children}
        </Comp>
      )}
    </Tabbable>
  );
};

export type MaybeLinkProps = Omit<LinkProps, "href"> & {
  hrefM: M.Maybe<string>;
};

export const MaybeLink: FC<MaybeLinkProps> = (props) =>
  M.maybe(
    <div className={props.className}>{props.children}</div>,
    (href) => <Link {...props} href={href} />,
    props.hrefM
  );
