import { Button, Stack, Typography, useMediaQuery } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"

export default function NavigationOnUnauthenticated({ sxProps } : { sxProps?: any }) {
  /* Responsive Breakpoints */
  const isMobile = useMediaQuery('(max-width:500px)')
  return (
    <>
      {isMobile ? (
        <Button
          component={RouterLink}
          to={'/accounts/auth'}
          variant="text"
          size="small"
          sx={{
            minWidth: '6em',
            paddingY: '0.1em',
            ...sxProps.font
          }}>
          <Typography variant="subtitle1">Sign In</Typography>
        </Button>
      ) : (
        <Stack direction={'row'}
          spacing={2}
        >
          <Button
            component={RouterLink}
            to={'/accounts/auth'}
            variant="text"
            sx={{ ...sxProps.font }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            sx={{ ...sxProps.button }}
          >
            Register
          </Button>
        </Stack>
      )}
    </>
  )
}