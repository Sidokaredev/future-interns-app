import { Autocomplete, Avatar, Box, Button, Chip, CircularProgress, Collapse, Dialog, Divider, Drawer, IconButton, InputAdornment, ListItemIcon, ListItemText, Menu, MenuItem, Pagination, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { amber, blue, grey } from "@mui/material/colors";
import SimpleEmphasis from "../../../../Molecules/Texts/SimpleEmphasis";
import { AddRounded, AssignmentIndRounded, CloseRounded, DeleteRounded, DescriptionRounded, DoNotDisturbOnRounded, DonutLargeRounded, DownloadRounded, EastRounded, EditRounded, ErrorRounded, ExpandLessRounded, ExpandMoreRounded, HourglassBottomRounded, InsertDriveFileRounded, LaunchRounded, LinkRounded, MoreVert, RateReviewRounded, SearchRounded, Visibility } from "@mui/icons-material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { UnassignedApplicant, AssessmentFormSchema, AssessmentFormType, AssessmentType, AssignedApplicant, AssessmentApplicant, AssessmentAssigneeType } from "../../../../../pages/employers/types";
import { GetSession } from "../../../../../pages/global-helpers";
import RequestAPI from "../../../../../services/api/request";
import { Link as RouterLink, useParams } from "react-router-dom";
import AssessmentForm from "./AssessmentForm";
import { DEFAULT_ASSESSMENT_FORM } from "../../../../../pages/employers/constants";
import AutoOverflowText from "../../../../Molecules/Texts/AutoOverflowText";
import { HOST } from "../../../../../pages/administrators/performance/[id]/constants";

export default function AssessmentStage({
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
  /* state */
  const [unassignedApplicants, setUnassignedApplicants] = useState<UnassignedApplicant[]>([]);
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  // state -> assessment
  const [assessments, setAssessments] = useState<AssessmentType[]>([]);
  const [pageAssessments, setPageAssessments] = useState<number>(1);
  const [assessmentForm, setAssessmentForm] = useState<AssessmentFormType>(DEFAULT_ASSESSMENT_FORM);
  const [currentAssessment, setCurrentAssessment] = useState<{ id: number, name: string }>({ id: 0, name: "" });
  const [viewAssessmentSubmissions, setViewAssessmentSubmissions] = useState<AssessmentAssigneeType[]>([]);
  const [submissionsCollapse, setSubmissionsCollapse] = useState<Record<string, boolean>>({});
  // state -> new assignees
  const [assessmentAssigneesOption, setAssessmentAssigneesOption] = useState<AssessmentApplicant[]>([]);
  const [assignees, setAssignees] = useState<{ pipeline_id: string, assessment_id: number, name: string }[]>([]);
  const [onAddNewAssignees, setOnAddNewAssignees] = useState<boolean>(false);
  // state -> current assignees
  const [currentAssignees, setCurrentAssignees] = useState<AssignedApplicant[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<{ assessment_id: number, pipeline_id: string, fullname?: string }>({ assessment_id: 0, pipeline_id: "" });
  const [currentAssigneesQuery, setCurrentAssigneesQuery] = useState<string>("");
  const [pageCurrentAssignees, setPageCurrentAssignees] = useState<number>(1);
  const [submissionScore, setSubmissionScore] = useState<number>(0);
  // state -> data operations
  const [errMsg, setErrMsg] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [autocompleteOpen, setAutocompleteOpen] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [dataAction, setDataAction] = useState<boolean>(false);
  const [onEdit, setOnEdit] = useState<boolean>(false);

  /* constants */
  // data -> assessments
  const searchedAssessments = assessments.filter(assessment => assessment.name.toLowerCase().includes(searchApplicant.toLowerCase()));
  const paginatedAssessments = searchedAssessments.slice((pageAssessments * 5) - 5, pageAssessments * 5);
  const totalPagesAssessments = Math.ceil(searchedAssessments.length / 5);
  // data -> current asignees
  const searchedCurrentAssignees = currentAssignees.filter((assignee) => {
    const byName = assignee.candidate.user.fullname.toLowerCase().includes(currentAssigneesQuery.toLowerCase());
    const byEmail = assignee.candidate.user.email.toLowerCase().includes(currentAssigneesQuery.toLowerCase());

    return byName || byEmail;
  });
  const paginatedCurrentAssignees = searchedCurrentAssignees.slice((pageCurrentAssignees * 5) - 5, pageCurrentAssignees * 5);
  const totalCurrentAssigneesPage = Math.ceil(searchedCurrentAssignees.length / 5);

  /* helpers */
  // assessmentForm -> file assessment documents
  const filesOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    // NEXT TIME SHOULD MAKE THIS DOCUMENT LIMIT 3
    const files = event.target.files;
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

      setAssessmentForm(prev => ({
        ...prev,
        assessment_documents: [...prev.assessment_documents, ...filteredFiles],
      }));
      if (invalidFileSize.length !== 0) {
        setErrMsg(prev => ({
          ...prev,
          ["assessment_documents"]: [invalidFileSize.join(", ") + " should less than 5MB"]
        }));
      } else {
        setErrMsg(prev => ({
          ...prev,
          ["assessment_documents"]: [""]
        }))
      };
    };
  };
  // assessment form -> on submit
  const assessmentOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(prev => ({
      ...prev,
      ["assessment"]: true,
    }));

    const validate = AssessmentFormSchema.safeParse({ ...assessmentForm, vacancy_id: vacancyID })
    if (!validate.success) {
      setLoading(prev => ({
        ...prev,
        ["assessment"]: false,
      }));
      const errSchema = validate.error.flatten().fieldErrors;
      return setErrMsg(errSchema);
    } else {
      setErrMsg({});
    };

    const assessmentFormDataBody = new FormData();
    Object.entries(validate.data).forEach(([key, value]) => {
      if (key === "assessment_documents") {
        const files = value as File[];
        files.forEach((file) => {
          assessmentFormDataBody.append(key, file);
        });
      };
      assessmentFormDataBody.append(key, value as string);
    });

    const token = GetSession("auth");
    const endpoint = onEdit ? "/api/v1/employers/assessments/" + currentAssessment.id : "/api/v1/employers/assessments/";
    const [success, fail] = await RequestAPI.Send<{ message: string, documents_status: Record<string, string> }>(
      endpoint,
      {
        method: onEdit ? "PATCH" : "POST",
        headers: {
          "Authorization": "Bearer " + token,
        },
        body: assessmentFormDataBody,
      }
    );
    if (fail) {
      setLoading(prev => ({
        ...prev,
        ["assessment"]: false,
      }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(prev => ({
        ...prev,
        ["assessment"]: false,
      }));
      setOpenDrawer(false);
      setDataAction(prev => !prev);
      return setAlert({ show: true, message: success.message });
    };
  };
  // assessment -> delete
  const deleteAsessment = async () => {
    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.Send<string>(
      "/api/v1/employers/assessments/" + currentAssessment.id,
      {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      console.info("fail request delete assessment \t:", fail);
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setDataAction(prev => !prev);
      setOpenDialog(prev => ({ ...prev, ["delete-assessment"]: false }));
      setAnchorEl(null);
      return setAlert({ show: true, message: success });
    };
  }
  // assignees -> new assignees
  const addNewAssignees = async () => {
    setLoading(prev => ({
      ...prev,
      ["add-assignees"]: true,
    }))
    const token = GetSession("auth");

    const [success, fail] = await RequestAPI.JSONRequest(assignees).Send<string>(
      "/api/v1/employers/assessments/assignees/",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(prev => ({
        ...prev,
        ["add-assignees"]: false,
      }))
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(prev => ({
        ...prev,
        ["add-assignees"]: false,
      }))
      setAssignees([]);
      setOnAddNewAssignees(false);
      setOpenDialog(prev => ({ ...prev, ["assign-assessment"]: false }));
      setDataAction(prev => !prev);
      return setAlert({ show: true, message: success });
    };
  };
  // assignee -> delete assignee
  const deleteAssignee = async () => {
    setLoading(prev => ({
      ...prev,
      ["delete-assignee"]: true,
    }))
    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.Send<string>(
      "/api/v1/employers/assessments/assignees/" + selectedAssignee.assessment_id + "/" + selectedAssignee.pipeline_id,
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
        ["delete-assignee"]: false,
      }))
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(prev => ({
        ...prev,
        ["delete-assignee"]: false,
      }))
      setOpenDialog(prev => ({ ...prev, ["assign-assessment"]: false, ["delete-assignee"]: false }));
      setDataAction(prev => !prev);
      return setAlert({ show: true, message: success });
    };
  };
  // submissions -> score
  const scoreSubmission = async () => {
    setLoading(prev => ({ ...prev, ["score-submission"]: true }));
    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.JSONRequest({
      assessment_id: selectedAssignee.assessment_id,
      pipeline_id: selectedAssignee.pipeline_id,
      submission_status: "scored",
      submission_result: String(submissionScore)
    }).Send<string>(
      "/api/v1/employers/assessments/assignees/",
      {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(prev => ({ ...prev, ["score-submission"]: false }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(prev => ({ ...prev, ["score-submission"]: false }));
      setDataAction(prev => !prev);
      setOpenDialog(prev => ({ ...prev, ["score-submission"]: false, ["applicant-submissions"]: false }));
      setSubmissionScore(0);
      return setAlert({ show: true, message: success });
    };
  };
  // assign to Interview
  const assignToInterview = async () => {
    setLoading(prev => ({ ...prev, ["assign-to-interview"]: true }));
    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.JSONRequest({
      pipeline_id: selectedAssignee.pipeline_id,
      stage: "Interview",
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
      setLoading(prev => ({ ...prev, ["assign-to-interview"]: false }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(prev => ({ ...prev, ["assign-to-interview"]: false }));
      setOpenDialog(prev => ({ ...prev, ["assign-interview"]: false, ["applicant-submissions"]: false }))
      return setAlert({ show: true, message: success });
    }
  };

  /* fetching */
  useEffect(() => {
    if (tabOn !== "assessments") {
      return;
    }
    const token = GetSession("auth");
    // unassigned applicants -> GET
    (async () => {
      const [data, fail] = await RequestAPI.Send<UnassignedApplicant[]>(
        "/api/v1/employers/pipelines/" + vacancyID + "/assessment?unassigned",
        {
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );
      if (fail) {
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setUnassignedApplicants(data);
      }
    })();
    // available assignees -> GET
    (async () => {
      const [data, fail] = await RequestAPI.Send<AssessmentApplicant[]>(
        "/api/v1/employers/pipelines/" + vacancyID + "/assessment",
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          },
        },
      );
      if (fail) {
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setAssessmentAssigneesOption(data);
      };
    })();
    // assessments -> GET
    (async () => {
      const [data, fail] = await RequestAPI.Send<AssessmentType[]>(
        "/api/v1/employers/assessments/" + vacancyID,
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          },
        }
      );
      if (fail) {
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setAssessments(data);
      }
    })();
    // 
  }, [dataAction, tabOn]);
  return (
    <Box component={"div"}>
      <Collapse
        in={Boolean(tabOn === "assessments")}
        mountOnEnter
        unmountOnExit
      >
        <Box component={"div"}
          sx={{
            marginBottom: "1em",
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Box component={"div"}>
            <Button
              variant="contained"
              startIcon={<AddRounded fontSize="small" />}
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              CREATE ASSESSMENT
            </Button>
          </Box>
        </Box>
        {(unassignedApplicants.length === 0 && assessments.length === 0) && (
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
              There are no applicants currently in the assessment stage
            </Typography>
          </Box>
        )}
        {/* Applicant Waiting for Assessment Notif */}
        <Box component={"div"}
          sx={{
            marginBottom: "1em",
            padding: "0.5em 0.8em",
            display: unassignedApplicants.length === 0 ? "none" : "flex",
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
            There are <SimpleEmphasis text={unassignedApplicants.length} textColor={amber[700]} sx={{ fontWeight: 550 }} /> candidates waiting to be assigned an assessment. Please review and take action promptly, {" "}
            <Typography component={"span"}
              sx={{
                color: blue[700],
                fontStyle: "italic",
                textDecoration: "underline",
                cursor: "pointer"
              }}
              onClick={() => {
                setOpenDialog(prev => ({ ...prev, ["unassigned"]: true }));
              }}
            >
              view here
            </Typography>
          </Typography>
        </Box>
        <Stack direction={"column"} spacing={2}>
          {paginatedAssessments.map((assessment, index) => {
            const isLinkExist = assessment.assessment_link === "" || assessment.assessment_link === null ? false : true;
            const submittedCount = assessment.assessment_assignees.filter(assignee => assignee.submission_documents.length !== 0).length;
            return (
              <Box
                key={index}
                component={"div"}
                className="assessment-item"
                sx={{
                  // padding: "0.5em 1em",
                  border: "1px solid " + grey[400],
                  borderRadius: "0.3em",
                }}
              >
                <Box component={"div"} sx={{ padding: "0.5em 0.8em" }}>
                  {/* title */}
                  <Box
                    component={"div"}
                    sx={{
                      display: "flex",
                      alignItems: {
                        xs: "start",
                        sm: "center",
                      },
                      justifyContent: "space-between",
                      columnGap: "0.5em",
                    }}
                  >
                    <Box
                      component={"div"}
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        marginBottom: {
                          xs: "0.5em",
                          sm: "",
                        },
                      }}
                    >
                      <Typography
                        component={"p"}
                        variant="subtitle2"
                        sx={{ fontWeight: 550, color: grey[800] }}
                      >
                        {assessment.name}
                      </Typography>
                      <Typography
                        component={"p"}
                        variant="caption"
                        sx={{
                          width: "max-content",
                          padding: "0.3em 0.8em",
                          borderRadius: "2em",
                          color: amber[700],
                          fontStyle: "italic",
                          backgroundColor: amber[50],
                        }}
                      >
                        Due date on{" "}
                        <SimpleEmphasis
                          text={new Date(assessment.due_date).toDateString()}
                          textColor={amber[700]}
                          sx={{ fontStyle: "italic" }}
                        />
                      </Typography>
                    </Box>
                    <Tooltip title="More option" placement="top">
                      <IconButton size="small"
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                          setCurrentAssessment({ id: assessment.id, name: assessment.name });
                          setAssessmentForm({
                            id: assessment.id,
                            name: assessment.name,
                            note: assessment.note,
                            assessment_link: assessment.assessment_link,
                            start_at: assessment.start_at,
                            due_date: assessment.due_date,
                            vacancy_id: vacancyID as string,
                            assessment_documents: [],
                            current_assessment_documents: assessment.assessment_documents,
                          })
                          setAnchorEl(event.currentTarget);
                        }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {/* body */}
                  <Box component={"div"}>
                    {/* note */}
                    <Box
                      component={"div"}
                      sx={{ display: "flex", columnGap: "0.3em" }}
                    >
                      <DescriptionRounded
                        fontSize="small"
                        sx={{ color: "#06816d" }}
                      />
                      <Box component={"div"}>
                        <Typography
                          component={"p"}
                          variant="caption"
                          sx={{ fontWeight: 550, color: grey[700] }}
                        >
                          Note
                        </Typography>
                        <AutoOverflowText
                          text={assessment.note}
                          variant="caption"
                        />
                      </Box>
                    </Box>
                    {/* label */}
                    <Box
                      component={"div"}
                      sx={{
                        marginTop: "0.5em",
                        display: "flex",
                        flexWrap: {
                          xs: "wrap",
                          sm: "nowrap",
                        },
                        columnGap: "0.5em",
                        rowGap: {
                          xs: "0.7em",
                          sm: "",
                        },
                      }}
                    >
                      {/* assessment link */}
                      <Box
                        component={"div"}
                        sx={{
                          flexBasis: {
                            xs: "100%",
                            sm: "40%",
                          },
                          display: "flex",
                          columnGap: "0.3em",
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
                            sx={{ fontWeight: 550, color: grey[700] }}
                          >
                            Assessment Link
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
                            {isLinkExist ? assessment.assessment_link : "no link attached"}
                          </Typography>
                        </Box>
                      </Box>
                      {/* attached files */}
                      <Box
                        component={"div"}
                        sx={{
                          flexBasis: {
                            xs: "100%",
                            sm: "40%",
                          },
                          display: "flex",
                          columnGap: "0.3em",
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
                            sx={{ fontWeight: 550, color: grey[700] }}
                          >
                            Attached Files
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
                                    to={HOST.main + fileURL}
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
                      {/* assigned to */}
                      <Box
                        component={"div"}
                        sx={{
                          flexBasis: {
                            xs: "100%",
                            sm: "20%",
                          },
                          display: "flex",
                          columnGap: "0.3em",
                        }}
                      >
                        <AssignmentIndRounded
                          fontSize="small"
                          sx={{ color: "#06816d" }}
                        />
                        <Box component={"div"}>
                          <Typography
                            component={"p"}
                            variant="caption"
                            sx={{ fontWeight: 550, color: grey[700] }}
                          >
                            Assignee
                          </Typography>
                          <Typography
                            component={"p"}
                            variant="caption"
                            sx={{ color: grey[600] }}
                          >
                            {assessment.assessment_assignees.length} Candidates
                          </Typography>
                          <Button
                            variant="text"
                            size="small"
                            startIcon={<Visibility fontSize="small" />}
                            onClick={() => {
                              const assignedApplicant = assessment.assessment_assignees.map((assignee) => {
                                const currentAssignees: AssignedApplicant = {
                                  pipeline_id: assignee.pipeline.id,
                                  candidate: assignee.candidate,
                                }
                                return currentAssignees;
                              })
                              setCurrentAssessment({ id: assessment.id, name: assessment.name });
                              setCurrentAssignees(assignedApplicant);
                              setOpenDialog(prev => ({ ...prev, ["assign-assessment"]: true }));
                            }}
                          >
                            Details
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Divider
                  orientation="horizontal"
                  sx={{ borderColor: grey[400] }}
                />
                {/* Appplicant Submissions */}
                <Box
                  component={"div"}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5em 0.8em",
                  }}
                >
                  <Button variant="contained" startIcon={<DonutLargeRounded />}
                    onClick={() => {
                      setViewAssessmentSubmissions(assessment.assessment_assignees);
                      setCurrentAssessment({ id: assessment.id, name: assessment.name });
                      setOpenDialog(prev => ({
                        ...prev,
                        ["applicant-submissions"]: true,
                      }))
                    }}
                  >
                    View Submissions
                  </Button>
                  <Chip
                    label={
                      <Typography
                        variant="caption"
                        sx={{ color: blue[700], fontStyle: "italic" }}
                      >
                        {submittedCount} submitted out of {assessment.assessment_assignees.length}
                      </Typography>
                    }
                    size="small"
                    sx={{
                      paddingX: { xs: 0, sm: "0.5em" },
                      backgroundColor: blue[50],
                    }}
                  />
                </Box>
              </Box>
            )
          })}
        </Stack>
        <Pagination
          color="primary"
          count={totalPagesAssessments}
          page={pageAssessments}
          onChange={(_: ChangeEvent<unknown>, page: number) => {
            setPageAssessments(page);
          }}
          sx={{
            display: "flex",
            justifyContent: "end",
            marginY: "2em",
          }}
        />
      </Collapse>
      {/* Assessment Menu Option */}
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
                md: "8em",
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
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setOnEdit(true);
            setOpenDrawer(true);
          }}
        >
          <ListItemIcon>
            <EditRounded fontSize="small" sx={{ color: "#06816d" }} />
          </ListItemIcon>
          <ListItemText
            primary={"Edit"}
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "small",
                fontWeight: 550,
                color: "#06816d",
              },
              ".MuiListItemIcon-root": {
                color: "#06816d",
              }
            }}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDialog(prev => ({ ...prev, ["delete-assessment"]: true }))
          }}
        >
          <ListItemIcon>
            <DeleteRounded fontSize="small" sx={{ color: "red" }} />
          </ListItemIcon>
          <ListItemText
            primary={"Delete"}
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "small",
                fontWeight: 550,
                color: "red",
              },
            }}
          />
        </MenuItem>
      </Menu>
      {/* Applicant Unassigned Assessment Dialog */}
      <Dialog
        open={Boolean(openDialog["unassigned"])}
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
            marginBottom: "0.8em",
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
            Waiting for Assessment
          </Typography>
          <IconButton size="small"
            onClick={() => {
              setOpenDialog(prev => ({
                ...prev, ["unassigned"]: false
              }))
            }}
          >
            <CloseRounded fontSize="small" />
          </IconButton>
        </Box>
        <Box component={"div"} className="candidates-list-container">
          {unassignedApplicants.map((applicant, index) => {
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
                  <Typography component={"p"} variant="subtitle2"
                    sx={{
                      color: "#06816d",
                      fontWeight: 550
                    }}>
                    {applicant.candidate.expertise}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Dialog>
      {/* Assign Assessment to Applicant Dialog */}
      <Dialog
        open={Boolean(openDialog["assign-assessment"])}
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
            {currentAssessment.name}
          </Typography>
          <IconButton size="small"
            onClick={() => {
              setAssignees([]);
              setOpenDialog(prev => ({ ...prev, ["assign-assessment"]: false }));
            }}
          >
            <CloseRounded fontSize="small" />
          </IconButton>
        </Box>
        {/* Add New Assignees */}
        <Box component={"div"}>
          <Box component={"div"}
            sx={{ marginTop: "0.5em", marginBottom: "0.7em" }}
          >
            <Typography component={"p"} variant="subtitle2"
              sx={{ marginBottom: "0.7em", fontWeight: 550, color: grey[700] }}
            >
              Add New Assignees
            </Typography>
            <Autocomplete
              open={autocompleteOpen}
              onOpen={() => setAutocompleteOpen(true)}
              onClose={() => setAutocompleteOpen(false)}
              options={assessmentAssigneesOption}
              loading={loading["assessmentAssigneesOption"]}
              size="small"
              getOptionLabel={(option) => option.candidate.user.fullname}
              renderOption={(props, option) => {
                const { key, ...restProps } = props;
                return (
                  <Box
                    key={key}
                    component={"li"}
                    {...restProps}
                  >
                    <Box
                      component={"div"}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: "0.7em",
                      }}
                    >
                      <Avatar
                        alt="candidate-profile-image"
                        src={HOST.main + option.candidate.profile_image_path}
                        sx={{ width: 30, height: 30 }}
                      />
                      <Box component={"div"}
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        <Typography component={"p"} variant="caption"
                          sx={{
                            color: grey[800],
                            fontWeight: 550,
                          }}
                        >
                          {option.candidate.user.fullname}
                        </Typography>
                        <Typography component={"p"} variant="caption"
                          sx={{ color: grey[600], fontSize: "0.7em" }}
                        >
                          {option.candidate.user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )
              }}
              renderInput={(params) => (
                <TextField {...params}
                  label="Applicants"
                  size="small"
                  helperText="Select the candidate to be assigned to this assessment."
                />
              )}
              slotProps={{
                paper: {
                  sx: {
                    marginBottom: "0.8em",
                  },
                },
              }}
              fullWidth
              getOptionDisabled={(option) => {
                let bySelected = assignees.some(assignee => assignee.pipeline_id === option.pipeline_id);
                let byCurrentAssignees = currentAssignees.some(assignee => assignee.pipeline_id === option.pipeline_id);

                return bySelected || byCurrentAssignees;
              }}
              value={null}
              onChange={(_: React.SyntheticEvent, value) => {
                if (!value) return;
                setAssignees(prev => ([...prev, {
                  pipeline_id: value.pipeline_id,
                  assessment_id: currentAssessment.id,
                  name: value.candidate.user.fullname
                }]));
              }}
            />
          </Box>
          <Box component={"div"} className="new-asignees-list">
            <Box component={"div"}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {assignees.map((assignee, index) => {
                let assigneeName = ` ${assignee.name}`;
                return (
                  <Box key={index} component={"div"}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingX: "0.3em",
                      backgroundColor: blue[50],
                      borderRadius: "0.3em",
                    }}
                  >
                    <Typography key={index} component={"span"} variant="caption"
                      sx={{
                        fontWeight: 550,
                        color: blue[500],
                      }}
                    >
                      {assigneeName}
                    </Typography>
                    <IconButton size="small"
                      onClick={() => {
                        setAssignees(prev => {
                          prev.splice(index, 1);
                          return [...prev];
                        })
                      }}
                    >
                      <CloseRounded fontSize="small" />
                    </IconButton>
                  </Box>
                )
              })}
            </Box>
            {/* Add Assignees Confirmation Message */}
            {onAddNewAssignees && (
              <Box component={"div"}
                sx={{
                  marginTop: 2
                }}
              >
                <Typography component={"p"} variant="subtitle2" sx={{ fontWeight: 550, color: grey[700] }}>
                  Are you sure you want to add these candidates to the assessment?
                </Typography>
              </Box>
            )}
            <Box component={"div"}
              sx={{
                display: "flex",
                justifyContent: "end",
                marginTop: "1em",
                columnGap: 2
              }}
            >
              {onAddNewAssignees && (
                <>
                  <Button
                    variant="text"
                    color="error"
                    size="small"
                    onClick={() => setOnAddNewAssignees(false)}
                    sx={{
                      minWidth: "10em",
                    }}
                  >
                    CANCEL
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      minWidth: "10em",
                    }}
                    disabled={loading["add-assignees"]}
                    onClick={() => {
                      addNewAssignees();
                    }}
                  >
                    {loading["add-assignees"] ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : "CONTINUE"}
                  </Button>
                </>
              )}
              {!onAddNewAssignees && (
                <Button variant="contained" size="small"
                  sx={{
                    minWidth: "10em",
                  }}
                  onClick={() => {
                    if (assignees.length === 0) {
                      return setAlert({ show: true, message: "Please select an applicant first!" })
                    }
                    setOnAddNewAssignees(true);
                  }}
                >
                  ADD
                </Button>
              )}
            </Box>
          </Box>
        </Box>
        {/* Current Assignees */}
        <Box component={"div"} className="current-assignees-container">
          <Box component={"div"}
            sx={{ marginTop: "0.5em", marginBottom: "1em" }}
          >
            <Typography component={"p"} variant="subtitle2"
              sx={{ marginBottom: "0.5em", fontWeight: 550, color: grey[700] }}
            >
              Currently Assigned Applicant
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
                  minWidth: {
                    md: "20em",
                  },
                },
              }}
              value={currentAssigneesQuery}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setCurrentAssigneesQuery(event.target.value);
              }}
            />
          </Box>
          {currentAssignees.length === 0 && (
            <Box component={"div"}
              sx={{
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
                Assigned applicant is empty
              </Typography>
            </Box>
          )}
          {paginatedCurrentAssignees.map((applicant, index) => {
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
                  <Tooltip title={"Unassign"} placement="left">
                    <IconButton size="small"
                      onClick={() => {
                        setSelectedAssignee({ assessment_id: currentAssessment.id, pipeline_id: applicant.pipeline_id });
                        setOpenDialog(prev => ({ ...prev, ["delete-assignee"]: true }));
                      }}
                    >
                      <DeleteRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )
          })}
          {/* Current Assignees Pagination */}
          <Pagination
            size="small"
            count={totalCurrentAssigneesPage}
            page={pageCurrentAssignees}
            onChange={(_: ChangeEvent<unknown>, page: number) => {
              setPageCurrentAssignees(page);
            }}
            sx={{
              display: "flex",
              justifyContent: "end",
              marginY: "2em",
            }}
          />
        </Box>
      </Dialog>
      {/* Delete Assignee Confirmation Dialog */}
      <Dialog
        open={Boolean(openDialog["delete-assignee"])}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            padding: "1em 1.5em"
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
            Are you sure you want to remove the assignee from this assessment? All candidate-related <SimpleEmphasis text={"submissions"} /> will also be <SimpleEmphasis text={"deleted"} textColor="red" />
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
            onClick={() => setOpenDialog(prev => ({ ...prev, ["delete-assignee"]: false }))}
          >
            NO
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={loading["delete-assignee"]}
            endIcon={loading["delete-assignee"] && (<CircularProgress size={20} />)}
            onClick={() => {
              deleteAssignee();
            }}
          >
            YES
          </Button>
        </Box>
      </Dialog>
      {/* View Applicant Submissions Dialog */}
      <Dialog
        open={Boolean(openDialog["applicant-submissions"])}
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography component={"div"} variant="subtitle1"
            sx={{
              fontWeight: 550,
              color: "#06816d"
            }}
          >
            {currentAssessment.name}
          </Typography>
          <IconButton size="small"
            onClick={() => setOpenDialog(prev => ({ ...prev, ["applicant-submissions"]: false }))}
          >
            <CloseRounded fontSize="small" />
          </IconButton>
        </Box>
        <Box component={"div"}
          sx={{
            marginTop: "0.5em",
          }}
        >
          <TextField
            type="text"
            name="search" // search for applicant
            placeholder="Search assignee by name..."
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
            value={currentAssigneesQuery}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setCurrentAssigneesQuery(event.target.value);
            }}
          />
          <Typography component={"p"} variant="subtitle2"
            sx={{
              marginTop: "1em",
              fontWeight: 550,
              color: grey[700]
            }}
          >
            Assignees Submissions
          </Typography>
        </Box>
        <Box component={"div"}
          sx={{
            height: "30em",
            marginTop: "0.5em",
            overflow: "scroll",
          }}
        >
          {viewAssessmentSubmissions.length === 0 && (
            <Box component={"div"}
              sx={{
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
                Assignees is empty
              </Typography>
            </Box>
          )}
          {viewAssessmentSubmissions.map((assignee, index) => {
            const collapseKey = `submissions${index}`;
            return (
              <Box key={index} component={"div"}
                sx={{
                  borderBottom: "1px solid " + grey[100],
                  "&:hover": {
                    backgroundColor: grey[50],
                    borderRadius: "0.3em",
                  },
                }}
              >
                <Box
                  component={"div"}
                  sx={{
                    paddingY: "0.5em",
                    paddingX: "0.5em",
                    display: "flex",
                    columnGap: "0.7em",
                  }}
                >
                  <Avatar
                    alt="candidate-profile-image"
                    src={HOST.main + assignee.candidate.profile_image_path}
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
                        {assignee.candidate.user.fullname}
                      </Typography>
                      <Typography component={"p"} variant="caption"
                      >
                        {assignee.candidate.user.email}
                      </Typography>
                      {assignee.submission_result && (
                        <Typography component={"p"} variant="caption"
                          sx={{
                            paddingY: "0.2em",
                            color: blue[700],
                            fontWeight: 550,
                            borderRadius: "0.3em"
                          }}
                        >
                          Scored: {assignee.submission_result}
                        </Typography>
                      )}
                      {assignee.submission_result && (
                        <Button
                          variant="text"
                          size="small"
                          startIcon={assignee.pipeline.stage === "Assessment" && <EastRounded fontSize="small" />}
                          disabled={assignee.pipeline.stage !== "Assessment"}
                          onClick={() => {
                            setSelectedAssignee({
                              assessment_id: currentAssessment.id,
                              pipeline_id: assignee.pipeline.id,
                              fullname: assignee.candidate.user.fullname
                            });
                            setOpenDialog(prev => ({
                              ...prev,
                              ["assign-interview"]: true,
                            }));
                          }}
                        >
                          {assignee.pipeline.stage !== "Assessment" ? "Assigned to " + assignee.pipeline.stage : "Assign to Interview"}
                        </Button>
                      )}
                    </Box>
                    <Box component={"div"}
                      sx={{ display: "flex", alignItems: "center", columnGap: 1 }}
                    >
                      {assignee.submission_documents.length > 0 && (
                        <Typography component={"p"} variant="caption" sx={{ color: "#06816d" }}>
                          {assignee.submission_documents.length} file{assignee.submission_documents.length > 1 ? "s" : ""} submitted
                        </Typography>
                      )}
                      <Tooltip title="View submission" placement="top">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSubmissionsCollapse(prev => ({
                              ...prev,
                              [collapseKey]: !prev[collapseKey],
                            }))
                          }}
                        >
                          {submissionsCollapse[collapseKey] ? (
                            <ExpandLessRounded fontSize="small" />
                          ) : (
                            <ExpandMoreRounded fontSize="small" />
                          )}
                        </IconButton>

                      </Tooltip>
                      <Tooltip title="Score this submission" placement="top">
                        <IconButton
                          size="small"
                          disabled={assignee.submission_documents.length === 0}
                          onClick={() => {
                            setSelectedAssignee({
                              assessment_id: currentAssessment.id,
                              pipeline_id: assignee.pipeline.id,
                              fullname: assignee.candidate.user.fullname
                            });
                            setOpenDialog(prev => ({
                              ...prev,
                              ["score-submission"]: true,
                            }));
                          }}
                          sx={{ color: "#06816d" }}
                        >
                          <RateReviewRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
                <Collapse
                  in={Boolean(submissionsCollapse[collapseKey])}
                  mountOnEnter
                  unmountOnExit
                  sx={{
                    overflow: "hidden",
                  }}
                >
                  {assignee.submission_documents.length === 0 && (
                    <Box component={"div"} sx={{ display: "flex", alignItems: "center", columnGap: 1, marginY: "0.5em", marginLeft: "3.5em" }}>
                      <ErrorRounded fontSize="small" sx={{ color: amber[700] }} />
                      <Typography component={"p"} variant="caption" sx={{ color: amber[700], marginTop: "0.3em" }}>
                        Applicant have not submitted yet
                      </Typography>
                    </Box>
                  )}
                  {assignee.submission_documents.map((file, index) => (
                    <Box key={index} component={"div"}
                      sx={{
                        paddingRight: "0.5em",
                        display: "flex",
                        columnGap: "0.2em",
                      }}
                    >
                      <Box component={"div"} className="line-tree"
                        sx={{
                          width: "3.5em",
                          height: "inherit",
                          display: "flex",
                          justifyContent: "end",
                        }}
                      >
                        <Box
                          component={"div"}
                          sx={{
                            width: "50%",
                            height: "100%",
                            marginTop: "-1.4em",
                            borderLeft: "2px solid " + grey[500],
                            borderBottom: "2px solid " + grey[500],
                          }}
                        />
                      </Box>
                      <Box component={"div"} className="file-name"
                        sx={{
                          flexGrow: "1",
                          width: "100%",
                          marginBottom: "0.3em",
                          paddingY: "0.3em",
                          paddingLeft: "0.7em",
                          paddingRight: "1em",
                          display: "flex",
                          alignItems: "center",
                          columnGap: "0.3em",
                          borderRadius: "0.3em",
                          "&:hover": {
                            backgroundColor: blue[50],
                          }
                        }}
                      >
                        <Box component={"div"} sx={{
                          flexGrow: 1,
                          display: "flex",
                          columnGap: "0.2em",
                        }}>
                          <InsertDriveFileRounded fontSize="small"
                            sx={{
                              color: grey[700],
                            }}
                          />
                          <Typography component={"p"} variant="caption"
                            sx={{
                              flexGrow: 1,
                              color: grey[700],
                              cursor: "pointer"
                            }}
                          >
                            {file.name}
                          </Typography>
                        </Box>
                        <Box component={"div"} sx={{ display: "flex" }}>
                          <Tooltip title="Download" placement="left">
                            <IconButton size="small"
                              component={RouterLink}
                              to={`${HOST.main}${file.submission_document_path}/download`}
                              sx={{
                                "&:hover": {
                                  color: "#06816d"
                                }
                              }}
                            >
                              <DownloadRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View document" placement="right">
                            <IconButton
                              component={RouterLink}
                              to={`${HOST.main}${file.submission_document_path}${file.name.includes(".pdf") ? "" : "/download"}`}
                              target="_blank"
                              size="small"
                              sx={{ color: blue[700] }}
                            >
                              <LaunchRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Collapse>
              </Box>
            )
          })}
        </Box>
      </Dialog>
      {/* Score Submission Dialog */}
      <Dialog
        open={Boolean(openDialog["score-submission"])}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            padding: "1em 1.5em"
          }
        }}
      >
        <Box component={"div"}
          sx={{
            marginBottom: "0.7em",
          }}
        >
          <Typography component={"p"} variant="subtitle2"
            sx={{
              fontWeight: 550,
              color: grey[700]
            }}
          >
            Score <SimpleEmphasis text={selectedAssignee.fullname as string} />'s submission
          </Typography>
        </Box>
        <TextField
          type="text"
          name="submission_result"
          label="Score"
          placeholder="Enter numeric score"
          size="small"
          value={submissionScore}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            let value = event.target.value;
            if (isNaN(Number(value))) {
              return
            }
            if (Number(value) > 100) {
              return
            }
            setSubmissionScore(Number(value));
          }}
        />
        <Box component={"div"}
          sx={{
            marginTop: "1em",
            display: "flex",
            columnGap: "0.5em",
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
            onClick={() => setOpenDialog(prev => ({ ...prev, ["score-submission"]: false }))}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={loading["score-submission"]}
            startIcon={loading["score-submission"] && <CircularProgress size={20} color="inherit" />}
            sx={{
              minWidth: "8em"
            }}
            onClick={() => {
              scoreSubmission();
            }}
          >
            SUBMIT
          </Button>
        </Box>
      </Dialog>
      {/* Delete Assesment Confirmation */}
      <Dialog
        open={Boolean(openDialog["delete-assessment"])}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            padding: "1em 1.5em"
          }
        }}
      >
        <Box component={"div"}
          sx={{ marginBottom: "0.5em" }}
        >
          <Typography component={"p"} variant="subtitle1"
            sx={{
              fontWeight: 550,
              color: grey[700]
            }}
          >
            Delete Confirmation
          </Typography>
        </Box>
        <Typography component={"p"} variant="body1" sx={{ color: grey[700] }}>
          Deleting this assessment will also remove all <SimpleEmphasis text={"applicants"} /> and <SimpleEmphasis text={"submissions"} /> associated with it. Are you sure you want to proceed with the <SimpleEmphasis text={"deletion"} textColor="red" />?
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
            size="small"
            color="error"
            sx={{
              minWidth: "8em"
            }}
            onClick={() => setOpenDialog(prev => ({ ...prev, ["delete-assessment"]: false }))}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              minWidth: "8em"
            }}
            onClick={() => {
              deleteAsessment();
            }}
          >
            CONTINUE
          </Button>
        </Box>
      </Dialog>
      {/* Assign Interview Confirmation */}
      <Dialog
        open={Boolean(openDialog["assign-interview"])}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            padding: "1em 1.5em"
          }
        }}
      >
        <Box component={"div"}
          sx={{ marginBottom: "0.5em" }}
        >
          <Typography component={"p"} variant="subtitle1"
            sx={{
              fontWeight: 550,
              color: grey[700]
            }}
          >
            Assign Interview
          </Typography>
        </Box>
        <Typography component={"p"} variant="body1" sx={{ color: grey[700] }}>
          Are you sure you want to assign <SimpleEmphasis text={selectedAssignee.fullname as string} /> to the interview?
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
            size="small"
            color="error"
            sx={{
              minWidth: "8em"
            }}
            onClick={() => setOpenDialog(prev => ({ ...prev, ["assign-interview"]: false }))}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={loading["assign-to-interview"]}
            startIcon={loading["assign-to-interview"] && <CircularProgress size={20} color="inherit" />}
            sx={{
              minWidth: "8em"
            }}
            onClick={() => {
              assignToInterview();
            }}
          >
            CONTINUE
          </Button>
        </Box>
      </Dialog>
      {/* Create New Assessment Drawer */}
      <Drawer
        open={openDrawer}
        anchor="right"
        PaperProps={{
          sx: {
            width: "480px",
            padding: "0.7em 1.2em"
          }
        }}
      >
        <AssessmentForm
          assessmentForm={assessmentForm}
          setAssessmentForm={setAssessmentForm}
          setOpenDrawer={setOpenDrawer}
          filesOnChange={filesOnChange}
          onSubmit={assessmentOnSubmit}
          loading={loading}
          errMsg={errMsg}
        />
      </Drawer>
    </Box>
  )
}