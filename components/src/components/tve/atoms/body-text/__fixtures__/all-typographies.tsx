import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Paragraph,
  SubHeader1,
  SubHeader2,
  SubHeader3,
  SubHeader4,
} from "@discovery/theming/lib/typography";

import { Date, Details, Legal } from "../";

export default (
  <div>
    <br />
    <H1>Heading 1</H1>
    <br />
    <H2>Heading 2</H2>
    <br />
    <H3>Heading 3</H3>
    <br />
    <H4>Heading 4</H4>
    <br />
    <H5>Heading 5</H5>
    <br />
    <H6>Heading 6</H6>
    <br />
    <SubHeader1>Sub-Header 1</SubHeader1>
    <br />
    <SubHeader2>Sub-Header 2</SubHeader2>
    <br />
    <SubHeader3>Sub-Header 3</SubHeader3>
    <br />
    <SubHeader4>Sub-Header 4</SubHeader4>
    <br />
    <Paragraph>
      This is a <b>paragraph</b>. Lorem ipsum dolor sit amet, consectetuer
      adipiscing elit. Donec hendrerit tempor tellus. Donec pretium posuere
      tellus. Proin quam nisl, tincidunt et, mattis eget, convallis nec, purus.
      Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
      ridiculus mus. Nulla posuere. Donec vitae dolor. Nullam tristique diam non
      turpis. Cras placerat accumsan nulla. Nullam rutrum. Nam vestibulum
      accumsan nisl.
    </Paragraph>
    <br />
    <Details>
      This is a <b>Details</b>. Lorem ipsum dolor sit amet, consectetuer
      adipiscing elit. Donec hendrerit tempor tellus. Donec pretium posuere
      tellus. Proin quam nisl, tincidunt et, mattis eget, convallis nec, purus.
      Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
      ridiculus mus. Nulla posuere. Donec vitae dolor. Nullam tristique diam non
      turpis. Cras placerat accumsan nulla. Nullam rutrum. Nam vestibulum
      accumsan nisl.
    </Details>
    <br />
    <Date>Date: Monday 20 july 2020. 201220</Date>
    <br />
    <Legal>@Legal: Curabitur lacinia pulvinar nibh.</Legal>
  </div>
);
