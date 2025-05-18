import { RocketLaunchRounded } from "@mui/icons-material";
import { Avatar, Box, Container, Link, ListItemIcon, ListItemText, Menu, MenuItem, Snackbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { GetSession, onCloseSnackbar } from "../../pages/global-helpers";
import RequestAPI from "../../services/api/request";
import { grey } from "@mui/material/colors";

export default function PerformanceTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /* react-router */
  // const navigate = useNavigate();

  /* state */
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [userAccount, setuserAccount] = useState<{ fullname: string; email: string; } | null>(null);
  const [alert, setAlert] = useState<{ show: boolean; message: string; }>({ show: false, message: "" });

  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<{ fullname: string; email: string; }>(
        "/api/v1/accounts/user-account",
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
    <Box component={"div"}
      sx={{
        backgroundColor: grey[100]
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
      <Box component={"div"}
        sx={{
          width: "100%",
          height: "18em",
          backgroundImage: "url('/backgrounds/Final-AnimatedShape-3.svg')"
        }}
      >
        <Container maxWidth="lg" disableGutters
          sx={{
            paddingX: "0.5em",
          }}
        >
          <Box component={"div"} className="banner-background"
            sx={{
              paddingY: "0.7em",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box component={"div"} className="app-name"
              sx={{
                display: "flex",
                columnGap: 1,
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
                <Typography variant="subtitle1" sx={{ color: "#c2fffb" }}>
                  Future Interns
                </Typography>
                <Typography component={"p"} variant="caption" sx={{ color: "white", fontStyle: "italic", lineHeight: 1 }}>
                  Performance Test
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
                  color: "white",
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
                    color: "#06816d",
                    bgcolor: "#c2fffb",
                    cursor: "pointer",
                  }}
                >
                  {userAccount?.fullname.split(" ")[0].charAt(0)}
                </Avatar>
              </Box>
            </Box>
          </Box>
          {/* Performance Navigation Menu */}
          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => {
              setAnchorEl(null);
            }}
            autoFocus={false}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
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
            {/* <MenuItem component={RouterLink} to={"/administrators"}>
              <ListItemIcon>
                <DashboardRounded fontSize="small" sx={{ color: "#045a55" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="subtitle2">Dashboard</Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem component={RouterLink} to={"/administrators/iam"}>
              <ListItemIcon>
                <SecurityRounded fontSize="small" sx={{ color: "#045a55" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="subtitle2">Identity and Access Management</Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem component={RouterLink} to={"/administrators/master"}>
              <ListItemIcon>
                <StorageRounded fontSize="small" sx={{ color: "#045a55" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="subtitle2">Master Data</Typography>
              </ListItemText>
            </MenuItem> */}
            <MenuItem component={RouterLink} to={"/administrators/performance"}>
              <ListItemIcon>
                <RocketLaunchRounded fontSize="small" sx={{ color: "#045a55" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="subtitle2">Performance Test</Typography>
              </ListItemText>
            </MenuItem>
          </Menu>
        </Container>
      </Box>
      {children}
    </Box>
  )
}