import { SxProps } from "@mui/material";
import React from "react";

export default function SimpleEmphasis({
  text,
  textColor = "#06816d",
  sx,
}: {
  text: string | number;
  textColor?: string;
  sx?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        color: textColor,
        fontWeight: 600,
        ...sx,
      }}
    >
      {text}
    </span>
  );
}
