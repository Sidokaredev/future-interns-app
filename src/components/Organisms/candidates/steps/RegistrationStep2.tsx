import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { ArrayEducationFormSchema, ArraySkillFormSchema, EducationFormType, SkillDataType, SkillFormType } from "../../../../pages/candidates/types"
import { DEFAULT_EDUCATION_FORM } from "../../../../pages/candidates/constants"
import { Box, Button, CircularProgress, Collapse, FormControl, FormHelperText, Grid, IconButton, InputLabel, Menu, MenuItem, MenuList, Select, SelectChangeEvent, TextField, Tooltip, Typography } from "@mui/material"
import { AddRounded, DeleteRounded, ExpandLessRounded, ExpandMoreRounded, MoreVertRounded, NavigateNextRounded } from "@mui/icons-material"
import { GetSession } from "../../../../pages/global-helpers"
import RequestAPI from "../../../../services/api/request"
import { grey, red } from "@mui/material/colors"
import { MobileDatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { HOST } from "../../../../pages/administrators/performance/[id]/constants"

export default function RegistrationStep2({
  setCurrentStep,
  setAlert
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number | undefined>>
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>
}) {
  /* state */
  const [formValue, setFormValue] = useState<{ educations: EducationFormType[], skills: { skill_id: number }[] }>({
    educations: [DEFAULT_EDUCATION_FORM],
    skills: [{
      skill_id: 0
    }]
  });
  const [errMsg, setErrMsg] = useState<{ [key: number]: Record<string, string> }>({});
  const [loading, setLoading] = useState<boolean>(false);
  // state - Education Form
  const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({})
  const [collapseIn, setCollapseIn] = useState<Record<string, boolean>>({})
  // state - Skills Form
  const [skillOption, setSkillOption] = useState<SkillDataType[]>([]);
  /* event handler */
  // handler -> Education Form
  const addMoreEducation = () => {
    setFormValue(prev => ({
      ...prev,
      educations: [...prev.educations, DEFAULT_EDUCATION_FORM]
    }))
    setTimeout(() => {
      setCollapseIn(prev => ({
        ...prev,
        [`collapsed${formValue.educations.length}`]: true
      }))
    }, 500)
  }
  const deleteEducation = (index: number) => () => {
    setFormValue(prev => {
      prev.educations.splice(index, 1)
      return {
        ...prev,
        educations: [...prev.educations]
      }
    })
  }
  const inputArrayOnChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormValue(prev => {
      prev.educations[index] = {
        ...prev.educations[index],
        [event.target.name]: event.target.value
      }
      return {
        ...prev
      }
    })
  }
  const selectArrayOnChange = (index: number) => (event: SelectChangeEvent) => {
    setFormValue(prev => {
      let value: any = event.target.value
      if (value === "false") {
        value = false
        prev.educations[index] = {
          ...prev.educations[index],
          "end_at": new Date(Date.now()).toISOString()
        }
      } else if (value == "true") {
        value = true
      }
      prev.educations[index] = {
        ...prev.educations[index],
        [event.target.name]: value
      }
      return {
        ...prev
      }
    })
  }
  // handler -> Skill Form
  const addMoreSkill = () => {
    setFormValue(prev => ({
      ...prev,
      skills: [...prev.skills, { skill_id: 0 }]
    }))
  };
  const deleteSkill = (index: number) => () => {
    setFormValue(prev => {
      prev.skills.splice(index, 1)
      return {
        ...prev
      }
    })
  };

  /* constant */
  // constant -> Education Form 
  const degreeList = [
    "SMA/SMK",
    "Associate Degree (Diploma/D3)",
    "Bachelor's Degree (S1/D4)",
    "Master's Degree (S2",
    "Doctoral Degree / Ph.D. (S3)"
  ]
  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const validateEducation = ArrayEducationFormSchema.safeParse(formValue.educations)
    if (!validateEducation.success) {
      const errorValidator = validateEducation.error.issues.reduce((prev: any, current) => {
        const [index, field] = current.path
        if (!prev[index]) prev[index] = {};
        prev[index][field] = current.message
        return prev
      }, {})
      setLoading(false)
      setErrMsg(errorValidator)
      setAlert({ show: true, message: "ensure all educations field are valid!" })
      return
    }
    const validateSkill = ArraySkillFormSchema.safeParse(formValue.skills)
    if (!validateSkill.success) {
      const errorValidator = validateSkill.error.issues.reduce((prev: any, current) => {
        const [index, field] = current.path
        if (!prev[index]) prev[index] = {};
        prev[index][field] = current.message
        return prev
      }, {})
      setLoading(false)
      setErrMsg(errorValidator)
      setAlert({ show: true, message: "ensure all skills field are valid!" })
      return
    }

    setErrMsg({})

    const token = GetSession('auth')
    // THE REQUEST API HELPER CLASS DOESNT HAVE ABILITIES TO MAKE REQUEST CONCURRENTLY
    const [success_education, fail_education] = await RequestAPI.JSONRequest<EducationFormType[]>(formValue.educations).Send<string>("/candidates/educations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
    if (fail_education !== undefined) {
      setLoading(false)
      return setAlert({ show: true, message: fail_education.message })
    }
    const [success_skill, fail_skill] = await RequestAPI.JSONRequest<SkillFormType[]>(formValue.skills)
      .Send<string>("/candidates/skills/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      })
    if (fail_skill !== undefined) {
      setLoading(false)
      return setAlert({ show: false, message: fail_skill.message })
    }

    setLoading(false)
    setAlert({ show: true, message: `${success_education} and ${success_skill}` })
    return setTimeout(() => {
      setCurrentStep(prev => prev as number + 1)
    }, 3000)
  }

  /* fetching */
  useEffect(() => {
    (async () => {
      const [data_skills, fail_skills] = await RequestAPI.Send<SkillDataType[]>("/public/skills/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (fail_skills !== undefined) {
        alert(fail_skills.message)
        return
      }

      if (data_skills !== undefined && data_skills != null) {
        setSkillOption(data_skills)
        return
      }
    })()
  }, [])
  return (
    <Box component={"div"}>
      <form onSubmit={onSubmit}>
        {/* Education Form */}
        <Box component={"div"}
          className="education-form-container"
          sx={{
            marginY: "2em"
          }}
        >
          <Typography
            component={"p"}
            variant="subtitle1"
            sx={{
              marginBottom: "1em",
              fontWeight: 550,
              color: grey[700]
            }}
          >
            Pendidikan
          </Typography>
          {formValue.educations.map((education, index) => {
            const collapsedKey = `collapsed${index}`
            return (
              <Box component={"div"}
                key={index}
              >
                {/* education preview */}
                {formValue.educations.length > 1 && (
                  <Box component={"div"} className="education-preview"
                    sx={{
                      marginBottom: "1em",
                      borderRadius: "0.3em",
                      padding: "0.5em",
                      backgroundColor: grey[200]
                    }}
                  >
                    <Box component={"div"}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <Typography variant="subtitle2"
                        sx={{
                          color: "#06816d",
                          fontWeight: 550,
                          letterSpacing: "0.02em"
                        }}
                      >
                        {education.university}
                        <Typography component={"span"} variant="caption" fontStyle={"italic"}> ({new Date(education.start_at).getFullYear()} - {new Date(education.end_at).getFullYear()})</Typography>
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                          setAnchorEl(prev => ({
                            ...prev,
                            [collapsedKey]: event.currentTarget
                          }))
                        }}
                      >
                        <MoreVertRounded />
                      </IconButton>
                      <Menu
                        open={Boolean(anchorEl[collapsedKey])}
                        anchorEl={anchorEl[collapsedKey]}
                        anchorOrigin={{
                          horizontal: "right",
                          vertical: "bottom"
                        }}
                        transformOrigin={{
                          horizontal: "right",
                          vertical: "top"
                        }}
                        onClose={() => setAnchorEl(prev => ({ ...prev, [collapsedKey]: null }))}
                        slotProps={{
                          paper: {
                            sx: {
                              minWidth: "9em",
                              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                              border: "1px solid #d4d4d4",
                            },
                          },
                        }}
                      >
                        <MenuList dense disablePadding>
                          <MenuItem
                            onClick={() => {
                              setCollapseIn(prev => {
                                return {
                                  ...prev,
                                  [collapsedKey]: !prev[collapsedKey]
                                }
                              })
                              setAnchorEl(prev => ({
                                ...prev,
                                [collapsedKey]: null
                              }))
                            }}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              columnGap: "0.5em",
                              fontSize: "small"
                            }}
                          >
                            {collapseIn[collapsedKey] ? (
                              <ExpandLessRounded fontSize="small" />
                            ) : (
                              <ExpandMoreRounded fontSize="small" />
                            )}
                            <Typography component={"p"} variant="caption">Tampilkan Formulir Lengkap</Typography>
                          </MenuItem>
                          <MenuItem
                            onClick={deleteEducation(index)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              columnGap: "0.5em",
                              fontSize: "small"
                            }}
                          >
                            <DeleteRounded fontSize="small" sx={{ color: red[500] }} />
                            <Typography component={"p"} variant="caption" sx={{ color: red[500] }}>Hapus</Typography>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Box>
                    <Box component={"div"}
                    >
                      <Typography
                        component={"p"}
                        variant="subtitle2"
                        sx={{
                          color: grey[600]
                        }}>
                        {`${education.degree}, ${education.major}`}
                      </Typography>
                      <Typography variant="caption">
                        {education.is_graduated ? "Graduated" : "Incomplete"} | GPA: {education.gpa}
                      </Typography>
                    </Box>
                  </Box>
                )}
                <Collapse in={formValue.educations.length === 1 ? true : collapseIn[collapsedKey]} orientation="vertical">
                  {/* education form */}
                  <Grid container className="education-form" columnSpacing={2}
                    rowSpacing={2}
                    sx={{
                      marginBottom: "1em"
                    }}
                  >
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        type="text"
                        name="university"
                        label="Perguruan Tinggi"
                        placeholder="Nama perguruan tinggi (bukan singkatan)"
                        size="small"
                        autoComplete="off"
                        fullWidth
                        value={education.university}
                        onChange={inputArrayOnChange(index)}
                        error={errMsg[index] && Boolean(errMsg[index]["university"]) ? true : false}
                        helperText={errMsg[index] && errMsg[index]["university"]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        type="text"
                        name="address"
                        label="Alamat Perguruan Tinggi"
                        placeholder="e.g., Jakarta, DKI Jakarta"
                        size="small"
                        autoComplete="off"
                        fullWidth
                        value={education.address}
                        onChange={inputArrayOnChange(index)}
                        error={errMsg[index] && Boolean(errMsg[index]["address"]) ? true : false}
                        helperText={errMsg[index] && errMsg[index]["address"]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        type="text"
                        name="major"
                        label="Jurusan / Program Studi"
                        placeholder="e.g Teknik Kimia"
                        size="small"
                        autoComplete="off"
                        fullWidth
                        value={education.major}
                        onChange={inputArrayOnChange(index)}
                        error={errMsg[index] && Boolean(errMsg[index]["major"]) ? true : false}
                        helperText={errMsg[index] && errMsg[index]["major"]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth>
                        <InputLabel id="education_degree"
                          size="small"
                          sx={{
                            color: errMsg[index] && errMsg[index]["degree"] ? red[500] : undefined,
                            "&.Mui-focused": {
                              color: errMsg[index] && errMsg[index]["degree"] ? red[500] : undefined,
                            }
                          }}
                        >
                          Jenjang Pendidikan
                        </InputLabel>
                        <Select
                          labelId="education_degree"
                          name="degree"
                          label="Jenjang Pendidikan"
                          size="small"
                          value={education.degree}
                          onChange={selectArrayOnChange(index)}
                          error={errMsg[index] && Boolean(errMsg[index]["degree"]) ? true : false}
                        >
                          {degreeList.map((degree, index) => (
                            <MenuItem
                              key={index}
                              value={degree}
                            >
                              {degree}
                            </MenuItem>
                          ))}
                        </Select>
                        {errMsg[index] && errMsg[index]["degree"] && (
                          <FormHelperText sx={{ color: red[500] }}>{errMsg[index]["degree"]}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={6} md={2}>
                      <FormControl fullWidth>
                        <InputLabel id="is_graduated"
                          size="small"
                          sx={{
                            color: errMsg[index] && errMsg[index]["is_graduated"] ? red[500] : undefined,
                            "&.Mui-focused": {
                              color: errMsg[index] && errMsg[index]["is_graduated"] ? red[500] : undefined,
                            }
                          }}
                        >
                          Status
                        </InputLabel>
                        <Select
                          labelId="is_graduated"
                          name="is_graduated"
                          label="Status"
                          size="small"
                          value={String(education.is_graduated)}
                          onChange={selectArrayOnChange(index)}
                          error={errMsg[index] && Boolean(errMsg[index]["is_graduated"]) ? true : false}
                        >
                          <MenuItem value={"true"}>Telah lulus</MenuItem>
                          <MenuItem value={"false"}>Bleum selesai</MenuItem>
                        </Select>
                        {errMsg[index] && errMsg[index]["is_graduated"] && (
                          <FormHelperText sx={{ color: red[500] }}>{errMsg[index]["is_graduated"]}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={6} md={2}>
                      <TextField
                        type="number"
                        name="gpa"
                        label="Indek Prestasi Kumulatif"
                        placeholder="e.g., 3.5/4.0 or 4.2/5.0"
                        size="small"
                        autoComplete="off"
                        fullWidth
                        value={education.gpa}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          let value: string = event.target.value
                          if (isNaN(Number(value))) {
                            return
                          }

                          if (value.length > 4) {
                            return
                          }

                          if (Number(value) > 5) {
                            return
                          }

                          setFormValue(prev => {
                            prev.educations[index] = {
                              ...prev.educations[index],
                              [event.target.name]: Number(value)
                            }
                            return {
                              ...prev
                            }
                          })
                        }}
                        error={errMsg[index] && Boolean(errMsg[index]["gpa"]) ? true : false}
                        helperText={errMsg[index] && errMsg[index]["gpa"]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                      <Box component={"div"}
                        sx={{
                          display: "flex",
                        }}
                      >
                        <MobileDatePicker
                          name="start_at"
                          views={["year"]}
                          format="YYYY"
                          label="Tahun masuk"
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              error: errMsg[index] && Boolean(errMsg[index]["start_at"]) ? true : false,
                              helperText: errMsg[index] && errMsg[index]["start_at"]
                            }
                          }}
                          value={Boolean(education.start_at) ? dayjs(education.start_at) : undefined}
                          onChange={(value) => {
                            setFormValue(prev => {
                              prev.educations[index] = {
                                ...prev.educations[index],
                                ["start_at"]: value?.format() as string
                              }
                              return {
                                ...prev
                              }
                            })
                          }}
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
                          views={["year"]}
                          format="YYYY"
                          label="Tahun selesai"
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              error: errMsg[index] && Boolean(errMsg[index]["end_at"]) ? true : false,
                              helperText: errMsg[index] && errMsg[index]["end_at"]
                            }
                          }}
                          value={Boolean(education.end_at) ? dayjs(education.end_at) : undefined}
                          onChange={(value) => {
                            setFormValue(prev => {
                              prev.educations[index] = {
                                ...prev.educations[index],
                                ["end_at"]: value?.format() as string
                              }
                              return {
                                ...prev
                              }
                            })
                          }}
                          disabled={!education.is_graduated}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  {index === (formValue.educations.length - 1) && (
                    <Button
                      variant="text"
                      startIcon={<AddRounded fontSize="small" />}
                      size="small"
                      onClick={addMoreEducation}
                    >
                      Tambah Pendidikan
                    </Button>
                  )}
                </Collapse>
              </Box>
            )
          })}
        </Box>
        {/* Skills Form */}
        <Box component={"div"}>
          <Typography
            component={"p"}
            variant="subtitle1"
            sx={{
              marginBottom: "0.5em",
              fontWeight: 550,
              color: grey[700]
            }}
          >
            Skills
          </Typography>
          <Grid container columnSpacing={2} rowSpacing={2}>
            {formValue.skills.map((value, index) => (
              <Grid item xs={12} sm={6} md={4}
                key={index}
              >
                <Box
                  component={"div"}
                  sx={{
                    display: "flex",
                    alignItems: "stretch",
                    columnGap: "0.5em",
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel id="skill_input_label"
                      size="small"
                      sx={{
                        color: errMsg[index] && errMsg[index]["skill_id"] ? red[500] : undefined,
                        "&.Mui-focused": {
                          color: errMsg[index] && errMsg[index]["skill_id"] ? red[500] : undefined,
                        }
                      }}
                    >
                      Skill
                    </InputLabel>
                    <Select
                      labelId="skill_input_label"
                      name="skill"
                      label="Skill"
                      size="small"
                      value={Boolean(value.skill_id) ? String(value.skill_id) : ''}
                      onChange={(event: SelectChangeEvent) => {
                        setFormValue(prev => {
                          prev.skills[index].skill_id = Number(event.target.value)
                          return {
                            ...prev,
                          }
                        })
                      }}
                      error={errMsg[index] && Boolean(errMsg[index]["skill_id"]) ? true : false}
                    >
                      {skillOption.length == 0 && (
                        <MenuItem
                          value={0}
                          disabled
                        >
                          <Typography component={"div"} variant="subtitle2">
                            Tidak ada skill yang tersedia dalam data master.
                          </Typography>
                        </MenuItem>
                      )}
                      {skillOption.map((skill, index) => {
                        return (
                          <MenuItem
                            key={index}
                            value={skill.id}
                            disabled={formValue.skills.some(option => option.skill_id === skill.id)}
                          >
                            <Box component={"div"}
                              sx={{
                                display: "flex",
                                columnGap: "0.5em"
                              }}
                            >
                              <Typography variant="subtitle2">
                                {skill.name}
                              </Typography>
                              <Box component={"img"}
                                src={`${HOST.main}${skill.skill_icon_image_path.replace("/api/v1", "")}`}
                                width={20}
                                height={20}
                                sx={{
                                  objectFit: "contain"
                                }}
                              />
                            </Box>
                          </MenuItem>
                        )
                      })}
                    </Select>
                    {errMsg[index] && errMsg[index]["skill_id"] && (
                      <FormHelperText sx={{ color: red[500] }}>{errMsg[index]["skill_id"]}</FormHelperText>
                    )}
                  </FormControl>
                  <Box component={"div"}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {index !== 0 && (
                      <IconButton
                        color="error"
                        size="small"
                        onClick={deleteSkill(index)}
                      >
                        <Tooltip title="Hapus skill" placement="right">
                          <DeleteRounded />
                        </Tooltip>
                      </IconButton>
                    )}
                    {index == formValue.skills.length - 1 && (
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={addMoreSkill}
                      >
                        <Tooltip title="Tambah skill" placement="right">
                          <AddRounded />
                        </Tooltip>
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* <SkillsForm formValue={formValue.skills} setFormValue={setFormValue} errMsg={errMsg} /> */}
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
    </Box>
  )
}