import React, { FormEvent, useState } from "react";
import { Avatar, Box, Button, CircularProgress, FormHelperText, Grid, InputBase, TextField, Typography } from "@mui/material";
import { UploadRounded } from "@mui/icons-material";
import { grey, red } from "@mui/material/colors";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { CandidateFormType } from "../../../../pages/candidates/types";
import dayjs from "dayjs";
import { DatePickerOnChange, FileOnChange, InputOnChangeV2 } from "../../../../pages/global-helpers";
import { HOST } from "../../../../pages/administrators/performance/[id]/constants";

export default function CandidateForm({
  formValue,
  setFormValue,
  errMsg,
  onSubmit,
  loading
}: {
  formValue: CandidateFormType;
  setFormValue: React.Dispatch<React.SetStateAction<CandidateFormType>>;
  errMsg: { [key: string]: string[] };
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean
}) {
  /* state */
  const [filePreview, setFilePreview] = useState<Record<string, { src: string, filename: string }>>({})
  const [errMsgFile, setErrMsgFile] = useState<Record<string, string>>({})
  return (
    <form onSubmit={onSubmit}>
      < Box component={"div"}
        className="candidate-form-container"
      >
        {/* profile and background image container */}
        < Box component={"div"} >
          <Box
            component={"img"}
            src={
              filePreview["background_profile_img"] ? filePreview["background_profile_img"].src :
                (typeof formValue.background_profile_img === "string") ? `${HOST.main}${formValue.background_profile_img.replace("/api/v1", "")}` :
                  "https://placehold.co/1152x240"
            }
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
              src={
                filePreview["profile_img"] ? filePreview["profile_img"].src :
                  (typeof formValue.profile_img === "string") ? `${HOST.main}${formValue.profile_img.replace("/api/v1", "")}` :
                    "https://placehold.co/50x50"
              }
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
                      fontSize: "small"
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
                      onChange={FileOnChange(setFilePreview, setFormValue, setErrMsgFile)}
                    />
                    Foto Profil
                  </Button>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontStyle: "italic",
                      color: errMsgFile["profile_img"] ? red[500] : grey[700],
                      fontSize: "x-small"
                    }}
                  >
                    {errMsgFile["profile_img"] ? errMsgFile["profile_img"] :
                      filePreview["profile_img"] ? filePreview["profile_img"].filename : "tidak ada gambar terpilih"}
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
                      fontSize: "small"
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
                      onChange={FileOnChange(setFilePreview, setFormValue, setErrMsgFile)}
                    />
                    Latar Belakang
                  </Button>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontStyle: "italic",
                      color: errMsgFile["background_profile_img"] ? red[500] : grey[700],
                      fontSize: "x-small"
                    }}
                  >
                    {errMsgFile["background_profile_img"] ? errMsgFile["background_profile_img"] :
                      filePreview["background_profile_img"] ? filePreview["background_profile_img"].filename : "tidak ada gambar terpilih"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box >
        <Grid container
          columnSpacing={{ xs: 0, md: 2 }}
          rowSpacing={{ xs: 2, sm: 0 }}
        >
          <Grid item xs={12} md={4}
            sx={{
              marginBottom: "1.5em"
            }}
          >
            <Button
              component={"label"}
              htmlFor="cv_document"
              variant="outlined"
              startIcon={<UploadRounded />}
              size="medium"
              color={errMsgFile["cv_document"] ? "error" : "primary"}
              fullWidth
              sx={{
                flexGrow: 1,
                minWidth: "13em",
                // paddingY: "0.53em"
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
                onChange={FileOnChange(setFilePreview, setFormValue, setErrMsgFile)}
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
              label="Keahlian"
              placeholder="Masukkan keahlian yang anda kuasai"
              size="small"
              fullWidth
              autoComplete="off"
              value={formValue.expertise}
              onChange={InputOnChangeV2(setFormValue)}
              error={errMsg["expertise"] ? true : false}
              helperText={errMsg["expertise"] ?? ""}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MobileDatePicker
              name="date_of_birth"
              label="Tanggal Lahir"
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
              onChange={DatePickerOnChange("date_of_birth", setFormValue)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="about_me"
              label="Tentang Saya"
              placeholder="Deskripsikan diri anda secara singkat"
              size="small"
              fullWidth
              multiline
              rows={4}
              value={formValue.about_me}
              onChange={InputOnChangeV2(setFormValue)}
              error={errMsg["about_me"] ? true : false}
              helperText={errMsg["about_me"] ?? ""}
            />
          </Grid>
          <Grid item xs={12}>
            <Box component={"div"}
              sx={{
                display: "flex",
                justifyContent: "end"
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  width: { xs: "100%", sm: "max-content" },
                  marginTop: "0.5em"
                }}
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : "Submit"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box >
    </form >
  )
}