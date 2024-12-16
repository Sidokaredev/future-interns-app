import { CloseRounded } from "@mui/icons-material";
import { Box, Button, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { ExperienceFormType, SocialFormSchema, SocialFormType, SocialType } from "../../../../pages/candidates/types";
import { useEffect, useState } from "react";
import { InputOnChangeV2, SelectOnChange } from "../../../../pages/global-helpers";
import RequestAPI from "../../../../services/api/request";

export default function SocialsForm({
  formValue,
  setFormValue
}: {
  formValue: SocialFormType[]
  setFormValue: React.Dispatch<React.SetStateAction<{ experience: ExperienceFormType, socials: SocialFormType[] }>>
}) {
  /* state */
  const [socialForm, setSocialForm] = useState<{ social_id: number, url: string }>({ social_id: 0, url: "" })
  const [socialOption, setSocialOption] = useState<SocialType[]>([])
  const [socialErrMsg, setSocialErrMsg] = useState<Record<string, string[]>>({})
  /* constant */

  useEffect(() => {
    (async () => {
      const [data_socials, fail_socials] = await RequestAPI.Send<SocialType[]>("/api/v1/public/socials/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (fail_socials !== undefined) {
        return alert(fail_socials.message)
      } else if (data_socials !== undefined) {
        return setSocialOption(data_socials)
      }
    })()
  }, [])
  return (
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
                    src={`http://localhost:3000${socialValue?.icon_image_path}`}
                    width={30}
                    height={30}
                    sx={{
                      borderRadius: "0.5em"
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
                        prev.socials.splice(index, 1)
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
                setFormValue(prev => ({
                  ...prev,
                  socials: [...prev.socials, socialForm]
                }))
              }}
            >
              Add
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}