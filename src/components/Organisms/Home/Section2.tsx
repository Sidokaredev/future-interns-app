import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import VacancyItemGrid from "../../Molecules/Data.Display/VacancyItemGrid";

export default function HomeSection2() {
  /* media query */
  const isMobile = useMediaQuery("(max-width:900px)");
  return (
    <Container disableGutters maxWidth="lg">
      <Stack textAlign={"center"} marginTop={"3rem"}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight={"bold"}
          color={"#045a55"}
        >
          Popular Vacancies
        </Typography>
        <Box
          display={"flex"}
          justifyContent={"center"}
          marginTop={"1rem"}
          paddingX={{
            xs: "0.5em",
            sm: "0em",
          }}
        >
          <Typography
            variant={"subtitle1"}
            maxWidth={"35rem"}
            color={"#045a5681"}
          >
            Search all the open positions on the web. Get your own personalized
            salary estimate. Read reviews on over 30000+ companies worldwide
          </Typography>
        </Box>
      </Stack>
      {/* Data Display */}
      <Grid
        container
        spacing={3}
        marginY={"2rem"}
        paddingX={{ xs: "1.5em", lg: "0em" }}
      >
        {[0, 1, 2, 3, 4].map((_, index) => (
          <VacancyItemGrid key={index} />
        ))}
      </Grid>
    </Container>
  );
}
