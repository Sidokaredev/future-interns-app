import { Box, InputAdornment, InputLabel, TextField, Typography } from "@mui/material"
import { Search } from "@mui/icons-material"

export default function SearchByCompany({
  useLabel = true
} : {
  useLabel?: boolean
}) {
  return (
    <>
      <Box
      >
        {useLabel ? (
          <InputLabel
          htmlFor="search-by-company"
        >
          <Typography variant="subtitle1" fontWeight={'bold'}>Search Company</Typography>
        </InputLabel>
        ) : (
          ''
        )}
        <TextField
          id="search-by-company"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
          }}
          sx={{
            marginY: '0.2em',
          }}
        />
      </Box>
    </>
  )
}