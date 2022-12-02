var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LAST_COMMIT, VERSION } from "../../env";
const getProductAttributes = ({ product, name, }) => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        product: product,
        name: name,
        version: VERSION !== null && VERSION !== void 0 ? VERSION : "dev",
        buildNumber: LAST_COMMIT !== null && LAST_COMMIT !== void 0 ? LAST_COMMIT : "unknown-product.buildNumber",
    });
});
export { getProductAttributes };
//# sourceMappingURL=product-attributes.js.map