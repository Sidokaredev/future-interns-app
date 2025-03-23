import {
  Box,
  Breadcrumbs,
  InputAdornment,
  Stack,
  SxProps,
  TextField,
  Typography,
  Link,
  Snackbar,
} from "@mui/material";
import DashboardLayout from "../../../../../components/Templates/DashboardLayout";
import { grey } from "@mui/material/colors";
import {
  HomeRounded,
  SearchRounded,
} from "@mui/icons-material";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Link as ReactRouterLink,
  useLocation,
  useParams,
} from "react-router-dom";
import BreadcrumbsCreator from "../../../helpers";
import { GetSession, onCloseSnackbar } from "../../../../global-helpers";
import RequestAPI from "../../../../../services/api/request";
import { VacancyType } from "../../../types";
import ScreeningStage from "../../../../../components/Organisms/employers/vacancies/pipelines/ScreeningStage";
import AssessmentStage from "../../../../../components/Organisms/employers/vacancies/pipelines/AssessmentStage";
import InterviewStage from "../../../../../components/Organisms/employers/vacancies/pipelines/InterviewStage";
import OfferingStage from "../../../../../components/Organisms/employers/vacancies/pipelines/OfferingStage";

export default function EmployerVacanciesPipeline() {
  /* react-router */
  const location = useLocation();
  const params = useParams();
  /* state */
  const [searchApplicant, setSearchApplicant] = useState<string>("");
  const [tabOn, setTabOn] = useState<
    "screening" | "assessments" | "interviews" | "offerings" | "LoA"
  >("screening");
  const [vacancy, setVacancy] = useState<VacancyType | null>(null);
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" });
  /* helpers */
  const tabStyleDeterminer = (condition: string): SxProps => {
    return {
      ["#" + condition]: {
        backgroundColor: "#389a8a",
        ".MuiTypography-body2": {
          color: "white",
        },
        ".MuiBox-root": {
          backgroundColor: "white",
          ".MuiTypography-caption": {
            color: "#389a8a",
          },
        },
      },
    };
  };

  /* fetching vacancy detail */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<{
        vacancy: VacancyType,
        applied: boolean
      }>(
        "/api/v1/vacancies/" + params["id"],
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );
      if (fail) {
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setVacancy(data.vacancy);
      }
    })();
  }, [])
  return (
    <DashboardLayout isFor="employer">
      {/* Default Notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        message={alert.message}
        autoHideDuration={3000}
        onClose={onCloseSnackbar(setAlert)}
      />
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: "1em" }}>
        {/* will be fixed soon */}
        {BreadcrumbsCreator(
          params as Record<string, string>,
          location.pathname
        ).map((data, index) => (
          <Link
            key={index}
            component={ReactRouterLink}
            to={data.pathname}
            underline="hover"
            color="inherit"
            sx={{
              display: "flex",
              alignItems: "center",
              color:
                data.pathname === location.pathname ? "#51a799" : undefined,
            }}
          >
            {data.label === "Vacancies" ? (
              <HomeRounded
                sx={{
                  mr: 0.5,
                  color:
                    data.pathname === location.pathname ? "#51a799" : undefined,
                }}
                fontSize="inherit"
              />
            ) : (
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight:
                    data.pathname === location.pathname ? 550 : undefined,
                }}
              >
                {data.label}
              </Typography>
            )}
          </Link>
        ))}
      </Breadcrumbs>
      <Box component={"div"} sx={{}}>
        <Box
          component={"div"}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: {
              xs: "0.5em",
              sm: 0,
            },
          }}
        >
          <Typography
            component={"p"}
            variant="h6"
            sx={{
              fontWeight: 550,
              fontSize: { xs: "medium", md: "large" },
              color: grey[800],
            }}
          >
            {vacancy?.position}
          </Typography>
          <TextField
            type="text"
            name="search" // search for candidate
            placeholder="Search by name..."
            autoComplete="off"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded />
                </InputAdornment>
              ),
              sx: {
                minWidth: {
                  md: "20em",
                },
                fontSize: "small",
              },
            }}
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
            value={searchApplicant}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchApplicant(event.target.value);
            }}
          />
        </Box>
        {/* Tabs Panel */}
        <Stack
          direction={"row"}
          spacing={2}
          sx={{
            marginY: "1em",
            paddingBottom: "0.5em",
            ...tabStyleDeterminer(tabOn),
            ".MuiBox-root": {
              backgroundColor: "white",
              ".MuiTypography-body2": {
                letterSpacing: {
                  xs: "",
                  md: "0.03em",
                },
                color: grey[600],
              },
              ".MuiBox-root": {
                backgroundColor: grey[600],
                ".MuiTypography-caption": {
                  color: "white",
                },
              },
              cursor: "pointer",
            },
            "> .MuiBox-root:hover": {
              backgroundColor: grey[200],
            },
            overflowX: {
              xs: "auto",
            },
          }}
        >
          <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              columnGap: "0.3em",
              padding: "0.5em",
              borderRadius: "0.3em",
            }}
            id="screening"
            onClick={() => setTabOn("screening")}
          >
            <Typography
              component={"p"}
              variant="body2"
              sx={{ fontWeight: 550, fontSize: { xs: "small", sm: "" } }}
            >
              Screening
            </Typography>
          </Box>
          <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              columnGap: "0.3em",
              padding: "0.5em",
              borderRadius: "0.3em",
            }}
            id="assessments"
            onClick={() => setTabOn("assessments")}
          >
            <Typography
              component={"p"}
              variant="body2"
              sx={{
                fontWeight: 550,
                fontSize: { xs: "small", sm: "" },
                color: grey[600],
              }}
            >
              Assessments
            </Typography>
          </Box>
          <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              columnGap: "0.3em",
              padding: "0.5em",
              borderRadius: "0.3em",
            }}
            id="interviews"
            onClick={() => setTabOn("interviews")}
          >
            <Typography
              component={"p"}
              variant="body2"
              sx={{
                fontWeight: 550,
                fontSize: { xs: "small", sm: "" },
                color: grey[600],
              }}
            >
              Interviews
            </Typography>
          </Box>
          <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              columnGap: "0.3em",
              padding: "0.5em",
              borderRadius: "0.3em",
            }}
            id="offerings"
            onClick={() => setTabOn("offerings")}
          >
            <Typography
              component={"p"}
              variant="body2"
              sx={{
                fontWeight: 550,
                fontSize: { xs: "small", sm: "" },
                color: grey[600],
              }}
            >
              Offerings
            </Typography>
          </Box>
          {/* Letter of Acceptance */}
          {/* <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              columnGap: "0.3em",
              padding: "0.5em",
              borderRadius: "0.3em",
            }}
            id="LoA"
            onClick={() => setTabOn("LoA")}
          >
            <Typography
              component={"p"}
              variant="body2"
              sx={{
                fontWeight: 550,
                fontSize: { xs: "small", sm: "" },
                color: grey[600],
              }}
            >
              LoA
            </Typography>
          </Box> */}
        </Stack>
        {/* Screening */}
        <ScreeningStage
          tabOn={tabOn}
          setAlert={setAlert}
          searchApplicant={searchApplicant}
        />
        {/* Assessments */}
        <AssessmentStage
          tabOn={tabOn}
          setAlert={setAlert}
          searchApplicant={searchApplicant}
        />
        {/* Interviews */}
        <InterviewStage
          tabOn={tabOn}
          setAlert={setAlert}
          searchApplicant={searchApplicant}
        />
        {/* Offerings */}
        <OfferingStage
          tabOn={tabOn}
          setAlert={setAlert}
          searchApplicant={searchApplicant}
        />
      </Box>
    </DashboardLayout>
  );
}
