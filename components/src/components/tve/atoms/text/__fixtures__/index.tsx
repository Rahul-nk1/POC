import {
  H1,
  H2,
  H3,
  H4,
  H5,
  P,
  Bold,
  ButtonText,
  Label,
  Small,
  Text,
  Kinds,
  Sizes,
  Weights,
} from "..";

const str =
  "Readymade kinfolk bushwick fingerstache, tofu forage yr cardigan portland vegan roof party cronut biodiesel.";

export default {
  H1: <H1>{str}</H1>,
  H2: <H2>{str}</H2>,
  H3: <H3>{str}</H3>,
  H4: <H4>{str}</H4>,
  H5: <H5>{str}</H5>,
  P: <P>{str}</P>,
  "P (light)": <P weight={Weights.light}>{str}</P>,
  "P (bold)": <P weight={Weights.bold}>{str}</P>,
  "P (heavy)": <P weight={Weights.heavy}>{str}</P>,
  Bold: <Bold>{str}</Bold>,
  ButtonText: <ButtonText>{str}</ButtonText>,
  Label: <Label>{str}</Label>,
  Small: <Small>{str}</Small>,
  "Generic Text Component": (
    <Text kind={Kinds.title} size={Sizes.m}>
      {str}
    </Text>
  ),
};
