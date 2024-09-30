import {
  BrowseGallery,
  Dashboard,
  MenuRounded,
  NotificationsNone,
  PublishedWithChanges,
} from "@mui/icons-material";
import {
  AppBar,
  Menu,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import SimpleEmphasis from "../../Molecules/Texts/SimpleEmphasis";
import { grey, lightBlue } from "@mui/material/colors";
import { Link as ReactRouterLink } from "react-router-dom";

export default function DashboardNavigation() {
  /* state */
  const [anchorElement, setAnchorElement] = useState<{
    profileMenu: HTMLElement | null;
    navigationMenu: HTMLElement | null;
  }>({ profileMenu: null, navigationMenu: null });
  const openMenu = {
    profileMenu: Boolean(anchorElement.profileMenu),
    navigationMenu: Boolean(anchorElement.navigationMenu),
  };
  /* event handler */
  /* Handler */
  const menuTrigger = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorElement((prev) => ({ ...prev, profileMenu: event.currentTarget }));
  };
  const navigationMenuOnClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElement((prev) => ({
      ...prev,
      navigationMenu: event.currentTarget,
    }));
  };
  return (
    <AppBar
      sx={{
        borderBottom: "1px solid #dedede",
        backgroundColor: "white",
        boxShadow: "none",
        position: "fixed",
        // zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Toolbar
          variant="dense"
          disableGutters
          sx={{
            justifyContent: "space-between",
            paddingX: "1em",
          }}
        >
          <Box
            component={"div"}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton onClick={navigationMenuOnClick}>
              <MenuRounded />
            </IconButton>
            {/* navigation menu */}
            <Menu
              open={openMenu.navigationMenu}
              anchorEl={anchorElement.navigationMenu}
              onClose={() =>
                setAnchorElement((prev) => ({ ...prev, navigationMenu: null }))
              }
              slotProps={{
                paper: {
                  sx: {
                    minWidth: "15em",
                  },
                },
              }}
              sx={{
                marginTop: "0.5em",
              }}
            >
              <MenuItem
                component={ReactRouterLink}
                to={"/candidates/profile-overview"}
              >
                <ListItemIcon>
                  <Dashboard fontSize="small" sx={{ color: "#045a55" }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="subtitle2">Profile Overview</Typography>
                </ListItemText>
              </MenuItem>
              <Divider sx={{ marginY: "0.5em" }} />
              <Typography
                variant="caption"
                sx={{
                  paddingLeft: "1.5em",
                  color: grey[600],
                  fontStyle: "italic",
                }}
              >
                Applications
              </Typography>
              <MenuItem
                component={ReactRouterLink}
                to={"/candidates/application-status"}
              >
                <ListItemIcon>
                  <BrowseGallery fontSize="small" sx={{ color: "#045a55" }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="subtitle2">
                    Application Status
                  </Typography>
                </ListItemText>
              </MenuItem>
              <MenuItem
                component={ReactRouterLink}
                to={"/candidates/application-offers"}
              >
                <ListItemIcon>
                  <PublishedWithChanges
                    fontSize="small"
                    sx={{ color: "#045a55" }}
                  />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="subtitle2">
                    Application Offers
                  </Typography>
                </ListItemText>
              </MenuItem>
            </Menu>
            <Typography
              component={"span"}
              sx={{
                marginX: "0.5em",
                color: "#747474",
                fontSize: "1.1em",
              }}
            >
              <SimpleEmphasis text={"Future "} textColor="#06816d" />
              Interns
            </Typography>
          </Box>
          <Box
            component={"div"}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Tooltip
              title="Notifications"
              sx={{
                marginX: "0.5em",
              }}
            >
              <IconButton>
                <NotificationsNone />
              </IconButton>
            </Tooltip>
            <Tooltip title="Account: [:name][:email]" onClick={menuTrigger}>
              <Avatar
                alt="Name"
                src={"/broken.img"}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#06816d",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
            {/* profile menu */}
            <Menu
              open={openMenu.profileMenu}
              anchorEl={anchorElement.profileMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              onClose={() =>
                setAnchorElement((prev) => ({ ...prev, profileMenu: null }))
              }
              slotProps={{
                paper: {
                  sx: {
                    minWidth: "12em",
                    marginTop: "1em",
                    boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                    border: "1px solid #d4d4d4",
                  },
                },
              }}
            >
              <Stack
                direction={"column"}
                sx={{
                  paddingX: "0.5em",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 550,
                    letterSpacing: "0.03em",
                    color: grey[700],
                  }}
                >
                  Fatkhur Rozak
                </Typography>
                <Typography variant="caption">fatkhurawe@gmail.com</Typography>
                <Divider sx={{ marginY: "0.5em" }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    component={ReactRouterLink}
                    to={"/"}
                    variant="text"
                    size="small"
                    sx={{ color: lightBlue[900] }}
                  >
                    Homepage
                  </Button>
                  <Button variant="outlined" color="secondary" size="small">
                    Sign out
                  </Button>
                </Box>
              </Stack>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
