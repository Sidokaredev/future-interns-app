import { Box } from "@mui/material";
import React from "react";
import Footer from "../Organisms/Footer";
import BaseNavigation from "../Organisms/Navigation/BaseNavigation";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box component={"div"}>
      <BaseNavigation />
      {children}
      <Footer />
    </Box>
  );
}
