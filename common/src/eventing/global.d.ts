import { ConnectionTypes } from "@discovery/clients-js-events-lib";

declare global {
  interface Navigator {
    connection?: Partial<CustomNavigatorConnection> & EventTarget;
  }
}

interface CustomNavigatorConnection {
  // Chrome 84 had these:
  downlink: number;
  effectiveType: "slow-2g" | "2g" | "3g" | "4g";
  rtt: number;
  saveData: boolean;

  // Additional fields from the docs:
  downlinkMax: number;
  type: ConnectionTypes;
}
