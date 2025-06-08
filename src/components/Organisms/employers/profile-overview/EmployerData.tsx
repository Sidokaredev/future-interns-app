import { Business, DomainRounded, EditRounded, GroupsRounded, HomeWorkRounded, LanguageRounded, PersonPinRounded, Place } from "@mui/icons-material";
import { Avatar, Box, Dialog, Grid, IconButton, Snackbar, Stack, Tooltip, Typography } from "@mui/material";
import { grey, lightBlue } from "@mui/material/colors";
import { FormEvent, useEffect, useState } from "react";
import { EmployerProfileFormSchema, EmployerProfileFormType, EmployerType } from "../../../../pages/employers/types";
import { DEFAULT_EMPLOYER_FORM } from "../../../../pages/employers/constants";
import { GetSession, onCloseSnackbar } from "../../../../pages/global-helpers";
import RequestAPI from "../../../../services/api/request";
import OfficeImagesData from "./OfficeImagesData";
import EmployerSocialData from "./SocialData";
import HeadquarterData from "./HeadquarterData";
import EmployerForm from "./EmployerForm";
import { HOST } from "../../../../pages/administrators/performance/[id]/constants";

export default function EmployerData() {
  /* state */
  const [employerData, setEmployerData] = useState<EmployerType>(DEFAULT_EMPLOYER_FORM);
  const [alert, setAlert] = useState<{ show: boolean, message: string }>({ show: false, message: "" });
  // state -> Dialog
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  // state -> Employer Form
  const [formValue, setFormValue] = useState<EmployerProfileFormType & { background_profile_image_path?: string | null; profile_image_path?: string | null; }>(DEFAULT_EMPLOYER_FORM);
  const [errMsg, setErrMsg] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [dataAction, setDataAction] = useState<boolean>(false);

  /* handler */
  const handleOpenDialog = (key: string) => {
    setOpenDialog(prev => ({ ...prev, [key]: true }));
  };
  const onCloseDialog = (key: string) => {
    setOpenDialog(prev => ({ ...prev, [key]: false }));
  };

  /* onSubmit */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const validate = EmployerProfileFormSchema.safeParse(formValue);
    if (!validate.success) {
      setLoading(false);
      const errSchema = validate.error.flatten().fieldErrors
      setErrMsg(errSchema);
      return setAlert({ show: true, message: "please follow the form rules!" });
    } else {
      setErrMsg({});
    };

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.FormDataRequest<any>(formValue).Send<any>(
      "/employers/",
      {
        method: "PATCH",
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
      onCloseDialog("profile");
      setAlert({ show: true, message: success["message"] });
      return setDataAction(prev => !prev);
    };
  };

  /* fetching */
  useEffect(() => {
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<EmployerType>(
        "/employers/",
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      )
      if (fail) {
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setEmployerData(data)
      };
    })();
  }, [dataAction])
  return (
    <>
      <Grid container spacing={2}>
        {/* Default Notification */}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={alert.show}
          message={alert.message}
          autoHideDuration={3000}
          onClose={onCloseSnackbar(setAlert)}
        />
        {/* Employer Profile and Background Image */}
        <Grid item xs={12} md={12}>
          <Box
            component={"div"}
            sx={{
              width: "100%",
              height: {
                xs: "15em",
                md: "20em",
              },
              backgroundImage: `url('${HOST.main}${employerData.background_profile_image_path?.replace("/api/v1", "")}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "0.3em",
            }}
          />
          <Box
            component={"div"}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              component={"div"}
              sx={{
                width: {
                  xs: "95%",
                  md: "80%",
                },
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "0 1em",
                marginTop: "-3.5em",
                paddingY: "0.7em",
                paddingX: "1em",
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
                borderRadius: "0.3em",
                backgroundColor: "white",
              }}
            >
              <Avatar
                alt="company-logo"
                // src={`${HOST.main}${employerData.profile_image_path?.replace("/api/v1", "")}?time=${new Date(Date.now()).getMilliseconds()}`}
                src={`${HOST.main}${employerData.profile_image_path?.replace("/api/v1", "")}`}
                sx={{
                  width: {
                    xs: "3em",
                    md: "4em",
                  },
                  height: {
                    xs: "3em",
                    md: "4em",
                  },
                }}
              />
              <Box component={"div"} sx={{ flexGrow: 1 }}>
                <Typography
                  variant={"h6"}
                  sx={{
                    fontWeight: 550,
                    fontSize: {
                      xs: "medium",
                      md: "normal",
                    },
                    color: grey[800],
                  }}
                >
                  {employerData.name}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0 1.5em" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: {
                        xs: "start",
                        md: "end",
                      },
                    }}
                  >
                    <Business
                      fontSize="small"
                      sx={{
                        color: "#06816d",
                        fontSize: {
                          xs: "1em",
                          md: "1.25em",
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: {
                          xs: 550,
                          md: 550,
                        },
                        fontSize: {
                          xs: "x-small",
                          md: "0.8em",
                        },
                        color: grey[600],
                        marginLeft: "0.5em",
                      }}
                    >
                      {employerData.legal_name}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: {
                        xs: "start",
                        md: "end",
                      },
                    }}
                  >
                    <Place
                      fontSize="small"
                      sx={{
                        color: "#06816d",
                        fontSize: {
                          xs: "1em",
                          md: "1.25em",
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: {
                          xs: 550,
                          md: 550,
                        },
                        fontSize: {
                          xs: "x-small",
                          md: "0.8em",
                        },
                        color: grey[600],
                        marginLeft: "0.5em",
                      }}
                    >
                      {employerData.location}, Indonesia
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {/* Edit Button Trigger */}
              <Box component={"div"}>
                <Tooltip title={"Ubah Profil"} placement="right-start">
                  <IconButton size="small"
                    onClick={() => {
                      setFormValue(employerData);
                      handleOpenDialog("profile");
                    }}
                  >
                    <EditRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Grid>
        {/* Employer Data */}
        <Grid item xs={12} md={8}>
          {/* Description */}
          <Box
            component={"div"}
            sx={{
              marginTop: {
                xs: "1em",
                md: "2em",
              },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 550, color: grey[800], marginBottom: "0.5em" }}
            >
              Tentang Perusahaan
            </Typography>
            <Typography variant="body1" sx={{ color: grey[600], whiteSpace: "pre-line" }}>
              {employerData.description}
            </Typography>
          </Box>
          {/* Headquarter */}
          <HeadquarterData
            setAlert={setAlert}
            openDialog={openDialog}
            handleOpenDialog={handleOpenDialog}
            onCloseDialog={onCloseDialog}
          />
          {/* Office Images */}
          <OfficeImagesData
            setAlert={setAlert}
            openDialog={openDialog}
            handleOpenDialog={handleOpenDialog}
            onCloseDialog={onCloseDialog}
          />
        </Grid>
        {/* Employer Information, Employer Socials */}
        <Grid item xs={12} md={4}>
          <Box
            component={"div"}
            sx={{
              marginTop: {
                xs: "0em",
                md: "2em",
              },
              position: "sticky",
              top: "3.5em",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 550, color: grey[800] }}
            >
              Informasi Perusahaan
            </Typography>
            <Box component={"div"} sx={{ marginTop: "0.5em" }}>
              <Stack
                direction={"column"}
                spacing={1}
                sx={{
                  border: "1px solid " + grey[300],
                  padding: "0.5em",
                  borderRadius: "0.3em",
                }}
              >
                {[
                  {
                    icon: (
                      <DomainRounded
                        fontSize="small"
                        sx={{ marginRight: "0.5em", color: grey[400] }}
                      />
                    ),
                    label: "Didirikan pada",
                    value: employerData.founded,
                  },
                  {
                    icon: (
                      <PersonPinRounded
                        fontSize="small"
                        sx={{ marginRight: "0.5em", color: grey[400] }}
                      />
                    ),
                    label: "Pendiri",
                    value: employerData.founder,
                  },
                  {
                    icon: (
                      <HomeWorkRounded
                        fontSize="small"
                        sx={{ marginRight: "0.5em", color: grey[400] }}
                      />
                    ),
                    label: "Lokasi Kantor",
                    value: employerData.location,
                  },
                  {
                    icon: (
                      <GroupsRounded
                        fontSize="small"
                        sx={{ marginRight: "0.5em", color: grey[400] }}
                      />
                    ),
                    label: "Jumlah Pegawai",
                    value: employerData.total_of_employee,
                  },
                  {
                    icon: (
                      <LanguageRounded
                        fontSize="small"
                        sx={{ marginRight: "0.5em", color: grey[400] }}
                      />
                    ),
                    label: "Website",
                    value: employerData.website,
                  },
                ].map((data, index) => (
                  <Box
                    key={index}
                    component={"div"}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box
                      component={"div"}
                      className="label"
                      sx={{
                        minWidth: "8em",
                        display: "flex",
                      }}
                    >
                      {data.icon}
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 550,
                          color: grey[400],
                        }}
                      >
                        {data.label}
                      </Typography>
                    </Box>
                    <Typography
                      component={data.label == "Website" ? "a" : "p"}
                      href={data.label == "Website" && typeof data.value == "string" ? data.value : undefined}
                      target={data.label == "Website" && typeof data.value == "string" ? "_blank" : undefined}
                      variant="subtitle2"
                      textAlign={"end"}
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: data.label == "Website" ? lightBlue[800] : grey[600],
                      }}
                    >
                      {data.value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
            {/* Employer Socials Data */}
            <EmployerSocialData
              openDialog={openDialog}
              handleOpenDialog={handleOpenDialog}
              onCloseDialog={onCloseDialog}
              setAlert={setAlert}
            />
          </Box>
        </Grid>
      </Grid>
      {/* Dialog Update Employer Data */}
      <Dialog
        open={Boolean(openDialog["profile"])}
        onClose={() => {
          setFormValue(DEFAULT_EMPLOYER_FORM);
          onCloseDialog("profile");
        }}
        maxWidth={"lg"}
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        {/* Profile Form */}
        <EmployerForm
          formValue={formValue}
          setFormValue={setFormValue}
          errMsg={errMsg}
          onSubmit={onSubmit}
          loading={loading}
        />
      </Dialog>
    </>
  )
}