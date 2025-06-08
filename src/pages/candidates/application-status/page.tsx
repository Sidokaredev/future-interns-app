import {
  AccessTime,
  AddRounded,
  AssignmentRounded,
  Business,
  CloseRounded,
  CorporateFareRounded,
  DescriptionRounded,
  DoNotDisturbOnRounded,
  DonutLargeRounded,
  DownloadRounded,
  ErrorRounded,
  FindInPageOutlined,
  HandshakeOutlined,
  InsertDriveFileRounded,
  LaunchRounded,
  LinkRounded,
  LocationOnRounded,
  OpenInFullRounded,
  Paid,
  PendingActionsOutlined,
  Place,
  SearchRounded,
  TimerOutlined,
  WarningRounded,
} from "@mui/icons-material";
import DashboardLayout from "../../../components/Templates/DashboardLayout";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  Divider,
  Drawer,
  Fade,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  Link,
  Snackbar,
  Stack,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { amber, blue, green, grey, lightBlue, orange, red, yellow } from "@mui/material/colors";
import { ChangeEvent, useEffect, useState } from "react";
import SimpleEmphasis from "../../../components/Molecules/Texts/SimpleEmphasis";
import { chipColorDeterminer, GetSession, interviewResultColor, onCloseSnackbar } from "../../global-helpers";
import RequestAPI from "../../../services/api/request";
import { ApplicantAssessment, ApplicantInterview, ApplicantOffer, AppliedVacancy } from "../types";
import { Link as RouterLink } from "react-router-dom";
import AutoOverflowText from "../../../components/Molecules/Texts/AutoOverflowText";
import dayjs from "dayjs";
import { HOST } from "../../administrators/performance/[id]/constants";
import { useDebounce } from "use-debounce";

