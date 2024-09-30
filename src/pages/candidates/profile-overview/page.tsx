import { Grid } from "@mui/material";
import DashboardLayout from "../../../components/Templates/DashboardLayout";
import CandidateProfile from "../../../components/Molecules/Data.Display/CandidateProfile";
import PersonalDetail from "../../../components/Molecules/Data.Display/PersonalDetail";

export default function CandidateDashboard() {
  return (
    <DashboardLayout>
      <Grid container spacing={2}>
        <Grid item lg={8} sm={12}>
          <CandidateProfile />
        </Grid>
        <Grid item lg={4} sm={12}>
          <PersonalDetail />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
