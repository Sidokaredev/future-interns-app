import { AddRounded, ArticleRounded, CloseRounded, InsertDriveFileRounded } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton, InputBase, Snackbar, TextField, Typography } from "@mui/material";
import { blue, grey, red } from "@mui/material/colors";
import { DatePicker } from "@mui/x-date-pickers";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { DatePickerOnChange, GetSession, InputOnChangeV2, onCloseSnackbar } from "../../../../../pages/global-helpers";
import { AssessmentFormType } from "../../../../../pages/employers/types";
import dayjs from "dayjs";
import RequestAPI from "../../../../../services/api/request";

export default function AssessmentForm({
  assessmentForm,
  setAssessmentForm,
  setOpenDrawer,
  onSubmit,
  loading,
  errMsg,
  filesOnChange,
}: {
  assessmentForm: AssessmentFormType;
  setAssessmentForm: React.Dispatch<React.SetStateAction<AssessmentFormType>>;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  loading: Record<string, boolean>;
  errMsg: { [key: string]: string[] };
  filesOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  /* state */
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" });
  /* onDelete -> existing assessment document */
  const deleteExistingAssessmentDocument = async (assessmentID: number, documentID: number, currIndex: number) => {
    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.Send<string>(
      "/api/v1/employers/assessments/" + assessmentID + "/assessment-document/" + documentID,
      {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      console.info("fail request delete assessment document \t: ", fail);
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setAssessmentForm(prev => {
        prev.current_assessment_documents?.splice(currIndex, 1)
        return {
          ...prev
        }
      })
      return setAlert({ show: true, message: success });
    };
  }
  return (
    <Box component={"div"}>
      {/* Default Notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        message={alert.message}
        autoHideDuration={3000}
        onClose={onCloseSnackbar(setAlert)}
      />
      <Box component={"div"}
        sx={{
          marginBottom: "0.8em",
          display: "flex",
          columnGap: "0.5em",
          alignItems: "center",
        }}
      >
        <ArticleRounded fontSize="small" sx={{ color: grey[700] }} />
        <Typography component={"p"} variant="subtitle1"
          sx={{ color: grey[700], fontWeight: 550 }}
        >
          Assessment Data
        </Typography>
      </Box>
      <Box component={"div"}>
        <form onSubmit={onSubmit}>
          <TextField
            type="text"
            name="name"
            label="Assessment Name*"
            placeholder="Enter assessment name"
            size="small"
            autoComplete="off"
            fullWidth
            sx={{
              marginBottom: "0.8em",
            }}
            value={assessmentForm.name}
            onChange={InputOnChangeV2(setAssessmentForm)}
            error={Boolean(errMsg["name"])}
            helperText={errMsg["name"]}
          />
          <TextField
            type="text"
            name="assessment_link"
            label="Assessment Link"
            placeholder="Enter assessment link"
            size="small"
            autoComplete="off"
            fullWidth
            sx={{
              marginBottom: "0.8em",
            }}
            value={assessmentForm.assessment_link}
            onChange={InputOnChangeV2(setAssessmentForm)}
            error={Boolean(errMsg["assessment_link"])}
            helperText={errMsg["assessment_link"]}
          />
          <Box component={"div"}
            sx={{
              marginBottom: "0.8em",
              display: "flex",
              columnGap: "0.8em",
            }}
          >
            <DatePicker
              name="start_at"
              format="DD/MM/YYYY"
              label="Start at*"
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  error: Boolean(errMsg["start_date"]),
                  helperText: errMsg["start_date"],
                }
              }}
              value={Boolean(assessmentForm.start_at) ? dayjs(assessmentForm.start_at) : null}
              onChange={DatePickerOnChange("start_at", setAssessmentForm)}
            />
            <DatePicker
              name="due_date"
              format="DD/MM/YYYY"
              label="Due date*"
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  error: Boolean(errMsg["due_date"]),
                  helperText: errMsg["due_date"],
                }
              }}
              value={Boolean(assessmentForm.due_date) ? dayjs(assessmentForm.due_date) : null}
              onChange={DatePickerOnChange("due_date", setAssessmentForm)}
            />
          </Box>
          <TextField
            type="text"
            name="note"
            label="Note*"
            placeholder="Enter any specific guidelines or additional notes for this assessment"
            size="small"
            autoComplete="off"
            rows={5}
            multiline
            fullWidth
            sx={{
              marginBottom: "0.8em",
            }}
            value={assessmentForm.note}
            onChange={InputOnChangeV2(setAssessmentForm)}
            error={Boolean(errMsg["note"])}
            helperText={errMsg["note"]}
          />
          <Box component={"div"}
            sx={{
              marginBottom: "0.8em",
              display: "flex",
              columnGap: "0.5em",
              alignItems: "center",
            }}
          >
            <InsertDriveFileRounded fontSize="small" sx={{ color: grey[700] }} />
            <Typography component={"p"} variant="subtitle1"
              sx={{ color: grey[700], fontWeight: 550 }}
            >
              Assessment Documents
            </Typography>
          </Box>
          <Box component={"div"} className="assessment-documents-container"
            sx={{
              marginBottom: "0.8em",
              display: "flex",
              flexWrap: "wrap",
              columnGap: 1,
              rowGap: 1,
            }}
          >
            {/* New Assessment Documents */}
            {assessmentForm.assessment_documents.map((file, index) => {
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
                        setAssessmentForm(prev => {
                          prev.assessment_documents.splice(index, 1);
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
            {assessmentForm.current_assessment_documents && (
              assessmentForm.current_assessment_documents.map((currentDocument, index) => {
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
                        {currentDocument.name}
                      </Typography>
                      <IconButton size="small" sx={{ padding: "0.1em 0em" }}
                        onClick={() => {
                          // DELETE HERE
                          deleteExistingAssessmentDocument(assessmentForm.id as number, currentDocument.id, index);
                        }}
                      >
                        <CloseRounded fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                )
              })
            )}
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
                  onChange={filesOnChange}
                />
              </IconButton>
            </Box>
          </Box>
          {errMsg["assessment_documents"] && (
            <Typography component={"p"} variant="caption" sx={{ color: red[500] }}>
              {errMsg["assessment_documents"]}
            </Typography>
          )}
          {/* <Box component={"div"}
            sx={{
              marginBottom: "0.8em",
              display: "flex",
              columnGap: "0.5em",
              alignItems: "center",
            }}
          >
            <Group fontSize="small" sx={{ color: grey[700] }} />
            <Typography component={"p"} variant="subtitle1"
              sx={{ color: grey[700], fontWeight: 550 }}
            >
              Assessment Assignees
            </Typography>
          </Box>
          <Autocomplete
            open={autocompleteOpen["candidates-list"]}
            onOpen={AutoCompleteOnOpen("candidate-list", setAutocompleteOpen)}
            onClose={AutoCompleteOnClose("province", setAutocompleteOpen)}
            options={applicantAssessmentOption}
            // loading={loading["province"]}
            size="small"
            getOptionLabel={(option) => option.candidate.fullname}
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
                      "&:hover": {
                        backgroundColor: grey[100],
                      },
                    }}
                  >
                    <Avatar
                      alt="candidate-profile-image"
                      src={"http://localhost:3000" + option.candidate.profile_image_path}
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
                        {option.candidate.fullname}
                      </Typography>
                      <Typography component={"p"} variant="caption"
                        sx={{ color: grey[600], fontSize: "0.7em" }}
                      >
                        {option.candidate.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )
            }}
            renderInput={(params) => (
              <TextField {...params}
                label="Assignees"
                size="small"
                // error={Boolean(errMsg["province"]) ? true : false}
                // helperText={errMsg["province"] ?? ""}
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
            disableClearable
            fullWidth
          // value={Boolean(formValue.province) ? formValue.province : undefined}
          // onChange={AutoCompleteOnChange("province", setFormValue)}
          /> */}
          {/* <Box component={"div"} className="selected-candidate-container">
            <Box component={"div"}>
              <Box
                component={"div"}
                sx={{
                  paddingY: "0.5em",
                  paddingX: "0.5em",
                  display: "flex",
                  alignItems: "center",
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
                  src="https://placehold.co/40x40"
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
                    Dyah Ayu Kusuma Ningrum Daniel Putri
                  </Typography>
                  <Typography component={"p"} variant="caption"
                    sx={{ color: grey[600], fontSize: "0.7em" }}
                  >
                    Applicant Email
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box> */}
          {/* <Typography component={"div"} variant="subtitle2"
            sx={{
              marginY: 1,
              color: grey[600]
            }}
          >
            There are <SimpleEmphasis text={"[number]"} /> applicants assigned to this assessment.
          </Typography> */}
          <Box component={"div"}
            sx={{
              marginTop: 5,
              display: "flex",
              justifyContent: "end",
              columnGap: 2,
            }}
          >
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => {
                setOpenDrawer(false);
              }}
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={loading["assessment"]}
              endIcon={loading["assessment"] && (<CircularProgress size={20} />)}
            >
              SUBMIT
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}