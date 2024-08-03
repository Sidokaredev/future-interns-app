import { Box, Checkbox, FormControlLabel, FormGroup, InputLabel, Typography } from "@mui/material";

export default function SearchByType() {
  return (
    <>
      <Box
      >
        <InputLabel>
          <Typography variant="subtitle1" fontWeight={'bold'}>Type</Typography>
        </InputLabel>
        <FormGroup
          sx={{
            marginY: '0.2em'
          }}
        >
          <FormControlLabel
            control={<Checkbox sx={{ padding: '3px 9px', color: '#cde6e2' }} />}
            label={<Typography variant="body2" color={'#777777'}>On Site</Typography>}
          />
          <FormControlLabel
            control={<Checkbox sx={{ padding: '3px 9px', color: '#cde6e2' }} />}
            label={<Typography variant="body2" color={'#777777'}>Remote</Typography>}
          />
          <FormControlLabel
            control={<Checkbox sx={{ padding: '3px 9px', color: '#cde6e2' }} />}
            label={<Typography variant="body2" color={'#777777'}>Full Time</Typography>}
          />
          <FormControlLabel
            control={<Checkbox sx={{ padding: '3px 9px', color: '#cde6e2' }} />}
            label={<Typography variant="body2" color={'#777777'}>Part Time</Typography>}
          />
          <FormControlLabel
            control={<Checkbox sx={{ padding: '3px 9px', color: '#cde6e2' }} />}
            label={<Typography variant="body2" color={'#777777'}>Freelance</Typography>}
          />
        </FormGroup>
      </Box>
    </>
  )
}