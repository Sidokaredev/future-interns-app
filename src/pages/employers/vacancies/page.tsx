import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DashboardLayout from "../../../components/Templates/DashboardLayout";
import { grey, lightBlue, red } from "@mui/material/colors";
import {
  AddRounded,
  BadgeRounded,
  BlockRounded,
  Business,
  CloseRounded,
  DeleteRounded,
  FiberManualRecordRounded,
  FoundationRounded,
  LinearScaleRounded,
  LocationOnRounded,
  MeetingRoomRounded,
  MonetizationOnRounded,
  MoreVert,
  Place,
  SearchRounded,
  SortRounded,
  UpdateRounded,
  Visibility,
  WorkspacePremiumRounded,
} from "@mui/icons-material";
import SimpleEmphasis from "../../../components/Molecules/Texts/SimpleEmphasis";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { EmployerTypeStyler, SLAConverter, SLADaysRemaining } from "../helpers";
import { GetSession, onCloseSnackbar } from "../../global-helpers";
import { VacancyFormSchema, VacancyFormType, VacancyType } from "../types";
import RequestAPI from "../../../services/api/request";
import { DEFAULT_VACANCY_FORM, EMPLOYEE_TYPE, LINE_INDUSTRY, MIN_EXPERIENCE, WORK_ARRANGEMENT } from "../constants";
import VacancyForm from "../../../components/Organisms/employers/vacancies/VacancyForm";
import { HOST } from "../../administrators/performance/[id]/constants";
import dayjs from "dayjs";
import "dayjs/locale/id"
import { useDebounce } from "use-debounce";

dayjs.locale("id")

