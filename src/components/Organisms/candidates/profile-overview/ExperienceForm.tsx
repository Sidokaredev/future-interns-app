import { UploadRounded } from "@mui/icons-material";
import { Box, Button, FormControl, FormHelperText, Grid, InputBase, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { MobileDatePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { ExperienceFormType, SocialFormType } from "../../../../pages/candidates/types";
import { DatePickerOnChange, FileOnChange, InputOnChangeV2, SelectOnChange } from "../../../../pages/global-helpers";
import dayjs from "dayjs";

export default function ExperiencesForm({
  formValue,
  setFormValue,
  errMsg
}: {
  formValue: ExperienceFormType
  setFormValue: React.Dispatch<React.SetStateAction<{ experience: ExperienceFormType, socials: SocialFormType[] }>>
  errMsg: Record<string, string | string[]>
}) {
  /* state */
  const [filePreview, setFilePreview] = useState<Record<string, { src: string, filename: string }>>({})
  const [errMsgFile, setErrMsgFile] = useState<Record<string, string>>({})
  /* constant */
  const jobTypes = [
    "Staff",
    "Contract",
    "Freelance",
    "Internship",
  ]
  return (
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
            value={formValue.company_name}
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
            value={formValue.position}
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
            value={formValue.location_address}
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
              value={formValue.type}
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
              value={String(formValue.is_current)}
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
              value={Boolean(formValue.start_at) ? dayjs(formValue.start_at) : undefined}
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
              value={Boolean(formValue.end_at) ? dayjs(formValue.end_at) : undefined}
              onChange={DatePickerOnChange("end_at", setFormValue, "experience")}
              disabled={formValue.is_current}
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
            value={formValue.description}
            onChange={InputOnChangeV2(setFormValue, "experience")}
            error={Boolean(errMsg["description"])}
            helperText={errMsg["description"] ?? ""}
          />
        </Grid>
      </Grid>
    </Box>
  )
}