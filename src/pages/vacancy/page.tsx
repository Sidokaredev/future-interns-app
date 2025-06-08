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
import { useNavigate, useSearchParams } from "react-router-dom";

export type FiltersType = {
  keyword: string;
  line_industry: string;
  location: string;
  employee_type: string;
}

export default function VacancyPage() {
  // react-router@navigate
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  console.log("search params has 'cached' ? ", searchParams.has("cached"));
  // mui@breakpoints
  const mediaSize = useMediaQuery("(max-width:900px)");
  // state@data
  const [vacancies, setVacancies] = useState<VacancyType[]>([]);
  const [vacanciesCount, setVacanciesCount] = useState<number>(0);
  const [appliedVacancies, setAppliedVacancies] = useState<string[]>([]);
  const [filters, setFilters] = useState<FiltersType>({ keyword: "", line_industry: "", location: "", employee_type: "" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" });
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  const [dataAction, setDataAction] = useState<boolean>(false);

  // constants
  const totalPages = vacanciesCount === 10 ? 10 : Math.ceil(vacanciesCount / 10);
  // handlers
  const onPageChange = (_: ChangeEvent<any>, page: number) => {
    if (vacanciesCount === 10) {
      return setOpenDialog(prev => ({ ...prev, ["unauthenticated"]: true }));
    }
    setCurrentPage(page);
  }

  // effect@dom
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
  // effect@fetching
  useEffect(() => {
    const token = GetSession("auth");
    let cachedQuery
    if (searchParams.has("cached")) {
      cachedQuery = "&cached=" + searchParams.get("cached");
    } else {
      cachedQuery = "";
    }
    (async () => {
      const headerInit = new Headers();
      if (token) {
        headerInit.append("Authorization", "Bearer " + token);
      }
      const [data, fail] = await RequestAPI.Send<{
        vacancies: VacancyType[],
        applied: string[],
        count: number,
      }>(
        "/vacancies/?limit=10&page=" + currentPage +
        "&keyword=" + filters.keyword +
        "&location=" + filters.location +
        "&lineIndustry=" + filters.line_industry +
        "&employeeType=" + filters.employee_type +
        cachedQuery,
        {
          method: "GET",
          headers: headerInit
        }
      );
      if (fail) {
        return setAlert({ show: true, message: "Data lowongan pekerjan tidak ditemukan!" });
      };
      if (data) {
        setAppliedVacancies(data.applied);
        setVacanciesCount(data.count);
        return setVacancies(data.vacancies);
      };
    })();
  }, [dataAction, filters, currentPage]);
  return (
    <BaseLayout>
      {/* Default Notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        message={alert.message}
        autoHideDuration={5000}
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
            Lowongan Pekerjaan
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
                Ditemukan <SimpleEmphasis text={" " + vacanciesCount + " "} /> lowongan pekerjaan
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
                setFilters={setFilters}
                setCurrentPage={setCurrentPage}
              />
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
                  setFilters={setFilters}
                  setCurrentPage={setCurrentPage}
                />
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
                    Ditemukan <SimpleEmphasis text={" " + vacanciesCount + " "} /> lowongan pekerjaan
                  </Typography>
                </Box>
              )}
              {/* LIST OF VACANCIES */}
              <Box component={"div"}>
                {vacancies.map((vacancy, index) => (
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
            Catatan
          </Typography>
          <Typography component={"p"} variant="body1">
            Anda perlu masuk untuk mengirim lamaran pada posisi ini. Apakah Anda ingin <SimpleEmphasis text={" melanjutkan "} /> ke halaman login sekarang?
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
            Batalkan
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              navigate("/accounts/auth")
            }}
          >
            Lanjutkan
          </Button>
        </Box>
      </Dialog>
    </BaseLayout>
  );
}
