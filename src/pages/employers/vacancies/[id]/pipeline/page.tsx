import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Collapse,
  Dialog,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  Link,
} from "@mui/material";
import DashboardLayout from "../../../../../components/Templates/DashboardLayout";
import { amber, blue, green, grey, purple } from "@mui/material/colors";
import {
  ArrowForwardRounded,
  AssignmentIndRounded,
  AssignmentTurnedInRounded,
  CalendarMonthRounded,
  CloseRounded,
  Description,
  DescriptionRounded,
  DonutLargeRounded,
  EventRounded,
  GitHub,
  HomeRounded,
  InsertDriveFileOutlined,
  InsertDriveFileRounded,
  InsertLinkOutlined,
  Instagram,
  LinkedIn,
  LinkRounded,
  MoreVert,
  PublishRounded,
  ScheduleRounded,
  SearchRounded,
  Visibility,
  VisibilityRounded,
  X,
} from "@mui/icons-material";
import React, { useState } from "react";
import CandidateProfile from "../../../../../components/Molecules/Data.Display/CandidateProfile";
import PersonalDetail from "../../../../../components/Molecules/Data.Display/PersonalDetail";
import CopyText from "../../../../../components/Molecules/Texts/CopyText";
import AttachFileCard from "../../../../../components/Molecules/Cards/AttachFileCard";
import SimpleEmphasis from "../../../../../components/Molecules/Texts/SimpleEmphasis";
import {
  Link as ReactRouterLink,
  useLocation,
  useParams,
} from "react-router-dom";
import BreadcrumbsCreator from "../../../helpers";

type CandidateProps = {
  name: string;
  email: string;
  domicile: string;
  education: string;
  socials: { src: string; name: string }[];
};

type InterviewsProps = {
  name: string;
  email: string;
  date: string;
  location: { name: string; url: string };
  status: string;
};

type OfferingsProps = {
  name: string;
  email: string;
  end: string;
  status: string;
};

