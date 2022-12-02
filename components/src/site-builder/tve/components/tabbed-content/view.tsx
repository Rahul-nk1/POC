import * as F from "@discovery/prelude/lib/function";
import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as CQ from "@discovery/sonic-api-ng/lib/api/common/query";
import * as RD from "@discovery/prelude/lib/data/remote-data";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import * as Collections from "@discovery/sonic-api-ng/lib/api/cms/collections";
import * as PrivateFilter from "@discovery/sonic-api-ng/lib/api/common/query/private-filter";

import { cn } from "@discovery/classnames";
import { Fold } from "@discovery/prelude/lib/control/lens";
import { compose } from "@discovery/prelude/lib/data/function";
import { DataMeta } from "@discovery/components-tve/src/components/tve/organisms/content-grid/paginated";
import { parameters } from "@discovery/sonic-api-ng/lib/api/cms/collections/query/one";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { SonicException } from "@discovery/sonic-api-ng/lib/app/sonic";
import { CharacterLimit } from "@discovery/common-tve/lib/constants";
import { EventDataProvider } from "@discovery/common-tve/lib/eventing";
import { DEFAULT_DECORATORS } from "@discovery/common-tve/lib/constants";
import { createContentGridPaginated } from "@discovery/components-tve/src/components/tve/organisms/content-grid";
import {
  _Col2ColDataMeta,
  _ColResponse2Col,
} from "@discovery/sonic-api-ng-optics";
import {
  useState,
  useCallback,
  useSonicHttp,
  useEffect,
} from "@discovery/common-tve/lib/hooks";

import { Option } from "fp-ts/Option";

import { Tags } from "../../../../utils/types";
import { Clamp } from "../../../../utils/text";
import { Content } from "../../../../components/tve/molecules/card";
import { ListContainer } from "../../../../components/tve/atoms/list-container";
import { gridMap, Kind } from "../content-grid";
import { ShortHeaderProvider } from "../../../../components/tve/molecules/card/detailed/header";
import { H2, Kinds, P, Sizes } from "../../../../components/tve/atoms/text";
import {
  DetailShimmer,
  PaginationShimmerButton,
} from "../../../../components/tve/organisms/content-grid-shimmer";
import {
  _Col2ContentGridCardData,
  _CollectionResponse2Content,
} from "../content-grid/optics";
import {
  NavOption,
  SeasonPicker,
  HeadingTextTitle,
} from "../../../../components/tve/molecules/season-picker";

import Strings from "../../../../components/tve/hardcoded.json";

import * as styles from "./styles.css";

export const collectionRequest = (
  mandatoryParamM: M.Maybe<string>,
  selectedSeasonNumber: string
) => (page: Collections.Query.One.Page) => {
  const mandatoryParams = M.fromMaybe(mandatoryParamM, "");

  return compose(
    Collections.Query.One.lenses.decorators.set(
      CQ.Decorators.decorators(...DEFAULT_DECORATORS)
    ),
    Collections.Query.One.lenses.include.set(CQ.Include.include("default")),
    Collections.Query.One.lenses.page.set(page),
    Collections.Query.One.lenses.pf.set(
      PrivateFilter.pfs(
        PrivateFilter.pf(mandatoryParams),
        PrivateFilter.pf(`pf[seasonNumber]=${selectedSeasonNumber}`)
      )
    )
  )(Collections.Query.One.parameters);
};

const getInitialSeasonNumber = ({
  activeSeasonNumber,
  initialOptionM,
}: {
  activeSeasonNumber: M.Maybe<number>;
  initialOptionM: M.Maybe<string>;
}) => {
  const activeSeason = M.maybe("", (s) => `${s}`, activeSeasonNumber);
  const initialOption = M.maybe("", (e) => e, initialOptionM);
  const text = activeSeason || initialOption;
  return text.length > 0 ? M.of(text) : M.empty();
};

