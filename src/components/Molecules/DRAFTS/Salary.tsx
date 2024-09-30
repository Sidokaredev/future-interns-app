import {
  Box,
  FormControlLabel,
  InputLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

export default function SearchBySalary() {
  const IDRFormatter = (idrNumber: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(idrNumber);
  };
  return (
    <>
      <Box>
        <InputLabel>
          <Typography variant="subtitle1" fontWeight={"bold"}>
            Salary
          </Typography>
        </InputLabel>
        <RadioGroup
          sx={{
            marginY: "0.2em",
          }}
        >
          <FormControlLabel
            value="1"
            control={<Radio sx={{ padding: "3px 9px" }} />}
            label={
              <Typography variant="body2" color={"#777777"}>
                {IDRFormatter(0) + " - " + IDRFormatter(5000000)}
              </Typography>
            }
          />
          <FormControlLabel
            value="2"
            control={<Radio sx={{ padding: "3px 9px" }} />}
            label={
              <Typography variant="body2" color={"#777777"}>
                {IDRFormatter(5000000) + " - " + IDRFormatter(10000000)}
              </Typography>
            }
          />
          <FormControlLabel
            value="3"
            control={<Radio sx={{ padding: "3px 9px" }} />}
            label={
              <Typography variant="body2" color={"#777777"}>
                {IDRFormatter(10000000) + " - " + IDRFormatter(15000000)}
              </Typography>
            }
          />
          <FormControlLabel
            value="4"
            control={<Radio sx={{ padding: "3px 9px" }} />}
            label={
              <Typography variant="body2" color={"#777777"}>
                {"More than " + IDRFormatter(15000000)}
              </Typography>
            }
          />
        </RadioGroup>
      </Box>
    </>
  );
}
