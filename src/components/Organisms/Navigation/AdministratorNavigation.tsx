import { AppBar, Avatar, Box, Button, Container, Divider, Link, Menu, Snackbar, Stack, Typography } from "@mui/material";
import { grey, lightBlue } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { DeleteSession, GetSession, onCloseSnackbar } from "../../../pages/global-helpers";
import RequestAPI from "../../../services/api/request";

export default function AdministratorNavigation() {
  /* react-router */
  const navigate = useNavigate();

  /* state */
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [userAccount, setuserAccount] = useState<{ fullname: string; email: string; } | null>(null);
  const [alert, setAlert] = useState<{ show: boolean; message: string; }>({ show: false, message: "" });

  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<{ fullname: string; email: string; }>(
        "/accounts/user-account",
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
        setuserAccount(data);
      }
    })();
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "inherit",
        boxShadow: "none",
      }}
    >
      {/* Default Notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        message={alert.message}
        autoHideDuration={3000}
        onClose={onCloseSnackbar(setAlert)}
      />
      <Container maxWidth="lg"
        disableGutters
        sx={{
          // border: "1px solid black",
          paddingTop: "0.5em",
          paddingX: "0.5em",
        }}
      >
        <Box component={"div"} className="top-nav"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box component={"div"} className="app-name"
            sx={{
              display: "flex",
              columnGap: 1
            }}
          >
            <Box
              component={"img"}
              src={"/Future Interns Logo.svg"}
              width={30}
              height={30}
              loading="lazy"
            />
            <Link
              component={RouterLink}
              to={"/"}
              sx={{ textDecoration: "none" }}
            >
              <Typography variant="h6" fontWeight={"bolder"}>
                Future Interns
              </Typography>
            </Link>
          </Box>
          <Box component={"div"} className="user-profile"
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: 1
            }}
          >
            <Typography component={"p"} variant="subtitle2"
              sx={{
                color: grey[700],
                fontWeight: 550
              }}
            >
              Hi, {userAccount?.fullname.split(" ")[0]}
            </Typography>
            <Box component={"div"}
              onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                setAnchorEl(event.currentTarget);
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#06816d",
                  cursor: "pointer",
                }}
              >
                {userAccount?.fullname.split(" ")[0].charAt(0)}
              </Avatar>
            </Box>
          </Box>
        </Box>
        {/* <Divider sx={{ marginY: "0.7em" }} /> */}
        {/* Navigation Bar */}
        {/* <Box component={"div"} className="page-navigation"
          sx={{
            display: "flex",
          }}
        >
          <Box component={RouterLink} to={"/administrators"} className="navigation-item"
            sx={{
              paddingTop: "0.2em",
              paddingBottom: "0.4em",
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              columnGap: 1,
              color: Boolean(useMatch("/administrators")) ? "#06816d" : grey[500],
              "&:hover": {
                color: "#06816d",
              },
              borderBottom: `0.2em solid ${Boolean(useMatch("/administrators")) ? "#06816d" : "transparent"}`,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <DashboardRounded fontSize="small" />
            <Typography component={"p"} variant="subtitle2"
              sx={{ fontWeight: 550 }}
            >
              Dashboard
            </Typography>
          </Box>
          <Box component={RouterLink} to={"/administrators/iam"} className="navigation-item"
            sx={{
              paddingTop: "0.2em",
              paddingBottom: "0.4em",
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              columnGap: 1,
              color: Boolean(useMatch("/administrators/iam")) ? "#06816d" : grey[500],
              "&:hover": {
                color: "#06816d",
              },
              borderBottom: `0.2em solid ${Boolean(useMatch("/administrators/iam")) ? "#06816d" : "transparent"}`,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <Security fontSize="small" />
            <Typography component={"p"} variant="subtitle2"
              sx={{ fontWeight: 550 }}
            >
              Identity and Access Management
            </Typography>
          </Box>
          <Box component={RouterLink} to={"/administrators/master"} className="navigation-item"
            sx={{
              paddingTop: "0.2em",
              paddingBottom: "0.4em",
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              columnGap: 1,
              color: Boolean(useMatch("/administrators/master")) ? "#06816d" : grey[500],
              "&:hover": {
                color: "#06816d",
              },
              borderBottom: `0.2em solid ${Boolean(useMatch("/administrators/master")) ? "#06816d" : "transparent"}`,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <StorageRounded fontSize="small" />
            <Typography component={"p"} variant="subtitle2"
              sx={{ fontWeight: 550 }}
            >
              Master Data
            </Typography>
          </Box>
          <Box component={RouterLink} to={"/administrators/performance"} className="navigation-item"
            sx={{
              paddingTop: "0.2em",
              paddingBottom: "0.4em",
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              columnGap: 1,
              color: Boolean(useMatch("/administrators/performance")) ? "#06816d" : grey[500],
              "&:hover": {
                color: "#06816d",
              },
              borderBottom: `0.2em solid ${Boolean(useMatch("/administrators/performance")) ? "#06816d" : "transparent"}`,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <TrendingUpRounded fontSize="small" />
            <Typography component={"p"} variant="subtitle2"
              sx={{ fontWeight: 550 }}
            >
              Performance Test
            </Typography>
          </Box>
        </Box> */}
      </Container>
      {/* Profile Menu Options */}
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={() =>
          setAnchorEl(null)
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
              component={RouterLink}
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
    </AppBar>
  )
}