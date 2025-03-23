import { SxProps, Typography, TypographyVariant } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { Box, useMediaQuery } from "@mui/system";
import { useEffect, useRef, useState } from "react";

export default function AutoOverflowText({
  text,
  variant,
  sx,
}: {
  text: string;
  variant: TypographyVariant;
  sx?: SxProps
}) {
  /* media-queries */
  const xSmallMedia = useMediaQuery("(max-width: 600px)");
  const smallMedia = useMediaQuery("(max-width: 900px)");
  /* state */
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  /* ref */
  const textRef = useRef<HTMLParagraphElement>(null);

  /* side effect */
  useEffect(() => {
    if (textRef.current) {
      const maxHeight = parseInt(
        window.getComputedStyle(textRef.current).lineHeight || "0"
      ) * 3;

      setIsOverflowing(textRef.current.scrollHeight > maxHeight);
    }
  }, [text, xSmallMedia, smallMedia]);
  return (
    <Box component={"div"}>
      <Typography ref={textRef} component={"p"} variant={variant}
        sx={{
          color: grey[700],
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          WebkitLineClamp: isExpanded ? "none" : 3,
          whiteSpace: "pre-line",
          ...sx
        }}
      >
        {text}
      </Typography>
      {isOverflowing && (
        <Typography component={"p"} variant="caption" sx={{ color: grey[600], fontStyle: "italic", cursor: "pointer", "&:hover": { color: blue[500] } }} onClick={() => {
          setIsExpanded(prev => !prev);
        }}>
          {isExpanded ? "See less" : "See more"}
        </Typography>
      )}
    </Box>
  )
}