import { Box, Container, Toolbar } from "@mui/material";
import AdministratorNavigation from "../Organisms/Navigation/AdministratorNavigation";

export default function AdministratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box component={"div"}
      sx={{
        backgroundColor: "white",
      }}
    >
      <AdministratorNavigation />
      {/* <Toolbar sx={{ marginTop: "3em" }} /> */}
      <Toolbar />
      <Container maxWidth={"lg"} disableGutters
        sx={{
          paddingX: "0.5em",
          paddingY: "0.5em",
        }}
      >
        {children}
      </Container>
    </Box>
  )
}