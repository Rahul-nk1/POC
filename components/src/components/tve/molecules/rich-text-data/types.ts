export type AST = {
  blocks: Block[];
  entityMap: EntityMap;
};

export type Block = {
  data: { [s: string]: unknown };
  depth: number;
  entityRanges: EntityRange[];
  inlineStyleRanges: InlineStyleRange[];
  key: string;
  text: string;
  type: string;
};

export type EntityRange = {
  key: number;
  length: number;
  offset: number;
};

export type InlineStyleRange = {
  length: number;
  offset: number;
  style: string;
};

export type EntityMap = {
  [n: number]: Entity;
};

export type Entity = LinkEntity;

export type LinkEntity = {
  data: {
    href: string;
    target: string;
    url: string;
  };
  mutability: string;
  type: "LINK";
};

export type BlockProps = {
  block: Block;
  entityMap: EntityMap;
};

export type EntityProps = {
  children: React.ReactNode;
  entity: Entity;
  key: string;
};

export type ResultPair = [React.ReactNode, Block[]];

export type TextDescription = {
  keys: number[];
  styles: string[];
  text: string;
};

export type TextDescriptionReducer = {
  nodes: TextDescription[];
  prev: null | TextDescription;
};
