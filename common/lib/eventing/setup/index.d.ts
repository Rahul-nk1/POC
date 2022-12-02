import { EventTypes, EventData } from "@discovery/clients-js-events-lib";
import { Events } from "../types";
import { config$ } from "./setup";
import { setEventingConfig } from "./shared";
declare const event: (type: EventTypes, eventData: EventData) => void;
declare const log: (e: Events) => void;
export { log, setEventingConfig, event, config$ };
//# sourceMappingURL=index.d.ts.map