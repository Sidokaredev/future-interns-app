import {
  Box,
  Button,
  Collapse,
  Container,
  Drawer,
  Grid,
  IconButton,
  Pagination,
  Typography,
  useMediaQuery,
} from "@mui/material";
import BaseLayout from "../../components/Templates/BaseLayout";
import VacancyItemList from "../../components/Molecules/Data.Display/VacancyItemList";
import VacancyFilters from "../../components/Molecules/Forms/VacancyFilters";
import { CloseRounded, SortRounded } from "@mui/icons-material";
import { useState } from "react";

export default function VacancyPage() {
  /* breakpoints */
  const mediaSize = useMediaQuery("(max-width:900px)");
  /* state */
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  return (
    <BaseLayout>
      {/* Section 1 */}
      <Box
        component={"div"}
        sx={{
          backgroundImage:
            "url(/future-interns-app/backgrounds/Vacancy-Background.svg)", // may be required (../../../public)
          backgroundSize: "cover",
          height: "295px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container
          disableGutters
          maxWidth="xl"
          sx={{
            paddingTop: "3em",
          }}
        >
          <Typography align="center" variant="h5" color={"white"}>
            Job Vacancy
          </Typography>
        </Container>
      </Box>
      {/* Section 2 */}
      <Box
        component={"div"}
        sx={{
          paddingY: {
            lg: "4em",
          },
        }}
      >
        <Container disableGutters maxWidth="lg">
          {/* Mobile Filtering Panel */}
          <Collapse
            in={mediaSize ? true : false}
            sx={{
              backgroundColor: "white",
            }}
          >
            <Box
              component={"div"}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0em 0.5em",
                paddingY: "0.5em",
                paddingX: "0.5em",
              }}
            >
              <Button
                variant="text"
                sx={{ paddingX: "0.5em", minWidth: 0 }}
                onClick={() => setOpenDrawer(true)}
              >
                <SortRounded />
              </Button>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", color: "#06816d" }}
              >
                Filters
              </Typography>
            </Box>
            <Drawer
              open={openDrawer}
              onClose={() => setOpenDrawer(false)}
              anchor="bottom"
            >
              <VacancyFilters />
              <Box component={"div"} sx={{ textAlign: "center" }}>
                <IconButton
                  color="error"
                  onClick={() => setOpenDrawer(false)}
                  sx={{ minWidth: 0 }}
                >
                  <CloseRounded />
                </IconButton>
              </Box>
            </Drawer>
            {/* <MobileFilteringVacancy /> */}
          </Collapse>
          <Grid container columnGap={3}>
            <Grid item xs={12} md={4.2} lg={3.8}>
              {/* Filtering Panel */}
              <Collapse
                in={mediaSize ? false : true}
                sx={{ position: "sticky", top: "4.5em" }}
              >
                <VacancyFilters />
              </Collapse>
            </Grid>
            <Grid
              item
              xs={12}
              md={7.4}
              lg={7.9}
              paddingX={{
                xs: "0.5em",
                lg: "0em",
              }}
            >
              {/* LIST OF VACANCIES */}
              <Box component={"div"}>
                {[0, 1, 2, 3, 4].map((_, index) => (
                  <VacancyItemList key={index} />
                ))}
              </Box>
              {/* PAGINATION LIST */}
              <Pagination
                color="primary"
                count={13}
                sx={{
                  float: "right",
                  marginY: "2em",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </BaseLayout>
  );
}
