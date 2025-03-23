import {
  Box,
  Button,
  Container,
  Dialog,
  Grid,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import VacancyItemGrid from "../../Molecules/Data.Display/VacancyItemGrid";
import { useEffect, useRef, useState } from "react";
import { VacancyType } from "../../../pages/employers/types";
import { GetSession, onCloseSnackbar } from "../../../pages/global-helpers";
import RequestAPI from "../../../services/api/request";
import { useNavigate } from "react-router-dom";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import SimpleEmphasis from "../../Molecules/Texts/SimpleEmphasis";

export default function HomeSection2({
  searchQuery
}: {
  searchQuery: string;
}) {
  /* react-router */
  const navigate = useNavigate();
  /* state */
  const [vacancies, setVacancies] = useState<VacancyType[]>([]);
  const [loadMoreCounter, setLoadMoreCounter] = useState<number>(1);
  const [endSearchResult, setEndSearchResult] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" });
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  const [dataAction, setDataAction] = useState<boolean>(false);
  /* ref */
  const searchResultRef = useRef<HTMLDivElement>(null);
  /* media query */
  const isMobile = useMediaQuery("(max-width:900px)");

  /* side-effect */
  useEffect(() => {
    // to make scrolled down into the result of the search
    if (searchResultRef.current && searchQuery !== "") {
      searchResultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [searchQuery])
  /* fetching-with dataAction */
  useEffect(() => {
    const token = GetSession('auth');
    (async () => {
      const headerInit = new Headers()
      if (Boolean(token)) {
        headerInit.append("Authorization", "Bearer " + token)
      }
      const [data, fail] = await RequestAPI.Send<{ vacancies: VacancyType[], applied: string[] }>(
        "/api/v1/vacancies/?page=" + (loadMoreCounter) + "&limit=9&" + searchQuery,
        {
          method: "GET",
          headers: headerInit
        }
      );
      if (fail) {
        setLoadMoreCounter(prev => prev - 1);
        if (fail.error === "invalid access token") {
          return setOpenDialog(prev => ({ ...prev, ["login"]: true }));
        } else if (fail.error === "0 rows, no data vacancies found") {
          return setEndSearchResult(true);
        };
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        if (data.vacancies.length < 9) {
          setEndSearchResult(true);
        } else {
          setEndSearchResult(false);
        }
        if (vacancies.length === 0 || loadMoreCounter === 1) {
          return setVacancies(data.vacancies);
        }

        return setVacancies(prev => ([...prev, ...data.vacancies]));
      }
    })();
  }, [dataAction]);
  useEffect(() => {
    const token = GetSession('auth');
    (async () => {
      const headerInit = new Headers()
      if (Boolean(token)) {
        headerInit.append("Authorization", "Bearer " + token)
      }
      const [data, fail] = await RequestAPI.Send<{ vacancies: VacancyType[], applied: string[] }>(
        "/api/v1/vacancies/?page=" + 1 + "&limit=9&" + searchQuery,
        {
          method: "GET",
          headers: headerInit
        }
      );
      if (fail) {
        setLoadMoreCounter(prev => prev - 1);
        // if (fail.error === "invalid access token") {
        //   return setOpenDialog(prev => ({ ...prev, ["login"]: true }));
        // };
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        if (data.vacancies.length < 9) {
          setEndSearchResult(true);
        } else {
          setEndSearchResult(false);
        }

        setLoadMoreCounter(1);

        return setVacancies(data.vacancies);
      }
    })();
  }, [searchQuery]);
  return (
    <Container disableGutters maxWidth="lg">
      {/* Default Notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        message={alert.message}
        autoHideDuration={3000}
        onClose={onCloseSnackbar(setAlert)}
      />
      <Stack ref={searchResultRef} component={"div"} textAlign={"center"} marginTop={"3rem"}>
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
        {vacancies.map((vacancy, index) => (
          <VacancyItemGrid key={index} vacancy={vacancy} />
        ))}
      </Grid>
      <Box component={"div"}
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingX: { xs: "3.6em", sm: "0" },
          marginY: "1em",
        }}
      >
        {endSearchResult ? (
          <Typography component={"p"} variant="subtitle1" sx={{ color: grey[700], textAlign: "center", overflowWrap: "break-word", fontSize: { xs: "small", sm: "medium" } }}>
            You've reached the end of the search results. <SimpleEmphasis text={vacancies.length + " "} /> Job Vacancies
          </Typography>
        ) : loadMoreCounter < 3 ? (
          <Button variant="contained"
            onClick={() => {
              setLoadMoreCounter(prev => prev + 1);
              setDataAction(prev => !prev);
            }}
          >
            LOAD MORE
          </Button>
        ) : (
          <Button variant="contained"
            endIcon={<KeyboardArrowRightRounded fontSize="small" />}
            onClick={() => {
              navigate("/vacancy#job-vacancies-banner")
            }}
          >
            GO TO JOB  VACANCIES
          </Button>
        )}
      </Box>
      {/* Dialog Untuk ke Halaman Login */}
      <Dialog
        open={Boolean(openDialog["login"])}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            padding: "1.5em"
          }
        }}
      >
        <Box component={"div"}
          sx={{
            marginBottom: "2em"
          }}
        >
          <Typography component={"p"} variant="subtitle1"
            sx={{
              fontWeight: 550,
              color: grey[700],
              marginBottom: "0.5em",
            }}
          >
            Note
          </Typography>
          <Typography component={"p"} variant="body1">
            You need to log in to view available job vacancies. Would you like to <SimpleEmphasis text={" continue "} /> to the login page now?
          </Typography>
        </Box>
        <Box component={"div"}
          sx={{
            display: "flex",
            justifyContent: "end",
            columnGap: "1em",
          }}
        >
          <Button
            variant="text"
            color="error"
            size="small"
            onClick={() => setOpenDialog(prev => ({ ...prev, ["login"]: false }))}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              navigate("/accounts/auth")
            }}
          >
            CONTINUE
          </Button>
        </Box>
      </Dialog>
    </Container>
  );
}
