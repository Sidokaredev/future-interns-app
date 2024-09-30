import { GitHub, Instagram, LinkedIn } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";

export type SocialCardProps = {
  social: "instagram" | "github" | "linkedin";
  linkAddress: string;
};

export default function SocialCard({
  socialItems,
}: {
  socialItems: SocialCardProps[];
}) {
  /* Icon Assets */
  const socialIcon: Record<string, React.ReactNode> = {
    instagram: <Instagram sx={{ color: "#e1306c" }} />,
    github: <GitHub sx={{ color: "black" }} />,
    linkedin: <LinkedIn sx={{ color: "#0a66c2" }} />,
  };
  return (
    <Box
      component={"div"}
      sx={{
        marginY: "1em",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 550,
          color: grey[600],
          textAlign: "center",
        }}
      >
        Social
      </Typography>
      <Box
        component={"div"}
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "0 0.5em",
        }}
      >
        {socialItems.map((item, index) => (
          <IconButton
            key={index}
            size="small"
            sx={{
              borderRadius: "0.3em",
              border: `0.1em solid ${grey[400]}`,
            }}
            onClick={() => window.open(item.linkAddress, "_blank")}
          >
            {socialIcon[item.social]}
          </IconButton>
        ))}
      </Box>
    </Box>
  );
}
