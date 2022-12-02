import { Fold, Lens } from "@discovery/prelude/lib/control/lens";
import * as Optics from "@discovery/sonic-api-ng-optics";
import { LinkKind } from "../../../../../components/tve/atoms/link";

const _Show2RouteLink = Fold.compose(
  Optics._Show2Routes,
  Optics._Route2AttributesFiltered({ canonical: true }),
  Lens.prop("url"),
  Fold.mapF((x) => ({
    href: x,
    kind: LinkKind.eventListenerOnly,
  }))
);

const _ShowName = Fold.compose(Optics._Show2Attributes, Lens.prop("name"));

export const _Video2ShowLink = Fold.pre(
  Fold.compose(
    Optics._ColItem2Video,
    Optics._Video2Show,
    Fold.liftM((name, link) => ({ name, link }), _ShowName, _Show2RouteLink)
  )
);

export const _Video2ShowName = Fold.pre(
  Fold.compose(
    Optics._ColItem2Video,
    Optics._Video2Show,
    Fold.map((name) => name, _ShowName)
  )
);
