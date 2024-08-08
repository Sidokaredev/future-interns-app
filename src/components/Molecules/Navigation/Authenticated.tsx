import { useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Avatar, Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material"
import styled from "@emotion/styled"
import { ArrowDropDown, Logout, Person, Settings } from "@mui/icons-material"

export default function NavigationOnAuthenticated({ sxProps } : { sxProps?: any }) {
  /* Styled Components */
  const NavigationMenuItem: any = styled(MenuItem)({
    '&:hover': {
      color: '#045a55',
    }
  });
  /* State */
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const menuOpen = Boolean(anchorEl)
  /* Handler */
  const _nameOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const menuOnClose = () => setAnchorEl(null)
  /* Responsive Breakpoints */
  const matches = useMediaQuery('(min-width:500px)')
  return (
    <>
      {/* PROFILE BUTTON */}
      <Stack direction={'row'} spacing={1}>
        {/* CONDITIONAL RENDERING */}
        {matches ? (
          <Tooltip title="Profile Picture" placement="left" arrow>
            <Avatar
              sx={{ ...sxProps.avatar }}>
                <Typography variant="body1" sx={{ ...sxProps.avatar }}>FI</Typography>
            </Avatar>
          </Tooltip>
        ) : (
          ''
        )}
        {/* END CONDITIONAL RENDERING */}
        <Button sx={{ ...sxProps.font }}
          endIcon={<ArrowDropDown />}
          onClick={_nameOnClick}>
            Hi, Fatkhur
        </Button>
      </Stack>
      {/* PROFILE MENU */}
      <Menu
        disableScrollLock
        open={menuOpen}
        anchorEl={anchorEl}
        onClose={menuOnClose}
        autoFocus={false}
        slotProps={{
          paper: {
            style: {
              minWidth: '10rem',
              marginTop: '1rem',
            },
          },
        }}>
        <NavigationMenuItem>
          <ListItemIcon>
            <Person fontSize="small" sx={{ color: '#045a55' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body1" style={{ fontSize: 'small' }}>Profile</Typography>
          </ListItemText>
        </NavigationMenuItem>
        <NavigationMenuItem component={RouterLink} to="/">
          <ListItemIcon>
            <Settings fontSize="small" sx={{ color: '#045a55' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body1" style={{ fontSize: 'small' }}>Settings</Typography>
          </ListItemText>
        </NavigationMenuItem>
        <Divider />
        <MenuItem
          component={RouterLink}
          to="/"
          sx={{
            '&:hover': {
              color: '#045a55',
          },
          }}
          onClick={() => {
            // _EMITTER.emit('onDataUpdated', 'address-updated');
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: '#045a55' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body1" style={{ fontSize: 'small' }}>Logout</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}