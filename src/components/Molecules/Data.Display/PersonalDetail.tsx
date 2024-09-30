import {
  CakeRounded,
  DialpadRounded,
  Edit,
  FileDownload,
  HomeWorkRounded,
  LanguageRounded,
  Launch,
  LocationCityRounded,
  MailOutlineRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import SocialCard from "../Cards/SocialCard";

export default function PersonalDetail() {
  return (
    <Box
      component={"div"}
      id="personal-detail"
      sx={{ position: "sticky", top: "3.5em" }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 550,
          color: grey[800],
          marginBottom: "0.5em",
        }}
      >
        Personal Detail
      </Typography>
      <Stack
        direction={"column"}
        spacing={1}
        sx={{
          border: "1px solid " + grey[300],
          padding: "0.5em",
          borderRadius: "0.3em",
        }}
      >
        {[
          {
            icon: (
              <MailOutlineRounded
                fontSize="small"
                sx={{ marginRight: "0.5em", color: grey[400] }}
              />
            ),
            label: "Email",
            value: "fatkhurawe@gmail.com",
          },
          {
            icon: (
              <CakeRounded
                fontSize="small"
                sx={{ marginRight: "0.5em", color: grey[400] }}
              />
            ),
            label: "Date of Birth",
            value: "30, May 2002",
          },
          {
            icon: (
              <HomeWorkRounded
                fontSize="small"
                sx={{ marginRight: "0.5em", color: grey[400] }}
              />
            ),
            label: "Address",
            value: "Jl. H. Mawardi, RT 03/RW 01, Jerukgamping, Krian",
          },
          {
            icon: (
              <LocationCityRounded
                fontSize="small"
                sx={{ marginRight: "0.5em", color: grey[400] }}
              />
            ),
            label: "City",
            value: "Kabupaten Sidoarjo",
          },
          {
            icon: (
              <LanguageRounded
                fontSize="small"
                sx={{ marginRight: "0.5em", color: grey[400] }}
              />
            ),
            label: "Country",
            value: "Indonesia",
          },
          {
            icon: (
              <DialpadRounded
                fontSize="small"
                sx={{ marginRight: "0.5em", color: grey[400] }}
              />
            ),
            label: "Postal Code",
            value: "61262",
          },
        ].map((data, index) => (
          <Box
            key={index}
            component={"div"}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box
              component={"div"}
              className="label"
              sx={{
                minWidth: "8em",
                display: "flex",
              }}
            >
              {data.icon}
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 550,
                  color: grey[400],
                }}
              >
                {data.label}
              </Typography>
            </Box>
            <Typography
              variant="subtitle2"
              textAlign={"end"}
              sx={{
                color: grey[600],
              }}
            >
              {data.value}
            </Typography>
          </Box>
        ))}
        <Divider
          orientation="horizontal"
          sx={{ borderColor: grey[300], paddingY: "0.5em" }}
        />
        <Box
          component={"div"}
          sx={{
            borderRadius: "0.5em",
          }}
        >
          <Button
            variant="text"
            endIcon={<Launch />}
            fullWidth
            sx={{
              marginBottom: "1em",
            }}
          >
            6734-Article Text-25152-1-10-20230914.pdf
          </Button>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Button
              variant="contained"
              endIcon={<FileDownload />}
              color="primary"
              size="small"
              fullWidth
            >
              Download CV
            </Button>
            <Tooltip
              title={"Change CV"}
              sx={{
                marginLeft: "0.5em",
                "&:hover": { backgroundColor: grey[300] },
              }}
            >
              <IconButton size="small">
                <Edit sx={{ color: grey[700] }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Stack>
      <SocialCard
        socialItems={[
          {
            social: "linkedin",
            linkAddress: "https://linkedin.com",
          },
          {
            social: "github",
            linkAddress: "https://github.com",
          },
        ]}
      />
    </Box>
  );
}
