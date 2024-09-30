import {
  AccessTime,
  Business,
  CloseRounded,
  CorporateFareRounded,
  DonutLargeRounded,
  FindInPageOutlined,
  HandshakeOutlined,
  InsertDriveFileOutlined,
  InsertLinkOutlined,
  LocationOnRounded,
  OpenInFullRounded,
  Paid,
  PendingActionsOutlined,
  Place,
  ScheduleRounded,
  TimerOutlined,
} from "@mui/icons-material";
import DashboardLayout from "../../../components/Templates/DashboardLayout";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  Drawer,
  Fade,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { amber, green, grey, lightBlue, orange } from "@mui/material/colors";
import { useState } from "react";
import CopyText from "../../../components/Molecules/Texts/CopyText";
import AttachFileCard from "../../../components/Molecules/Cards/AttachFileCard";
import SimpleEmphasis from "../../../components/Molecules/Texts/SimpleEmphasis";

export default function ApplicationStatus() {
  /* Material UI Hooks */
  const MUITheme = useTheme();
  /* state */
  const [displayOn, setDisplayOn] = useState<{
    detail: boolean;
    pipeline: boolean;
  }>({ detail: false, pipeline: true });
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  /* event handler */

  /* breakpoints */
  const large = useMediaQuery("(min-width: 1200px)");
  const small = useMediaQuery("(max-width: 900px)");
  return (
    <DashboardLayout>
      <Grid container spacing={2}>
        <Grid item xs={100} lg={8}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 550,
              color: grey[800],
            }}
          >
            Applied Detail
          </Typography>
          {/* company.profile */}
          <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0 1em",
              paddingY: "1em",
            }}
          >
            <Avatar
              alt="company-logo"
              src="broken.jpg"
              sx={{
                width: small ? "4em" : "5em",
                height: small ? "4em" : "5em",
              }}
            />
            <Box component={"div"}>
              <Typography
                variant={small ? "subtitle2" : "h6"}
                sx={{
                  fontWeight: 550,
                  color: grey[800],
                }}
              >
                Cloud Architect
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0 1.5em" }}>
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
                      fontWeight: small ? 500 : 550,
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
                      fontWeight: small ? 500 : 550,
                      color: grey[600],
                      marginLeft: "0.5em",
                    }}
                  >
                    Sidoarjo, Indonesia (INA)
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            component={"div"}
            sx={{
              borderBottom: "1px solid " + grey[300],
              marginY: "0.5em",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box component={"div"}>
              <Button
                variant="text"
                sx={{
                  minWidth: "5em",
                  textTransform: "none",
                  borderRadius: "0",
                  borderBottom: displayOn.detail
                    ? "0.2em solid #06816d"
                    : undefined,
                }}
                onClick={() => {
                  setDisplayOn({ detail: true, pipeline: false });
                }}
              >
                Detail
              </Button>
              <Button
                variant="text"
                sx={{
                  minWidth: "5em",
                  textTransform: "none",
                  borderRadius: "0",
                  borderBottom: displayOn.pipeline
                    ? "0.2em solid #06816d"
                    : undefined,
                }}
                onClick={() => {
                  setDisplayOn({ detail: false, pipeline: true });
                }}
              >
                Pipeline
              </Button>
            </Box>
            {!large && (
              <Button
                variant="contained"
                startIcon={<OpenInFullRounded fontSize="small" />}
                size="small"
                sx={{
                  minWidth: "5em",
                  textTransform: "none",
                  borderRadius: "0",
                }}
                onClick={() => setOpenDrawer(true)}
              >
                Applied List
              </Button>
            )}
          </Box>
          {/* pipeline */}
          <Fade in={displayOn.pipeline} mountOnEnter unmountOnExit>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 550, color: grey[800], marginY: "0.5em" }}
              >
                Application Pipeline
              </Typography>
              <Box
                component={"div"}
                className="application-pipeline"
                sx={{ border: "1px solid " + grey[400], borderRadius: "0.3em" }}
              >
                <Stack sx={{ padding: small ? "0.5em" : "1em" }}>
                  {/* application.screening */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      paddingBottom: "1em",
                    }}
                  >
                    <FindInPageOutlined sx={{ color: green[800] }} />
                    <Box
                      component={"div"}
                      sx={{ flexGrow: 1, paddingX: "0.5em" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 550,
                            color: green[800],
                            marginY: "0.2em",
                          }}
                        >
                          Application Screening
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            minWidth: "12em",
                            fontStyle: "italic",
                            color: grey[400],
                            textAlign: "end",
                          }}
                        >
                          May 24, 2024
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: grey[700] }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Magnam incidunt, maxime aut eos vel nihil, consectetur
                        quas laudantium nam laboriosam, eum doloremque ipsa unde
                        recusandae hic molestiae id distinctio architecto.
                      </Typography>
                    </Box>
                  </Box>
                  {/* application.assessment */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      paddingY: "1em",
                      borderTop: "1px solid " + grey[400],
                    }}
                  >
                    <TimerOutlined sx={{ color: orange[700] }} />
                    <Box sx={{ flexGrow: 1, paddingX: "0.5em" }}>
                      <Box
                        component={"div"}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 550,
                            color: orange[700],
                            marginY: "0.2em",
                          }}
                        >
                          Assessment
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            minWidth: "12em",
                            fontStyle: "italic",
                            color: orange[400],
                            textAlign: "end",
                          }}
                        >
                          Waiting for assessment
                        </Typography>
                      </Box>
                      <Box component={"div"} className="stage-body">
                        <Typography variant="body2" sx={{ color: grey[700] }}>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Ducimus laboriosam similique fugiat ipsam? Saepe
                          a praesentium, in cumque ipsum ipsa veritatis sed
                          debitis ducimus soluta quod accusamus maiores
                          expedita? Dignissimos! Nobis nam consequuntur, fugiat
                          modi quod ea reprehenderit quaerat perferendis
                          suscipit ad optio dicta dolorem accusantium cupiditate
                          ut incidunt cumque libero maxime, ab expedita
                          consectetur laborum sequi ducimus quia! Praesentium!
                        </Typography>
                        <Box component={"div"} className="attached-link">
                          <Box sx={{ display: "flex", marginY: "0.5em" }}>
                            <InsertLinkOutlined
                              fontSize="small"
                              sx={{ color: grey[800] }}
                            />
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 500,
                                color: grey[800],
                                marginX: "0.5em",
                              }}
                            >
                              Attached Link
                            </Typography>
                          </Box>
                          <CopyText textToCopy="https://github.com/barjakoub" />
                        </Box>
                        <Box component={"div"} className="attached-file">
                          <Box sx={{ display: "flex", marginY: "0.5em" }}>
                            <InsertDriveFileOutlined
                              fontSize="small"
                              sx={{ color: grey[800] }}
                            />
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 500,
                                color: grey[800],
                                marginX: "0.5em",
                              }}
                            >
                              Attached File
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              gap: "0.5em 0.5em",
                              flexWrap: "wrap",
                            }}
                          >
                            <AttachFileCard fileName="guide-assessment.pdf" />
                            <AttachFileCard fileName="assessment.docx" />
                            <AttachFileCard fileName="schedule-interview.pdf" />
                            <AttachFileCard fileName="letter-of-purpose.pdf" />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  {/* Interview Schedule */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      paddingY: "1em",
                      borderTop: "1px solid " + grey[400],
                    }}
                  >
                    <PendingActionsOutlined sx={{ color: grey[400] }} />
                    <Box sx={{ flexGrow: 1, paddingX: "0.5em" }}>
                      <Box
                        component={"div"}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 550,
                            color: grey[400],
                            marginY: "0.2em",
                          }}
                        >
                          Interview Scedule
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            minWidth: "12em",
                            fontStyle: "italic",
                            color: grey[400],
                            textAlign: "end",
                          }}
                        >
                          unavailable
                        </Typography>
                      </Box>
                      {/* on.small screen */}
                      {small ? (
                        <Box component={"div"} sx={{ paddingY: "0.5em" }}>
                          <Box
                            component={"div"}
                            sx={{
                              borderRadius: "0.3em",
                              border: "1px solid " + grey[400],
                              padding: "0.5em",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ lineHeight: "1em" }}
                            >
                              Vera Verina
                            </Typography>
                            <Typography
                              component={"p"}
                              variant="caption"
                              sx={{ color: grey[600] }}
                            >
                              vera.verina@erajaya.com
                            </Typography>
                            <Chip
                              component={"div"}
                              size="small"
                              icon={<ScheduleRounded fontSize="small" />}
                              label={"Scheduled"}
                              sx={{
                                "& .MuiChip-icon": {
                                  color: amber[500],
                                },
                                backgroundColor: amber[50],
                                color: amber[500],
                              }}
                            />
                            <Typography
                              component={"p"}
                              variant="caption"
                              sx={{ marginTop: "1em", color: grey[600] }}
                            >
                              Today
                              <SimpleEmphasis text={" 10:00 PM - 11:45 PM"} />
                            </Typography>
                            <CopyText
                              textToCopy="Google Meet"
                              options={{
                                noBorder: true,
                                useTextButton: true,
                                fontSize: "small",
                              }}
                            />
                          </Box>
                        </Box>
                      ) : (
                        <Box component={"div"} sx={{ paddingY: "0.5em" }}>
                          {/* Row Head */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid " + grey[400],
                              borderRadius: "0.3em 0.3em 0 0",
                              padding: "0.5em",
                              backgroundColor: "#06816d",
                            }}
                          >
                            {/* column.date */}
                            <Box
                              sx={{
                                flexBasis: "20%",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 550,
                                  color: "whitesmoke",
                                  fontSize: "0.8em",
                                }}
                              >
                                Date
                              </Typography>
                            </Box>
                            {/* column.recruiter */}
                            <Box
                              sx={{
                                flexBasis: "30%",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 550,
                                  color: "whitesmoke",
                                  fontSize: "0.8em",
                                }}
                              >
                                Recruiter
                              </Typography>
                            </Box>
                            {/* column.place/link video conf */}
                            <Box
                              sx={{
                                flexBasis: "35%",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 550,
                                  color: "whitesmoke",
                                  fontSize: "0.8em",
                                }}
                              >
                                Place/Link video conferencing
                              </Typography>
                            </Box>
                            {/* column.status */}
                            <Box
                              sx={{
                                flexBasis: "15%",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 550,
                                  color: "whitesmoke",
                                  fontSize: "0.8em",
                                }}
                              >
                                Status
                              </Typography>
                            </Box>
                          </Box>
                          {/* Row Data */}
                          <Box
                            component={"div"}
                            className="schedule-items-container"
                          >
                            {[0, 1, 2].map((_, index) => (
                              <Box
                                key={index}
                                component={"div"}
                                className="schedule-item"
                                sx={{
                                  display: "flex",
                                  padding: "0.5em",
                                  border: "1px solid " + grey[400],
                                  borderTop: "none",
                                  "&:hover": {
                                    backgroundColor: grey[100],
                                  },
                                }}
                              >
                                <Box sx={{ flexBasis: "20%" }}>
                                  <Typography sx={{ fontSize: "0.8em" }}>
                                    Today
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: grey[600] }}
                                  >
                                    09.30 - 10.00
                                  </Typography>
                                </Box>
                                <Box sx={{ flexBasis: "30%" }}>
                                  <Typography sx={{ fontSize: "0.8em" }}>
                                    Vera Verina
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: grey[600] }}
                                  >
                                    vera-verinatalentacq@erajaya.com
                                  </Typography>
                                </Box>
                                <Box sx={{ flexBasis: "35%" }}>
                                  <Typography sx={{ fontSize: "0.8em" }}>
                                    Google Meet
                                  </Typography>
                                  <Link
                                    href="https://github.com"
                                    underline="hover"
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{ color: grey[600] }}
                                    >
                                      https://meet.google.com/vfr-cehr-qiq
                                    </Typography>
                                  </Link>
                                </Box>
                                <Box sx={{ flexBasis: "15%" }}>
                                  <Typography
                                    sx={{
                                      fontSize: "0.8em",
                                      color: orange[400],
                                      fontStyle: "italic",
                                    }}
                                  >
                                    Scheduled
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  {/* Offerings */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      paddingY: "1em",
                      borderTop: "1px solid " + grey[400],
                      cursor: "not-allowed",
                      userSelect: "none",
                    }}
                  >
                    <HandshakeOutlined sx={{ color: grey[800] }} />
                    <Box sx={{ flexGrow: 1, paddingX: "0.5em" }}>
                      <Box
                        component={"div"}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 550,
                            color: grey[800],
                            marginY: "0.2em",
                          }}
                        >
                          Offering
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            minWidth: "12em",
                            fontStyle: "italic",
                            color: grey[400],
                            textAlign: "end",
                          }}
                        >
                          May 24, 2024
                        </Typography>
                      </Box>
                      <Box
                        component={"div"}
                        sx={{
                          border: "1px solid " + grey[400],
                          borderRadius: "0.3em",
                          marginY: "0.5em",
                        }}
                      >
                        <Box
                          component={"div"}
                          sx={{
                            display: "flex",
                            gap: "0.5em",
                            alignItems: "center",
                            justifyContent: small ? "space-between" : undefined,
                            paddingTop: "0.5em",
                            paddingX: "1em",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 550, color: grey[700] }}
                          >
                            Cloud Architect
                          </Typography>
                          <Chip
                            icon={<DonutLargeRounded />}
                            label="Offered"
                            size="small"
                            sx={{
                              color: lightBlue[500],
                              bgcolor: lightBlue[50],
                              "& .MuiChip-icon": {
                                color: lightBlue[500],
                              },
                            }}
                          />
                        </Box>
                        <Box
                          component={"div"}
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: small ? undefined : "1em",
                            paddingX: "1em",
                          }}
                        >
                          <Box
                            component={"div"}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <CorporateFareRounded
                              fontSize="small"
                              sx={{ color: grey[600], marginRight: "0.3em" }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: grey[600], fontSize: "x-small" }}
                            >
                              PT.Sidokaredev Karya Mandiri
                            </Typography>
                          </Box>
                          <Box
                            component={"div"}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <LocationOnRounded
                              fontSize="small"
                              sx={{ color: grey[600], marginRight: "0.3em" }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: grey[600], fontSize: "x-small" }}
                            >
                              Kabupaten Sidoarjo
                            </Typography>
                          </Box>
                        </Box>
                        <Divider
                          orientation="horizontal"
                          sx={{ marginY: "0.5em", borderColor: grey[400] }}
                        />
                        <Box
                          component={"div"}
                          sx={{
                            display: small ? undefined : "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingX: "1em",
                            paddingBottom: "0.5em",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontStyle: "italic", color: grey[600] }}
                          >
                            Offer end on :{" "}
                            <SimpleEmphasis text={"30, May 2024"} />
                          </Typography>
                          <Box
                            component={"div"}
                            sx={{
                              display: small ? "flex" : undefined,
                              marginTop: "0.5em",
                            }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              fullWidth={small}
                              sx={{ marginRight: "0.2em" }}
                            >
                              Dismiss
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              fullWidth={small}
                              sx={{ marginLeft: "0.2em" }}
                            >
                              Confirm
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Fade>
          {/* detail */}
          <Fade in={displayOn.detail} mountOnEnter unmountOnExit>
            <Stack direction={"column"} spacing={2} sx={{ marginY: "0.5em" }}>
              {/* decription */}
              <Box component={"div"}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[800] }}
                >
                  Description
                </Typography>
                <Typography variant="body1" sx={{ color: grey[600] }}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Cupiditate quo hic tenetur voluptas laboriosam a cum rem
                  voluptatem dignissimos dicta ipsam quasi in, minima ut
                  aperiam. Exercitationem suscipit maiores similique!
                </Typography>
              </Box>
              {/* qualification */}
              <Box component={"div"}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[800] }}
                >
                  Qualification
                </Typography>
                <ul>
                  {[0, 1, 2, 3].map((_, index) => (
                    <li key={index} style={{ marginLeft: "1em" }}>
                      <Typography variant="body1" sx={{ color: grey[600] }}>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
              {/* responsibility */}
              <Box component={"div"}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[800] }}
                >
                  Responsibility
                </Typography>
                <ul>
                  {[0, 1, 2, 3].map((_, index) => (
                    <li key={index} style={{ marginLeft: "1em" }}>
                      <Typography variant="body1" sx={{ color: grey[600] }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Perspiciatis atque modi mollitia?
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            </Stack>
          </Fade>
        </Grid>
        <Grid item lg={4}>
          <Collapse
            in={large}
            mountOnEnter
            unmountOnExit
            sx={{
              position: "sticky",
              top: (MUITheme.mixins.toolbar.minHeight as number) + 8,
            }}
          >
            <Box component={"div"}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 550,
                  color: grey[800],
                }}
              >
                Applied List
              </Typography>
              <Box
                sx={{
                  height: "87vh",
                  overflowY: "scroll",
                  borderRadius: "0.5em",
                  "&::-webkit-scrollbar": {
                    width: "0.5em",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: grey[400],
                    borderRadius: "0.15em",
                  },
                }}
              >
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <Box
                    key={index}
                    component={"div"}
                    sx={{
                      border: `1px solid ${grey[400]}`,
                      padding: "1em",
                      marginRight: "0.5em",
                      borderRadius: "0.5em",
                      marginY: "0.5em",
                    }}
                  >
                    <Box
                      component={"div"}
                      sx={{
                        display: "flex",
                      }}
                    >
                      <Avatar
                        alt="company-logo"
                        src="broken.jpg"
                        sx={{
                          width: "3em",
                          height: "3em",
                          borderRadius: "0.5em",
                        }}
                      />
                      <Box
                        sx={{
                          flexGrow: 1,
                          marginLeft: "0.5em",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 550, color: grey[800] }}
                        >
                          UX Research
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 550, color: "#045a55" }}
                        >
                          Sidokaredev
                        </Typography>
                      </Box>
                      <Box>
                        <Chip
                          label={"On process"}
                          size="small"
                          sx={{ backgroundColor: "#ffcc80" }}
                        />
                      </Box>
                    </Box>
                    <Divider sx={{ marginY: "0.5em" }} />
                    <Stack rowGap={0.5}>
                      <Box sx={{ display: "flex" }}>
                        <Place
                          fontSize="small"
                          sx={{ color: lightBlue[600] }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ marginLeft: "0.5em" }}
                        >
                          Sidoarjo, Indonesia
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex" }}>
                        <Paid fontSize="small" sx={{ color: grey[600] }} />
                        <Typography
                          variant="subtitle2"
                          sx={{ marginLeft: "0.5em" }}
                        >
                          Rp. 3.000.000,00
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "end",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <AccessTime
                            fontSize="small"
                            sx={{ color: grey[500] }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              marginLeft: "0.5em",
                              fontStyle: "italic",
                              color: grey[500],
                            }}
                          >
                            Last update at 3 hours ago
                          </Typography>
                        </Box>
                        <Button variant="contained" sx={{ minWidth: "8em" }}>
                          Detail
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Box>
          </Collapse>
        </Grid>
      </Grid>
      <Drawer
        open={openDrawer}
        anchor="bottom"
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          sx: {
            height: "100vh",
            paddingTop: "1em",
            paddingX: "1em",
          },
        }}
      >
        <Box component={"div"}>
          <Box
            component={"div"}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 550,
                color: grey[800],
              }}
            >
              Applied List
            </Typography>
            <IconButton onClick={() => setOpenDrawer(false)}>
              <CloseRounded color="error" />
            </IconButton>
          </Box>
          <Box
            sx={{
              height: "87vh",
              overflowY: "scroll",
              borderRadius: "0.5em",
              "&::-webkit-scrollbar": {
                width: "0.5em",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: grey[400],
                borderRadius: "0.15em",
              },
              paddingBottom: "0.5em",
            }}
          >
            {[1, 2, 3, 4, 5].map((_, index) => (
              <Box
                key={index}
                component={"div"}
                sx={{
                  width: "100%",
                  border: `1px solid ${grey[400]}`,
                  padding: "1em",
                  marginRight: "0.5em",
                  borderRadius: "0.5em",
                  marginY: "0.5em",
                }}
              >
                <Box
                  component={"div"}
                  sx={{
                    display: "flex",
                  }}
                >
                  <Avatar
                    alt="company-logo"
                    src="broken.jpg"
                    sx={{
                      width: "3em",
                      height: "3em",
                      borderRadius: "0.5em",
                    }}
                  />
                  <Box
                    sx={{
                      flexGrow: 1,
                      marginLeft: "0.5em",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 550, color: grey[800] }}
                    >
                      UX Research
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 550, color: "#045a55" }}
                    >
                      Sidokaredev
                    </Typography>
                  </Box>
                  <Box>
                    <Chip
                      label={"On process"}
                      size="small"
                      sx={{ backgroundColor: "#ffcc80" }}
                    />
                  </Box>
                </Box>
                <Divider sx={{ marginY: "0.5em" }} />
                <Stack rowGap={0.5}>
                  <Box sx={{ display: "flex" }}>
                    <Place fontSize="small" sx={{ color: lightBlue[600] }} />
                    <Typography
                      variant="subtitle2"
                      sx={{ marginLeft: "0.5em" }}
                    >
                      Sidoarjo, Indonesia
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    <Paid fontSize="small" sx={{ color: grey[600] }} />
                    <Typography
                      variant="subtitle2"
                      sx={{ marginLeft: "0.5em" }}
                    >
                      Rp. 3.000.000,00
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "end",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <AccessTime fontSize="small" sx={{ color: grey[500] }} />
                      <Typography
                        variant="caption"
                        sx={{
                          marginLeft: "0.5em",
                          fontStyle: "italic",
                          color: grey[500],
                        }}
                      >
                        Last update at 3 hours ago
                      </Typography>
                    </Box>
                    <Button variant="contained" sx={{ minWidth: "8em" }}>
                      Detail
                    </Button>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>
    </DashboardLayout>
  );
}
