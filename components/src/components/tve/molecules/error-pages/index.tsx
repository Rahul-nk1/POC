import * as M from "@discovery/prelude/lib/data/maybe";
import { SomeError } from "@discovery/sonic-api-ng/lib/japi";
import { Translations } from "@discovery/components-luna/lib/components/translations";
import { triggerUserFacingErrorEvent } from "@discovery/common-tve/lib/eventing/event/error";
import { H3, P, Sizes } from "../../atoms/text";
import { Button, ButtonType } from "../../atoms/button";
import translations from "./translations/keys.json";
import * as styles from "./styles.css";
import { useEffect } from "@discovery/common-tve/lib/hooks";
import { Link, LinkKind } from "../../atoms/link";

type Props = {
  title: string;
  description: string;
  buttonLabel: string;
  error?: SomeError;
};

const SomeErrorPage = ({ title, description, buttonLabel, error }: Props) => {
  useEffect(() => {
    triggerUserFacingErrorEvent({
      code: M.fromMaybe(
        error?.status ?? M.of("unknown error"),
        "unknown sonicError.code"
      ),
      name: "Error page",
      message: description,
      type: error?.code ?? "Generic error",
    });
  }, [error, description]);

  return (
    <div className={styles.errorPage}>
      <H3 className={styles.header} size={Sizes.l}>
        {title}
      </H3>
      <H3 className={styles.description} size={Sizes.l}>
        {description}
      </H3>
      <Button
        linkM={M.of("/")}
        type={ButtonType.contained}
        className={styles.ctaButton}
        textClassName={styles.errorPageButtonText}
        label={buttonLabel}
      />
      <Link
        kind={LinkKind.external}
        href="https://help.discoveryplus.com/hc/en-us"
        className={styles.link}
        label="Help Center"
      >
        <P size={Sizes.s}>Help Center</P>
      </Link>
    </div>
  );
};
export const ErrorPage404 = ({ error }: { error?: SomeError }) => (
  <Translations
    importP={(lang: string) => import(`./translations/${lang}/keys.json`)}
    fallbackImport={translations}
  >
    {(lookup) => (
      <SomeErrorPage
        title={lookup("page.error.notFound.header")}
        description={lookup("page.error.notFound.description")}
        buttonLabel={lookup("page.error.notFound.buttonLabel")}
        error={error}
      />
    )}
  </Translations>
);

export const ErrorPageGeneric = ({ error }: { error?: SomeError }) => (
  <Translations
    importP={(lang: string) => import(`./translations/${lang}/keys.json`)}
    fallbackImport={translations}
  >
    {(lookup) => (
      <SomeErrorPage
        title={lookup("page.error.generic.header")}
        description={lookup("page.error.generic.description")}
        buttonLabel={lookup("page.error.generic.buttonLabel")}
        error={error}
      />
    )}
  </Translations>
);

const ErrorCodePage = ({ error }: { error: SomeError }) => {
  switch (error.code) {
    case "not.found":
      return <ErrorPage404 error={error} />;
    default:
      return <ErrorPageGeneric error={error} />;
  }
};

export const ErrorPage = ({ errors }: { errors: Array<SomeError> }) =>
  errors.reduce((_acc, x) => <ErrorCodePage error={x} />, <></>);
