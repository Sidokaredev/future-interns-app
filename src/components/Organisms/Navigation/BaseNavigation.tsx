import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  type SxProps,
  Typography,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import { Link as ReactRouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowDropDown,
  ContactsRounded,
  ExpandLess,
  ExpandMore,
  HelpRounded,
  Home,
  LoginRounded,
  Logout,
  MenuBookRounded,
  MenuRounded,
  Person,
  PersonAddAlt1Rounded,
  SupportAgentRounded,
  WorkRounded,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { DeleteSession, GetSession, onCloseSnackbar, SesssionChecker } from "../../../pages/global-helpers";
import RequestAPI from "../../../services/api/request";

type onScrollSxProps = {
  navigation: SxProps;
  font: SxProps;
  button: SxProps;
};

type AccountInformation = {
  identity: {
    name: string;
    type: string;
  };
  permissions: Record<string, boolean>;
  user: {
    email: string;
    fullname: string;
  };
};

export default function BaseNavigation() {
  /* react-router */
  const location = useLocation();
  const navigate = useNavigate();
  /* breakpoints */
  const mediumSize = useMediaQuery("(max-width: 900px)");
  /* state */
  const [account, setAccount] = useState<AccountInformation | null>(null);
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" });
  const [anchorEl, setAnchorEl] = useState<{
    supportMenuAnchor: HTMLElement | null;
    profileMenuAnchor: HTMLElement | null;
    mediumMenuNavigation: HTMLElement | null;
  }>({
    supportMenuAnchor: null,
    profileMenuAnchor: null,
    mediumMenuNavigation: null,
  });
  const openMenu = {
    supportMenuAnchor: Boolean(anchorEl.supportMenuAnchor),
    profileMenuAnchor: Boolean(anchorEl.profileMenuAnchor),
    mediumMenuNavigation: Boolean(anchorEl.mediumMenuNavigation),
  };
  const [mediumListOpen, setMediumListOpen] = useState<boolean>(false);
  const [sxProps, setSxProps] = useState<onScrollSxProps>({
    navigation: {},
    font: {},
    button: {},
  });
  /* event handler */
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 65 });
  const supportMenuMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((prev) => ({ ...prev, supportMenuAnchor: e.currentTarget }));
  };
  const profileMenuOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl((prev) => ({ ...prev, profileMenuAnchor: e.currentTarget }));
  };
  const mediumMenuNavigationOnClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl((prev) => ({ ...prev, mediumMenuNavigation: e.currentTarget }));
  };
  /* helpers */
  const currentPathDeterminer = (path: string): SxProps => {
    if (location.pathname === "/" && path === "home") {
      return {
        backgroundColor: "#e6f2f0",
        borderRight: "0.2em solid #06816d",
        ":hover": { backgroundColor: "#e6f2f0" },
      };
    } else if (location.pathname.includes(path) && path !== "home") {
      return {
        backgroundColor: "#e6f2f0",
        borderRight: "0.2em solid #06816d",
        ":hover": { backgroundColor: "#e6f2f0" },
      };
    }
    return { ":hover": { backgroundColor: "#e6f2f0" } };
  };
  const pathnameDeterminer = (type: string): string => {
    switch (type) {
      case 'candidate':
        return "/candidates/profile-overview";
      case 'employer':
        return "/employers/profile-overview";
      case 'administrator':
        return "/administrators/performance"
      default:
        return "/unmatched-pathname"
    }
  }

  /* constants */
  const isAuthenticated = SesssionChecker('auth');
  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    if (isAuthenticated) {
      (async () => {
        const [data, fail] = await RequestAPI.Send<AccountInformation>(
          "/api/v1/accounts/user-information",
          {
            method: "GET",
            headers: {
              "Authorization": "Bearer " + token
            }
          }
        );
        if (fail) {
          return setAlert({ show: true, message: fail.message });
        };
        if (data) {
          return setAccount(data);
        };
      })();
    }
  }, []);
  /* side effect */
  useEffect(() => {
    if (trigger) {
      setSxProps({
        navigation: {
          backgroundColor: "white",
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
        },
        font: { color: "#06816d" },
        button: {},
      });
    } else {
      setSxProps({
        navigation: {
          backgroundColor: "transparent",
        },
        font: {
          color: "white",
        },
        button: {
          backgroundColor: "white",
          color: "#06816d",
          "&:hover": {
            backgroundColor: grey[300],
          },
        },
      });
    }
  }, [trigger]);
  return (
    <Box
      component={"div"}
      sx={{
        width: "100%",
        position: "fixed",
        zIndex: 99,
        paddingY: "0.8em",
        transition: "background-color 0.3s ease-in-out",
        ...sxProps.navigation,
      }}
    >
      {/* Default Notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        message={alert.message}
        autoHideDuration={3000}
        onClose={onCloseSnackbar
          (setAlert)}
      />
      <Container
        disableGutters
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingX: mediumSize ? "0.5em" : undefined,
        }}
      >
        {/* navigation.logo */}
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          <Box
            component={"img"}
            src={"/Future Interns Logo.svg"}
            width={30}
            height={30}
            loading="lazy"
          />
          <Link
            component={ReactRouterLink}
            to={"/"}
            sx={{ textDecoration: "none", ...sxProps.font }}
          >
            <Typography variant="h6" fontWeight={"bolder"}>
              Future Interns
            </Typography>
          </Link>
        </Stack>
        {/* navigation.items */}
        {/* Breakpoints Actions */}
        {mediumSize ? (
          <>
            <IconButton onClick={mediumMenuNavigationOnClick}>
              <MenuRounded sx={sxProps.font} />
            </IconButton>
            <Menu
              open={openMenu.mediumMenuNavigation}
              anchorEl={anchorEl.mediumMenuNavigation}
              onClose={() =>
                setAnchorEl((prev) => ({ ...prev, mediumMenuNavigation: null }))
              }
              MenuListProps={{
                sx: {},
              }}
              slotProps={{
                paper: {
                  sx: {
                    minWidth: "15em",
                    marginTop: "1em",
                  },
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  paddingLeft: "1.5em",
                  color: grey[600],
                  fontStyle: "italic",
                }}
              >
                Account
              </Typography>
              {isAuthenticated ? (
                <Box component={"div"} className="menu-wrapper-no-fragment">
                  <MenuItem component={ReactRouterLink}
                    to={pathnameDeterminer(account?.identity.type as string)}>
                    <ListItemIcon>
                      <Person fontSize="small" sx={{ color: "#045a55" }} />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography variant="subtitle2">Dashboard</Typography>
                    </ListItemText>
                  </MenuItem>

                  {/* <MenuItem component={ReactRouterLink} to="/">
                    <ListItemIcon>
                      <Settings fontSize="small" sx={{ color: "#045a55" }} />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography variant="subtitle2">Settings</Typography>
                    </ListItemText>
                  </MenuItem> */}
                </Box>
              ) : (
                <Box component={"div"} className="menu-wrapper-no-fragment">
                  <MenuItem component={ReactRouterLink} to="/accounts/auth">
                    <ListItemIcon>
                      <LoginRounded
                        fontSize="small"
                        sx={{ color: "#045a55" }}
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography variant="subtitle2">Login</Typography>
                    </ListItemText>
                  </MenuItem>
                  <MenuItem component={ReactRouterLink} to="/accounts/create">
                    <ListItemIcon>
                      <PersonAddAlt1Rounded
                        fontSize="small"
                        sx={{ color: "#045a55" }}
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography variant="subtitle2">Register</Typography>
                    </ListItemText>
                  </MenuItem>
                </Box>
              )}
              <Typography
                variant="caption"
                sx={{
                  paddingLeft: "1.5em",
                  color: grey[600],
                  fontStyle: "italic",
                }}
              >
                Pages
              </Typography>
              <MenuItem
                component={ReactRouterLink}
                to="/"
                sx={currentPathDeterminer("home")}
              >
                <ListItemIcon>
                  <Home fontSize="small" sx={{ color: "#045a55" }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="subtitle2">Home</Typography>
                </ListItemText>
              </MenuItem>
              <MenuItem
                component={ReactRouterLink}
                to="/vacancy"
                sx={currentPathDeterminer("vacancy")}
              >
                <ListItemIcon>
                  <WorkRounded fontSize="small" sx={{ color: "#045a55" }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="subtitle2">Vacancy</Typography>
                </ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => setMediumListOpen((prev) => !prev)}
                sx={currentPathDeterminer("support")}
              >
                <ListItemIcon>
                  <SupportAgentRounded
                    fontSize="small"
                    sx={{ color: "#045a55" }}
                  />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="subtitle2">Support</Typography>
                </ListItemText>
                {mediumListOpen ? (
                  <ExpandLess fontSize="small" />
                ) : (
                  <ExpandMore fontSize="small" />
                )}
              </MenuItem>
              <Collapse in={mediumListOpen} sx={{ paddingLeft: "1em" }}>
                <MenuItem component={ReactRouterLink} to="/">
                  <ListItemIcon>
                    <MenuBookRounded
                      fontSize="small"
                      sx={{ color: "#045a55" }}
                    />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="subtitle2">Guides</Typography>
                  </ListItemText>
                </MenuItem>
                <MenuItem component={ReactRouterLink} to="/">
                  <ListItemIcon>
                    <HelpRounded fontSize="small" sx={{ color: "#045a55" }} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="subtitle2">FAQs</Typography>
                  </ListItemText>
                </MenuItem>
                <MenuItem component={ReactRouterLink} to="/">
                  <ListItemIcon>
                    <ContactsRounded
                      fontSize="small"
                      sx={{ color: "#045a55" }}
                    />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="subtitle2">Contact</Typography>
                  </ListItemText>
                </MenuItem>
              </Collapse>
              {isAuthenticated && (
                <MenuItem onClick={() => {
                  DeleteSession("auth");
                  navigate("/accounts/auth");
                }}>
                  <ListItemIcon>
                    <Logout fontSize="small" sx={{ color: "#045a55" }} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body1" style={{ fontSize: "small" }}>
                      Logout
                    </Typography>
                  </ListItemText>
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <>
            <Box>
              <Stack direction={"row"} spacing={5}>
                <Button component={ReactRouterLink} to="/" sx={sxProps.font}>
                  <Typography
                    variant="body1"
                    fontWeight={"bold"}
                    letterSpacing={"0.04rem"}
                  >
                    Home
                  </Typography>
                </Button>
                <Button
                  component={ReactRouterLink}
                  to="/vacancy"
                  sx={sxProps.font}
                >
                  <Typography
                    variant="body1"
                    fontWeight={"bold"}
                    letterSpacing={"0.04rem"}
                  >
                    Vacancy
                  </Typography>
                </Button>
                <Button onMouseOver={supportMenuMouseOver} sx={sxProps.font}>
                  <Typography
                    variant="body1"
                    fontWeight={"bold"}
                    letterSpacing={"0.04rem"}
                  >
                    Support
                  </Typography>
                </Button>
              </Stack>
              <Menu
                disableScrollLock
                open={openMenu.supportMenuAnchor}
                anchorEl={anchorEl.supportMenuAnchor}
                onClose={() =>
                  setAnchorEl((prev) => ({ ...prev, supportMenuAnchor: null }))
                }
                autoFocus={false}
                MenuListProps={{
                  onMouseLeave: () =>
                    setAnchorEl((prev) => ({
                      ...prev,
                      supportMenuAnchor: null,
                    })),
                }}
                slotProps={{
                  paper: {
                    style: {
                      minWidth: "10rem",
                      marginTop: "1.2rem",
                    },
                  },
                }}
              >
                <MenuItem component={ReactRouterLink} to="/">
                  <Typography variant="subtitle2">Guides</Typography>
                </MenuItem>
                <MenuItem component={ReactRouterLink} to="/">
                  <Typography variant="subtitle2">FAQs</Typography>
                </MenuItem>
                <MenuItem component={ReactRouterLink} to="/">
                  <Typography variant="subtitle2">Contact</Typography>
                </MenuItem>
              </Menu>
            </Box>
            {/* navigation.profile/action */}
            <Stack direction={"row"} spacing={2}>
              {isAuthenticated ? (
                <>
                  <Button
                    sx={{ ...sxProps.font }}
                    endIcon={<ArrowDropDown />}
                    onClick={profileMenuOnClick}
                  >
                    Hi, {account?.user.fullname.split(" ")[0]}
                  </Button>
                  <Menu
                    disableScrollLock
                    open={openMenu.profileMenuAnchor}
                    anchorEl={anchorEl.profileMenuAnchor}
                    onClose={() =>
                      setAnchorEl((prev) => ({
                        ...prev,
                        profileMenuAnchor: null,
                      }))
                    }
                    autoFocus={false}
                    slotProps={{
                      paper: {
                        style: {
                          minWidth: "10rem",
                          marginTop: "1rem",
                        },
                      },
                    }}
                  >
                    <MenuItem component={ReactRouterLink}
                      to={pathnameDeterminer(account?.identity.type as string)}
                    >
                      <ListItemIcon>
                        <Person fontSize="small" sx={{ color: "#045a55" }} />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography
                          variant="body1"
                          style={{ fontSize: "small" }}
                        >
                          Dashboard
                        </Typography>
                      </ListItemText>
                    </MenuItem>
                    {/* <MenuItem component={ReactRouterLink} to="/">
                      <ListItemIcon>
                        <Settings fontSize="small" sx={{ color: "#045a55" }} />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography
                          variant="body1"
                          style={{ fontSize: "small" }}
                        >
                          Settings
                        </Typography>
                      </ListItemText>
                    </MenuItem> */}
                    <Divider />
                    <MenuItem
                      // component={ReactRouterLink}
                      // to="/"
                      sx={{
                        "&:hover": {
                          color: "#045a55",
                        },
                      }}
                      onClick={() => {
                        // _EMITTER.emit('onDataUpdated', 'address-updated');
                        DeleteSession("auth")
                        navigate("/accounts/auth")
                      }}
                    >
                      <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: "#045a55" }} />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography
                          variant="body1"
                          style={{ fontSize: "small" }}
                        >
                          Logout
                        </Typography>
                      </ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={ReactRouterLink}
                    to={"/accounts/auth"}
                    variant="text"
                    sx={sxProps.font}
                  >
                    Login
                  </Button>
                  <Button
                    component={ReactRouterLink}
                    to={"/accounts/create"}
                    variant="contained"
                    sx={sxProps.button}
                  >
                    Register
                  </Button>
                </>
              )}
            </Stack>
          </>
        )}
      </Container>
    </Box>
  );
}
