import { CheckOutlined, ContentCopyOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
  Tooltip,
  Typography,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import "@fontsource/roboto-mono";
import React, { useEffect, useState } from "react";

export default function CopyText({
  textToCopy,
  options,
}: {
  textToCopy: string;
  options?: {
    noBorder?: boolean;
    useTextButton?: boolean;
    fontSize?: "x-small" | "small" | "medium";
  };
}) {
  /* State */
  const [copied, setCopied] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  console.info(countdown);
  const [snackbar, setSnackbar] = useState<boolean>(false);
  /* Handler */
  const clipboardHandler = (text: string) => async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setSnackbar(true);
    } catch (error) {
      console.info("failed to copy \t: ", error);
    }
    // setCopied(false);
    setCountdown(3);
  };
  const snackbarOnClose = (
    _: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar(false);
  };
  /* Hooks */
  useEffect(() => {
    if (copied === true && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setCopied(false);
      setCountdown(3);
    }
  }, [copied, countdown]);
  return (
    <Box
      component={"div"}
      className="copy-text"
      sx={{
        border: options?.noBorder ? undefined : "1px solid " + grey[300],
        borderRadius: "0.3em",
        backgroundColor: grey[100],
      }}
    >
      <Box
        component={"div"}
        className="text-to-copy"
        sx={{
          display: "flex",
          alignItems: "center",
          paddingX: "0.5em",
          paddingY: options?.noBorder ? undefined : "0.2em",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            flexGrow: 1,
            color: grey[800],
            // fontFamily: "Roboto Mono",
            letterSpacing: "0.05em",
            fontSize: options?.fontSize,
          }}
        >
          {textToCopy}
        </Typography>
        <Tooltip
          title="Copy"
          slotProps={{ popper: { sx: { letterSpacing: "0.03em" } } }}
        >
          {options?.useTextButton ? (
            <Button
              variant="text"
              size="small"
              endIcon={
                copied ? (
                  <CheckOutlined sx={{ fontSize: "1em", color: green[400] }} />
                ) : (
                  ""
                )
              }
              onClick={clipboardHandler(textToCopy)}
              sx={{ color: grey[600], fontStyle: "italic" }}
            >
              Copy
            </Button>
          ) : (
            <IconButton size="small" onClick={clipboardHandler(textToCopy)}>
              {copied ? (
                <CheckOutlined sx={{ fontSize: "1em", color: green[400] }} />
              ) : (
                <ContentCopyOutlined sx={{ fontSize: "1em" }} />
              )}
            </IconButton>
          )}
        </Tooltip>
        <Snackbar
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
          open={snackbar}
          autoHideDuration={3000}
          onClose={snackbarOnClose}
          message={"Text Copied"}
          ContentProps={{
            sx: {
              // fontSize: "small",
              backgroundColor: grey[700],
            },
          }}
          // action
        />
      </Box>
    </Box>
  );
}
