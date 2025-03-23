import { Avatar, Box, Button, Chip, Divider, Grid, Typography } from "@mui/material";
import { CandidateProfile } from "../../../pages/candidates/types";
import { grey, lightBlue } from "@mui/material/colors";
import dayjs from "dayjs";
import SimpleEmphasis from "../Texts/SimpleEmphasis";
import { useState } from "react";
import { CakeRounded, DialpadRounded, FileDownloadRounded, HomeWorkRounded, LanguageRounded, LaunchRounded, LocationCityRounded, MailOutlineRounded } from "@mui/icons-material";

export default function CandidateProfileOverview({
  candidate
}: {
  candidate: CandidateProfile | null
}) {
  /* state */
  const [embedFullHeight, setEmbedFullHeight] = useState<boolean>(false);

  /* constants */
  const personalDetailProps = [
    {
      icon: (
        <MailOutlineRounded
          fontSize="small"
          sx={{ marginRight: "0.5em", color: grey[400] }}
        />
      ),
      label: "Email",
      value: candidate?.user?.email,
    },
    {
      icon: (
        <CakeRounded
          fontSize="small"
          sx={{ marginRight: "0.5em", color: grey[400] }}
        />
      ),
      label: "Date of Birth",
      value: dayjs(candidate?.date_of_birth).format("MMMM, DD dddd YYYY"),
    },
    {
      icon: (
        <HomeWorkRounded
          fontSize="small"
          sx={{ marginRight: "0.5em", color: grey[400] }}
        />
      ),
      label: "Address",
      value: `${candidate?.address?.street}, ${candidate?.address?.neighborhood}, ${candidate?.address?.rural_area}, ${candidate?.address?.sub_district}`,
    },
    {
      icon: (
        <LocationCityRounded
          fontSize="small"
          sx={{ marginRight: "0.5em", color: grey[400] }}
        />
      ),
      label: "City",
      value: candidate?.address?.city,
    },
    {
      icon: (
        <LanguageRounded
          fontSize="small"
          sx={{ marginRight: "0.5em", color: grey[400] }}
        />
      ),
      label: "Country",
      value: candidate?.address?.country,
    },
    {
      icon: (
        <DialpadRounded
          fontSize="small"
          sx={{ marginRight: "0.5em", color: grey[400] }}
        />
      ),
      label: "Postal Code",
      value: candidate?.address?.postal_code,
    },
  ];
  return (
    <Box component={"div"} className="profile-overview-wrapper">
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Box component={"div"}
            sx={{
              marginBottom: "1em",
              padding: "0.5em 1em",
              border: "1px solid " + grey[300],
              borderRadius: "0.3em",
              backgroundColor: grey[50]
            }}
          >
            {/* background and profile  */}
            <Box component={"div"} sx={{ marginY: "0.5em" }}>
              <Box
                component={"img"}
                src={`http://localhost:3000${candidate?.background_profile_image_path}?t=${new Date(Date.now()).getTime()}`}
                sx={{
                  width: "100%",
                  height: { xs: "10em", md: "15em" },
                  borderRadius: "0.5em",
                  backgroundColor: "grey",
                  backgroundSize: "cover",
                  objectFit: "cover"
                }}
              />
              <Box
                component={"div"}
                sx={{
                  marginTop: { xs: "-10%", sm: "-7%", md: "-5%" },
                  display: "flex",
                  alignItems: "end",
                }}
              >
                <Avatar
                  alt="candidate-profile"
                  src={`http://localhost:3000${candidate?.profile_image_path}?t=${new Date(Date.now()).getTime()}`}
                  sx={{
                    width: "6em",
                    height: "6em",
                    border: "0.2em solid white",
                    marginX: "1em",
                  }}
                />
                <Box
                  component={"div"}
                  sx={{
                    flexGrow: 1,
                  }}
                >
                  <Typography component={"div"} variant="subtitle1"
                    sx={{
                      fontSize: { xs: "small", sm: "medium" },
                      fontWeight: 550,
                      color: "#06816d"
                    }}
                  >
                    {candidate?.user?.fullname}
                  </Typography>
                  <Typography component={"div"} variant="caption">
                    {candidate?.expertise}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* about me */}
            <Box component={"div"} sx={{
              marginY: "0.5em"
            }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 550,
                  color: grey[800],
                }}
              >
                About Me
              </Typography>
              <Typography variant="body1">
                {candidate?.about_me}
              </Typography>
            </Box>
          </Box>
          {/* educations */}
          <Box component={"div"}
            sx={{
              marginBottom: "1em",
              padding: "0.5em 1em",
              border: "1px solid " + grey[300],
              borderRadius: "0.3em",
              backgroundColor: grey[50]
            }}
          >
            <Box component={"div"}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 550,
                  color: grey[800],
                  marginBottom: "0.5em",
                }}
              >
                Educations
              </Typography>
            </Box>
            <Box component={"div"} className="educations-container">
              {candidate?.educations?.map((education, index) => {
                const start_at = dayjs(education.start_at).format("YYYY")
                const end_at = education.is_graduated ? dayjs(education.end_at).format("YYYY") : "now"
                return (
                  <Box key={index} component={"div"} className="education-preview"
                    sx={{
                      marginBottom: index === candidate.educations?.length as number - 1 ? 0 : "0.5em",
                      borderRadius: "0.3em",
                    }}
                  >
                    <Box component={"div"}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <Typography variant="subtitle1"
                        sx={{
                          color: "#06816d",
                          fontWeight: 550,
                          letterSpacing: "0.02em"
                        }}
                      >
                        {education.university}
                        <Typography component={"span"} variant="caption" fontStyle={"italic"}> ({start_at} - {end_at})</Typography>
                      </Typography>
                    </Box>
                    <Box component={"div"}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "end",
                      }}
                    >
                      <Box component={"div"}>
                        <Typography
                          component={"p"}
                          variant="subtitle2"
                          sx={{
                            color: grey[600]
                          }}>
                          {`${education.degree}, ${education.major}`}
                        </Typography>
                        <Typography variant="caption">
                          {education.is_graduated ? "Graduated" : "Incomplete"} | GPA: {education.gpa}
                        </Typography>
                      </Box>
                    </Box>
                    {!(index == candidate.educations?.length as number - 1) && (
                      <Divider orientation="horizontal" sx={{ marginTop: "0.5em" }} />
                    )}
                  </Box>
                )
              })}
            </Box>
          </Box>
          {/* skills */}
          <Box component={"div"}
            sx={{
              marginBottom: "1em",
              padding: "0.5em 1em",
              border: "1px solid " + grey[300],
              borderRadius: "0.3em",
              backgroundColor: grey[50]
            }}
          >
            <Box component={"div"}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 550,
                  color: grey[800],
                  marginBottom: "0.5em",
                }}
              >
                Skills
              </Typography>
            </Box>
            <Box component={"div"} sx={{
              display: "flex",
              rowGap: 1,
              flexWrap: "wrap"
            }}>
              {candidate?.skills?.map((skill, index) => (
                <Chip key={index}
                  avatar={
                    <Avatar
                      src={`http://localhost:3000${skill.skill_icon_image_path}`}
                      slotProps={{
                        img: {
                          style: {
                            objectFit: "scale-down"
                          }
                        }
                      }}
                    />}
                  label={skill.name}
                  sx={{
                    marginRight: "0.5em",
                    ".MuiChip-deleteIcon": {
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
          {/* experiences */}
          <Box component={"div"}
            sx={{
              marginBottom: "1em",
              padding: "0.5em 1em",
              border: "1px solid " + grey[300],
              borderRadius: "0.3em",
              backgroundColor: grey[50]
            }}
          >
            <Box component={"div"}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 550,
                  color: grey[800],
                  marginBottom: "1em",
                }}
              >
                Experiences
              </Typography>
            </Box>
            <Box component={"div"} className="experience-item">
              {candidate?.experiences?.map((experience, index) => {
                const start_at = dayjs(experience.start_at).format("MMMM, YYYY")
                const end_at = experience.is_current ? "now" : dayjs(experience.end_at).format("MMMM, YYYY")
                return (
                  <Box
                    key={index}
                    component={"div"}
                    className="experience-item-company"
                    sx={{
                      // display: "flex",
                      // alignItems: "start",
                    }}
                  >
                    <Box
                      component={"div"}
                    >
                      <Box component={"div"}
                        sx={{
                          display: "flex",
                        }}
                      >
                        <Typography component={"p"} variant="subtitle1"
                          sx={{
                            flexGrow: 1
                          }}
                        >
                          {experience.position}
                        </Typography>
                      </Box>
                      <Typography variant="caption">
                        <SimpleEmphasis text={experience.company_name} textColor="#06816d" />
                        <Divider
                          component={"span"}
                          orientation="vertical"
                          sx={{
                            marginX: "1em",
                            borderColor: "#838383",
                          }}
                        />
                        {experience.location_address} - {experience.type}
                      </Typography>
                      <Typography component={"p"} variant="caption"
                        sx={{
                          color: grey[700],
                          fontStyle: "italic"
                        }}
                      >
                        {start_at} - {end_at}
                      </Typography>
                      <Box
                        component={"div"}
                        sx={{
                          marginY: "1em",
                        }}
                      >
                        {/* This description text using text formatter that add (\n) as new line for "-" */}
                        <Typography component={"p"} variant="subtitle2" sx={{
                          whiteSpace: "pre-line",
                          color: grey[800]
                        }}>
                          {experience.description}
                        </Typography>
                      </Box>
                      {experience.attachment_document_path && (
                        <Box component={"div"}>
                          <Box component={"div"}>
                            <Typography component={"p"} variant="subtitle2" sx={{
                              color: lightBlue[700],
                              fontStyle: "italic",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                              onClick={() => {
                                setEmbedFullHeight(prev => !prev)
                              }}
                            >
                              {embedFullHeight ? (
                                "See default"
                              ) : "See full height"}
                            </Typography>
                          </Box>
                          <Box component={"div"} sx={{
                            width: "100%",
                            height: embedFullHeight ? "100vh" : "30vh",
                          }}>
                            <embed
                              src={`http://localhost:3000${experience.attachment_document_path}`}
                              width={"100%"}
                              height={"100%"}
                            />
                          </Box>
                        </Box>
                      )}
                    </Box>
                    {!(index == candidate.experiences?.length as number - 1) && (
                      <Divider orientation="horizontal" sx={{
                        // marginBottom: "0.5em",
                        marginY: "0.7em",
                        borderWidth: "1px",
                        borderRadius: "1px",
                        borderColor: grey[300],
                        // borderColor: "#51a799",
                      }} />
                    )}
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Box component={"div"}
            id="personal-detail"
            sx={{
              position: "sticky",
              top: "0em",
            }}
          >
            {/* candidate personal detail */}
            <Box component={"div"}
              sx={{
                marginBottom: "1em",
                border: "1px solid " + grey[300],
                padding: "0.5em",
                borderRadius: "0.3em",
                backgroundColor: grey[100]
              }}
            >
              <Box component={"div"}
                sx={{
                  display: "flex",
                  justifyContent: "space-between"
                }}
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
              </Box>
              {personalDetailProps.map((data, index) => (
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
                        color: grey[500],
                      }}
                    >
                      {data.label}
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle2"
                    textAlign={"end"}
                    sx={{
                      color: grey[800],
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
                  component={"a"}
                  target="_blank"
                  href={`http://localhost:3000${candidate?.cv_document_path}`}
                  variant="text"
                  endIcon={<LaunchRounded />}
                  fullWidth
                >
                  View
                </Button>
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Button
                    component={"a"}
                    href={`http://localhost:3000${candidate?.cv_document_path}/download`}
                    variant="contained"
                    endIcon={<FileDownloadRounded />}
                    color="primary"
                    size="small"
                    fullWidth
                  >
                    Download CV
                  </Button>
                </Box>
              </Box>
            </Box>
            {/* socials */}
            <Box component={"div"}>
              <Box component={"div"}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 550,
                    color: grey[600],
                    textAlign: "center",
                  }}
                >
                  Social
                </Typography>
              </Box>
              <Box
                component={"div"}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0 0.5em",
                }}
              >
                {candidate?.socials?.map((item, index) => (
                  <Box
                    key={index}
                    component={"a"}
                    href={item.url}
                    target="_blank"
                    sx={{
                      width: "2.5em",
                      height: "2.5em",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      columnGap: "0.5em",
                      paddingX: "0.5em",
                      borderRadius: "0.3em",
                      border: `0.1em solid ${grey[400]}`,
                    }}
                  >
                    <Box component={"img"}
                      src={`http://localhost:3000${item.icon_image_path}`}
                      width={25}
                      height={25}
                      sx={{
                        backgroundSize: "cover",
                        objectFit: "scale-down"
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}