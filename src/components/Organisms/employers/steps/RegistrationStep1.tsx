import { NavigateNextRounded, UploadRounded } from "@mui/icons-material";
import { Avatar, Box, Button, CircularProgress, FormControl, FormHelperText, Grid, InputBase, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { DatePicker } from "@mui/x-date-pickers";
import { FormEvent, useState } from "react";
import { EmployerProfileFormSchema, EmployerProfileFormType } from "../../../../pages/employers/types";
import { DEFAULT_EMPLOYER_FORM } from "../../../../pages/employers/constants";
import { FileOnChange, GetSession, InputOnChangeV2, SelectOnChange } from "../../../../pages/global-helpers";
import dayjs, { Dayjs } from "dayjs";
import RequestAPI from "../../../../services/api/request";

export default function RegistrationStep1({
  setCurrentStep,
  setAlert
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number | undefined>>,
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>
}) {
  /* state */
  const [formValue, setFormValue] = useState<EmployerProfileFormType>(DEFAULT_EMPLOYER_FORM);
  const [filePreview, setFilePreview] = useState<Record<string, { src: string, filename: string }>>({});
  const [errMsgFile, setErrMsgFile] = useState<Record<string, string>>({});
  const [errMsg, setErrMsg] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState<boolean>(false);

  /* constants */
  const numberOfEmployeesOption = [
    "1 - 10",
    "11 - 50",
    "51 - 200",
    "201 - 500",
    "501 - 1000",
    "1001 - 5000",
    "5001+",
  ];

  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const validate = EmployerProfileFormSchema.safeParse(formValue);
    if (!validate.success) {
      const errSchema = validate.error.flatten().fieldErrors;
      setLoading(false);
      setErrMsg(errSchema);
      return setAlert({ show: true, message: "please follow the form rules!" });
    } else {
      setErrMsg({})
    }

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.FormDataRequest<EmployerProfileFormType>(formValue).Send<any>(
      "/employers/",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
        }
      }
    )
    if (fail) {
      setLoading(false);
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(false);
      setAlert({ show: true, message: success["message"] });
      return setCurrentStep(prev => prev && prev + 1);
    }
  }
  return (
    <Box component={"div"}
      sx={{
        marginBottom: '2em'
      }}
    >
      <form onSubmit={onSubmit}>
        {/* profile and background image */}
        < Box component={"div"} >
          <Box
            component={"img"}
            src={filePreview["background_profile_image"] ? filePreview["background_profile_image"].src : "https://placehold.co/1152x240"}
            sx={{
              width: "100%",
              height: { xs: "10em", md: "15em" },
              borderRadius: "0.5em",
              backgroundSize: "cover",
              // next learn about background positioning
              objectFit: "cover"
            }}
          />
          <Box
            component={"div"}
            sx={{
              marginTop: { xs: "-10%", sm: "-7%", md: "-5%" },
              marginBottom: { xs: "1em", md: "1.5em" },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "start", sm: "end" },
              rowGap: {
                xs: "1em",
                sm: 0
              }
            }}
          >
            <Avatar
              alt="candidate-profile"
              src={filePreview["profile_image"] ? filePreview["profile_image"].src : "https://placehold.co/50x50"}
              sx={{
                width: "6em",
                height: "6em",
                border: "0.2em solid white",
                marginX: "1em",
              }}
            />
            <Box
              component={"div"}
              sx={{
                width: "100%",
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                marginBottom: { xs: "-0.5em", sm: "-0.7em", md: "-0.5em", lg: 0 },
              }}
            >
              <Box component={"div"}
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  flexDirection: { xs: "column", lg: "row" },
                  rowGap: "0.5em",
                  justifyContent: "space-evenly",
                }}
              >
                <Box component={"div"}
                  className="profile-image"
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    columnGap: 3,
                    rowGap: 0.5
                  }}
                >
                  <Button
                    component={"label"}
                    htmlFor="profile_image"
                    variant="outlined"
                    startIcon={<UploadRounded />}
                    size="medium"
                    color={errMsgFile["profile_image"] ? "error" : "primary"}
                    sx={{
                      minWidth: { xs: "100%", sm: "13em" },
                    }}
                  >
                    <InputBase
                      id="profile_image"
                      type="file"
                      name="profile_image"
                      slotProps={{
                        input: {
                          accept: "image/*"
                        }
                      }}
                      sx={{
                        height: '0px',
                        width: '0px',
                        opacity: 0
                      }}
                      onChange={FileOnChange(setFilePreview, setFormValue, setErrMsgFile)}
                    />
                    Profil Perusahaan
                  </Button>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontStyle: "italic",
                      color: errMsgFile["profile_image"] ? red[500] : grey[700],
                    }}
                  >
                    {errMsgFile["profile_image"] ? errMsgFile["profile_image"] :
                      filePreview["profile_image"] ? filePreview["profile_image"].filename : "no image selected"}
                  </Typography>
                </Box>
                <Box component={"div"}
                  className="background-profile"
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    columnGap: 3,
                    rowGap: 0.5
                  }}
                >
                  <Button
                    component={"label"}
                    htmlFor="background_profile_image"
                    variant="outlined"
                    startIcon={<UploadRounded />}
                    size="medium"
                    color={errMsgFile["background_profile_image"] ? "error" : "primary"}
                    sx={{
                      minWidth: { xs: "100%", sm: "13em" },
                    }}
                  >
                    <InputBase
                      id="background_profile_image"
                      type="file"
                      name="background_profile_image"
                      slotProps={{
                        input: {
                          accept: "image/*"
                        }
                      }}
                      sx={{
                        height: '0px',
                        width: '0px',
                        opacity: 0
                      }}
                      onChange={FileOnChange(setFilePreview, setFormValue, setErrMsgFile)}
                    />
                    Latar Belakang
                  </Button>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontStyle: "italic",
                      color: errMsgFile["background_profile_image"] ? red[500] : grey[700],
                    }}
                  >
                    {errMsgFile["background_profile_image"] ? errMsgFile["background_profile_image"] :
                      filePreview["background_profile_image"] ? filePreview["background_profile_image"].filename : "no image selected"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box >
        {/* employer form */}
        <Grid container
          columnSpacing={{ xs: 0, md: 2 }}
          rowSpacing={{ xs: 2, sm: 0 }}
          sx={{ marginBottom: "1em" }}
        >
          <Grid item xs={4}
            sx={{
              marginBottom: "1em",
            }}
          >
            <TextField
              type="text"
              name="name"
              label="Nama Perusahaan"
              placeholder="Nama perusahaan anda"
              size="small"
              fullWidth
              autoComplete="off"
              value={formValue.name}
              onChange={InputOnChangeV2(setFormValue)}
              error={errMsg["name"] ? true : false}
              helperText={errMsg["name"] ?? ""}
            />
          </Grid>
          <Grid item xs={4}
            sx={{
              marginBottom: "1em",
            }}
          >
            <TextField
              type="text"
              name="legal_name"
              label="Nama Legal Perusahaan"
              placeholder="e.g PT. Sidokaredev Cloud"
              size="small"
              fullWidth
              autoComplete="off"
              value={formValue.legal_name}
              onChange={InputOnChangeV2(setFormValue)}
              error={errMsg["legal_name"] ? true : false}
              helperText={errMsg["legal_name"] ?? ""}
            />
          </Grid>
          <Grid item xs={4}
            sx={{
              marginBottom: "1em",
            }}
          >
            <TextField
              type="text"
              name="location"
              label="Lokasi Perusahaan"
              placeholder="Masukkan alamat kantor pusat"
              size="small"
              fullWidth
              autoComplete="off"
              value={formValue.location}
              onChange={InputOnChangeV2(setFormValue)}
              error={errMsg["location"] ? true : false}
              helperText={errMsg["location"] ?? "Enter the location with the city name followed by the province (e.g., Malang, East Java)."}
            />
          </Grid>
          <Grid item xs={4}
            sx={{
              marginBottom: "1em",
            }}
          >
            <TextField
              type="text"
              name="founder"
              label="Pendiri"
              placeholder="Masukkan nama pendiri"
              size="small"
              fullWidth
              autoComplete="off"
              value={formValue.founder}
              onChange={InputOnChangeV2(setFormValue)}
              error={errMsg["founder"] ? true : false}
              helperText={errMsg["founder"] ?? ""}
            />
          </Grid>
          <Grid item xs={2}
            sx={{
              marginBottom: "1em",
            }}
          >
            <DatePicker
              openTo="year"
              views={["year"]}
              name="founded"
              label="Founded at"
              format="YYYY"
              disableFuture
              slotProps={{
                textField: {
                  size: "small",
                  error: Boolean(errMsg["founded"]) ? true : false,
                  helperText: errMsg["founded"] ?? "",
                }
              }}
              sx={{
                width: "100%",
                flexGrow: 1
              }}
              value={Boolean(formValue.founded) ? dayjs().set("year", formValue.founded) : undefined}
              onChange={(date: Dayjs | null) => {
                if (date) {
                  setFormValue(prev => ({
                    ...prev,
                    founded: date.year()
                  }))
                }
              }}
            />
          </Grid>
          <Grid item xs={2}
            sx={{
              marginBottom: "1em",
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="number_of_employees_label"
                size="small"
                sx={{
                  color: errMsg["total_of_employee"] ? red[500] : undefined,
                  "&.Mui-focused": {
                    color: errMsg["total_of_employee"] ? red[500] : undefined,
                  }
                }}
              >
                Jumlah Pegawai
              </InputLabel>
              <Select
                labelId="number_of_employees_label"
                name="total_of_employee"
                label="Jumlah Pegawai"
                size="small"
                value={formValue.total_of_employee}
                onChange={SelectOnChange(setFormValue, undefined, { coerceToNumber: false })}
                error={errMsg["total_of_employee"] && Boolean(errMsg["total_of_employee"]) ? true : false}
              >
                {numberOfEmployeesOption.map((option, index) => {
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
              {errMsg["total_of_employee"] && (
                <FormHelperText sx={{ color: red[500] }}>{errMsg["total_of_employee"]}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={4}
            sx={{
              marginBottom: "1em",
            }}
          >
            <TextField
              type="text"
              name="website"
              label="Official Website"
              placeholder="Masukkan situs resmi perusahaan"
              size="small"
              fullWidth
              autoComplete="off"
              value={formValue.website}
              onChange={InputOnChangeV2(setFormValue)}
              error={errMsg["website"] ? true : false}
              helperText={errMsg["website"] ?? ""}
            />
          </Grid>
          <Grid item xs={12}
            sx={{
              marginBottom: "1em",
            }}
          >
            <TextField
              type="text"
              name="description"
              label="Tentang Perusahaan"
              placeholder="Deskripsi tentang perusahaan"
              size="small"
              autoComplete="off"
              rows={5}
              fullWidth
              multiline
              value={formValue.description}
              onChange={InputOnChangeV2(setFormValue)}
              error={errMsg["description"] ? true : false}
              helperText={errMsg["description"] ?? ""}
            />
          </Grid>
        </Grid>
        <Box
          component={"div"}
          sx={{
            display: "flex",
            justifyContent: "end"
          }}
        >
          <Button
            type="submit"
            variant="contained"
            endIcon={loading ? (<CircularProgress color="secondary" size={15} />) : (<NavigateNextRounded fontSize="small" />)}
            disabled={loading}
            sx={{
              minWidth: "10em"
            }}
          >
            Selanjutnya
          </Button>
        </Box>
      </form>
    </Box>
  )
}