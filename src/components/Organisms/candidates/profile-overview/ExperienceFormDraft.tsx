import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, InputBase, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material"
import { MobileDatePicker } from "@mui/x-date-pickers"
import { ExperienceFormType } from "../../../../pages/candidates/types"
import { grey, lightBlue, red } from "@mui/material/colors";
import { DatePickerOnChange, FileOnChange, InputOnChangeV2, SelectOnChange } from "../../../../pages/global-helpers";
import { jobTypes } from "../../../../pages/candidates/constants";
import dayjs from "dayjs";
import { UploadRounded } from "@mui/icons-material";
import { FormEvent, useState } from "react";

export default function ExperienceFormDraft({
  formValue,
  setFormValue,
  errMsg,
  onSubmit,
  loading,
}: {
  formValue: ExperienceFormType;
  setFormValue: React.Dispatch<React.SetStateAction<ExperienceFormType>>;
  errMsg: { [key: string]: string[] };
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
}) {
  /* state */
  const [errMsgFile, setErrMsgFile] = useState<Record<string, string>>({})
  const [filePreview, setFilePreview] = useState<Record<string, { src: string, filename: string }>>({})
  return (
    <Box component={"div"}
    >
      <Typography component={"p"}
        variant="subtitle2"
        sx={{
          marginBottom: "1em",
          fontWeight: 550,
          color: grey[700],
        }}
      >
        Your Experience Data
      </Typography>
      <form onSubmit={onSubmit}>
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
              onChange={InputOnChangeV2(setFormValue)}
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
              onChange={InputOnChangeV2(setFormValue)}
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
              onChange={InputOnChangeV2(setFormValue)}
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
                onChange={SelectOnChange(setFormValue, undefined, {
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
                      [event.target.name]: value,
                      ["end_at"]: new Date(Date.now()).toISOString()
                    }))
                  } else {
                    setFormValue(prev => ({
                      ...prev,
                      [event.target.name]: value,
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
                onChange={DatePickerOnChange("start_at", setFormValue)}
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
                onChange={DatePickerOnChange("end_at", setFormValue)}
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
                onChange={FileOnChange(setFilePreview, setFormValue, setErrMsgFile)}
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
              </FormHelperText>) : filePreview["attachment_document"] ? (
                <FormHelperText component={"a"}
                  target="_blank"
                  href={filePreview["attachment_document"].src}
                  rel="noopener noreferrer"
                  sx={{ color: "#06816d", textDecoration: "none" }}
                >
                  view your uploaded attachment document
                </FormHelperText>
              ) : formValue["attachment_document_path"] ? (
                <FormHelperText component={"a"}
                  target="_blank"
                  href={`http://localhost:3000${formValue["attachment_document_path"]}`}
                  sx={{ color: lightBlue[500], textDecoration: "none" }}
                >
                  view your current attachment document
                </FormHelperText>
              ) : ""}
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
              onChange={InputOnChangeV2(setFormValue)}
              error={Boolean(errMsg["description"])}
              helperText={errMsg["description"] ?? ""}
            />
          </Grid>
          <Grid item xs={12}>
            <Box component={"div"}
              sx={{
                display: "flex",
                justifyContent: { md: "end" }
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={loading}
                sx={{
                  minWidth: { xs: "100%", md: "10em" }
                }}
              >
                {loading ? (<CircularProgress size={20} />) : ("Submit")}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box >
  )
}