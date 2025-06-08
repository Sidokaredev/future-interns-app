import { Box, Button, CircularProgress, Dialog, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import DashboardLayout from "../../../../components/Templates/DashboardLayout";
// import BreadcrumbsCreator from "../../helpers";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowBackRounded } from "@mui/icons-material";
import { grey, red } from "@mui/material/colors";
import { DEFAULT_VACANCY_FORM, EMPLOYEE_TYPE, LINE_INDUSTRY, MIN_EXPERIENCE, WORK_ARRANGEMENT } from "../../constants";
import { ChangeEvent, useState } from "react";
import SimpleEmphasis from "../../../../components/Molecules/Texts/SimpleEmphasis";
import { VacancyFormSchema, VacancyFormType } from "../../types";
import { GetSession, InputOnChangeV2, onCloseSnackbar, SelectOnChange } from "../../../global-helpers";
import RequestAPI from "../../../../services/api/request";

export default function VacanciesCreate() {
  /* react-router */
  const navigate = useNavigate();
  const location = useLocation();
  // const urlParams = useParams();
  /* state */
  const [formValue, setFormValue] = useState<VacancyFormType>(DEFAULT_VACANCY_FORM);
  const [errMsg, setErrMsg] = useState<{ [key: string]: string[] }>({});
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" });
  /* handler */
  const onCloseDialog = () => {
    setOpenDialog(false);
  };
  const goBack = (pathname: string) => {
    const splittedPath = pathname.split("/");
    splittedPath.splice(splittedPath.length - 1, 1)
    return navigate(splittedPath.join("/"));
  };
  /* onSubmit */
  const onSubmit = async () => {
    setLoading(true);

    const validate = VacancyFormSchema.safeParse(formValue);
    if (!validate.success) {
      setLoading(false);
      const errSchema = validate.error.flatten().fieldErrors;
      return setErrMsg(errSchema);
    } else {
      setErrMsg({});
    };

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.FormDataRequest<VacancyFormType>(formValue).Send<string>(
      "/employers/vacancies/",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        },
      }
    );
    if (fail) {
      setLoading(false);
      onCloseDialog();
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(false);
      onCloseDialog();
      setAlert({ show: true, message: success });
      return goBack(location.pathname);
    };
  };
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
      {/* <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: "1em" }}>
        {BreadcrumbsCreator(
          urlParams as Record<string, string>,
          location.pathname
        ).map((data, index) => (
          <Link
            key={index}
            component={RouterLink}
            to={data.pathname}
            underline="hover"
            color="inherit"
            aria-current={
              data.pathname === location.pathname ? "page" : undefined
            }
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
                {"Vacancy " + data.label}
              </Typography>
            )}
          </Link>
        ))}
      </Breadcrumbs> */}
      {/* Vacancy Form */}
      <Box component={"div"}>
        <Box component={"div"}
          sx={{
            marginTop: "0.5em",
            marginBottom: "1em",
            display: "flex",
            columnGap: "0.5em",
            alignItems: "center",
          }}
        >
          <IconButton size="small"
            onClick={() => {
              goBack(location.pathname)
            }}
          >
            <ArrowBackRounded fontSize="small" />
          </IconButton>
          <Typography component={"p"} variant="subtitle1"
            sx={{
              fontWeight: 550,
              color: grey[700],
            }}
          >
            Buat Data Lowongan Pekerjaan
          </Typography>
        </Box>
        <Grid container
          columnSpacing={2}
          rowSpacing={2}
        >
          <Grid item xs={12} sm={4}>
            <TextField
              type="text"
              name="position"
              label="Posisi Pekerjaan"
              placeholder="e.g. Software Engineer"
              size="small"
              autoComplete="off"
              fullWidth
              value={formValue.position}
              error={Boolean(errMsg["position"])}
              helperText={errMsg["position"]}
              onChange={InputOnChangeV2(setFormValue)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="line_industry_label"
                size="small"
                sx={{
                  color: errMsg["line_industry"] ? red[500] : undefined,
                  "&.Mui-focused": {
                    color: errMsg["line_industry"] ? red[500] : undefined,
                  }
                }}
              >
                Sektor Industri
              </InputLabel>
              <Select
                labelId="line_indsutry_label"
                name="line_industry"
                label="Sektor Industri"
                size="small"
                value={formValue.line_industry}
                onChange={SelectOnChange(setFormValue, undefined, { coerceToNumber: false })}
                error={Boolean(errMsg["line_industry"])}
              >
                {LINE_INDUSTRY.map((option, index) => {
                  return (
                    <MenuItem
                      key={index}
                      value={option}
                    >
                      <Typography variant="subtitle2">
                        {option}
                      </Typography>
                    </MenuItem>
                  )
                })}
              </Select>
              {errMsg["line_industry"] && (
                <FormHelperText sx={{ color: red[500] }}>{errMsg["line_industry"]}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="employee_type_label"
                size="small"
                sx={{
                  color: errMsg["employee_type"] ? red[500] : undefined,
                  "&.Mui-focused": {
                    color: errMsg["employee_type"] ? red[500] : undefined,
                  }
                }}
              >
                Status Kepegawaian
              </InputLabel>
              <Select
                labelId="employee_type_label"
                name="employee_type"
                label="Status Kepegawaian"
                size="small"
                value={formValue.employee_type}
                onChange={SelectOnChange(setFormValue, undefined, { coerceToNumber: false })}
                error={Boolean(errMsg["employee_type"])}
              >
                {EMPLOYEE_TYPE.map((option, index) => {
                  return (
                    <MenuItem
                      key={index}
                      value={option}
                    >
                      <Typography variant="subtitle2">
                        {option}
                      </Typography>
                    </MenuItem>
                  )
                })}
              </Select>
              {errMsg["employee_type"] && (
                <FormHelperText sx={{ color: red[500] }}>{errMsg["employee_type"]}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="work_arrangement_label"
                size="small"
                sx={{
                  color: errMsg["work_arrangement"] ? red[500] : undefined,
                  "&.Mui-focused": {
                    color: errMsg["work_arrangement"] ? red[500] : undefined,
                  }
                }}
              >
                Pengaturan Kerja
              </InputLabel>
              <Select
                labelId="work_arrangement_label"
                name="work_arrangement"
                label="Pengaturan Kerja"
                size="small"
                value={formValue.work_arrangement}
                onChange={SelectOnChange(setFormValue, undefined, { coerceToNumber: false })}
                error={Boolean(errMsg["work_arrangement"])}
              >
                {WORK_ARRANGEMENT.map((option, index) => {
                  return (
                    <MenuItem
                      key={index}
                      value={option}
                    >
                      <Typography variant="subtitle2">
                        {option}
                      </Typography>
                    </MenuItem>
                  )
                })}
              </Select>
              {errMsg["work_arrangement"] && (
                <FormHelperText sx={{ color: red[500] }}>{errMsg["work_arrangement"]}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="min_experience_label"
                size="small"
                sx={{
                  color: errMsg["min_experience"] ? red[500] : undefined,
                  "&.Mui-focused": {
                    color: errMsg["min_experience"] ? red[500] : undefined,
                  }
                }}
              >
                Pengalaman Kerja Minimum
              </InputLabel>
              <Select
                labelId="min_experience_label"
                name="min_experience"
                label="Pengalaman Kerja Minimum"
                size="small"
                value={formValue.min_experience}
                onChange={SelectOnChange(setFormValue, undefined, { coerceToNumber: false })}
                error={Boolean(errMsg["min_experience"])}
              >
                {MIN_EXPERIENCE.map((option, index) => {
                  return (
                    <MenuItem
                      key={index}
                      value={option}
                    >
                      <Typography variant="subtitle2">
                        {option}
                      </Typography>
                    </MenuItem>
                  )
                })}
              </Select>
              {errMsg["min_experience"] && (
                <FormHelperText sx={{ color: red[500] }}>{errMsg["min_experience"]}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              type="text"
              name="salary"
              label="Gaji"
              size="small"
              autoComplete="off"
              fullWidth
              value={new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(formValue.salary)}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                let rawValue: any = event.target.value.replace(/[^\d]/g, "");
                rawValue = parseInt(rawValue, 10);
                rawValue = `${rawValue.toString().slice(0, rawValue.toString().length - 3)}${rawValue.toString().slice(-1)}`;
                const numericValue = parseInt(rawValue, 10);
                setFormValue(prev => ({
                  ...prev,
                  [event.target.name]: numericValue
                }));
              }}
              helperText={errMsg["salary"]}
              FormHelperTextProps={{
                sx: {
                  color: "red"
                }
              }}
              InputProps={{
                sx: {
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: errMsg["salary"] ? "red" : undefined
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: errMsg["salary"] ? "red" : undefined
                  }
                }
              }}
              InputLabelProps={{
                sx: {
                  color: errMsg["salary"] ? "red" : undefined,
                  "&.Mui-focused": {
                    color: errMsg["salary"] ? "red" : undefined
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="description"
              label="Deskripsi Pekerjaan"
              placeholder="Deskripsikan uraian pekerjaan pada posisi tersebut"
              size="small"
              autoComplete="off"
              rows={4}
              fullWidth
              multiline
              value={formValue.description}
              error={Boolean(errMsg["description"])}
              helperText={errMsg["description"]}
              onChange={InputOnChangeV2(setFormValue)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="responsibility"
              label="Tanggung Jawab Pekerjaan"
              placeholder="Buat daftar tugas dan tanggung jawab pada posisi tersebut"
              size="small"
              autoComplete="off"
              rows={6}
              fullWidth
              multiline
              value={formValue.responsibility}
              error={Boolean(errMsg["responsibility"])}
              helperText={errMsg["responsibility"]}
              onChange={InputOnChangeV2(setFormValue)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="qualification"
              label="Kualifikasi Pekerjaan"
              placeholder="Buat daftar kualifikasi yang dibutuhkan untuk posisi tersebut"
              size="small"
              autoComplete="off"
              rows={6}
              fullWidth
              multiline
              value={formValue.qualification}
              error={Boolean(errMsg["qualification"])}
              helperText={errMsg["qualification"]}
              onChange={InputOnChangeV2(setFormValue)}
            />
          </Grid>
          <Grid item xs={12}>
            <Box component={"div"}
              sx={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Button
                variant="contained"
                size="small"
                sx={{
                  minWidth: "10em",
                }}
                onClick={() => setOpenDialog(true)}
              >
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* SLA confirmation */}
      <Dialog
        open={openDialog}
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
            Harap diperhatikan bahwa lowongan pekerjaan ini hanya akan aktif selama <SimpleEmphasis text={" 7 hari"} />. Setelah periode tersebut, lowongan akan otomatis <SimpleEmphasis text={" dinonaktifkan"} textColor={red[500]} />.
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
              onCloseDialog();
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
              onSubmit();
            }}
          >
            Setuju dan lanjutkan
          </Button>
        </Box>
      </Dialog>
    </DashboardLayout>
  )
}