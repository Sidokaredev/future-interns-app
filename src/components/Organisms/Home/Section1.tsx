import {
  Box,
  Container,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import JobSearchBar from "../../Molecules/Forms/JobSearchBar";

export default function HomeSection1() {
  /* media query */
  const isMobile = useMediaQuery("(max-width:900px)");
  return (
    <Container disableGutters maxWidth="md">
      <Stack sx={{ textAlign: "center", color: "#ffffff" }}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          sx={{
            fontWeight: "bolder",
          }}
        >
          Got Talent ?
        </Typography>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          sx={{
            fontWeight: "bolder",
          }}
        >
          Meet Opportunity
        </Typography>
        <Box
          display={"flex"}
          justifyContent={"center"}
          marginTop={"1rem"}
          padding={{ xs: "0.5em", lg: "none" }}
        >
          <Typography
            variant="subtitle1"
            maxWidth={"35rem"}
            sx={{ color: "#d9d9d9" }}
          >
            Find Jobs, Employment & Career Opportunities. Some of the companies
            we've helped recruit excellent applicants over the years.
          </Typography>
        </Box>
      </Stack>
      <JobSearchBar /> {/* path -> Molecules/Forms */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent={"center"}
        color={"#d9d9d9"}
      >
        <Typography variant="body1" textAlign={"center"} fontWeight={"bold"}>
          Popular Searches:
        </Typography>
        <Typography
          variant="body1"
          textAlign={"center"}
          paddingX={{ xs: 0.3, md: 0 }}
        >
          Designer, Developer, Web, IOS, PHP Senior Engineer
        </Typography>
      </Stack>
    </Container>
  );
}
