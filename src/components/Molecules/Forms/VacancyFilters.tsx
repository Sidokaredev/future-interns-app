import { Search } from "@mui/icons-material";
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
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function VacancyFilters() {
  return (
    <Box
      component={"div"}
      sx={{
        border: "1px solid #e6f2f0",
        borderRadius: "0.4em",
        padding: "1em",
      }}
    >
      <Stack spacing={1}>
        <Box component={"div"}>
          <InputLabel htmlFor="search-by-company">
            <Typography variant="subtitle1" fontWeight={"bold"}>
              Search Company
            </Typography>
          </InputLabel>
          <TextField
            id="search-by-company"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              marginY: "0.2em",
            }}
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
            size="small"
            fullWidth
            MenuProps={{
              disableScrollLock: true,
            }}
            sx={{
              marginY: "0.2em",
            }}
          >
            <MenuItem value="">IT and Technology</MenuItem>
            <MenuItem value="">Financial</MenuItem>
            <MenuItem value="">Construction and Real Estate</MenuItem>
            <MenuItem value="">Insurance</MenuItem>
            <MenuItem value="">Retail and E-commerce</MenuItem>
            <MenuItem value="">Entertainment and Media</MenuItem>
            <MenuItem value="">Transportation and Logistics</MenuItem>
            <MenuItem value="">Telecommunications</MenuItem>
            <MenuItem value="">Education</MenuItem>
            <MenuItem value="">Legal Services</MenuItem>
          </Select>
        </Box>
        <Box component={"div"}>
          <InputLabel htmlFor="search-by-location">
            <Typography variant="subtitle1" fontWeight={"bold"}>
              Location
            </Typography>
          </InputLabel>
          <Select
            id="search-by-location"
            size="small"
            fullWidth
            MenuProps={{
              disableScrollLock: true,
            }}
            sx={{
              marginY: "0.2em",
            }}
          >
            <MenuItem value="">Fetch from database</MenuItem>
          </Select>
        </Box>
        <Box component={"div"}>
          <InputLabel>
            <Typography variant="subtitle1" fontWeight={"bold"}>
              Type
            </Typography>
          </InputLabel>
          <FormGroup
            sx={{
              marginY: "0.2em",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox sx={{ padding: "3px 9px", color: "#cde6e2" }} />
              }
              label={
                <Typography variant="body2" color={"#777777"}>
                  On Site
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox sx={{ padding: "3px 9px", color: "#cde6e2" }} />
              }
              label={
                <Typography variant="body2" color={"#777777"}>
                  Remote
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox sx={{ padding: "3px 9px", color: "#cde6e2" }} />
              }
              label={
                <Typography variant="body2" color={"#777777"}>
                  Full Time
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox sx={{ padding: "3px 9px", color: "#cde6e2" }} />
              }
              label={
                <Typography variant="body2" color={"#777777"}>
                  Part Time
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox sx={{ padding: "3px 9px", color: "#cde6e2" }} />
              }
              label={
                <Typography variant="body2" color={"#777777"}>
                  Freelance
                </Typography>
              }
            />
          </FormGroup>
        </Box>
        <Box component={"div"} sx={{ marginTop: "1em" }}>
          <Button variant="contained" fullWidth sx={{ marginY: "0.5em" }}>
            Apply Filter
          </Button>
          <Button variant="text" fullWidth sx={{ marginY: "0.5em" }}>
            Reset Filter
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
