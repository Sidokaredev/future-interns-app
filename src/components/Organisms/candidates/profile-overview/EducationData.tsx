import { AddRounded, DeleteRounded, EditRounded } from "@mui/icons-material"
import { Box, Button, CircularProgress, Dialog, Divider, IconButton, Snackbar, Typography } from "@mui/material"
import { grey, red } from "@mui/material/colors"
import { FormEvent, useEffect, useState } from "react"
import { EducationDataType, EducationFormSchema, EducationFormType } from "../../../../pages/candidates/types"
import { GetSession, onCloseSnackbar } from "../../../../pages/global-helpers"
import RequestAPI from "../../../../services/api/request"
import dayjs from "dayjs"
import EducationForm from "./EducationForm"
import { DEFAULT_EDUCATION_FORM } from "../../../../pages/candidates/constants"
import SimpleEmphasis from "../../../Molecules/Texts/SimpleEmphasis"

export default function EducationsData({
  openDialog,
  handleOpenDialog,
  onCloseDialog,
}: {
  openDialog: Record<string, boolean>
  handleOpenDialog: (key: string) => void
  onCloseDialog: (key: string) => void
}) {
  /* state */
  const [educationsData, setEducationsData] = useState<EducationDataType[] | null>(null)
  const [formValue, setFormValue] = useState<EducationFormType>(DEFAULT_EDUCATION_FORM)
  const [onEdit, setonEdit] = useState<boolean>(false)
  const [errMsg, setErrMsg] = useState<{ [key: string]: string[] }>({})
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
  const [loading, setLoading] = useState<boolean>(false)
  const [refetch, setRefetch] = useState<boolean>(false)
  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    if (!onEdit) {
      const validate = EducationFormSchema.safeParse(formValue)
      if (!validate.success) {
        setLoading(false)
        let errorSchema = validate.error.flatten().fieldErrors
        return setErrMsg(errorSchema)
      }
    }

    const token = GetSession("auth")
    let requestMethod = onEdit ? "PATCH" : "POST"
    const [success, fail] = await RequestAPI.JSONRequest(formValue).Send<string>("/candidates/educations/", {
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
      setFormValue(DEFAULT_EDUCATION_FORM)
      setRefetch(prev => !prev)
      setLoading(false)
      return setAlert({ show: true, message: success })
    }
  }
  /* onDelete */
  const onDelete = async (educationId: number) => {
    setLoading(true);
    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.Send<string>(
      "/candidates/educations/" + educationId,
      {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );

    if (fail) {
      setLoading(false);
      console.info("fail deleting \t:", fail);
      return setAlert({ show: true, message: fail.message });
    };

    if (success) {
      onCloseDialog("delete-education");
      setLoading(false);
      setAlert({ show: true, message: success });
      return setRefetch(prev => !prev);
    };
  }
  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data_educations, fail_educations] = await RequestAPI.Send<EducationDataType[]>("/candidates/educations/", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
      if (fail_educations) {
        return setAlert({ show: true, message: fail_educations.message })
      }

      if (data_educations) {
        onCloseDialog("education")
        return setEducationsData(data_educations)
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
            marginBottom: "0.5em",
          }}
        >
          Pendidikan
        </Typography>
        <Box component={"div"}
          sx={{
            display: "flex",
          }}
        >
          {!onEdit && (
            <IconButton size="small"
              onClick={() => {
                setFormValue(DEFAULT_EDUCATION_FORM)
                handleOpenDialog("education")
              }}
            >
              <AddRounded fontSize="small" />
            </IconButton>
          )}
          {onEdit ? (
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => {
                setonEdit(prev => !prev)
              }}
            >
              Batal
            </Button>
          ) : (
            <IconButton size="small"
              onClick={() => {
                setonEdit(prev => !prev)
              }}
            >
              <EditRounded fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
      <Box component={"div"} className="educations-container">
        {educationsData?.map((education, index) => {
          const start_at = dayjs(education.start_at).format("YYYY")
          const end_at = education.is_graduated ? dayjs(education.end_at).format("YYYY") : "now"
          return (
            <Box key={index} component={"div"} className="education-preview"
              sx={{
                marginBottom: index === educationsData?.length as number - 1 ? 0 : "0.5em",
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
                {onEdit && (
                  <Box component={"div"}>
                    {educationsData.length > 1 && index != 0 && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          setFormValue(education)
                          handleOpenDialog("delete-education")
                        }}
                      >
                        <DeleteRounded fontSize="small" sx={{
                          color: red[400]
                        }} />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => {
                        setFormValue(education)
                        handleOpenDialog("education")
                      }}
                    >
                      <EditRounded fontSize="small" sx={{ color: "#06816d" }} />
                    </IconButton>
                  </Box>
                )}
              </Box>
              {!(index == educationsData.length - 1) && (
                <Divider orientation="horizontal" sx={{ marginTop: "0.5em" }} />
              )}
            </Box>
          )
        })}
      </Box>
      {/* Edit Form Dialog */}
      <Dialog
        open={Boolean(openDialog["education"])}
        onClose={() => {
          onCloseDialog("education")
        }}
        maxWidth={"lg"}
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        <EducationForm
          formValue={formValue}
          setFormValue={setFormValue}
          errMsg={errMsg}
          onSubmit={onSubmit}
          loading={loading}
        />
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(openDialog["delete-education"])}
        onClose={() => {
          setFormValue(DEFAULT_EDUCATION_FORM)
          onCloseDialog("delete-education");
        }}
        maxWidth="sm"
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        <Typography variant="subtitle1" fontWeight={550}
          sx={{
            color: grey[700],
            marginBottom: "0.5em"
          }}
        >
          Konfirmasi Penghapusan
        </Typography>
        <Box component={"div"}>
          <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
            Apakah anda yakin ingin
            <SimpleEmphasis text={" delete "} textColor="red" />
            data pendidikan anda di {formValue.university} ?
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
              setFormValue(DEFAULT_EDUCATION_FORM)
              onCloseDialog("delete-education")
            }}
          >
            Tidak
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
            ) : "Iya"}
          </Button>
        </Box>
      </Dialog>
    </Box>
  )
}