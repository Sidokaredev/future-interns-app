import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { EMPLOYEE_TYPE, LINE_INDUSTRY, MIN_EXPERIENCE, WORK_ARRANGEMENT } from "../../../../pages/employers/constants";
import React, { ChangeEvent, FormEvent } from "react";
import { VacancyFormType } from "../../../../pages/employers/types";
import { InputOnChangeV2, SelectOnChange } from "../../../../pages/global-helpers";

export default function VacancyForm({
  formValue,
  setFormValue,
  errMsg,
  onSubmit,
  loading,
}: {
  formValue: VacancyFormType;
  setFormValue: React.Dispatch<React.SetStateAction<VacancyFormType>>;
  errMsg: { [key: string]: string[] };
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
}) {
  return (
    <Box component={"div"}>
      <form onSubmit={onSubmit}>
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
                type="submit"
                variant="contained"
                size="small"
                sx={{
                  minWidth: "10em",
                }}
                disabled={loading}
                endIcon={loading && <CircularProgress size={20} />}
              // onClick={() => setOpenDialog(true)}
              >
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}