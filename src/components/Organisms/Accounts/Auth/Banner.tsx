import { Box, Typography } from "@mui/material"

export default function AuthBanner() {
  return (
    <>
      <Box
        component={'div'}
        marginBottom={{ xs: 3 }}
        display={{ xs: 'none', md: 'block' }}
      >
        <Typography
          variant="h5"
          fontWeight={'bold'}
          color={'#51a799'}
        >
          Sign In
        </Typography>
      </Box>
    </>
  )
}