import { AddRounded, CloseRounded, EditRounded } from "@mui/icons-material";
import { Avatar, Box, Button, Chip, CircularProgress, Dialog, IconButton, Snackbar, Tooltip, Typography } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { ArraySkillFormSchema, SkillDataType, SkillFormType } from "../../../../pages/candidates/types";
import { grey } from "@mui/material/colors";
import { GetSession, onCloseSnackbar } from "../../../../pages/global-helpers";
import RequestAPI from "../../../../services/api/request";
import SkillFormDraft from "./SkillFormDraft";

export default function SkillData({
  openDialog,
  handleOpenDialog,
  onCloseDialog,
}: {
  openDialog: Record<string, boolean>
  handleOpenDialog: (key: string) => void
  onCloseDialog: (key: string) => void
}) {
  /* state */
  const [skillData, setSkillData] = useState<SkillDataType[] | null>(null)
  const [formValue, setFormValue] = useState<SkillFormType[]>([{ skill_id: 0 }])
  const [errMsg, setErrMsg] = useState<{ [key: number]: Record<string, string> }>({})
  const [onEdit, setOnEdit] = useState<boolean>(false)
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
  const [loading, setLoading] = useState<boolean>(false)
  const [refetch, setRefetch] = useState<boolean>(false)
  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const validate = ArraySkillFormSchema.safeParse(formValue)
    if (!validate.success) {
      const errorSchema = validate.error.issues.reduce((prev: any, current) => {
        const [index, field] = current.path
        if (!prev[index]) prev[index] = {};
        prev[index][field] = current.message
        return prev
      }, {})
      setErrMsg(errorSchema)
      return setLoading(false)
    }

    const token = GetSession("auth")
    const [success, fail] = await RequestAPI.JSONRequest(formValue)
      .Send<string>("/api/v1/candidates/skills/", {
        method: "POST",
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
      onCloseDialog("skill")
      return setAlert({ show: true, message: success })
    }
    // LAST CODE HERE, PLEASE NEXT
  }

  const deleteSKill = (skillID: number) => async () => {
    setLoading(true)
    const urlPath = `/api/v1/candidates/skills/${skillID}`
    const token = GetSession("auth")
    const [success, fail] = await RequestAPI.Send<string>(urlPath, {
      method: "DELETE",
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
      return setAlert({ show: true, message: success })
    }
  }
  /* helper */
  const skillChecker = (skillID: number): boolean => {
    const skills = skillData?.map(value => value.id)
    return skills?.includes(skillID) as boolean
  }
  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data_skill, fail_skill] = await RequestAPI.Send<SkillDataType[]>("/api/v1/candidates/skills/", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      })

      if (fail_skill) {
        return setAlert({ show: true, message: fail_skill.message })
      }

      if (data_skill) {
        return setSkillData(data_skill)
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
          Skills
        </Typography>
        <Box component={"div"}
          sx={{
            display: "flex",
          }}
        >
          <IconButton size="small"
            onClick={() => {
              handleOpenDialog("skill")
            }}
          >
            <AddRounded fontSize="small" />
          </IconButton>
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
      <Box component={"div"} sx={{
        display: "flex",
        rowGap: 1,
        flexWrap: "wrap"
      }}>
        {skillData?.map((skill, index) => (
          <Chip key={index}
            avatar={
              <Avatar
                src={`http://localhost:3000${skill.skill_icon_image_path}`}
                slotProps={{
                  img: {
                    style: {
                      objectFit: "scale-down"
                    }
                  }
                }}
              />}
            label={skill.name}
            deleteIcon={
              onEdit ? (
                <Tooltip title={`Delete ${skill.name} skill`} placement="top">
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CloseRounded />
                  )}
                </Tooltip>
              ) : (<></>)
            }
            onDelete={deleteSKill(skill.id)}
            sx={{
              marginRight: "0.5em",
              ".MuiChip-deleteIcon": {
              }
            }}
          />
        ))}
      </Box>
      <Dialog
        open={Boolean(openDialog["skill"])}
        onClose={() => {
          onCloseDialog("skill")
        }}
        maxWidth={"md"}
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        <SkillFormDraft
          formValue={formValue}
          setFormValue={setFormValue}
          errMsg={errMsg}
          onSubmit={onSubmit}
          loading={loading}
          skillChecker={skillChecker}
        />
      </Dialog>
    </Box>
  )
}