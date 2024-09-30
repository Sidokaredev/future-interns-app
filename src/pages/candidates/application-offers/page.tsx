import {
  Box,
  Button,
  Chip,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DashboardLayout from "../../../components/Templates/DashboardLayout";
import { grey, teal } from "@mui/material/colors";
import {
  Business,
  DonutLargeRounded,
  DownloadRounded,
  Place,
  SearchRounded,
} from "@mui/icons-material";

export default function CandidateApplicationsOffers() {
  return (
    <DashboardLayout>
      <Box
        component={"div"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1em",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 550 }}>
          Offer List
        </Typography>
        <Box component={"div"}>
          <TextField
            type="text"
            name="offer-search"
            placeholder="Search your offer"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                minWidth: {
                  xs: "15em",
                  md: "25em",
                },
                fontSize: "small",
              },
            }}
          />
        </Box>
      </Box>
      <Stack direction={"column"} spacing={1}>
        {[0, 1, 2].map((_, index) => (
          <Box
            key={index}
            component={"div"}
            sx={{ border: "1px solid " + grey[400], borderRadius: "0.3em" }}
          >
            <Box
              component={"div"}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                paddingX: "1em",
                paddingTop: "0.5em",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 550,
                  color: grey[800],
                }}
              >
                Intern as Cloud Architect
              </Typography>
              <Chip
                label="Waiting for the LoA to be issued"
                icon={<DonutLargeRounded />}
                size="small"
                sx={{
                  "& .MuiChip-icon": {
                    color: teal[700],
                  },
                  color: teal[700],
                  backgroundColor: teal[50],
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: {
                  xs: "0.2em 0",
                  md: "0 1.5em",
                },
                paddingX: "1em",
                marginTop: {
                  xs: "1em",
                  md: 0,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "end",
                }}
              >
                <Business fontSize="small" sx={{ color: "#06816d" }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 500,
                    color: grey[600],
                    marginLeft: "0.5em",
                  }}
                >
                  PT. Sidokaredev Karya Mandiri
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "end",
                }}
              >
                <Place fontSize="small" sx={{ color: "#06816d" }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 500,
                    color: grey[600],
                    marginLeft: "0.5em",
                  }}
                >
                  Sidoarjo, Indonesia (INA)
                </Typography>
              </Box>
            </Box>
            <Box component={"div"} sx={{ paddingX: "1em", paddingTop: "1em" }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 550, color: grey[800] }}
              >
                Note :
              </Typography>
              <Typography variant="body2" sx={{ color: grey[600] }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Explicabo hic placeat officia officiis repellat inventore ab
                ducimus nisi, id provident blanditiis sequi ipsum deleniti
                facere consequatur nemo earum cumque deserunt.
              </Typography>
            </Box>
            <Divider
              orientation="horizontal"
              sx={{ borderColor: grey[400], paddingY: "0.5em" }}
            />
            <Box
              component={"div"}
              sx={{
                display: "flex",
                gap: "0 1em",
                padding: "1em",
                backgroundColor: grey[100],
              }}
            >
              <Button variant="contained" startIcon={<DownloadRounded />}>
                Letter of Acceptance
              </Button>
              <Button variant="text" size="small">
                View
              </Button>
            </Box>
          </Box>
        ))}
        <Box
          component={"div"}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Button variant="outlined">Load more</Button>
        </Box>
      </Stack>
    </DashboardLayout>
  );
}
