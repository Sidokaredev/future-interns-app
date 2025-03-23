import {
  BrowseGallery,
  Dashboard,
  GroupWorkRounded,
  MenuRounded,
  NotificationsNone,
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
import { useEffect, useState } from "react";
import SimpleEmphasis from "../../Molecules/Texts/SimpleEmphasis";
import { grey, lightBlue } from "@mui/material/colors";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { DeleteSession, GetSession } from "../../../pages/global-helpers";
import RequestAPI from "../../../services/api/request";
import BaseAlert from "../../Molecules/Feedback/BaseAlert";

type UserAccountType = {
  fullname: string;
  email: string;
}

export default function DashboardNavigation({
  isFor,
}: {
  isFor: "candidate" | "employer";
}) {
  /* react-router-hook */
  const navigate = useNavigate()
  /* state */
  const [userAccount, setUserAccount] = useState<UserAccountType | null>(null);
  const [errAlert, setErrAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
  const [anchorElement, setAnchorElement] = useState<{
    profileMenu: HTMLElement | null;
    navigationMenu: HTMLElement | null;
  }>({ profileMenu: null, navigationMenu: null });
  const openMenu = {
    profileMenu: Boolean(anchorElement.profileMenu),
    navigationMenu: Boolean(anchorElement.navigationMenu),
  };
  /* event handler */
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
  /* static data */
  const menuItemsCandidate = [
    {
      icon: <Dashboard fontSize="small" sx={{ color: "#045a55" }} />,
      path: "/candidates/profile-overview",
      label: <Typography variant="subtitle2">Profile Overview</Typography>,
      divider: "Applications",
    },
    {
      icon: <BrowseGallery fontSize="small" sx={{ color: "#045a55" }} />,
      path: "/candidates/application-status",
      label: <Typography variant="subtitle2">Application Status</Typography>,
      divider: "none",
    },
    // {
    //   icon: <PublishedWithChanges fontSize="small" sx={{ color: "#045a55" }} />,
    //   path: "/candidates/application-offers",
    //   label: <Typography variant="subtitle2">Application Offers</Typography>,
    //   divider: "none",
    // },
  ];
  const menuItemsEmployer = [
    {
      icon: <Dashboard fontSize="small" sx={{ color: "#045a55" }} />,
      path: "/employers/profile-overview",
      label: <Typography variant="subtitle2">Profile Overview</Typography>,
      divider: "Vacancies",
    },
    {
      icon: <GroupWorkRounded fontSize="small" sx={{ color: "#045a55" }} />,
      path: "/employers/vacancies",
      label: <Typography variant="subtitle2">Manage Vacancies</Typography>,
      divider: "none",
    },
  ];
  useEffect(() => {
    (async () => {
      const [data, fail] = await RequestAPI.Send<UserAccountType>("/api/v1/accounts/user-account", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + GetSession("auth")
        }
      })
      if (fail != undefined) {
        return setErrAlert({ show: true, message: fail.message });
      }

      if (data != undefined) {
        return setUserAccount(data)
      }
    })()
  }, [])
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
          {/* Base Alert */}
          <BaseAlert
            show={errAlert.show}
            message={errAlert.message}
            setShow={setErrAlert}
          />
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
            {/* Dashboard navigation menu */}
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
              {/* Decide to use candidate or employer navigation items */}
              {isFor === "candidate"
                ? menuItemsCandidate.map((item, index) => {
                  return (
                    <Box
                      key={index}
                    >
                      <MenuItem
                        // key={index}
                        component={ReactRouterLink}
                        to={item.path}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText>
                          {item.label}
                        </ListItemText>
                      </MenuItem>
                      {item.divider !== "none" && (
                        <>
                          <Divider sx={{ marginY: "0.5em" }} />
                          <Typography
                            variant="caption"
                            sx={{
                              paddingLeft: "1.5em",
                              color: grey[600],
                              fontStyle: "italic",
                            }}
                          >
                            {item.divider}
                          </Typography>
                        </>
                      )}
                    </Box>
                  );
                })
                : menuItemsEmployer.map((item, index) => {
                  return (
                    <Box
                      key={index}
                    >
                      <MenuItem
                        // key={index}
                        component={ReactRouterLink}
                        to={item.path}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText>
                          {item.label}
                        </ListItemText>
                      </MenuItem>
                      {item.divider !== "none" && (
                        <>
                          <Divider sx={{ marginY: "0.5em" }} />
                          <Typography
                            variant="caption"
                            sx={{
                              paddingLeft: "1.5em",
                              color: grey[600],
                              fontStyle: "italic",
                            }}
                          >
                            {item.divider}
                          </Typography>
                        </>
                      )}
                    </Box>
                  );
                })}
              {/* <Divider sx={{ marginY: "0.5em" }} />
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
              </MenuItem> */}
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
            <Tooltip title={`${userAccount?.fullname} - ${userAccount?.email}`} onClick={menuTrigger}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#06816d",
                  cursor: "pointer",
                }}
              >
                {userAccount?.fullname.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
            {/* Profile Menu Dashboard */}
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
                  {userAccount?.fullname}
                </Typography>
                <Typography variant="caption">{userAccount?.email}</Typography>
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
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => {
                      DeleteSession("auth")
                      navigate("/accounts/auth")
                    }}
                  >
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
