import { AddRounded, DeleteRounded, EditRounded } from "@mui/icons-material";
import { Box, Button, CircularProgress, Dialog, IconButton, Typography } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { SocialDataType, SocialFormSchema, SocialFormType } from "../../../../pages/candidates/types";
import { FormEvent, useEffect, useState } from "react";
import { GetSession } from "../../../../pages/global-helpers";
import RequestAPI from "../../../../services/api/request";
import SocialForm from "../../candidates/profile-overview/SocialForm";
import SimpleEmphasis from "../../../Molecules/Texts/SimpleEmphasis";
import { HOST } from "../../../../pages/administrators/performance/[id]/constants";

export default function EmployerSocialData({
  setAlert,
  openDialog,
  handleOpenDialog,
  onCloseDialog
}: {
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean; message: string }>>;
  openDialog: Record<string, boolean>;
  handleOpenDialog: (key: string) => void;
  onCloseDialog: (key: string) => void;
}) {
  /* state */
  const [socialsData, setSocialsData] = useState<SocialDataType[] | null>(null);
  const [dataAction, setDataAction] = useState<boolean>(false);
  // state -> Social Form
  const [formValue, setFormValue] = useState<SocialFormType[]>([]);
  const [selectedSocial, setSelectedSocial] = useState<{ id: number, name: string } | undefined>(undefined);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [onEdit, setOnEdit] = useState<boolean>(false);

  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(prev => ({ ...prev, ["submit"]: true }));

    if (onEdit) {
      const validate = SocialFormSchema.safeParse(formValue[0]);
      if (!validate.success) {
        setLoading(prev => ({ ...prev, ["submit"]: false }));
        const errSchema = validate.error.flatten().fieldErrors;
        return setAlert({ show: true, message: errSchema["url"]?.toString() as string })
      };
    };
    if (formValue.length === 0) {
      setLoading(prev => ({ ...prev, ["submit"]: false }));
      return setAlert({ show: true, message: "please add social first!" });
    };

    const token = GetSession("auth");
    const requestBody = onEdit ? formValue[0] : formValue;
    const [success, fail] = await RequestAPI.JSONRequest<any>(requestBody).Send<string>(
      "/api/v1/employers/socials/",
      {
        method: onEdit ? "PATCH" : "POST",
        headers: {
          "Authorization": "Bearer " + token,
        }
      }
    );
    if (fail) {
      setLoading(prev => ({ ...prev, ["submit"]: false }));
      if (fail.error === "duplicated key not allowed") {
        return setAlert({ show: true, message: "You cannot have multiple data for the same social platform" });
      }
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(prev => ({ ...prev, ["submit"]: false }));
      setDataAction(prev => !prev);
      onCloseDialog("social");
      return setAlert({ show: true, message: success });
    };
  };
  /* onDelete */
  const onDelete = async (socialID: number) => {
    setLoading(prev => ({ ...prev, ["delete-social"]: true }));
    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.Send<string>(
      "/api/v1/employers/socials/" + socialID,
      {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token,
        }
      }
    );
    if (fail) {
      setLoading(prev => ({ ...prev, ["delete-social"]: false }));
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(prev => ({ ...prev, ["delete-social"]: false }));
      setDataAction(prev => !prev);
      onCloseDialog("delete-social");
      return setAlert({ show: true, message: success });
    };
  }

  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<SocialDataType[]>(
        "/api/v1/employers/socials/",
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );
      if (fail) {
        return setAlert({ show: true, message: fail.message });
      }
      if (data) {
        return setSocialsData(data);
      }
    })();
  }, [dataAction]);
  return (
    <Box
      component={"div"}
      sx={{
        marginY: "1em",
      }}
    >
      {/* Title */}
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
      {/* Current Socials Data */}
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
              src={`${HOST.main}${item.icon_image_path}`}
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
            Are you sure want to
            <SimpleEmphasis text={" delete "} textColor="red" />
            your Social
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
            No
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
            ) : "Yes"}
          </Button>
        </Box>
      </Dialog>
    </Box >
  )
}