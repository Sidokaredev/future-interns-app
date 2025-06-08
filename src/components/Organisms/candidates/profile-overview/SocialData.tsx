import { AddRounded, DeleteRounded, EditRounded } from "@mui/icons-material";
import { Box, Button, CircularProgress, Dialog, IconButton, Typography } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { FormEvent, useEffect, useState } from "react";
import { SocialDataType, SocialFormType } from "../../../../pages/candidates/types";
import { GetSession } from "../../../../pages/global-helpers";
import RequestAPI from "../../../../services/api/request";
import SocialForm from "./SocialForm";
import SimpleEmphasis from "../../../Molecules/Texts/SimpleEmphasis";
import { HOST } from "../../../../pages/administrators/performance/[id]/constants";

export default function CandidateSocialData({
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
  const [refetch, setRefetch] = useState<boolean>(false);
  const [selectedSocial, setSelectedSocial] = useState<{ id: number, name: string } | undefined>(undefined);
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
    const [success, fail] = await RequestAPI.JSONRequest(requestBody).Send<string>("/candidates/socials/", {
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
  /* onDelete */
  const onDelete = async (socialId: number) => {
    setLoading(prev => ({
      ...prev,
      ["delete-social"]: true,
    }));
    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.Send<string>(
      "/candidates/socials/" + socialId,
      {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token,
        }
      }
    );

    if (fail) {
      setLoading(prev => ({
        ...prev,
        ["delete-social"]: false,
      }));
      setSelectedSocial(undefined);
      setAlert({ show: true, message: fail.message });
      return onCloseDialog("delete-social");
    };

    if (success) {
      setLoading(prev => ({ ...prev, ["delete-social"]: false }));
      setSelectedSocial(undefined);
      onCloseDialog("delete-social");
      setAlert({ show: true, message: success });
      return setRefetch(prev => !prev);
    };
  }
  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<SocialDataType[]>("/candidates/socials/", {
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
          Sosial Media
        </Typography>
        <Box component={"div"}
          sx={{
            display: "flex",
          }}
        >
          {!onEdit && (
            <IconButton size="small"
              onClick={() => {
                setFormValue([])
                handleOpenDialog("social")
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
                setOnEdit(false)
              }}
            >
              Batal
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
              src={`${HOST.main}${item.icon_image_path.replace("/api/v1", "")}`}
              width={25}
              height={25}
              sx={{
                backgroundSize: "cover",
                objectFit: "scale-down"
              }}
            />
            {onEdit && (
              <Box component={"div"}>
                {socialsData.length > 1 && index != 0 && (
                  <IconButton size="small"
                    onClick={() => {
                      setSelectedSocial({ id: item.id as number, name: item.name });
                      handleOpenDialog("delete-social")
                    }}
                  >
                    <DeleteRounded fontSize="small" sx={{ color: red[400] }} />
                  </IconButton>
                )}
                <IconButton size="small"
                  onClick={() => {
                    setFormValue([{ social_id: item.id as number, url: item.url }])
                    handleOpenDialog("social")
                  }}
                >
                  <EditRounded fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        ))}
      </Box>
      {/* Dialog Social Form */}
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
        <SocialForm
          formValue={formValue}
          setFormValue={setFormValue}
          // errMsg={errMsg}
          onSubmit={onSubmit}
          loading={loading}
          onEdit={onEdit}
        />
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(openDialog["delete-social"])}
        onClose={() => {
          setSelectedSocial(undefined);
          onCloseDialog("delete-social");
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
            Apakah anda yakin ingin
            <SimpleEmphasis text={" menghapus "} textColor="red" />
            data sosial media
            <SimpleEmphasis text={" " + selectedSocial?.name} /> ?
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
            disabled={loading["delete-social"]}
            onClick={() => {
              setSelectedSocial(undefined);
              onCloseDialog("delete-social")
            }}
          >
            Batalkan
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            sx={{
              minWidth: "8em"
            }}
            disabled={loading["delete-social"]}
            onClick={() => {
              onDelete(selectedSocial?.id as number)
            }}
          >
            {loading["delete-social"] ? (
              <CircularProgress size={20} />
            ) : "Lanjutkan"}
          </Button>
        </Box>
      </Dialog>
    </Box >
  )
}