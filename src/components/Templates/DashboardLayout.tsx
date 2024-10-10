import { Box, Container, Toolbar } from "@mui/material";
import React, { ReactElement } from "react";
import DashboardNavigation from "../Organisms/Navigation/DashboardNavigation";
import Footer from "../Organisms/Footer";
import { grey } from "@mui/material/colors";

export default function DashboardLayout({
  menuItems,
  children,
}: {
  menuItems?: { icon: ReactElement; name: string; path: string }[];
  children: React.ReactNode;
}) {
  return (
    <Box component={"div"}>
      <DashboardNavigation />
      {/* App Bar Spacer */}
      <Toolbar variant="dense" />
      {/* Main Content */}
      <Container
        maxWidth={"lg"}
        sx={{
          paddingY: "1em",
        }}
      >
        {children}
      </Container>
      <Footer />
    </Box>
  );
}
