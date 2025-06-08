import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { MobileDatePicker } from "@mui/x-date-pickers"
import { ChangeEvent, FormEvent } from "react";
import { EducationFormType } from "../../../../pages/candidates/types";
import { InputOnChangeV2, SelectOnChange } from "../../../../pages/global-helpers";
import { grey, red } from "@mui/material/colors";
import { DEGREE_LIST } from "../../../../pages/candidates/constants";
import dayjs from "dayjs";

export default function EducationForm({
  formValue,
  setFormValue,
  errMsg,
  onSubmit,
  loading
}: {
  formValue: EducationFormType;
  setFormValue: React.Dispatch<React.SetStateAction<EducationFormType>>;
  errMsg: { [key: string]: string[] };
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean
}) {
  return (
    <form onSubmit={onSubmit}>
      <Typography component={"p"}
        variant="subtitle1"
        sx={{
          marginBottom: "1em",
          fontWeight: 550,
          color: grey[700]
        }}
      >
        Data Pendidikan
      </Typography>
      <Grid container className="education-form" columnSpacing={2}
        rowSpacing={2}
      >
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            type="text"
            name="university"
            label="Nama Perguruan Tinggi"
            placeholder="Nama perguruan tinggi (bukan singkatan)"
            size="small"
            autoComplete="off"
            fullWidth
            value={formValue.university}
            onChange={InputOnChangeV2(setFormValue)}
            error={Boolean(errMsg["university"])}
            helperText={errMsg["university"] ?? ""}
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
            value={formValue.address}
            onChange={InputOnChangeV2(setFormValue)}
            error={Boolean(errMsg["address"])}
            helperText={errMsg["address"] ?? ""}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            type="text"
            name="major"
            label="Jurusan"
            placeholder="e.g Teknik Rekayasa Manufaktur"
            size="small"
            autoComplete="off"
            fullWidth
            value={formValue.major}
            onChange={InputOnChangeV2(setFormValue)}
            error={Boolean(errMsg["major"])}
            helperText={errMsg["major"] ?? ""}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel id="education_degree"
              size="small"
              sx={{
                color: errMsg["degree"] ? red[500] : undefined,
                "&.Mui-focused": {
                  color: errMsg["degree"] ? red[500] : undefined,
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
              value={formValue.degree}
              onChange={SelectOnChange(setFormValue, "", { coerceToNumber: false })}
              error={Boolean(errMsg["degree"])}
            >
              {DEGREE_LIST.map((degree, index) => (
                <MenuItem
                  key={index}
                  value={degree}
                >
                  {degree}
                </MenuItem>
              ))}
            </Select>
            {errMsg["degree"] && (
              <FormHelperText sx={{ color: red[500] }}>{errMsg["degree"]}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel id="is_graduated"
              size="small"
              sx={{
                color: errMsg["is_graduated"] ? red[500] : undefined,
                "&.Mui-focused": {
                  color: errMsg["is_graduated"] ? red[500] : undefined,
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
              value={String(formValue.is_graduated)}
              onChange={SelectOnChange(setFormValue, "", { coerceToNumber: false, coerceToBoolean: true })}
              error={Boolean(errMsg["is_graduated"])}
            >
              <MenuItem value={"true"}>Telah Lulus</MenuItem>
              <MenuItem value={"false"}>Belum Selesai</MenuItem>
            </Select>
            {errMsg["is_graduated"] && (
              <FormHelperText sx={{ color: red[500] }}>{errMsg["is_graduated"]}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={6} md={2}>
          <TextField
            type="number"
            name="gpa"
            label="IPK"
            placeholder="e.g., 3.5/4.0 or 4.2/5.0"
            size="small"
            autoComplete="off"
            fullWidth
            value={formValue.gpa}
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
                return {
                  ...prev,
                  [event.target.name]: Number(value)
                }
              })
            }}
            error={Boolean(errMsg["gpa"])}
            helperText={errMsg["gpa"]}
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
              label="Tahun Masuk"
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  error: Boolean(errMsg["start_at"]),
                  helperText: errMsg["start_at"]
                }
              }}
              value={Boolean(formValue.start_at) ? dayjs(formValue.start_at) : undefined}
              onChange={(value) => {
                setFormValue(prev => {
                  return {
                    ...prev,
                    start_at: value?.format() as string
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
              // openTo="year"
              views={["year"]}
              format="YYYY"
              label="Tahun Selesai"
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  error: Boolean(errMsg["end_at"]),
                  helperText: errMsg["end_at"]
                }
              }}
              value={Boolean(formValue.end_at) ? dayjs(formValue.end_at) : undefined}
              onChange={(value) => {
                setFormValue(prev => {
                  return {
                    ...prev,
                    end_at: value?.format() as string
                  }
                })
              }}
            // disabled={!formValue.is_graduated}
            />
          </Box>
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
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}