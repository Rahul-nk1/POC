import { SonicApiAppConfig } from "@discovery/sonic-api-ng/lib/config/app-config";
import { AuthService } from "@discovery/client-core/lib/startup/types";
import { ClientInformation } from "@discovery/sonic-api-ng/lib/config/app-config";
export declare type PlayerConfig = {
    playerConfig: {
        environment: "prod" | "test" | "uat";
    };
};
export declare type Reader = SonicApiAppConfig & AuthService & PlayerConfig & ClientInformation;
//# sourceMappingURL=reader.d.ts.map