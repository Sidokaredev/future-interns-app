import { NavigateNextRounded, UploadRounded } from "@mui/icons-material"
import { Autocomplete, Avatar, Box, Button, CircularProgress, FormHelperText, Grid, InputBase, TextField, Typography } from "@mui/material"
import { AddressFormSchema, AddressFormType, CandidateFormSchema, CandidateFormType } from "../../../../pages/candidates/types";
import { Countries, DEFAULT_ADDRESS_FORM, DEFAULT_CANDIDATE_FORM, Provinces } from "../../../../pages/candidates/constants";
import { FormEvent, useState } from "react";
import { AutoCompleteOnChange, AutoCompleteOnClose, AutoCompleteOnOpen, DatePickerOnChange, FileOnChange, GetSession, InputNumberOnChange, InputOnChangeV2 } from "../../../../pages/global-helpers";
import RequestAPI from "../../../../services/api/request";
import { grey, red } from "@mui/material/colors";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export default function RegistrationStep1({
  setCurrentStep,
  setAlert
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number | undefined>>,
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>
}) {
  /* state */
  const [formValue, setFormValue] = useState<{ candidate: CandidateFormType, address: AddressFormType }>({
    candidate: DEFAULT_CANDIDATE_FORM,
    address: DEFAULT_ADDRESS_FORM
  })
  const [errMsg, setErrMsg] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState<boolean>(false);
  // state -> Candidate Form
  const [filePreview, setFilePreview] = useState<Record<string, { src: string, filename: string }>>({})
  const [errMsgFile, setErrMsgFile] = useState<Record<string, string>>({})
  // state -> Address Form
  const [open, setOpen] = useState<Record<string, boolean>>({});
  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const validateCandidate = CandidateFormSchema.safeParse(formValue.candidate)
    const validateAddress = AddressFormSchema.safeParse(formValue.address)
    if (!validateCandidate.success) {
      const errorCandidate = validateCandidate.error?.flatten().fieldErrors
      setErrMsg(errorCandidate)
    } else {
      setErrMsg({})
    }

    if (!validateAddress.success) {
      setLoading(false)
      const errorAddress = validateAddress.error?.flatten().fieldErrors
      return setErrMsg(prev => ({
        ...prev,
        ...errorAddress
      }))
    } else {
      setErrMsg({})
    }

    const token = GetSession('auth')
    const [data_candidate, fail_candidate] = await RequestAPI.FormDataRequest<CandidateFormType>(formValue.candidate)
      .Send<{
        background_profile_img_status: string,
        candidate_id: string,
        cv_document_status: string,
        profile_img_status: string
      }>("/candidates/", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
    if (fail_candidate !== undefined) {
      setLoading(false)
      return setAlert({ show: true, message: fail_candidate.message })
    }

    const [data_address, fail_address] = await RequestAPI.JSONRequest([
      {
        ...formValue.address,
        type: "home"
      },
    ]).Send<string>("/candidates/addresses/", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      }
    })

    if (fail_address !== undefined) {
      setLoading(false)
      return setAlert({ show: true, message: fail_address.message })
    }

    setLoading(false)
    setAlert({ show: true, message: `${data_candidate?.cv_document_status} and ${data_address}` })
    return setCurrentStep(prev => prev && prev + 1)
  }
  return (
    <Box component={"div"}
      sx={{
        marginBottom: '2em'
      }}
    >
      <form onSubmit={onSubmit}>
        {/* Candidate Form */}
        < Box component={"div"}
          className="candidate-form-container"
          sx={{
            marginBottom: "1em"
          }
          }
        >
          {/* profile and background image container */}
          < Box component={"div"} >
            <Box
              component={"img"}
              // alt="background_profile"
              src={filePreview["background_profile_img"] ? filePreview["background_profile_img"].src : "https://placehold.co/1152x240"}
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
                src={filePreview["profile_img"] ? filePreview["profile_img"].src : "https://placehold.co/50x50"}
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
                      htmlFor="profile_img"
                      variant="outlined"
                      startIcon={<UploadRounded />}
                      size="medium"
                      color={errMsgFile["profile_img"] ? "error" : "primary"}
                      sx={{
                        minWidth: { xs: "100%", sm: "13em" },
                      }}
                    >
                      <InputBase
                        id="profile_img"
                        type="file"
                        name="profile_img"
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
                        onChange={FileOnChange(setFilePreview, setFormValue, setErrMsgFile, "candidate")}
                      />
                      Foto Profil
                    </Button>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontStyle: "italic",
                        color: errMsgFile["profile_img"] ? red[500] : grey[700],
                      }}
                    >
                      {errMsgFile["profile_img"] ? errMsgFile["profile_img"] :
                        filePreview["profile_img"] ? filePreview["profile_img"].filename : "tidak ada gambar terpilih"}
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
                      htmlFor="background_profile_img"
                      variant="outlined"
                      startIcon={<UploadRounded />}
                      size="medium"
                      color={errMsgFile["background_profile_img"] ? "error" : "primary"}
                      sx={{
                        minWidth: { xs: "100%", sm: "13em" },
                      }}
                    >
                      <InputBase
                        id="background_profile_img"
                        type="file"
                        name="background_profile_img"
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
                        onChange={FileOnChange(setFilePreview, setFormValue, setErrMsgFile, "candidate")}
                      />
                      Latar Belakang
                    </Button>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontStyle: "italic",
                        color: errMsgFile["background_profile_img"] ? red[500] : grey[700],
                      }}
                    >
                      {errMsgFile["background_profile_img"] ? errMsgFile["background_profile_img"] :
                        filePreview["background_profile_img"] ? filePreview["background_profile_img"].filename : "tidak ada gambar terpilih"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box >
          <Grid container
            columnSpacing={{ xs: 0, md: 2 }}
            rowSpacing={{ xs: 2, sm: 0 }}
            sx={{ marginBottom: "1em" }}
          >
            <Grid item xs={12} md={4}
              sx={{
                marginBottom: "1em"
              }}
            >
              <Button
                component={"label"}
                htmlFor="cv_document"
                variant="contained"
                startIcon={<UploadRounded />}
                size="medium"
                color={errMsgFile["cv_document"] ? "error" : "primary"}
                fullWidth
                sx={{
                  flexGrow: 1,
                  minWidth: "13em",
                  paddingY: "0.53em"
                }}
              >
                <InputBase
                  id="cv_document"
                  type="file"
                  name="cv_document"
                  inputProps={{
                    accept: "application/pdf"
                  }}
                  sx={{
                    height: '0px',
                    width: '0px',
                    opacity: 0
                  }}
                  onChange={FileOnChange(setFilePreview, setFormValue, setErrMsgFile, "candidate")}
                />
                {filePreview["cv_document"] ?
                  (
                    <Typography variant="subtitle2"
                      sx={{
                        whiteSpace: "initial",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {filePreview["cv_document"].filename}
                    </Typography>
                  ) :
                  "Curriculum Vitae"
                }
              </Button>
              {errMsgFile["cv_document"] ? (
                <FormHelperText sx={{ color: red[500] }}>
                  {errMsgFile["cv_document"]}
                </FormHelperText>) : ""}
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type="text"
                name="expertise"
                label="Keahlian"
                placeholder="e.g Marketing Strategy"
                size="small"
                fullWidth
                autoComplete="off"
                value={formValue.candidate.expertise}
                onChange={InputOnChangeV2(setFormValue, "candidate")}
                error={errMsg["expertise"] ? true : false}
                helperText={errMsg["expertise"] ?? ""}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                name="date_of_birth"
                label="Tanggal Lahir"
                format="DD/MM/YYYY"
                disableFuture
                slotProps={{
                  textField: {
                    size: "small",
                    error: Boolean(errMsg["date_of_birth"]) ? true : false,
                    helperText: errMsg["date_of_birth"] ?? "",
                  }
                }}
                sx={{
                  width: "100%",
                  flexGrow: 1
                }}
                value={Boolean(formValue.candidate.date_of_birth) ? dayjs(formValue.candidate.date_of_birth) : undefined}
                onChange={DatePickerOnChange("date_of_birth", setFormValue, "candidate")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="text"
                name="about_me"
                label="Tentang Saya"
                placeholder="Jelaskan pengalaman, keahlian, atau minat profesional Anda"
                size="small"
                fullWidth
                multiline
                rows={4}
                value={formValue.candidate.about_me}
                onChange={InputOnChangeV2(setFormValue, "candidate")}
                error={errMsg["about_me"] ? true : false}
                helperText={errMsg["about_me"] ?? ""}
              />
            </Grid>
          </Grid>
        </Box >
        {/* Address Form */}
        <Box component={"div"} className="address-form-container">
          <Typography
            variant="subtitle1"
            sx={{
              marginBottom: "0.5em",
              fontWeight: 550,
              color: grey[600],
            }}
          >
            Alamat
          </Typography>
          <Grid
            container
            columnSpacing={{ xs: 0, md: 2 }}
            rowSpacing={{ xs: 2, md: 0 }}
            sx={{
              marginBottom: "1em",
            }}
          >
            <Grid item xs={12} md={8}>
              <TextField
                type="text"
                name="street"
                label="Alamat Jalan"
                placeholder="e.g Jl. H. Mawardi"
                size="small"
                multiline
                fullWidth
                value={formValue.address.street}
                onChange={InputOnChangeV2(setFormValue, "address")}
                error={Boolean(errMsg["street"]) ? true : false}
                helperText={errMsg["street"] ?? ""}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type="text"
                name="neighborhood"
                label="Lingkungan / RT-RW"
                placeholder="e.g RT 03/RW 01"
                size="small"
                fullWidth
                autoComplete="off"
                value={formValue.address.neighborhood}
                onChange={InputOnChangeV2(setFormValue, "address")}
                error={Boolean(errMsg["neighborhood"]) ? true : false}
                helperText={errMsg["neighborhood"] ?? ""}
              />
            </Grid>
          </Grid>
          <Grid
            container
            columnSpacing={2}
            sx={{
              marginBottom: { xs: 0, md: "1em" },
            }}
          >
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                marginBottom: { xs: "1em", md: 0 },
              }}
            >
              <TextField
                type="text"
                name="rural_area"
                label="Kelurahan / Desa"
                placeholder="e.g Jerukgamping"
                size="small"
                fullWidth
                autoComplete="off"
                value={formValue.address.rural_area}
                onChange={InputOnChangeV2(setFormValue, "address")}
                error={Boolean(errMsg["rural_area"]) ? true : false}
                helperText={errMsg["rural_area"] ?? ""}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                marginBottom: { xs: "1em", md: 0 },
              }}
            >
              <TextField
                type="text"
                name="sub_district"
                label="Kecamatan"
                placeholder="e.g Kec. Krian"
                size="small"
                fullWidth
                autoComplete="off"
                value={formValue.address.sub_district}
                onChange={InputOnChangeV2(setFormValue, "address")}
                error={Boolean(errMsg["sub_district"]) ? true : false}
                helperText={errMsg["sub_district"] ?? ""}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                marginBottom: { xs: "1em", md: 0 },
              }}
            >
              <TextField
                type="text"
                name="city"
                label="Kabupaten / Kota"
                placeholder="e.g Kab. Sidoarjo"
                size="small"
                fullWidth
                autoComplete="off"
                value={formValue.address.city}
                onChange={InputOnChangeV2(setFormValue, "address")}
                error={Boolean(errMsg["city"]) ? true : false}
                helperText={errMsg["city"] ?? ""}
              />
            </Grid>
          </Grid>
          <Grid container columnSpacing={2}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                marginBottom: { xs: "1em", md: 0 },
              }}
            >
              <Autocomplete
                open={open["province"]}
                options={Provinces}
                // loading={loading["province"]}
                onOpen={AutoCompleteOnOpen("province", setOpen)}
                onClose={AutoCompleteOnClose("province", setOpen)}
                size="small"
                renderInput={(params) => <TextField {...params} label="Provinsi" error={Boolean(errMsg["province"]) ? true : false}
                  helperText={errMsg["province"] ?? ""} />}
                slotProps={{
                  paper: {
                    sx: {
                      marginBottom: "0.8em",
                    },
                  },
                }}
                disableClearable
                fullWidth
                value={Boolean(formValue.address.province) ? formValue.address.province : undefined}
                onChange={AutoCompleteOnChange("province", setFormValue, "address")}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                marginBottom: { xs: "1em", md: 0 },
              }}
            >
              <Autocomplete
                open={open["country"]}
                options={Countries}
                // loading={loading["country"]}
                onOpen={AutoCompleteOnOpen("country", setOpen)}
                onClose={AutoCompleteOnClose("country", setOpen)}
                size="small"
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                renderOption={(props, option) => {
                  const { key, ...restProps } = props
                  return (
                    <Box
                      key={key}
                      component={"li"}
                      {...restProps}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: 2,
                      }}
                    >
                      <Box
                        component={"img"}
                        src={option.image_url}
                        width={25}
                        height={15}
                      />
                      <Typography variant="subtitle2">Indonesia</Typography>
                    </Box>
                  );
                }}
                renderInput={(params) => <TextField {...params} label="Negara" error={Boolean(errMsg["country"]) ? true : false}
                  helperText={errMsg["country"] ?? ""} />}
                disableClearable
                fullWidth
                value={Boolean(formValue.address.country) ? { name: formValue.address.country, image_url: "" } : undefined}
                onChange={AutoCompleteOnChange("country", setFormValue, "address", "name")}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                marginBottom: { xs: "1em", md: 0 },
              }}
            >
              <TextField
                type="text"
                name="postal_code"
                label="Kode Pos"
                placeholder="5 Digit angka"
                size="small"
                fullWidth
                autoComplete="off"
                value={String(formValue.address.postal_code)}
                onChange={InputNumberOnChange(setFormValue, "address")}
                error={Boolean(errMsg["postal_code"]) ? true : false}
                helperText={errMsg["postal_code"] ?? ""}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          component={"div"}
          sx={{
            marginY: "1.5em",
            display: "flex",
            justifyContent: "end"
          }}
        >
          <Button
            type="submit"
            variant="contained"
            endIcon={loading ? (<CircularProgress color="secondary" size={15} />) : (<NavigateNextRounded />)}
            disabled={loading}
            sx={{
              minWidth: "10em"
            }}
          >
            Selanjutnya
          </Button>
        </Box>
      </form>
    </Box >
  )
}