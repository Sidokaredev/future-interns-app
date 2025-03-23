import {
  Stack,
} from "@mui/material";
import { useState } from "react";
import ProfileData from "../../Organisms/candidates/profile-overview/ProfileData";
import EducationsData from "../../Organisms/candidates/profile-overview/EducationData";
import SkillData from "../../Organisms/candidates/profile-overview/SkillData";
import ExperienceData from "../../Organisms/candidates/profile-overview/ExperienceData";
export default function CandidateProfile() {
  /* state */
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({})
  /* event handler */
  const handleOpenDialog = (key: string) => {
    setOpenDialog(prev => ({ ...prev, [key]: true }))
  }
  const onCloseDialog = (key: string) => {
    setOpenDialog(prev => ({ ...prev, [key]: false }))
  }
  return (
    <Stack direction={"column"} spacing={3}>
      <ProfileData
        openDialog={openDialog}
        handleOpenDialog={handleOpenDialog}
        onCloseDialog={onCloseDialog}
      />
      {/* candidate.educations */}
      <EducationsData
        openDialog={openDialog}
        handleOpenDialog={handleOpenDialog}
        onCloseDialog={onCloseDialog}
      />
      {/* candidate.skills */}
      <SkillData
        openDialog={openDialog}
        handleOpenDialog={handleOpenDialog}
        onCloseDialog={onCloseDialog}
      />
      {/* candidate.experiences */}
      <ExperienceData
        openDialog={openDialog}
        handleOpenDialog={handleOpenDialog}
        onCloseDialog={onCloseDialog}
      />
    </Stack>
  );
}
