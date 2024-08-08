import { Avatar, Box, Container, Grid, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AuthFooter from "../../../components/Organisms/Accounts/Auth/Footer";
import AuthBanner from "../../../components/Organisms/Accounts/Auth/Banner";
import AuthForm from "../../../components/Organisms/Accounts/Auth/Form";
import { useState } from "react";

export type FormFlow = {
  formStep: number
  btn1Text: string
  btn2Text: string
}

export default function Auth() {
  /* FormFlow State */
  const initialFormFlow: FormFlow = { formStep: 1, btn1Text: 'Create Account', btn2Text: 'Next' }
  const [formFlowState, setFormFlowState] = useState<FormFlow>(initialFormFlow)
  return (
    <>
      <Box
        component={'div'}
        height={'100vh'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        bgcolor={'#e6f2f0'}
      >
        <Container
          maxWidth={'lg'}
        >
          <Grid container
            direction={'row'}
            // rowSpacing={{ xs: '1em' }}
            sx={{
              backgroundColor: 'white',
              borderRadius: '0.3em',
              padding: '1.5em'
            }}
          >
            <Grid item xs={12}
              marginBottom={'1em'}
              display={'flex'}
              alignItems={'center'}
            >
              <Link
                component={RouterLink}
                to={'/'}
              >
                <Avatar src="/Future Interns Logo.svg" />
              </Link>
              <Typography
                variant="h6"
                marginX={'0.5em'}
                fontWeight={'bold'}
                color={'#51a799'}
                display={{ xs: 'block', md: 'none' }}
              >
                Sign In
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Left Auth Content */}
              <AuthBanner />
            </Grid>
            <Grid item xs={12} md={6}
              display={'flex'}
              alignItems={'center'}
            >
              {/* Right Auth Content */}
              <AuthForm formFlowState={formFlowState} setFormFlowState={setFormFlowState} />
            </Grid>
          </Grid>
          {/* Bottom Auth Content */}
          <AuthFooter />
        </Container>
      </Box>
    </>
  )
}