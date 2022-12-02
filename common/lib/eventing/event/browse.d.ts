import * as Option from "fp-ts/Option";
declare const triggerBrowseEvent: (event: {
    href: Location["href"];
    pathname: Location["pathname"];
    primaryContentIdM?: Option.None | Option.Some<string> | undefined;
    contentTypeM?: Option.None | Option.Some<string> | undefined;
}) => void;
export { triggerBrowseEvent };
//# sourceMappingURL=browse.d.ts.map