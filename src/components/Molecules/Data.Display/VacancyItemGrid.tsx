import { ArrowOutward, BookmarkBorder, Place } from "@mui/icons-material";
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
import { Link as ReactRouterLink } from "react-router-dom";

type VacancyItemSxProps = {
  gridItem: SxProps;
  card: SxProps;
  companyName: SxProps;
  bookmarkButton: SxProps;
  goToButton: SxProps;
  title: SxProps;
};

export default function VacancyItemGrid() {
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
              <Avatar src="/logos/google-png.png" alt="Company Logo" />
              <Typography
                variant="body1"
                fontWeight={"bold"}
                component={ReactRouterLink}
                to={"/company-details"}
                sx={styles.companyName}
              >
                Google Android
              </Typography>
            </Stack>
          }
          action={
            <Stack direction={"row"} spacing={2}>
              <IconButton sx={styles.bookmarkButton}>
                <BookmarkBorder />
              </IconButton>
              <IconButton
                className="cardheader-open-vacancy-detail"
                sx={styles.goToButton}
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
            component={ReactRouterLink}
            to={"/company-details"}
            sx={styles.title}
          >
            Marketing Director at Virginia
          </Typography>
          {/* Vacancy Summary Description */}
          <Typography marginY={2} noWrap>
            Looking for an experienced Web Designer for an our company. Looking
            for an experienced Web Designer for an our company. Looking for an
            experienced Web Designer for an our company.
          </Typography>
          {/* Vacancy Label */}
          <Grid container spacing={1}>
            <Grid item>
              <Chip
                label={
                  <Typography variant="caption" color={"orange"}>
                    On-Site
                  </Typography>
                }
              />
            </Grid>
            <Grid item>
              <Chip
                label={
                  <Typography variant="caption" color={"blueviolet"}>
                    Rp1.700.000,00
                  </Typography>
                }
              />
            </Grid>
            <Grid item>
              <Chip
                icon={<Place fontSize="small" color="primary" />}
                label={"Bandengan Selatan, Kota Adm. Jakarta Utara"}
                sx={{ color: "#045a55", bgcolor: "#c2fffb55" }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}
