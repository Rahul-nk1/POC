import * as M from "@discovery/prelude/lib/data/maybe";
import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from "@discovery/common-tve/lib/hooks";

import { Button, ButtonType } from "../../atoms/button";
import { LinkKind } from "../../atoms/link";
import Strings from "../../hardcoded.json";

import * as styles from "./styles.css";
export type Props = {
  text: JSX.Element | JSX.Element[];
  limitM?: M.Maybe<number>;
};

export const CollapsableText = ({ text, limitM = M.empty() }: Props) => {
  const textContainerRef = useRef<HTMLParagraphElement>(null);

  const [collapsed, setCollapsed] = useState(true);
  const [containerHeight, setContainerHeight] = useState(0);
  const [clampedText, setText] = useState("");
  const [animateTo, setAnimateTo] = useState("");
  const [isDuringAnimation, setDuringAnimation] = useState(false);

  useEffect(() => {
    // To achieve collapsing only text content is taken and making operations on that.
    const textContent = textContainerRef.current?.textContent;
    if (textContent) {
      setText(textContent);
    }
  }, []);

  const isMoreButtonVisible = M.foldMapConst(
    (limit) => clampedText.length > limit,
    false,
    limitM
  );

  useLayoutEffect(() => {
    const textContainer = textContainerRef.current;
    const nextHeight = textContainer?.scrollHeight;
    if (textContainer && nextHeight && containerHeight) {
      textContainer.style.height = `${containerHeight}px`;
      setDuringAnimation(true);
      setAnimateTo(`${nextHeight}px`);
    }
  }, [collapsed, containerHeight]);

  useEffect(() => {
    const textContainer = textContainerRef.current;

    if (animateTo && textContainer) {
      textContainer.style.height = animateTo;
      setTimeout(() => {
        setAnimateTo("");
        setDuringAnimation(false);
        textContainer.style.height = "";
      }, 200);
    }
  }, [animateTo]);

  const onClick = () => {
    if (!isDuringAnimation && textContainerRef.current) {
      setContainerHeight(textContainerRef.current.scrollHeight);
      setCollapsed((s) => !s);
    }
  };

  return (
    <>
      <p ref={textContainerRef} className={styles.textContainer}>
        {M.foldMapConst(
          (limit) =>
            collapsed && isMoreButtonVisible
              ? `${clampedText.substring(0, limit)}...`
              : text,
          text,
          limitM
        )}
      </p>
      {(isMoreButtonVisible || true) && (
        <Button
          className={styles.more}
          type={ButtonType.text}
          kind={LinkKind.eventListenerOnly}
          onClick={onClick}
          label={collapsed ? Strings.showMore : Strings.showLess}
        />
      )}
    </>
  );
};
