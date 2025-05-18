import { ArrowOutward, Place } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Stack,
  type SxProps,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { VacancyType } from "../../../pages/employers/types";
import { HOST } from "../../../pages/administrators/performance/[id]/constants";

type VacancyItemSxProps = {
  gridItem: SxProps;
  card: SxProps;
  companyName: SxProps;
  bookmarkButton: SxProps;
  goToButton: SxProps;
  title: SxProps;
};

export default function VacancyItemGrid({
  vacancy
}: {
  vacancy: VacancyType
}) {
  /* react-router */
  const navigate = useNavigate();
  /* sx */
  const styles: VacancyItemSxProps = {
    gridItem: {
      "&:hover .cardheader-open-vacancy-detail": {
        backgroundColor: "#06816d",
        color: "white",
      },
    },
    card: {
      height: "100%",
      border: "1px solid #c2fffb",
      boxShadow: "none",
    },
    companyName: {
      textDecoration: "none",
      color: "#5d5d5d",
      "&:hover": { color: "#06816d" },
    },
    bookmarkButton: {
      color: "#ababab",
      border: "1px solid #c2fffb",
      "&:hover": {
        backgroundColor: "#06816d",
        color: "white",
      },
    },
    goToButton: {
      color: "#06816d",
      border: "1px solid #c2fffb",
    },
    title: {
      textDecoration: "none",
      color: "#3c3c3c",
      "&:hover": { color: "#06816d" },
    },
  };
  return (
    <Grid item xs={12} md={6} lg={4} sx={styles.gridItem}>
      <Card sx={styles.card}>
        <CardHeader
          avatar={
            <Stack spacing={1}>
              <Avatar
                src={HOST.main + vacancy.employer.profile_image_path}
                alt="Company Logo"
              />
              <Typography
                variant="body1"
                fontWeight={"bold"}
                sx={styles.companyName}
              >
                {vacancy.employer.name}
              </Typography>
            </Stack>
          }
          action={
            <Stack direction={"row"} spacing={2}>
              {/* <IconButton sx={styles.bookmarkButton}>
                <BookmarkBorder />
              </IconButton> */}
              <IconButton
                className="cardheader-open-vacancy-detail"
                sx={styles.goToButton}
                onClick={() => {
                  navigate("/vacancy/" + vacancy.id)
                }}
              >
                <ArrowOutward />
              </IconButton>
            </Stack>
          }
        />
        <CardContent sx={{ paddingY: 0 }}>
          {/* Vacancy Title */}
          <Typography
            fontWeight={600}
            fontSize={"1.2rem"}
            sx={{
              ...styles.title,
              cursor: "pointer"
            }}
            onClick={() => {
              navigate("/vacancy/" + vacancy.id)
            }}
          >
            {vacancy.position}
          </Typography>
          {/* Vacancy Summary Description */}
          <Typography marginY={2} noWrap sx={{ whiteSpace: "pre-line" }}>
            {vacancy.description}
          </Typography>
          {/* Vacancy Label */}
          <Grid container spacing={1}>
            <Grid item>
              <Chip
                label={
                  <Typography variant="caption" color={"orange"}>
                    {vacancy.work_arrangement}
                  </Typography>
                }
              />
            </Grid>
            <Grid item>
              <Chip
                label={
                  <Typography variant="caption" color={"blueviolet"}>
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(vacancy.salary)}
                  </Typography>
                }
              />
            </Grid>
            <Grid item>
              <Chip
                icon={<Place fontSize="small" color="primary" />}
                label={vacancy.employer.location}
                sx={{ color: "#045a55", bgcolor: "#c2fffb55" }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}
