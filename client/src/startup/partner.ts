import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import * as App from "@discovery/maestro";
import * as Optics from "@discovery/sonic-api-ng-optics";
import * as Partners from "@discovery/sonic-api-ng/lib/api/users/partners";
import { Fold, Lens } from "@discovery/prelude/lib/control/lens";
import { updateGlobalState } from "@discovery/common-tve/lib/hooks";
import { _Partner as _PartnerState } from "@discovery/common-tve/lib/state";

const _Partner = Fold.compose(
  Optics._PartnersResponse2Partners,
  Res._Response(),
  Fold._each(),
  Lens.prop("attributes")
);

const updateGlobalPartner = updateGlobalState(_PartnerState);

const setPartners = (partnerRes: Partners.Resource.PartnersResponse) => {
  const partnerM = Fold.preview(_Partner, partnerRes);
  updateGlobalPartner((_oldPartnerM) => partnerM);
  return App.sequential(
    App.modify<{ partnerM: typeof partnerM }>((s) => ({
      ...s,
      partnerM,
    }))
  );
};

export const partnerReq = App.chainMerge(
  setPartners,
  Partners.Endpoints.getPartners()
);
