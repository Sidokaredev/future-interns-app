import { Box, Container, Typography } from "@mui/material";
import React from "react";
import SimpleEmphasis from "../Molecules/Texts/SimpleEmphasis";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      component={"div"}
      className="auth-layout"
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#e6f2f0",
      }}
    >
      <Container disableGutters maxWidth="md">
        <Box
          component={"div"}
          sx={{
            borderRadius: "0.3em",
            backgroundColor: "white",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
            padding: "1em",
            marginX: {
              xs: "1em",
              md: 0,
            },
          }}
        >
          {children}
        </Box>
        <Box component={"div"} sx={{ paddingY: "0.5em", paddingX: "1em" }}>
          <Typography variant="caption">
            &copy; Sidokaredev. -
            <SimpleEmphasis text={" Learn before, not after"} />
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
