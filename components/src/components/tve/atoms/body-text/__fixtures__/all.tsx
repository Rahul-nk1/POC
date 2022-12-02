import { Typography } from "@discovery/theming";
import { Paragraph, Details } from "../";

const text = "This is a Paragraph";
const details =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const SemiBold = Typography.semiBold(Paragraph);
const Italic = Typography.italic(Paragraph);
const Uppercase = Typography.uppercase(Paragraph);

export default {
  regular: <Paragraph>{text}</Paragraph>,
  bold: <SemiBold>{text}</SemiBold>,
  italic: <Italic>{text}</Italic>,
  uppercase: <Uppercase>{text}</Uppercase>,
  details: <Details>{details}</Details>,
};
