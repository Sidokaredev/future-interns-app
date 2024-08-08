import { Box, Collapse, Container, Grid, Pagination, Typography, useMediaQuery } from "@mui/material"
import NavigationHeader from "../../components/Organisms/NavigationHeader"
import FilteringVacancy from "../../components/Organisms/Vacancy/Section2/FilteringVacancy"
import ListVacancy from "../../components/Organisms/Vacancy/Section2/ListVacancy"
import MobileFilteringVacancy from "../../components/Organisms/Vacancy/Section2/MobileFilteringVacancy"
import Footer from "../../components/Organisms/Footer"

export default function VacancyPage() {
  /* Responsive Breakpoints */
  const mediaSize = useMediaQuery('(max-width:900px)')
  return (
    <>
      <Box
        component={'div'}
        style={{
          width: '100%',
          height: '5em',
        }}
      >
        {/* Navigation */}
        <NavigationHeader />
        {/* Content 1 */}
        <Box
          component={'div'}
          sx={{
            backgroundImage: 'url(/backgrounds/Vacancy-Background.svg)', // may be required (../../../public)
            backgroundSize: 'cover',
            height: '295px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {/* Content 1 Component */}
          <Container
            disableGutters
            maxWidth="xl"
            sx={{
              paddingTop: '3em'
            }}
          >
            <Typography align="center" variant="h5" color={"white"}>
                Job Vacancy
            </Typography>
          </Container>
        </Box>
        {/* Content 2 */}
        <Box
          component={'div'}
          sx={{
            paddingY: {
              xs: '2em',
              lg: '4em'
            },
          }}
        >
          {/* Content 2 Component */}
          <Container
            disableGutters
            maxWidth="lg"
          >
            {/* Mobile Filtering Panel */}
            <Collapse
              in={mediaSize ? true : false}
              /* Sticky Maker */
              sx={{
                position: 'sticky',
                top: '4.5em',
                zIndex: 99,
                backgroundColor: 'white',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px'
              }}
            >
              <MobileFilteringVacancy />
            </Collapse>
            <Grid container
              columnGap={3}
            >
              <Grid item xs={12} md={4.2} lg={3.8}
              >
                {/* Filtering Panel */}
                <Collapse
                  in={mediaSize ? false : true}
                >
                  <FilteringVacancy />
                </Collapse>
              </Grid>
              <Grid item xs={12} md={7.4} lg={7.9}
                paddingX={{
                  xs: '0.5em',
                  lg: '0em'
                }}
              >
                {/* LIST OF VACANCIES */}
                <ListVacancy />
                {/* PAGINATION LIST */}
                <Pagination color="primary" count={13}
                  sx={{
                    float: 'right',
                    marginY: '2em'
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
        {/* Footer */}
        <Footer />
      </Box>
    </>
  )
}