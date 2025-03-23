import { Box, Grid, Typography } from "@mui/material";
import AdministratorLayout from "../../components/Templates/AdministratorLayout";
import { grey } from "@mui/material/colors";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, Colors, LogarithmicScale } from "chart.js";

ChartJS.register(
  BarElement,
  ArcElement,
  LogarithmicScale,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Colors,
)

export default function AdministratorPage() {

  return (
    <AdministratorLayout>
      <Box component={"div"}
        sx={{
          marginBottom: "2em",
          display: "flex",
          columnGap: 2
        }}
      >
        <Box component={"div"} className="total-active-vacancies"
          sx={{
            flexBasis: "23%",
            paddingY: "0.4em",
            paddingX: "0.5em",
            border: `1px solid #9bcdc5`,
            borderRadius: "0.3em",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            "&:hover": {
              marginTop: "-0.3em",
            },
            transition: "margin-top 0.3s ease-in-out",
            backgroundColor: "#e6f2f0",
          }}
        >
          <Typography component={"p"} variant="subtitle2"
            sx={{
              color: grey[700],
              fontWeight: 550
            }}
          >
            Active Vacancies
          </Typography>
          <Typography component={"p"} variant="h5" sx={{ color: "#06816d" }}>
            5029
          </Typography>
        </Box>
        <Box component={"div"} className="total-employers"
          sx={{
            flexBasis: "23%",
            paddingY: "0.4em",
            paddingX: "0.5em",
            border: `1px solid #9bcdc5`,
            borderRadius: "0.3em",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            "&:hover": {
              marginTop: "-0.3em",
            },
            transition: "margin-top 0.3s ease-in-out",
            backgroundColor: "#e6f2f0",
          }}
        >
          <Typography component={"p"} variant="subtitle2"
            sx={{
              color: grey[700],
              fontWeight: 550
            }}
          >
            Total Employers
          </Typography>
          <Typography component={"p"} variant="h5" sx={{ color: "#06816d" }}>
            248
          </Typography>
        </Box>
        <Box component={"div"} className="avg-vacancies-per-employer"
          sx={{
            flexBasis: "30%",
            paddingY: "0.4em",
            paddingX: "0.5em",
            border: `1px solid #9bcdc5`,
            borderRadius: "0.3em",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            "&:hover": {
              marginTop: "-0.3em",
            },
            transition: "margin-top 0.3s ease-in-out",
            backgroundColor: "#e6f2f0",
          }}
        >
          <Typography component={"p"} variant="subtitle2"
            sx={{
              color: grey[700],
              fontWeight: 550
            }}
          >
            Avg. Vacancies per Employer
          </Typography>
          <Typography component={"p"} variant="h5" sx={{ color: "#06816d" }}>
            248
          </Typography>
        </Box>
        <Box component={"div"} className="total-candidates"
          sx={{
            flexBasis: "24%",
            paddingY: "0.4em",
            paddingX: "0.5em",
            border: `1px solid #9bcdc5`,
            borderRadius: "0.3em",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            "&:hover": {
              marginTop: "-0.3em",
            },
            transition: "margin-top 0.3s ease-in-out",
            backgroundColor: "#e6f2f0",
          }}
        >
          <Typography component={"p"} variant="subtitle2"
            sx={{
              color: grey[700],
              fontWeight: 550
            }}
          >
            Total Candidates
          </Typography>
          <Typography component={"p"} variant="h5" sx={{ color: "#06816d" }}>
            1033
          </Typography>
        </Box>
      </Box>
      <Box component={"div"}
        sx={{
          marginBottom: "1em"
        }}
      >
        <Grid container columnSpacing={2}>
          <Grid item xs={6}>
            <Box component={"div"} className="chart-wrapper"
              sx={{
                width: "100%",
                height: "20em",
              }}
            >
              <Bar
                data={{
                  datasets: [
                    {
                      data: [
                        { lineIndustry: "IT and Technology", total: 1022 },
                        { lineIndustry: "Finance", total: 167 },
                        { lineIndustry: "Construction and Property", total: 34 },
                        { lineIndustry: "Insurance", total: 22 },
                        { lineIndustry: "Retail and E-commerce", total: 320 },
                        { lineIndustry: "Entertainment and Media", total: 122 },
                        { lineIndustry: "Transportation and Logistics", total: 10 },
                        { lineIndustry: "Telecommunications", total: 10 },
                        { lineIndustry: "Education", total: 10 },
                        { lineIndustry: "Legal Services", total: 190 },
                      ],
                      parsing: {
                        xAxisKey: "lineIndustry",
                        yAxisKey: "total"
                      }
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                    }
                  },
                  font: {
                    family: 'Roboto'
                  },
                  plugins: {
                    title: {
                      display: true,
                      text: "Vacancy Distribution by Industry",
                      color: grey[700],
                      font: {
                        size: 14
                      },
                      position: "top",
                      padding: {
                        bottom: 20
                      }
                    },
                    legend: {
                      display: false,
                    }
                  }
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box component={"div"} className="chart-wrapper"
              sx={{
                width: "100%",
                height: "20em",
              }}
            >
              <Doughnut
                data={{
                  labels: ["Screenings", "Assessments", "Interviews", "Offerings"],
                  datasets: [
                    {
                      data: [20, 44, 16, 9],
                      backgroundColor: ["#90CAF9", "#A5D6A7", "#FFF59D", "#FFCC80"],
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  font: {
                    family: 'Roboto'
                  },
                  plugins: {
                    title: {
                      display: true,
                      text: "Hiring Pipeline: Candidates per Stage",
                      position: "top",
                      color: grey[700],
                      font: {
                        size: 14
                      },
                      padding: {
                        bottom: 20
                      }
                    },
                    legend: {
                      align: "center"
                    }
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </AdministratorLayout>
  )
}