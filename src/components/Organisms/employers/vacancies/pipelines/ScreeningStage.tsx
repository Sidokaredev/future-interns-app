import { ArrowForwardRounded, CloseRounded, DoNotDisturbOnRounded, GitHub, Instagram, LinkedIn, MoreVert, Visibility, VisibilityRounded, X } from "@mui/icons-material";
import { Avatar, Box, Button, CircularProgress, Collapse, Dialog, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from "@mui/material";
import { amber, grey } from "@mui/material/colors";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ApplicantScreening } from "../../../../../pages/employers/types";
import { GetSession } from "../../../../../pages/global-helpers";
import RequestAPI from "../../../../../services/api/request";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { CandidateProfile } from "../../../../../pages/candidates/types";
import CandidateProfileOverview from "../../../../Molecules/Data.Display/CandidateProfileOverview";
import SimpleEmphasis from "../../../../Molecules/Texts/SimpleEmphasis";
import { HOST } from "../../../../../pages/administrators/performance/[id]/constants";

export default function ScreeningStage({
  tabOn,
  setAlert,
  searchApplicant,
}: {
  tabOn: "screening" | "assessments" | "interviews" | "offerings" | "LoA";
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>;
  searchApplicant: string;
}) {
  /* react-router */
  const { id: vacancyID } = useParams()
  /* media-query */
  const smallMedia = useMediaQuery("(max-width: 900px)");
  const xsmallMedia = useMediaQuery("(max-width: 600px)");
  /* state */
  const [applicantScreening, setApplicantScreening] = useState<ApplicantScreening[]>([]);
  const [selected, setSelected] = useState<{ pipeline_id: string, candidate_id: string }>({ pipeline_id: "", candidate_id: "" });
  const [candidateView, setCandidateView] = useState<CandidateProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  const [dataAction, setDataAction] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  /* onView */
  const onView = async (candidateID: string) => {
    const token = GetSession("auth");
    const [data, fail] = await RequestAPI.Send<CandidateProfile>(
      "/candidates/" + candidateID + "?includes=user,address,educations,experiences,skills,socials",
      {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      return setAlert({ show: true, message: fail.message });
    };
    if (data) {
      return setCandidateView(data);
    };
  };
  /* onAssignToAssessment */
  const onAssignToAssessment = async (pipelineID: string) => {
    setLoading(true);
    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.JSONRequest({ pipeline_id: pipelineID, stage: "Assessment" }).Send<string>(
      "/employers/pipelines/",
      {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(false);
      return setAlert({ show: true, message: fail.message })
    };
    if (success) {
      setLoading(false);
      setDataAction(prev => !prev);
      setAnchorEl(null);
      setOpenDialog(prev => ({ ...prev, ["assign-confirmation"]: false }));
      return setAlert({ show: true, message: success })
    };
  };

  /* constants */
  const tableColumn = [
    { prop: "row_number", label: "#" },
    { prop: "fullname", label: "Nama Lengkap" },
    { prop: "education", label: "Pendidikan" },
    { prop: "expertise", label: "Bidang Keahlian" },
    { prop: "socials", label: "Sosial Media" },
    { prop: "option", label: "Opsi" },
  ];
  const smallTableColumn = [
    { prop: "fullname", label: "Name" },
    { prop: "education", label: "Education" },
    { prop: "option", label: "Option" },
  ];
  const responsiveTableColumn = smallMedia ? smallTableColumn : tableColumn;

  const searchedApplicant = applicantScreening.filter(applicant => applicant.fullname.toLowerCase().includes(searchApplicant.toLocaleLowerCase()));
  const paginatedApplicant = searchedApplicant.slice((currentPage * 5) - 5, currentPage * 5);
  const totalPages = Math.ceil(searchedApplicant.length / 5);
  /* to refetch a new data */
  // const refetch = tabOn === "screening" ? tabOn : false;

  /* fetching */
  useEffect(() => {
    if (tabOn !== "screening") {
      return;
    }
    const token = GetSession("auth");
    (async () => {
      const [data, fail] = await RequestAPI.Send<ApplicantScreening[]>(
        "/employers/pipelines/" + vacancyID + "/screening",
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );
      if (fail) {
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setApplicantScreening(data);
      };
    })();
  }, [dataAction, tabOn]);
  return (
    <Box component={"div"}>
      <Collapse
        in={Boolean(tabOn === "screening")}
        mountOnEnter
        unmountOnExit
      >
        <Box component={"div"} id="screenings-panel">
          <TableContainer
            sx={{
              ".MuiTableHead-root": {
                ".MuiTableCell-root": {
                  borderBottom: "none",
                },
              },
            }}
          >
            {applicantScreening.length === 0 && (
              <Box component={"div"}
                sx={{
                  width: "100%",
                  padding: "0.5em",
                  display: "flex",
                  columnGap: "0.5em",
                  alignItems: "center",
                  borderRadius: "0.3em",
                  backgroundColor: amber[50]
                }}
              >
                <DoNotDisturbOnRounded fontSize="small" sx={{ color: amber[700] }} />
                <Typography component={"p"} variant="caption"
                  sx={{ color: amber[700] }}
                >
                  Saat ini tidak ada pelamar pada tahap <span style={{ fontStyle: "italic" }}>screening</span>.
                </Typography>
              </Box>
            )}
            <Table>
              <TableHead>
                <TableRow>
                  {responsiveTableColumn.map((column, index) => (
                    <TableCell key={index}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 550, color: grey[500] }}
                      >
                        {column.label}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  "> .MuiTableRow-root:hover": {
                    backgroundColor: grey[100],
                  },
                  ".MuiTableCell-root": {
                    borderColor: grey[300],
                  },
                }}
              >
                {paginatedApplicant.map((applicant, index) => (
                  <TableRow key={index}>
                    {responsiveTableColumn.map((column, columnIndex) => {
                      switch (column.prop) {
                        case "row_number":
                          return (
                            <TableCell key={columnIndex}>{index + 1 + "."}</TableCell>
                          );
                        case "fullname":
                          return (
                            <TableCell key={columnIndex} size="small" sx={{}}>
                              <Box
                                component={"div"}
                                sx={{
                                  width: "100%",
                                  display: "flex",
                                  flexWrap: "wrap",
                                  columnGap: {
                                    xs: 0,
                                    sm: "0.7em",
                                  },
                                  rowGap: {
                                    xs: "0.7em",
                                    sm: 0,
                                  },
                                }}
                              >
                                {!xsmallMedia && (
                                  <Avatar
                                    alt="candidate-profile"
                                    src={`${HOST.main}${applicant.profile_image_path.replace("/api/v1", "")}`}
                                    sx={{ width: 40, height: 40 }}
                                  />
                                )}
                                <Box component={"div"}>
                                  <Typography
                                    component={"p"}
                                    variant="subtitle2"
                                    sx={{ fontWeight: 550, color: grey[800] }}
                                  >
                                    {applicant.fullname}
                                  </Typography>
                                  <Typography
                                    component={"p"}
                                    variant="caption"
                                    sx={{ wordBreak: "break-word" }}
                                  >
                                    {applicant.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                          );
                        case "education":
                          return (
                            <TableCell key={columnIndex} size="small" sx={{}}>
                              <Typography component={"p"} variant="subtitle2"
                                sx={{ fontWeight: 550, color: grey[700] }}
                              >
                                {applicant.education.university}
                              </Typography>
                              <Typography component={"p"} variant="caption"
                                sx={{ color: grey[600] }}
                              >
                                {applicant.education.degree}
                              </Typography>
                              <Typography component={"p"} variant="body2"
                                sx={{ marginY: "0.5em", color: grey[600] }}
                              >
                                {applicant.education.major}
                              </Typography>
                            </TableCell>
                          )
                        case "socials":
                          return (
                            <TableCell key={columnIndex}>
                              <Stack
                                direction={"row"}
                                sx={{ flexWrap: "wrap", maxWidth: "10em" }}
                              >
                                {applicant.socials.map((social, index) => {
                                  switch (social.name) {
                                    case "GitHub":
                                      return (
                                        <IconButton
                                          key={index}
                                          component={RouterLink}
                                          to={social.url}
                                          target="_blank"
                                          size="small"
                                        >
                                          <GitHub />
                                        </IconButton>
                                      );
                                    case "LinkedIn":
                                      return (
                                        <IconButton
                                          key={index}
                                          component={RouterLink}
                                          to={social.url}
                                          target="_blank"
                                          size="small"
                                        >
                                          <LinkedIn />
                                        </IconButton>
                                      );
                                    case "instagram":
                                      return (
                                        <IconButton
                                          key={index}
                                          component={RouterLink}
                                          to={social.url}
                                          target="_blank"
                                          size="small"
                                        >
                                          <Instagram />
                                        </IconButton>
                                      );
                                    case "x":
                                      return (
                                        <IconButton
                                          key={index}
                                          component={RouterLink}
                                          to={social.url}
                                          target="_blank"
                                          size="small"
                                        >
                                          <X />
                                        </IconButton>
                                      );
                                    default:
                                      return;
                                  }
                                })}
                              </Stack>
                            </TableCell>
                          );
                        case "option":
                          return (
                            <TableCell key={columnIndex} size="small" sx={{}}>
                              <Box
                                component={"div"}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                {!smallMedia && (
                                  <Button
                                    variant="text"
                                    size="small"
                                    startIcon={
                                      <Visibility fontSize="small" />
                                    }
                                    onClick={() => {
                                      onView(applicant.candidate_id);
                                      setOpenDialog(prev => ({ ...prev, ["candidate-overview"]: true }));
                                    }}
                                  >
                                    Lihat
                                  </Button>
                                )}
                                <IconButton
                                  size="small"
                                  onClick={(
                                    event: React.MouseEvent<HTMLButtonElement>
                                  ) => {
                                    setSelected({ pipeline_id: applicant.pipeline_id, candidate_id: applicant.candidate_id });
                                    setAnchorEl(event.currentTarget);
                                  }
                                  }
                                >
                                  <MoreVert fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          );
                        default:
                          return (
                            <TableCell key={columnIndex} size="small" sx={{}}>
                              <Typography variant="subtitle2">
                                {
                                  applicant[
                                  column.prop as keyof ApplicantScreening
                                  ] as React.ReactNode
                                }
                              </Typography>
                            </TableCell>
                          );
                      }
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            color="primary"
            count={totalPages}
            page={currentPage}
            onChange={(_: ChangeEvent<unknown>, page: number) => {
              setCurrentPage(page);
            }}
            sx={{
              display: "flex",
              justifyContent: "end",
              marginY: "2em",
            }}
          />
        </Box>
      </Collapse>
      {/* Menu Option */}
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() =>
          setAnchorEl(null)
        }
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        slotProps={{
          paper: {
            sx: {
              minWidth: {
                xs: "auto",
                md: "10em",
              },
              padding: 0,
              border: "1px solid " + grey[400],
              boxShadow: "none",
            },
          },
        }}
        MenuListProps={{
          dense: true,
        }}
        sx={{
          ".MuiMenuItem-root:hover": {
            backgroundColor: grey[100],
            ".MuiListItemIcon-root": {
              color: "#06816d",
            },
            ".MuiListItemText-primary": {
              color: "#06816d",
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setOpenDialog(prev => ({ ...prev, ["assign-confirmation"]: true }))
          }}
        >
          <ListItemIcon>
            <ArrowForwardRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={"Proses ke Assessments"}
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "small",
                fontWeight: 550,
                color: grey[600],
              },
            }}
          />
        </MenuItem>
        {smallMedia && (
          <MenuItem
            onClick={() => {
              onView(selected.candidate_id);
              setOpenDialog(prev => ({ ...prev, ["candidate-overview"]: true }));
            }}
          >
            <ListItemIcon>
              <VisibilityRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={"Lihat"}
              sx={{
                ".MuiListItemText-primary": {
                  fontSize: "small",
                  fontWeight: 550,
                  color: grey[600],
                },
              }}
            />
          </MenuItem>
        )}
      </Menu>
      {/* Candidate Profile View Dialog */}
      <Dialog
        open={Boolean(openDialog["candidate-overview"])}
        onClose={() => {
          setOpenDialog(prev => ({ ...prev, ["candidate-overview"]: false }))
        }}
        maxWidth={"xl"}
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
        fullScreen={xsmallMedia}
      >
        <Box component={"div"}
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography component={"p"} variant="subtitle1"
            sx={{
              marginBottom: "0.5em",
              fontWeight: 550,
              color: grey[800],
            }}
          >
            Ringkasan Profil Kandidat
          </Typography>
          <IconButton size="small"
            onClick={() => {
              setOpenDialog(prev => ({ ...prev, ["candidate-overview"]: false }))
            }}
          >
            <CloseRounded fontSize="small" />
          </IconButton>
        </Box>
        <CandidateProfileOverview
          candidate={candidateView}
        />
      </Dialog>
      {/* Assign to Assessment Confirmation Dialog */}
      <Dialog
        open={Boolean(openDialog["assign-confirmation"])}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            padding: "1.5em"
          }
        }}
      >
        <Box component={"div"}
          sx={{
            marginBottom: "2em"
          }}
        >
          <Typography component={"p"} variant="subtitle1"
            sx={{
              fontWeight: 550,
              color: grey[700],
              marginBottom: "0.5em",
            }}
          >
            Catatan
          </Typography>
          <Typography component={"p"} variant="body1">
            Apakah Anda yakin ingin memindahkan kandidat ini ke tahap <SimpleEmphasis text={"Assessment"} /> ?
          </Typography>
        </Box>
        <Box component={"div"}
          sx={{
            display: "flex",
            justifyContent: "end",
            columnGap: "1em",
          }}
        >
          <Button
            variant="text"
            color="error"
            size="small"
            onClick={() => setOpenDialog(prev => ({ ...prev, ["assign-confirmation"]: false }))}
          >
            Tidak
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={loading}
            endIcon={loading && (<CircularProgress size={20} />)}
            onClick={() => {
              onAssignToAssessment(selected.pipeline_id)
            }}
          >
            Iya
          </Button>
        </Box>
      </Dialog>
    </Box >
  )
}