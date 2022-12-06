import * as L from "@discovery/prelude/lib/data/list"
import * as M from "@discovery/prelude/lib/data/maybe"
import { EventDataProvider } from "@discovery/common-tve/lib/eventing"
import { ImageData } from "@discovery/sonic-api-ng/lib/api/cms/images/resource"
import { useHistory } from "@discovery/common-tve/lib/hooks"
import { cn } from "@discovery/classnames"
import { P, Weights } from "../../atoms/text"
import { Link, LinkProps } from "../../atoms/link"
import * as O from "fp-ts/Option"
import * as styles from "./styles.css"
import { LinkIcon } from "./linkIcons"

type ItemProps = LinkProps & {
  title?: string
}
type IconsItemProps = LinkProps & {
  iconMobileM: M.Maybe<ImageData["attributes"]>
  iconDesktopM: M.Maybe<ImageData["attributes"]>
  title?: string
}

export type props = {
  linksL: L.List<ItemProps>
  iconLinksL: L.List<IconsItemProps>
  title: O.Option<string>
}
export const Footer = ({ linksL, iconLinksL, title }: props) => {
  const [changes, history] = useHistory()
  return (
    <footer className={styles.background}>
      <div className={styles.footerSection1}>
        {L.mapWithIndex(
          (i, link) => (
            <EventDataProvider
              key={`${link.kind}:${link.href}`}
              metaTag="header (organisms/menu-bar)"
              content={{
                titleM: M.of(link.title),
                linkM: M.of(link.href)
              }}
              contentIndex={i + 1}
              element={`${link.title} icon`}>
              <Link
                kind={link.kind}
                href={link.href}
                className={cn(styles.link, {
                  [styles.selected]: changes.location.pathname === link.href
                })}
                label={link.title}>
                <P className={cn(styles.indicator, styles.p1)} weight={Weights.semiBold}>
                  {link.title}
                </P>
              </Link>
            </EventDataProvider>
          ),
          linksL
        )}
      </div>
      <div className={styles.footerSection2}>
        <P className={cn(styles.iconLink, styles.p2)} weight={Weights.semiBold}>
          Follow Us
        </P>
        <div className={styles.iconAligner}>
          {L.mapWithIndex(
            (i, link) => (
              <EventDataProvider
                key={`${link.kind}:${link.href}`}
                metaTag="header (organisms/menu-bar)"
                content={{
                  titleM: M.of(link.title),
                  linkM: M.of(link.href)
                }}
                contentIndex={i + 1}
                element={`${link.title} icon`}>
                <Link
                  kind={link.kind}
                  href={link.href}
                  className={cn(styles.iconLink, {
                    [styles.selected]: changes.location.pathname === link.href
                  })}
                  label={link.title}>
                  <LinkIcon iconM={link.iconMobileM} className={styles.hideAboveMedium} />
                  <LinkIcon iconM={link.iconDesktopM} className={styles.hideBelowMedium} />
                </Link>
              </EventDataProvider>
            ),
            iconLinksL
          )}
        </div>
      </div>
      <div className={styles.footerSection3}>
        <div className={styles.copyRight}>{O.getOrElse(() => "")(title)}</div>
      </div>
    </footer>
  )
}
