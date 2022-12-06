import {
  P,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  TextView,
  Span,
  Weights,
  Decorations,
  Styles
} from "../../atoms/text"
import React from "react"
import { Link, LinkKind } from "../../atoms/link"
import styles from "./styles.css"
import {
  AST,
  Block,
  EntityMap,
  EntityProps,
  ResultPair,
  TextDescription,
  TextDescriptionReducer
} from "./types"
import * as A from "fp-ts/lib/Array"

const isType = (type: string) => (x: { type: string }) => x.type === type

// eslint-disable-next-line @typescript-eslint/ban-types
const takeWhile = <A extends {}>(p: (x: A) => boolean) => (xs: A[]) => {
  const separated = A.spanLeft(p)(xs)

  return [separated.init, separated.rest] as const
}

const filterInRange = <A extends { length: number; offset: number }>(xs: A[], offset: number) =>
  xs.filter((x) => offset >= x.offset && offset < x.offset + x.length)

const getTextDescriptions = (block: Block): TextDescription[] => {
  const { nodes, prev } = block.text.split("").reduce(
    ({ nodes, prev }: TextDescriptionReducer, c, i) => {
      const styles = filterInRange(block.inlineStyleRanges, i).map((x) => x.style)

      const keys = filterInRange(block.entityRanges, i).map((x) => x.key)

      const same =
        prev !== null &&
        styles.length === prev.styles.length &&
        styles.every((s) => prev.styles.includes(s)) &&
        keys.length === prev.keys.length &&
        keys.every((n) => prev.keys.includes(n))

      return {
        nodes: prev === null ? nodes : same ? nodes : nodes.concat([prev]),
        prev: {
          keys,
          styles,
          text: prev === null ? c : same ? prev.text + c : c
        }
      }
    },
    {
      nodes: [],
      prev: null
    }
  )

  return prev === null ? nodes : nodes.concat([prev]).filter((x) => x !== null)
}

const LinkEntityBlock = (props: EntityProps) => (
  <Link
    kind={LinkKind.external}
    href={props.entity.data.href}
    label={typeof props.children === "string" ? props.children : ""}>
    {props.children}
  </Link>
)
const entityTypeMap = {
  LINK: LinkEntityBlock
}

const getTextNodes = (entityMap: EntityMap, block: Block) =>
  getTextDescriptions(block).map((x, i) =>
    x.keys.reduce(
      (comp, n) => {
        const entity = entityMap[n]
        const type = entity?.type

        return type && entity
          ? entityTypeMap[type]({
              children: comp,
              entity,
              key: block.key + i
            })
          : comp
      },
      <Span
        key={i}
        weight={x.styles.includes("BOLD") ? Weights.bold : Weights.normal}
        style={x.styles.includes("ITALIC") ? Styles.italic : Styles.normal}
        decoration={x.styles.includes("UNDERLINE") ? Decorations.underline : Decorations.none}>
        {x.text}
      </Span>
    )
  )

const takeUnstyled = takeWhile<Block>(isType("unstyled"))

const Text = (entityMap: EntityMap, blocks: Block[]): ResultPair => {
  const [xs, ys] = takeUnstyled(blocks)
  return [
    <div>
      {xs?.map((x) => (
        <P key={x.key}>{getTextNodes(entityMap, x)}</P>
      ))}
    </div>,
    ys
  ]
}

const takeHeader = (k: string) => takeWhile<Block>(isType(`header-${k}`))

const Header = (H: TextView, k: string) => (entityMap: EntityMap, blocks: Block[]): ResultPair => {
  const [xs, ys] = takeHeader(k)(blocks)

  return [
    <div>
      {xs?.map((x) => (
        <H>{getTextNodes(entityMap, x)}</H>
      ))}
    </div>,
    ys
  ]
}

const ListItem = (entityMap: EntityMap) => (block: Block) => (
  <li key={block.key}>
    <P className={styles.listItem}>{getTextNodes(entityMap, block)}</P>
  </li>
)

const takeOrderedListItem = takeWhile<Block>(isType("ordered-list-item"))

const OrderedListItem = (entityMap: EntityMap, blocks: Block[]): ResultPair => {
  const [xs, ys] = takeOrderedListItem(blocks)

  return [<ol>{xs?.map(ListItem(entityMap))}</ol>, ys]
}

const takeUnorderedListItem = takeWhile<Block>(isType("unordered-list-item"))

const UnorderedListItem = (entityMap: EntityMap, blocks: Block[]): ResultPair => {
  const [xs, ys] = takeUnorderedListItem(blocks)

  return [<ul>{xs?.map(ListItem(entityMap))}</ul>, ys]
}

const takeBlockQuote = takeWhile<Block>(isType("blockquote"))

const BlockQuote = (entityMap: EntityMap, blocks: Block[]): ResultPair => {
  const [xs, ys] = takeBlockQuote(blocks)
  return [<blockquote>{xs?.map((block) => getTextNodes(entityMap, block))}</blockquote>, ys]
}

const NotSupported = (type: string) => (blocks: Block[]): ResultPair => {
  const [, v] = takeWhile<Block>(isType(type))(blocks)
  return [<></>, v]
}

export const blockTypeMap = (blocks: Block[], entityMap: EntityMap): ResultPair => {
  const [block] = blocks
  const type = block?.type
  switch (type) {
    case "unstyled":
      return Text(entityMap, blocks)
    case "header-one":
      return Header(H1, "one")(entityMap, blocks)
    case "header-two":
      return Header(H2, "two")(entityMap, blocks)
    case "header-three":
      return Header(H3, "three")(entityMap, blocks)
    case "header-four":
      return Header(H4, "four")(entityMap, blocks)
    case "header-five":
      return Header(H5, "five")(entityMap, blocks)
    case "header-six":
      return Header(H6, "six")(entityMap, blocks)
    case "ordered-list-item":
      return OrderedListItem(entityMap, blocks)
    case "unordered-list-item":
      return UnorderedListItem(entityMap, blocks)
    case "blockquote":
      return BlockQuote(entityMap, blocks)
    default:
      return NotSupported(String(type))(blocks)
  }
}

const renderAST = (ast: AST) => {
  let blocks = ast.blocks
  const vdom = []
  let i = 0
  while (blocks.length > 0) {
    const [vdom_, blocks_] = blockTypeMap(blocks, ast.entityMap)
    vdom.push(<React.Fragment key={i}>{vdom_}</React.Fragment>)
    blocks = blocks_
    i++
  }

  return vdom
}

export const RenderBlocks = ({ ast }: { ast: AST }) => <div>{renderAST(ast)}</div>
