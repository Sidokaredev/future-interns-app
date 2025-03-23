import { LocationOnRounded, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { FiltersType } from "../../../pages/vacancy/page";
import { EMPLOYEE_TYPE, LINE_INDUSTRY } from "../../../pages/employers/constants";

export default function VacancyFilters({
  // filters,
  setFilters
}: {
  // filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}) {
  /* state */
  const [filtersValue, setFiltersValue] = useState<FiltersType>({ keyword: "", line_industry: "", employee_type: "", location: "" });

  /* handlers */
  const filtersOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fieldName = event.target.name;
    setFiltersValue(prev => ({
      ...prev,
      [fieldName]: event.target.value
    }))
  }
  return (
    <Box
      component={"div"}
      sx={{
        border: "1px solid #e6f2f0",
        borderRadius: "0.4em",
        padding: "1em",
      }}
    >
      <form onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFilters(filtersValue);
      }}>
        <Stack spacing={1}>
          <Box component={"div"}>
            <InputLabel htmlFor="search-by-company">
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Search
              </Typography>
            </InputLabel>
            <TextField
              id="search-by-company"
              name="keyword"
              placeholder="Enter job position or company name"
              size="small"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              fullWidth
              sx={{
                marginY: "0.2em",
              }}
              value={filtersValue.keyword}
              onChange={filtersOnChange}
            />
          </Box>
          <Box component={"div"}>
            <InputLabel htmlFor="search-by-location">
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Location
              </Typography>
            </InputLabel>
            <TextField
              id="search-by-location"
              name="location"
              placeholder="Enter location by City or Province"
              size="small"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnRounded fontSize="small" />
                  </InputAdornment>
                ),
              }}
              fullWidth
              sx={{
                marginY: "0.2em",
              }}
              value={filtersValue.location}
              onChange={filtersOnChange}
            />
          </Box>
          <Box component={"div"}>
            <InputLabel htmlFor="search-by-category">
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Line Industry
              </Typography>
            </InputLabel>
            <Select
              id="search-by-category"
              name="line_industry"
              size="small"
              fullWidth
              MenuProps={{
                disableScrollLock: true,
              }}
              sx={{
                marginY: "0.2em",
              }}
              value={filtersValue.line_industry}
              onChange={(event: SelectChangeEvent<string>) => {
                let fieldName = event.target.name;
                let value = event.target.value;
                setFiltersValue(prev => ({ ...prev, [fieldName]: value }));
              }}
            >
              {LINE_INDUSTRY.map((value, index) => (
                <MenuItem key={index} value={value}>{value}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box component={"div"}>
            <InputLabel>
              <Typography variant="subtitle1" fontWeight={"bold"}>
                Employee Type
              </Typography>
            </InputLabel>
            <FormGroup
              sx={{
                marginY: "0.2em",
              }}
            >
              {EMPLOYEE_TYPE.map((value, index) => (
                <FormControlLabel
                  key={index}
                  name="employee_type"
                  control={
                    <Checkbox
                      name="employee_type"
                      checked={filtersValue.employee_type === value}
                      sx={{ padding: "3px 9px", color: "#cde6e2" }}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        let fieldName = event.target.name;
                        setFiltersValue(prev => ({ ...prev, [fieldName]: event.target.checked ? value : "" }))
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color={"#777777"}>
                      {value}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          </Box>
          <Box component={"div"} sx={{ marginTop: "1em" }}>
            <Button type="submit" variant="contained" fullWidth sx={{ marginY: "0.5em" }}>
              Apply Filter
            </Button>
            <Button variant="text" fullWidth sx={{ marginY: "0.5em" }}
              onClick={() => {
                setFilters({
                  keyword: "",
                  line_industry: "",
                  employee_type: "",
                  location: "",
                })
                setFiltersValue({
                  keyword: "",
                  line_industry: "",
                  employee_type: "",
                  location: "",
                })
              }}
            >
              Reset Filter
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}
