import { AddRounded, CloseRounded, VerifiedUserRounded } from "@mui/icons-material";
import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, IconButton, InputBase, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { ChangeEvent, useEffect, useState } from "react";
import RequestAPI from "../../../../services/api/request";
import { GetSession, InputOnChangeV2, SelectOnChange } from "../../../../pages/global-helpers";
import { SocialDataType, SocialFormSchema, SocialFormType } from "../../../../pages/candidates/types";
import { HOST } from "../../../../pages/administrators/performance/[id]/constants";

export default function RegistrationStep3({
  setCurrentStep,
  setAlert
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number | undefined>>,
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>
}) {
  /* state */
  const [officeImages, setOfficeImages] = useState<{ filename: string, src: string }[]>([]);
  const [officeImagesFile, setOfficeImagesFile] = useState<File[]>([]);
  const [hovered, setHovered] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);
  // state -> social form
  const [formValue, setFormValue] = useState<SocialFormType[]>([]);
  const [socialForm, setSocialForm] = useState<{ social_id: number, url: string }>({ social_id: 0, url: "" });
  const [socialOption, setSocialOption] = useState<SocialDataType[]>([]);
  const [socialErrMsg, setSocialErrMsg] = useState<Record<string, string[]>>({});

  /* onSubmit */
  const onSubmit = () => async () => {
    setLoading(true);

    if (officeImagesFile.length === 0) {
      setLoading(false);
      return setAlert({ show: true, message: "please provide at least one office image!" });
    };

    if (formValue.length == 0) {
      setLoading(false);
      return setAlert({ show: true, message: "please provide at least one social!" });
    }
    const formDataBody = new FormData();
    officeImagesFile.forEach((image) => {
      formDataBody.append("office_images", image);
    })

    const token = GetSession("auth");
    const [successOfficeImages, failOfficeImages] = await RequestAPI.Send<any>(
      "/api/v1/employers/office-images/",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        },
        body: formDataBody,
      }
    );

    const [successSocials, failSocials] = await RequestAPI.JSONRequest<SocialFormType[]>(formValue).Send<any>(
      "/api/v1/employers/socials/",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );

    if (failOfficeImages) {
      setLoading(false);
      setAlert({ show: true, message: failOfficeImages.message });
    };
    if (failSocials) {
      setLoading(false);
      setAlert({ show: true, message: failSocials.message });
    };
    if (successOfficeImages) {
      setLoading(false);
      setAlert({ show: true, message: successOfficeImages["message"] })
    };
    if (successSocials) {
      setLoading(false);
      setAlert({ show: true, message: successSocials["message"] })
    };

    return setCurrentStep(undefined)
  };

  /* fetching */
  useEffect(() => {
    (async () => {
      const [data_socials, fail_socials] = await RequestAPI.Send<SocialDataType[]>("/api/v1/public/socials/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (fail_socials !== undefined) {
        return alert(fail_socials.message)
      } else if (data_socials !== undefined && data_socials != null) {
        return setSocialOption(data_socials);
      }
    })()
  }, []);
  return (
    <Box component={"div"}
      sx={{
        marginBottom: '2em',
        marginTop: "1.5em",
      }}
    >
      <Box component={"div"}>
        <Typography component={"p"} variant="subtitle1"
          sx={{
            marginBottom: "1em",
            fontWeight: 550,
            color: grey[600],
          }}
        >
          Office Images
        </Typography>
      </Box>
      <Box component={"div"} className="office_images_container"
        sx={{
          display: "flex",
          gap: "0.5em",
          flexWrap: "wrap",
        }}
      >
        {/* office image item */}
        {officeImages.map((image, index) => {
          const imageKey = `item${index}`
          return (
            <Box
              key={index}
              component={"div"}
              onMouseEnter={() => setHovered(prev => ({
                ...prev,
                [imageKey]: true
              }))}
              onMouseLeave={() => setHovered(prev => ({
                ...prev,
                [imageKey]: false
              }))}
              sx={{
                width: 150,
                height: 150,
                position: "relative"
              }}
            >
              <Box component={"img"}
                width={150}
                height={150}
                src={image.src}
                sx={{
                  objectFit: "cover"
                }}
              />
              {hovered[imageKey] && (
                <Box component={"div"}
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "start",
                    backgroundColor: "white",
                    opacity: "40%"
                  }}
                >
                  <IconButton size="small"
                    onClick={() => {
                      setOfficeImages(prev => {
                        prev.splice(index, 1)
                        return prev
                      })
                    }}
                  >
                    <CloseRounded fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          )
        })}
        {/* add button */}
        <Box component={"div"}
          sx={{
            width: 150,
            height: 150,
            border: "1px dashed " + grey[300],
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton component="label"
            htmlFor="office_image"
          >
            <AddRounded sx={{ color: grey[600] }} />
            <InputBase
              id="office_image"
              type="file"
              name="office_image"
              slotProps={{
                input: {
                  accept: "image/*"
                }
              }}
              sx={{
                height: '0px',
                width: '0px',
                opacity: 0
              }}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0]
                if (file) {
                  if (file.size > 1048576) {
                    return setAlert({ show: true, message: "your office image must less than 1MB" });
                  }

                  const fileURL = URL.createObjectURL(file);
                  setOfficeImagesFile(prev => ([...prev, file]));
                  return setOfficeImages(prev => ([...prev, { filename: file.name, src: fileURL }]));
                }
              }}
            />
          </IconButton>
        </Box>
      </Box>
      {/* Social Form */}
      <Box component={"div"}
        sx={{
          marginY: 2
        }}
      >
        <Typography component={"p"}
          variant="subtitle2"
          sx={{
            marginBottom: "0.7em",
            fontWeight: 550,
            color: grey[700],
          }}
        >
          Socials
        </Typography>
        <Box component={"div"} className="social-preview">
          <Grid container columnSpacing={2} rowSpacing={2}>
            {formValue.map((social, index) => {
              const socialValue = socialOption.find(option => option.id === social.social_id)
              return (
                <Grid item md={4} key={index}>
                  <Box component={"div"} className="social-item"
                    sx={{
                      display: "flex",
                      columnGap: 1.5,
                      padding: "0.5em",
                      backgroundColor: "#e6f2f0",
                      borderRadius: "0.3em"
                    }}
                  >
                    <Box
                      component={"img"}
                      src={`${HOST.main}${socialValue?.icon_image_path}`}
                      width={30}
                      height={30}
                      sx={{
                        // borderRadius: "0.5em",
                        objectFit: "scale-down"
                      }}
                    />
                    <Box component={"div"}
                      sx={{
                        flexGrow: 1
                      }}
                    >
                      <Typography component={"p"}
                        variant="subtitle2"
                      >
                        {socialValue?.name}
                      </Typography>
                      <Typography component={"a"}
                        variant="caption"
                        href={social.url}
                        target="_blank"
                        sx={{
                          whiteSpace: "initial",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: "1",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {social.url}
                      </Typography>
                    </Box>
                    <IconButton size="small"
                      sx={{
                        "&.MuiIconButton-root": {
                          height: "max-content"
                        }
                      }}
                      onClick={() => {
                        setFormValue(prev => {
                          prev.splice(index, 1)
                          return {
                            ...prev
                          }
                        })
                      }}
                    >
                      <CloseRounded fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Box>
        <Grid container columnSpacing={2}
          sx={{
            marginY: "1em"
          }}
        >
          <Grid item md={4}>
            <FormControl fullWidth>
              <InputLabel id="social-list"
                size="small"
                sx={{
                  color: socialErrMsg["social_id"] ? red[500] : undefined,
                  "&.Mui-focused": {
                    color: socialErrMsg["social_id"] ? red[500] : undefined,
                  }
                }}
              >
                Social
              </InputLabel>
              <Select
                labelId="social-list"
                name="social_id"
                label="Social"
                size="small"
                value={String(socialForm.social_id)}
                onChange={SelectOnChange(setSocialForm)}
                error={Boolean(socialErrMsg["social_id"])}
              >
                {socialOption.length == 0 && (
                  <MenuItem
                    value={0}
                    disabled
                  >
                    <Typography component={"div"} variant="subtitle2">
                      There is no socials as an option in master data.
                    </Typography>
                  </MenuItem>
                )}
                {socialOption.map((social, index) => (
                  <MenuItem
                    key={index}
                    value={social.id}
                    disabled={formValue.some(selected => selected.social_id === social.id)}
                  >
                    {social.name}
                  </MenuItem>
                ))}
              </Select>
              {socialErrMsg["social_id"] && (
                <FormHelperText sx={{ color: red[500] }}>{socialErrMsg["social_id"]}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={8}>
            <Box component={"div"}
              sx={{
                display: "flex",
                columnGap: 2
              }}
            >
              <TextField
                type="text"
                name="url"
                label="Url"
                placeholder="Enter your social media URL"
                size="small"
                autoComplete="off"
                fullWidth
                value={socialForm.url}
                onChange={InputOnChangeV2(setSocialForm)}
                error={Boolean(socialErrMsg["url"])}
                helperText={socialErrMsg["url"] ?? ""}
              />
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  const validate = SocialFormSchema.safeParse(socialForm)
                  if (!validate.success) {
                    const errMsg = validate.error.flatten().fieldErrors
                    return setSocialErrMsg(errMsg)
                  }
                  setSocialErrMsg({})
                  setSocialForm({ social_id: 0, url: "" })
                  setFormValue(prev => (
                    [...prev, socialForm]
                  ))
                }}
              >
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box component={"div"}
        sx={{
          display: "flex",
          justifyContent: "end"
        }}
      >
        <Button
          type="button"
          variant="contained"
          size="small"
          endIcon={loading ? (<CircularProgress color="secondary" size={15} />) : (<VerifiedUserRounded fontSize="small" />)}
          disabled={loading}
          sx={{
            minWidth: "10em",
          }}
          onClick={onSubmit()}
        >
          Finish
        </Button>
      </Box>
    </Box>
  )
}