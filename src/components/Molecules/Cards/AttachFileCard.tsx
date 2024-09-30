import { InsertDriveFileRounded } from "@mui/icons-material";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { blue, grey } from "@mui/material/colors";

export default function AttachFileCard({ fileName }: { fileName: string }) {
  /* breakpoint */
  const small = useMediaQuery("(max-width: 600px)");
  return (
    <Box
      component={"div"}
      sx={{
        border: "1px solid " + grey[300],
        backgroundColor: grey[100],
        borderRadius: "0.3em",
        flexBasis: small ? "calc(100% - 0.5em)" : "calc(33.33% - 0.5em)",
      }}
    >
      <Button
        variant="text"
        fullWidth
        sx={{
          borderRadius: "0.3em",
          padding: "0.3em 1em",
          cursor: "pointer",
          border: "none",
          color: grey[600],
          justifyContent: "start",
          "&:hover": {
            color: blue[400],
          },
        }}
        startIcon={<InsertDriveFileRounded sx={{ fontSize: "1.5em" }} />}
      >
        <Box component={"div"}>
          <Typography
            textAlign={"start"}
            variant="body2"
            sx={{ display: "flex" }}
          >
            {fileName}
          </Typography>
          <Typography
            textAlign={"start"}
            variant="caption"
            sx={{ display: "flex" }}
          >
            1.23MB
          </Typography>
        </Box>
      </Button>
    </Box>
  );
}
