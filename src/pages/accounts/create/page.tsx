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
import FutureInternLogo from "/Future Interns Logo.svg";
import SimpleEmphasis from "../../../components/Molecules/Texts/SimpleEmphasis";
import React, { useState } from "react";
import { ArrowBackIos, Visibility, VisibilityOff } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

export default function SignUp() {
  /* state */
  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<{
    fullname: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  /* event handler */
  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  /* hooks */
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
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              letterSpacing: "0.02em",
              marginTop: "0.5em",
            }}
          >
            Create Account
          </Typography>
          <Typography variant="caption">
            Use <SimpleEmphasis text={"one"} /> account for{" "}
            <SimpleEmphasis text={"everything"} />
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box component={"div"} sx={{ marginTop: "3em" }}>
            <form>
              {step === 1 && (
                <Box component={"div"}>
                  <TextField
                    variant="outlined"
                    name="fullname"
                    label="Full Name"
                    placeholder="Your full name"
                    fullWidth
                    autoComplete="off"
                    sx={{
                      marginBottom: "1em",
                    }}
                    value={formValue.fullname}
                    onChange={inputOnChange}
                  />
                  <TextField
                    variant="outlined"
                    name="email"
                    label="Email Address"
                    placeholder="Your email address"
                    fullWidth
                    autoComplete="off"
                    sx={{
                      marginBottom: "1em",
                    }}
                    value={formValue.email}
                    onChange={inputOnChange}
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
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => setStep(2)}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              )}
              {step === 2 && (
                <Box component={"div"}>
                  <TextField
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    name="password"
                    label="Password"
                    placeholder="Input a strong password"
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
                    onChange={inputOnChange}
                  />
                  <TextField
                    type={"password"}
                    variant="outlined"
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    fullWidth
                    sx={{
                      marginBottom: "1em",
                    }}
                    value={formValue.confirmPassword}
                    onChange={inputOnChange}
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
                      Back
                    </Button>
                    <Button type="submit" variant="contained" fullWidth>
                      Submit
                    </Button>
                  </Box>
                </Box>
              )}
            </form>
          </Box>
        </Grid>
      </Grid>
    </AuthLayout>
  );
}
