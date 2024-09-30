import { BookmarkBorder, LocationOnOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";

export default function VacancyItemList() {
  /* breakpoint */
  return (
    <Box
      component={"div"}
      sx={{
        border: "1px solid #e6f2f0",
        borderRadius: "0.5em",
        marginBottom: "1.5em",
      }}
    >
      {/* header */}
      <Box
        component={"div"}
        sx={{
          display: "flex",
          padding: "0.5em",
        }}
      >
        <Box borderRadius={"0.3em"}>
          <Avatar alt="Company Logo" src="/logos/google-png.png" />
        </Box>
        <Box component={"div"} sx={{ flexGrow: 1, paddingX: "0.5em" }}>
          <Box
            component={"div"}
            sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
          >
            <Typography
              component={"span"}
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                letterSpacing: "0.02em",
                color: "#555555",
                marginRight: "1em",
              }}
            >
              Senior Software Engineer
            </Typography>
            <Typography
              component={"span"}
              variant="caption"
              sx={{
                color: "#999999",
              }}
            >
              2 days ago
            </Typography>
          </Box>
          <Box display={"flex"}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#777777",
                fontWeight: "bold",
              }}
            >
              Google
            </Typography>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ marginX: "0.5em" }}
            />
            <Typography variant="subtitle2">Monthly Pay : {3000000}</Typography>
          </Box>
        </Box>
        <Box
          component={"div"}
          sx={{
            padding: "0.3em",
          }}
        >
          <IconButton size="small" sx={{ border: "1px solid #cde6e2" }}>
            <BookmarkBorder fontSize="small" color="primary" />
          </IconButton>
        </Box>
      </Box>
      {/* content */}
      <Box component={"div"} sx={{ padding: "0.5em" }}>
        <Box component={"div"} sx={{ marginY: "0.5em" }}>
          <Typography variant="body2" color={"#555555"}>
            A Cloud Engineer is responsible for designing, implementing, and
            managing cloud-based systems and infrastructure to ensure
            scalability, security, and performance. They collaborate with
            development teams to optimize cloud solutions and troubleshoot
            issues within cloud environments.
          </Typography>
        </Box>
        <Box
          component={"div"}
          className="vacancy-category vacancy-tags"
          marginTop={"1.5em"}
        >
          {/* more chip */}
          <Chip
            variant="filled"
            label={"Retail and E-Commerce"}
            sx={{
              backgroundColor: "#cde6e2",
              fontSize: "smaller",
              fontWeight: "bold",
            }}
          />
        </Box>
      </Box>
      {/* action */}
      <Box
        component={"div"}
        padding={"0.5em 1em"}
        display={"flex"}
        justifyContent={"space-between"}
        bgcolor={"#e6f2f0"}
      >
        <Box>
          <Chip
            icon={<LocationOnOutlined />}
            label={"Bandengan, Jakarta Utara"}
            sx={{ backgroundColor: "transparent" }}
          />
        </Box>
        <Box>
          <Button variant="contained" color="primary" size="small">
            Apply
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
