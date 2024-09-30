import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Menu,
  MenuItem,
  MenuList,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import FutureInternLogo from "/Future Interns Logo.svg";
import AuthLayout from "../../../components/Templates/AuthLayout";
import SimpleEmphasis from "../../../components/Molecules/Texts/SimpleEmphasis";
import HelpIcon from "@mui/icons-material/Help";

export default function Auth() {
  /* state */
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openMenu = Boolean(anchorEl);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  return (
    <AuthLayout>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Link component={RouterLink} to={"/"}>
            <Box
              component={"img"}
              src={FutureInternLogo}
              width={"2.5em"}
              height={"2.5em"}
            />
          </Link>
          {/* just text */}
          <Box
            component={"div"}
            sx={{
              height: "83%",
              display: "flex",
              alignItems: {
                xs: "normal",
                sm: "center",
                md: "normal",
              },
              flexDirection: {
                xs: "column",
                sm: "row",
                md: "column",
              },
              justifyContent: {
                xs: "normal",
                sm: "space-between",
              },
            }}
          >
            <Box component={"div"} className="just-text">
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  marginTop: "0.5em",
                }}
              >
                Sign In to your account
              </Typography>
              <Typography variant="caption">
                Prepare <SimpleEmphasis text={"yourself"} /> for your{" "}
                <SimpleEmphasis text={"dream"} /> career
              </Typography>
            </Box>
            <Box component={"div"} className="button-menu">
              <Button
                variant="text"
                startIcon={<HelpIcon />}
                size="small"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                  setAnchorEl(event.currentTarget)
                }
              >
                Account Recovery
              </Button>
              <Menu
                open={openMenu}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                slotProps={{
                  paper: {
                    sx: {
                      minWidth: "9em",
                      boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                      border: "1px solid #d4d4d4",
                    },
                  },
                }}
              >
                <MenuList dense disablePadding>
                  <MenuItem sx={{ fontSize: "small" }}>Email Recovery</MenuItem>
                  <MenuItem sx={{ fontSize: "small" }}>
                    Password Recovery
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "small" }}>Delete Account</MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          {/* field form */}
          <Box
            component={"div"}
            sx={{
              marginTop: {
                xs: "1em",
                md: "2.5em",
              },
            }}
          >
            <form>
              <TextField
                variant="outlined"
                type="email"
                name="email"
                label="Email Address"
                placeholder="Your email address"
                autoComplete="off"
                fullWidth
                sx={{
                  marginBottom: "1em",
                }}
              />
              <TextField
                variant="outlined"
                type={showPassword ? "text" : "password"}
                name="password"
                label="Password"
                placeholder="Your valid password"
                autoComplete="off"
                fullWidth
              />
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Show password"
                slotProps={{
                  typography: {
                    variant: "caption",
                    color: "#444444",
                  },
                }}
                onChange={(_: React.SyntheticEvent, checked: boolean) => {
                  setShowPassword(checked);
                }}
              />
              <Box
                component={"div"}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1em",
                  marginTop: "1em",
                }}
              >
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/accounts/create")}
                >
                  Create Instead
                </Button>
                <Button variant="contained" fullWidth>
                  Submit
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </AuthLayout>
  );
}
