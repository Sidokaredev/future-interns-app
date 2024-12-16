import { EditRounded } from "@mui/icons-material";
import { Avatar, Box, Dialog, IconButton, Snackbar, Typography } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { CandidateFormSchema, CandidateFormType, CandidateProfileDataType, UserDataType } from "../../../../pages/candidates/types";
import { DEFAULT_CANDIDATE_FORM } from "../../../../pages/candidates/constants";
import CandidateFormDraft from "./CandidateFormDraft";
import { grey } from "@mui/material/colors";
import { GetSession, onCloseSnackbar } from "../../../../pages/global-helpers";
import RequestAPI from "../../../../services/api/request";

export default function ProfileData({
  openDialog,
  handleOpenDialog,
  onCloseDialog,
}: {
  openDialog: Record<string, boolean>
  handleOpenDialog: (key: string) => void
  onCloseDialog: (key: string) => void
}) {
  /* state */
  const [profileData, setProfileData] = useState<CandidateProfileDataType | null>(null)
  const [userData, setUserData] = useState<UserDataType | null>(null)
  const [formValue, setFormValue] = useState<CandidateFormType>(DEFAULT_CANDIDATE_FORM)
  const [errMsg, setErrMsg] = useState<{ [key: string]: string[] }>({})
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({
    show: false,
    message: ""
  })
  const [refetch, setRefetch] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const validate = CandidateFormSchema.safeParse(formValue)
    if (!validate.success) {
      let errorSchema = validate.error.flatten().fieldErrors
      setLoading(false)
      return setErrMsg(errorSchema)
    }
    setErrMsg({})

    let body: any = {}
    for (let [key, value] of Object.entries(formValue)) {
      const fileProps = [
        "background_profile_img",
        "profile_img",
        "cv_document"
      ]
      if (fileProps.includes(key) && !(value instanceof File)) {
        continue
      }
      body[key] = value
    }

    const token = GetSession("auth")
    const [success, fail] = await RequestAPI.FormDataRequest(body)
      .Send<{ updated_status: string }>("/api/v1/candidates/", {
        method: "PATCH",
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
      onCloseDialog("profile")
      return setAlert({ show: true, message: success.updated_status })
    }
  }
  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data_candidate, fail_candidate] = await RequestAPI.Send<CandidateProfileDataType>("/api/v1/candidates/", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      })

      if (fail_candidate) {
        return setAlert({ show: true, message: fail_candidate.message })
      }

      if (data_candidate) {
        return setProfileData(data_candidate)
      }
    })();
    (async () => {
      const [data_user, fail_user] = await RequestAPI.Send<UserDataType>("/api/v1/candidates/user", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      })

      if (fail_user) {
        return setAlert({ show: true, message: fail_user.message })
      }
      if (data_user) {
        return setUserData(data_user)
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
      {/* candidate.profile */}
      <Box component={"div"} sx={{ marginY: "0.5em" }}>
        <Box
          component={"img"}
          src={`http://localhost:3000${profileData?.background_profile_image_path}?t=${new Date(Date.now()).getTime()}`}
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
            src={`http://localhost:3000${profileData?.profile_image_path}?t=${new Date(Date.now()).getTime()}`}
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
              {userData?.fullname}
            </Typography>
            <Typography component={"div"} variant="caption">
              {profileData?.expertise}
            </Typography>
          </Box>
          {/* edit button */}
          <IconButton
            onClick={() => {
              setFormValue({
                expertise: profileData?.expertise as string,
                date_of_birth: profileData?.date_of_birth as string,
                about_me: profileData?.about_me as string,
                background_profile_img: profileData?.background_profile_image_path,
                profile_img: profileData?.profile_image_path,
                cv_document: profileData?.cv_document_path
              })
              handleOpenDialog("profile")
            }}
          >
            <EditRounded fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      {/* candidate.summary */}
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
          {profileData?.about_me}
        </Typography>
      </Box>
      {/* Edit Dialog */}
      <Dialog
        open={Boolean(openDialog["profile"])}
        onClose={() => {
          onCloseDialog("profile")
        }}
        maxWidth={"md"}
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        <CandidateFormDraft
          formValue={formValue}
          setFormValue={setFormValue}
          errMsg={errMsg}
          onSubmit={onSubmit}
          loading={loading}
        />
      </Dialog>
    </Box>
  )
}