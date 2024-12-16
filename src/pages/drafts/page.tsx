import { Box, TextField } from "@mui/material";
import BaseLayout from "../../components/Templates/BaseLayout";
import { green } from "@mui/material/colors";

export default function Drafts() {
  const stringValue = "- line 1\n - line 2"
  return (
    <TextField
      value={stringValue}
      rows={4}
      multiline
    />
  );
}
