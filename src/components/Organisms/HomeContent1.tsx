import { Container, Stack, Typography } from "@mui/material";
import TextContent from "../Molecules/Home/Content1/TextContent";
import SearchContent from "../Molecules/Home/Content1/SearchContent";

export default function HomeContent1() {
  return (
    <Container
      disableGutters
      maxWidth="md"
    >
      <TextContent />
      <SearchContent />
      <Stack direction={'row'} spacing={2} justifyContent={'center'} color={'#d9d9d9'}>
        <Typography variant="body1" fontWeight={'bold'}>
          Popular Searches:
        </Typography>
        <Typography variant="body1">
          Designer, Developer, Web, IOS, PHP Senior Engineer
        </Typography>
      </Stack>
    </Container>
  )
}