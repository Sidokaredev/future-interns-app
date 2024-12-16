import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Dialog,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Popover,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DashboardLayout from "../../../components/Templates/DashboardLayout";
import { grey, lightBlue, red } from "@mui/material/colors";
import {
  AddRounded,
  BadgeRounded,
  BlockRounded,
  Business,
  CloseRounded,
  DeleteRounded,
  FoundationRounded,
  GroupWorkRounded,
  HomeRounded,
  LinearScaleRounded,
  LocationOnRounded,
  MeetingRoomRounded,
  MonetizationOnRounded,
  MoreVert,
  Place,
  SearchRounded,
  SortRounded,
  UpdateRounded,
  Visibility,
  WorkRounded,
  WorkspacePremiumRounded,
} from "@mui/icons-material";
import SimpleEmphasis from "../../../components/Molecules/Texts/SimpleEmphasis";
import React, { useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  Link as ReactRouterLink,
} from "react-router-dom";
import BreadcrumbsCreator from "../helpers";

export default function EmployerVacancies() {
  /* react-router */
  const navigate = useNavigate();
  const URLLocation = useLocation();
  const URLParams = useParams();
  /* breakpoint */
  const xsmall = useMediaQuery("(max-width: 600px)");
  const small = useMediaQuery("(max-width: 900px)");
  /* state */
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openMenuOptions = Boolean(anchorEl);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  /* event handler */
  const optionsOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  console.info(
    "Breadcrumbs \t:",
    BreadcrumbsCreator(
      URLParams as Record<string, string>,
      URLLocation.pathname
    )
  );
  console.info("current \t:", URLLocation.pathname);
  /* helpers */
  return (
    <DashboardLayout isFor="employer">
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: "1em" }}>
        {BreadcrumbsCreator(
          URLParams as Record<string, string>,
          URLLocation.pathname
        ).map((data, index) => (
          <Link
            key={index}
            component={ReactRouterLink}
            to={data.pathname}
            underline="hover"
            color="inherit"
            aria-current={
              data.pathname === URLLocation.pathname ? "page" : undefined
            }
            sx={{ display: "flex", alignItems: "center" }}
          >
            {data.label === "Vacancies" ? (
              <HomeRounded sx={{ mr: 0.5 }} fontSize="inherit" />
            ) : (
              data.label
            )}
          </Link>
        ))}
      </Breadcrumbs>
      {/* Search Panel */}
      <Box
        component={"div"}
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          rowGap: {
            xs: "0.5em",
            md: 0,
          },
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 550, color: grey[800] }}
        >
          Manage Vacancies
        </Typography>
        <Box
          component={"div"}
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "end",
            columnGap: "0.5em",
          }}
        >
          <TextField
            type="text"
            name="vacancies-search"
            placeholder="Search vacancy ..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                minWidth: {
                  xs: "auto",
                  md: "20em",
                },
                fontSize: "small",
              },
            }}
          />
          <Button
            variant="outlined"
            startIcon={!small && <SortRounded />}
            sx={{
              fontSize: "small",
            }}
          >
            {small ? <SortRounded /> : "Filters"}
          </Button>
          <Button
            variant="contained"
            startIcon={!small && <AddRounded />}
            sx={{ fontSize: "small" }}
            onClick={() => {
              console.info("Add vacancy ...");
            }}
          >
            {small ? <AddRounded /> : "Vacancy"}
          </Button>
        </Box>
      </Box>
      <Box component={"div"} sx={{ marginTop: "1em" }}>
        {small ? (
          [0, 1, 2, 3, 4].map((_, index) => (
            <Box
              key={index}
              component={"div"}
              sx={{
                border: "1px solid " + grey[400],
                borderRadius: "0.3em",
                marginBottom: "0.5em",
              }}
            >
              <Box
                component={"div"}
                sx={{ display: "flex", alignItems: "center", padding: "0.5em" }}
              >
                <Typography
                  component={"span"}
                  variant="subtitle1"
                  sx={{ fontWeight: 550, color: grey[800] }}
                >
                  Cloud Architect
                </Typography>
                <Chip
                  size="small"
                  label="Interns"
                  sx={{
                    backgroundColor: lightBlue[50],
                    color: lightBlue[500],
                    marginX: "1em",
                  }}
                />
              </Box>
              <Box
                component={"div"}
                sx={{ marginTop: "0.5em", paddingX: "0.5em" }}
              >
                <Typography
                  component={"p"}
                  variant="caption"
                  sx={{ color: grey[600] }}
                >
                  Posted on <SimpleEmphasis text={"Friday, 30 May 2024"} />
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 400, color: grey[600] }}
                >
                  Inactive on{" "}
                  <SimpleEmphasis
                    text={"Sunday, 6 June 2024"}
                    textColor={red[200]}
                  />
                </Typography>
              </Box>
              <Divider
                orientation="horizontal"
                sx={{ borderColor: grey[400], marginY: "0.5em" }}
              />
              <Box
                component={"div"}
                sx={{ display: "flex", columnGap: "0.5em", padding: "0.5em" }}
              >
                <Button
                  variant="outlined"
                  startIcon={<Visibility />}
                  size="small"
                  fullWidth
                  onClick={() => setOpenDialog(true)}
                >
                  View
                </Button>
                <IconButton size="small" onClick={optionsOnClick}>
                  <MoreVert />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Box component={"div"}>
            {/* table row */}
            <Box
              component={"div"}
              sx={{
                display: "flex",
                columnGap: "0.5em",
                padding: "0.5em",
                borderBottom: "1px solid " + grey[300],
              }}
            >
              <Box
                component={"div"}
                className="column"
                sx={{ flexBasis: "30%" }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[500] }}
                >
                  Position
                </Typography>
              </Box>
              <Box
                component={"div"}
                className="column"
                sx={{ flexBasis: "20%" }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[500] }}
                >
                  Posted
                </Typography>
              </Box>
              <Box
                component={"div"}
                className="column"
                sx={{ flexBasis: "20%" }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[500] }}
                >
                  Inactive
                </Typography>
              </Box>
              <Box
                component={"div"}
                className="column"
                sx={{ flexBasis: "20%" }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[500] }}
                >
                  Employee Type
                </Typography>
              </Box>
              <Box
                component={"div"}
                className="column"
                sx={{ flexBasis: "10%" }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 550, color: grey[500] }}
                >
                  Options
                </Typography>
              </Box>
            </Box>
            {/* table data */}
            <Box
              component={"div"}
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "0.3em",
                marginTop: "0.5em",
              }}
            >
              {[0, 1, 2, 3, 4].map((_, index) => (
                <Box
                  key={index}
                  component={"div"}
                  sx={{
                    display: "flex",
                    columnGap: "0.5em",
                    paddingY: "1em",
                    paddingX: "0.5em",
                    border: "1px solid " + grey[200],
                    // backgroundColor: grey[100],
                    borderRadius: "0.3em",
                    ":hover": {
                      backgroundColor: grey[200],
                    },
                  }}
                >
                  <Box component={"div"} sx={{ flexBasis: "30%" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 550, color: grey[800] }}
                    >
                      {index == 2
                        ? "Social Media Marketing at Erajaya Food & Nurishment"
                        : "Cloud Architect"}
                    </Typography>
                  </Box>
                  <Box component={"div"} sx={{ flexBasis: "20%" }}>
                    <Typography
                      variant="caption"
                      component={"p"}
                      sx={{
                        color: "#06816d",
                        fontWeight: 550,
                      }}
                    >
                      Friday, May 30, 2024
                    </Typography>
                  </Box>
                  <Box component={"div"} sx={{ flexBasis: "20%" }}>
                    <Typography
                      variant="caption"
                      component={"p"}
                      sx={{
                        color: red[300],
                        fontWeight: 500,
                        fontStyle: "italic",
                      }}
                    >
                      Monday, June 4, 2024
                    </Typography>
                  </Box>
                  <Box component={"div"} sx={{ flexBasis: "20%" }}>
                    <Chip
                      size="small"
                      label="Interns"
                      sx={{
                        backgroundColor: lightBlue[50],
                        color: lightBlue[500],
                      }}
                    />
                  </Box>
                  <Box
                    component={"div"}
                    sx={{
                      flexBasis: "10%",
                      display: "flex",
                      columnGap: "0.5em",
                    }}
                  >
                    <Button
                      variant="text"
                      startIcon={<Visibility fontSize="small" />}
                      size="small"
                      // onClick={() => setOpenDrawer(true)}
                      onClick={() => setOpenDialog(true)}
                    >
                      View
                    </Button>
                    <IconButton size="small" onClick={optionsOnClick}>
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        <Pagination
          color="primary"
          count={13}
          sx={{
            display: "flex",
            justifyContent: "end",
            marginY: "2em",
          }}
        />
        {/* Menu Options */}
        <Menu
          open={openMenuOptions}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          onClose={() => setAnchorEl(null)}
          slotProps={{
            paper: {
              sx: {
                minWidth: "10em",
                border: "1px solid " + grey[400],
                boxShadow: "none",
              },
            },
          }}
          MenuListProps={{
            sx: {},
          }}
          sx={{
            ".MuiMenuItem-root": {
              ":hover": {
                color: "#06816d",
                backgroundColor: grey[200],
              },
              ":hover > .MuiListItemIcon-root": {
                color: "#06816d",
              },
            },
            ".MuiMenuItem-root:nth-of-type(4)": {
              ":hover": {
                color: red[400],
              },
              ":hover > .MuiListItemIcon-root": {
                color: red[400],
              },
            },
          }}
        >
          <MenuItem
            sx={{ color: grey[600] }}
            onClick={() => {
              navigate(URLLocation.pathname + "/1/pipeline");
            }}
          >
            <ListItemIcon>
              <LinearScaleRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Pipeline"
              sx={{
                ".MuiListItemText-primary": {
                  fontSize: "small",
                  fontWeight: 550,
                },
              }}
            />
          </MenuItem>
          <MenuItem sx={{ color: grey[600] }}>
            <ListItemIcon>
              <UpdateRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Update"
              sx={{
                ".MuiListItemText-primary": {
                  fontSize: "small",
                  fontWeight: 550,
                },
              }}
            />
          </MenuItem>
          <MenuItem sx={{ color: grey[600] }}>
            <ListItemIcon>
              <BlockRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Disable"
              sx={{
                ".MuiListItemText-primary": {
                  fontSize: "small",
                  fontWeight: 550,
                },
              }}
            />
          </MenuItem>
          <MenuItem sx={{ color: red[200] }}>
            <ListItemIcon sx={{ color: red[200] }}>
              <DeleteRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Delete"
              sx={{
                ".MuiListItemText-primary": {
                  fontSize: "small",
                  fontWeight: 550,
                },
              }}
            />
          </MenuItem>
        </Menu>
        {/* Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="lg"
          fullWidth
          fullScreen={xsmall}
        >
          <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "end",
              paddingTop: "0.5em",
              paddingX: "1em",
            }}
          >
            <IconButton onClick={() => setOpenDialog(false)}>
              <CloseRounded />
            </IconButton>
          </Box>
          <Grid container>
            <Grid item xs={12} lgTablet={8}>
              <Box component={"div"} sx={{ margin: "0.5em" }}>
                <Box
                  component={"div"}
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: "0 1em",
                    paddingLeft: "1em",
                  }}
                >
                  <Avatar
                    alt="company-logo"
                    src="broken.jpg"
                    sx={{
                      width: small ? "4em" : "5em",
                      height: small ? "4em" : "5em",
                    }}
                  />
                  <Box component={"div"}>
                    <Typography
                      variant={small ? "subtitle2" : "h6"}
                      sx={{
                        fontWeight: 550,
                        color: grey[800],
                      }}
                    >
                      Cloud Architect
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: "0 1.5em" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "end",
                        }}
                      >
                        <Business fontSize="small" sx={{ color: "#06816d" }} />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: small ? 500 : 550,
                            color: grey[600],
                            marginLeft: "0.5em",
                          }}
                        >
                          PT. Sidokaredev Karya Mandiri
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "end",
                        }}
                      >
                        <Place fontSize="small" sx={{ color: "#06816d" }} />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: small ? 500 : 550,
                            color: grey[600],
                            marginLeft: "0.5em",
                          }}
                        >
                          Sidoarjo, Indonesia (INA)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box component={"div"} sx={{ padding: "1em" }}>
                  <Stack
                    direction={"column"}
                    spacing={2}
                    sx={{ marginY: "0.5em" }}
                  >
                    {/* decription */}
                    <Box component={"div"}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 550, color: grey[800] }}
                      >
                        Description
                      </Typography>
                      <Typography variant="body1" sx={{ color: grey[600] }}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Cupiditate quo hic tenetur voluptas laboriosam a
                        cum rem voluptatem dignissimos dicta ipsam quasi in,
                        minima ut aperiam. Exercitationem suscipit maiores
                        similique!
                      </Typography>
                    </Box>
                    {/* qualification */}
                    <Box component={"div"}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 550, color: grey[800] }}
                      >
                        Qualification
                      </Typography>
                      <ul>
                        {[0, 1, 2, 3].map((_, index) => (
                          <li key={index} style={{ marginLeft: "1em" }}>
                            <Typography
                              variant="body1"
                              sx={{ color: grey[600] }}
                            >
                              Lorem, ipsum dolor sit amet consectetur
                              adipisicing elit
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    </Box>
                    {/* responsibility */}
                    <Box component={"div"}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 550, color: grey[800] }}
                      >
                        Responsibility
                      </Typography>
                      <ul>
                        {[0, 1, 2, 3].map((_, index) => (
                          <li key={index} style={{ marginLeft: "1em" }}>
                            <Typography
                              variant="body1"
                              sx={{ color: grey[600] }}
                            >
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit. Perspiciatis atque modi mollitia?
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} lgTablet={4}>
              <Box
                component={"div"}
                sx={{ margin: "0.5em", paddingRight: "1em" }}
              >
                <Typography
                  component={"p"}
                  variant="subtitle1"
                  sx={{
                    fontWeight: 550,
                    marginBottom: "1em",
                    paddingLeft: "1em",
                  }}
                >
                  Job Information
                </Typography>
                <Stack
                  direction={"column"}
                  spacing={2}
                  sx={{
                    padding: "1em",
                    border: "1px solid " + grey[300],
                    borderRadius: "0.3em",
                  }}
                >
                  <Box
                    component={"div"}
                    sx={{ display: "flex", columnGap: "0.5em" }}
                  >
                    <FoundationRounded />
                    <Box component={"div"}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                        Line Industry
                      </Typography>
                      <Typography variant="caption">Technology</Typography>
                    </Box>
                  </Box>
                  <Box
                    component={"div"}
                    sx={{ display: "flex", columnGap: "0.5em" }}
                  >
                    <LocationOnRounded />
                    <Box component={"div"}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                        Location
                      </Typography>
                      <Typography variant="caption">
                        Kabupaten Sidoarjo
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    component={"div"}
                    sx={{ display: "flex", columnGap: "0.5em" }}
                  >
                    <BadgeRounded />
                    <Box component={"div"}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                        Employee Type
                      </Typography>
                      <Typography variant="caption">Intern</Typography>
                    </Box>
                  </Box>
                  <Box
                    component={"div"}
                    sx={{ display: "flex", columnGap: "0.5em" }}
                  >
                    <WorkspacePremiumRounded />
                    <Box component={"div"}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                        Experience
                      </Typography>
                      <Typography variant="caption">2+ years</Typography>
                    </Box>
                  </Box>
                  <Box
                    component={"div"}
                    sx={{ display: "flex", columnGap: "0.5em" }}
                  >
                    <MonetizationOnRounded />
                    <Box component={"div"}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                        Salary
                      </Typography>
                      <Typography variant="caption">
                        {Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(3200000)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    component={"div"}
                    sx={{ display: "flex", columnGap: "0.5em" }}
                  >
                    <MeetingRoomRounded />
                    <Box component={"div"}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 550 }}>
                        Work Arrangement
                      </Typography>
                      <Typography variant="caption">Remote Work</Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}
