import * as M from "@discovery/prelude/lib/data/maybe"
import * as L from "@discovery/prelude/lib/data/list"
import { Tags } from "../../../../utils/types"
import { Content } from "../../molecules/card"
import { GridPagination } from "./paginated"
import * as styles from "./styles.css"
import * as O from "fp-ts/Option"

export { createContentGridPaginated } from "./paginated"

export type CommonGridProps = {
  aliasM?: M.Maybe<string>
  isEmptyMessageM?: M.Maybe<string>
  headerTag?: Tags
  isEmpty?: boolean
  children?: JSX.ElementChildrenAttribute["children"]
  showChannelLogo?: boolean
  cardHeaderTag?: Tags
  onClick?: (e: React.MouseEvent<Element, MouseEvent>, content: Content) => void
  contentL: L.List<Content>
  onFavoriteChange?: (id: string, favorited: boolean) => void
  pagination?: GridPagination
  paginationM: M.Maybe<JSX.Element>
}

type ContentGridProps = {
  titleM: M.Maybe<string>
  headerTag?: Tags
  isEmpty: boolean
  children: JSX.ElementChildrenAttribute["children"]
  aliasM?: M.Maybe<string>
  isEmptyMessageM?: M.Maybe<string>
}

export const ContentGrid = ({ children, titleM, isEmpty }: ContentGridProps) => (
  <>
    {!isEmpty && O.getOrElse(() => "")(titleM) !== "Empty Playlist Rail" ? (
      <>
        <div className={styles.sectionTitle}>{O.getOrElse(() => "")(titleM)}</div>
        <div className={styles.contentGrid}>{children}</div>
      </>
    ) : (
      <></>
    )}
  </>
)