export default function EmployerVacancies() {
  /* react-router */
  const navigate = useNavigate();
  const URLLocation = useLocation();
  /* breakpoint */
  const xsmall = useMediaQuery("(max-width: 600px)");
  const small = useMediaQuery("(max-width: 900px)");
  /* state */
  const [vacancies, setVacancies] = useState<VacancyType[]>([]);
  const [vacanciesCount, setVacanciesCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewedVacancy, setViewedVacancy] = useState<VacancyType | null>(null);
  const [selectedVacancyID, setSelectedVacancyID] = useState<{ id: string; is_inactive?: boolean }>({ id: "" });
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const [filterCheck, setFilterCheck] = useState<Record<string, string>>({
    "line_industry": "",
    "employee_type": "",
    "min_experience": "",
    "work_arrangement": ""
  });
  const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({});
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" });
  const [dataAction, setDataAction] = useState<boolean>(false);
  // state -> Vacancy Form
  const [formValue, setFormValue] = useState<VacancyFormType>(DEFAULT_VACANCY_FORM);
  const [errMsg, setErrMsg] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState<boolean>(false);

  /* event handler */
  const optionsOnClick = (key: string, event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(prev => ({
      ...prev,
      [key]: event.currentTarget
    }));
  };
  const onPageChange = (_: ChangeEvent<any>, pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const validate = VacancyFormSchema.safeParse(formValue);
    if (!validate.success) {
      setLoading(false);
      const errSchema = validate.error.flatten().fieldErrors;
      setErrMsg(errSchema);
      return setAlert({ show: true, message: "please follow the form rules!" });
    } else {
      setErrMsg({});
    };

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.FormDataRequest(formValue).Send<string>(
      "/employers/vacancies/" + selectedVacancyID.id,
      {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(false);
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(false);
      setDataAction(prev => !prev);
      setOpenDialog(prev => ({ ...prev, ["vacancy-update"]: false }));
      return setAlert({ show: true, message: success });
    };
  };
  const onDisable = async () => {
    setLoading(true);
    const token = GetSession("auth");

    const value = !selectedVacancyID?.is_inactive
    const [success, fail] = await RequestAPI.FormDataRequest({
      is_inactive: value,
      sla: value ? 0 : 168,
    }).Send<string>(
      "/employers/vacancies/" + selectedVacancyID.id,
      {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(false);
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(false);
      setDataAction(prev => !prev);
      setOpenDialog(prev => ({ ...prev, ["vacancy-disable"]: false }));
      return setAlert({ show: true, message: success });
    };
  };
  const onDelete = async () => {
    setLoading(true);
    const token = GetSession("auth");

    const [success, fail] = await RequestAPI.Send<string>(
      "/employers/vacancies/" + selectedVacancyID.id,
      {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(false);
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(false);
      setDataAction(prev => !prev);
      setAnchorEl(prev => ({ ...prev, ["vacancy-option"]: null }));
      setOpenDialog(prev => ({ ...prev, ["vacancy-delete"]: false }));
      return setAlert({ show: true, message: success });
    };
  };

  /* constants */
  const totalPage = Math.ceil(vacanciesCount / 10);

  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<{ arr: VacancyType[]; count: number; }>(
        "/employers/vacancies/?page=" + currentPage +
        "&keyword=" + debouncedSearch +
        "&line_industry=" + filterCheck["line_industry"] +
        "&employee_type=" + filterCheck["employee_type"] +
        "&min_experience=" + filterCheck["min_experience"] +
        "&work_arrangement=" + filterCheck["work_arrangement"],
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
        setVacancies(data.arr);
        setVacanciesCount(data.count);
      };
    })();
  }, [dataAction, debouncedSearch, filterCheck, currentPage]);
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
      {/* Search Panel */}
      <Box
        component={"div"}
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          rowGap: {
            xs: "0.5em",
            md: 0,
          },
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 550, color: grey[800] }}
        >
          Kelola Lowongan Pekerjaan
        </Typography>
        <Box
          component={"div"}
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "end",
            columnGap: "0.5em",
          }}
        >
          <TextField
            type="text"
            name="vacancies-search"
            placeholder="Cari lowongan pekerjaan"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                minWidth: {
                  xs: "auto",
                  md: "20em",
                },
                fontSize: "small",
              },
            }}
            value={search}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              (() => {
                setCurrentPage(1);
                setSearch(event.target.value);
              })();
            }}
          />
          <Button
            variant="outlined"
            startIcon={!small && <SortRounded />}
            sx={{
              fontSize: "small",
            }}
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              optionsOnClick("filters", event)
            }}
          >
            {small ? <SortRounded /> : "Filters"}
          </Button>
          <Button
            variant="contained"
            startIcon={!small && <AddRounded />}
            sx={{ fontSize: "small" }}
            onClick={() => {
              navigate(location.pathname.replace("/future-interns-app", "") + "/create")
            }}
          >
            {small ? <AddRounded /> : "Lowongan Pekerjaan"}
          </Button>
        </Box>
      </Box>
      <Box component={"div"} sx={{ marginTop: "1em" }}>
        {small ? (
          vacancies.map((vacancy, index) => (
            <Box
              key={index}
              component={"div"}
              sx={{
                border: "1px solid " + grey[400],
                borderRadius: "0.3em",
                marginBottom: "0.5em",
              }}
            >
              <Box
                component={"div"}
                sx={{ display: "flex", alignItems: "center", padding: "0.5em" }}
              >
                <Typography
                  component={"span"}
                  variant="subtitle1"
                  sx={{ fontWeight: 550, color: grey[800] }}
                >
                  {vacancy.position}
                </Typography>
                <Chip
                  size="small"
                  label={vacancy.employee_type}
                  sx={{
                    backgroundColor: lightBlue[50],
                    color: lightBlue[500],
                    marginX: "1em",
                  }}
                />
              </Box>
              <Box
                component={"div"}
                sx={{ marginTop: "0.5em", paddingX: "0.5em" }}
              >
                <Typography
                  component={"p"}
                  variant="caption"
                  sx={{ color: grey[600] }}
                >
                  Posted on <SimpleEmphasis text={new Date(vacancy.created_at).toDateString()} />
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 400, color: grey[600] }}
                >
                  Inactive on{" "}
                  <SimpleEmphasis
                    text={SLAConverter(vacancy.sla, vacancy.created_at).toDateString()}
                    textColor={red[200]}
                  />
                </Typography>
              </Box>
              <Divider
                orientation="horizontal"
                sx={{ borderColor: grey[400], marginY: "0.5em" }}
              />
              <Box
                component={"div"}
                sx={{ display: "flex", columnGap: "0.5em", padding: "0.5em" }}
              >
                <Button
                  variant="outlined"
                  startIcon={<Visibility />}
                  size="small"
                  fullWidth
                  onClick={() => {
                    setViewedVacancy(vacancy);
                    setOpenDialog(prev => ({ ...prev, ["view-detail"]: true }));
                  }}
                >
                  View
                </Button>
                <IconButton size="small" onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  optionsOnClick("vacancy-option", event);
                  setSelectedVacancyID({ id: vacancy.id, is_inactive: vacancy.is_inactive });
                  setFormValue(vacancy);
                }}>
                  <MoreVert />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Box component={"div"}>
            {/* Vacancy Title Head */}
            <Box
              component={"div"}
              sx={{
                display: "flex",
                columnGap: "0.5em",
                padding: "0.5em",
                borderBottom: "1px solid " + grey[300],
              }}
            >
              <Box
                component={"div"}
                className="column"
                sx={{ flexBasis: "30%" }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[500] }}
                >
                  Posisi Pekerjaan
                </Typography>
              </Box>
              <Box
                component={"div"}
                className="column"
                sx={{ flexBasis: "20%" }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[500] }}
                >
                  Tanggal dibuat
                </Typography>
              </Box>
              <Box
                component={"div"}
                className="column"
                sx={{ flexBasis: "20%" }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[500] }}
                >
                  Berakhir dalam
                </Typography>
              </Box>
              <Box
                component={"div"}
                className="column"
                sx={{ flexBasis: "20%" }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[500] }}
                >
                  Jenis Kepegawaian
                </Typography>
              </Box>
              <Box
                component={"div"}
                className="column"
                sx={{ flexBasis: "10%" }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[500] }}
                >
                  Opsi
                </Typography>
              </Box>
            </Box>
            {/* Vacancy Row Data */}
            <Box
              component={"div"}
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "0.3em",
                marginTop: "0.5em",
              }}
            >
              {vacancies.map((vacancy, index) => (
                <Box
                  key={index}
                  component={"div"}
                  sx={{
                    display: "flex",
                    columnGap: "0.5em",
                    paddingY: "1em",
                    paddingX: "0.5em",
                    border: "1px solid " + grey[200],
                    // backgroundColor: grey[100],
                    borderRadius: "0.3em",
                    ":hover": {
                      backgroundColor: grey[200],
                    },
                  }}
                >
                  <Box component={"div"} sx={{ flexBasis: "30%" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 550, color: grey[800] }}
                    >
                      {vacancy.position}
                    </Typography>
                    {vacancy.is_inactive && (
                      <Chip label="Tidak lagi aktif" color="error" size="small" sx={{ fontSize: "x-small" }} />
                    )}
                  </Box>
                  <Box component={"div"} sx={{ flexBasis: "20%" }}>
                    <Typography
                      variant="caption"
                      component={"p"}
                      sx={{
                        color: "#06816d",
                        fontWeight: 550,
                      }}
                    >
                      {dayjs(vacancy.created_at).format("dddd, D MMMM YYYY")}
                    </Typography>
                  </Box>
                  <Box component={"div"} sx={{ flexBasis: "20%" }}>
                    <Typography
                      variant="caption"
                      component={"p"}
                      sx={{
                        color: red[300],
                        fontWeight: 500,
                        fontStyle: "italic",
                      }}
                    >
                      {SLADaysRemaining(vacancy.sla)}
                    </Typography>
                  </Box>
                  <Box component={"div"} sx={{ flexBasis: "20%" }}>
                    <Chip
                      size="small"
                      label={vacancy.employee_type}
                      sx={{
                        backgroundColor: EmployerTypeStyler(vacancy.employee_type).backgroundColor,
                        color: EmployerTypeStyler(vacancy.employee_type).color,
                      }}
                    />
                  </Box>
                  <Box
                    component={"div"}
                    sx={{
                      flexBasis: "10%",
                      display: "flex",
                      columnGap: "0.5em",
                    }}
                  >
                    <Button
                      variant="text"
                      startIcon={<Visibility fontSize="small" />}
                      size="small"
                      onClick={() => {
                        setViewedVacancy(vacancy);
                        setOpenDialog(prev => ({ ...prev, ["view-detail"]: true }));
                      }}
                    >
                      Lihat
                    </Button>
                    <IconButton size="small" onClick={(event: MouseEvent<HTMLButtonElement>) => {
                      optionsOnClick("vacancy-option", event);
                      setSelectedVacancyID({ id: vacancy.id, is_inactive: vacancy.is_inactive });
                      setFormValue(vacancy);
                    }}>
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        <Pagination
          color="primary"
          count={totalPage} // total pages
          onChange={onPageChange}
          page={currentPage} // the current page
          sx={{
            display: "flex",
            justifyContent: "end",
            marginY: "2em",
          }}
        />
      </Box>
      {/* Vacancy Filters Menu */}
      <Menu
        anchorEl={anchorEl["filters"]}
        open={Boolean(anchorEl["filters"])}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        onClose={() => setAnchorEl(prev => ({ ...prev, ["filters"]: null }))}
        slotProps={{
          paper: {
            sx: {
              minWidth: "10em",
              border: "1px solid " + grey[400],
              boxShadow: "none",
              marginTop: "0.5em"
            },
          },
        }}
      >
        <Box component={"div"} sx={{ display: { xs: "block", md: "flex" } }}>
          <Box component={"div"}>
            <Typography component={"p"} variant="subtitle2" sx={{ fontWeight: 550, color: grey[700], paddingX: "0.5em" }}>Sektor Industri</Typography>
            {LINE_INDUSTRY.map((value, index) => {
              return (
                <MenuItem key={index} dense>
                  <FormControlLabel
                    label={<Typography component={"p"} variant="subtitle2" sx={{ color: grey[500] }}>{value}</Typography>}
                    control={<Checkbox size="small" checked={filterCheck["line_industry"] === value} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setFilterCheck(prev => ({ ...prev, ["line_industry"]: event.target.checked ? value : "" }))
                    }} />}
                  />
                </MenuItem>
              )
            })}
          </Box>
          <Box component={"div"}>
            <Typography component={"p"} variant="subtitle2" sx={{ fontWeight: 550, color: grey[700], paddingX: "0.5em" }}>Status Kepegawaian</Typography>
            {EMPLOYEE_TYPE.map((value, index) => {
              return (
                <MenuItem key={index} dense>
                  <FormControlLabel
                    label={<Typography component={"p"} variant="subtitle2" sx={{ color: grey[500] }}>{value}</Typography>}
                    control={<Checkbox size="small" checked={filterCheck["employee_type"] === value} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setFilterCheck(prev => ({ ...prev, ["employee_type"]: event.target.checked ? value : "" }))
                    }} />}
                  />
                </MenuItem>
              )
            })}
          </Box>
          <Box component={"div"}>
            <Typography component={"p"} variant="subtitle2" sx={{ fontWeight: 550, color: grey[700], paddingX: "0.5em" }}>Pengalaman Kerja Minimum</Typography>
            {MIN_EXPERIENCE.map((value, index) => {
              return (
                <MenuItem key={index} dense>
                  <FormControlLabel
                    label={<Typography component={"p"} variant="subtitle2" sx={{ color: grey[500] }}>{value}</Typography>}
                    control={<Checkbox size="small" checked={filterCheck["min_experience"] === value} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setFilterCheck(prev => ({ ...prev, ["min_experience"]: event.target.checked ? value : "" }))
                    }} />}
                  />
                </MenuItem>
              )
            })}
          </Box>
          <Box component={"div"}>
            <Typography component={"p"} variant="subtitle2" sx={{ fontWeight: 550, color: grey[700], paddingX: "0.5em" }}>Pengaturan Kerja</Typography>
            {WORK_ARRANGEMENT.map((value, index) => {
              return (
                <MenuItem key={index} dense>
                  <FormControlLabel
                    label={<Typography component={"p"} variant="subtitle2" sx={{ color: grey[500] }}>{value}</Typography>}
                    control={<Checkbox size="small" checked={filterCheck["work_arrangement"] === value} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setFilterCheck(prev => ({ ...prev, ["work_arrangement"]: event.target.checked ? value : "" }))
                    }} />}
                  />
                </MenuItem>
              )
            })}
          </Box>
        </Box>
        <Box component={"div"}>
          <Button variant="text" color="error" fullWidth onClick={() => setFilterCheck({
            "line_industry": "",
            "employee_type": "",
            "min_experience": "",
            "work_arrangement": ""
          })}>Atur ulang filter</Button>
        </Box>
      </Menu>
      {/* Vacancy Menu Options */}
      <Menu
        open={Boolean(anchorEl["vacancy-option"])}
        anchorEl={anchorEl["vacancy-option"]}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        onClose={() => setAnchorEl(prev => ({ ...prev, ["vacancy-option"]: null }))}
        slotProps={{
          paper: {
            sx: {
              minWidth: "10em",
              border: "1px solid " + grey[400],
              boxShadow: "none",
            },
          },
        }}
        MenuListProps={{
          sx: {},
        }}
        sx={{
          ".MuiMenuItem-root": {
            ":hover": {
              color: "#06816d",
              backgroundColor: grey[200],
            },
            ":hover > .MuiListItemIcon-root": {
              color: "#06816d",
            },
          },
          ".MuiMenuItem-root:nth-of-type(4)": {
            ":hover": {
              color: red[400],
            },
            ":hover > .MuiListItemIcon-root": {
              color: red[400],
            },
          },
        }}
      >
        {/* Piepeline */}
        <MenuItem
          sx={{ color: grey[600] }}
          onClick={() => {
            navigate(URLLocation.pathname + "/" + selectedVacancyID.id + "/pipeline");
          }}
          disabled={selectedVacancyID.is_inactive}
        >
          <ListItemIcon>
            <LinearScaleRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Tahapan Seleksi"
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "small",
                fontWeight: 550,
              },
            }}
          />
        </MenuItem>
        {/* Update */}
        <MenuItem sx={{ color: grey[600] }}
          onClick={() => {
            setOpenDialog(prev => ({ ...prev, ["vacancy-update"]: true }));
          }}
        >
          <ListItemIcon>
            <UpdateRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Ubah Data"
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "small",
                fontWeight: 550,
              },
            }}
          />
        </MenuItem>
        {/* Disable */}
        <MenuItem sx={{ color: grey[600] }}
          onClick={() => {
            setOpenDialog(prev => ({ ...prev, ["vacancy-disable"]: true }));
          }}
          disabled={loading}
        >
          <ListItemIcon>
            {selectedVacancyID?.is_inactive ? (<FiberManualRecordRounded fontSize="small" />) : (<BlockRounded fontSize="small" />)}
          </ListItemIcon>
          <ListItemText
            primary={selectedVacancyID?.is_inactive ? "Reaktivasi" : "Nonaktifkan"}
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "small",
                fontWeight: 550,
              },
            }}
          />
        </MenuItem>
        {/* Delete */}
        <MenuItem sx={{ color: red[200] }}
          onClick={() => setOpenDialog(prev => ({ ...prev, ["vacancy-delete"]: true }))}
        >
          <ListItemIcon sx={{ color: red[200] }}>
            <DeleteRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Hapus Data"
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "small",
                fontWeight: 550,
              },
            }}
          />
        </MenuItem>
      </Menu>
      {/* View Detail Vacancy in Dialog */}
      <Dialog
        open={Boolean(openDialog["view-detail"])}
        maxWidth="lg"
        fullWidth
        fullScreen={xsmall}
      >
        <Box
          component={"div"}
          sx={{
            display: "flex",
            justifyContent: "end",
            paddingTop: "0.5em",
            paddingX: "1em",
          }}
        >
          <IconButton onClick={() => setOpenDialog(prev => ({ ...prev, ["view-detail"]: false }))}>
            <CloseRounded />
          </IconButton>
        </Box>
        <Grid container sx={{
          marginBottom: "2.5em"
        }}>
          <Grid item xs={12} lgTablet={8}>
            <Box component={"div"} sx={{ margin: "0.5em" }}>
              <Box
                component={"div"}
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  gap: "0 1em",
                  paddingLeft: "1em",
                }}
              >
                <Avatar
                  alt="company-logo"
                  src={`${HOST.main}${viewedVacancy?.employer.profile_image_path.replace("/api/v1", "")}`}
                  sx={{
                    width: small ? "4em" : "5em",
                    height: small ? "4em" : "5em",
                  }}
                />
                <Box component={"div"}>
                  <Typography
                    variant={small ? "subtitle2" : "h6"}
                    sx={{
                      fontWeight: 550,
                      color: grey[800],
                    }}
                  >
                    {viewedVacancy?.position}
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: "0 1.5em" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "end",
                      }}
                    >
                      <Business fontSize="small" sx={{ color: "#06816d" }} />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: small ? 500 : 550,
                          color: grey[600],
                          marginLeft: "0.5em",
                        }}
                      >
                        {viewedVacancy?.employer.legal_name}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "end",
                      }}
                    >
                      <Place fontSize="small" sx={{ color: "#06816d" }} />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: small ? 500 : 550,
                          color: grey[600],
                          marginLeft: "0.5em",
                        }}
                      >
                        {viewedVacancy?.employer.location}, Indonesia
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box component={"div"} sx={{ padding: "1em" }}>
                <Stack
                  direction={"column"}
                  spacing={2}
                  sx={{ marginY: "0.5em" }}
                >
                  {/* decription */}
                  <Box component={"div"}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 550, color: grey[800] }}
                    >
                      Tentang Perusahaan
                    </Typography>
                    <Typography variant="body1" sx={{ color: grey[600], whiteSpace: "pre-line" }}>
                      {viewedVacancy?.description}
                    </Typography>
                  </Box>
                  {/* qualification */}
                  <Box component={"div"}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 550, color: grey[800] }}
                    >
                      Kualifikasi
                    </Typography>
                    <Typography variant="body1" sx={{ color: grey[600], whiteSpace: "pre-line" }}>
                      {viewedVacancy?.qualification}
                    </Typography>
                  </Box>
                  {/* responsibility */}
                  <Box component={"div"}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 550, color: grey[800] }}
                    >
                      Tugas dan Tanggung Jawab
                    </Typography>
                    <Typography variant="body1" sx={{ color: grey[600], whiteSpace: "pre-line" }}>
                      {viewedVacancy?.responsibility}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Grid>
          {/* Job Information */}
          <Grid item xs={12} lgTablet={4}>
            <Box
              component={"div"}
              sx={{ margin: "0.5em", paddingRight: "1em" }}
            >
              <Typography
                component={"p"}
                variant="subtitle1"
                sx={{
                  fontWeight: 550,
                  marginBottom: "0.5em",
                }}
              >
                Informasi Posisi Pekerjaan
              </Typography>
              <Stack
                direction={"column"}
                spacing={2}
                sx={{
                  padding: "1em",
                  border: "1px solid " + grey[300],
                  borderRadius: "0.3em",
                }}
              >
                <Box
                  component={"div"}
                  sx={{ display: "flex", columnGap: "0.5em" }}
                >
                  <FoundationRounded />
                  <Box component={"div"}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                      Sektor Industri
                    </Typography>
                    <Typography variant="caption">
                      {viewedVacancy?.line_industry}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  component={"div"}
                  sx={{ display: "flex", columnGap: "0.5em" }}
                >
                  <LocationOnRounded />
                  <Box component={"div"}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                      Lokasi Perusahaan
                    </Typography>
                    <Typography variant="caption">
                      {viewedVacancy?.employer.location}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  component={"div"}
                  sx={{ display: "flex", columnGap: "0.5em" }}
                >
                  <BadgeRounded />
                  <Box component={"div"}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                      Status Kepegawaian
                    </Typography>
                    <Typography variant="caption">
                      {viewedVacancy?.employee_type}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  component={"div"}
                  sx={{ display: "flex", columnGap: "0.5em" }}
                >
                  <WorkspacePremiumRounded />
                  <Box component={"div"}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                      Pengalaman Kerja Minimum
                    </Typography>
                    <Typography variant="caption">
                      {viewedVacancy?.min_experience}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  component={"div"}
                  sx={{ display: "flex", columnGap: "0.5em" }}
                >
                  <MonetizationOnRounded />
                  <Box component={"div"}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                      Gaji
                    </Typography>
                    <Typography variant="caption">
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(viewedVacancy?.salary as number)}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  component={"div"}
                  sx={{ display: "flex", columnGap: "0.5em" }}
                >
                  <MeetingRoomRounded />
                  <Box component={"div"}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                      Pengaturan Kerja
                    </Typography>
                    <Typography variant="caption">
                      {viewedVacancy?.work_arrangement}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Dialog>
      {/* Vacancy Update Dialog */}
      <Dialog
        open={Boolean(openDialog["vacancy-update"])}
        maxWidth="lg"
        fullWidth
        fullScreen={xsmall}
        PaperProps={{
          sx: {
            padding: "1.5em"
          }
        }}
      >
        <Box component={"div"}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1em",
          }}
        >
          <Typography component={"div"} variant="subtitle1"
            sx={{
              fontWeight: 550,
              color: grey[700]
            }}
          >
            Ubah Data Lowongan Pekerjaan
          </Typography>
          <IconButton size="small"
            onClick={() => {
              setOpenDialog(prev => ({ ...prev, ["vacancy-update"]: false }))
            }}
          >
            <CloseRounded fontSize="small" />
          </IconButton>
        </Box>
        {/* Vacancy Form */}
        <VacancyForm
          formValue={formValue}
          setFormValue={setFormValue}
          onSubmit={onSubmit}
          errMsg={errMsg}
          loading={loading}
        />
      </Dialog>
      {/* Vacancy Disable Dialog */}
      <Dialog
        open={Boolean(openDialog["vacancy-disable"])}
        maxWidth="sm"
        PaperProps={{
          sx: {
            marginTop: "-20em",
            padding: "1em"
          }
        }}
        fullWidth
      >
        <Box component={"div"}>
          <Typography component={"div"} variant="subtitle1"
            sx={{
              marginBottom: "1em",
              fontWeight: 550,
              color: "#06816d"
            }}
          >
            Catatan
          </Typography>
          <Typography component={"div"} variant="subtitle2">
            {selectedVacancyID?.is_inactive ? (
              <>
                Setelah <SimpleEmphasis text={" diaktifkan"} />, lowongan ini akan terlihat dan dapat diakses oleh kandidat pada halaman utama dan hasil pencarian.
              </>
            ) : (
              <>
                Setelah <SimpleEmphasis text={" dinonaktifkan"} textColor="red" />, lowongan ini tidak akan lagi terlihat atau dapat diakses oleh kandidat pada halaman utama maupun hasil pencarian.
              </>
            )}
          </Typography>
        </Box>
        <Box component={"div"}
          sx={{
            marginTop: "2em",
            display: "flex",
            justifyContent: "end",
            columnGap: "1em",
          }}
        >
          <Button
            variant="text"
            color="secondary"
            size="small"
            onClick={() => {
              setOpenDialog(prev => ({ ...prev, ["vacancy-disable"]: false }));
            }}
          >
            Batalkan
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            endIcon={loading && <CircularProgress size={20} />}
            disabled={loading}
            onClick={() => {
              onDisable();
            }}
          >
            Setuju dan lanjutkan
          </Button>
        </Box>
      </Dialog>
      {/* Vacancy Delete Dialog */}
      <Dialog
        open={Boolean(openDialog["vacancy-delete"])}
        maxWidth="sm"
        PaperProps={{
          sx: {
            marginTop: "-20em",
            padding: "1em"
          }
        }}
        fullWidth
      >
        <Box component={"div"}>
          <Typography component={"div"} variant="subtitle1"
            sx={{
              marginBottom: "1em",
              fontWeight: 550,
              color: "#06816d"
            }}
          >
            Catatan
          </Typography>
          <Typography component={"div"} variant="subtitle2">
            Menghapus lowongan ini akan <SimpleEmphasis text={" secara permanen menghapus "} textColor="red" /> semua data terkait, termasuk proses seleksi, <span style={{ fontStyle: "italic" }}>screening</span>, <span style={{ fontStyle: "italic" }}>assessments</span>, <span style={{ fontStyle: "italic" }}>interviews</span>, dan <span style={{ fontStyle: "italic" }}>offering</span> yang terhubung dengannya.
          </Typography>
        </Box>
        <Box component={"div"}
          sx={{
            marginTop: "2em",
            display: "flex",
            justifyContent: "end",
            columnGap: "1em",
          }}
        >
          <Button
            variant="text"
            color="secondary"
            size="small"
            onClick={() => {
              setOpenDialog(prev => ({ ...prev, ["vacancy-delete"]: false }));
            }}
          >
            Batalkan
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            endIcon={loading && <CircularProgress size={20} />}
            disabled={loading}
            onClick={() => {
              onDelete();
            }}
          >
            Setuju dan lanjutkan
          </Button>
        </Box>
      </Dialog>
    </DashboardLayout>
  );
}
