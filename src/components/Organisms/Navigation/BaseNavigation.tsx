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
  Stack,
  type SxProps,
  Typography,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";
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
  Settings,
  SupportAgentRounded,
  WorkRounded,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";

type onScrollSxProps = {
  navigation: SxProps;
  font: SxProps;
  button: SxProps;
};

export default function BaseNavigation() {
  /* breakpoints */
  const mediumSize = useMediaQuery("(max-width: 900px)");
  /* state */
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
  /* data display */
  const isAuthenticated = false;
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
            src={"/future-interns-app/Future Interns Logo.svg"}
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
                <>
                  <MenuItem>
                    <ListItemIcon>
                      <Person fontSize="small" sx={{ color: "#045a55" }} />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography variant="subtitle2">Profile</Typography>
                    </ListItemText>
                  </MenuItem>
                  <MenuItem component={ReactRouterLink} to="/">
                    <ListItemIcon>
                      <Settings fontSize="small" sx={{ color: "#045a55" }} />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography variant="subtitle2">Settings</Typography>
                    </ListItemText>
                  </MenuItem>
                </>
              ) : (
                <>
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
                </>
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
                sx={{
                  backgroundColor: "#e6f2f0",
                  ":hover": { backgroundColor: "#e6f2f0" },
                }}
              >
                <ListItemIcon>
                  <Home fontSize="small" sx={{ color: "#045a55" }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="subtitle2">Home</Typography>
                </ListItemText>
              </MenuItem>
              <MenuItem component={ReactRouterLink} to="/vacancy">
                <ListItemIcon>
                  <WorkRounded fontSize="small" sx={{ color: "#045a55" }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="subtitle2">Vacancy</Typography>
                </ListItemText>
              </MenuItem>
              <MenuItem onClick={() => setMediumListOpen((prev) => !prev)}>
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
              <Divider />
              {isAuthenticated && (
                <MenuItem>
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
                <MenuItem component={ReactRouterLink} to="/future-interns-app">
                  <Typography variant="subtitle2">Guides</Typography>
                </MenuItem>
                <MenuItem component={ReactRouterLink} to="/future-interns-app">
                  <Typography variant="subtitle2">FAQs</Typography>
                </MenuItem>
                <MenuItem component={ReactRouterLink} to="/future-interns-app">
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
                    Hi, Fatkhur
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
                    <MenuItem>
                      <ListItemIcon>
                        <Person fontSize="small" sx={{ color: "#045a55" }} />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography
                          variant="body1"
                          style={{ fontSize: "small" }}
                        >
                          Profile
                        </Typography>
                      </ListItemText>
                    </MenuItem>
                    <MenuItem component={ReactRouterLink} to="/">
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
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      component={ReactRouterLink}
                      to="/"
                      sx={{
                        "&:hover": {
                          color: "#045a55",
                        },
                      }}
                      onClick={() => {
                        // _EMITTER.emit('onDataUpdated', 'address-updated');
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
