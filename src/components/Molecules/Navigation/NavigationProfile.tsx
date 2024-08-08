/* Material UI */
import { Box } from "@mui/material";
import _EMITTER from "../../../events";
import NavigationOnAuthenticated from "./Authenticated";
import NavigationOnUnauthenticated from "./Unauthenticated";

export default function NavigationProfile({ sxProps } : { sxProps?: any }) {
  const isLoggedIn = true
  return (
    <Box>
      {/* Authenticated */}
      {isLoggedIn &&
        <NavigationOnAuthenticated sxProps={sxProps} />
      }
      {/* Unauthenticated */}
      {!isLoggedIn &&
        <NavigationOnUnauthenticated sxProps={sxProps} />
      }
    </Box>
  )
}