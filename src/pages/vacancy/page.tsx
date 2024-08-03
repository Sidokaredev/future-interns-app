import { Box, Container, Grid, Typography } from "@mui/material"
import NavigationHeader from "../../components/Organisms/NavigationHeader"
import FilteringVacancy from "../../components/Organisms/Vacancy/Section2/FilteringVacancy"
import ListVacancy from "../../components/Organisms/Vacancy/Section2/ListVacancy"

export default function VacancyPage() {
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
            paddingY: '4em'
          }}
        >
          {/* Content 2 Component */}
          <Container
            disableGutters
            maxWidth="lg"
          >
            <Grid container
              columnGap={3}
              // border={'1px solid black'}
            >
              <Grid item xs={3.8}
                // border={'1px solid black'}
              >
                {/* Filtering Panel */}
                <FilteringVacancy />
              </Grid>
              <Grid item xs={7.9}
                // border={'1px solid black'}
                // sx={{
                //   height: '200vh'
                // }}
              >
                <ListVacancy />
                {/* <Box border={'1px solid black'}>
                  List Vacancy Panel
                </Box> */}
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  )
}