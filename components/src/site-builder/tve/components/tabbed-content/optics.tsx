import { Fold, Lens } from "@discovery/prelude/lib/control/lens";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as L from "@discovery/prelude/lib/data/list";
import * as Optics from "@discovery/sonic-api-ng-optics";
import * as R from "@discovery/roadie";
import * as Collections from "@discovery/sonic-api-ng/lib/api/cms/collections";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import {
  CollectionData,
  CollectionResponseData,
} from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";

import {
  record,
  optional,
  string,
} from "@discovery/prelude/lib/data/validated";

import { NetworkSelectorTabType } from "../../../../components/tve/molecules/network-selector";
import { DateTabType } from "../../../../components/tve/molecules/date-picker";
import { NavOption } from "../../../../components/tve/molecules/season-picker";
type Component = R.Unpacked<CollectionData["attributes"]["component"]>;
type Filter = R.Unpacked<R.Unpacked<Component["filters"]>>;

const filter2NavOptionL = (filter: Filter): L.List<NavOption> => {
  switch (filter.id) {
    case "letter":
      return L.from(
        filter.options.map((option) => ({
          id: option.id,
          value: M.of(option.value),
          parameter: option.parameter,
          l10nkey: M.empty(),
        }))
      );
    case "seasonNumber":
      return L.from(
        filter.options.map((option) => ({
          id: option.id,
          value: option.value,
          parameter: option.parameter,
          l10nkey: option.l10nkey,
        }))
      );
    case "day":
      return L.from(
        filter.options.map((option) => ({
          id: option.id,
          value: M.of(option.value),
          parameter: option.parameter,
          l10nkey: option.l10nkey,
        }))
      );
  }
};

export const _Col2FilterOptions2NavOptionL: Fold.Fold<
  Collections.Resource.CollectionResponseData,
  L.List<NavOption>
> = Fold.compose(
  Optics._ColAttributes2Component,
  Fold.map(
    filter2NavOptionL,
    Fold.compose(M._Just(), Lens.prop("filters"), M._Just(), Fold._each())
  )
);

const _Filter2InitiallySelectedNavOptionM: Fold.Fold<
  Iterable<Filter>,
  M.Maybe<NavOption>
> = Fold.liftM(
  (navOptionL, initiallySelectedOptionId) =>
    L.head(L.filter((x) => x.id === initiallySelectedOptionId, navOptionL)),
  Fold.map(filter2NavOptionL, Fold._each()),
  Fold.compose(
    Fold._each(),
    Lens.prop("initiallySelectedOptionIds"),
    Fold._each()
  )
);

export const _Col2FilterInitiallySelectedNavOption: Fold.Fold<
  Collections.Resource.CollectionResponseData,
  NavOption
> = Fold.compose(
  Optics._ColAttributes2Component,
  Fold.compose(
    M._Just(),
    Lens.prop("filters"),
    M._Just(),
    _Filter2InitiallySelectedNavOptionM,
    M._Just()
  )
);

// Schedule
const filter2SubtabL = (filter: Filter): L.List<M.Maybe<DateTabType>> => {
  if (filter.id !== "day") return L.empty();

  const subtabsM = filter.options.map((option) => {
    const dateObject = new Date(option.value);
    // Because initialising a Date with a string of the form "2020-06-05" gives us back a
    // date that is at midnight for that date in GMT, users in a timezone with a negative
    // offset will get a Date that is in the day before in their timezone. Therefore we
    // normalise the date offset to be midnight in their timezone so we can get back the
    // correct day and date string later.
    const noramlisedDateObject = new Date(
      dateObject.getTime() + dateObject.getTimezoneOffset() * 60 * 1000
    );
    return R.isValid(dateObject)
      ? M.of({ id: option.value, value: noramlisedDateObject })
      : M.empty();
  });

  const subtabsL = L.from(subtabsM);

  return subtabsL;
};

export const _Col2Subtab = Fold.compose(
  Optics._ColAttributes2Component,
  M._Just(),
  Lens.prop("filters"),
  M._Just(),
  Fold._each(),
  Fold.mapF(filter2SubtabL),
  Fold._each(),
  M._Just()
);

const _Filter2InitiallySelectedSubtabIdM: Fold.Fold<
  Iterable<Filter>,
  string
> = Fold.compose(
  Fold.liftM(
    (filter, initiallySelectedOptionId) =>
      filter.id !== "day"
        ? M.empty()
        : M.of(
            filter.options.find(({ id }) => id === initiallySelectedOptionId)
          ),
    Fold._each(),
    Fold.compose(
      Fold._each(),
      Lens.prop("initiallySelectedOptionIds"),
      Fold._each()
    )
  ),
  M._Just(),
  // We get the value prop from the filter because it's used as an id in SubtabType
  Lens.prop("value")
);

export const _Col2TabbedContentType = Fold.compose(
  Optics._ColAttributes2Component,
  M._Just(),
  Lens.prop("filters"),
  M._Just(),
  Fold._head(),
  Lens.prop("id")
);

export const _Col2FilterInitiallySelectedSubtabId: Fold.Fold<
  Collections.Resource.CollectionResponseData,
  string
> = Fold.compose(
  Optics._ColAttributes2Component,
  Fold.compose(
    M._Just(),
    Lens.prop("filters"),
    M._Just(),
    _Filter2InitiallySelectedSubtabIdM
  )
);

const oneToOneRelationships = {
  cmpContextNetworkSelector: Collections.Resource.target,
};

const _GrayscaleLogoAttrM = Fold.pre(
  Fold.compose(
    Optics._Channel2Images,
    Optics._ImageOfKind("logo_grayscale"),
    Optics._Image2Attributes
  )
);

export const _NetworkSelectorChannels: Fold.Fold<
  CollectionResponseData,
  NetworkSelectorTabType
> = Fold.compose(
  Optics._CollectionGetter,
  Fold.mapF(Res.addNewRelationships(oneToOneRelationships)),
  Res._Rel("cmpContextNetworkSelector"),
  Optics._Col2Channel,
  Fold.liftM(
    (id, attr, imageAttrM) => ({
      imageM: imageAttrM,
      titleM: M.of(attr.name),
      playbackAllowedM: attr.playbackAllowed,
      id,
    }),
    Fold.compose(Res._Response(), Lens.prop("id")),
    Optics._Channel2Attributes,
    _GrayscaleLogoAttrM
  )
);

const validator = record({ defaultTabIndex: optional(string) });

export const _Selected = Fold.compose(
  Optics._CollectionGetter,
  Optics._GetCustomAttributesForComponent(validator),
  Lens.prop("defaultTabIndex"),
  M._Just()
);