export const View = ({
  componentIdM,
  aboutM,
  collectionIdM,
  cardDataL,
  optionL,
  headingText,
  initialSelectedNavOptionM,
  collectionMandatoryParamM,
  metaM,
  isFavoriteM,
  idM,
  titleM,
  activeSeasonNumber = M.empty(),
  aliasM,
  onClick,
}: {
  componentIdM: M.Maybe<string>;
  aboutM: M.Maybe<string>;
  collectionIdM: M.Maybe<string>;
  cardDataL: L.List<Content>;
  optionL: L.List<NavOption>;
  headingText: string;
  initialSelectedNavOptionM: M.Maybe<NavOption>;
  collectionMandatoryParamM: M.Maybe<string>;
  metaM: M.Maybe<DataMeta>;
  isFavoriteM: M.Maybe<boolean>;
  idM: M.Maybe<string>;
  titleM: M.Maybe<string>;
  activeSeasonNumber?: M.Maybe<number>;
  aliasM: M.Maybe<string>;
  onClick?: (e: React.MouseEvent, content: Content) => void;
}) => {
  // Hooks

  const initialOptionM = M.map(
    (o: NavOption) => o.id,
    initialSelectedNavOptionM
  );
  const seasonNumber = getInitialSeasonNumber({
    activeSeasonNumber,
    initialOptionM,
  });
  const seasonNumberString = M.fromMaybe(seasonNumber, "");
  const [response, getCollection] = useSonicHttp(
    Collections.Endpoints.getCollection
  );

  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<string>(
    seasonNumberString
  );

  const requestParameters = useCallback(
    (option: NavOption) =>
      M.maybe(
        (x: Collections.Query.One.Parameters) => x,
        (mandatoryParams) =>
          compose(
            Collections.Query.One.lenses.decorators.set(
              CQ.Decorators.decorators(...DEFAULT_DECORATORS)
            ),

            Collections.Query.One.lenses.pf.set(
              PrivateFilter.pfs(
                PrivateFilter.pf(option.parameter),
                PrivateFilter.pf(mandatoryParams)
              )
            )
          ),
        collectionMandatoryParamM
      )(parameters),
    [collectionMandatoryParamM]
  );

  const Grid = gridMap[Kind.Detail];
  const ContentGridPaginated = createContentGridPaginated(Grid);

  const handleChange = useCallback(
    (option: NavOption) => {
      setSelectedSeasonNumber(option.id);
      M.map(
        (collectionId) =>
          getCollection(collectionId, requestParameters(option)),
        collectionIdM
      );
    },
    [getCollection, collectionIdM, requestParameters]
  );
  const handleSeasonSelect = useCallback(
    (optionId: string) => {
      const selectedM = L.head(L.filter((o) => o.id === optionId, optionL));
      const eff = M.maybe(
        F.noop,
        (selected: NavOption) => () => handleChange(selected),
        selectedM
      );
      eff();
    },
    [handleChange, optionL]
  );

  useEffect(() => {
    handleSeasonSelect(seasonNumberString);
  }, [handleSeasonSelect, seasonNumberString]);

  type RDContent = RD.RemoteDataInFlight<
    SonicException,
    {
      contentL: L.List<Content>;
      metaM: Option<DataMeta>;
    }
  >;
  const cards: RDContent = RD.fromRD(
    {
      notAsked: () =>
        RD.success({
          contentL: cardDataL,
          metaM: metaM,
        }) as RDContent,
      loading: () => RD.loading,
      failure: (e) => RD.failure(e) as RDContent,
      success: (newData) => {
        const metaM = Fold.preview(
          Fold.compose(_ColResponse2Col, _Col2ColDataMeta),
          newData
        );

        const contentL = Fold.toList(
          _Col2ContentGridCardData,
          Res.map(({ data }) => data, newData)
        );

        return RD.success({
          contentL,
          metaM,
        }) as RDContent;
      },
    },
    response
  );
  // TODO -- i18n -- abstract out strings
  return (
    <div className={styles.inner}>
      <EventDataProvider
        componentIdM={componentIdM}
        alias={M.fromMaybe(aliasM, "")}
      >
        <ul className={cn(styles.grid, styles.ulPlaceholder)}>
          <li className={styles.liPlaceholder}>
            <ListContainer className={styles.listContainer}>
              {!L.isEmpty(optionL) ? (
                <SeasonPicker
                  headerTag={Tags.h2}
                  headingText={headingText}
                  optionL={optionL}
                  optionPrefix="Season "
                  initialOptionM={seasonNumber}
                  selectOption={(optionId: string) =>
                    handleSeasonSelect(optionId)
                  }
                  isFavoriteM={isFavoriteM}
                  idM={idM}
                  titleM={titleM}
                />
              ) : (
                <HeadingTextTitle
                  isFavoriteM={isFavoriteM}
                  idM={idM}
                  titleM={titleM}
                />
              )}
              {RD.fromRDI(
                {
                  loading: () => (
                    <>
                      {L.times(
                        (i) => (
                          <DetailShimmer key={i} />
                        ),
                        3
                      )}
                      <PaginationShimmerButton />
                    </>
                  ),
                  failure: () => <></> /* TODO Error page */,
                  success: ({ contentL, metaM }) => (
                    <ShortHeaderProvider>
                      <ContentGridPaginated
                        autoPagination={false}
                        cardHeaderTag={Tags.h3}
                        collectionIdM={collectionIdM}
                        collectionRequest={collectionRequest(
                          collectionMandatoryParamM,
                          selectedSeasonNumber
                        )}
                        contentL={contentL}
                        headerTag={Tags.h3}
                        isEmptyMessageM={M.of(Strings.emptySeasonMessage)}
                        lens={_CollectionResponse2Content}
                        metaM={metaM}
                        titleM={M.empty()}
                        gridType={Kind.Detail}
                        onClick={onClick}
                      />
                    </ShortHeaderProvider>
                  ),
                },
                cards
              )}
            </ListContainer>
          </li>
          <RenderMaybe>
            {M.map(
              (text) => (
                <li className={styles.aboutSection}>
                  <H2
                    className={styles.aboutHeader}
                    kind={Kinds.subtitle}
                    size={Sizes.l}
                  >
                    {Strings.aboutShow}
                  </H2>
                  {/* Here Text is being parsed to html since some of the contents may contain html elements in string.  */}
                  <P className={styles.textContainer}>
                    <Clamp
                      str={text}
                      maxLength={CharacterLimit.LONG_DESCRIPTION_LENGTH}
                    />
                  </P>
                </li>
              ),
              aboutM
            )}
          </RenderMaybe>
        </ul>
      </EventDataProvider>
    </div>
  );
};
