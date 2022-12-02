import { Tags } from "../../../../../utils/types";
import { HeaderVariants, Typography } from "../";

const heading = "All categories you can think of";

const tag = "Some tag";

export default {
  "Heading 1": (
    <Typography tag={Tags.p} variant={HeaderVariants.headingOne}>
      {heading}
    </Typography>
  ),
  "Heading 2": (
    <Typography tag={Tags.h2} variant={HeaderVariants.headingTwo}>
      {heading}
    </Typography>
  ),
  "Heading 3": (
    <Typography tag={Tags.h3} variant={HeaderVariants.headingThree}>
      {heading}
    </Typography>
  ),
  "Heading 4": (
    <Typography tag={Tags.span} variant={HeaderVariants.headingFour}>
      {heading}
    </Typography>
  ),
  "Heading 5": (
    <Typography tag={Tags.h1} variant={HeaderVariants.headingFive}>
      {heading}
    </Typography>
  ),
  "Large tag": (
    <Typography tag={Tags.h5} variant={HeaderVariants.largeTag}>
      {tag}
    </Typography>
  ),
  "Small tag": (
    <Typography tag={Tags.span} variant={HeaderVariants.smallTag}>
      {tag}
    </Typography>
  ),
};
