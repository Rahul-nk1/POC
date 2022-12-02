import * as React from "react";
import { GlobalState } from "../state";
export declare const useRealmConfig: import("@discovery/orchestra/lib/realm-config").UseRealmConfig;
export declare const useSonicHttp: import("@discovery/orchestra/lib/sonic-http").UseSonicHttp;
export declare const maestroHistory: import("@discovery/maestro-history").History;
export declare const useCallback: import("@discovery/orchestra/lib/base").UseCallback, useContext: import("@discovery/orchestra/lib/base").UseContext, useEffect: import("@discovery/orchestra/lib/base").UseEffect, useMemo: import("@discovery/orchestra/lib/base").UseMemo, useRef: import("@discovery/orchestra/lib/base").UseRef, useState: import("@discovery/orchestra/lib/base").UseState;
export declare const usePaginatedCollection: import("@discovery/orchestra/lib/pagination/use-paginated-collection").UsePaginatedCollection;
export declare const usePaginated: import("@discovery/orchestra/lib/pagination/use-paginated").UsePaginated;
export declare const Paginated: <Item, View>({ children, data, lens, mkQuery, }: import("@discovery/orchestra/lib/pagination").Props<Item, View>) => View;
export declare const useLayoutEffect: typeof React.useLayoutEffect;
export declare const useEvent: import("@discovery/orchestra/lib/event").UseEvent;
export declare const useDebounceDispatch: <T extends Function>(dispatch: T, delay: number, inputs: readonly unknown[]) => T;
export declare const useDispatch: <K>() => K extends "abort" | "animationcancel" | "animationend" | "animationiteration" | "animationstart" | "auxclick" | "blur" | "cancel" | "canplay" | "canplaythrough" | "change" | "click" | "close" | "contextmenu" | "cuechange" | "dblclick" | "drag" | "dragend" | "dragenter" | "dragexit" | "dragleave" | "dragover" | "dragstart" | "drop" | "durationchange" | "emptied" | "ended" | "error" | "focus" | "focusin" | "focusout" | "gotpointercapture" | "input" | "invalid" | "keydown" | "keypress" | "keyup" | "load" | "loadeddata" | "loadedmetadata" | "loadstart" | "lostpointercapture" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "pause" | "play" | "playing" | "pointercancel" | "pointerdown" | "pointerenter" | "pointerleave" | "pointermove" | "pointerout" | "pointerover" | "pointerup" | "progress" | "ratechange" | "reset" | "resize" | "scroll" | "securitypolicyviolation" | "seeked" | "seeking" | "select" | "selectionchange" | "selectstart" | "stalled" | "submit" | "suspend" | "timeupdate" | "toggle" | "touchcancel" | "touchend" | "touchmove" | "touchstart" | "transitioncancel" | "transitionend" | "transitionrun" | "transitionstart" | "volumechange" | "waiting" | "wheel" | "storage" | "unhandledrejection" | "message" | "afterprint" | "beforeprint" | "beforeunload" | "compassneedscalibration" | "devicelight" | "devicemotion" | "deviceorientation" | "deviceorientationabsolute" | "hashchange" | "mousewheel" | "MSGestureChange" | "MSGestureDoubleTap" | "MSGestureEnd" | "MSGestureHold" | "MSGestureStart" | "MSGestureTap" | "MSInertiaStart" | "MSPointerCancel" | "MSPointerDown" | "MSPointerEnter" | "MSPointerLeave" | "MSPointerMove" | "MSPointerOut" | "MSPointerOver" | "MSPointerUp" | "offline" | "online" | "orientationchange" | "pagehide" | "pageshow" | "popstate" | "readystatechange" | "unload" | "vrdisplayactivate" | "vrdisplayblur" | "vrdisplayconnect" | "vrdisplaydeactivate" | "vrdisplaydisconnect" | "vrdisplayfocus" | "vrdisplaypointerrestricted" | "vrdisplaypointerunrestricted" | "vrdisplaypresentchange" | "languagechange" | "messageerror" | "rejectionhandled" ? (event: WindowEventMap[K]) => boolean : K extends string ? (event: Event) => boolean : "Make sure to specify `useDispatch` event type";
export declare const useHistory: () => readonly [import("@discovery/maestro-history").HistoryObject, {
    push: <A>(path: string, state?: A | undefined) => void;
    redirect: (path: string) => void;
    replace: <A_1>(path: string, state?: A_1 | undefined) => void;
    backward: () => void;
    forward: () => void;
}];
export declare const useWhenInView: import("@discovery/orchestra/lib/intersection").UseWhenInView, useInView: import("@discovery/orchestra/lib/intersection").UseInView;
export declare const updateGlobalState: import("@discovery/orchestra/lib/global-state").UpdateGlobalState<GlobalState>, useGlobalState: import("@discovery/orchestra/lib/global-state").UseGlobalState<GlobalState>, useGlobalStateModifier: import("@discovery/orchestra/lib/global-state").UseGlobalStateModifier<GlobalState>;
export declare const useStorage: <R extends import("@discovery/maestro-json").JSONValue>(key: string) => readonly [import("@discovery/prelude/lib/data/remote-data").RemoteDataInFlight<import("@discovery/maestro-storage").StorageException | import("@discovery/maestro-json").JsonParserException, R>, (v: R) => void];
//# sourceMappingURL=index.d.ts.map