import * as App from "@discovery/maestro";
export declare const staticRealmConfig: {
    domain: string;
    realm: string;
    environment: "test";
    authDomain: string;
    siteLookupKey: string;
};
export declare const getRealm: App.App<App.Reader<{
    realmServiceConfig: {
        realmServiceUrl: string;
    };
} & {
    hostname: string;
}> & import("@discovery/maestro-http").HTTP & import("@discovery/maestro-json").JsonParser, {}, import("@discovery/maestro-json").JsonParserException | import("@discovery/maestro-http").HttpException, import("@discovery/sonic-api-ng/lib/config/realm-config").RealmServiceConfig>;
//# sourceMappingURL=realm.d.ts.map