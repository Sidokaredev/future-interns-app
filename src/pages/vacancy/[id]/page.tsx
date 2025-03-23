import { useNavigate, useParams } from "react-router-dom"
import BaseLayout from "../../../components/Templates/BaseLayout";
import { Avatar, Box, Button, CircularProgress, Container, Dialog, Grid, Snackbar, Stack, Typography } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { BadgeRounded, Business, FoundationRounded, LocationOnRounded, MeetingRoomRounded, MonetizationOnRounded, Place, WorkspacePremiumRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { VacancyType } from "../../employers/types";
import { GetSession, onCloseSnackbar } from "../../global-helpers";
import RequestAPI from "../../../services/api/request";
import SimpleEmphasis from "../../../components/Molecules/Texts/SimpleEmphasis";
import { HOST } from "../../administrators/performance/[id]/constants";

export default function VacancyDetail() {
  /* react-router */
  const { id } = useParams();
  const navigate = useNavigate();
  /* state */
  const [vacancy, setVacancy] = useState<VacancyType | null>(null);
  const [applied, setApplied] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" });
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [dataAction, setDataAction] = useState<boolean>(false);

  /* constants */
  const isAuthenticated = GetSession("auth");

  /* onApply */
  const onApply = async () => {
    setLoading(true);

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.FormDataRequest({ vacancy_id: id }).Send<string>(
      "/api/v1/candidates/pipelines/",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(false);
      setOpenDialog(prev => ({ ...prev, ["confirmation"]: false }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(false);
      setOpenDialog(prev => ({ ...prev, ["confirmation"]: false }));
      setDataAction(prev => !prev);
      return setAlert({ show: true, message: success });
    };
  };

  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const headerInit = new Headers();
      if (token) {
        headerInit.append("Authorization", "Bearer " + token);
      }
      const [data, fail] = await RequestAPI.Send<{ vacancy: VacancyType, applied: boolean }>(
        "/api/v1/vacancies/" + id,
        {
          method: "GET",
          headers: headerInit,
        }
      );
      if (fail) {
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        setApplied(data.applied);
        return setVacancy(data.vacancy);
      }
    })();
  }, [dataAction]);
  return (
    <BaseLayout>
      {/* Default Notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        message={alert.message}
        autoHideDuration={3000}
        onClose={onCloseSnackbar(setAlert)}
      />
      <Box
        id="job-vacancies-banner"
        component={"div"}
        sx={{
          backgroundImage:
            "url(/future-interns-app/backgrounds/Final-AnimatedShape-3.svg)", // may be required (../../../public)
          backgroundSize: "cover",
          height: { xs: "175px", md: "295px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography align="center" variant="h5" color={"white"} sx={{ marginTop: "1.5em", fontSize: { xs: "medium", md: "x-large" } }}>
          Vacancy Detail
        </Typography>
      </Box>
      <Box component={"div"} className="container-wrapper">
        <Container disableGutters maxWidth="lg" sx={{ paddingLeft: { xs: 0, md: "1em", xl: 0 } }}>
          <Grid container
            columnSpacing={2}
            rowSpacing={2}
            sx={{
              marginY: { xs: "0.5em", md: "1em" },
              padding: { xs: "1em", md: 0 }
            }}
          >
            <Grid item xs={12} lgTablet={8}
            >
              {/* Employer Profile */}
              <Box
                component={"div"}
                sx={{
                  width: "100%",
                  marginBottom: "1.5em",
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  gap: "0 1em",
                  paddingY: "0.7em",
                  paddingX: "1em",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                  borderRadius: "0.3em",
                  backgroundColor: "white",
                }}
              >
                <Avatar
                  alt="company-logo"
                  src={`${HOST.main}${vacancy?.employer?.profile_image_path}`}
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
                    {vacancy?.position}
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
                            md: "0.8em",
                          },
                          color: grey[600],
                          marginLeft: "0.5em",
                        }}
                      >
                        {vacancy?.employer?.legal_name}
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
                            md: "0.8em",
                          },
                          color: grey[600],
                          marginLeft: "0.5em",
                        }}
                      >
                        {vacancy?.employer?.location}, Indonesia (INA)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* Job Description */}
              <Box component={"div"}
                sx={{
                  marginBottom: "1em"
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[800] }}
                >
                  Description
                </Typography>
                <Typography variant="body1" sx={{ color: grey[600], whiteSpace: "pre-line" }}>
                  {vacancy?.description}
                </Typography>
              </Box>
              {/* Job Qualification */}
              <Box component={"div"}
                sx={{
                  marginBottom: "1em",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[800] }}
                >
                  Qualification
                </Typography>
                <Typography variant="body1" sx={{ color: grey[600], whiteSpace: "pre-line" }}>
                  {vacancy?.qualification}
                </Typography>
              </Box>
              {/* Job Responsibility */}
              <Box component={"div"}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[800] }}
                >
                  Responsibility
                </Typography>
                <Typography variant="body1" sx={{ color: grey[600], whiteSpace: "pre-line" }}>
                  {vacancy?.responsibility}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} lgTablet={4}>
              <Box
                component={"div"}
                sx={{ paddingRight: "1em" }}
              >
                <Stack
                  direction={"column"}
                  spacing={2}
                  sx={{
                    padding: "1em",
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                    borderRadius: "0.3em",
                  }}
                >
                  <Box
                    component={"div"}
                    sx={{ display: "flex", columnGap: "0.5em" }}
                  >
                    <FoundationRounded sx={{ color: grey[600] }} />
                    <Box component={"div"}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                        Line Industry
                      </Typography>
                      <Typography variant="caption" sx={{ color: grey[600] }}>
                        {vacancy?.line_industry}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    component={"div"}
                    sx={{ display: "flex", columnGap: "0.5em" }}
                  >
                    <LocationOnRounded sx={{ color: grey[600] }} />
                    <Box component={"div"}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                        Location
                      </Typography>
                      <Typography variant="caption" sx={{ color: grey[600] }}>
                        {vacancy?.employer.location}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    component={"div"}
                    sx={{ display: "flex", columnGap: "0.5em" }}
                  >
                    <BadgeRounded sx={{ color: grey[600] }} />
                    <Box component={"div"}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                        Employee Type
                      </Typography>
                      <Typography variant="caption" sx={{ color: grey[600] }}>
                        {vacancy?.employee_type}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    component={"div"}
                    sx={{ display: "flex", columnGap: "0.5em" }}
                  >
                    <WorkspacePremiumRounded sx={{ color: grey[600] }} />
                    <Box component={"div"}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                        Experience
                      </Typography>
                      <Typography variant="caption" sx={{ color: grey[600] }}>
                        {vacancy?.min_experience}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    component={"div"}
                    sx={{ display: "flex", columnGap: "0.5em" }}
                  >
                    <MonetizationOnRounded sx={{ color: grey[600] }} />
                    <Box component={"div"}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                        Salary
                      </Typography>
                      <Typography variant="caption" sx={{ color: grey[600] }}>
                        {Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(vacancy?.salary as number)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    component={"div"}
                    sx={{ display: "flex", columnGap: "0.5em" }}
                  >
                    <MeetingRoomRounded sx={{ color: grey[600] }} />
                    <Box component={"div"}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                        Work Arrangement
                      </Typography>
                      <Typography variant="caption" sx={{ color: grey[600] }}>
                        {vacancy?.work_arrangement}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
                <Box component={"div"}
                  sx={{
                    marginY: "1em",
                    display: "flex",
                    justifyContent: "end"
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      minWidth: "10em",
                      width: {
                        xs: "100%",
                        sm: "auto",
                      }
                    }}
                    disabled={applied}
                    onClick={() => {
                      if (!isAuthenticated) {
                        return setOpenDialog(prev => ({ ...prev, ["unauthenticated"]: true }));
                      }
                      setOpenDialog(prev => ({ ...prev, ["confirmation"]: true }));
                    }}
                  >
                    {applied ? "Applied" : "Apply"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* Application Confirmation Dialog */}
      <Dialog
        open={Boolean(openDialog["confirmation"])}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            padding: "1.5em"
          }
        }}
      >
        <Box component={"div"}
          sx={{
            marginBottom: "2em"
          }}
        >
          <Typography component={"p"} variant="subtitle1"
            sx={{
              fontWeight: 550,
              color: grey[700],
              marginBottom: "0.5em",
            }}
          >
            Are you sure you want to <SimpleEmphasis text={" apply"} /> ?
          </Typography>
          <Typography component={"p"} variant="body1">
            Please ensure your profile is complete. If you want to update or completing your profile,
            <Typography component={"a"} variant="body1"
              sx={{
                color: blue[500],
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => navigate("/candidates/profile-overview")}
            >
              {" click here"}
            </Typography>
          </Typography>
        </Box>
        <Box component={"div"}
          sx={{
            display: "flex",
            justifyContent: "end",
            columnGap: "1em",
          }}
        >
          <Button
            variant="text"
            color="error"
            onClick={() => setOpenDialog(prev => ({ ...prev, ["confirmation"]: false }))}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            endIcon={loading && <CircularProgress size={20} />}
            disabled={loading}
            onClick={() => {
              onApply();
            }}
          >
            Apply Now
          </Button>
        </Box>
      </Dialog>
      {/* Dialog Untuk ke Halaman Login */}
      <Dialog
        open={Boolean(openDialog["unauthenticated"])}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            padding: "1.5em"
          }
        }}
      >
        <Box component={"div"}
          sx={{
            marginBottom: "2em"
          }}
        >
          <Typography component={"p"} variant="subtitle1"
            sx={{
              fontWeight: 550,
              color: grey[700],
              marginBottom: "0.5em",
            }}
          >
            Note
          </Typography>
          <Typography component={"p"} variant="body1">
            You need to log in to view available job vacancies. Would you like to <SimpleEmphasis text={" continue "} /> to the login page now?
          </Typography>
        </Box>
        <Box component={"div"}
          sx={{
            display: "flex",
            justifyContent: "end",
            columnGap: "1em",
          }}
        >
          <Button
            variant="text"
            color="error"
            size="small"
            onClick={() => setOpenDialog(prev => ({ ...prev, ["unauthenticated"]: false }))}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              navigate("/accounts/auth")
            }}
          >
            CONTINUE
          </Button>
        </Box>
      </Dialog>
    </BaseLayout>
  )
}