export default function EmployerVacanciesPipeline() {
  /* react-router */
  const location = useLocation();
  const params = useParams();
  /* breakpoints */
  const smallScreen = useMediaQuery("(max-width: 900px)");
  const xsmallScreen = useMediaQuery("(max-width: 600px)");
  /* state */
  const [tabOn, setTabOn] = useState<
    "screening" | "assessments" | "interviews" | "offerings" | "LoA"
  >("screening");
  const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>(
    {}
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [seeMore, setSeeMore] = useState<Record<string, boolean>>({});
  /* event handler */
  const seeMoreHandler = (key: string) => () => {
    setSeeMore((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  /* helpers */
  const tabStyleDeterminer = (condition: string): SxProps => {
    return {
      ["#" + condition]: {
        backgroundColor: "#389a8a",
        ".MuiTypography-body2": {
          color: "white",
        },
        ".MuiBox-root": {
          backgroundColor: "white",
          ".MuiTypography-caption": {
            color: "#389a8a",
          },
        },
      },
    };
  };
  const chipColorDeterminer = (status: string): SxProps => {
    switch (status) {
      case "Scheduled":
        return {
          color: purple[700],
          backgroundColor: purple[50],
        };
      case "Re-scheduled":
        return {
          color: amber[700],
          backgroundColor: amber[50],
        };
      case "Waiting":
        return {
          color: amber[700],
          backgroundColor: amber[50],
        };
      case "Accepted":
        return {
          color: green[700],
          backgroundColor: green[50],
        };
      default:
        return {
          color: green[700],
          backgroundColor: green[50],
        };
    }
  };
  /* static data */
  const columns = [
    {
      valueProp: "#",
      label: "#",
    },
    {
      valueProp: "name",
      label: "Name",
    },
    {
      valueProp: "education",
      label: "Education",
    },
    {
      valueProp: "domicile",
      label: "Domicile",
    },
    {
      valueProp: "socials",
      label: "Social",
    },
    {
      valueProp: "option",
      label: "Option",
    },
  ];
  const columnsSmall = [
    {
      valueProp: "name",
      label: "Name",
    },
    {
      valueProp: "education",
      label: "Education",
    },
    {
      valueProp: "option",
      label: "Option",
    },
  ];
  const responsiveColumns = smallScreen ? columnsSmall : columns;
  const rows: CandidateProps[] = [
    {
      name: "Fatkhur Rozak",
      email: "fatkhurawe@gmail.com",
      domicile: "Sidoarjo",
      education: "Politeknik Negeri Jember",
      socials: [{ src: "https://github.com", name: "github" }],
    },
    {
      name: "Vrij Brahmaak",
      email: "vrij.brahmaak@gmail.com",
      domicile: "Delhi",
      education: "Politeknik Negeri Jember",
      socials: [
        { src: "https://github.com", name: "github" },
        { src: "https://linkedin.com", name: "linkedin" },
      ],
    },
  ];
  const columnsInterviews = [
    {
      valueProp: "#",
      label: "#",
    },
    {
      valueProp: "name",
      label: "Name",
    },
    {
      valueProp: "date",
      label: "Date",
    },
    {
      valueProp: "location",
      label: "Location",
    },
    {
      valueProp: "status",
      label: "Status",
    },
    {
      valueProp: "option",
      label: "Option",
    },
  ];
  const columnsInterviewsSmall = [
    {
      valueProp: "name",
      label: "Name",
    },
    {
      valueProp: "schedule",
      label: "Schedule",
    },
    {
      valueProp: "option",
      label: "Option",
    },
  ];
  const responsiveColumnsInterviews = smallScreen
    ? columnsInterviewsSmall
    : columnsInterviews;
  const rowsInterviews: InterviewsProps[] = [
    {
      name: "Fatkhur Rozak",
      email: "fatkhurawe@gmail.com",
      date: new Date(Date.now()).toDateString(),
      location: {
        name: "Google Meet",
        url: "https://google.com",
      },
      status: "Scheduled",
    },
    {
      name: "Dinda Amalia Julyandri",
      email: "dindaamalia0309@gmail.com",
      date: new Date(Date.now()).toDateString(),
      location: {
        name: "Google Meet",
        url: "https://www.youtube.com/watch?v=Vb-Z7oe0Hao&list=RD1rKRkRyzO3E&index=5",
      },
      status: "Re-scheduled",
    },
  ];
  const columnsOfferings = [
    {
      valueProp: "#",
      label: "#",
    },
    {
      valueProp: "name",
      label: "Name",
    },
    {
      valueProp: "end",
      label: "Offer ends on",
    },
    {
      valueProp: "status",
      label: "Offer Status",
    },
    {
      valueProp: "option",
      label: "Option",
    },
  ];
  const columnsOfferingsSmall = [
    {
      valueProp: "name",
      label: "Name",
    },
    {
      valueProp: "offer",
      label: "Offer",
    },
    {
      valueProp: "option",
      label: "Option",
    },
  ];
  const responsiveColumnsOfferings = smallScreen
    ? columnsOfferingsSmall
    : columnsOfferings;
  const rowsOfferings: OfferingsProps[] = [
    {
      name: "Dinda Amalia Julyandri",
      email: "dindaaamalia@gmail.com",
      end: new Date(Date.now()).toDateString(),
      status: "Waiting",
    },
    {
      name: "Asmiranti Teman Dinda",
      email: "as.sitemandinda@gmail.com",
      end: new Date(Date.now()).toDateString(),
      status: "Accepted",
    },
  ];
  console.info(
    "Breadcrumbs \t:",
    BreadcrumbsCreator(params as Record<string, string>, location.pathname)
  );
  console.info(location.pathname);
  return (
    <DashboardLayout isFor="employer">
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: "1em" }}>
        {BreadcrumbsCreator(
          params as Record<string, string>,
          location.pathname
        ).map((data, index) => (
          <Link
            key={index}
            component={ReactRouterLink}
            to={data.pathname}
            underline="hover"
            color="inherit"
            sx={{
              display: "flex",
              alignItems: "center",
              color:
                data.pathname === location.pathname ? "#51a799" : undefined,
            }}
          >
            {data.label === "Vacancies" ? (
              <HomeRounded
                sx={{
                  mr: 0.5,
                  color:
                    data.pathname === location.pathname ? "#51a799" : undefined,
                }}
                fontSize="inherit"
              />
            ) : (
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight:
                    data.pathname === location.pathname ? 550 : undefined,
                }}
              >
                {data.label}
              </Typography>
            )}
          </Link>
        ))}
      </Breadcrumbs>
      <Box component={"div"} sx={{}}>
        <Box
          component={"div"}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: {
              xs: "0.5em",
              sm: 0,
            },
          }}
        >
          <Typography
            component={"p"}
            variant="h6"
            sx={{
              fontWeight: 550,
              fontSize: { xs: "medium", md: "large" },
              color: grey[800],
            }}
          >
            Cloud Architect
          </Typography>
          <TextField
            type="text"
            name="search" // search for candidate
            placeholder="Search ..."
            autoComplete="off"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded />
                </InputAdornment>
              ),
              sx: {
                minWidth: {
                  md: "20em",
                },
                fontSize: "small",
              },
            }}
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          />
        </Box>
        {/* Tabs Panel */}
        <Stack
          direction={"row"}
          spacing={2}
          sx={{
            marginY: "1em",
            paddingBottom: "0.5em",
            ...tabStyleDeterminer(tabOn),
            ".MuiBox-root": {
              backgroundColor: "white",
              ".MuiTypography-body2": {
                letterSpacing: {
                  xs: "",
                  md: "0.03em",
                },
                color: grey[600],
              },
              ".MuiBox-root": {
                backgroundColor: grey[600],
                ".MuiTypography-caption": {
                  color: "white",
                },
              },
              cursor: "pointer",
            },
            "> .MuiBox-root:hover": {
              backgroundColor: grey[200],
            },
            overflowX: {
              xs: "auto",
            },
          }}
        >
          <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              columnGap: "0.3em",
              padding: "0.5em",
              borderRadius: "0.3em",
            }}
            id="screening"
            onClick={() => setTabOn("screening")}
          >
            <Typography
              component={"p"}
              variant="body2"
              sx={{ fontWeight: 550, fontSize: { xs: "small", sm: "" } }}
            >
              Screening
            </Typography>
            <Box
              component={"div"}
              sx={{
                width: 20,
                height: 20,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 550 }}>
                5
              </Typography>
            </Box>
          </Box>
          <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              columnGap: "0.3em",
              padding: "0.5em",
              borderRadius: "0.3em",
            }}
            id="assessments"
            onClick={() => setTabOn("assessments")}
          >
            <Typography
              component={"p"}
              variant="body2"
              sx={{
                fontWeight: 550,
                fontSize: { xs: "small", sm: "" },
                color: grey[600],
              }}
            >
              Assessments
            </Typography>
          </Box>
          <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              columnGap: "0.3em",
              padding: "0.5em",
              borderRadius: "0.3em",
            }}
            id="interviews"
            onClick={() => setTabOn("interviews")}
          >
            <Typography
              component={"p"}
              variant="body2"
              sx={{
                fontWeight: 550,
                fontSize: { xs: "small", sm: "" },
                color: grey[600],
              }}
            >
              Interviews
            </Typography>
          </Box>
          <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              columnGap: "0.3em",
              padding: "0.5em",
              borderRadius: "0.3em",
            }}
            id="offerings"
            onClick={() => setTabOn("offerings")}
          >
            <Typography
              component={"p"}
              variant="body2"
              sx={{
                fontWeight: 550,
                fontSize: { xs: "small", sm: "" },
                color: grey[600],
              }}
            >
              Offerings
            </Typography>
            <Box
              component={"div"}
              sx={{
                width: 20,
                height: 20,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 550 }}>
                3
              </Typography>
            </Box>
          </Box>
          {/* Letter of Acceptance */}
          {/* <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              columnGap: "0.3em",
              padding: "0.5em",
              borderRadius: "0.3em",
            }}
            id="LoA"
            onClick={() => setTabOn("LoA")}
          >
            <Typography
              component={"p"}
              variant="body2"
              sx={{
                fontWeight: 550,
                fontSize: { xs: "small", sm: "" },
                color: grey[600],
              }}
            >
              LoA
            </Typography>
          </Box> */}
        </Stack>
        <Menu
          open={Boolean(anchorEl["screening"])}
          anchorEl={anchorEl["screening"]}
          onClose={() =>
            setAnchorEl((prev) => ({ ...prev, ["screening"]: null }))
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
          <MenuItem>
            <ListItemIcon>
              <ArrowForwardRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={"Assign to"}
              sx={{
                ".MuiListItemText-primary": {
                  fontSize: "small",
                  fontWeight: 550,
                  color: grey[600],
                },
              }}
            />
          </MenuItem>
          {xsmallScreen && (
            <MenuItem onClick={() => setOpenDialog(true)}>
              <ListItemIcon>
                <VisibilityRounded fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={"View"}
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
        <Menu
          open={Boolean(anchorEl["interviews"])}
          anchorEl={anchorEl["interviews"]}
          onClose={() =>
            setAnchorEl((prev) => ({ ...prev, ["interviews"]: null }))
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
          <MenuItem>
            <ListItemIcon>
              <ArrowForwardRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={"Assign to"}
              sx={{
                ".MuiListItemText-primary": {
                  fontSize: "small",
                  fontWeight: 550,
                  color: grey[600],
                },
              }}
            />
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <EventRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={"Create Interview"}
              sx={{
                ".MuiListItemText-primary": {
                  fontSize: "small",
                  fontWeight: 550,
                  color: grey[600],
                },
              }}
            />
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <CalendarMonthRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={"Interview History"}
              sx={{
                ".MuiListItemText-primary": {
                  fontSize: "small",
                  fontWeight: 550,
                  color: grey[600],
                },
              }}
            />
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <VisibilityRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={"View Detail"}
              sx={{
                ".MuiListItemText-primary": {
                  fontSize: "small",
                  fontWeight: 550,
                  color: grey[600],
                },
              }}
            />
          </MenuItem>
        </Menu>
        <Menu
          open={Boolean(anchorEl["offerings"])}
          anchorEl={anchorEl["offerings"]}
          onClose={() =>
            setAnchorEl((prev) => ({ ...prev, ["offerings"]: null }))
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
          <MenuItem>
            <ListItemIcon>
              <PublishRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={"Issue LoA"}
              sx={{
                ".MuiListItemText-primary": {
                  fontSize: "small",
                  fontWeight: 550,
                  color: grey[600],
                },
              }}
            />
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <EventRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={"Change End Date"}
              sx={{
                ".MuiListItemText-primary": {
                  fontSize: "small",
                  fontWeight: 550,
                  color: grey[600],
                },
              }}
            />
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <VisibilityRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={"View Detail"}
              sx={{
                ".MuiListItemText-primary": {
                  fontSize: "small",
                  fontWeight: 550,
                  color: grey[600],
                },
              }}
            />
          </MenuItem>
        </Menu>
        {/* Screening */}
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
              <Table>
                <TableHead>
                  <TableRow>
                    {responsiveColumns.map((column, index) => (
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
                  {rows.map((data: CandidateProps, dataIndex) => (
                    <TableRow key={dataIndex}>
                      {responsiveColumns.map((column, index) => {
                        switch (column.valueProp) {
                          case "#":
                            return (
                              <TableCell key={index}>{dataIndex + 1}</TableCell>
                            );
                          case "name":
                            return (
                              <TableCell key={index} size="small" sx={{}}>
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
                                  {!xsmallScreen && (
                                    <Avatar
                                      alt="candidate-profile"
                                      src="https://placehold.co/40x40"
                                      sx={{ width: 40, height: 40 }}
                                    />
                                  )}
                                  <Box component={"div"}>
                                    <Typography
                                      component={"p"}
                                      variant="subtitle2"
                                      sx={{ fontWeight: 550, color: grey[800] }}
                                    >
                                      {data.name}
                                    </Typography>
                                    <Typography
                                      component={"p"}
                                      variant="caption"
                                      sx={{ wordBreak: "break-word" }}
                                    >
                                      {data.email}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                            );
                          case "socials":
                            return (
                              <TableCell key={index}>
                                <Stack
                                  direction={"row"}
                                  sx={{ flexWrap: "wrap", maxWidth: "10em" }}
                                >
                                  {data.socials.map((social, socialIndex) => {
                                    switch (social.name) {
                                      case "github":
                                        return (
                                          <IconButton
                                            key={socialIndex}
                                            size="small"
                                            onClick={() =>
                                              console.info(
                                                "navigate to \t:",
                                                social.src
                                              )
                                            }
                                          >
                                            <GitHub />
                                          </IconButton>
                                        );
                                      case "linkedin":
                                        return (
                                          <IconButton
                                            key={socialIndex}
                                            size="small"
                                          >
                                            <LinkedIn />
                                          </IconButton>
                                        );
                                      case "instagram":
                                        return (
                                          <IconButton
                                            key={socialIndex}
                                            size="small"
                                          >
                                            <Instagram />
                                          </IconButton>
                                        );
                                      case "x":
                                        return (
                                          <IconButton
                                            key={socialIndex}
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
                              <TableCell key={index} size="small" sx={{}}>
                                <Box
                                  component={"div"}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  {!smallScreen && (
                                    <Button
                                      variant="text"
                                      size="small"
                                      startIcon={
                                        <Visibility fontSize="small" />
                                      }
                                      onClick={() => setOpenDialog(true)}
                                    >
                                      View
                                    </Button>
                                  )}
                                  <IconButton
                                    size="small"
                                    onClick={(
                                      event: React.MouseEvent<HTMLButtonElement>
                                    ) =>
                                      setAnchorEl((prev) => ({
                                        ...prev,
                                        [tabOn]: event.currentTarget,
                                      }))
                                    }
                                  >
                                    <MoreVert fontSize="small" />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            );
                          default:
                            return (
                              <TableCell key={index} size="small" sx={{}}>
                                <Typography variant="subtitle2">
                                  {
                                    data[
                                      column.valueProp as keyof CandidateProps
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
              count={13}
              sx={{
                display: "flex",
                justifyContent: "end",
                marginY: "2em",
              }}
            />
          </Box>
        </Collapse>
        {/* Assessments */}
        <Collapse
          in={Boolean(tabOn === "assessments")}
          mountOnEnter
          unmountOnExit
        >
          {/* <Box component={"div"}>Panel Create, Sort, and Search</Box> */}
          <Stack direction={"column"} spacing={2}>
            {[0, 1, 2, 3].map((_, index) => (
              <Box
                key={index}
                component={"div"}
                className="assessment-item"
                sx={{
                  // padding: "0.5em 1em",
                  border: "1px solid " + grey[400],
                  borderRadius: "0.3em",
                }}
              >
                <Box component={"div"} sx={{ padding: "0.5em 0.8em" }}>
                  {/* title */}
                  <Box
                    component={"div"}
                    sx={{
                      display: "flex",
                      alignItems: {
                        xs: "start",
                        sm: "center",
                      },
                      justifyContent: "space-between",
                      columnGap: "0.5em",
                    }}
                  >
                    <Box
                      component={"div"}
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        marginBottom: {
                          xs: "0.5em",
                          sm: "",
                        },
                      }}
                    >
                      <Typography
                        component={"p"}
                        variant="subtitle2"
                        sx={{ fontWeight: 550, color: grey[800] }}
                      >
                        Test Case Configuring Firewall {index}
                      </Typography>
                      <Typography
                        component={"p"}
                        variant="caption"
                        sx={{
                          width: "max-content",
                          padding: "0.3em 0.8em",
                          borderRadius: "2em",
                          color: amber[700],
                          fontStyle: "italic",
                          backgroundColor: amber[50],
                        }}
                      >
                        Due date on{" "}
                        <SimpleEmphasis
                          text={"Fri 30 May, 2024"}
                          textColor={amber[700]}
                          sx={{ fontStyle: "italic" }}
                        />
                      </Typography>
                    </Box>
                    <Tooltip title="More option" placement="top">
                      <IconButton>
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {/* body */}
                  <Box component={"div"}>
                    {/* note */}
                    <Box
                      component={"div"}
                      sx={{ display: "flex", columnGap: "0.3em" }}
                    >
                      <DescriptionRounded
                        fontSize="small"
                        sx={{ color: "#06816d" }}
                      />
                      <Box component={"div"}>
                        <Typography
                          component={"p"}
                          variant="caption"
                          sx={{ fontWeight: 550, color: grey[700] }}
                        >
                          Note
                        </Typography>
                        <Typography
                          component={"p"}
                          variant="caption"
                          sx={{ color: grey[600] }}
                          noWrap={!seeMore[String(index)]}
                        >
                          Lorem, ipsum dolor sit amet consectetur adipisicing
                          elit. Explicabo itaque voluptatum totam inventore
                          eaque odio ipsum, magni atque, libero consequuntur,
                          consequatur exercitationem repellat facilis. Enim
                          error sed nihil in. Iste. <br /> Lorem ipsum dolor sit
                          amet consectetur adipisicing elit. Quae facere nisi
                          possimus cupiditate omnis dolores odio assumenda
                          exercitationem expedita impedit iure maiores
                          consequuntur officiis voluptas ea magnam quo, et amet!
                          Aspernatur quos vel in eaque ab soluta accusantium
                          maxime eligendi labore a omnis earum explicabo
                          repellendus, at odit, debitis dolorem blanditiis. Eos
                          nesciunt explicabo mollitia sint veniam dolores
                          laborum modi.
                        </Typography>
                        <Typography
                          component={"span"}
                          variant="caption"
                          sx={{
                            color: grey[600],
                            fontWeight: 550,
                            fontStyle: "italic",
                            ":hover": {
                              color: blue[500],
                            },
                            cursor: "pointer",
                          }}
                          onClick={seeMoreHandler(String(index))}
                        >
                          {!seeMore[String(index)] && "See more ..."}
                        </Typography>
                      </Box>
                    </Box>
                    {/* label */}
                    <Box
                      component={"div"}
                      sx={{
                        marginTop: "0.5em",
                        display: "flex",
                        flexWrap: {
                          xs: "wrap",
                          sm: "nowrap",
                        },
                        columnGap: "0.5em",
                        rowGap: {
                          xs: "0.7em",
                          sm: "",
                        },
                      }}
                    >
                      {/* assessment link */}
                      <Box
                        component={"div"}
                        sx={{
                          flexBasis: {
                            xs: "100%",
                            sm: "40%",
                          },
                          display: "flex",
                          columnGap: "0.3em",
                        }}
                      >
                        <LinkRounded
                          fontSize="small"
                          sx={{ color: "#06816d" }}
                        />
                        <Box component={"div"}>
                          <Typography
                            component={"div"}
                            variant="caption"
                            sx={{ fontWeight: 550, color: grey[700] }}
                          >
                            Assessment Link
                          </Typography>
                          <Typography
                            component={"div"}
                            variant="caption"
                            sx={{
                              color: grey[600],
                              ":hover": { color: blue[500] },
                            }}
                          >
                            https://dribbble.com/shots/18937872-Orders-List-Tabbed-Nav-with-Large-Tile-List
                          </Typography>
                        </Box>
                      </Box>
                      {/* attached files */}
                      <Box
                        component={"div"}
                        sx={{
                          flexBasis: {
                            xs: "100%",
                            sm: "40%",
                          },
                          display: "flex",
                          columnGap: "0.3em",
                        }}
                      >
                        <InsertDriveFileRounded
                          fontSize="small"
                          sx={{ color: "#06816d" }}
                        />
                        <Box component={"div"}>
                          <Typography
                            component={"p"}
                            variant="caption"
                            sx={{ fontWeight: 550, color: grey[700] }}
                          >
                            Attached Files
                          </Typography>
                          <Box
                            component={"div"}
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              columnGap: "0.5em",
                              rowGap: "0.3em",
                            }}
                          >
                            <Box
                              component={"div"}
                              sx={{
                                padding: "0.2em 0.5em",
                                borderRadius: "0.3em",
                                backgroundColor: grey[200],
                                cursor: "pointer",
                                ":hover": {
                                  backgroundColor: blue[50],
                                },
                                ":hover .MuiTypography-caption": {
                                  color: blue[500],
                                },
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: grey[600] }}
                              >
                                guide-assessment.pdf
                              </Typography>
                            </Box>
                            <Box
                              component={"div"}
                              sx={{
                                padding: "0.2em 0.5em",
                                borderRadius: "0.3em",
                                backgroundColor: grey[200],
                                cursor: "pointer",
                                ":hover": {
                                  backgroundColor: blue[50],
                                },
                                ":hover .MuiTypography-caption": {
                                  color: blue[500],
                                },
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: grey[600] }}
                              >
                                schedule-interview.pdf
                              </Typography>
                            </Box>
                            <Box
                              component={"div"}
                              sx={{
                                padding: "0.2em 0.5em",
                                borderRadius: "0.3em",
                                backgroundColor: grey[200],
                                cursor: "pointer",
                                ":hover": {
                                  backgroundColor: blue[50],
                                },
                                ":hover .MuiTypography-caption": {
                                  color: blue[500],
                                },
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: grey[600] }}
                              >
                                submission-score-rules-2024.pdf
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      {/* assigned to */}
                      <Box
                        component={"div"}
                        sx={{
                          flexBasis: {
                            xs: "100%",
                            sm: "20%",
                          },
                          display: "flex",
                          columnGap: "0.3em",
                        }}
                      >
                        <AssignmentIndRounded
                          fontSize="small"
                          sx={{ color: "#06816d" }}
                        />
                        <Box component={"div"}>
                          <Typography
                            component={"p"}
                            variant="caption"
                            sx={{ fontWeight: 550, color: grey[700] }}
                          >
                            Assignee
                          </Typography>
                          <Typography
                            component={"p"}
                            variant="caption"
                            sx={{ color: grey[600] }}
                          >
                            13 Candidates
                          </Typography>
                          <Button
                            variant="text"
                            size="small"
                            startIcon={<Visibility fontSize="small" />}
                          >
                            Details
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Divider
                  orientation="horizontal"
                  sx={{ borderColor: grey[400] }}
                />
                <Box
                  component={"div"}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5em 0.8em",
                  }}
                >
                  <Button variant="contained" startIcon={<DonutLargeRounded />}>
                    View Submissions
                  </Button>
                  <Chip
                    label={
                      <Typography
                        variant="caption"
                        sx={{ color: blue[700], fontStyle: "italic" }}
                      >
                        4 submitted out of 13
                      </Typography>
                    }
                    size="small"
                    sx={{
                      paddingX: { xs: 0, sm: "0.5em" },
                      backgroundColor: blue[50],
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
          <Pagination
            color="primary"
            count={13}
            sx={{
              display: "flex",
              justifyContent: "end",
              marginY: "2em",
            }}
          />
        </Collapse>
        {/* Interviews */}
        <Collapse
          in={Boolean(tabOn === "interviews")}
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
              <Table>
                <TableHead>
                  <TableRow>
                    {responsiveColumnsInterviews.map((column, index) => (
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
                  {rowsInterviews.map((data: InterviewsProps, dataIndex) => (
                    <TableRow key={dataIndex}>
                      {responsiveColumnsInterviews.map((column, index) => {
                        switch (column.valueProp) {
                          case "#":
                            return (
                              <TableCell key={index}>{dataIndex + 1}</TableCell>
                            );
                          case "name":
                            return (
                              <TableCell key={index} size="small" sx={{}}>
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
                                  {!xsmallScreen && (
                                    <Avatar
                                      alt="candidate-profile"
                                      src="https://placehold.co/40x40"
                                      sx={{ width: 40, height: 40 }}
                                    />
                                  )}
                                  <Box component={"div"}>
                                    <Typography
                                      component={"p"}
                                      variant="subtitle2"
                                      sx={{ fontWeight: 550, color: grey[800] }}
                                    >
                                      {data.name}
                                    </Typography>
                                    <Typography
                                      component={"p"}
                                      variant="caption"
                                      sx={{ wordBreak: "break-word" }}
                                    >
                                      {data.email}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                            );
                          case "location":
                            return (
                              <TableCell key={index} sx={{ maxWidth: "15em" }}>
                                <Typography
                                  component={"p"}
                                  variant="subtitle2"
                                  sx={{ fontWeight: 550, color: grey[700] }}
                                >
                                  {data.location.name}
                                </Typography>
                                <Link
                                  component={ReactRouterLink}
                                  to={data.location.url}
                                  style={{ textDecoration: "none" }}
                                >
                                  <Typography
                                    component={"p"}
                                    variant="subtitle2"
                                    sx={{
                                      color: grey[600],
                                      ":hover": {
                                        color: blue[700],
                                        textDecoration: "underline",
                                      },
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {data.location.url}
                                  </Typography>
                                </Link>
                              </TableCell>
                            );
                          case "status":
                            return (
                              <TableCell key={index}>
                                <Chip
                                  label={data.status}
                                  size="small"
                                  sx={chipColorDeterminer(data.status)}
                                />
                              </TableCell>
                            );
                          case "option":
                            return (
                              <TableCell key={index} size="small" sx={{}}>
                                <Box
                                  component={"div"}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={(
                                      event: React.MouseEvent<HTMLButtonElement>
                                    ) =>
                                      setAnchorEl((prev) => ({
                                        ...prev,
                                        [tabOn]: event.currentTarget,
                                      }))
                                    }
                                  >
                                    <MoreVert fontSize="small" />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            );
                          case "schedule":
                            return (
                              <TableCell key={index}>
                                <Typography component={"p"} variant="caption">
                                  <SimpleEmphasis text={data.date} /> at{" "}
                                  {data.location.name}
                                </Typography>
                                <Link
                                  component={ReactRouterLink}
                                  to={data.location.url}
                                  target="_blank"
                                  style={{
                                    textDecoration: "none",
                                    fontStyle: "italic",
                                  }}
                                >
                                  <Typography
                                    component={"p"}
                                    variant="caption"
                                    sx={{
                                      color: grey[600],
                                      ":hover": {
                                        color: blue[500],
                                        textDecoration: "underline",
                                      },
                                    }}
                                  >
                                    Link here
                                  </Typography>
                                </Link>
                                <Divider
                                  orientation="horizontal"
                                  sx={{ marginY: "0.5em" }}
                                />
                                <Box
                                  component={"div"}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography variant="caption">
                                    Status
                                  </Typography>
                                  <Chip
                                    label={data.status}
                                    size="small"
                                    sx={chipColorDeterminer(data.status)}
                                  />
                                </Box>
                              </TableCell>
                            );
                          default:
                            return (
                              <TableCell key={index} size="small" sx={{}}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: grey[600] }}
                                >
                                  {
                                    data[
                                      column.valueProp as keyof InterviewsProps
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
              count={13}
              sx={{
                display: "flex",
                justifyContent: "end",
                marginY: "2em",
              }}
            />
          </Box>
        </Collapse>
        {/* Offerings */}
        <Collapse
          in={Boolean(tabOn === "offerings")}
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
              <Table>
                <TableHead>
                  <TableRow>
                    {responsiveColumnsOfferings.map((column, index) => (
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
                  {rowsOfferings.map((data: OfferingsProps, dataIndex) => (
                    <TableRow key={dataIndex}>
                      {responsiveColumnsOfferings.map((column, index) => {
                        switch (column.valueProp) {
                          case "#":
                            return (
                              <TableCell key={index}>{dataIndex + 1}</TableCell>
                            );
                          case "name":
                            return (
                              <TableCell key={index}>
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
                                  {!xsmallScreen && (
                                    <Avatar
                                      alt="candidate-profile"
                                      src="https://placehold.co/40x40"
                                      sx={{ width: 40, height: 40 }}
                                    />
                                  )}
                                  <Box component={"div"}>
                                    <Typography
                                      component={"p"}
                                      variant="subtitle2"
                                      sx={{ fontWeight: 550, color: grey[800] }}
                                    >
                                      {data.name}
                                    </Typography>
                                    <Typography
                                      component={"p"}
                                      variant="caption"
                                      sx={{ wordBreak: "break-word" }}
                                    >
                                      {data.email}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                            );
                          case "status":
                            return (
                              <TableCell key={index}>
                                <Chip
                                  label={data.status}
                                  size="small"
                                  sx={chipColorDeterminer(data.status)}
                                />
                              </TableCell>
                            );
                          case "option":
                            return (
                              <TableCell key={index}>
                                <Box
                                  component={"div"}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={(
                                      event: React.MouseEvent<HTMLButtonElement>
                                    ) =>
                                      setAnchorEl((prev) => ({
                                        ...prev,
                                        [tabOn]: event.currentTarget,
                                      }))
                                    }
                                  >
                                    <MoreVert fontSize="small" />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            );
                          case "offer":
                            return (
                              <TableCell key={index}>
                                <Typography variant="subtitle2">
                                  Ends on <SimpleEmphasis text={data.end} />
                                </Typography>
                                <Divider
                                  orientation="horizontal"
                                  sx={{ marginY: "0.5em" }}
                                />
                                <Box
                                  component={"div"}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography variant="caption">
                                    Status
                                  </Typography>
                                  <Chip
                                    label={data.status}
                                    size="small"
                                    sx={chipColorDeterminer(data.status)}
                                  />
                                </Box>
                              </TableCell>
                            );
                          default:
                            return (
                              <TableCell key={index}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: grey[600] }}
                                >
                                  {
                                    data[
                                      column.valueProp as keyof OfferingsProps
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
              count={13}
              sx={{
                display: "flex",
                justifyContent: "end",
                marginY: "2em",
              }}
            />
          </Box>
        </Collapse>
        {/* LoA */}
        <Collapse in={false}></Collapse>
        <Dialog
          maxWidth={"lg"}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
          fullScreen={smallScreen}
          PaperProps={{
            sx: {
              paddingX: "1em",
              "&::-webkit-scrollbar": {
                width: "0.5em",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: grey[300],
                borderRadius: "0.15em",
              },
            },
          }}
        >
          <Box
            component={"div"}
            sx={{ display: "flex", justifyContent: "end", paddingTop: "0.5em" }}
          >
            <IconButton onClick={() => setOpenDialog(false)}>
              <CloseRounded />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item lg={8} xs={12}>
              <CandidateProfile />
            </Grid>
            <Grid item lg={4} xs={12}>
              <PersonalDetail containerStyle={{ top: "0.5em" }} />
            </Grid>
          </Grid>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}
