import { AddRounded, DeleteRounded, ExpandLessRounded, ExpandMoreRounded, MoreVertRounded } from "@mui/icons-material";
import { Box, Button, Collapse, FormControl, FormHelperText, Grid, IconButton, InputLabel, Menu, MenuItem, MenuList, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { MobileDatePicker } from "@mui/x-date-pickers";
import React, { ChangeEvent, useState } from "react";
import { ArrayEducationFormType } from "../../../../pages/candidates/types";
import dayjs from "dayjs";
import { DEFAULT_EDUCATION_FORM } from "../../../../pages/candidates/constants";

export default function EducationsForm({
  formValue,
  setFormValue,
  errMsg
}: {
  formValue: ArrayEducationFormType
  setFormValue: React.Dispatch<React.SetStateAction<{ educations: ArrayEducationFormType, skills: { skill_id: number }[] }>>
  errMsg: { [key: number]: Record<string, string> }
}) {
  /* state */
  const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({})
  // const openMenu = Boolean(anchorEl)
  const [collapseIn, setCollapseIn] = useState<Record<string, boolean>>({})

  /* constant */
  const degreeList = [
    "SMA/SMK",
    "Bachelor's Degree (S1/D4)",
    "Master's Degree (S2",
    "Doctoral Degree / Ph.D. (S3)"
  ]

  /* event handler */
  const addMoreEducation = () => {
    setFormValue(prev => ({
      ...prev,
      educations: [...prev.educations, DEFAULT_EDUCATION_FORM]
    }))
    setTimeout(() => {
      setCollapseIn(prev => ({
        ...prev,
        [`collapsed${formValue.length}`]: true
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
  return (
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
          marginBottom: "0.5em",
          fontWeight: 550,
          color: grey[700]
        }}
      >
        Educations
      </Typography>
      {formValue.map((education, index) => {
        const collapsedKey = `collapsed${index}`
        return (
          <Box component={"div"}
            key={index}
          >
            {/* education preview */}
            {formValue.length > 1 && (
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
                        <Typography component={"p"} variant="caption">Expand Form</Typography>
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
                        <Typography component={"p"} variant="caption" sx={{ color: red[500] }}>Delete</Typography>
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
            <Collapse in={formValue.length === 1 ? true : collapseIn[collapsedKey]} orientation="vertical">
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
                    label="University"
                    placeholder="University name (no abbreviations)"
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
                    label="University Address"
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
                    label="Major"
                    placeholder="Your field of study or major"
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
                      Degree
                    </InputLabel>
                    <Select
                      labelId="education_degree"
                      name="degree"
                      label="Degree"
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
                      <MenuItem value={"true"}>Graduated</MenuItem>
                      <MenuItem value={"false"}>Incomplete</MenuItem>
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
                    label="GPA"
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
                      format="DD/MM/YYYY"
                      label="Start at"
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
                      format="DD/MM/YYYY"
                      label="End at"
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
              {index === (formValue.length - 1) && (
                <Button
                  variant="text"
                  startIcon={<AddRounded fontSize="small" />}
                  size="small"
                  onClick={addMoreEducation}
                >
                  Add more education
                </Button>
              )}
            </Collapse>
          </Box>
        )
      })}
    </Box>
  )
}