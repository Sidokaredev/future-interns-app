import { Box, Button, Checkbox, FormControlLabel, Link, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { FormFlow } from "../../../../pages/accounts/auth/page";

type AuthForm = {
  email: string
  password: string
}

export default function AuthForm({
  formFlowState,
  setFormFlowState
} : {
  formFlowState: FormFlow,
  setFormFlowState: React.Dispatch<React.SetStateAction<FormFlow>>
}) {
  /* Form State */
  const initialAuthForm: AuthForm = { email: '', password: '' }
  const [authFormState, setAuthFormState] = useState<AuthForm>(initialAuthForm)
  return (
    <>
      <Box
        component={'div'}
        flexGrow={1}
      >
        <form>
          {/* Email Container */}
          <Box
            minHeight={'12em'}
            component={'div'}
            className="auth-email"
            display={formFlowState.formStep === 2 ? 'none' : ''}
          >
            <TextField
              type="email"
              label={"Email"}
              fullWidth
              required
            />
            <Link
              href="/none"
              sx={{ textDecoration: 'none', float: 'left', marginY: '0.5em' }}
            >
              <Typography
                variant="caption"
                fontWeight={'bold'}
              >
                Forgot email?
              </Typography>
            </Link>
            <Box
              marginTop={'4em'}
              marginBottom={{ xs: 3 }}
            >
              {/* Accounts Guide */}
              <Typography variant="body1" color={'#777777'}>
                Ensure that your account is registered. If it is not, please click the <strong style={{ fontStyle: 'italic' }}>Create Account</strong> button to sign up.
              </Typography>
            </Box>
          </Box>
          {/* Password Container */}
          <Box
            minHeight={'12em'}
            component={'div'}
            className="auth-password"
            display={formFlowState.formStep !== 2 ? 'none' : 'block'}
            // border={'1px solid black'}
          >
            <TextField
              type="password"
              label="Password"
              fullWidth
              required
            />
            <Stack direction={'row'} justifyContent={'space-between'}>
              <FormControlLabel
                control={<Checkbox size="small" />}
                label={
                  <Typography variant="body2" color={'#777777'}>Show password</Typography>
                }
              />
              <Link
                href="/none"
                sx={{ textDecoration: 'none', float: 'left', marginY: '0.5em' }}
              >
                <Typography
                  variant="caption"
                  fontWeight={'bold'}
                >
                  Forgot password?
                </Typography>
              </Link>
            </Stack>
          </Box>
          <Box
            display={'flex'}
            justifyContent={'end'}
          >
            <Button
              variant="text"
              sx={{
                minWidth: '10em',
                marginX: '1em'
              }}
              onClick={() => {
                if(formFlowState.formStep === 2) {
                  return setFormFlowState({
                    formStep: 1,
                    btn1Text: 'Create Account',
                    btn2Text: 'Next'
                  })
                }
              }}
            >
              {formFlowState.btn1Text}
            </Button>
            <Button
              variant="contained"
              sx={{
                minWidth: '10em'
              }}
              onClick={() => setFormFlowState(prev => ({
                ...prev,
                formStep: 2,
                btn1Text: 'Back',
                btn2Text: 'Sign In'
              }))}
            >
              {formFlowState.btn2Text}
            </Button>
          </Box>
        </form>
      </Box>
    </>
  )
}