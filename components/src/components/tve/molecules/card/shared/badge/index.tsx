import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import * as styles from "./styles.css";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { Kind, Content } from "../../../../molecules/card/types";
import { Label } from "../../../../atoms/text";
import translations from "../../translations/keys.json";
import { Translations } from "@discovery/components-luna/lib/components/translations";
import { Clamp } from "../../../../../../utils/text";

// It's requirement for max text length of badge.
const maxTextLength = 30;

const getBadgeM = (badgeM: M.Maybe<string>) =>
  M.map((badge) => <Clamp str={badge} maxLength={maxTextLength} />, badgeM);

const getBadgeNewM = () =>
  M.of(
    <Translations
      importP={(lang: string) => import(`../../translations/${lang}/keys.json`)}
      fallbackImport={translations}
    >
      {(lookup) => lookup("badge.new")}
    </Translations>
  );

export const Badge = ({
  content,
  className,
}: {
  content: Content;
  className?: string;
}) => {
  if (content.kind !== Kind.Video && content.kind !== Kind.Show) return null;

  const textM =
    content.kind === Kind.Video
      ? M.alt(
          getBadgeM(content.badgeM),
          M.foldMapConst(
            (isNew) => (isNew ? getBadgeNewM() : M.empty()),
            M.empty(),
            content.isNewM
          )
        )
      : getBadgeM(content.badgeM);

  return (
    <RenderMaybe>
      {M.map(
        (text) => (
          <Label className={cn(styles.badge, className)}>
            <span>{text}</span>
          </Label>
        ),
        textM
      )}
    </RenderMaybe>
  );
};

export const BadgeWithRef = React.forwardRef(
  ({ content }: { content: Content }, ref?: React.Ref<HTMLDivElement>) => (
    <div ref={ref} className={styles.badgeContainer}>
      <Badge content={content} />
    </div>
  )
);
