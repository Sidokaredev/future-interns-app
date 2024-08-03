import { Container } from "@mui/material";
import TextContent from "../../Molecules/Home/Section2/TextContent";
import VacancyItems from "../../Molecules/Home/Section2/VacancyItems";

export default function HomeSection2() {
  return (
    <Container
      disableGutters
      maxWidth="lg"
    >
      {/* Text Content 2 */}
      <TextContent />
      {/* Job Items */}
      <VacancyItems />
    </Container>
  )
}