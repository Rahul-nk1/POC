import { Article } from "..";
import * as M from "@discovery/prelude/lib/data/maybe";

const blocks = [
  {
    data: {},
    depth: 0,
    entityRanges: [],
    inlineStyleRanges: [
      {
        length: 19,
        offset: 0,
        style: "BOLD",
      },
    ],
    key: "bjcg0",
    text: "Sophistical article",
    type: "header-one",
  },
  {
    data: {},
    depth: 0,
    entityRanges: [],
    inlineStyleRanges: [],
    key: "79ud8",
    text: "",
    type: "header-one",
  },
  {
    data: {},
    depth: 0,
    entityRanges: [],
    inlineStyleRanges: [
      {
        length: 18,
        offset: 0,
        style: "BOLD",
      },
    ],
    key: "behrj",
    text: "WOOOO OH WOOOOO OH",
    type: "header-one",
  },
  {
    data: {},
    depth: 0,
    entityRanges: [],
    inlineStyleRanges: [],
    key: "12iss",
    text: "",
    type: "unstyled",
  },
  {
    data: {},
    depth: 0,
    entityRanges: [],
    inlineStyleRanges: [],
    key: "belvv",
    text: "",
    type: "unstyled",
  },
  {
    data: {},
    depth: 0,
    entityRanges: [],
    inlineStyleRanges: [
      {
        length: 11,
        offset: 0,
        style: "BOLD",
      },
    ],
    key: "5qc9e",
    text:
      "Lorem Ipsum är en utfyllnadstext från tryck- och förlagsindustrin. Lorem ipsum har varit standard ända sedan 1500-talet, när en okänd boksättare tog att antal bokstäver och blandade dem för att göra ett provexemplar av en bok. Lorem ipsum har inte bara överlevt fem århundraden, utan även övergången till elektronisk typografi utan större förändringar. Det blev allmänt känt på 1960-talet i samband med lanseringen av Letraset-ark med avsnitt av Lorem Ipsum, och senare med mjukvaror som Aldus PageMaker.",
    type: "unstyled",
  },
];

export default {
  "Basic Article": <Article bodyM={M.of({ blocks, entityMap: {} })} />,
};
