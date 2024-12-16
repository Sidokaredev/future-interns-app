import { Box, Container, Toolbar } from "@mui/material";
import React from "react";
import DashboardNavigation from "../Organisms/Navigation/DashboardNavigation";
import Footer from "../Organisms/Footer";

export default function DashboardLayout({
  isFor,
  children,
}: {
  isFor: "candidate" | "employer";
  children: React.ReactNode;
}) {
  return (
    <Box component={"div"}>
      <DashboardNavigation isFor={isFor} />
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
