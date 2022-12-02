import * as M from "@discovery/prelude/lib/data/maybe";
import * as L from "@discovery/prelude/lib/data/list";

import { SeasonPicker, NavOption } from "../";

const options = [
  {
    id: "1",
    value: M.of("1"),
    parameter: "foo",
    l10nkey: M.empty(),
  } as NavOption,
  {
    id: "2",
    value: M.of("2"),
    parameter: "foo",
    l10nkey: M.empty(),
  } as NavOption,
  {
    id: "3",
    value: M.of("3"),
    parameter: "foo",
    l10nkey: M.empty(),
  } as NavOption,
];

const vars = {
  headingText: "Full Episodes",
  optionPrefix: "Season ",
  selected: "2",
  optionL: L.list(...options),
  favorite: M.of(true),
  id: M.of("725"),
  title: M.of("90 Day Fiancé: Pillow Talk"),
};

const selectOption = (id: NavOption["id"]) => alert(`You've selected ${id}`);

export default {
  "Default Season Picker": (
    <SeasonPicker
      optionL={vars.optionL}
      initialOptionM={M.empty()}
      selectOption={selectOption}
      isFavoriteM={vars.favorite}
      idM={vars.id}
      titleM={vars.title}
    />
  ),
  "With Heading": (
    <SeasonPicker
      optionL={vars.optionL}
      initialOptionM={M.empty()}
      selectOption={selectOption}
      headingText={vars.headingText}
      isFavoriteM={vars.favorite}
      idM={vars.id}
      titleM={vars.title}
    />
  ),
  "With Default Option": (
    <SeasonPicker
      optionL={vars.optionL}
      initialOptionM={M.of(vars.selected)}
      selectOption={selectOption}
      isFavoriteM={vars.favorite}
      idM={vars.id}
      titleM={vars.title}
    />
  ),
  "With Option Prefix": (
    <SeasonPicker
      optionL={vars.optionL}
      optionPrefix={vars.optionPrefix}
      initialOptionM={M.empty()}
      selectOption={selectOption}
      isFavoriteM={vars.favorite}
      idM={vars.id}
      titleM={vars.title}
    />
  ),
  Everything: (
    <SeasonPicker
      optionL={vars.optionL}
      optionPrefix={vars.optionPrefix}
      initialOptionM={M.of(vars.selected)}
      selectOption={selectOption}
      headingText={vars.headingText}
      isFavoriteM={vars.favorite}
      idM={vars.id}
      titleM={vars.title}
    />
  ),
};
