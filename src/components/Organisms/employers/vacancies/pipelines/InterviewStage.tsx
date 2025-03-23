import { ArrowForwardRounded, CalendarMonthRounded, CloseRounded, DoNotDisturbOnRounded, EditRounded, FactCheckRounded, HourglassBottomRounded, MoreVert, SearchRounded } from "@mui/icons-material";
import { Avatar, Box, Button, Chip, CircularProgress, Collapse, Dialog, Divider, FormControl, Grid, IconButton, InputAdornment, InputLabel, Link, ListItemIcon, ListItemText, Menu, MenuItem, Pagination, Select, SelectChangeEvent, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { amber, blue, green, grey, purple, red } from "@mui/material/colors";
import SimpleEmphasis from "../../../../Molecules/Texts/SimpleEmphasis";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { ApplicantUnscheduled } from "../../../../../pages/candidates/types";
import { GetSession, InputOnChangeV2 } from "../../../../../pages/global-helpers";
import RequestAPI from "../../../../../services/api/request";
import { InterviewFormSchema, InterviewFormType, LatestInterviewApplicant, ScheduledInterview } from "../../../../../pages/employers/types";
import { DEFAULT_INTERVIEW_FORM } from "../../../../../pages/employers/constants";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { HOST } from "../../../../../pages/administrators/performance/[id]/constants";

export default function InterviewStage({
  tabOn,
  setAlert,
  searchApplicant,
}: {
  tabOn: "screening" | "assessments" | "interviews" | "offerings" | "LoA";
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>;
  searchApplicant: string;
}) {
  /* react-router */
  const { id: vacancyID } = useParams();
  /* media query */
  const xSmallMedia = useMediaQuery("(max-width: 600px)");
  const smallMedia = useMediaQuery("(max-width: 900px)");
  /* state */
  // unscheduled -> applicants
  const [unscheduledApplicants, setUnscheduledApplicants] = useState<ApplicantUnscheduled[]>([]);
  const [unscheduledSearch, setUnscheduledSearch] = useState<string>("");
  const [pageUnscheduledApplicants, setPageUnscheduledApplicants] = useState<number>(1);
  // interview -> form
  const [interviewForm, setInterviewForm] = useState<InterviewFormType>(DEFAULT_INTERVIEW_FORM);
  const [errMsg, setErrMsg] = useState<Record<string, string[]>>({});
  const [isAssignInterview, setIsAssignInterview] = useState<boolean>(false);
  // TOP 1 latest interview
  const [latestInterviewApplicants, setLatestInterviewApplicants] = useState<LatestInterviewApplicant[]>([]);
  const [selectedLatestInterviewApplicant, setSelectedLatestInterviewApplicant] = useState<LatestInterviewApplicant | null>(null);
  const [pageLatestInterviewApplicants, setPageLatestinterviewApplicants] = useState<number>(1);
  // shceduled interviews
  const [scheduledInterviews, setScheduledInterviews] = useState<ScheduledInterview[]>([]);
  const [selectedInterviewID, setSelectedInterviewID] = useState<number>(0);
  const [resultInterview, setResultInterview] = useState<string>("");

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [refresh, setRefresh] = useState<Record<string, boolean>>({});

  /* helpers */
  const chipColorDeterminer = (status: string): SxProps => {
    switch (status) {
      case "Scheduled":
        return {
          color: purple[700],
          backgroundColor: purple[50],
        };
      case "Re-scheduled":
        return {
          color: amber[700],
          backgroundColor: amber[50],
        };
      case "Waiting":
        return {
          color: amber[700],
          backgroundColor: amber[50],
        };
      case "Accepted":
        return {
          color: green[700],
          backgroundColor: green[50],
        };
      default:
        return {
          color: green[700],
          backgroundColor: green[50],
        };
    }
  };
  const interviewResultColor = (result: string): SxProps => {
    switch (result) {
      case "Hire":
        return {
          color: green[700]
        }
      case "Reject":
        return {
          color: red[700]
        }
      case "Next Interview":
        return {
          color: blue[700]
        }
      case "Pending":
        return {
          color: amber[700]
        }
      default:
        return {
          color: grey[700]
        }
    };
  };

  /* constants */
  const columns = [
    { prop: "row_number", label: "#" },
    { prop: "fullname", label: "Name" },
    { prop: "schedule", label: "Schedule" },
    { prop: "result", label: "Result" },
    { prop: "option", label: "Option" },
  ];
  const responsiveColumns = smallMedia ? [
    { prop: "fullname", label: "Name" },
    { prop: "schedule", label: "Schedule" },
    { prop: "option", label: "Option" },
  ] : columns;
  const interviewResults = [
    "Hire", "Reject", "Next Interview", "Pending"
  ];
  // unscheduled applicants
  const searchedUnscheduledApplicants = unscheduledApplicants.filter(applicant => {
    const byName = applicant.candidate.user.fullname.toLowerCase().includes(unscheduledSearch.toLowerCase());
    const byEmail = applicant.candidate.user.email.toLowerCase().includes(unscheduledSearch.toLowerCase());
    return byName || byEmail;
  });
  const paginatedUnscheduledApplicants = searchedUnscheduledApplicants.slice((pageUnscheduledApplicants * 5) - 5, (pageUnscheduledApplicants * 5));
  const totalPagesUnscheduledApplicants = Math.ceil(searchedUnscheduledApplicants.length / 5);
  // latest interview applicants
  const searchedLatestInterviewApplicants = latestInterviewApplicants.filter(applicant => {
    const byName = applicant.candidate.user.fullname.toLowerCase().includes(searchApplicant.toLowerCase());
    const byEmail = applicant.candidate.user.email.toLowerCase().includes(searchApplicant.toLowerCase());
    return byName || byEmail;
  });
  const paginatedLatestInterviewApplicants = searchedLatestInterviewApplicants.slice((pageLatestInterviewApplicants * 5) - 5, (pageLatestInterviewApplicants * 5));
  const totalPagesLatestInterviewApplicants = Math.ceil(searchedLatestInterviewApplicants.length / 5);

  /* assign to offering */
  const assignToOffering = async () => {
    setLoading(prev => ({ ...prev, ["assign-applicant"]: true }));

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.JSONRequest({
      pipeline_id: selectedLatestInterviewApplicant?.id as string,
      stage: "Offering",
    }).Send<string>(
      "/api/v1/employers/pipelines/",
      {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token,
        }
      }
    );
    if (fail) {
      setLoading(prev => ({ ...prev, ["assign-applicant"]: false }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(prev => ({ ...prev, ["assign-applicant"]: false }));
      setOpenDialog(prev => ({ ...prev, ["assign-offering-confirmation"]: false }));
      setAnchorEl(null);
      setRefresh(prev => ({ ...prev, ["applicants-interview"]: !prev["applicants-interview"] }));
      return setAlert({ show: true, message: success });
    };
  };
  /* create-interview */
  const createInterview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(prev => ({ ...prev, ["create-interview"]: true }));

    const validate = InterviewFormSchema.safeParse(interviewForm);
    if (!validate.success) {
      setLoading(prev => ({ ...prev, ["create-interview"]: false }));
      const errSchema = validate.error.flatten().fieldErrors
      return setErrMsg(errSchema);
    } else {
      setErrMsg({});
    };


    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.FormDataRequest(interviewForm).Send<string>(
      "/api/v1/employers/interviews/",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
        }
      }
    );
    if (fail) {
      setLoading(prev => ({ ...prev, ["create-interview"]: false }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setInterviewForm(DEFAULT_INTERVIEW_FORM);
      setIsAssignInterview(false);
      setLoading(prev => ({ ...prev, ["create-interview"]: false }));
      setRefresh(prev => ({
        ...prev,
        ["scheduled-interview"]: !prev["scheduled-interview"],
        ["applicants-interview"]: !prev["applicants-interview"]
      }));
      return setAlert({ show: true, message: success });
    };
  };
  /* update interview */
  const updateInterview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(prev => ({ ...prev, ["interview-form"]: true }));

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.FormDataRequest(interviewForm).Send<string>(
      "/api/v1/employers/interviews/" + interviewForm.id,
      {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token,
        },
      },
    );
    if (fail) {
      setLoading(prev => ({ ...prev, ["interview-form"]: false }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(prev => ({ ...prev, ["interview-form"]: false }));
      setInterviewForm(DEFAULT_INTERVIEW_FORM);
      setIsAssignInterview(false);
      setRefresh(prev => ({
        ...prev,
        ["scheduled-interview"]: !prev["scheduled-interview"],
      }));
      return setAlert({ show: true, message: success });
    };
  };
  /* result inerview */
  const updateResultInterview = async () => {
    setLoading(prev => ({
      ...prev, ["result-interview"]: true,
    }));

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.FormDataRequest({
      status: resultInterview === "Pending" ? "Scheduled" : "Conducted",
      result: resultInterview
    }).Send<string>(
      "/api/v1/employers/interviews/" + selectedInterviewID,
      {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(prev => ({
        ...prev, ["result-interview"]: false,
      }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(prev => ({
        ...prev, ["result-interview"]: false,
      }));
      setOpenDialog(prev => ({ ...prev, ["result-interview"]: false }));
      setResultInterview("");
      setRefresh(prev => ({
        ...prev,
        ["scheduled-interview"]: !prev["scheduled-interview"],
        ["applicants-interview"]: !prev["applicants-interview"]
      }));
      return setAlert({ show: true, message: success });
    };
  };

  /* fetching -> unscheduled applicants */
  useEffect(() => {
    if (tabOn !== "interviews") {
      return;
    }
    const token = GetSession("auth");
    // applicants -> unscheduled interview
    (async () => {
      const [data, fail] = await RequestAPI.Send<ApplicantUnscheduled[]>(
        "/api/v1/employers/pipelines/" + vacancyID + "/interview?unscheduled",
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          }
        }
      );
      if (fail) {
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setUnscheduledApplicants(data);
      }
    })();
    // applicants -> interviews TOP 1 newest
    (async () => {
      const [data, fail] = await RequestAPI.Send<LatestInterviewApplicant[]>(
        "/api/v1/employers/pipelines/" + vacancyID + "/interview",
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          },
        },
      );
      if (fail) {
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setLatestInterviewApplicants(data);
      };
    })();
  }, [refresh["applicants-interview"], tabOn]);
  /* fetching -> scheduled interviews */
  useEffect(() => {
    if (tabOn !== "interviews") {
      return;
    }
    if (!selectedLatestInterviewApplicant?.id) {
      return;
    };

    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<ScheduledInterview[]>(
        "/api/v1/employers/interviews/histories/" + selectedLatestInterviewApplicant?.id as string + "/" + vacancyID,
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          }
        }
      );
      if (fail) {
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setScheduledInterviews(data);
      }
    })();
  }, [selectedLatestInterviewApplicant, refresh["scheduled-interview"], tabOn]);
  return (
    <Box component={"div"}>
      <Collapse
        in={Boolean(tabOn === "interviews")}
        mountOnEnter
        unmountOnExit
      >
        <Box component={"div"} id="screenings-panel">
          {/* Applicant Waiting for Interview Notif */}
          {unscheduledApplicants.length !== 0 && (
            <Box component={"div"}
              sx={{
                display: "flex",
                marginBottom: "1em",
                padding: "0.5em 0.8em",
                alignItems: "start",
                columnGap: "0.5em",
                borderRadius: "0.3em",
                backgroundColor: amber[50]
              }}
            >
              <HourglassBottomRounded fontSize="small" sx={{ marginTop: "0.1em", color: amber[700] }} />
              <Typography component={"p"} variant="subtitle2"
                sx={{ color: amber[700] }}
              >
                There are <SimpleEmphasis text={unscheduledApplicants.length} textColor={amber[700]} sx={{ fontWeight: 550 }} /> applicants waiting for interviews schedule. Please review and take action promptly, {" "}
                <Typography component={"span"}
                  sx={{
                    color: blue[700],
                    fontStyle: "italic",
                    textDecoration: "underline",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    setOpenDialog(prev => ({ ...prev, ["unscheduled"]: true }));
                  }}
                >
                  view here
                </Typography>
              </Typography>
            </Box>
          )}
          {(latestInterviewApplicants.length === 0 && unscheduledApplicants.length === 0) && (
            <Box component={"div"}
              sx={{
                width: "100%",
                padding: "0.5em",
                display: "flex",
                columnGap: "0.5em",
                alignItems: "center",
                borderRadius: "0.3em",
                backgroundColor: amber[50]
              }}
            >
              <DoNotDisturbOnRounded fontSize="small" sx={{ color: amber[700] }} />
              <Typography component={"p"} variant="caption"
                sx={{ color: amber[700] }}
              >
                There are no applicants currently in the interview stage
              </Typography>
            </Box>
          )}
          <TableContainer
            sx={{
              ".MuiTableHead-root": {
                ".MuiTableCell-root": {
                  borderBottom: "none",
                },
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {responsiveColumns.map((column, index) => (
                    <TableCell key={index}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 550, color: grey[500] }}
                      >
                        {column.label}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  "> .MuiTableRow-root:hover": {
                    backgroundColor: grey[100],
                  },
                  ".MuiTableCell-root": {
                    borderColor: grey[300],
                  },
                }}
              >
                {paginatedLatestInterviewApplicants.map((applicant, dataIndex) => (
                  <TableRow key={dataIndex}>
                    {responsiveColumns.map((column, index) => {
                      switch (column.prop) {
                        case "row_number":
                          return (
                            <TableCell key={index}
                              sx={{
                                width: "5%",
                              }}
                            >
                              {dataIndex + 1 + "."}
                            </TableCell>
                          );
                        case "fullname":
                          return (
                            <TableCell key={index} size="small"
                              sx={{
                                width: "35%",
                              }}
                            >
                              <Box
                                component={"div"}
                                sx={{
                                  width: "100%",
                                  display: "flex",
                                  flexWrap: "wrap",
                                  columnGap: {
                                    xs: 0,
                                    sm: "0.7em",
                                  },
                                  rowGap: {
                                    xs: "0.7em",
                                    sm: 0,
                                  },
                                }}
                              >
                                {!xSmallMedia && (
                                  <Avatar
                                    alt="candidate-profile"
                                    src={`${HOST.main}${applicant.candidate.profile_image_path}`}
                                    sx={{ width: 40, height: 40 }}
                                  />
                                )}
                                <Box component={"div"}>
                                  <Typography
                                    component={"p"}
                                    variant="subtitle2"
                                    sx={{ fontWeight: 550, color: grey[800] }}
                                  >
                                    {applicant.candidate.user.fullname}
                                  </Typography>
                                  <Typography
                                    component={"p"}
                                    variant="caption"
                                    sx={{ wordBreak: "break-word" }}
                                  >
                                    {applicant.candidate.user.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                          );
                        case "result":
                          return (
                            <TableCell key={index}
                              sx={{
                                width: "15%",
                              }}
                            >
                              {Object.keys(applicant.interview).length > 0 ? (
                                <Typography component={"p"} variant="subtitle2"
                                  sx={{ ...interviewResultColor(applicant.interview.result ?? "Pending") }}
                                >
                                  {applicant.interview.result ?? "Pending"}
                                </Typography>
                              ) : (
                                <Typography component={"p"} variant="subtitle2">
                                  -
                                </Typography>
                              )}
                            </TableCell>
                          );
                        case "schedule":
                          return (
                            <TableCell key={index}
                              sx={{
                                width: "40%",
                              }}
                            >
                              {Object.keys(applicant.interview).length > 0 ? (
                                <>
                                  <Typography component={"p"} variant="caption">
                                    <SimpleEmphasis text={applicant.interview.location} textColor={grey[700]} />
                                    <br />
                                    <SimpleEmphasis
                                      text={dayjs(applicant.interview.date).format("ddd MMM DD, YYYY - HH:mm")}
                                    // textColor={grey[600]}
                                    />
                                  </Typography>
                                  <Link
                                    component={RouterLink}
                                    to={applicant.interview.location_url}
                                    target="_blank"
                                    style={{
                                      textDecoration: "none",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    <Typography
                                      component={"p"}
                                      variant="caption"
                                      sx={{
                                        color: grey[600],
                                        ":hover": {
                                          color: blue[500],
                                          textDecoration: "underline",
                                        },
                                      }}
                                    >
                                      Interview link here
                                    </Typography>
                                  </Link>
                                  <Divider
                                    orientation="horizontal"
                                    sx={{ marginY: "0.5em" }}
                                  />
                                  <Box
                                    component={"div"}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Typography variant="caption">
                                      Status
                                    </Typography>
                                    <Chip
                                      label={applicant.interview.status}
                                      size="small"
                                      sx={chipColorDeterminer(applicant.interview.status)}
                                    />
                                  </Box>
                                </>
                              ) : (
                                <Typography component={"p"} variant="caption"
                                  sx={{
                                    color: grey[600]
                                  }}
                                >
                                  There are no upcoming interviews scheduled at the moment. Please check the <SimpleEmphasis text={"scheduled interviews"} /> for more details
                                </Typography>
                              )}
                            </TableCell>
                          );
                        case "option":
                          return (
                            <TableCell key={index} size="small"
                              sx={{
                                width: "5%",
                              }}
                            >
                              <Box
                                component={"div"}
                                sx={{
                                  display: "flex",
                                  justifyContent: "end",
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={(
                                    event: React.MouseEvent<HTMLButtonElement>
                                  ) => {
                                    setSelectedLatestInterviewApplicant(applicant);
                                    setAnchorEl(event.currentTarget);
                                  }
                                  }
                                >
                                  <MoreVert fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          );
                        default:
                          return (
                            <TableCell key={index} size="small" sx={{}}>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: grey[600] }}
                              >
                                {
                                  applicant[
                                  column.prop as keyof LatestInterviewApplicant
                                  ] as React.ReactNode
                                }
                              </Typography>
                            </TableCell>
                          );
                      }
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            color="primary"
            count={totalPagesLatestInterviewApplicants}
            page={pageLatestInterviewApplicants}
            onChange={(_: ChangeEvent<unknown>, page: number) => {
              setPageLatestinterviewApplicants(page);
            }}
            sx={{
              display: "flex",
              justifyContent: "end",
              marginY: "2em",
            }}
          />
        </Box>
      </Collapse >
      {/* Applicant Option Menu */}
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() =>
          setAnchorEl(null)
        }
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        slotProps={{
          paper: {
            sx: {
              minWidth: {
                xs: "auto",
                md: "10em",
              },
              padding: 0,
              border: "1px solid " + grey[400],
              boxShadow: "none",
            },
          },
        }}
        MenuListProps={{
          dense: true,
        }}
        sx={{
          ".MuiMenuItem-root:hover": {
            backgroundColor: grey[100],
            ".MuiListItemIcon-root": {
              color: "#06816d",
            },
            ".MuiListItemText-primary": {
              color: "#06816d",
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setOpenDialog(prev => ({ ...prev, ["assign-offering-confirmation"]: true }));
          }}
        >
          <ListItemIcon>
            <ArrowForwardRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={"Assign to Offering"}
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "small",
                fontWeight: 550,
                color: grey[600],
              },
            }}
          />
        </MenuItem>
        <MenuItem onClick={() => setOpenDialog(prev => ({ ...prev, ["scheduled"]: true }))}>
          <ListItemIcon>
            <CalendarMonthRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={"Scheduled Interviews"}
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "small",
                fontWeight: 550,
                color: grey[600],
              },
            }}
          />
        </MenuItem>
      </Menu>
      {/* Unscheduled Interview Applicants */}
      <Dialog
        open={Boolean(openDialog["unscheduled"])}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            padding: "1em 1.5em"
          }
        }}
      >
        <Box component={"div"}
          sx={{
            marginBottom: "0.5em",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography component={"p"} variant="subtitle1"
            sx={{
              fontWeight: 550,
              color: "#06816d",
            }}
          >
            Waiting for Interview Schedule
          </Typography>
          <IconButton size="small"
            onClick={() => setOpenDialog(prev => ({ ...prev, ["unscheduled"]: false }))}
          >
            <CloseRounded fontSize="small" sx={{ color: grey[700] }} />
          </IconButton>
        </Box>
        {
          isAssignInterview && (
            <Box component={"div"}>
              <Typography component={"div"} variant="subtitle2"
                sx={{ marginBottom: "0.7em", fontWeight: 550, color: grey[600] }}
              >
                Interview Form
              </Typography>
              <Box component={"div"}>
                <form onSubmit={createInterview}>
                  <Grid container
                    columnSpacing={1.5}
                    rowSpacing={1.5}
                  >
                    <Grid item xs={12} md={5}>
                      <DateTimePicker
                        name="date"
                        label="Date Schedule"
                        disablePast
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            error: Boolean(errMsg["date"]),
                            helperText: errMsg["date"]
                          }
                        }}
                        value={dayjs(interviewForm.date) ?? null}
                        onChange={(date: Dayjs | null) => {
                          setInterviewForm(prev => ({ ...prev, ["date"]: date?.format() as string }));
                        }}

                      />
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <TextField
                        type="text"
                        name="location"
                        label="Location"
                        placeholder="Specify the location for the interview"
                        autoComplete="off"
                        size="small"
                        fullWidth
                        value={interviewForm.location}
                        onChange={InputOnChangeV2(setInterviewForm)}
                        error={Boolean(errMsg["location"])}
                        helperText={errMsg["location"]}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        type="text"
                        name="location_url"
                        label="Meeting Location URL"
                        placeholder="Enter a Google Maps link or video conferencing URL"
                        autoComplete="off"
                        size="small"
                        fullWidth
                        value={interviewForm.location_url ?? ""}
                        onChange={InputOnChangeV2(setInterviewForm)}
                        error={Boolean(errMsg["location_url"])}
                        helperText={errMsg["location_url"]}
                      />
                    </Grid>
                  </Grid>
                  <Box component={"div"}
                    sx={{
                      marginTop: "1em",
                      display: "flex",
                      justifyContent: "end",
                      columnGap: 1
                    }}
                  >
                    <Button
                      variant="text"
                      size="small"
                      color="error"
                      sx={{
                        minWidth: "8em",
                      }}
                      onClick={() => {
                        setInterviewForm(DEFAULT_INTERVIEW_FORM);
                        setIsAssignInterview(false);
                      }}
                    >
                      CANCEL
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      disabled={loading["create-interview"]}
                      startIcon={loading["create-interview"] && (<CircularProgress size={20} color="inherit" />)}
                      sx={{
                        minWidth: "8em",
                      }}
                    >
                      SUBMIT
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          )
        }
        <Box component={"div"}>
          <Typography component={"p"} variant="subtitle2"
            sx={{
              marginBottom: "0.5em",
              fontWeight: 550,
              color: grey[600]
            }}
          >
            Unscheduled Applicants
          </Typography>
          <TextField
            type="text"
            name="search" // search for applicant
            placeholder="Search assignee by name or email..."
            autoComplete="off"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded />
                </InputAdornment>
              ),
              sx: {
                marginBottom: "0.5em",
                minWidth: {
                  md: "20em",
                },
              },
            }}
            value={unscheduledSearch}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setUnscheduledSearch(event.target.value);
            }}
          />
        </Box>
        <Box component={"div"} sx={{ marginTop: "0.5em" }}>
          {paginatedUnscheduledApplicants.map((applicant, index) => {
            return (
              <Box
                key={index}
                component={"div"}
                sx={{
                  paddingY: "0.5em",
                  paddingX: "0.5em",
                  display: "flex",
                  columnGap: "0.7em",
                  borderBottom: "1px solid " + grey[100],
                  "&:hover": {
                    backgroundColor: grey[100],
                    borderRadius: "0.3em",
                  },
                }}
              >
                <Avatar
                  alt="candidate-profile-image"
                  src={HOST.main + applicant.candidate.profile_image_path}
                  sx={{ width: 40, height: 40 }}
                />
                <Box component={"div"}
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box component={"div"}>
                    <Typography component={"p"} variant="subtitle2"
                      sx={{
                        color: grey[600],
                        fontWeight: 550,
                      }}
                    >
                      {applicant.candidate.user.fullname}
                    </Typography>
                    <Typography component={"p"} variant="caption"
                    >
                      {applicant.candidate.user.email}
                    </Typography>
                  </Box>
                  <Tooltip title={"Assign interview"} placement="left">
                    <IconButton size="small"
                      onClick={() => {
                        setInterviewForm({
                          ...DEFAULT_INTERVIEW_FORM,
                          pipeline_id: applicant.id,
                          vacancy_id: vacancyID as string,
                        });
                        setIsAssignInterview(true);
                      }}
                    >
                      <CalendarMonthRounded fontSize="small" sx={{ color: blue[500] }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )
          })}
          <Pagination
            size="small"
            count={totalPagesUnscheduledApplicants}
            page={pageUnscheduledApplicants}
            onChange={(_: ChangeEvent<unknown>, page: number) => {
              setPageUnscheduledApplicants(page);
            }}
            sx={{
              display: "flex",
              justifyContent: "end",
              marginY: "2em",
            }}
          />
        </Box>
      </Dialog>
      {/* Scheduled Interviews Dialog */}
      <Dialog
        open={Boolean(openDialog["scheduled"])}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            padding: "1em 1.5em"
          }
        }}
      >
        <Box component={"div"}
          sx={{
            marginBottom: "0.5em",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography component={"p"} variant="subtitle1"
            sx={{
              fontWeight: 550,
              color: grey[700]
            }}
          >
            <SimpleEmphasis text={selectedLatestInterviewApplicant?.candidate.user.fullname.split(" ")[0] + "'s"} /> Scheduled Interviews
          </Typography>
          <IconButton onClick={() => setOpenDialog(prev => ({ ...prev, ["scheduled"]: false }))}>
            <CloseRounded fontSize="small" sx={{ color: grey[700] }} />
          </IconButton>
        </Box>
        {!isAssignInterview && (
          <Box component={"div"}
            sx={{
              marginBottom: "0.5em",
            }}
          >
            <Typography component={"p"} variant="subtitle2">
              To schedule a new interview,
              <span onClick={() => {
                setInterviewForm(prev => ({
                  ...prev,
                  pipeline_id: selectedLatestInterviewApplicant?.id as string,
                  vacancy_id: vacancyID as string
                }));
                setIsAssignInterview(true);
              }}
                style={{
                  cursor: "pointer",
                  fontStyle: "italic",
                  color: blue[500]
                }}
              >
                {" "}click here
              </span>
            </Typography>
          </Box>
        )}
        {isAssignInterview && (
          <Box component={"div"}
            sx={{
              marginBottom: "1em",
            }}
          >
            <Typography component={"div"} variant="subtitle2"
              sx={{ marginBottom: "0.7em", fontWeight: 550, color: grey[600] }}
            >
              Interview Form
            </Typography>
            <Box component={"div"}>
              <form onSubmit={Boolean(interviewForm.id) ? updateInterview : createInterview}>
                <Grid container
                  columnSpacing={1.5}
                  rowSpacing={1.5}
                >
                  <Grid item xs={12} md={5}>
                    <DateTimePicker
                      name="date"
                      label="Date Schedule"
                      disablePast
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: Boolean(errMsg["date"]),
                          helperText: errMsg["date"]
                        }
                      }}
                      value={interviewForm.date ? dayjs(interviewForm.date) : null}
                      onChange={(date: Dayjs | null) => {
                        setInterviewForm(prev => ({ ...prev, ["date"]: date?.format() as string }));
                      }}

                    />
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <TextField
                      type="text"
                      name="location"
                      label="Location"
                      placeholder="Specify the location for the interview"
                      autoComplete="off"
                      size="small"
                      fullWidth
                      value={interviewForm.location}
                      onChange={InputOnChangeV2(setInterviewForm)}
                      error={Boolean(errMsg["location"])}
                      helperText={errMsg["location"]}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      name="location_url"
                      label="Meeting Location URL"
                      placeholder="Enter a Google Maps link or video conferencing URL"
                      autoComplete="off"
                      size="small"
                      fullWidth
                      value={interviewForm.location_url ?? ""}
                      onChange={InputOnChangeV2(setInterviewForm)}
                      error={Boolean(errMsg["location_url"])}
                      helperText={errMsg["location_url"]}
                    />
                  </Grid>
                </Grid>
                <Box component={"div"}
                  sx={{
                    marginTop: "1em",
                    display: "flex",
                    justifyContent: "end",
                    columnGap: 1
                  }}
                >
                  <Button
                    variant="text"
                    size="small"
                    color="error"
                    sx={{
                      minWidth: "8em",
                    }}
                    onClick={() => {
                      setInterviewForm(DEFAULT_INTERVIEW_FORM);
                      setIsAssignInterview(false);
                    }}
                  >
                    CANCEL
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={loading["interview-form"]}
                    startIcon={loading["interview-form"] && (<CircularProgress size={20} color="inherit" />)}
                    sx={{
                      minWidth: "8em",
                    }}
                  >
                    SUBMIT
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        )}
        <Box component={"div"}>
          {scheduledInterviews.map((interview, index) => {
            const scheduleDate = dayjs(interview.date).format("ddd MMM DD, YYYY - HH:mm");
            return (
              <Box key={index} component={"div"}
                sx={{
                  marginBottom: (index === scheduledInterviews.length - 1) ? "0" : "0.5em",
                  padding: "0.5em",
                  border: "1px solid " + grey[300],
                  borderRadius: "0.3em",
                  "&:hover": {
                    backgroundColor: grey[100]
                  }
                }}
              >
                <Box component={"div"}
                  sx={{
                    display: "flex",
                    alignItems: "start",
                  }}
                >
                  <Typography component={"p"} variant="caption"
                    sx={{
                      flexGrow: 1
                    }}
                  >
                    <SimpleEmphasis text={interview.location} textColor={grey[700]} />
                    <br />
                    <SimpleEmphasis
                      text={scheduleDate}
                    // textColor={grey[600]}
                    />
                  </Typography>
                  <Tooltip title={"Submit Result"}>
                    <IconButton size="small"
                      onClick={() => {
                        setSelectedInterviewID(interview.id);
                        setOpenDialog(prev => ({ ...prev, ["result-interview"]: true }));
                      }}
                    >
                      <FactCheckRounded fontSize="small" sx={{ color: blue[700] }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Edit"}>
                    <IconButton size="small"
                      onClick={() => {
                        setInterviewForm({
                          id: interview.id,
                          pipeline_id: selectedLatestInterviewApplicant?.id as string,
                          vacancy_id: vacancyID as string,
                          date: interview.date,
                          location: interview.location,
                          location_url: interview.location_url,
                          status: interview.status,
                          result: interview.result ?? "Pending",
                        })
                        setIsAssignInterview(true);
                      }}
                    >
                      <EditRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Link
                  component={RouterLink}
                  to={interview.location_url}
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    fontStyle: "italic",
                  }}
                >
                  <Typography
                    component={"p"}
                    variant="caption"
                    sx={{
                      color: grey[600],
                      ":hover": {
                        color: blue[500],
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Interview link here
                  </Typography>
                </Link>
                <Divider
                  orientation="horizontal"
                  sx={{ marginY: "0.5em" }}
                />
                <Box
                  component={"div"}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="caption">
                    Status :
                  </Typography>
                  <Chip
                    label={interview.status}
                    size="small"
                    sx={chipColorDeterminer(interview.status)}
                  />
                </Box>
                <Box
                  component={"div"}
                  sx={{
                    marginTop: "0.3em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="caption">
                    Result :
                  </Typography>
                  <Typography component={"p"} variant="subtitle2"
                    sx={{
                      paddingX: "0.3em",
                      // fontWeight: 550,
                      ...interviewResultColor(interview.result ?? "Pending"),
                    }}
                  >
                    {interview.result ?? "Pending"}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Dialog>
      {/* Set Interview Results */}
      <Dialog
        open={Boolean(openDialog["result-interview"])}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            padding: "1em 1.5em"
          }
        }}
      >
        <Typography component={"p"} variant="subtitle1"
          sx={{
            marginBottom: "0.7em",
            fontWeight: 550,
            color: grey[700]
          }}
        >
          Post Interview Result
        </Typography>
        <FormControl size="small">
          <InputLabel id="interview-result">Interview Result</InputLabel>
          <Select
            labelId="interview-result"
            label="Interview Result"
            name="result"
            value={resultInterview}
            onChange={(event: SelectChangeEvent<string>) => {
              setResultInterview(event.target.value);
            }}
          >
            {interviewResults.map((result, index) => {
              return (
                <MenuItem key={index} value={result}>{result}</MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <Box component={"div"}
          sx={{
            marginTop: "1.5em",
            display: "flex",
            justifyContent: "end",
            columnGap: 2
          }}
        >
          <Button
            variant="text"
            color="error"
            size="small"
            sx={{
              minWidth: "8em"
            }}
            onClick={() => {
              setOpenDialog(prev => ({ ...prev, ["result-interview"]: false }));
            }}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={loading["result-interview"]}
            startIcon={loading["result-interview"] && <CircularProgress size={20} color="inherit" />}
            sx={{
              minWidth: "8em"
            }}
            onClick={() => {
              updateResultInterview();
            }}
          >
            SUBMIT
          </Button>
        </Box>
      </Dialog>
      {/* Assign Offering Confirmation Dialog */}
      <Dialog
        open={Boolean(openDialog["assign-offering-confirmation"])}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            padding: "1em 1.5em"
          }
        }}
      >
        <Typography component={"p"} variant="subtitle1"
          sx={{
            fontWeight: 550, color: grey[700]
          }}
        >
          Confirm Assignment to Offering
        </Typography>
        <Typography component={"p"} variant="subtitle2"
          sx={{
            marginTop: "0.3em",
            color: grey[600]
          }}
        >
          Are you sure you want to assign <SimpleEmphasis text={selectedLatestInterviewApplicant?.candidate.user.fullname as string} /> to the offering stage? This action indicates the applicant is being offered a position.
        </Typography>
        <Box component={"div"}
          sx={{
            marginTop: "1.5em",
            display: "flex",
            justifyContent: "end",
            columnGap: 2
          }}
        >
          <Button
            variant="text"
            color="error"
            size="small"
            sx={{
              minWidth: "8em"
            }}
            onClick={() => {
              setOpenDialog(prev => ({ ...prev, ["assign-offering-confirmation"]: false }));
            }}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={loading["assign-applicant"]}
            startIcon={loading["assign-applicant"] && (<CircularProgress size={20} color="inherit" />)}
            sx={{
              minWidth: "8em"
            }}
            onClick={() => {
              assignToOffering();
            }}
          >
            CONTINUE
          </Button>
        </Box>
      </Dialog>
    </Box >
  )
}