import {
  Box,
  Button,
  Collapse,
  Container,
  Dialog,
  Drawer,
  Grid,
  IconButton,
  Pagination,
  Snackbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import BaseLayout from "../../components/Templates/BaseLayout";
import VacancyItemList from "../../components/Molecules/Data.Display/VacancyItemList";
import VacancyFilters from "../../components/Molecules/Forms/VacancyFilters";
import { CloseRounded, SortRounded } from "@mui/icons-material";
import { ChangeEvent, useEffect, useState } from "react";
import { VacancyType } from "../employers/types";
import { GetSession, onCloseSnackbar } from "../global-helpers";
import RequestAPI from "../../services/api/request";
import { grey } from "@mui/material/colors";
import SimpleEmphasis from "../../components/Molecules/Texts/SimpleEmphasis";
import { useNavigate } from "react-router-dom";

export type FiltersType = {
  keyword: string;
  line_industry: string;
  location: string;
  employee_type: string;
}

export default function VacancyPage() {
  /* react-router */
  const navigate = useNavigate();
  /* breakpoints */
  const mediaSize = useMediaQuery("(max-width:900px)");
  /* state */
  const [vacancies, setVacancies] = useState<VacancyType[]>([]);
  const [appliedVacancies, setAppliedVacancies] = useState<string[]>([]);
  const [filters, setFilters] = useState<FiltersType>({ keyword: "", line_industry: "", location: "", employee_type: "" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" });
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  const [dataAction, setDataAction] = useState<boolean>(false);

  /* constants */
  const searchedVacancies = vacancies.filter((vacancy) => {
    let check = vacancy.position.toLowerCase().includes(filters.keyword.toLowerCase()) || vacancy.employer.legal_name.toLowerCase().includes(filters.keyword.toLowerCase()) || vacancy.employer.name.toLowerCase().includes(filters.keyword.toLowerCase());
    return check;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const filteredVacancies = searchedVacancies
    .filter((vacancy) => vacancy.employer.location.toLowerCase().includes(filters.location.toLowerCase()))
    .filter((vacancy) => filters.line_industry === "" || vacancy.line_industry === filters.line_industry)
    .filter((vacancy) => filters.employee_type === "" || vacancy.employee_type === filters.employee_type);
  const paginatedVacancies = filteredVacancies.slice((10 * currentPage) - 10, (10 * currentPage));
  const totalPages = vacancies.length === 10 ? 10 : Math.ceil(filteredVacancies.length / 10);

  /* handlers */
  const onPageChange = (_: ChangeEvent<any>, page: number) => {
    if (vacancies.length === 10) {
      return setOpenDialog(prev => ({ ...prev, ["unauthenticated"]: true }));
    }
    setCurrentPage(page);
  }

  /* side-effect */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [currentPage, filters]);
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    };
    if (openDrawer) {
      setOpenDrawer(false);
    }
  }, [filters]);
  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const headerInit = new Headers();
      if (token) {
        headerInit.append("Authorization", "Bearer " + token);
      }
      const [data, fail] = await RequestAPI.Send<{ vacancies: VacancyType[], applied: string[] }>(
        "/api/v1/vacancies/?limit=none",
        {
          method: "GET",
          headers: headerInit
        }
      );
      if (fail) {
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        setAppliedVacancies(data.applied);
        return setVacancies(data.vacancies);
      };
    })();
  }, [dataAction]);
  return (
    <BaseLayout>
      {/* Default Notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        message={alert.message}
        autoHideDuration={3000}
        onClose={onCloseSnackbar(setAlert)}
      />
      {/* Section 1 */}
      <Box
        id="job-vacancies-banner"
        component={"div"}
        sx={{
          backgroundImage:
            "url(/backgrounds/Vacancy-Background.svg)", // may be required (../../../public)
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
            md: "2em",
            lg: "4em",
          },
        }}
      >
        <Container disableGutters maxWidth="lg">
          {/* Mobile Filtering Panel */}
          <Collapse
            in={mediaSize ? true : false}
            unmountOnExit={false}
            sx={{
              backgroundColor: "white",
            }}
          >
            <Box
              component={"div"}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0em 0.5em",
                paddingY: "0.5em",
                paddingX: "0.5em",
              }}
            >
              <Box component={"div"}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  id="filters"
                  variant="text"
                  sx={{ paddingX: "0.5em", minWidth: 0 }}
                  onClick={() => setOpenDrawer(true)}
                >
                  <SortRounded />
                </Button>
                <Typography
                  component={"label"}
                  htmlFor="filters"
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", color: "#06816d" }}
                >
                  Filters
                </Typography>
              </Box>
              <Typography component={"p"} variant="subtitle2" sx={{ fontWeight: 500, color: grey[500], fontStyle: "italic" }}>
                Found <SimpleEmphasis text={" " + vacancies.length + " "} /> Job Vacancies
              </Typography>
            </Box>
            <Drawer
              open={openDrawer}
              onClose={() => setOpenDrawer(false)}
              anchor="bottom"
              keepMounted={true}
            >
              {/* FILTER HERE */}
              <VacancyFilters
                setFilters={setFilters} />
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
                {/* FILTER */}
                <VacancyFilters
                  setFilters={setFilters} />
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
              {!mediaSize && (
                <Box component={"div"} sx={{
                  display: "flex",
                  justifyContent: "end",
                  marginBottom: "0.5em",
                }}>
                  <Typography component={"p"} variant="subtitle2" sx={{ fontWeight: 500, color: grey[500], fontStyle: "italic" }}>
                    Found <SimpleEmphasis text={" " + vacancies.length + " "} /> Job Vacancies
                  </Typography>
                </Box>
              )}
              {/* LIST OF VACANCIES */}
              <Box component={"div"}>
                {paginatedVacancies.map((vacancy, index) => (
                  <VacancyItemList
                    key={index}
                    vacancy={vacancy}
                    appliedVacancies={appliedVacancies}
                    setOpenDialog={setOpenDialog}
                    setAlert={setAlert}
                    setDataAction={setDataAction}
                  />
                ))}
              </Box>
              {/* PAGINATION LIST */}
              <Pagination
                color="primary"
                count={totalPages}
                page={currentPage}
                onChange={onPageChange}
                sx={{
                  float: "right",
                  marginY: "2em",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* Dialog Untuk ke Halaman Login */}
      <Dialog
        open={Boolean(openDialog["unauthenticated"])}
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
            onClick={() => setOpenDialog(prev => ({ ...prev, ["unauthenticated"]: false }))}
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
    </BaseLayout>
  );
}
