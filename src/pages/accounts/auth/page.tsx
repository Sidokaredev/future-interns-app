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
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
// import FutureInternLogo from "/future-interns-app/Future Interns Logo.svg";
import AuthLayout from "../../../components/Templates/AuthLayout";
import SimpleEmphasis from "../../../components/Molecules/Texts/SimpleEmphasis";
// import HelpIcon from "@mui/icons-material/Help";
import { Authentication, AuthJSON } from "../types";
import { DEAFULT_AUTHENTICATION } from "../constants";
import { InputOnChange, SetSession } from "../../global-helpers";
import Validator from "../../../services/validator";
import { schema_Authentication } from "../../../services/validator/zod.schema";
import BaseAlert from "../../../components/Molecules/Feedback/BaseAlert";
import RequestAPI from "../../../services/api/request";

export default function Auth() {
  /* react-router hooks */
  const navigate = useNavigate();
  const location = useLocation()
  /* state */
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openMenu = Boolean(anchorEl);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<Authentication>(DEAFULT_AUTHENTICATION);
  const [errMessage, setErrorMessage] = useState<{ [key: string]: string[] }>({})
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
  const [loading, setLoading] = useState<boolean>(false)
  /* onSubmit */
  const formOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true)
    const validate = Validator.UseSchema(schema_Authentication)
      .SafeValidate<Authentication, { [key: string]: string[] }>(formValue, setErrorMessage)
    if (!validate) {
      setAlert({ show: true, message: 'please follow the form rules, kids' })
      return setLoading(false)
    }

    const [data, fail] = await RequestAPI.JSONRequest(formValue)
      .Send<AuthJSON>("/accounts/auth",
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          }
        })
    if (fail) {
      setAlert({ show: true, message: fail.message })
      return setLoading(false);
    }
    if (data) {
      SetSession('auth', data.access_token)
      const redirectUrl = new URLSearchParams(location.search).get('redirect')
      switch (data.role.type) {
        case 'candidate':
          if (redirectUrl) {
            return navigate(redirectUrl)
          }
          return navigate("/candidates/profile-overview")
        case 'employer':
          if (redirectUrl) {
            return navigate(redirectUrl)
          }
          return navigate("/employers/profile-overview")
        case 'administrator':
          if (redirectUrl) {
            return navigate(redirectUrl);
          }
          return navigate("/administrators/performance") // DEFAULT TO ADMINISTRATOR
      }
    }

    return setAlert({ show: true, message: 'data and fail is undefined' })
  };
  return (
    <AuthLayout>
      <BaseAlert
        show={alert.show}
        message={alert.message}
        setShow={setAlert}
      />
      <Grid container spacing={1}>
        {/* AUTH LEFT CONTENT */}
        <Grid item xs={12} md={6}>
          <Link component={RouterLink} to={"/"}>
            <Box
              component={"img"}
              src={"/future-interns-app/Future Interns Logo.svg"}
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
                Masuk ke akun Anda
              </Typography>
              <Typography variant="caption">
                Siapkan <SimpleEmphasis text={"diri anda"} /> untuk karir{" "}
                <SimpleEmphasis text={"impian"} />
              </Typography>
            </Box>
            <Box component={"div"} className="button-menu">
              {/* DISABLED */}
              {/* <Button
                variant="text"
                startIcon={<HelpIcon />}
                size="small"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                  setAnchorEl(event.currentTarget)
                }
              >
                Account Recovery
              </Button> */}
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
        {/* AUTH RIGHT CONTENT */}
        <Grid item xs={12} md={6}>
          <Box
            component={"div"}
            sx={{
              marginTop: {
                xs: "1em",
                md: "2.5em",
              },
            }}
          >
            {/* FORM */}
            <form onSubmit={formOnSubmit}>
              <TextField
                variant="outlined"
                type="email"
                name="email"
                label="Alamat Email"
                placeholder="e.g user@sidokaredev.space"
                autoComplete="off"
                fullWidth
                sx={{
                  marginBottom: "1em",
                }}
                value={formValue.email}
                onChange={InputOnChange<Authentication>(setFormValue)}
                error={errMessage["email"] ? true : false}
                helperText={errMessage["email"] ?? ""}
              />
              <TextField
                variant="outlined"
                type={showPassword ? "text" : "password"}
                name="password"
                label="Kata Sandi"
                placeholder="Masukkan kata sandi anda"
                autoComplete="off"
                fullWidth
                value={formValue.password}
                onChange={InputOnChange<Authentication>(setFormValue)}
                error={errMessage["password"] ? true : false}
                helperText={errMessage["password"] ?? ""}
              />
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="tampilkan kata sandi"
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
                  type="button"
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/accounts/create")}
                >
                  Daftar Akun
                </Button>
                <Button type="submit" variant="contained" disabled={loading} fullWidth>
                  Masuk
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </AuthLayout>
  );
}
