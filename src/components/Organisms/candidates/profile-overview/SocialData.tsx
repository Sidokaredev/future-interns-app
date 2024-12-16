import { AddRounded, EditRounded } from "@mui/icons-material";
import { Box, Button, Dialog, IconButton, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { FormEvent, useEffect, useState } from "react";
import { SocialDataType, SocialFormType } from "../../../../pages/candidates/types";
import { GetSession } from "../../../../pages/global-helpers";
import RequestAPI from "../../../../services/api/request";
import SocialFormDraft from "./SocialFormDraft";

export default function SocialData({
  setAlert,
  openDialog,
  handleOpenDialog,
  onCloseDialog,
}: {
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>;
  openDialog: Record<string, boolean>;
  handleOpenDialog: (key: string) => void;
  onCloseDialog: (key: string) => void;
}) {
  /* state */
  const [socialsData, setSocialsData] = useState<SocialDataType[] | null>(null)
  const [formValue, setFormValue] = useState<SocialFormType[]>([])
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [refetch, setRefetch] = useState<boolean>(false)
  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(prev => ({
      ...prev,
      ["submit"]: true
    }))

    if (formValue.length === 0) {
      setLoading(prev => {
        prev["submit"] = false
        return {
          ...prev
        }
      })
      return setAlert({ show: true, message: "please add at least one social data!" })
    }

    const token = GetSession("auth")
    let requestMethod = onEdit ? "PATCH" : "POST";
    let requestBody = onEdit ? formValue[0] : formValue
    const [success, fail] = await RequestAPI.JSONRequest(requestBody).Send<string>("/api/v1/candidates/socials/", {
      method: requestMethod,
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    if (fail) {
      setLoading(prev => ({
        ...prev,
        ["submit"]: true
      }))
      return setAlert({ show: true, message: fail.message })
    }

    if (success) {
      setRefetch(prev => !prev)
      setLoading(prev => ({
        ...prev,
        ["submit"]: true
      }))
      onCloseDialog("social")
      return setAlert({ show: true, message: success })
    }
  }
  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<SocialDataType[]>("/api/v1/candidates/socials/", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
      if (fail) {
        return setAlert({ show: true, message: fail.message })
      }
      if (data) {
        return setSocialsData(data)
      }
    })()
  }, [refetch])
  return (
    <Box
      component={"div"}
      sx={{
        marginY: "1em",
      }}
    >
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
            color: grey[600],
            textAlign: "center",
          }}
        >
          Social
        </Typography>
        <Box component={"div"}
          sx={{
            display: "flex",
          }}
        >
          <IconButton size="small"
            onClick={() => {
              setFormValue([])
              handleOpenDialog("social")
            }}
          >
            <AddRounded fontSize="small" />
          </IconButton>
          {onEdit ? (
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => {
                setOnEdit(false)
              }}
            >
              Cancel
            </Button>
          ) : (
            <IconButton size="small"
              onClick={() => {
                setOnEdit(true)
              }}
            >
              <EditRounded fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
      <Box
        component={"div"}
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "0 0.5em",
        }}
      >
        {socialsData?.map((item, index) => (
          <Box
            key={index}
            component={onEdit ? "div" : "a"}
            href={item.url}
            target="_blank"
            sx={{
              width: onEdit ? undefined : "2.5em",
              height: onEdit ? undefined : "2.5em",
              display: "flex",
              justifyContent: onEdit ? undefined : "center",
              alignItems: "center",
              columnGap: "0.5em",
              paddingX: "0.5em",
              borderRadius: "0.3em",
              border: `0.1em solid ${grey[400]}`,
            }}
          >
            <Box component={"img"}
              src={`http://localhost:3000${item.icon_image_path}`}
              width={25}
              height={25}
              sx={{
                backgroundSize: "cover",
                objectFit: "scale-down"
              }}
            />
            {onEdit && (
              <IconButton size="small"
                onClick={() => {
                  setFormValue([{ social_id: item.id as number, url: item.url }])
                  handleOpenDialog("social")
                }}
              >
                <EditRounded fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>
      <Dialog
        open={Boolean(openDialog["social"])}
        onClose={() => {
          onCloseDialog("social")
        }}
        maxWidth={"md"}
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        <SocialFormDraft
          formValue={formValue}
          setFormValue={setFormValue}
          // errMsg={errMsg}
          onSubmit={onSubmit}
          loading={loading}
          onEdit={onEdit}
        />
      </Dialog>
    </Box >
  )
}