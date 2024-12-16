import {
  Box,
  Snackbar,
  SxProps,
} from "@mui/material";
import AddressData from "../../Organisms/candidates/profile-overview/AddressData";
import { useState } from "react";
import { onCloseSnackbar } from "../../../pages/global-helpers";
import SocialData from "../../Organisms/candidates/profile-overview/SocialData";

export default function PersonalDetail({
  containerStyle,
}: {
  containerStyle?: SxProps;
}) {
  /* state */
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({})
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
  /* event handler */
  const handleOpenDialog = (key: string) => {
    setOpenDialog(prev => ({
      ...prev,
      [key]: true
    }))
  }
  const onCloseDialog = (key: string) => {
    setOpenDialog(prev => ({
      ...prev,
      [key]: false
    }))
  }
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        message={alert.message}
        autoHideDuration={3000}
        onClose={onCloseSnackbar(setAlert)}
      />
      <Box
        component={"div"}
        id="personal-detail"
        sx={{
          position: "sticky",
          top: "3.5em",
          ...containerStyle
        }}
      >
        {/* address data component */}
        <AddressData
          openDialog={openDialog}
          handleOpenDialog={handleOpenDialog}
          onCloseDialog={onCloseDialog}
          setAlert={setAlert}
        />
        {/* social data component */}
        <SocialData
          openDialog={openDialog}
          handleOpenDialog={handleOpenDialog}
          onCloseDialog={onCloseDialog}
          setAlert={setAlert}
        />
      </Box>
    </>
  );
}
