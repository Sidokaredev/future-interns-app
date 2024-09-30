import { Box, Container, Toolbar } from "@mui/material";
import React from "react";
import DashboardNavigation from "../Organisms/Navigation/DashboardNavigation";
import Footer from "../Organisms/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
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
