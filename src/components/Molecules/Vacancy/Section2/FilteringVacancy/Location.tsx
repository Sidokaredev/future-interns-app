import { Box, InputLabel, MenuItem, Select, Typography } from "@mui/material";

export default function SearchByLocation() {
  return (
    <>
      <Box
      >
        <InputLabel htmlFor="search-by-location">
          <Typography variant="subtitle1" fontWeight={'bold'}>Location</Typography>
        </InputLabel>
        <Select
          id="search-by-location"
          size="small"
          fullWidth
          MenuProps={{
            disableScrollLock: true
          }}
          sx={{
            marginY: '0.2em'
          }}
        >
          <MenuItem value="">Fetch from database</MenuItem>
        </Select>
      </Box>
    </>
  )
}