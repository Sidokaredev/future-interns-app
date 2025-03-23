import { CloseRounded } from "@mui/icons-material"
import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material"
import { grey, red } from "@mui/material/colors"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { SocialDataType, SocialFormSchema, SocialFormType } from "../../../../pages/candidates/types"
import RequestAPI from "../../../../services/api/request"
import { DEFAULT_SOCIAL_FORM } from "../../../../pages/candidates/constants"
import { InputOnChangeV2, SelectOnChange } from "../../../../pages/global-helpers"
import { HOST } from "../../../../pages/administrators/performance/[id]/constants"

export default function SocialForm({
  formValue,
  setFormValue,
  // errMsg,
  onSubmit,
  loading,
  onEdit,
}: {
  formValue: SocialFormType[];
  setFormValue: React.Dispatch<React.SetStateAction<SocialFormType[]>>;
  // errMsg: Record<number, Record<string, string>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  loading: Record<string, boolean>;
  onEdit: boolean;
}) {
  /* state */
  const [socialOption, setSocialOption] = useState<SocialDataType[] | null>(null)
  let defaultValue = onEdit ? formValue[0] : DEFAULT_SOCIAL_FORM
  const [socialFormValue, setSocialFormValue] = useState<SocialFormType>(defaultValue)
  const [socialErrMsg, setSocialErrMsg] = useState<{ [key: string]: string[] }>({})
  /* event handler */
  const inputOnChangeUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValue(prev => {
      prev[0] = {
        ...prev[0],
        [event.target.name]: event.target.value
      }
      return [
        ...prev
      ]
    })
  }
  const selectOnChangeUpdate = (event: SelectChangeEvent) => {
    setFormValue(prev => {
      prev[0] = {
        ...prev[0],
        [event.target.name]: Number(event.target.value)
      }
      return [
        ...prev
      ]
    })
  }
  /* fetching */
  useEffect(() => {
    (async () => {
      setSocialOption([{ id: 0, name: "Loading...", icon_image_path: "", url: "" }])
      const [data, fail] = await RequestAPI.Send<SocialDataType[]>("/api/v1/public/socials/", {
        method: "GET",
      })
      if (fail) {
        return alert("social option data :" + fail.message)
      }
      if (data) {
        return setSocialOption(data)
      }
    })()
  }, [])
  return (
    <Box component={"div"}>
      <Typography component={"p"}
        variant="subtitle2"
        sx={{
          marginBottom: "1em",
          fontWeight: 550,
          color: grey[700],
        }}
      >
        Socials
      </Typography>
      <Box component={"div"} className="social-preview">
        <Grid container columnSpacing={2} rowSpacing={2}>
          {formValue.map((social, index) => {
            const socialValue = socialOption?.find(option => option.id === social.social_id)
            if (onEdit) {
              return
            }
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
                        prev.splice(index, 1)
                        return [
                          ...prev
                        ]
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
              disabled={onEdit}
              value={!onEdit ? String(socialFormValue.social_id) : String(formValue[0].social_id)}
              onChange={!onEdit ? SelectOnChange(setSocialFormValue) : selectOnChangeUpdate}
              error={Boolean(socialErrMsg["social_id"])}
            >
              {socialOption?.map((social, index) => (
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
              value={!onEdit ? socialFormValue.url : formValue[0].url}
              onChange={!onEdit ? InputOnChangeV2(setSocialFormValue) : inputOnChangeUpdate}
              error={Boolean(socialErrMsg["url"])}
              helperText={socialErrMsg["url"] ?? ""}
            />
            {!onEdit && (
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  const validate = SocialFormSchema.safeParse(socialFormValue)
                  if (!validate.success) {
                    const errMsg = validate.error.flatten().fieldErrors
                    return setSocialErrMsg(errMsg)
                  }
                  setSocialErrMsg({})
                  setFormValue(prev => ([...prev, socialFormValue]))
                  setSocialFormValue(DEFAULT_SOCIAL_FORM)
                }}
              >
                Add
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
      <form onSubmit={onSubmit}>
        <Box component={"div"}
          sx={{
            display: "flex",
            justifyContent: { md: "end" }
          }}
        >
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={loading["submit"]}
            sx={{
              minWidth: { xs: "100%", md: "10em" }
            }}
          >
            {loading["submit"] ? (
              <CircularProgress size={20} />
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
      </form>
    </Box>
  )
}