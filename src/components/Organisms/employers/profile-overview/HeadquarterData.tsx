import { AddRounded, DeleteRounded, EditRounded, LocationOnRounded } from "@mui/icons-material";
import { Box, Button, CircularProgress, Dialog, Grid, IconButton, Typography } from "@mui/material";
import { grey, lightBlue, red } from "@mui/material/colors";
import React, { FormEvent, useEffect, useState } from "react";
import { HeadquarterFormSchema, HeadquarterFormType, HeadquarterType } from "../../../../pages/employers/types";
import { GetSession } from "../../../../pages/global-helpers";
import RequestAPI from "../../../../services/api/request";
import { DEFAULT_HEADQUARTER_FORM } from "../../../../pages/employers/constants";
import HeadquarterForm from "./HeadquarterForm";
import SimpleEmphasis from "../../../Molecules/Texts/SimpleEmphasis";

export default function HeadquarterData({
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
  const [headquarters, setHeadquarters] = useState<HeadquarterType[]>([]);
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataAction, setDataAction] = useState<boolean>(false);
  // state -> Headquarter Form
  const [formValue, setFormValue] = useState<HeadquarterFormType>(DEFAULT_HEADQUARTER_FORM);
  const [errMsg, setErrMsg] = useState<{ [key: string]: string[] }>({});

  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const validate = HeadquarterFormSchema.safeParse(formValue);
    if (!validate.success) {
      setLoading(false);
      const errSchema = validate.error.flatten().fieldErrors;
      setErrMsg(errSchema);
      return setAlert({ show: true, message: "please follow the form rules!" });
    } else {
      setErrMsg({});
    };

    const token = GetSession("auth");
    const endpoint = onEdit ? "/employers/headquarters/" + formValue.id : "/employers/headquarters/";
    const [success, fail] = await RequestAPI.FormDataRequest<HeadquarterFormType>(formValue).Send<string>(
      endpoint,
      {
        method: onEdit ? "PATCH" : "POST",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(false);
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(false);
      setDataAction(prev => !prev);
      setFormValue(DEFAULT_HEADQUARTER_FORM);
      onCloseDialog("headquarter");
      return setAlert({ show: true, message: success });
    };
  };
  /* onDelete */
  const onDelete = async (addressID: number) => {
    setLoading(true);
    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.Send<string>(
      "/employers/headquarters/" + addressID,
      {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(false);
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(false);
      setDataAction(prev => !prev);
      onCloseDialog("delete-headquarter");
      return setAlert({ show: true, message: success });
    };
  };

  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<HeadquarterType[]>(
        "/employers/headquarters/",
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );
      if (fail) {
        return alert(fail.message);
      };
      if (data) {
        return setHeadquarters(data);
      }
    })();
  }, [dataAction]);
  return (
    <Box component={"div"}>
      <Box component={"div"}
        sx={{
          marginTop: "1.5em",
          marginBottom: "1em",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Typography component={"p"} variant="subtitle1"
          sx={{
            fontWeight: 550,
            color: grey[800]
          }}
        >
          Informasi Kantor Perusahaan
        </Typography>
        <Box component={"div"}>
          {!onEdit && (
            <>
              <IconButton size="small"
                onClick={() => {
                  handleOpenDialog("headquarter");
                }}
              >
                <AddRounded fontSize="small" />
              </IconButton>
              <IconButton size="small"
                onClick={() => {
                  setOnEdit(true);
                }}
              >
                <EditRounded fontSize="small" />
              </IconButton>
            </>
          )}
          {onEdit && (
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => setOnEdit(false)}
            >
              Batal
            </Button>
          )}
        </Box>
      </Box>
      <Grid container spacing={1}>
        {/* Head Office */}
        {headquarters.filter(value => value.type === "Head Office").map((value, index) => {
          return (
            <Grid key={index} item xs={12}
            >
              <Box component={"div"}
                sx={{
                  display: "flex",
                  columnGap: "0.5em",
                }}
              >
                <Box component={"div"}
                  sx={{
                    padding: "1em 2em"
                  }}
                >
                  <Box component={"div"}
                    sx={{
                      width: "2.5em",
                      height: "2.5em",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "1.5em",
                      backgroundColor: red[100]
                    }}
                  >
                    <LocationOnRounded fontSize="medium" sx={{ color: red[600] }} />
                  </Box>
                </Box>
                <Box component={"div"}
                  sx={{
                    flexGrow: 1,
                    padding: "0em 0.5em"
                  }}
                >
                  <Box component={"div"}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography component={"p"} variant="subtitle2"
                      sx={{
                        fontWeight: 550,
                        color: grey[800]
                      }}
                    >
                      {`${value.name}`}
                    </Typography>
                    {onEdit && (
                      <Box component={"div"}>
                        <IconButton size="small"
                          disabled={loading}
                          onClick={() => {
                            setFormValue({ type: value.type, name: value.name, ...value.address });
                            handleOpenDialog("delete-headquarter");
                          }}

                        >
                          <DeleteRounded fontSize="small" sx={{ color: loading ? grey[400] : red[400] }} />
                        </IconButton>
                        <IconButton size="small"
                          disabled={loading}
                          onClick={() => {
                            setFormValue({ ...value.address, name: value.name, type: value.type })
                            handleOpenDialog("headquarter");
                          }}
                        >
                          <EditRounded fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Typography component={"p"} variant="body2"
                    sx={{
                      color: grey[600]
                    }}
                  >
                    {`
                    ${value.address.street},
                    ${value.address.neighborhood !== "" ? " " + value.address.neighborhood + ", " : ""}
                    ${value.address.rural_area !== "" ? " " + value.address.rural_area + ", " : ""}
                    ${value.address.sub_district}, ${value.address.city}, ${value.address.province}, ${value.address.country}. (${value.address.postal_code})
                    `}
                  </Typography>
                  <Box component={"div"}
                    sx={{
                      marginY: "1em"
                    }}
                  >
                    <Typography component={"div"} variant="caption"
                      sx={{ fontWeight: 550, color: lightBlue[700], textTransform: "uppercase" }}
                    >
                      {value.type}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          )
        })}
        {/* Branch Office */}
        {headquarters.filter(value => value.type === "Branch Office").map((value, index) => {
          return (
            <Grid key={index} item xs={12} sm={6}>
              <Box component={"div"}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "0.7em",
                  border: "1px solid " + grey[300],
                  borderRadius: "0.3em",
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
                  "&:hover": {
                    boxShadow: "none",
                  },
                  transition: "box-shadow ease 0.5s"
                }}
              >
                <Box component={"div"}>
                  <Typography component={"p"} variant="subtitle2"
                    sx={{
                      fontWeight: 550,
                      color: grey[800]
                    }}
                  >
                    {value.name}
                  </Typography>
                  <Typography component={"p"} variant="body2"
                    sx={{
                      color: grey[600]
                    }}
                  >
                    {`
                  ${value.address.street},
                  ${value.address.neighborhood !== "" ? " " + value.address.neighborhood + ", " : ""}
                  ${value.address.rural_area !== "" ? " " + value.address.rural_area + ", " : ""}
                  ${value.address.sub_district}, ${value.address.city}, ${value.address.province}, ${value.address.country}. (${value.address.postal_code})
                  `}
                  </Typography>

                </Box>
                <Box component={"div"}
                  sx={{
                    marginTop: "1em",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "end",
                  }}
                >
                  <Typography component={"div"} variant="caption"
                    sx={{ fontWeight: 550, color: grey[700], textTransform: "uppercase" }}
                  >
                    {value.type}
                  </Typography>
                  {onEdit && (
                    <Box component={"div"}>
                      <IconButton size="small"
                        disabled={loading}
                        onClick={() => {
                          setFormValue({ type: value.type, name: value.name, ...value.address });
                          handleOpenDialog("delete-headquarter");
                        }}
                      >
                        <DeleteRounded fontSize="small" sx={{ color: loading ? grey[400] : red[400] }} />
                      </IconButton>
                      <IconButton size="small"
                        disabled={loading}
                        onClick={() => {
                          setFormValue({ ...value.address, name: value.name, type: value.type })
                          handleOpenDialog("headquarter");
                        }}
                      >
                        <EditRounded fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
          )
        })}
      </Grid>
      {/* Headquarter Form */}
      <Dialog
        open={Boolean(openDialog["headquarter"])}
        onClose={() => {
          onCloseDialog("headquarter");
          setFormValue(DEFAULT_HEADQUARTER_FORM);
        }}
        maxWidth={"lg"}
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        <HeadquarterForm
          formValue={formValue}
          setFormValue={setFormValue}
          errMsg={errMsg}
          onSubmit={onSubmit}
          loading={loading}
        />
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(openDialog["delete-headquarter"])}
        onClose={() => {
          setFormValue(DEFAULT_HEADQUARTER_FORM)
          onCloseDialog("delete-headquarter");
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
            informasi kantor {formValue.type + " : " + formValue.name} ?
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
              setFormValue(DEFAULT_HEADQUARTER_FORM)
              onCloseDialog("delete-headquarter")
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