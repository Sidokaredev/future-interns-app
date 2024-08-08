import { Link as RouterLink } from "react-router-dom";
import { Box, Link, Stack, Typography } from "@mui/material";

export default function FooterItems() {
  const footerItemStyles = {
    // transition: 'margin-top 0.3s ease',
    textDecoration: 'none',
    color: '#c2c2c2',
    '&:hover': {
      color: '#85fff7',
      // marginTop: '-0.3rem'
    }
  }
  return (
    <Box
      display={'flex'}
      flexDirection={{ xs: 'column', md: 'row' }}
      gap={{ xs: '2em', md: '0em' }}
      justifyContent={'space-between'}
    >
      {/* Footer Logo */}
      <Stack direction={'row'}
        spacing={2}
        alignItems={'center'}
        justifyContent={{ xs: 'start', sm: 'center', md: 'start' }}
      >
        <img src={'/Future Interns Logo.svg'} alt="Future Interns Logo" width={30} height={30} loading="lazy" />
        <Link component={RouterLink} to="/"
          style={{ textDecoration: 'none' }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={'bolder'}
            color={'white'}
          >
            Future Interns
          </Typography>
        </Link>
      </Stack>
      {/* Footer Items */}
      <Stack direction={{ xs: 'column', sm: 'row', md: 'row' }} justifyContent={'center'}
        spacing={{ xs: 1, sm: 2, md: 5 }}
      >
        <Link component={RouterLink} to={'/'} sx={footerItemStyles}>
          <Typography variant="subtitle2">
            How it works
          </Typography>
        </Link>
        <Link component={RouterLink} to={'/'} sx={footerItemStyles}>
          <Typography variant="subtitle2">
            Create Vacancies
          </Typography>
        </Link>
        <Link component={RouterLink} to={'/'} sx={footerItemStyles}>
          <Typography variant="subtitle2">
            About Us
          </Typography>
        </Link>
        <Link component={RouterLink} to={'/'} sx={footerItemStyles}>
          <Typography variant="subtitle2">
            Contact Us
          </Typography>
        </Link>
      </Stack>
    </Box>
  )
}