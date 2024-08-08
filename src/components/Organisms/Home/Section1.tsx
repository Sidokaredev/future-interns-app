import { Container, Stack, Typography } from "@mui/material";
import TextContent from "../../Molecules/Home/Section1/TextContent";
import SearchContent from "../../Molecules/Home/Section1/SearchContent";

export default function HomeSection1() {
  return (
    <Container
      disableGutters
      maxWidth="md"
    >
      <TextContent />
      <SearchContent />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent={'center'} color={'#d9d9d9'}>
        <Typography variant="body1" textAlign={'center'} fontWeight={'bold'}>
          Popular Searches:
        </Typography>
        <Typography variant="body1" textAlign={'center'} paddingX={{ xs: 0.3, md: 0 }}>
          Designer, Developer, Web, IOS, PHP Senior Engineer
        </Typography>
      </Stack>
    </Container>
  )
}