export default function ApplicationStatus() {
  /* Material UI Hooks */
  const MUITheme = useTheme();
  /* breakpoints */
  const largeMedia = useMediaQuery("(min-width: 1200px)");
  const smallMedia = useMediaQuery("(max-width: 900px)");
  const xSmallMedia = useMediaQuery("(max-width: 600px)");

  /* state */
  const [displayOn, setDisplayOn] = useState<{
    detail: boolean;
    pipeline: boolean;
  }>({ detail: false, pipeline: true });
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  // data -> applied vacacies
  const [appliedVacancies, setAppliedVacancies] = useState<AppliedVacancy[]>([]);
  const [appliedVacanciesCount, setAppliedVacanciesCount] = useState<number>(0);
  const [currentOffset, setCurrentOffset] = useState<number>(1);
  const [selectedApplied, setSelectedApplied] = useState<AppliedVacancy | null>(null);
  const [appliedQuery, setAppliedQuery] = useState<string>("");
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" });
  // pipeline -> assessments
  const [applicantAssessments, setApplicantAssessments] = useState<ApplicantAssessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<ApplicantAssessment | null>(null);
  const [assessmentSubmissions, setAssessmentSubmissions] = useState<Record<string, File[]>>({});
  const [onAddFiles, setOnAddFiles] = useState<Record<string, boolean>>({});
  const [errMsg, setErrMsg] = useState<Record<string, string>>({});

  // pipeline -> interviews
  const [applicantInterviews, setApplicantInterviews] = useState<ApplicantInterview[]>([]);
  const [dataAction, setDataAction] = useState<boolean>(false);

  // pipeline -> offering
  const [applicantOffers, setApplicantOffers] = useState<ApplicantOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<ApplicantOffer & { status: "accept" | "decline" } | null>(null);

  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [refresh, setRefresh] = useState<Record<string, boolean>>({});

  /* constants */
  const [debouncedAppliedQuery] = useDebounce(appliedQuery, 1000);
  const scoredAssessments = applicantAssessments.filter(assessment => {
    let byScoredAssessments = assessment.submission_result !== null
    return byScoredAssessments;
  });
  // pipeline -> interviews
  const columns = [
    { prop: "schedule", label: "Pelaksanaan" },
    { prop: "result", label: "Hasil" },
  ];
  const responsiveColumns = smallMedia ? [
    { prop: "schedule", label: "Pelaksanaan" },
  ] : columns;
  const conductedInterviews = applicantInterviews.filter(interview => interview.status === "Conducted");
  const acceptedOffer = applicantOffers.filter(offer => offer.status === "Offer Accepted");
  const declinedOffer = applicantOffers.filter(offer => offer.status === "Offer Declined");

  /* event handler */
  const fileOnChange = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      let filteredFiles: File[] = [];
      let invalidFileSize: string[] = [];
      for (const file of files) {
        if (file.size > 5242880) {
          invalidFileSize.push(file.name);
          continue;
        };

        filteredFiles.push(file);
      };

      setAssessmentSubmissions(prev => {
        const previousFiles = (Boolean(prev[key]) && prev[key].length != 0) ? prev[key] : [];
        return {
          ...prev,
          [key]: [...previousFiles, ...filteredFiles]
        }
      });

      if (invalidFileSize.length !== 0) {
        setErrMsg(prev => ({
          ...prev,
          ["submissions"]: invalidFileSize.join(", ") + " should less than 5MB"
        }));
      } else {
        setErrMsg(prev => ({
          ...prev,
          ["submissions"]: ""
        }))
      };
    }
  }

  /* helpers */
  const coloringPipelinesStatus = (status: string): SxProps => {
    switch (status) {
      case "Applied":
        return {
          color: blue[500]
        };
      case "On Process":
        return {
          color: yellow[500]
        };
      case "Offered":
        return {
          color: orange[500]
        };
      case "Waiting for LoA":
        return {
          color: amber[500]
        };
      case "LoA Issued":
        return {
          color: green[500]
        }
      default:
        return {
          color: grey[400]
        }
    }
  }

  /* submissions */
  const addSubmissions = async (key: string) => {
    setLoading(prev => ({ ...prev, [key]: true }));

    const token = GetSession("auth");
    const formDataRequest = new FormData();
    formDataRequest.append("assessment_id", String(selectedAssessment?.assessment_id));
    formDataRequest.append("pipeline_id", selectedApplied?.pipeline_id as string)
    assessmentSubmissions[key].forEach((file) => {
      formDataRequest.append("submission_documents[]", file);
    })
    const [success, fail] = await RequestAPI.Send<{ message: string, documents_status: any }>(
      "/candidates/assessments/submissions/",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        },
        body: formDataRequest
      }
    );
    if (fail) {
      setLoading(prev => ({ ...prev, [key]: false }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(prev => ({ ...prev, [key]: false }));
      setAssessmentSubmissions(prev => ({ ...prev, [key]: [] }));
      setSelectedAssessment(null);
      setOnAddFiles(prev => ({
        ...prev,
        [key]: false,
      }));
      setDataAction(prev => !prev);
      return setAlert({ show: true, message: success.message });
    };
  };
  const deleteSubmission = async (documentID: number) => {
    setLoading(prev => ({
      ...prev,
      ["delete-submission"]: true,
    }));
    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.Send<string>(
      "/candidates/assessments/submissions/" + documentID,
      {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(prev => ({
        ...prev,
        ["delete-submission"]: false,
      }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(prev => ({
        ...prev,
        ["delete-submission"]: false,
      }));
      setDataAction(prev => !prev);
      return setAlert({ show: true, message: success });
    };
  };

  /* offer */
  const updateOffer = async (offeringID: number, status: "accept" | "decline") => {
    setLoading(prev => ({ ...prev, [status]: true }));

    const offerStatus = {
      "accept": "Offer Accepted",
      "decline": "Offer Declined"
    };

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.FormDataRequest({
      status: offerStatus[status],
      pipeline_id: selectedApplied?.pipeline_id as string
    }).Send<string>(
      "/candidates/offerings/" + offeringID,
      {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(prev => ({ ...prev, [status]: false }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setSelectedOffer(null);
      setRefresh(prev => ({ ...prev, ["offering"]: !prev["offering"] }));
      setLoading(prev => ({ ...prev, [status]: false }));
      return setAlert({ show: true, message: success });
    };
  };

  /* fetching -> assessments */
  useEffect(() => {
    if (selectedApplied === null) {
      return;
    };

    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<ApplicantAssessment[]>(
        "/candidates/pipelines/" + selectedApplied?.pipeline_id as string + "/assessments/" + selectedApplied?.vacancy.id as string,
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
        return setApplicantAssessments(data);
      }
    })();
  }, [selectedApplied, dataAction]);

  /* fetching -> applied vacancies */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<{ arr: AppliedVacancy[]; count: number; }>(
        "/candidates/pipelines/?page=" + currentOffset + "&keyword=" + debouncedAppliedQuery,
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );
      if (fail) {
        console.info("fail request data applied vacancies \t:", fail);
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        if (currentOffset > 1) {
          setAppliedVacancies(prev => {
            const newArr = prev
            return newArr.concat(data.arr);
          })
          setAppliedVacanciesCount(data.count);
        } else {
          if (appliedQuery == "") {
            setSelectedApplied(data.arr[0]);
          }
          setAppliedVacancies(data.arr);
          setAppliedVacanciesCount(data.count);
        }
      };
    })();
  }, [currentOffset, debouncedAppliedQuery]);

  /* fetching -> applicant interviews */
  useEffect(() => {
    if (!selectedApplied) {
      return;
    }
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<ApplicantInterview[]>(
        "/candidates/pipelines/" + selectedApplied?.pipeline_id as string + "/vacancies/" + selectedApplied?.vacancy.id as string + "/interviews",
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
        return setApplicantInterviews(data);
      };
    })();
  }, [refresh["applicant-interviews"], selectedApplied]);

  /* fetching -> applicants offering */
  useEffect(() => {
    if (!selectedApplied) {
      return;
    }
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<ApplicantOffer[]>(
        "/candidates/pipelines/" + selectedApplied.pipeline_id + "/vacancies/" + selectedApplied.vacancy.id + "/offering",
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
        return setApplicantOffers(data);
      };
    })();
  }, [refresh["offering"], selectedApplied]);
  return (
    <DashboardLayout isFor="candidate">
      {/* Default Notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        message={alert.message}
        autoHideDuration={3000}
        onClose={onCloseSnackbar(setAlert)}
      />
      <Grid container spacing={2}>
        <Grid item xs={100} lg={8}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 550,
              color: grey[800],
            }}
          >
            Informasi Lamaran
          </Typography>
          {/* Employer Profile */}
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
              src={`${HOST.main}${selectedApplied?.employer.profile_image_path.replace("/api/v1", "")}`}
              sx={{
                width: smallMedia ? "4em" : "5em",
                height: smallMedia ? "4em" : "5em",
              }}
            />
            <Box component={"div"}>
              <Typography
                variant={smallMedia ? "subtitle2" : "h6"}
                sx={{
                  fontWeight: 550,
                  color: grey[800],
                }}
              >
                {selectedApplied?.vacancy.position}
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
                      fontWeight: smallMedia ? 500 : 550,
                      color: grey[600],
                      marginLeft: "0.5em",
                    }}
                  >
                    {selectedApplied?.employer.legal_name}
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
                      fontWeight: smallMedia ? 500 : 550,
                      color: grey[600],
                      marginLeft: "0.5em",
                    }}
                  >
                    {selectedApplied?.employer.location}
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
                Detail Posisi Pekerjaan
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
                Tahapan Seleksi
              </Button>
            </Box>
            {!largeMedia && (
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
                Daftar Lamaran Pekerjaan
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
                Proses Seleksi Lamaran
              </Typography>
              <Box
                component={"div"}
                className="application-pipeline"
                sx={{ border: "1px solid " + grey[400], borderRadius: "0.3em" }}
              >
                <Stack sx={{ padding: smallMedia ? "0.5em" : "1em" }}>
                  {/* Screening */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      paddingBottom: "1em",
                    }}
                  >
                    {!xSmallMedia && (
                      <FindInPageOutlined sx={{ color: appliedVacancies.length == 0 ? grey[400] : applicantAssessments.length > 0 ? green[800] : orange[700] }} />
                    )}
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
                            color: appliedVacancies.length == 0 ? grey[400] : applicantAssessments.length > 0 ? green[800] : orange[700],
                            marginY: "0.2em",
                          }}
                        >
                          Proses Screening Kandidat
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            minWidth: "12em",
                            fontStyle: "italic",
                            color: appliedVacancies.length == 0 ? grey[400] : applicantAssessments.length > 0 ? green[800] : orange[700],
                            textAlign: "end",
                          }}
                        >
                          {appliedVacancies.length == 0 ? "-" : dayjs(selectedApplied?.created_at as string).format("dddd, DD MMMM YYYY")}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: applicantAssessments.length > 0 ? green[800] : grey[700] }}>
                        {appliedVacancies.length == 0 ? "" : applicantAssessments.length > 0 ? (
                          "Selamat! Anda berhasil lolos tahap screening."
                        ) : (
                          "Lamaran Anda saat ini berada pada tahap screening. Harap pastikan untuk memantau status lamaran Anda secara berkala untuk pembaruan."
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Assessments */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      paddingY: "1em",
                      borderTop: "1px solid " + grey[400],
                    }}
                  >
                    {!xSmallMedia && (
                      <TimerOutlined sx={{ color: (applicantAssessments.length !== 0 && scoredAssessments.length === applicantAssessments.length) ? green[700] : applicantAssessments.length > 0 ? orange[700] : grey[400] }} />
                    )}
                    <Box sx={{ flexGrow: 1, paddingX: "0.5em" }}>
                      <Box
                        component={"div"}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingTop: "0.2em",
                          paddingBottom: "0.5em"
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 550,
                            color: (applicantAssessments.length !== 0 && scoredAssessments.length === applicantAssessments.length) ? green[700] : applicantAssessments.length > 0 ? orange[700] : grey[400],
                          }}
                        >
                          Proses Assessment
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            minWidth: "12em",
                            fontStyle: "italic",
                            color: (applicantAssessments.length !== 0 && scoredAssessments.length === applicantAssessments.length) ? green[700] : applicantAssessments.length > 0 ? orange[700] : grey[400],
                            textAlign: "end",
                          }}
                        >
                          {appliedVacancies.length == 0 ? "-" : (applicantAssessments.length !== 0 && scoredAssessments.length === applicantAssessments.length) ?
                            "Penugasan selesai" :
                            scoredAssessments.length > 0 ?
                              "" + scoredAssessments.length + " dari " + applicantAssessments.length + "telah diselesaikan" :
                              applicantAssessments.length === 0 ? "Menunggu untuk penugasan" :
                                "Dalam proses pengerjaan penugasan"}
                        </Typography>
                      </Box>
                      <Box component={"div"} className="assessments-container">
                        {applicantAssessments.map((assessment, index) => {
                          const assessmentKey = `assessment${index}`;
                          const isLinkExist = assessment.assessment_link === "" || assessment.assessment_link === null ? false : true;
                          const isDeadline = (new Date(assessment.due_date).getTime() - new Date().getTime()) < 0 ? true : false;
                          return (
                            <Box key={index} component={"div"} className="assessment-item"
                              sx={{
                                border: "1px solid " + grey[300],
                                borderRadius: "0.3em",
                                marginBottom: "0.7em",
                                padding: "0.5em 0.7em"
                              }}
                            >
                              {/* Name */}
                              <Box component={"div"}
                                sx={{
                                  display: { xs: "block", sm: "flex" },
                                  alignItems: "start",
                                  columnGap: 1,
                                  marginBottom: "0.5em",
                                }}
                              >
                                <Box component={"div"}
                                  sx={{ flexGrow: 1 }}
                                >
                                  <Typography component={"p"} variant="subtitle1"
                                    sx={{ flexGrow: 1, fontWeight: 550, color: grey[700] }}
                                  >
                                    {assessment.name}
                                  </Typography>
                                </Box>
                                <Box component={"div"}
                                  sx={{
                                    display: "flex",
                                    columnGap: 1
                                  }}
                                >
                                  <Typography
                                    component={"p"}
                                    variant="caption"
                                    sx={{
                                      width: "max-content",
                                      padding: "0.3em 0.8em",
                                      borderRadius: "2em",
                                      color: assessment.submission_result ? green[500] : amber[700],
                                      fontStyle: "italic",
                                      backgroundColor: assessment.submission_result ? green[50] : amber[50],
                                    }}
                                  >
                                    {assessment.submission_result ? (
                                      "Penugasan anda telah dinilai"
                                    ) : (
                                      <>
                                        Batas pengerjaan pada{" "}
                                        <SimpleEmphasis
                                          text={new Date(assessment.due_date).toDateString()}
                                          textColor={amber[700]}
                                          sx={{ fontStyle: "italic" }}
                                        />
                                      </>
                                    )}
                                  </Typography>
                                </Box>
                              </Box>
                              {/* Note */}
                              <Box component={"div"}
                                sx={{
                                  marginBottom: "0.5em",
                                  display: "flex",
                                  columnGap: 1,
                                }}
                              >
                                <DescriptionRounded
                                  fontSize="small"
                                  sx={{ color: "#06816d" }}
                                />
                                <Box component={"div"} sx={{ marginTop: "0.2em" }}>
                                  <Typography
                                    component={"p"}
                                    variant="caption"
                                    sx={{ fontWeight: 550, color: grey[700], marginBottom: "0.5em" }}
                                  >
                                    Catatan Penugasan
                                  </Typography>
                                  {/* <Typography
                                    component={"p"}
                                    variant="caption"
                                    sx={{ color: grey[600], whiteSpace: "pre-line" }}
                                  // noWrap={!seeMoreNote[index]}
                                  >
                                    {assessment.note}
                                  </Typography> */}
                                  <AutoOverflowText text={assessment.note} variant="caption" />
                                </Box>
                              </Box>
                              {/* Assessment Link */}
                              <Box component={"div"}
                                sx={{
                                  marginBottom: "0.5em",
                                  display: "flex",
                                  columnGap: 1,
                                }}
                              >
                                <LinkRounded
                                  fontSize="small"
                                  sx={{ color: "#06816d" }}
                                />
                                <Box component={"div"}>
                                  <Typography
                                    component={"div"}
                                    variant="caption"
                                    sx={{ fontWeight: 550, color: grey[700], marginBottom: "0.5em" }}
                                  >
                                    Tautan Penugasan
                                  </Typography>
                                  <Typography
                                    component={isLinkExist ? "a" : "p"}
                                    target={isLinkExist ? "_blank" : undefined}
                                    href={isLinkExist ? assessment.assessment_link : undefined}
                                    variant="caption"
                                    sx={{
                                      color: isLinkExist ? grey[600] : amber[600],
                                      ":hover": { color: isLinkExist ? blue[500] : amber[600] },
                                    }}
                                  >
                                    {isLinkExist ? assessment.assessment_link : "tidak ada tautan yang dilampirkan"}
                                  </Typography>
                                </Box>
                              </Box>
                              {/* Assessment Documents */}
                              <Box component={"div"}
                                sx={{
                                  marginBottom: "0.5em",
                                  display: "flex",
                                  columnGap: 1,
                                }}
                              >
                                <InsertDriveFileRounded
                                  fontSize="small"
                                  sx={{ color: "#06816d" }}
                                />
                                <Box component={"div"}>
                                  <Typography
                                    component={"p"}
                                    variant="caption"
                                    sx={{ fontWeight: 550, color: grey[700], marginBottom: "0.5em" }}
                                  >
                                    Dokumen Penugasan
                                  </Typography>
                                  <Box
                                    component={"div"}
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      columnGap: "0.5em",
                                      rowGap: "0.3em",
                                    }}
                                  >
                                    {assessment.assessment_documents.map((document, index) => {
                                      const fileURL = document.name.includes(".pdf") ? (document.assessment_document_path) : (document.assessment_document_path + "/download");
                                      return (
                                        <Box
                                          key={index}
                                          component={"div"}
                                          sx={{
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
                                            component={RouterLink}
                                            to={HOST.main + fileURL.replace("/api/v1", "")}
                                            target="_blank"
                                            variant="caption"
                                            sx={{ color: grey[600], textDecoration: "none" }}
                                          >
                                            {document.name}
                                          </Typography>
                                        </Box>
                                      )
                                    })}
                                  </Box>
                                </Box>
                              </Box>
                              {/* Submissions */}
                              <Box component={"div"}
                                sx={{
                                  display: "flex",
                                  columnGap: 1
                                }}
                              >
                                <AssignmentRounded
                                  fontSize="small"
                                  sx={{ color: "#06816d" }}
                                />
                                <Box component={"div"}>
                                  <Typography
                                    component={"p"}
                                    variant="caption"
                                    sx={{ fontWeight: 550, color: grey[700], marginBottom: "0.5em" }}
                                  >
                                    Pengumpulan Penugasan
                                  </Typography>
                                  {(assessment.assessment_submissions.length === 0 && !onAddFiles[assessmentKey]) && (
                                    <Box component={"div"} sx={{ display: "flex", alignItems: "center", columnGap: 1 }}>
                                      <ErrorRounded fontSize="small" sx={{ color: amber[700] }} />
                                      <Typography component={"p"} variant="caption" sx={{ color: amber[700], marginTop: "0.3em" }}>
                                        Anda belum mengumpulkan penugasan
                                      </Typography>
                                    </Box>
                                  )}
                                  <Box component={"div"}
                                    sx={{
                                      marginBottom: "0.3em",
                                      display: "flex",
                                      flexWrap: "wrap",
                                      columnGap: 1,
                                      rowGap: 1,
                                    }}
                                  >
                                    {/* Existing Submissions */}
                                    {assessment.assessment_submissions.map((file, index) => {
                                      const fileURL = file.name.includes(".pdf") ? (file.submission_document_path.replace("/api/v1", "")) : (file.submission_document_path.replace("/api/v1", "") + "/download");
                                      return (
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
                                              component={RouterLink}
                                              to={HOST.main + fileURL.replace("/api/v1", "")}
                                              target="_blank"
                                              variant="caption"
                                              sx={{ color: grey[600], textDecoration: "none" }}
                                            >
                                              {file.name}
                                            </Typography>
                                            {onAddFiles[assessmentKey] && (
                                              <IconButton size="small" sx={{ padding: "0.1em 0em" }}
                                                disabled={loading["delete-submission"]}
                                                onClick={() => {
                                                  // DELETE API
                                                  deleteSubmission(file.id);
                                                }}
                                              >
                                                {loading["delete-submission"] ? (
                                                  <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                  <CloseRounded fontSize="small" />
                                                )}
                                              </IconButton>
                                            )}
                                          </Box>
                                        </Box>
                                      )
                                    })}
                                    {/* New Submissions */}
                                    {onAddFiles[assessmentKey] && assessmentSubmissions[assessmentKey] && assessmentSubmissions[assessmentKey].map((file, index) => {
                                      return (
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
                                                setAssessmentSubmissions(prev => {
                                                  prev[assessmentKey].splice(index, 1);
                                                  return {
                                                    ...prev,
                                                  }
                                                })
                                              }}
                                            >
                                              <CloseRounded fontSize="small" />
                                            </IconButton>
                                          </Box>
                                        </Box>
                                      )
                                    })}
                                    {/* Add Files Button */}
                                    {onAddFiles[assessmentKey] && (
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
                                          htmlFor="assessment_document"
                                          size="small"
                                        >
                                          <AddRounded fontSize="small" sx={{ color: grey[600] }} />
                                          <InputBase
                                            id="assessment_document"
                                            type="file"
                                            name="assessment_document"
                                            inputProps={{ multiple: true }}
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
                                            onChange={fileOnChange(assessmentKey)}
                                          />
                                        </IconButton>
                                      </Box>
                                    )}
                                  </Box>
                                  {onAddFiles[assessmentKey] && (
                                    <FormHelperText sx={{ color: errMsg["submissions"] ? "red" : undefined }}>
                                      {errMsg["submissions"] && errMsg["submissions"] !== "" ? errMsg["submissions"] : "Select your submission files"}
                                    </FormHelperText>
                                  )}
                                </Box>
                              </Box>
                              <Box component={"div"}
                                sx={{
                                  marginY: "0.5em",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: assessment.submission_result ? "space-between" : "end",
                                }}
                              >
                                {assessment.submission_result && (
                                  <Box component={"div"}
                                    sx={{
                                      marginLeft: "1.7em",
                                      padding: "0.2em 0.5em",
                                      borderRadius: "1em",
                                      backgroundColor: blue[50]
                                    }}
                                  >
                                    <Typography component={"p"} variant="subtitle2" sx={{ fontWeight: 550, color: blue[500] }}>
                                      {assessment.submission_result}/100
                                    </Typography>
                                  </Box>
                                )}
                                {onAddFiles[assessmentKey] && (
                                  <Box component={"div"}
                                    sx={{ display: "flex", columnGap: 1 }}
                                  >
                                    <Button
                                      variant="text"
                                      color="error"
                                      size="small"
                                      onClick={() => {
                                        setSelectedAssessment(null);
                                        setOnAddFiles(prev => ({
                                          ...prev,
                                          [assessmentKey]: false,
                                        }));
                                      }}
                                    >
                                      Batal
                                    </Button>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled={loading[assessmentKey]}
                                      startIcon={loading[assessmentKey] && (<CircularProgress size={20} />)}
                                      onClick={() => {
                                        if (assessmentSubmissions[assessmentKey].length === 0) {
                                          return;
                                        }
                                        addSubmissions(assessmentKey);
                                      }}
                                    >
                                      Submit
                                    </Button>
                                  </Box>
                                )}
                                {!onAddFiles[assessmentKey] && (
                                  <Button
                                    variant="contained"
                                    size="small"
                                    disabled={isDeadline || assessment.submission_result !== null}
                                    onClick={() => {
                                      setSelectedAssessment(assessment);
                                      setOnAddFiles(prev => ({
                                        ...prev,
                                        [assessmentKey]: true,
                                      }))
                                    }}
                                  >
                                    {assessment.assessment_submissions.length > 0 ? "Ubah pengumpulan" : "Tambah pengumpulan"}
                                  </Button>
                                )}
                              </Box>
                            </Box>
                          )
                        })}
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
                    <PendingActionsOutlined sx={{
                      color: applicantInterviews.length === 0 ? grey[400] :
                        (conductedInterviews.length === applicantInterviews.length) ? green[700] : amber[700]
                    }} />
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
                            color: applicantInterviews.length === 0 ? grey[400] :
                              (conductedInterviews.length === applicantInterviews.length) ? green[700] : amber[700],
                            marginY: "0.2em",
                          }}
                        >
                          Jadwal Interview
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            minWidth: "12em",
                            fontStyle: "italic",
                            color: applicantInterviews.length === 0 ? grey[400] :
                              (conductedInterviews.length === applicantInterviews.length) ? green[700] : amber[700],
                            textAlign: "end",
                          }}
                        >
                          {appliedVacancies.length == 0 ? "-" : applicantInterviews.length === 0 ? "Menunggu Penjadwalan Interview" :
                            (conductedInterviews.length === applicantInterviews.length) ? "Semua proses interview telah dilaksanakan" :
                              `${conductedInterviews.length} dari ${applicantInterviews.length} interview telah dilaksanakan`}
                        </Typography>
                      </Box>
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
                                <TableCell key={index} size="small">
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
                            {applicantInterviews.map((interview, dataIndex) => (
                              <TableRow key={dataIndex}>
                                {responsiveColumns.map((column, index) => {
                                  switch (column.prop) {
                                    case "result":
                                      return (
                                        <TableCell key={index}
                                          size="small"
                                          sx={{
                                            width: "20%",
                                          }}
                                        >
                                          <Typography component={"p"} variant="subtitle2"
                                            sx={{ ...interviewResultColor(interview.result as string) }}
                                          >
                                            {interview.result}
                                          </Typography>
                                        </TableCell>
                                      );
                                    case "schedule":
                                      return (
                                        <TableCell key={index}
                                          size="small"
                                          sx={{
                                            width: "80%",
                                          }}
                                        >
                                          <Typography component={"p"} variant="caption">
                                            <SimpleEmphasis text={interview.location} textColor={grey[700]} />
                                            <br />
                                            <SimpleEmphasis
                                              text={dayjs(interview.date).format("ddd MMM DD, YYYY - HH:mm")}
                                            // textColor={grey[600]}
                                            />
                                          </Typography>
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
                                                color: blue[500],
                                                textDecoration: "underline",
                                              }}
                                            >
                                              Tautan interview disini
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
                                              label={interview.status}
                                              size="small"
                                              sx={chipColorDeterminer(interview.status)}
                                            />
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
                                              interview[
                                              column.prop as keyof ApplicantInterview
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
                    </Box>
                  </Box>
                  {/* Offerings */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      paddingY: "1em",
                      borderTop: "1px solid " + grey[400],
                      // cursor: "not-allowed",
                      userSelect: "none",
                    }}
                  >
                    <HandshakeOutlined sx={{ color: acceptedOffer.length > 0 || declinedOffer.length > 0 ? green[700] : applicantOffers.length > 0 ? amber[700] : grey[400] }} />
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
                            color: acceptedOffer.length > 0 || declinedOffer.length > 0 ? green[700] : applicantOffers.length > 0 ? amber[700] : grey[400],
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
                            color: acceptedOffer.length > 0 ? green[700] : declinedOffer.length > 0 ? red[500] : applicantOffers.length > 0 ? amber[700] : grey[400],
                            textAlign: "end",
                          }}
                        >
                          {appliedVacancies.length == 0 ? "-" : acceptedOffer.length > 0 ? "Penawaran Diterima" :
                            declinedOffer.length > 0 ? "Penawaran Ditolak" :
                              applicantOffers.length > 0 ? "Menunggu Konfirmasi" :
                                "Menunggu Penawaran Pekerjaan"
                          }
                        </Typography>
                      </Box>
                      {applicantOffers.map((offer, index) => {
                        const isExpired = dayjs().isAfter(dayjs(offer.end_on));
                        return (
                          <Box
                            key={index}
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
                                // justifyContent: smallMedia ? "space-between" : undefined,
                                justifyContent: "space-between",
                                paddingTop: "0.5em",
                                paddingX: "1em",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 550, color: grey[700] }}
                              >
                                {selectedApplied?.vacancy.position}
                              </Typography>
                              <Chip
                                icon={<DonutLargeRounded />}
                                label={offer.status}
                                size="small"
                                sx={{
                                  color: acceptedOffer.length > 0 ? green[500] : declinedOffer.length > 0 ? red[500] : lightBlue[500],
                                  bgcolor: acceptedOffer.length > 0 ? green[50] : declinedOffer.length > 0 ? red[50] : lightBlue[50],
                                  "& .MuiChip-icon": {
                                    color: acceptedOffer.length > 0 ? green[500] : declinedOffer.length > 0 ? red[500] : lightBlue[500],
                                  },
                                }}
                              />
                            </Box>
                            <Box
                              component={"div"}
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: smallMedia ? undefined : "1em",
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
                                  {selectedApplied?.employer.legal_name}
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
                                  {selectedApplied?.employer.location}
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
                                display: smallMedia ? undefined : "flex",
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
                                Penawaran berakhir pada :{" "}
                                <SimpleEmphasis text={offer.loa_document_path ? "-" : dayjs(offer.end_on).format("dddd MMM DD, YYYY")} textColor={isExpired ? "red" : undefined} />
                                <br />
                                {isExpired && offer.status === "Pending Acceptance" && (
                                  <span
                                    style={{
                                      color: red[500]
                                    }}
                                  >
                                    Tawaran telah berakhir
                                  </span>
                                )}
                                {offer.status === "Offer Accepted" && offer.loa_document_path == null && (
                                  <span style={{ color: lightBlue[500] }}>
                                    Silakan tunggu Letter of Acceptance (LoA) dan periksa secara berkala untuk pembaruan.
                                  </span>
                                )}
                                {offer.loa_document_path && (
                                  <span style={{ color: "#06816d" }}>
                                    Letter of Acceptance (LoA) telah diterbitkan. Silakan periksa dan unduh dokumen di bawah ini.
                                  </span>
                                )}
                              </Typography>
                              <Box
                                component={"div"}
                                sx={{
                                  display: smallMedia ? "flex" : undefined,
                                  marginTop: "0.5em",
                                }}
                              >
                                {!isExpired && offer.status === "Pending Acceptance" && (
                                  <Box component={"div"}
                                    sx={{
                                      display: "flex",
                                      columnGap: 1.5
                                    }}
                                  >
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      fullWidth={smallMedia}
                                      onClick={() => {
                                        setSelectedOffer({ ...offer, status: "decline" });
                                      }}
                                    >
                                      Tolak
                                    </Button>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      fullWidth={smallMedia}
                                      onClick={() => {
                                        setSelectedOffer({ ...offer, status: "accept" });
                                      }}
                                    >
                                      Terima
                                    </Button>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                            {offer.status === "Offer Accepted" && offer.loa_document_path !== null && (
                              <Box component={"div"}
                                sx={{
                                  marginY: "0.5em",
                                  display: "flex",
                                  justifyContent: "end",
                                  paddingRight: "1em",
                                  columnGap: 1.5
                                }}
                              >
                                <Button
                                  component={RouterLink}
                                  to={`${HOST.main}${offer.loa_document_path.replace("/api/v1", "")}`}
                                  target="_blank"
                                  variant="text"
                                  size="small"
                                  startIcon={<LaunchRounded fontSize="small" />}
                                  sx={{
                                    minWidth: "8em"
                                  }}
                                >
                                  Lihat
                                </Button>
                                <Button
                                  component={RouterLink}
                                  to={`${HOST.main}${offer.loa_document_path.replace("/api/v1", "")}/download`}
                                  target="_blank"
                                  variant="contained"
                                  size="small"
                                  startIcon={<DownloadRounded fontSize="small" />}
                                  sx={{
                                    minWidth: "8em"
                                  }}
                                >
                                  Unduh
                                </Button>
                              </Box>
                            )}
                          </Box>
                        )
                      })}
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Fade>
          {/* Detail */}
          <Fade in={displayOn.detail} mountOnEnter unmountOnExit>
            {appliedVacancies.length == 0 ? <span></span> : (
              <Stack direction={"column"} spacing={2} sx={{ marginY: "0.5em" }}>
                {/* decription */}
                <Box component={"div"}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 550, color: grey[700], marginBottom: "0.3em" }}
                  >
                    Deskripsi Pekerjaan
                  </Typography>
                  <Typography variant="body1" sx={{ color: grey[600], whiteSpace: "pre-line" }}>
                    {selectedApplied?.vacancy.description}
                  </Typography>
                </Box>
                {/* qualification */}
                <Box component={"div"}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 550, color: grey[700], marginBottom: "0.3em" }}
                  >
                    Kualifikasi
                  </Typography>
                  <Typography variant="body1" sx={{ color: grey[600], whiteSpace: "pre-line" }}>
                    {selectedApplied?.vacancy.qualification}
                  </Typography>
                </Box>
                {/* responsibility */}
                <Box component={"div"}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 550, color: grey[700], marginBottom: "0.3em" }}
                  >
                    Tugas dan Tanggung Jawab
                  </Typography>
                  <Typography variant="body1" sx={{ color: grey[600], whiteSpace: "pre-line" }}>
                    {selectedApplied?.vacancy.responsibility}
                  </Typography>
                </Box>
              </Stack>
            )}
          </Fade>
        </Grid>
        <Grid item lg={4}>
          {/* Applied Vacancies */}
          <Collapse
            in={largeMedia}
            mountOnEnter
            unmountOnExit
            sx={{
              position: "sticky",
              top: (MUITheme.mixins.toolbar.minHeight as number) + 8,
            }}
          >
            <Box component={"div"}>
              <Box component={"div"}
                sx={{ marginBottom: "0.5em" }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 550,
                    color: grey[800],
                    marginBottom: "0.3em"
                  }}
                >
                  Daftar Lamaran Pekerjaan
                </Typography>
                <TextField
                  type="text"
                  name="search" // search for applicant
                  placeholder="Cari posisi pekerjaan"
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
                      minWidth: {
                        md: "20em",
                      },
                    },
                  }}
                  value={appliedQuery}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setCurrentOffset(1);
                    setAppliedQuery(event.target.value);
                  }}
                />
              </Box>
              <Box
                sx={{
                  height: "87vh",
                  overflowY: "scroll",
                  borderRadius: "0.5em",
                  "&::-webkit-scrollbar": {
                    // width: "0em",
                    width: "0.5em",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: grey[400],
                    borderRadius: "0.15em",
                  },
                }}
              >
                {appliedVacancies.length == 0 && (
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
                      Saat ini Anda belum mengirimkan lamaran ke lowongan mana pun.
                    </Typography>
                  </Box>
                )}
                {appliedVacancies.map((applied, index) => {
                  const lastUpdated = new Date(applied.updated_at).toDateString();
                  return (
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
                          src={`${HOST.main}${applied.employer.profile_image_path.replace("/api/v1", "")}`}
                          sx={{
                            width: "2.5em",
                            height: "2.5em",
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
                            {applied.vacancy.position}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 550, color: "#045a55" }}
                          >
                            {applied.employer.name}
                          </Typography>
                          {applied.vacancy.is_inactive && (
                            <Box component={"div"} sx={{ display: "flex", alignItems: "center", columnGap: "0.3em" }}>
                              <WarningRounded fontSize="small" sx={{ marginTop: "-0.2em", fontSize: "small", color: "red" }} />
                              <Typography component={"p"} variant="caption" sx={{ color: "red" }}>
                                sudah tidak aktif
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Box component={"div"}>
                          <Typography component={"p"} variant="caption"
                            sx={{ ...coloringPipelinesStatus(applied.status) }}
                          >
                            {applied.status}
                          </Typography>
                          {/* <Chip
                            label={applied.status}
                            size="small"
                            sx={{ backgroundColor: "#ffcc80", fontSize: "small" }}
                          /> */}
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
                            {applied.employer.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex" }}>
                          <Paid fontSize="small" sx={{ color: grey[600] }} />
                          <Typography
                            variant="subtitle2"
                            sx={{ marginLeft: "0.5em" }}
                          >
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(applied.vacancy.salary)}
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
                              alignItems: "start",
                            }}
                          >
                            <AccessTime
                              fontSize="small"
                              sx={{ color: grey[500] }}
                            />
                            <Box sx={{ paddingTop: "0.2em" }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: "block",
                                  marginLeft: "0.5em",
                                  fontStyle: "italic",
                                  color: grey[500],
                                }}
                              >
                                {"Terakhir diperbarui,"}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  marginLeft: "0.5em",
                                  fontStyle: "italic",
                                  color: grey[500],
                                }}
                              >
                                {dayjs(lastUpdated).format("dddd, DD MMM YYYY")}
                              </Typography>
                            </Box>
                          </Box>
                          <Button variant="contained" size="small" sx={{ minWidth: "8em" }}
                            onClick={() => {
                              setSelectedApplied(applied);
                            }}
                          >
                            Detail
                          </Button>
                        </Box>
                      </Stack>
                    </Box>
                  )
                })}
                {appliedVacanciesCount > (appliedVacancies.length) && (
                  <Box component={"div"}>
                    <Typography
                      component={"p"}
                      align="center"
                      fontStyle={"italic"}
                      fontWeight={500}
                      variant="body2"
                      sx={{
                        color: blue[800],
                        cursor: "pointer",
                        '&:hover': {
                          textDecoration: "underline",
                        }
                      }}
                      onClick={() => {
                        setCurrentOffset(prev => prev + 1);
                      }}
                    >
                      Tampilkan lebih banyak
                      {/* <CircularProgress size={15} /> */}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Collapse>
        </Grid>
      </Grid >
      {/* Offer Acceptance Dialog */}
      <Dialog
        open={Boolean(selectedOffer)}
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
          <SimpleEmphasis
            text={selectedOffer?.status === "accept" ? "Accept " : selectedOffer?.status === "decline" ? "Decline " : ""}
            textColor={selectedOffer?.status === "decline" ? "red" : undefined}
          /> Offer
        </Typography>
        <Typography component={"p"} variant="subtitle2"
          sx={{
            marginTop: "0.3em",
            color: grey[600]
          }}
        >
          {selectedOffer?.status === "accept" ?
            (
              `Are you sure you want to accept ${selectedApplied?.vacancy.position} offer?`
            ) : (
              `Are you sure you want to decline ${selectedApplied?.vacancy.position} offer?`
            )
          }
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
              setSelectedOffer(null);
            }}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={loading[selectedOffer?.status as string]}
            startIcon={loading[selectedOffer?.status as string] && (<CircularProgress size={20} color="inherit" />)}
            sx={{
              minWidth: "8em"
            }}
            onClick={() => {
              updateOffer(selectedOffer?.id as number, selectedOffer?.status as "accept" | "decline");
            }}
          >
            CONTINUE
          </Button>
        </Box>
      </Dialog>
      {/* Applied List Drawer */}
      <Drawer
        open={openDrawer}
        anchor="bottom"
        onClose={() => setOpenDrawer(false)
        }
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
          <TextField
            type="text"
            name="search" // search for applicant
            placeholder="Search ..."
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
                minWidth: {
                  md: "20em",
                },
              },
            }}
            sx={{
              paddingRight: "0.5em",
            }}
            value={appliedQuery}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setCurrentOffset(1);
              setAppliedQuery(event.target.value);
            }}
          />
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
            {appliedVacancies.map((applied, index) => (
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
                    src={`${HOST.main}${applied.employer.profile_image_path}`}
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
                      {applied.vacancy.position}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 550, color: "#045a55" }}
                    >
                      {applied.employer.name}
                    </Typography>
                    {applied.vacancy.is_inactive && (
                      <Box component={"div"} sx={{ display: "flex", alignItems: "center", columnGap: "0.3em" }}>
                        <WarningRounded fontSize="small" sx={{ marginTop: "-0.2em", fontSize: "small", color: "red" }} />
                        <Typography component={"p"} variant="caption" sx={{ color: "red" }}>
                          no longer active
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box>
                    <Chip
                      label={applied.status}
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
                      {applied.employer.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    <Paid fontSize="small" sx={{ color: grey[600] }} />
                    <Typography
                      variant="subtitle2"
                      sx={{ marginLeft: "0.5em" }}
                    >
                      {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(applied.vacancy.salary)}
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
                        {"Last updated, " + new Date(applied.updated_at).toDateString()}
                      </Typography>
                    </Box>
                    <Button variant="contained" sx={{ minWidth: "8em" }} onClick={() => {
                      setSelectedApplied(applied);
                      setOpenDrawer(false);
                    }}>
                      Detail
                    </Button>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>
    </DashboardLayout >
  );
}
