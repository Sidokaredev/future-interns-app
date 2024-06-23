import { Link as RouterLink } from "react-router-dom";
import { Button, Badge } from "@mui/material";
/* Icon */
import { Mail } from "@mui/icons-material";

export default function ForgotPassword() {
  return (
    <>
      Restore your password through email:
      <br />
      <Button component={RouterLink} to={"/accounts/auth"} variant="contained">Go back Login</Button>
      <Badge badgeContent={4} color="primary">
        <Mail color="action" />
    </Badge>
    </>
  )
}