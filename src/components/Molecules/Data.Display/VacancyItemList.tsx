import { LocationOnOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  Divider,
  Typography,
} from "@mui/material";
import { VacancyType } from "../../../pages/employers/types";
import { blue, grey } from "@mui/material/colors";
import { EmployerTypeStyler } from "../../../pages/employers/helpers";
import { useNavigate } from "react-router-dom";
import { GetSession } from "../../../pages/global-helpers";
import React, { useState } from "react";
import RequestAPI from "../../../services/api/request";
import SimpleEmphasis from "../Texts/SimpleEmphasis";

export default function VacancyItemList({
  appliedVacancies,
  vacancy,
  setOpenDialog,
  setAlert,
  setDataAction,
}: {
  appliedVacancies: string[];
  vacancy: VacancyType;
  setOpenDialog: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setAlert: React.Dispatch<React.SetStateAction<{ show: boolean, message: string }>>;
  setDataAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  /* react-router */
  const navigate = useNavigate();

  /* state */
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialogConfirmation, setOpenDialogConfirmation] = useState<boolean>(false);

  /* helpers */
  const daysFormatter = (created_at: string): string => {
    const createdDate = new Date(created_at).getTime();
    const now = new Date(Date.now()).getTime();
    const dateDiff = now - createdDate;

    const daysInMs = 1000 * 60 * 60 * 24;
    const daysDiff = Math.floor(dateDiff / daysInMs)

    let daysAgo: string
    if (daysDiff <= 0) {
      daysAgo = "today"
    } else {
      daysAgo = `${daysDiff} days ago`
    }
    return daysAgo;
  };

  /* constants */
  const isAuthenticated = GetSession("auth");
  const setApplied = new Set(appliedVacancies);

  /* onApply */
  const onApply = async () => {
    setLoading(true);

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.FormDataRequest({ vacancy_id: vacancy.id }).Send<string>(
      "/api/v1/candidates/pipelines/",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(false);
      setOpenDialogConfirmation(false);
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setLoading(false);
      setOpenDialogConfirmation(false);
      setDataAction(prev => !prev);
      return setAlert({ show: true, message: success });
    };
  };
  return (
    <Box
      component={"div"}
      sx={{
        border: "1px solid #e6f2f0",
        borderRadius: "0.5em",
        marginBottom: "1.5em",
      }}
    >
      {/* header */}
      <Box
        component={"div"}
        sx={{
          display: "flex",
          padding: "0.5em",
        }}
      >
        <Box borderRadius={"0.3em"}>
          <Avatar alt="Company Logo" src={"http://localhost:3000" + vacancy.employer.profile_image_path} />
        </Box>
        <Box component={"div"} sx={{ flexGrow: 1, paddingX: "0.5em" }}>
          <Box
            component={"div"}
            sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
          >
            <Typography
              component={"span"}
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                letterSpacing: "0.02em",
                color: "#555555",
                marginRight: "1em",
              }}
            >
              {vacancy.position}
            </Typography>
            <Typography
              component={"span"}
              variant="caption"
              sx={{
                color: "#999999",
              }}
            >
              {daysFormatter(vacancy.created_at)}
            </Typography>
          </Box>
          <Box display={"flex"}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#777777",
                fontWeight: "bold",
              }}
            >
              {vacancy.employer.name}
            </Typography>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ marginX: "0.5em" }}
            />
            <Typography component={"p"} variant="subtitle2"
              sx={{ color: grey[600] }}
            >
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(vacancy.salary)}
            </Typography>
          </Box>
        </Box>
        <Box
          component={"div"}
          sx={{
            padding: "0.3em",
          }}
        >
          <Chip
            size="small"
            label={vacancy.employee_type}
            sx={{
              backgroundColor: EmployerTypeStyler(vacancy.employee_type).backgroundColor,
              color: EmployerTypeStyler(vacancy.employee_type).color,
            }}
          />
          {/* <IconButton size="small" sx={{ border: "1px solid #cde6e2" }}>
            <BookmarkBorder fontSize="small" color="primary" />
          </IconButton> */}
        </Box>
      </Box>
      {/* content */}
      <Box component={"div"} sx={{ padding: "0.5em" }}>
        <Box component={"div"} sx={{ marginY: "0.5em" }}>
          <Typography variant="body2" color={"#555555"} sx={{ whiteSpace: "pre-line" }}>
            {vacancy.description}
          </Typography>
        </Box>
        <Box
          component={"div"}
          className="vacancy-category vacancy-tags"
          marginTop={"1.5em"}
        >
          {/* more chip */}
          <Chip
            size="small"
            variant="filled"
            label={vacancy.line_industry}
            sx={{
              backgroundColor: "#cde6e2",
              color: grey[600]
            }}
          />
        </Box>
      </Box>
      {/* action */}
      <Box
        component={"div"}
        padding={"0.5em 1em"}
        display={"flex"}
        justifyContent={"space-between"}
        bgcolor={"#e6f2f0"}
      >
        <Box>
          <Chip
            icon={<LocationOnOutlined />}
            label={<Typography variant="subtitle2" sx={{ color: grey[700], fontWeight: 550 }}>{vacancy.employer.location}</Typography>}
            sx={{ backgroundColor: "transparent" }}
          />
        </Box>
        <Box component={"div"}
          sx={{
            display: "flex",
            columnGap: "0.5em"
          }}
        >
          <Button variant="contained" color="primary" size="small" disabled={setApplied.has(vacancy.id)}
            onClick={() => {
              if (!isAuthenticated) {
                return setOpenDialog(prev => ({ ...prev, ["unauthenticated"]: true }))
              }
              return setOpenDialogConfirmation(true);
            }}
          >
            {setApplied.has(vacancy.id) ? "Applied" : "Apply"}
          </Button>
          <Button variant="outlined" color="primary" size="small"
            onClick={() => {
              navigate("/vacancy/" + vacancy.id)
            }}
          >
            View
          </Button>
        </Box>
      </Box>
      {/* Application Confirmation Dialog */}
      <Dialog
        open={openDialogConfirmation}
        maxWidth="sm"
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
            Are you sure you want to <SimpleEmphasis text={" apply"} /> ?
          </Typography>
          <Typography component={"p"} variant="body1">
            Please ensure your profile is complete. If you want to update or completing your profile,
            <Typography component={"a"} variant="body1"
              sx={{
                color: blue[500],
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => navigate("/candidates/profile-overview")}
            >
              {" click here"}
            </Typography>
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
            onClick={() => setOpenDialogConfirmation(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            endIcon={loading && <CircularProgress size={15} />}
            disabled={loading}
            onClick={() => {
              onApply();
            }}
          >
            Apply Now
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
