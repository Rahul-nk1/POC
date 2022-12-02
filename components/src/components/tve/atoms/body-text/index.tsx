import { withCN } from "@discovery/jsx-utils";
import { Typography } from "@discovery/theming";
import * as styles from "./styles.css";

export const H1 = Typography.styled(Typography.H1);
export const Paragraph = Typography.styled(Typography.Paragraph);

export const Details = Typography.styled(
  withCN(styles.details)(Typography.Span)
);

export const Date = Typography.styled(withCN(styles.date)(Typography.Span));
export const Legal = Typography.styled(withCN(styles.legal)(Typography.Span));
