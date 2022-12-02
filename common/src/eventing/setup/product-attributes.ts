import * as EventsLib from "@discovery/clients-js-events-lib";
import { LAST_COMMIT, VERSION } from "../../env";

const getProductAttributes = async ({
  product,
  name,
}: {
  product: EventsLib.Products;
  name: EventsLib.ProductNames;
}): Promise<EventsLib.ProductAttributes> => ({
  product: product,
  name: name,
  version: VERSION ?? "dev",
  buildNumber: LAST_COMMIT ?? "unknown-product.buildNumber",
});

export { getProductAttributes };
