import { AddRounded, CloseRounded, DoNotDisturbOnRounded, EventRounded, ForwardToInbox, HourglassBottomRounded, MoreVert, PublishRounded, RestartAltRounded, SearchRounded } from "@mui/icons-material";
import { Avatar, Box, Button, Chip, CircularProgress, Collapse, Dialog, Divider, FormHelperText, IconButton, InputAdornment, InputBase, ListItemIcon, ListItemText, Menu, MenuItem, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { amber, blue, grey, lightBlue } from "@mui/material/colors";
import SimpleEmphasis from "../../../../Molecules/Texts/SimpleEmphasis";
import { ChangeEvent, useEffect, useState } from "react";
import { chipColorDeterminer, GetSession } from "../../../../../pages/global-helpers";
import RequestAPI from "../../../../../services/api/request";
import { useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { ApplicantOffered, ApplicantUnoffered } from "../../../../../pages/employers/types";
import { HOST } from "../../../../../pages/administrators/performance/[id]/constants";

export default function OfferingStage({
  tabOn,
  setAlert,
  searchApplicant,
}: {
  tabOn: "screening" | "assessments" | "interviews" | "offerings" | "LoA";
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>;
  searchApplicant: string;
}) {
  /* media-queries */
  const xSmallMedia = useMediaQuery("(max-width: 600px)");
  const smallMedia = useMediaQuery("(max-width: 900px)");

  /* react-router */
  const { id: vacancyID } = useParams();

  /* state */
  // applicants -> unoffered
  const [applicantsUnoffered, setApplicantsUnoffered] = useState<ApplicantUnoffered[]>([]);
  const [selectedUnoffered, setSelectedUnoffered] = useState<ApplicantUnoffered | null>(null);
  const [searchUnoffered, setSearchUnoffered] = useState<string>("");
  const [pageApplicantsUnoffered, setPageApplicantsUnoffered] = useState<number>(1);
  const [offerEndDate, setOfferEndDate] = useState<string>("");
  // applicants -> offered
  const [applicantsOffered, setApplicantsOffered] = useState<ApplicantOffered[]>([]);
  const [selectedOffered, setSelectedOffered] = useState<ApplicantOffered | null>(null);
  const [pageApplicantsOffered, setPageApplicantsOffered] = useState<number>(1);

  // offering -> LoA document
  const [document, setDocument] = useState<File[]>([]);
  const [errMsg, setErrMsg] = useState<string>("");

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [refresh, setRefresh] = useState<Record<string, boolean>>({});

  /* constants */
  const columns = [
    { prop: "row_number", label: "#" },
    { prop: "name", label: "Name" },
    { prop: "end_on", label: "Offer End On" },
    { prop: "status", label: "Status" },
    { prop: "option", label: "Option" },
  ];
  const responsiveColumns = smallMedia ? [
    { prop: "name", label: "Name" },
    { prop: "end_on", label: "Offer End On" },
    { prop: "option", label: "Option" },
  ] : columns;
  // applicants -> unoffered
  const searchedUnoffered = applicantsUnoffered.filter(applicant => {
    const byName = applicant.candidate.user.fullname.toLowerCase().includes(searchUnoffered.toLowerCase());
    const byEmail = applicant.candidate.user.email.toLowerCase().includes(searchUnoffered.toLowerCase());
    return byName || byEmail;
  });
  const paginatedApplicantsUnoffered = searchedUnoffered.slice((pageApplicantsUnoffered * 5) - 5, (pageApplicantsUnoffered * 5));
  const totalPagesApplicantsUnoffered = Math.ceil(searchedUnoffered.length / 5);
  // applicants -> offered
  const searchedOffered = applicantsOffered.filter(applicant => {
    const byName = applicant.candidate.user.fullname.toLowerCase().includes(searchApplicant.toLowerCase());
    const byEmail = applicant.candidate.user.email.toLowerCase().includes(searchApplicant.toLowerCase());
    return byName || byEmail;
  });
  const paginatedApplicantsOffered = searchedOffered.slice((pageApplicantsOffered * 5) - 5, (pageApplicantsOffered * 5));
  const totalPagesApplicantsOffered = Math.ceil(searchedOffered.length / 5);

  /* handlers */
  const fileOnChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size < 2097152) {
        setErrMsg("");
        return setDocument([file]);
      } else {
        return setErrMsg(`${file.name} should be less than 2 megabyte`);
      };
    };
  };

  /* on-send offer */
  const sendOffer = async () => {
    setLoading(prev => ({ ...prev, ["send-offer"]: true }));

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.FormDataRequest({
      end_on: offerEndDate,
      pipeline_id: selectedUnoffered?.id as string,
      vacancy_id: vacancyID
    }).Send<string>(
      "/api/v1/employers/offerings/",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(prev => ({ ...prev, ["send-offer"]: false }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setSelectedUnoffered(null);
      setLoading(prev => ({ ...prev, ["send-offer"]: false }));
      setOpenDialog(prev => ({ ...prev, ["send-offer-form"]: false }))
      setRefresh(prev => ({ ...prev, ["applicants-unoffered"]: !prev["applicants-unoffered"], ["applicants-offered"]: !prev["applicants-offered"] }));
      return setAlert({ show: true, message: success });
    };
  };
  /* update end date */
  const updateEndDate = async () => {
    setLoading(prev => ({ ...prev, ["send-offer"]: true }));

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.FormDataRequest({
      end_on: offerEndDate
    }).Send<{ message: string; document_status: string; }>(
      "/api/v1/employers/offerings/" + selectedOffered?.offering.id as string,
      {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(prev => ({ ...prev, ["send-offer"]: false }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setSelectedOffered(null);
      setLoading(prev => ({ ...prev, ["send-offer"]: false }));
      setOpenDialog(prev => ({ ...prev, ["send-offer-form"]: false }))
      setRefresh(prev => ({ ...prev, ["applicants-offered"]: !prev["applicants-offered"] }));
      return setAlert({ show: true, message: success.message });
    };
  };
  /* resend offer */
  const resendOffer = async () => {
    setLoading(prev => ({ ...prev, ["resend-offer"]: true }));

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.FormDataRequest({
      status: "Pending Acceptance"
    }).Send<{ message: string; document_status: string; }>(
      "/api/v1/employers/offerings/" + selectedOffered?.offering.id as string,
      {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(prev => ({ ...prev, ["resend-offer"]: false }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setSelectedOffered(null);
      setLoading(prev => ({ ...prev, ["resend-offer"]: false }));
      setOpenDialog(prev => ({ ...prev, ["resend-offer"]: false }))
      setRefresh(prev => ({ ...prev, ["applicants-offered"]: !prev["applicants-offered"] }));
      return setAlert({ show: true, message: success.message });
    };
  };

  /* issue LoA */
  const issueLoA = async () => {
    setLoading(prev => ({ ...prev, ["issue-loa"]: true }));

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.FormDataRequest({
      loa_document: document[0]
    }).Send<{ message: string, document_status: string }>(
      "/api/v1/employers/offerings/" + selectedOffered?.offering.id as string,
      {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(prev => ({ ...prev, ["issue-loa"]: false }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setDocument([]);
      setOpenDialog(prev => ({ ...prev, ["issue-loa"]: false }));
      setRefresh(prev => ({ ...prev, ["applicants-offered"]: !prev["applicants-offered"] }))
      setLoading(prev => ({ ...prev, ["issue-loa"]: false }));
      return setAlert({ show: true, message: success.message });
    };
  };

  /* fetching -> applicants unoffered */
  useEffect(() => {
    if (tabOn !== "offerings") {
      return;
    }
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<ApplicantUnoffered[]>(
        "/api/v1/employers/pipelines/" + vacancyID as string + "/offering?unoffered",
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
        return setApplicantsUnoffered(data);
      };
    })();
  }, [refresh["applicants-unoffered"], tabOn]);
  /* fetching -> applicants offered */
  useEffect(() => {
    if (tabOn !== "offerings") {
      return;
    }
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<ApplicantOffered[]>(
        "/api/v1/employers/pipelines/" + vacancyID as string + "/offering",
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );
      if (fail) {
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setApplicantsOffered(data);
      };
    })();
  }, [refresh["applicants-offered"], tabOn]);
  return (
    <Box component={"div"}>
      <Collapse
        in={Boolean(tabOn === "offerings")}
        mountOnEnter
        unmountOnExit
      >
        <Box component={"div"} id="screenings-panel">
          {(applicantsUnoffered.length === 0 && applicantsOffered.length === 0) && (
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
                There are no applicants currently in the offering stage
              </Typography>
            </Box>
          )}
          {applicantsUnoffered.length !== 0 && (
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
                There are <SimpleEmphasis text={applicantsUnoffered.length} textColor={amber[700]} sx={{ fontWeight: 550 }} /> applicants waiting to be offered. Please review and take action promptly, {" "}
                <Typography component={"span"}
                  sx={{
                    color: blue[700],
                    fontStyle: "italic",
                    textDecoration: "underline",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    setOpenDialog(prev => ({ ...prev, ["unoffered"]: true }));
                  }}
                >
                  view here
                </Typography>
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
                {paginatedApplicantsOffered.map((applicant, dataIndex) => (
                  <TableRow key={dataIndex}>
                    {responsiveColumns.map((column, index) => {
                      switch (column.prop) {
                        case "row_number":
                          return (
                            <TableCell key={index} size="small">{dataIndex + 1 + "."}</TableCell>
                          );
                        case "name":
                          return (
                            <TableCell key={index} size="small">
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
                                    sx={{ wordBreak: "break-word", color: grey[600] }}
                                  >
                                    {applicant.candidate.user.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                          );
                        case "status":
                          return (
                            <TableCell key={index} size="small">
                              <Chip
                                label={applicant.offering.status}
                                size="small"
                                sx={chipColorDeterminer(applicant.offering.status)}
                              />
                              {applicant.offering.loa_document.loa_document_path !== null && (
                                <Typography component={"p"} variant="caption" sx={{ color: lightBlue[700] }}>
                                  Letter of Acceptance uploaded.
                                </Typography>
                              )}
                            </TableCell>
                          );
                        case "option":
                          return (
                            <TableCell key={index} size="small">
                              <Box
                                component={"div"}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={(
                                    event: React.MouseEvent<HTMLButtonElement>
                                  ) => {
                                    if (selectedUnoffered) {
                                      setSelectedUnoffered(null);
                                    };
                                    setSelectedOffered(applicant);
                                    setAnchorEl(event.currentTarget);
                                  }
                                  }
                                >
                                  <MoreVert fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          );
                        case "end_on":
                          const isExpired = dayjs().isAfter(dayjs(applicant.offering.end_on));
                          return (
                            <TableCell key={index} size="small">
                              <Typography variant="subtitle2">
                                <SimpleEmphasis
                                  text={dayjs(applicant.offering.end_on).format("dddd MMM DD, YYYY")}
                                  textColor={isExpired && applicant.offering.status === "Pending Acceptance" ? "red" : undefined}
                                />
                              </Typography>
                              {isExpired && applicant.offering.status === "Pending Acceptance" && (
                                <Typography component={"p"} variant="caption"
                                  sx={{ color: grey[500] }}
                                >
                                  The offer has expired
                                </Typography>
                              )}
                              {smallMedia && (
                                <>
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
                                      label={applicant.offering.status}
                                      size="small"
                                      sx={chipColorDeterminer(applicant.offering.status)}
                                    />
                                  </Box>
                                </>
                              )}
                            </TableCell>
                          );
                        default:
                          return (
                            <TableCell key={index}>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: grey[600] }}
                              >
                                {
                                  // data[
                                  // column.valueProp as keyof OfferingsProps
                                  // ] as React.ReactNode
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
            count={totalPagesApplicantsOffered}
            page={pageApplicantsOffered}
            onChange={(_: ChangeEvent<unknown>, page: number) => {
              setPageApplicantsOffered(page);
            }}
            sx={{
              display: "flex",
              justifyContent: "end",
              marginY: "2em",
            }}
          />
        </Box>
      </Collapse>
      {/* Option Menu Offering */}
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => { setAnchorEl(null); }}
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
          disabled={selectedOffered?.offering.status !== "Offer Accepted"}
          onClick={() => {
            setOpenDialog(prev => ({ ...prev, ["issue-loa"]: true }));
          }}
        >
          <ListItemIcon>
            <PublishRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={selectedOffered?.offering.loa_document.loa_document_path !== null ? "Change LoA" : "Issue LoA"}
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "small",
                fontWeight: 550,
                color: grey[600],
              },
            }}
          />
        </MenuItem>
        <MenuItem
          disabled={selectedOffered?.offering.status === "Offer Accepted"}
          onClick={() => {
            setOfferEndDate(selectedOffered?.offering.end_on as string);
            setOpenDialog(prev => ({ ...prev, ["send-offer-form"]: true }));
          }}
        >
          <ListItemIcon>
            <EventRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={"Change End Date"}
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "small",
                fontWeight: 550,
                color: grey[600],
              },
            }}
          />
        </MenuItem>
        <MenuItem
          disabled={selectedOffered?.offering.status !== "Offer Declined"}
          onClick={() => {
            setOpenDialog(prev => ({ ...prev, ["resend-offer"]: true }));
          }}
        >
          <ListItemIcon>
            <RestartAltRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={"Resend Offer"}
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
      {/* Applicants Unoffered Dialog */}
      <Dialog
        open={Boolean(openDialog["unoffered"])}
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
            Waiting to be Offered
          </Typography>
          <IconButton size="small"
            onClick={() => {
              setOpenDialog(prev => ({ ...prev, ["unoffered"]: false }));
            }}
          >
            <CloseRounded fontSize="small" sx={{ color: grey[700] }} />
          </IconButton>
        </Box>
        <Box component={"div"}
          sx={{
            marginBottom: "0.5em",
          }}
        >
          <TextField
            type="text"
            name="search" // search for applicant
            placeholder="Search applicant by name or email..."
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
            value={searchUnoffered}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchUnoffered(event.target.value);
            }}
          />
        </Box>
        <Box component={"div"}>
          {paginatedApplicantsUnoffered.map((applicant, index) => {
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
                  <Tooltip title="Send Offer" placement="left">
                    <IconButton size="small"
                      onClick={() => {
                        if (offerEndDate) {
                          setOfferEndDate("");
                        };
                        setSelectedUnoffered(applicant);
                        setOpenDialog(prev => ({ ...prev, ["send-offer-form"]: true }))
                      }}
                    >
                      <ForwardToInbox fontSize="small" sx={{ color: "#06816d" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )
          })}
          <Pagination
            size="small"
            color="primary"
            count={totalPagesApplicantsUnoffered}
            page={pageApplicantsUnoffered}
            onChange={(_: ChangeEvent<unknown>, page: number) => {
              setPageApplicantsUnoffered(page);
            }}
            sx={{
              display: "flex",
              justifyContent: "end",
              marginY: "2em",
            }}
          />
        </Box>
      </Dialog>
      {/* Send Offer Dialog */}
      <Dialog
        open={Boolean(openDialog["send-offer-form"])}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            padding: "1em 1.5em"
          }
        }}
      >
        <Typography component={"div"} variant="subtitle1"
          sx={{
            marginBottom: "0.7em",
            fontWeight: 550,
            color: grey[700]
          }}
        >
          Send <SimpleEmphasis text={selectedUnoffered?.candidate.user.fullname as string ?? selectedOffered?.candidate.user.fullname} /> Offer
        </Typography>
        <Box component={"div"}>
          <DatePicker
            name="end_on"
            label="Offer End Date"
            disablePast
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
              }
            }}
            value={offerEndDate ? dayjs(offerEndDate) : null}
            onChange={(date: Dayjs | null) => {
              setOfferEndDate(date?.format() as string);
            }}
          />
        </Box>
        <Box component={"div"}
          sx={{
            marginTop: "1.5em",
            display: "flex",
            columnGap: 2,
            justifyContent: "end",
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
              setOpenDialog(prev => ({ ...prev, ["send-offer-form"]: false }));
            }}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={loading["send-offer"]}
            startIcon={loading["send-offer"] && (<CircularProgress size={20} color="inherit" />)}
            sx={{
              minWidth: "8em"
            }}
            onClick={() => {
              if (selectedOffered) {
                updateEndDate()
              } else {
                sendOffer();
              }
            }}
          >
            CONTINUE
          </Button>
        </Box>
      </Dialog>
      {/* Resend Offer Dialog */}
      <Dialog
        open={Boolean(openDialog["resend-offer"])}
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
          Resend Offer
        </Typography>
        <Typography component={"p"} variant="subtitle2">
          Are you sure you want to resend the job offer to <SimpleEmphasis text={selectedOffered?.candidate.user.fullname as string} />?
        </Typography>
        <Box component={"div"}
          sx={{
            marginTop: "1.5em",
            display: "flex",
            columnGap: 2,
            justifyContent: "end",
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
              setOpenDialog(prev => ({ ...prev, ["resend-offer"]: false }));
            }}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={loading["resend-offer"]}
            startIcon={loading["resend-offer"] && (<CircularProgress size={20} color="inherit" />)}
            sx={{
              minWidth: "8em"
            }}
            onClick={() => {
              // RESEND OFFER API
              resendOffer();
            }}
          >
            CONTINUE
          </Button>
        </Box>
      </Dialog>
      {/* Issure LoA Dialog */}
      <Dialog
        open={Boolean(openDialog["issue-loa"])}
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
            marginBottom: "0.5em",
            fontWeight: 550,
            color: grey[700]
          }}
        >
          Issue <SimpleEmphasis text={selectedOffered?.candidate.user.fullname.split(" ")[0] as string + "'s "} /> Letter of Acceptance
        </Typography>
        <Box component={"div"}>
          {document.map((file, index) => (
            <Box
              key={index}
              component={"div"}
              sx={{
                height: "max-content",
                display: "flex",
                flexWrap: "wrap",
                columnGap: "0.5em",
                rowGap: "0.3em",
              }}
            >
              <Box
                component={"div"}
                sx={{
                  display: "flex",
                  columnGap: "0.3em",
                  alignItems: "center",
                  padding: "0.2em 0.5em",
                  borderRadius: "0.3em",
                  backgroundColor: grey[200],
                  cursor: "pointer",
                  ":hover": {
                    backgroundColor: blue[50],
                  },
                  ":hover .MuiTypography-caption": {
                    color: blue[500],
                  },
                }}
              >
                <Typography
                  component={"p"}
                  variant="caption"
                  sx={{ color: grey[600] }}
                >
                  {file.name}
                </Typography>
                <IconButton size="small" sx={{ padding: "0.1em 0em" }}
                  onClick={() => {
                    setDocument(prev => {
                      prev.splice(index, 1);
                      return [...prev]
                    })
                  }}
                >
                  <CloseRounded fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
          {document.length === 0 && (
            <Box component={"div"}
              sx={{
                width: 28,
                height: 28,
                border: "1px dashed " + grey[300],
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton component="label"
                htmlFor="loa_document"
                size="small"
              >
                <AddRounded fontSize="small" sx={{ color: grey[600] }} />
                <InputBase
                  id="loa_document"
                  type="file"
                  name="loa_document"
                  slotProps={{
                    input: {
                      accept: "application/*"
                    }
                  }}
                  sx={{
                    height: '0px',
                    width: '0px',
                    opacity: 0
                  }}
                  onChange={fileOnChangeHandler}
                />
              </IconButton>
            </Box>
          )}
          <FormHelperText sx={{
            fontSize: "0.7em",
            fontWeight: 500,
            color: Boolean(errMsg) ? "red" : grey[500]
          }}>
            {errMsg ? errMsg : "Select the Letter of Acceptance document"}
          </FormHelperText>
        </Box>
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
              setDocument([]);
              setOpenDialog(prev => ({ ...prev, ["issue-loa"]: false }));
            }}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={document.length === 0 || loading["issue-loa"]}
            startIcon={loading["issue-loa"] && (<CircularProgress size={20} color="inherit" />)}
            sx={{
              minWidth: "8em"
            }}
            onClick={() => {
              issueLoA();
            }}
          >
            CONTINUE
          </Button>
        </Box>
      </Dialog>
    </Box >
  )
}