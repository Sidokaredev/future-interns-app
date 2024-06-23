import React, { useState } from "react";
/* Material UI */
import { Avatar, Box, Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Tooltip, Typography } from "@mui/material";
import { ArrowDropDown, Logout, Person, Settings } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { styled } from '@mui/material/styles';
import _EMITTER from "../../../events";

export default function NavigationProfile({ sxProps } : { sxProps?: any }) {
  /* Styled Elements */
  const NavigationMenuItem: any = styled(MenuItem)({
    '&:hover': {
      color: '#045a55',
    }
  });
  /* States */
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const menuOpen = Boolean(anchorEl)
  /* Handler Functions */
  const _nameOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const menuOnClose = () => setAnchorEl(null)

  const isLoggedIn = false
  return (
    <Box>
      {/* Authenticated */}
      {isLoggedIn &&
      <Stack direction={'row'} spacing={1}>
        <Tooltip title="Profile Picture" placement="left" arrow>
          <Avatar
            sx={{ ...sxProps.avatar }}>
              <Typography variant="body1" sx={{ ...sxProps.avatar }}>FI</Typography>
          </Avatar>
        </Tooltip>
          <Button sx={{ ...sxProps.font }}
            endIcon={<ArrowDropDown />}
            onClick={_nameOnClick}>
              Hi, Fatkhur
          </Button>
      </Stack>}
      {/* Unauthenticated */}
      {!isLoggedIn &&
      <Stack direction={'row'}
        spacing={2}
      >
        <Button
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
      </Stack>}
      {/* Menu Items */}
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
    </Box>
  )
}