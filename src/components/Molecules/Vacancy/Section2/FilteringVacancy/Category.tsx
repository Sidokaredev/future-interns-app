import { Box, InputLabel, MenuItem, Select, Typography } from "@mui/material";

export default function SearchByCategory() {
  return (
    <>
      <Box
      >
        <InputLabel htmlFor="search-by-category">
          <Typography variant="subtitle1" fontWeight={'bold'}>Line Industry</Typography>
        </InputLabel>
        <Select
          id="search-by-category"
          size="small"
          fullWidth
          MenuProps={{
            disableScrollLock: true
          }}
          sx={{
            marginY: '0.2em'
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
    </>
  )
}