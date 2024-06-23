/* Material UI */
import { Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NavigationLogo({ sxProps } : { sxProps?: any }) {
  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      spacing={2}
    >
      <img src={'/Future Interns Logo.svg'} width={30} height={30} loading="lazy" />
      <Link component={RouterLink} to="/"
        style={{ textDecoration: 'none' }}>
        <Typography
          variant="h6"
          fontWeight={'bolder'}
          sx={{
            ...sxProps
          }}
        >
            Future Interns
        </Typography>
      </Link>
    </Stack>
  )
}