import {
  Box,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import DashboardLayout from "../../../components/Templates/DashboardLayout";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { GetSession } from "../../global-helpers";
import RequestAPI from "../../../services/api/request";
import RegistrationStep1 from "../../../components/Organisms/employers/steps/RegistrationStep1";
import RegistrationStep2 from "../../../components/Organisms/employers/steps/RegistrationStep2";
import RegistrationStep3 from "../../../components/Organisms/employers/steps/RegistrationStep3";
import BaseAlert from "../../../components/Molecules/Feedback/BaseAlert";
import SimpleEmphasis from "../../../components/Molecules/Texts/SimpleEmphasis";
import EmployerData from "../../../components/Organisms/employers/profile-overview/EmployerData";

type EmployerProfileCheckType = {
  employer: boolean;
  headquarters: boolean;
  office_images: boolean;
}

export default function EmployerProfileOverview() {
  /* state */
  const [currentStep, setCurrentStep] = useState<number | undefined>(undefined);
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" });
  const [checking, setChecking] = useState<boolean>(true);
  /* constants */
  const formComponents: Record<number, JSX.Element> = {
    1: <RegistrationStep1 setCurrentStep={setCurrentStep} setAlert={setAlert} />,
    2: <RegistrationStep2 setCurrentStep={setCurrentStep} setAlert={setAlert} />,
    3: <RegistrationStep3 setCurrentStep={setCurrentStep} setAlert={setAlert} />,
  };
  const employerSteps = [
    "Profil sebagai Employer",
    "Informasi Kantor",
    "Galeri Kantor dan Sosial Media",
  ];
  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      setChecking(true);
      const [dataCheck, failCheck] = await RequestAPI.Send<EmployerProfileCheckType>(
        "/employers/check",
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      )
      if (failCheck) {
        setChecking(false);
        return setAlert({ show: true, message: failCheck.message });
      }
      if (dataCheck) {
        setChecking(false);
        if (!dataCheck.employer) {
          return setCurrentStep(1)
        } else if (!dataCheck.headquarters) {
          return setCurrentStep(2)
        } else if (!dataCheck.office_images) {
          return setCurrentStep(3)
        }
      }
    })()
  }, [])
  return (
    <DashboardLayout isFor="employer">
      {/* base notification alert */}
      <BaseAlert
        show={alert.show}
        message={alert.message}
        setShow={setAlert}
      />
      {/* checking completion employer profile */}
      {checking ? (
        <Box component={"div"}>
          <Typography component={"p"} variant="subtitle2" sx={{
            fontWeight: 500,
            color: grey[600]
          }}>
            Memeriksa kelengkapan profil ...
          </Typography>
        </Box>
      ) : currentStep ? (
        <>
          <Box component={"div"}
            sx={{
              marginBottom: '1em',
            }}
          >
            <Typography variant="h6" fontWeight={550} sx={{ color: grey[800] }}>
              Lengkapi
              <SimpleEmphasis text={" data profil "} />
              anda sebagai employer
            </Typography>
          </Box>
          <Stepper activeStep={(currentStep - 1)} sx={{}}>
            {employerSteps.map((stepName, index) => (
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
          <Box component={"div"}
            sx={{
              marginY: '1em',
            }}
          >
            {formComponents[currentStep]}
          </Box>
        </>
      ) : (
        /* EMPLOYER DATA COMPONENT */
        <EmployerData />
      )}
    </DashboardLayout>
  );
}
