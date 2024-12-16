import { Box, Grid, Step, StepLabel, Stepper, Typography, useMediaQuery } from "@mui/material";
import DashboardLayout from "../../../components/Templates/DashboardLayout";
import CandidateProfile from "../../../components/Molecules/Data.Display/CandidateProfile";
import PersonalDetail from "../../../components/Molecules/Data.Display/PersonalDetail";
import { useEffect, useState } from "react";
import { CandidateProfile as CandidateProfileType } from "../types";
import RequestAPI from "../../../services/api/request";
import BaseAlert from "../../../components/Molecules/Feedback/BaseAlert";
import { GetSession } from "../../global-helpers";
import { grey } from "@mui/material/colors";
import SimpleEmphasis from "../../../components/Molecules/Texts/SimpleEmphasis";
import CandidateProfileForm from "../../../components/Organisms/candidates/profile-overview/CandidateProfileForm";
import EducationSkillForm from "../../../components/Organisms/candidates/profile-overview/EducationSkillForm";
import ExperienceSocialForm from "../../../components/Organisms/candidates/profile-overview/ExperienceSocialForm";

export default function CandidateDashboard() {
  /* state */
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfileType | null>(null)
  const [currentStep, setCurrentStep] = useState<number | undefined>(undefined)
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
  const [dataAction, setDataAction] = useState<boolean>(false) // just for re-fecthing data
  /* breakpoint */
  const xsBreakpoint = useMediaQuery('(max-width: 600px)')
  /* constant */
  const formComponents: Record<number, JSX.Element> = {
    1: <CandidateProfileForm setCurrentStep={setCurrentStep} setAlert={setAlert} />,
    2: <EducationSkillForm setCurrentStep={setCurrentStep} setAlert={setAlert} />,
    3: <ExperienceSocialForm setCurrentStep={setCurrentStep} setAlert={setAlert} setDataAction={setDataAction} />
  }
  const candidateStep: string[] = [
    "Candidate Profile",
    "Educations and Skills",
    "Experience and Socials",
  ];
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data_profileCheck, fail_profileCheck] = await RequestAPI.Send<Record<string, boolean>>("/api/v1/candidates/check", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
      if (fail_profileCheck) {
        return setAlert({ show: true, message: fail_profileCheck.message })
      }
      if (data_profileCheck) {
        console.log("profile status \t:", data_profileCheck)
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
      {/* if there any step, then show stepper form canddate */}
      {currentStep && (
        <Box component={"div"}>
          <Box component={"div"}
            sx={{
              marginBottom: '1em',
            }}
          >
            <Typography variant="h6" fontWeight={550} sx={{ color: grey[800] }}>
              Complete
              <SimpleEmphasis text={" your profile "} />
              as candidate
            </Typography>
          </Box>
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
                <Typography variant="caption" sx={{ color: "white" }}>{currentStep && currentStep + 1}</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: grey[700] }}>{currentStep && candidateStep[currentStep]}</Typography>
            </Box>
          ) : (
            <Stepper activeStep={currentStep} sx={{}}>
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
      )}
      {!currentStep && (
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
