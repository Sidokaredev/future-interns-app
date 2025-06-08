import { Box, Grid, Step, StepLabel, Stepper, Typography, useMediaQuery } from "@mui/material";
import DashboardLayout from "../../../components/Templates/DashboardLayout";
import CandidateProfile from "../../../components/Molecules/Data.Display/CandidateProfile";
import PersonalDetail from "../../../components/Molecules/Data.Display/PersonalDetail";
import { useEffect, useState } from "react";
import RequestAPI from "../../../services/api/request";
import BaseAlert from "../../../components/Molecules/Feedback/BaseAlert";
import { GetSession } from "../../global-helpers";
import { grey } from "@mui/material/colors";
import SimpleEmphasis from "../../../components/Molecules/Texts/SimpleEmphasis";
import RegistrationStep1 from "../../../components/Organisms/candidates/steps/RegistrationStep1";
import RegistrationStep2 from "../../../components/Organisms/candidates/steps/RegistrationStep2";
import RegistrationStep3 from "../../../components/Organisms/candidates/steps/RegistrationStep3";

export default function CandidateDashboard() {
  /* state */
  const [currentStep, setCurrentStep] = useState<number | undefined>(undefined)
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
  const [checking, setChecking] = useState<boolean>(false);
  const [dataAction, setDataAction] = useState<boolean>(false) // just for re-fecthing data
  /* breakpoint */
  const xsBreakpoint = useMediaQuery('(max-width: 600px)')
  /* constant */
  const formComponents: Record<number, JSX.Element> = {
    1: <RegistrationStep1 setCurrentStep={setCurrentStep} setAlert={setAlert} />,
    2: <RegistrationStep2 setCurrentStep={setCurrentStep} setAlert={setAlert} />,
    3: <RegistrationStep3 setCurrentStep={setCurrentStep} setAlert={setAlert} setDataAction={setDataAction} />
  }
  const candidateStep: string[] = [
    "Profil sebagai Kandidat",
    "Pendidikan dan Skill",
    "Pengalaman dan Sosial Media",
  ];
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      setChecking(true)
      const [data_profileCheck, fail_profileCheck] = await RequestAPI.Send<Record<string, boolean>>("/candidates/check", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
      if (fail_profileCheck) {
        setChecking(false)
        return setAlert({ show: true, message: fail_profileCheck.message })
      }
      if (data_profileCheck) {
        setChecking(false)
        if (!data_profileCheck["candidate"]) {
          return setCurrentStep(1)
        } else if (!data_profileCheck["educations"]) {
          return setCurrentStep(2)
        } else if (!data_profileCheck["experiences"]) {
          return setCurrentStep(3)
        }
      }
    })()
  }, [dataAction])
  return (
    <DashboardLayout isFor="candidate">
      <BaseAlert
        show={alert.show}
        message={alert.message}
        setShow={setAlert}
      />
      {/* Loading Wrapper -> Checking candidate profile completion */}
      {checking ? (
        <Typography component={"p"} variant="subtitle2" sx={{
          fontWeight: 500,
          color: grey[600]
        }}>
          Memeriksa kelengkapan profil ...
        </Typography>
      ) : currentStep ? (
        <Box component={"div"}>
          {/* When the user doesnt complete one of required profile data */}
          <Box component={"div"}
            sx={{
              marginBottom: '1em',
            }}
          >
            <Typography variant="h6" fontWeight={550} sx={{ color: grey[800] }}>
              Lengkapi
              <SimpleEmphasis text={" data profil "} />
              anda sebagai kandidat
            </Typography>
          </Box>
          {/* SMALL SCREEN */}
          {xsBreakpoint ? (
            <Box component={"div"}
              sx={{
                display: "flex",
                alignItems: "center",
                columnGap: "0.5em"
              }}
            >
              <Typography variant="subtitle1"
                sx={{
                  fontWeight: 550,
                  color: "#06816d"
                }}
              >
                Step
              </Typography>
              <Box component={"div"}
                sx={{
                  width: "1.5em",
                  height: "1.5em",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#06816d",
                  borderRadius: "1em"
                }}
              >
                <Typography variant="caption" sx={{ color: "white" }}>{currentStep && currentStep}</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: grey[700] }}>{currentStep && candidateStep[currentStep]}</Typography>
            </Box>
          ) : (
            <Stepper activeStep={(currentStep - 1)} sx={{}}>
              {candidateStep.map((stepName, index) => (
                <Step key={index}>
                  <StepLabel sx={{
                    ".MuiStepIcon-text": {
                      fill: 'white'
                    }
                  }}>
                    <Typography variant="subtitle2">{stepName}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          <Box component={"div"}
            sx={{
              marginY: '1em',
            }}
          >
            {formComponents[currentStep]}
          </Box>
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item lg={8} sm={12}>
            {/* candidate profile data component */}
            <CandidateProfile />
          </Grid>
          <Grid item lg={4} sm={12}>
            {/* candidate personal detail data component */}
            <PersonalDetail />
          </Grid>
        </Grid>
      )}
    </DashboardLayout>
  );
}
