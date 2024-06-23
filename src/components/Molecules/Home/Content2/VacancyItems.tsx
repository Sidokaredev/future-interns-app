import { ArrowOutward, BookmarkBorder, Place } from "@mui/icons-material";
import { Avatar, Card, CardContent, CardHeader, Chip, colors, Grid, IconButton, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function VacancyItems() {
  const itemStyles = {
    griditem: {
      '&:hover .cardheader-open-vacancy-detail': {
        backgroundColor: '#06816d',
        color: 'white'
      },
    },
    bookmark: {
      color: '#ababab',
      border: '1px solid #c2fffb',
      '&:hover': {
        backgroundColor: '#06816d',
        color: 'white'
      },
    },
    openVacancy: {
      color: '#06816d',
      border: '1px solid #c2fffb',
    },
    card: {
      height: '100%',
      border: '1px solid #c2fffb', boxShadow: 'none'
    },
    company: {
      textDecoration: 'none',
      color: '#5d5d5d',
      '&:hover': { color: '#06816d' }
    },
    vacancyTitle: { textDecoration: 'none', color: '#3c3c3c', '&:hover': { color: '#06816d' } }
  }
  return (
    <Grid container spacing={3} marginY={'2rem'}>
      <Grid item sx={itemStyles.griditem}
        lg={4}>
        <Card sx={itemStyles.card}>
          <CardHeader
            avatar={
              <Stack spacing={1}>
                <Avatar src="/logos/google-png.png" alt="Company Logo" />
                <Typography
                  variant="body1"
                  fontWeight={'bold'}
                  component={RouterLink}
                  to={"/company-details"}
                  sx={itemStyles.company}
                >
                  Google Android
                </Typography>
              </Stack>
            }
            action={
              <Stack direction={'row'}
                spacing={2}
              >
                <IconButton sx={itemStyles.bookmark}>
                  <BookmarkBorder />
                </IconButton>
                <IconButton className="cardheader-open-vacancy-detail" sx={itemStyles.openVacancy}>
                  <ArrowOutward />
                </IconButton>
              </Stack>
            }
          />
          <CardContent sx={{ paddingY: 0 }}>
            {/* Vacancy Title */}
            <Typography
              fontWeight={600}
              fontSize={'1.2rem'}
              component={RouterLink}
              to={"/company-details"}
              sx={itemStyles.vacancyTitle}
            >
              Marketing Director at Virginia
            </Typography>
            {/* Vacancy Summary Description */}
            <Typography marginY={2} noWrap>
              Looking for an experienced Web Designer for an our company. Looking for an experienced Web Designer for an our company. Looking for an experienced Web Designer for an our company.
            </Typography>
            {/* Vacancy Label */}
            <Grid container spacing={1}>
              <Grid item>
                <Chip label={<Typography variant="caption" color={'orange'}>On-Site</Typography>} />
              </Grid>
              <Grid item>
                <Chip label={<Typography variant="caption" color={'blueviolet'}>Rp1.700.000,00</Typography>} />
              </Grid>
              <Grid item>
                <Chip icon={<Place fontSize="small" color="primary" />} label={'Bandengan Selatan, Kota Adm. Jakarta Utara'} sx={{ color: '#045a55', bgcolor: '#c2fffb55' }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item sx={itemStyles.griditem}
        lg={4}>
        <Card sx={itemStyles.card}>
          <CardHeader
            avatar={
              <Stack spacing={1}>
                <Avatar src="/logos/google-png.png" alt="Company Logo" />
                <Typography
                  variant="body1"
                  fontWeight={'bold'}
                  component={RouterLink}
                  to={"/company-details"}
                  sx={itemStyles.company}
                >
                  Google Android
                </Typography>
              </Stack>
            }
            action={
              <Stack direction={'row'}
                spacing={2}
              >
                <IconButton sx={itemStyles.bookmark}>
                  <BookmarkBorder />
                </IconButton>
                <IconButton className="cardheader-open-vacancy-detail" sx={itemStyles.openVacancy}>
                  <ArrowOutward />
                </IconButton>
              </Stack>
            }
          />
          <CardContent sx={{ paddingY: 0 }}>
            {/* Vacancy Title */}
            <Typography
              fontWeight={600}
              fontSize={'1.2rem'}
              component={RouterLink}
              to={"/company-details"}
              sx={itemStyles.vacancyTitle}
            >
              Marketing Director at Virginia
            </Typography>
            {/* Vacancy Summary Description */}
            <Typography marginY={2} noWrap>
              Looking for an experienced Web Designer for an our company. Looking for an experienced Web Designer for an our company. Looking for an experienced Web Designer for an our company.
            </Typography>
            {/* Vacancy Label */}
            <Grid container spacing={1}>
              <Grid item>
                <Chip label={<Typography variant="caption" color={'orange'}>On-Site</Typography>} />
              </Grid>
              <Grid item>
                <Chip label={<Typography variant="caption" color={'blueviolet'}>Rp1.700.000,00</Typography>} />
              </Grid>
              <Grid item>
                <Chip icon={<Place fontSize="small" color="primary" />} label={'Jakarta Utara'} sx={{ color: '#045a55', bgcolor: '#c2fffb55' }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item sx={itemStyles.griditem}
        lg={4}>
        <Card sx={itemStyles.card}>
          <CardHeader
            avatar={
              <Stack spacing={1}>
                <Avatar src="/logos/google-png.png" alt="Company Logo" />
                <Typography
                  variant="body1"
                  fontWeight={'bold'}
                  component={RouterLink}
                  to={"/company-details"}
                  sx={itemStyles.company}
                >
                  Google Android
                </Typography>
              </Stack>
            }
            action={
              <Stack direction={'row'}
                spacing={2}
              >
                <IconButton sx={itemStyles.bookmark}>
                  <BookmarkBorder />
                </IconButton>
                <IconButton className="cardheader-open-vacancy-detail" sx={itemStyles.openVacancy}>
                  <ArrowOutward />
                </IconButton>
              </Stack>
            }
          />
          <CardContent sx={{ paddingY: 0 }}>
            {/* Vacancy Title */}
            <Typography
              fontWeight={600}
              fontSize={'1.2rem'}
              component={RouterLink}
              to={"/company-details"}
              sx={itemStyles.vacancyTitle}
            >
              Marketing Director at Virginia
            </Typography>
            {/* Vacancy Summary Description */}
            <Typography marginY={2} noWrap>
              Looking for an experienced Web Designer for an our company. Looking for an experienced Web Designer for an our company. Looking for an experienced Web Designer for an our company.
            </Typography>
            {/* Vacancy Label */}
            <Grid container spacing={1}>
              <Grid item>
                <Chip label={<Typography variant="caption" color={'orange'}>On-Site</Typography>} />
              </Grid>
              <Grid item>
                <Chip label={<Typography variant="caption" color={'blueviolet'}>Rp1.700.000,00</Typography>} />
              </Grid>
              <Grid item>
                <Chip icon={<Place fontSize="small" color="primary" />} label={'Bandengan Selatan, Kota Adm. Jakarta Utara'} sx={{ color: '#045a55', bgcolor: '#c2fffb55' }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item sx={itemStyles.griditem}
        lg={4}>
        <Card sx={itemStyles.card}>
          <CardHeader
            avatar={
              <Stack spacing={1}>
                <Avatar src="/logos/google-png.png" alt="Company Logo" />
                <Typography
                  variant="body1"
                  fontWeight={'bold'}
                  component={RouterLink}
                  to={"/company-details"}
                  sx={itemStyles.company}
                >
                  Google Android
                </Typography>
              </Stack>
            }
            action={
              <Stack direction={'row'}
                spacing={2}
              >
                <IconButton sx={itemStyles.bookmark}>
                  <BookmarkBorder />
                </IconButton>
                <IconButton className="cardheader-open-vacancy-detail" sx={itemStyles.openVacancy}>
                  <ArrowOutward />
                </IconButton>
              </Stack>
            }
          />
          <CardContent sx={{ paddingY: 0 }}>
            {/* Vacancy Title */}
            <Typography
              fontWeight={600}
              fontSize={'1.2rem'}
              component={RouterLink}
              to={"/company-details"}
              sx={itemStyles.vacancyTitle}
            >
              Marketing Director at Virginia
            </Typography>
            {/* Vacancy Summary Description */}
            <Typography marginY={2} noWrap>
              Looking for an experienced Web Designer for an our company. Looking for an experienced Web Designer for an our company. Looking for an experienced Web Designer for an our company.
            </Typography>
            {/* Vacancy Label */}
            <Grid container spacing={1}>
              <Grid item>
                <Chip label={<Typography variant="caption" color={'orange'}>On-Site</Typography>} />
              </Grid>
              <Grid item>
                <Chip label={<Typography variant="caption" color={'blueviolet'}>Rp1.700.000,00</Typography>} />
              </Grid>
              <Grid item>
                <Chip icon={<Place fontSize="small" color="primary" />} label={'Bandengan Selatan, Kota Adm. Jakarta Utara'} sx={{ color: '#045a55', bgcolor: '#c2fffb55' }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item sx={itemStyles.griditem}
        lg={4}>
        <Card sx={itemStyles.card}>
          <CardHeader
            avatar={
              <Stack spacing={1}>
                <Avatar src="/logos/google-png.png" alt="Company Logo" />
                <Typography
                  variant="body1"
                  fontWeight={'bold'}
                  component={RouterLink}
                  to={"/company-details"}
                  sx={itemStyles.company}
                >
                  Google Android
                </Typography>
              </Stack>
            }
            action={
              <Stack direction={'row'}
                spacing={2}
              >
                <IconButton sx={itemStyles.bookmark}>
                  <BookmarkBorder />
                </IconButton>
                <IconButton className="cardheader-open-vacancy-detail" sx={itemStyles.openVacancy}>
                  <ArrowOutward />
                </IconButton>
              </Stack>
            }
          />
          <CardContent sx={{ paddingY: 0 }}>
            {/* Vacancy Title */}
            <Typography
              fontWeight={600}
              fontSize={'1.2rem'}
              component={RouterLink}
              to={"/company-details"}
              sx={itemStyles.vacancyTitle}
            >
              Marketing Director at Virginia
            </Typography>
            {/* Vacancy Summary Description */}
            <Typography marginY={2} noWrap>
              Looking for an experienced Web Designer for an our company. Looking for an experienced Web Designer for an our company. Looking for an experienced Web Designer for an our company.
            </Typography>
            {/* Vacancy Label */}
            <Grid container spacing={1}>
              <Grid item>
                <Chip label={<Typography variant="caption" color={'orange'}>On-Site</Typography>} />
              </Grid>
              <Grid item>
                <Chip label={<Typography variant="caption" color={'blueviolet'}>Rp1.700.000,00</Typography>} />
              </Grid>
              <Grid item>
                <Chip icon={<Place fontSize="small" color="primary" />} label={'Bandengan Selatan, Kota Adm. Jakarta Utara'} sx={{ color: '#045a55', bgcolor: '#c2fffb55' }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}