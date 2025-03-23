import { CloseRounded, UploadRounded, VerifiedUserRounded } from "@mui/icons-material"
import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, IconButton, InputBase, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material"
import { FormEvent, useEffect, useState } from "react"
import { ExperienceFormSchema, ExperienceFormType, SocialDataType, SocialFormSchema, SocialFormType } from "../../../../pages/candidates/types"
import { DEFAULT_EXPERIENCE_FORM } from "../../../../pages/candidates/constants"
import { DatePickerOnChange, FileOnChange, GetSession, InputOnChangeV2, SelectOnChange } from "../../../../pages/global-helpers"
import RequestAPI from "../../../../services/api/request"
import { grey, red } from "@mui/material/colors"
import { MobileDatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { HOST } from "../../../../pages/administrators/performance/[id]/constants"

export default function RegistrationStep3({
  setAlert,
  setCurrentStep,
  setDataAction,
}: {
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>
  setCurrentStep: React.Dispatch<React.SetStateAction<number | undefined>>
  setDataAction: React.Dispatch<React.SetStateAction<boolean>>
}) {
  /* state */
  const [formValue, setFormValue] = useState<{ experience: ExperienceFormType, socials: SocialFormType[] }>({
    experience: DEFAULT_EXPERIENCE_FORM,
    socials: []
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<Record<string, string | string[]>>({});
  // state -> Experience Form
  const [filePreview, setFilePreview] = useState<Record<string, { src: string, filename: string }>>({});
  const [errMsgFile, setErrMsgFile] = useState<Record<string, string>>({});
  // state -> Socials Form
  const [socialForm, setSocialForm] = useState<{ social_id: number, url: string }>({ social_id: 0, url: "" });
  const [socialOption, setSocialOption] = useState<SocialDataType[]>([]);
  const [socialErrMsg, setSocialErrMsg] = useState<Record<string, string[]>>({});

  /* constant */
  // constant  -> Experience Form
  const jobTypes = [
    "Staff",
    "Contract",
    "Freelance",
    "Internship",
  ]

  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const validate = ExperienceFormSchema.safeParse(formValue.experience)
    if (!validate.success) {
      setLoading(false)
      const errMsg = validate.error.flatten().fieldErrors
      setErrMsg(errMsg)
      return setAlert({ show: true, message: "please follow form validation rules!" })
    } else {
      setErrMsg({});
    }

    if (formValue.socials.length === 0) {
      setLoading(false);
      return setAlert({ show: true, message: "please add at least one socials to your profile as candidate!" })
    }
    console.info("socials form value \t: ", formValue.socials)

    const token = GetSession("auth")

    const [success_experience, fail_experience] = await RequestAPI.FormDataRequest(formValue.experience).Send<{
      attachment_document_status: string,
      message: string
    }>("/api/v1/candidates/experiences/", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
      }
    })
    if (fail_experience !== undefined) {
      setLoading(false)
      setAlert({ show: true, message: fail_experience.message })
      return
    }

    const [success_social, fail_social] = await RequestAPI.JSONRequest(formValue.socials)
      .Send<string>("/api/v1/candidates/socials/", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
        }
      })
    if (fail_social !== undefined) {
      setLoading(false)
      setAlert({ show: true, message: fail_social.message })
      return
    }

    setLoading(false)
    setCurrentStep(undefined)
    setDataAction(prev => !prev)
    return setAlert({ show: true, message: `${success_experience?.message} and ${success_social}` })
  };

  /* fetching */
  useEffect(() => {
    (async () => {
      const [data_socials, fail_socials] = await RequestAPI.Send<SocialDataType[]>("/api/v1/public/socials/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (fail_socials !== undefined) {
        return alert(fail_socials.message)
      } else if (data_socials !== undefined && data_socials != null) {
        return setSocialOption(data_socials);
      }
    })()
  }, [])
  return (
    <Box component={"div"}
    >
      <form onSubmit={onSubmit}>
        {/* Experience Form */}
        <Box component={"div"}
          sx={{
            marginY: 2
          }}
        >
          <Typography component={"p"}
            variant="subtitle2"
            sx={{
              marginBottom: "0.7em",
              fontWeight: 550,
              color: grey[700],
            }}
          >
            Experience
          </Typography>
          <Grid container
            columnSpacing={2}
            rowSpacing={2}
          >
            <Grid item md={4}>
              <TextField
                type="text"
                name="company_name"
                label="Company Name"
                placeholder="Enter the company name"
                size="small"
                autoComplete="off"
                fullWidth
                value={formValue.experience.company_name}
                onChange={InputOnChangeV2(setFormValue, "experience")}
                error={Boolean(errMsg["company_name"])}
                helperText={errMsg["company_name"] ?? ""}
              />
            </Grid>
            <Grid item md={4}>
              <TextField
                type="text"
                name="position"
                label="Position"
                placeholder="Enter your job title or position"
                size="small"
                autoComplete="off"
                fullWidth
                value={formValue.experience.position}
                onChange={InputOnChangeV2(setFormValue, "experience")}
                error={Boolean(errMsg["position"])}
                helperText={errMsg["position"] ?? ""}
              />
            </Grid>
            <Grid item md={4}>
              <TextField
                type="text"
                name="location_address"
                label="Location"
                placeholder="Enter the location (e.g., City, Province)"
                size="small"
                autoComplete="off"
                fullWidth
                value={formValue.experience.location_address}
                onChange={InputOnChangeV2(setFormValue, "experience")}
                error={Boolean(errMsg["location_address"])}
                helperText={errMsg["location_address"] ?? ""}
              />
            </Grid>
            <Grid item md={2}>
              <FormControl fullWidth>
                <InputLabel id="job_type"
                  size="small"
                  sx={{
                    color: errMsg["type"] ? red[500] : undefined,
                    "&.Mui-focused": {
                      color: errMsg["type"] ? red[500] : undefined,
                    }
                  }}
                >
                  Job Type
                </InputLabel>
                <Select
                  labelId="job_type"
                  name="type"
                  label="Job Type"
                  size="small"
                  value={formValue.experience.type}
                  onChange={SelectOnChange(setFormValue, "experience", {
                    coerceToNumber
                      : false,
                  })}
                  error={Boolean(errMsg["type"])}
                >
                  {jobTypes.map((type, index) => (
                    <MenuItem
                      key={index}
                      value={type}
                    >
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errMsg["type"] && (
                  <FormHelperText sx={{ color: red[500] }}>{errMsg["type"]}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={2}>
              <FormControl fullWidth>
                <InputLabel id="is_current"
                  size="small"
                  sx={{
                    color: errMsg["is_current"] ? red[500] : undefined,
                    "&.Mui-focused": {
                      color: errMsg["is_current"] ? red[500] : undefined,
                    }
                  }}
                >
                  Is Current ?
                </InputLabel>
                <Select
                  labelId="is_current"
                  name="is_current"
                  label="Is Current ?"
                  size="small"
                  value={String(formValue.experience.is_current)}
                  onChange={(event: SelectChangeEvent) => {
                    let value: any = event.target.value
                    if (value == "false") {
                      value = false
                    } else {
                      value = true
                    }
                    if (value) {
                      setFormValue(prev => ({
                        ...prev,
                        experience: {
                          ...prev.experience,
                          [event.target.name]: value,
                          ["end_at"]: new Date(Date.now()).toISOString()
                        }
                      }))
                    } else {
                      setFormValue(prev => ({
                        ...prev,
                        experience: {
                          ...prev.experience,
                          [event.target.name]: value,
                        }
                      }))
                    }
                  }}
                  error={Boolean(errMsg["is_current"])}
                >
                  <MenuItem value={"true"}>Yes</MenuItem>
                  <MenuItem value={"false"}>No</MenuItem>
                </Select>
                {errMsg["is_current"] && (
                  <FormHelperText sx={{ color: red[500] }}>{errMsg["is_current"]}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={4}>
              <Box component={"div"}
                sx={{
                  display: "flex",
                }}
              >
                <MobileDatePicker
                  name="start_at"
                  format="DD/MM/YYYY"
                  label="Start at"
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      error: Boolean(errMsg["start_at"]),
                      helperText: errMsg["start_at"] ?? ""
                    }
                  }}
                  value={Boolean(formValue.experience.start_at) ? dayjs(formValue.experience.start_at) : undefined}
                  onChange={DatePickerOnChange("start_at", setFormValue, "experience")}
                />
                <Box component={"div"}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginX: "1em"
                  }}
                >
                  <Box component={"div"}
                    sx={{
                      width: "0.5em",
                      height: "0.1em",
                      backgroundColor: grey[700],
                      borderRadius: "0.1em"
                    }}
                  />
                </Box>
                <MobileDatePicker
                  name="end_at"
                  format="DD/MM/YYYY"
                  label="End at"
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      error: Boolean(errMsg["end_at"]),
                      helperText: errMsg["end_at"] ?? ""
                    }
                  }}
                  value={Boolean(formValue.experience.end_at) ? dayjs(formValue.experience.end_at) : undefined}
                  onChange={DatePickerOnChange("end_at", setFormValue, "experience")}
                  disabled={formValue.experience.is_current}
                />
              </Box>
            </Grid>
            <Grid item md={4}>
              <Button
                component={"label"}
                htmlFor="attachment_document"
                variant="outlined"
                startIcon={<UploadRounded />}
                size="medium"
                color={errMsgFile["attachment_document"] ? "error" : "primary"}
                fullWidth
                sx={{
                  flexGrow: 1,
                  minWidth: "13em",
                  paddingY: "0.53em"
                }}
              >
                <InputBase
                  id="attachment_document"
                  type="file"
                  name="attachment_document"
                  inputProps={{
                    accept: "application/pdf"
                  }}
                  sx={{
                    height: '0px',
                    width: '0px',
                    opacity: 0
                  }}
                  onChange={FileOnChange(setFilePreview, setFormValue, setErrMsgFile, "experience")}
                />
                {filePreview["attachment_document"] ?
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
                      {filePreview["attachment_document"].filename}
                    </Typography>
                  ) :
                  "Attachment Experience File"
                }
              </Button>
              {errMsgFile["attachment_document"] ? (
                <FormHelperText sx={{ color: red[500] }}>
                  {errMsgFile["attachment_document"]}
                </FormHelperText>) : ""}
            </Grid>
            <Grid item md={12}>
              <TextField
                type="text"
                name="description"
                label="Job Description"
                placeholder="Describe your job responsibility in short"
                size="small"
                fullWidth
                multiline
                rows={4}
                value={formValue.experience.description}
                onChange={InputOnChangeV2(setFormValue, "experience")}
                error={Boolean(errMsg["description"])}
                helperText={errMsg["description"] ?? ""}
              />
            </Grid>
          </Grid>
        </Box>
        {/* Social Form */}
        <Box component={"div"}
          sx={{
            marginY: 2
          }}
        >
          <Typography component={"p"}
            variant="subtitle2"
            sx={{
              marginBottom: "0.7em",
              fontWeight: 550,
              color: grey[700],
            }}
          >
            Socials
          </Typography>
          <Box component={"div"} className="social-preview">
            <Grid container columnSpacing={2} rowSpacing={2}>
              {formValue.socials.map((social, index) => {
                const socialValue = socialOption.find(option => option.id === social.social_id)
                return (
                  <Grid item md={4} key={index}>
                    <Box component={"div"} className="social-item"
                      sx={{
                        display: "flex",
                        columnGap: 1.5,
                        padding: "0.5em",
                        backgroundColor: "#e6f2f0",
                        borderRadius: "0.3em"
                      }}
                    >
                      <Box
                        component={"img"}
                        src={`${HOST.main}${socialValue?.icon_image_path}`}
                        width={30}
                        height={30}
                        sx={{
                          // borderRadius: "0.5em",
                          objectFit: "scale-down"
                        }}
                      />
                      <Box component={"div"}
                        sx={{
                          flexGrow: 1
                        }}
                      >
                        <Typography component={"p"}
                          variant="subtitle2"
                        >
                          {socialValue?.name}
                        </Typography>
                        <Typography component={"a"}
                          variant="caption"
                          href={social.url}
                          target="_blank"
                          sx={{
                            whiteSpace: "initial",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {social.url}
                        </Typography>
                      </Box>
                      <IconButton size="small"
                        sx={{
                          "&.MuiIconButton-root": {
                            height: "max-content"
                          }
                        }}
                        onClick={() => {
                          setFormValue(prev => {
                            prev.socials.splice(index, 1)
                            return {
                              ...prev
                            }
                          })
                        }}
                      >
                        <CloseRounded fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
          <Grid container columnSpacing={2}
            sx={{
              marginY: "1em"
            }}
          >
            <Grid item md={4}>
              <FormControl fullWidth>
                <InputLabel id="social-list"
                  size="small"
                  sx={{
                    color: socialErrMsg["social_id"] ? red[500] : undefined,
                    "&.Mui-focused": {
                      color: socialErrMsg["social_id"] ? red[500] : undefined,
                    }
                  }}
                >
                  Social
                </InputLabel>
                <Select
                  labelId="social-list"
                  name="social_id"
                  label="Social"
                  size="small"
                  value={String(socialForm.social_id)}
                  onChange={SelectOnChange(setSocialForm)}
                  error={Boolean(socialErrMsg["social_id"])}
                >
                  {socialOption.length == 0 && (
                    <MenuItem
                      value={0}
                      disabled
                    >
                      <Typography component={"div"} variant="subtitle2">
                        There is no socials as an option in master data.
                      </Typography>
                    </MenuItem>
                  )}
                  {socialOption.map((social, index) => (
                    <MenuItem
                      key={index}
                      value={social.id}
                      disabled={formValue.socials.some(selected => selected.social_id === social.id)}
                    >
                      {social.name}
                    </MenuItem>
                  ))}
                </Select>
                {socialErrMsg["social_id"] && (
                  <FormHelperText sx={{ color: red[500] }}>{socialErrMsg["social_id"]}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              <Box component={"div"}
                sx={{
                  display: "flex",
                  columnGap: 2
                }}
              >
                <TextField
                  type="text"
                  name="url"
                  label="Url"
                  placeholder="Enter your social media URL"
                  size="small"
                  autoComplete="off"
                  fullWidth
                  value={socialForm.url}
                  onChange={InputOnChangeV2(setSocialForm)}
                  error={Boolean(socialErrMsg["url"])}
                  helperText={socialErrMsg["url"] ?? ""}
                />
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    const validate = SocialFormSchema.safeParse(socialForm)
                    if (!validate.success) {
                      const errMsg = validate.error.flatten().fieldErrors
                      return setSocialErrMsg(errMsg)
                    }
                    setSocialErrMsg({})
                    setSocialForm({ social_id: 0, url: "" })
                    setFormValue(prev => ({
                      ...prev,
                      socials: [...prev.socials, socialForm]
                    }))
                  }}
                >
                  Add
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* <SocialsForm formValue={formValue.socials} setFormValue={setFormValue} /> */}
        <Box component={"div"}
          sx={{
            display: "flex",
            justifyContent: "end"
          }}
        >
          <Button
            type="submit"
            variant="contained"
            size="small"
            endIcon={loading ? (<CircularProgress color="secondary" size={15} />) : (<VerifiedUserRounded />)}
            disabled={loading}
            sx={{
              minWidth: "10em",
            }}
          >
            Finish
          </Button>
        </Box>
      </form>
    </Box>
  )
}