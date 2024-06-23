import { Container } from "@mui/material";
import TextContent from "../Molecules/Home/Content2/TextContent";
import VacancyItems from "../Molecules/Home/Content2/VacancyItems";

export default function HomeContent2() {
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