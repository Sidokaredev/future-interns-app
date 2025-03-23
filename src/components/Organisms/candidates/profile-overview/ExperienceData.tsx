import { AddRounded, DeleteRounded, EditRounded } from "@mui/icons-material"
import { Box, Button, CircularProgress, Dialog, Divider, IconButton, Snackbar, Typography } from "@mui/material"
import { grey, lightBlue, red } from "@mui/material/colors"
import dayjs from "dayjs"
import SimpleEmphasis from "../../../Molecules/Texts/SimpleEmphasis"
import { FormEvent, useEffect, useState } from "react"
import { ExperienceDataType, ExperienceFormSchema, ExperienceFormType } from "../../../../pages/candidates/types"
import { DEFAULT_EXPERIENCE_FORM } from "../../../../pages/candidates/constants"
import { GetSession, onCloseSnackbar } from "../../../../pages/global-helpers"
import RequestAPI from "../../../../services/api/request"
import ExperienceForm from "./ExperienceForm"
import { HOST } from "../../../../pages/administrators/performance/[id]/constants"

export default function ExperienceData({
  openDialog,
  handleOpenDialog,
  onCloseDialog,
}: {
  openDialog: Record<string, boolean>
  handleOpenDialog: (key: string) => void
  onCloseDialog: (key: string) => void
}) {
  /* state */
  const [experiencesData, setExperiencesData] = useState<ExperienceDataType[] | null>(null)
  const [formValue, setFormValue] = useState<ExperienceFormType>(DEFAULT_EXPERIENCE_FORM)
  const [onEdit, setOnEdit] = useState<boolean>(false)
  const [errMsg, setErrMsg] = useState<{ [key: string]: string[] }>({})
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
  const [loading, setLoading] = useState<boolean>(false)
  const [refetch, setRefetch] = useState<boolean>(false);
  const [embedFullHeight, setEmbedFullHeight] = useState<boolean>(false);
  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const validate = ExperienceFormSchema.safeParse(formValue);
    if (!validate.success) {
      setLoading(false)
      const errorSchema = validate.error.flatten().fieldErrors;
      setErrMsg(errorSchema)
      return setAlert({ show: true, message: "please follow the form value rules!" });
    }
    setErrMsg({})

    let requestMethod = onEdit ? "PATCH" : "POST";
    const token = GetSession("auth")
    const [success, fail] = await RequestAPI.FormDataRequest(formValue).Send<{ message: string, document_status: string }>("/api/v1/candidates/experiences/", {
      method: requestMethod,
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    if (fail) {
      setLoading(false)
      return setAlert({ show: true, message: fail.message })
    }

    if (success) {
      setLoading(false)
      setRefetch(prev => !prev)
      onCloseDialog("experience")
      return setAlert({ show: true, message: success.message })
    }
  }
  /* onDelete */
  const onDelete = async (experienceId: number) => {
    setLoading(true);
    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.Send<string>(
      "/api/v1/candidates/experiences/" + experienceId,
      {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    )

    if (fail) {
      setLoading(false);
      onCloseDialog("delete-experience")
      return setAlert({ show: true, message: fail.message });
    };

    if (success) {
      setLoading(false);
      onCloseDialog("delete-experience")
      setFormValue(DEFAULT_EXPERIENCE_FORM);
      setRefetch(prev => !prev);
      return setAlert({ show: true, message: success });
    };
  };
  /* helper */
  const experienceDescFormatter = (desc: string): string => {
    if (desc.includes("- ")) {
      return desc.replace("- ", "\n- ")
    }

    return desc
  }
  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data_experience, fail_experience] = await RequestAPI.Send<ExperienceDataType[]>("/api/v1/candidates/experiences/", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
      if (fail_experience) {
        return setAlert({ show: true, message: fail_experience.message })
      }
      if (data_experience) {
        return setExperiencesData(data_experience)
      }
    })()
  }, [refetch])
  return (
    <Box component={"div"}
      sx={{
        padding: "0.5em 1em",
        border: "1px solid " + grey[300],
        borderRadius: "0.3em",
        backgroundColor: grey[50]
      }}
    >
      {/* Snackbar for Notification Message */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        message={alert.message}
        autoHideDuration={3000}
        onClose={onCloseSnackbar(setAlert)}
      />
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
        <Box component={"div"}
          sx={{
            display: "flex",
          }}
        >
          {/* Begin to edit the item */}
          {!onEdit && (
            <IconButton size="small"
              onClick={() => {
                setOnEdit(false)
                setFormValue(DEFAULT_EXPERIENCE_FORM)
                handleOpenDialog("experience")
              }}
            >
              <AddRounded fontSize="small" />
            </IconButton>
          )}
          <IconButton size="small"
            onClick={() => {
              setOnEdit(prev => !prev)
            }}
          >
            {onEdit ? (
              <Button
                variant="text"
                color="error"
                size="small"
              >
                Cancel
              </Button>
            ) : (
              <EditRounded fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>
      <Box component={"div"} className="experience-item">
        {experiencesData?.map((experience, index) => {
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
                  {/* Edit button on each item to set the formValue state. */}
                  {onEdit && (
                    <Box component={"div"}>
                      {experiencesData.length > 1 && index != 0 && (
                        <IconButton size="small"
                          onClick={() => {
                            setFormValue(experience);
                            handleOpenDialog("delete-experience");
                          }}
                        >
                          <DeleteRounded fontSize="small" sx={{ color: red[400] }} />
                        </IconButton>
                      )}
                      <IconButton size="small"
                        onClick={() => {
                          setFormValue(experience)
                          handleOpenDialog("experience")
                        }}
                      >
                        <EditRounded fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
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
                    {experienceDescFormatter(experience.description)}
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
                        src={`${HOST.main}${experience.attachment_document_path}`}
                        width={"100%"}
                        height={"100%"}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
              {!(index == experiencesData.length - 1) && (
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
      {/* Dialog for Experience Form */}
      <Dialog
        open={Boolean(openDialog["experience"])}
        onClose={() => {
          onCloseDialog("experience")
        }}
        maxWidth={"md"}
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        {/* used as primary Experience Form (fixed version) */}
        <ExperienceForm
          formValue={formValue}
          setFormValue={setFormValue}
          errMsg={errMsg}
          onSubmit={onSubmit}
          loading={loading}
        />
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(openDialog["delete-experience"])}
        onClose={() => {
          setFormValue(DEFAULT_EXPERIENCE_FORM)
          onCloseDialog("delete-experience");
        }}
        maxWidth="sm"
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        <Box component={"div"}>
          <Typography component={"p"} variant="body1" sx={{ color: grey[600] }}>
            Are you sure want to
            <SimpleEmphasis text={" delete "} textColor="red" />
            your Education data at
            <SimpleEmphasis text={" " + formValue.company_name} /> ?
          </Typography>
        </Box>
        <Box component={"div"} sx={{
          marginTop: 2,
          display: "flex",
          justifyContent: "end",
          columnGap: "0.5em"
        }}>
          <Button
            variant="contained"
            size="small"
            color="error"
            sx={{
              minWidth: "8em"
            }}
            disabled={loading}
            onClick={() => {
              setFormValue(DEFAULT_EXPERIENCE_FORM)
              onCloseDialog("delete-experience")
            }}
          >
            No
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            sx={{
              minWidth: "8em"
            }}
            disabled={loading}
            onClick={() => {
              console.info("form value id \t:", formValue.id)
              onDelete(formValue.id as number)
            }}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : "Yes"}
          </Button>
        </Box>
      </Dialog>
    </Box>
  )
}