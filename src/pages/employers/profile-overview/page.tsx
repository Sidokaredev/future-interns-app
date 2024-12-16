import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DashboardLayout from "../../../components/Templates/DashboardLayout";
import {
  Business,
  CakeRounded,
  DialpadRounded,
  DomainRounded,
  GroupsRounded,
  HomeWorkRounded,
  LanguageRounded,
  LocationCityRounded,
  MailOutlineRounded,
  PersonPinRounded,
  Place,
  SettingsRounded,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import SocialCard from "../../../components/Molecules/Cards/SocialCard";

export default function EmployerProfileOverview() {
  return (
    <DashboardLayout isFor="employer">
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Box
            component={"div"}
            sx={{
              width: "100%",
              height: {
                xs: "15em",
                md: "20em",
              },
              backgroundImage: `url('/future-interns-app/backgrounds/nastuh-abootalebi-yWwob8kwOCk-unsplash.jpg')`,
              backgroundSize: "cover",
              borderRadius: "0.3em",
            }}
          />
          <Box
            component={"div"}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              component={"div"}
              sx={{
                width: {
                  xs: "95%",
                  md: "80%",
                },
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "0 1em",
                marginTop: "-3.5em",
                paddingY: "0.7em",
                paddingX: "1em",
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
                borderRadius: "0.3em",
                backgroundColor: "white",
              }}
            >
              <Avatar
                alt="company-logo"
                src="broken.jpg"
                sx={{
                  width: {
                    xs: "3em",
                    md: "4em",
                  },
                  height: {
                    xs: "3em",
                    md: "4em",
                  },
                }}
              />
              <Box component={"div"} sx={{ flexGrow: 1 }}>
                <Typography
                  variant={"h6"}
                  sx={{
                    fontWeight: 550,
                    fontSize: {
                      xs: "medium",
                      md: "normal",
                    },
                    color: grey[800],
                  }}
                >
                  Sidokaredev
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0 1.5em" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: {
                        xs: "start",
                        md: "end",
                      },
                    }}
                  >
                    <Business
                      fontSize="small"
                      sx={{
                        color: "#06816d",
                        fontSize: {
                          xs: "1em",
                          md: "1.25em",
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: {
                          xs: 550,
                          md: 550,
                        },
                        fontSize: {
                          xs: "x-small",
                          md: "normal",
                        },
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
                      alignItems: {
                        xs: "start",
                        md: "end",
                      },
                    }}
                  >
                    <Place
                      fontSize="small"
                      sx={{
                        color: "#06816d",
                        fontSize: {
                          xs: "1em",
                          md: "1.25em",
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: {
                          xs: 550,
                          md: 550,
                        },
                        fontSize: {
                          xs: "x-small",
                          md: "normal",
                        },
                        color: grey[600],
                        marginLeft: "0.5em",
                      }}
                    >
                      Sidoarjo, Indonesia (INA)
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box component={"div"} sx={{}}>
                <IconButton size="small">
                  <SettingsRounded fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box
            component={"div"}
            sx={{
              marginTop: {
                xs: "1em",
                md: "2em",
              },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 550, color: grey[800] }}
            >
              About Employer
            </Typography>
            <Typography variant="body1" sx={{ color: grey[600] }}>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Repudiandae reiciendis laborum, tempore aperiam aliquam adipisci
              labore, quos ducimus ab velit, quaerat voluptate error laboriosam
              possimus consequuntur distinctio odio culpa tempora! Dolores
              minima iusto ducimus sint voluptatibus soluta incidunt tenetur
              architecto magnam illo aut pariatur est distinctio cum
              exercitationem vitae, consequatur deleniti blanditiis cumque
              quidem. Nemo nam voluptatibus quos aspernatur laborum. Temporibus
              molestias doloremque dicta pariatur commodi quasi alias amet eius
              impedit, maxime exercitationem libero incidunt molestiae
              voluptatibus modi unde consequatur error corporis? Inventore
              deserunt maiores nihil exercitationem eveniet a culpa.
              <br />
              <br />
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Reiciendis, delectus repellat. Esse optio adipisci, ipsum, magnam
              consectetur minus fuga harum nisi necessitatibus fugit, ullam
              nulla. Corrupti rem quas nobis ab.
            </Typography>
            <Box
              component={"div"}
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "1em",
                marginY: "1em",
              }}
            >
              <Box
                component={"div"}
                sx={{
                  width: "100%",
                  height: {
                    xs: "15em",
                    md: "20em",
                  },
                  backgroundImage: `url('/future-interns-app/backgrounds/nastuh-abootalebi-yWwob8kwOCk-unsplash.jpg')`,
                  borderRadius: "0.3em",
                }}
              />
              <Box
                component={"div"}
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                  columnGap: "1em",
                  rowGap: {
                    xs: "1em",
                    md: "0em",
                  },
                }}
              >
                <Box
                  component={"div"}
                  sx={{
                    flexGrow: 1,
                    height: {
                      xs: "15em",
                      md: "20em",
                    },
                    backgroundImage: `url('/future-interns-app/backgrounds/nastuh-abootalebi-yWwob8kwOCk-unsplash.jpg')`,
                    borderRadius: "0.3em",
                  }}
                />
                <Box
                  component={"div"}
                  sx={{
                    flexGrow: 1,
                    height: {
                      xs: "15em",
                      md: "20em",
                    },
                    backgroundImage: `url('/future-interns-app/backgrounds/nastuh-abootalebi-yWwob8kwOCk-unsplash.jpg')`,
                    borderRadius: "0.3em",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            component={"div"}
            sx={{
              marginTop: {
                xs: "0em",
                md: "2em",
              },
              position: "sticky",
              top: "3.5em",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 550, color: grey[800] }}
            >
              Employer Information
            </Typography>
            <Box component={"div"} sx={{ marginTop: "0.5em" }}>
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
                      <DomainRounded
                        fontSize="small"
                        sx={{ marginRight: "0.5em", color: grey[400] }}
                      />
                    ),
                    label: "Founded",
                    value: "2024",
                  },
                  {
                    icon: (
                      <PersonPinRounded
                        fontSize="small"
                        sx={{ marginRight: "0.5em", color: grey[400] }}
                      />
                    ),
                    label: "Founder",
                    value: "Fatkhur Rozak",
                  },
                  {
                    icon: (
                      <HomeWorkRounded
                        fontSize="small"
                        sx={{ marginRight: "0.5em", color: grey[400] }}
                      />
                    ),
                    label: "Headquarters",
                    value: "Jl. H. Mawardi, RT 03/RW 01, Jerukgamping, Krian",
                  },
                  {
                    icon: (
                      <GroupsRounded
                        fontSize="small"
                        sx={{ marginRight: "0.5em", color: grey[400] }}
                      />
                    ),
                    label: "Total of Employees",
                    value: "1 - 10",
                  },
                  {
                    icon: (
                      <LanguageRounded
                        fontSize="small"
                        sx={{ marginRight: "0.5em", color: grey[400] }}
                      />
                    ),
                    label: "Website",
                    value: "sidokaredev.com",
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
          </Box>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
