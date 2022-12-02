import * as M from "@discovery/prelude/lib/data/maybe";
import { cn } from "@discovery/classnames";
import { RenderMaybe } from "@discovery/components-luna-react/lib/utils/render-maybe";
import { RenderBlocks } from "../../molecules/rich-text-data";
import { AST } from "../../molecules/rich-text-data/types";
import { MainContainer } from "../../atoms/main-container";
import styles from "./styles.css";

export type ArticleProps = {
  bodyM: M.Maybe<AST>;
};

export const Article = ({ bodyM }: ArticleProps) => (
  <div className={cn(styles.article)}>
    <MainContainer classNameM={M.of(styles.container)}>
      <RenderMaybe>
        {M.map(
          (body) => (
            <RenderBlocks ast={body} />
          ),
          bodyM
        )}
      </RenderMaybe>
    </MainContainer>
  </div>
);
