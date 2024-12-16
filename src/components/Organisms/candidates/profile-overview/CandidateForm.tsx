import { UploadRounded } from "@mui/icons-material";
import { Avatar, Box, Button, FormHelperText, Grid, InputBase, TextField, Typography } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { CandidateAddressFormType, CandidateFormType } from "../../../../pages/candidates/types";
import { DatePickerOnChange, FileOnChange, InputOnChangeV2 } from "../../../../pages/global-helpers";
import dayjs from "dayjs";

export default function CandidateForm({
  formValue,
  setFormValue,
  errMsg
}: {
  formValue: CandidateFormType
  setFormValue: React.Dispatch<React.SetStateAction<CandidateAddressFormType>>
  errMsg: { [key: string]: string[] }
}) {
  /* state */
  const [filePreview, setFilePreview] = useState<Record<string, { src: string, filename: string }>>({})
  const [errMsgFile, setErrMsgFile] = useState<Record<string, string>>({})
  return (
    < Box component={"div"}
      className="candidate-form-container"
      sx={{
        marginBottom: "1em"
      }
      }
    >
      {/* profile and background image container */}
      < Box component={"div"} >
        <Box
          component={"img"}
          // alt="background_profile"
          src={filePreview["background_profile_img"] ? filePreview["background_profile_img"].src : "https://placehold.co/1152x240"}
          sx={{
            width: "100%",
            height: { xs: "10em", md: "15em" },
            borderRadius: "0.5em",
            backgroundSize: "cover",
            // next learn about background positioning
            objectFit: "cover"
          }}
        />
        <Box
          component={"div"}
          sx={{
            marginTop: { xs: "-10%", sm: "-7%", md: "-5%" },
            marginBottom: { xs: "1em", md: "1.5em" },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "start", sm: "end" },
            rowGap: {
              xs: "1em",
              sm: 0
            }
          }}
        >
          <Avatar
            alt="candidate-profile"
            src={filePreview["profile_img"] ? filePreview["profile_img"].src : "https://placehold.co/50x50"}
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
              width: "100%",
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              marginBottom: { xs: "-0.5em", sm: "-0.7em", md: "-0.5em", lg: 0 },
            }}
          >
            <Box component={"div"}
              sx={{
                display: "flex",
                flexGrow: 1,
                flexDirection: { xs: "column", lg: "row" },
                rowGap: "0.5em",
                justifyContent: "space-evenly",
              }}
            >
              <Box component={"div"}
                className="profile-image"
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  columnGap: 3,
                  rowGap: 0.5
                }}
              >
                <Button
                  component={"label"}
                  htmlFor="profile_img"
                  variant="outlined"
                  startIcon={<UploadRounded />}
                  size="medium"
                  color={errMsgFile["profile_img"] ? "error" : "primary"}
                  sx={{
                    minWidth: { xs: "100%", sm: "13em" },
                  }}
                >
                  <InputBase
                    id="profile_img"
                    type="file"
                    name="profile_img"
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
                    onChange={FileOnChange(setFilePreview, setFormValue, setErrMsgFile, "candidate")}
                  />
                  Profile Image
                </Button>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontStyle: "italic",
                    color: errMsgFile["profile_img"] ? red[500] : grey[700],
                  }}
                >
                  {errMsgFile["profile_img"] ? errMsgFile["profile_img"] :
                    filePreview["profile_img"] ? filePreview["profile_img"].filename : "no image selected"}
                </Typography>
              </Box>
              <Box component={"div"}
                className="background-profile"
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  columnGap: 3,
                  rowGap: 0.5
                }}
              >
                <Button
                  component={"label"}
                  htmlFor="background_profile_img"
                  variant="outlined"
                  startIcon={<UploadRounded />}
                  size="medium"
                  color={errMsgFile["background_profile_img"] ? "error" : "primary"}
                  sx={{
                    minWidth: { xs: "100%", sm: "13em" },
                  }}
                >
                  <InputBase
                    id="background_profile_img"
                    type="file"
                    name="background_profile_img"
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
                    onChange={FileOnChange(setFilePreview, setFormValue, setErrMsgFile, "candidate")}
                  />
                  Background Image
                </Button>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontStyle: "italic",
                    color: errMsgFile["background_profile_img"] ? red[500] : grey[700],
                  }}
                >
                  {errMsgFile["background_profile_img"] ? errMsgFile["background_profile_img"] :
                    filePreview["background_profile_img"] ? filePreview["background_profile_img"].filename : "no image selected"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box >
      <Grid container
        columnSpacing={{ xs: 0, md: 2 }}
        rowSpacing={{ xs: 2, sm: 0 }}
        sx={{ marginBottom: "1em" }}
      >
        <Grid item xs={12} md={4}
          sx={{
            marginBottom: "1em"
          }}
        >
          <Button
            component={"label"}
            htmlFor="cv_document"
            variant="contained"
            startIcon={<UploadRounded />}
            size="medium"
            color={errMsgFile["cv_document"] ? "error" : "primary"}
            fullWidth
            sx={{
              flexGrow: 1,
              minWidth: "13em",
              paddingY: "0.53em"
            }}
          >
            <InputBase
              id="cv_document"
              type="file"
              name="cv_document"
              inputProps={{
                accept: "application/pdf"
              }}
              sx={{
                height: '0px',
                width: '0px',
                opacity: 0
              }}
              onChange={FileOnChange(setFilePreview, setFormValue, setErrMsgFile, "candidate")}
            />
            {filePreview["cv_document"] ?
              (
                <Typography variant="subtitle2"
                  sx={{
                    whiteSpace: "initial",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: "1",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {filePreview["cv_document"].filename}
                </Typography>
              ) :
              "Curriculum Vitae"
            }
          </Button>
          {errMsgFile["cv_document"] ? (
            <FormHelperText sx={{ color: red[500] }}>
              {errMsgFile["cv_document"]}
            </FormHelperText>) : ""}
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            type="text"
            name="expertise"
            label="Expertise"
            placeholder="Your specialized skill"
            size="small"
            fullWidth
            autoComplete="off"
            value={formValue.expertise}
            onChange={InputOnChangeV2(setFormValue, "candidate")}
            error={errMsg["expertise"] ? true : false}
            helperText={errMsg["expertise"] ?? ""}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DatePicker
            name="date_of_birth"
            label="Date of Birth"
            format="DD/MM/YYYY"
            disableFuture
            slotProps={{
              textField: {
                size: "small",
                error: Boolean(errMsg["date_of_birth"]) ? true : false,
                helperText: errMsg["date_of_birth"] ?? "",
              }
            }}
            sx={{
              width: "100%",
              flexGrow: 1
            }}
            value={Boolean(formValue.date_of_birth) ? dayjs(formValue.date_of_birth) : undefined}
            onChange={DatePickerOnChange("date_of_birth", setFormValue, "candidate")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="text"
            name="about_me"
            label="About me"
            placeholder="Describe your profile in short"
            size="small"
            fullWidth
            multiline
            rows={4}
            value={formValue.about_me}
            onChange={InputOnChangeV2(setFormValue, "candidate")}
            error={errMsg["about_me"] ? true : false}
            helperText={errMsg["about_me"] ?? ""}
          />
        </Grid>
      </Grid>
    </Box >
  )
}