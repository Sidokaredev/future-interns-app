import React, { useState } from "react"
/* Material UI */
import { Box, Button, Menu, MenuItem, Stack, styled, Typography } from "@mui/material"
/* Material Icons */
import { ArrowDropDown } from "@mui/icons-material"
/* React Router */
import { Link as RouterLink } from "react-router-dom"

export default function NavigationItems({ sxProps } : { sxProps?: any }) {
  /* Styled Elements */
  const NavigationMenuItem: any = styled(MenuItem)({
    color: '#045a55',
    "&:hover": {
    },
  })
  const menuItemStyles = {
    transition: 'padding-left 0.3s ease', '&:hover': { fontWeight: 'bold', paddingLeft: '0.3rem' }
  }
  /* States */
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const menuOpen = Boolean(anchorEl)
  /* Handler Functions */
  const _supportOnMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const menuOnClose = () => setAnchorEl(null)
  return (
    <Box>
      <Stack direction={'row'}
        spacing={5}>
        <Button
          component={RouterLink}
          to="/">
          <Typography variant="body1"
            fontWeight={'bold'}
            letterSpacing={'0.04rem'}
            sx={{
              ...sxProps,
            }}>
            Home
          </Typography>
        </Button>
        <Button
          component={RouterLink}
          to="/vacancies">
          <Typography variant="body1"
            fontWeight={'bold'}
            letterSpacing={'0.04rem'}
            sx={{
              ...sxProps,
            }}
          >
            Vacancy
          </Typography>
        </Button>
        <Button
          onMouseOver={_supportOnMouseEnter}
          endIcon={<ArrowDropDown sx={{ ...sxProps }} />}>
          <Typography variant="body1"
            fontWeight={'bold'}
            letterSpacing={'0.04rem'}
            sx={{
              ...sxProps,
            }}
          >
            Support
          </Typography>
        </Button>
      </Stack>
      <Menu
        disableScrollLock
        open={menuOpen}
        anchorEl={anchorEl}
        onClose={menuOnClose}
        autoFocus={false}
        MenuListProps={{
          onMouseLeave: menuOnClose,
        }}
        slotProps={{
          paper: {
            style: {
              minWidth: '10rem',
              marginTop: '1.2rem',
            },
          },
        }}
      >
        <NavigationMenuItem component={RouterLink} to="/">
          <Typography variant="subtitle2" sx={menuItemStyles}>Guides</Typography>
        </NavigationMenuItem>
        <NavigationMenuItem component={RouterLink} to="/">
          <Typography variant="subtitle2" sx={menuItemStyles}>FAQs</Typography>
        </NavigationMenuItem>
        <NavigationMenuItem component={RouterLink} to="/">
          <Typography variant="subtitle2" sx={menuItemStyles}>Contact</Typography>
        </NavigationMenuItem>
      </Menu>
    </Box>

  )
}