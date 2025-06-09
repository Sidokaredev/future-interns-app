import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/Templates/AuthLayout";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
// import FutureInternLogo from "/Future Interns Logo.svg";
import SimpleEmphasis from "../../../components/Molecules/Texts/SimpleEmphasis";
import React, { useState } from "react";
import { ArrowBackIos, Visibility, VisibilityOff } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import BaseAlert from "../../../components/Molecules/Feedback/BaseAlert";
// constants
import { DEFAULT_CREATE_CANDIDATE_ACCOUNT } from "../constants";
// types
import { CreateCandidateAccount } from "../types";
// global helpers
import { InputOnChange, SetSession } from "../../global-helpers";
import { schema_CreateCandidateAccount } from "../../../services/validator/zod.schema";
import Validator from "../../../services/validator";
import RequestAPI from "../../../services/api/request";

export default function SignUp() {
  /* hooks */
  const navigate = useNavigate();
  /* state */
  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<CreateCandidateAccount>(DEFAULT_CREATE_CANDIDATE_ACCOUNT);
  const [errMessage, setErrorMessage] = useState<Record<string, string[]>>({})
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
  const [loading, setLoading] = useState<boolean>(false)
  /* onSubmit */
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true)
    let validate = Validator.UseSchema(schema_CreateCandidateAccount)
      .SafeValidate<CreateCandidateAccount, Record<string, string[]>>(formValue, setErrorMessage);
    if (!validate) {
      setAlert({ show: true, message: "please follow the form rules, bitch" })
      return setLoading(false)
    }
    const [data, fail] = await RequestAPI.JSONRequest<Record<string, string>>({
      fullname: formValue.fullname,
      email: formValue.email,
      password: formValue.password
    })
      .Send<any>(
        "/accounts/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        })
    if (fail != undefined) {
      setAlert({ show: true, message: fail.message })
      return setLoading(false)
    }

    SetSession('auth', data.access_token)
    return navigate("/candidates/profile-overview")
  };
  return (
    <AuthLayout>
      {/* ALERT HERE */}
      <BaseAlert
        show={alert.show}
        message={alert.message}
        setShow={setAlert}
      />
      <Grid container spacing={1}>
        {/* CREATE LEFT CONTENT */}
        <Grid item xs={12} md={6}>
          <Link component={RouterLink} to={"/"}>
            <Box
              component={"img"}
              src={"/future-interns-app/Future Interns Logo.svg"}
              width={"2.5em"}
              height={"2.5em"}
            />
          </Link>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              letterSpacing: "0.02em",
              marginTop: "0.5em",
            }}
          >
            Daftarkan Akun
          </Typography>
          <Typography variant="caption">
            Akses <SimpleEmphasis text={"semua"} /> layanan dengan{" "}
            <SimpleEmphasis text={"satu"} /> akun
          </Typography>
        </Grid>
        {/* CREATE RIGHT CONTENT */}
        <Grid item xs={12} md={6}>
          <Box component={"div"} sx={{ marginTop: "3em" }}>
            <form onSubmit={onSubmit}>
              {/* FORM STEP 1 */}
              <Box
                component={"div"}
                sx={{
                  display: step === 1 ? "block" : "none",
                }}
              >
                <TextField
                  variant="outlined"
                  name="fullname"
                  label="Nama Lengkap"
                  placeholder="Masukkan nama lengkap anda"
                  fullWidth
                  autoComplete="off"
                  sx={{
                    marginBottom: "1em",
                  }}
                  value={formValue.fullname}
                  onChange={InputOnChange<CreateCandidateAccount>(setFormValue)}
                  error={"fullname" in errMessage ? true : false}
                  helperText={"fullname" in errMessage ? errMessage["fullname"] : ""}
                />
                <TextField
                  variant="outlined"
                  name="email"
                  label="Alamat Email"
                  placeholder="Masukkan alamat email anda"
                  fullWidth
                  autoComplete="off"
                  sx={{
                    marginBottom: "1em",
                  }}
                  value={formValue.email}
                  onChange={InputOnChange<CreateCandidateAccount>(setFormValue)}
                  error={"email" in errMessage ? true : false}
                  helperText={"email" in errMessage ? errMessage["email"] : ""}
                />
                <Box
                  component={"div"}
                  className="form-button-container"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1em",
                    marginTop: "1em",
                  }}
                >
                  <Button
                    variant="text"
                    startIcon={<ArrowBackIos sx={{ color: grey[600] }} />}
                    fullWidth
                    onClick={() => navigate("/accounts/auth")}
                    sx={{ color: grey[600] }}
                  >
                    Kembali
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setStep(2)}
                  >
                    Selanjutnya
                  </Button>
                </Box>
              </Box>
              {/* FORM STEP 2 */}
              <Box
                component={"div"}
                sx={{
                  display: step === 2 ? "block" : "none",
                }}
              >
                <TextField
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  name="password"
                  label="Kata Sandi"
                  placeholder="Buat kata sandi anda"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    marginBottom: "1em",
                  }}
                  value={formValue.password}
                  onChange={InputOnChange<CreateCandidateAccount>(setFormValue)}
                  error={"password" in errMessage ? true : false}
                  helperText={"password" in errMessage ? errMessage["password"] : ""}
                />
                <TextField
                  type={"password"}
                  variant="outlined"
                  name="confirmPassword"
                  label="Konfirmasi Kata Sandi"
                  placeholder="Tulis ulang kata sandi anda"
                  fullWidth
                  sx={{
                    marginBottom: "1em",
                  }}
                  value={formValue.confirmPassword}
                  onChange={InputOnChange<CreateCandidateAccount>(setFormValue)}
                  error={"confirmPassword" in errMessage ? true : false}
                  helperText={"confirmPassword" in errMessage ? errMessage["confirmPassword"] : ""}
                />
                <Box
                  component={"div"}
                  className="form-button-container"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1em",
                  }}
                >
                  <Button
                    variant="text"
                    startIcon={<ArrowBackIos color="primary" />}
                    fullWidth
                    onClick={() => setStep(1)}
                  >
                    Kembali
                  </Button>
                  <Button type="submit" variant="contained" disabled={loading} fullWidth>
                    Buat Akun
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </AuthLayout>
  );
}
