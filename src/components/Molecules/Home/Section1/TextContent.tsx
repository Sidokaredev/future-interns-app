import { Box, Stack, Typography } from "@mui/material";

export default function TextContent() {
  return (
    <Stack
      sx={{ textAlign: 'center', color: '#ffffff' }}>
      <Typography variant="h3"
        sx={{
          fontWeight: 'bolder'
        }}>
        Got Talent ?
      </Typography>
      <Typography variant="h3"
        sx={{
          fontWeight: 'bolder'
        }}>
        Meet Opportunity
      </Typography>
      <Box
        display={'flex'}
        justifyContent={'center'}
        marginTop={'1rem'}
      >
        <Typography variant="subtitle1" maxWidth={'35rem'} sx={{ color: '#d9d9d9' }}>
          Find Jobs, Employment & Career Opportunities. Some of the companies we've helped recruit excellent applicants over the years.
        </Typography>
      </Box>
    </Stack>
  )
}