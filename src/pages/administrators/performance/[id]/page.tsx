import { Box, Button, Checkbox, Container, Dialog, FormControlLabel, FormGroup, Grid, IconButton, InputAdornment, ListItemIcon, ListItemText, Menu, MenuItem, Pagination, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PerformanceTestLayout from "../../../../components/Templates/PerformanceTestLayout";
import { amber, grey } from "@mui/material/colors";
import React, { ChangeEvent, useEffect, useState } from "react";
import { GetSession, onCloseSnackbar } from "../../../global-helpers";
import RequestAPI from "../../../../services/api/request";
import { FunctionsRounded, LaunchRounded, MoreVertRounded, SearchRounded } from "@mui/icons-material";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as TooltipChart,
  Title
} from 'chart.js';
import { LogType } from "./types";
import { PreferencesProps, SAW } from "../../../../services/mcdm-saw";
import { BlockMath, InlineMath } from "react-katex";
import { Top3RankStyles } from "../../../employers/helpers";
import { criteriaSet } from "./constants";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  TooltipChart,
  Title
);

type CacheSessionInfoType = {
  detail: {
    id: number;
    label: string;
    status: string | null;
    created_at: string;
  };
  no_cache: {
    write: string;
    read: string;
  };
  cache_aside: string;
  read_through: string;
  write_through: string;
  write_behind: string;
};

export default function TestSessionPage() {
  /* react-router */
  const { id: sessionID } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  /* Local Storage */
  const sawWeightsConfig = localStorage.getItem("saw_weights_config");
  let weightsSetValue: [string, number][];
  if (!sawWeightsConfig) {
    weightsSetValue = [
      ["cache_hit", 0.2],
      ["cache_miss", 0.2],
      ["response_time", 0.3],
      ["resource_utilization", 0.3]
    ];
    const strValue = JSON.stringify(weightsSetValue);
    localStorage.setItem("saw_weights_config", strValue);
  } else {
    weightsSetValue = JSON.parse(sawWeightsConfig);
  };

  /* state */
  const [cacheSessionStatus, setCacheSessionStatus] = useState<CacheSessionInfoType | null>(null);
  const [allRequestLogs, setAllRequestLogs] = useState<LogType[]>([]);
  const [selectedRank, setSelectedRank] = useState<PreferencesProps<LogType>>();
  const [pageRankTable, setPageRankTable] = useState<number>(1);
  const [pageAltTable, setPageAltTable] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<Record<string, string>>({
    "alternative": "",
    "preference": "",
  });
  const [weightsSetting, setWeightsSetting] = useState<Record<string, string>>({
    "cache_hit": weightsSetValue[0][1].toString(),
    "cache_miss": weightsSetValue[1][1].toString(),
    "response_time": weightsSetValue[2][1].toString(),
    "resource_utilization": weightsSetValue[3][1].toString(),
  });
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  const [datasetRadarOption, setDatasetRadarOption] = useState<Record<string, boolean>>({
    "no-cache-write": false,
    "no-cache-read": false,
    "cache-aside": false,
    "read-through": false,
    "write-through": false,
    "write-behind": false,
  });
  const [datasetRadar, setDatasetRadar] = useState<Record<string, number[]>>({
    "no-cache-write": [],
    "no-cache-read": [],
    "cache-aside": [],
    "read-through": [],
    "write-through": [],
    "write-behind": [],
  });
  const [topRankPreferences, setTopRankPreferences] = useState<Record<string, PreferencesProps<LogType>>>({});
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [alert, setAlert] = useState<{ show: boolean; message: string; }>({ show: false, message: "" });
  // const [refetch, setRefetch] = useState<Record<string, boolean>>({});

  /* constants */
  const _defaultAltPerPage = 15;
  const _defaultPrefPerPage = 15;
  const token = GetSession("auth");
  const noCacheCompletedTest = cacheSessionStatus ? Object.entries(cacheSessionStatus.no_cache).map(([_, value]) => {
    return value;
  }).filter(value => value === "completed") : [];
  const totalTestCompleted = cacheSessionStatus ? Object.entries(cacheSessionStatus).filter(([key, value]) => {
    if (key === "detail") return false;
    if (key === "no_cache") {
      const noCache = value as { write: string; read: string };
      return noCache.write === "completed" && noCache.read === "completed";
    }
    return value === "completed"
  }) : [];
  const noCacheWriteLogs = allRequestLogs.filter(log_ => log_.cache_type === "no-cache-write");
  const noCacheReadLogs = allRequestLogs.filter(log_ => log_.cache_type === "no-cache-read");
  const cacheAsideLogs = allRequestLogs.filter(log_ => log_.cache_type === "cache-aside");
  const readThroughLogs = allRequestLogs.filter(log_ => log_.cache_type === "read-through");
  const writeThroughLogs = allRequestLogs.filter(log_ => log_.cache_type === "write-through");
  const writeBehindLogs = allRequestLogs.filter(log_ => log_.cache_type === "write-behind");

  /* SAW */
  let rankRequestLogs: PreferencesProps<LogType>[] = [];
  const saw = new SAW<LogType>({
    label: "All Cache Pattern",
    criteria: criteriaSet,
    weights: new Set(weightsSetValue),
  }, { withOrigin: true });

  if (allRequestLogs.length > 0) {
    saw.StoreAlternatives(allRequestLogs);
    rankRequestLogs = saw.GetRanking({
      precision: 4
    }).filter((rank) => {
      const byCachePattern = rank.origin?.cache_type.includes(searchQuery["preference"]);
      const byPreferenceValue = rank.finalPreferenceValue.toString().includes(searchQuery["preference"]);
      return byCachePattern || byPreferenceValue;
    }).slice((pageRankTable * _defaultPrefPerPage) - _defaultPrefPerPage, pageRankTable * _defaultPrefPerPage);
  };

  /* handlers */
  const weightOnChange = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (Number.isNaN(Number(value))) {
      return;
    }
    if (Number.isNaN(Number.parseFloat(value))) {
      return;
    }
    if (Number.parseFloat(value) > 1) {
      return setAlert({ show: true, message: "value should be less than 1! " });
    };
    if (value.length > 4) {
      return setAlert({ show: true, message: "maximum length!" })
    }
    setWeightsSetting(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  const ApplyWeights = () => {
    const weights = localStorage.getItem("saw_weights_config");
    if (!weights) {
      console.log("local storage: key not found");
      return;
    } else {
      const arrConfig: [string, number][] = JSON.parse(weights);
      arrConfig[0][1] = Number.parseFloat(weightsSetting["cache_hit"]);
      arrConfig[1][1] = Number.parseFloat(weightsSetting["cache_miss"]);
      arrConfig[2][1] = Number.parseFloat(weightsSetting["response_time"]);
      arrConfig[3][1] = Number.parseFloat(weightsSetting["resource_utilization"]);
      const jsonStr = JSON.stringify(arrConfig);
      localStorage.setItem("saw_weights_config", jsonStr);
      return setAlert({ show: true, message: "weight changed." });
    }
  };
  const CheckboxOnChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setDatasetRadarOption(prev => ({
      ...prev,
      [key]: event.target.checked
    }));
  };
  const ApplyDataset = (option: Record<string, boolean>) => {
    const saw = new SAW<LogType>({
      label: "comparison",
      criteria: criteriaSet,
      weights: new Set(weightsSetValue),
    }, {
      withOrigin: true,
    });
    const alternatives: LogType[] = [];
    Object.entries(option).forEach(([key, value], _) => {
      if (value) {
        switch (key) {
          case "no-cache-write":
            alternatives.push(...noCacheWriteLogs);
            break;
          case "no-cache-read":
            alternatives.push(...noCacheReadLogs);
            break;
          case "cache-aside":
            alternatives.push(...cacheAsideLogs);
            break;
          case "read-through":
            alternatives.push(...readThroughLogs);
            break;
          case "write-through":
            alternatives.push(...writeThroughLogs);
            break;
          case "write-behind":
            alternatives.push(...writeBehindLogs);
            break;

          default:
            break;
        }
      }
    });

    saw.StoreAlternatives(alternatives);
    const preferences = saw.GetRanking({ precision: 4 });
    const datasets: Record<string, number[]> = {};
    const topPreferences: Record<string, PreferencesProps<LogType>> = {};
    Object.entries(option).forEach(([key, value], __) => {
      if (value) {
        const dataset = preferences.filter(P => P.origin?.cache_type === key).sort((pA, pB) => pB.finalPreferenceValue - pA.finalPreferenceValue)[0];
        datasets[key] = Object.entries(dataset.weightedNormalizedDecisionMatrix).map(([_, value]) => {
          return value;
        });
        datasets[key].push(dataset.finalPreferenceValue);

        topPreferences[key] = dataset;
      } else {
        datasets[key] = [];
      }
    });
    setTopRankPreferences(topPreferences);
    setDatasetRadar(datasets);
  };
  const ResetDataset = () => {
    setTopRankPreferences({});
    setDatasetRadar({
      "no-cache-write": [],
      "no-cache-read": [],
      "cache-aside": [],
      "read-through": [],
      "write-through": [],
      "write-behind": [],
    });
    setDatasetRadarOption({
      "no-cache-write": false,
      "no-cache-read": false,
      "cache-aside": false,
      "read-through": false,
      "write-through": false,
      "write-behind": false,
    });
  };

  useEffect(() => {
    (async () => {
      const [data, fail] = await RequestAPI.Send<CacheSessionInfoType>(
        "/api/v1/administrators/test/" + sessionID + "/status",
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          }
        }
      );
      if (fail) {
        console.info("fail getting session info \t:", fail);
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setCacheSessionStatus(data);
      };
    })();
  }, []); // refetch["session-status"]
  useEffect(() => {
    (async () => {
      const [data, fail] = await RequestAPI.Send<LogType[]>(
        "/api/v1/administrators/test/" + sessionID + "/logs/all",
        { method: "GET", headers: { "Authorization": "Bearer " + token } },
      );
      if (fail) {
        console.info("all request logs \t:", fail);
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setAllRequestLogs(data);
      };
    })();
  }, []); //refetch["all-request-logs"]
  return (
    <PerformanceTestLayout>
      {/* Default Notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        message={alert.message}
        autoHideDuration={3000}
        onClose={onCloseSnackbar(setAlert)}
      />
      <Container maxWidth="lg" disableGutters
        sx={{
          paddingX: "0.5em",
          marginTop: "-10em",
        }}
      >
        {/* Data Visualization Container */}
        <Box component={"div"} className="session-information"
          sx={{
            marginBottom: "1.5em",
          }}
        >
          <Typography component={"p"} variant="h6"
            sx={{
              color: "#c2fffb",
              marginBottom: "0.3em",
            }}
          >
            {cacheSessionStatus?.detail.label}
          </Typography>
          <Box component={"div"}
            sx={{
              padding: "1em",
              backgroundColor: "white",
              borderRadius: "0.3em",
              border: "1px solid " + grey[200],
            }}
          >
            {/* Radar Chart Container */}
            <Grid container columnGap={1}>
              <Grid item xs={7}>
                {/* Radar Chart Component */}
                <Box component={"div"} height={"30em"}>
                  <Radar
                    data={{
                      labels: ["Cache Hit", "Cache Miss", "Response Time", "Resource Utilization", "Preference Value"],
                      datasets: [
                        {
                          label: "No Cache Write",
                          data: [...datasetRadar["no-cache-write"]],
                          backgroundColor: "rgba(167, 0, 0, 0.2)",
                          borderColor: "rgba(167, 0, 0, 1)",
                          borderWidth: 2,
                        },
                        {
                          label: "No Cache Read",
                          data: [...datasetRadar["no-cache-read"]],
                          backgroundColor: "rgba(255, 0, 0, 0.2)",
                          borderColor: "rgba(255, 0, 0, 1)",
                          borderWidth: 2,
                        },
                        {
                          label: "Cache Aside",
                          data: [...datasetRadar["cache-aside"]],
                          backgroundColor: "rgba(54, 162, 235, 0.2)",
                          borderColor: "rgba(54, 162, 235, 1)",
                          borderWidth: 2,
                        },
                        {
                          label: "Read Through",
                          data: [...datasetRadar["read-through"]],
                          backgroundColor: "rgba(75, 192, 192, 0.2)",
                          borderColor: "rgba(75, 192, 192, 1)",
                          borderWidth: 2,
                        },
                        {
                          label: "Write Through",
                          data: [...datasetRadar["write-through"]],
                          backgroundColor: "rgba(153, 102, 255, 0.2)",
                          borderColor: "rgba(153, 102, 255, 1)",
                          borderWidth: 2,
                        },
                        {
                          label: "Write Behind",
                          data: [...datasetRadar["write-behind"]],
                          backgroundColor: "rgba(255, 159, 64, 0.2)",
                          borderColor: "rgba(255, 159, 64, 1)",
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false, // Supaya chart tetap di tengah dengan ukuran fleksibel
                      plugins: {
                        title: {
                          text: "Cache Strategy Preference Comparison",
                          display: true,
                          padding: { bottom: 20 },
                          font: {
                            size: 14
                          }
                        },
                        tooltip: {
                          backgroundColor: "white",
                          bodyColor: grey[700],
                          titleColor: grey[700],
                          borderColor: grey[300],
                          borderWidth: 1,
                        },
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        r: {
                          animate: true,
                          ticks: {
                            stepSize: 0.2,
                          },
                          grid: {
                            circular: true,
                            color: () => {
                              // const value = context.tick.value; // Ambil nilai grid line (misal: 20, 40, 60, 80, 100)
                              // if (value >= 80) return "red"; // Garis lingkaran luar (80 ke atas) → Merah
                              // if (value >= 60) return "orange"; // Garis tengah (60-79) → Oranye
                              // if (value >= 40) return "green"; // Garis tengah bawah (40-59) → Hijau
                              return grey[300]; // Garis paling dalam (0-39) → Biru
                            },
                          },
                          min: 0,
                          angleLines: {
                            color: grey[300],
                          }
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                {/* Radar Chart Control Component */}
                <Box component={"div"}>
                  <Typography component={"p"} variant="subtitle2"
                    sx={{
                      fontWeight: 550,
                      color: grey[700],
                    }}
                  >
                    Datasets
                  </Typography>
                  <Box component={"div"} className="datasets-color"
                    sx={{
                      marginY: "0.5em",
                      display: "flex",
                      columnGap: "0.5em",
                      rowGap: "0.1em",
                      flexWrap: "wrap"
                    }}
                  >
                    <Box component={"div"}
                      sx={{
                        flexBasis: "45%",
                        display: "flex",
                        columnGap: "0.5em",
                        alignItems: "center",
                      }}
                    >
                      <Box component={"div"}
                        sx={{
                          width: "2em",
                          height: "1em",
                          backgroundColor: "#a70000",
                          borderRadius: "0.2em",
                        }}
                      />
                      <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[600] }}>No Cache Write</Typography>
                    </Box>
                    <Box component={"div"}
                      sx={{
                        flexBasis: "45%",
                        display: "flex",
                        columnGap: "0.5em",
                        alignItems: "center",
                      }}
                    >
                      <Box component={"div"}
                        sx={{
                          width: "2em",
                          height: "1em",
                          backgroundColor: "#ff0000",
                          borderRadius: "0.2em",
                        }}
                      />
                      <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[600] }}>No Cache Read</Typography>
                    </Box>
                    <Box component={"div"}
                      sx={{
                        flexBasis: "45%",
                        display: "flex",
                        columnGap: "0.5em",
                        alignItems: "center",
                      }}
                    >
                      <Box component={"div"}
                        sx={{
                          width: "2em",
                          height: "1em",
                          backgroundColor: "rgba(54, 162, 235, 1)",
                          borderRadius: "0.2em",
                        }}
                      />
                      <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[600] }}>Cache Aside</Typography>
                    </Box>
                    <Box component={"div"}
                      sx={{
                        flexBasis: "45%",
                        display: "flex",
                        columnGap: "0.5em",
                        alignItems: "center",
                      }}
                    >
                      <Box component={"div"}
                        sx={{
                          width: "2em",
                          height: "1em",
                          backgroundColor: "rgba(75, 192, 192, 1)",
                          borderRadius: "0.2em",
                        }}
                      />
                      <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[600] }}>Read Through</Typography>
                    </Box>
                    <Box component={"div"}
                      sx={{
                        flexBasis: "45%",
                        display: "flex",
                        columnGap: "0.5em",
                        alignItems: "center",
                      }}
                    >
                      <Box component={"div"}
                        sx={{
                          width: "2em",
                          height: "1em",
                          backgroundColor: "rgba(153, 102, 255, 1)",
                          borderRadius: "0.2em",
                        }}
                      />
                      <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[600] }}>Write Through</Typography>
                    </Box>
                    <Box component={"div"}
                      sx={{
                        flexBasis: "45%",
                        display: "flex",
                        columnGap: "0.5em",
                        alignItems: "center",
                      }}
                    >
                      <Box component={"div"}
                        sx={{
                          width: "2em",
                          height: "1em",
                          backgroundColor: "rgba(255, 159, 64, 1)",
                          borderRadius: "0.2em",
                        }}
                      />
                      <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[600] }}>Write Behind</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box component={"div"}
                  sx={{
                    marginTop: "1.5em",
                  }}
                >
                  <Typography component={"p"} variant="subtitle2"
                    sx={{
                      fontWeight: 550,
                      color: grey[700],
                    }}
                  >
                    Choose a dataset to display on the chart
                  </Typography>
                  <Box component={"div"}>
                    <FormGroup>
                      <FormControlLabel control={
                        <Checkbox size="small"
                          checked={datasetRadarOption["no-cache-write"]}
                          onChange={CheckboxOnChange("no-cache-write")}
                          sx={{ paddingY: "0.3em" }} />
                      } label={
                        <Typography component={"p"} variant="body2"
                          sx={{ color: grey[600] }}
                        >
                          No Cache Write
                        </Typography>
                      }
                        disabled={noCacheWriteLogs.length === 0} />
                      <FormControlLabel control={
                        <Checkbox size="small"
                          checked={datasetRadarOption["no-cache-read"]}
                          onChange={CheckboxOnChange("no-cache-read")}
                          sx={{ paddingY: "0.3em" }} />
                      } label={
                        <Typography component={"p"} variant="body2"
                          sx={{ color: grey[600] }}
                        >
                          No Cache Read
                        </Typography>
                      }
                        disabled={noCacheReadLogs.length === 0} />
                      <FormControlLabel control={
                        <Checkbox size="small"
                          checked={datasetRadarOption["cache-aside"]}
                          onChange={CheckboxOnChange("cache-aside")}
                          sx={{ paddingY: "0.3em" }} />
                      } label={
                        <Typography component={"p"} variant="body2"
                          sx={{ color: grey[600] }}
                        >
                          Cache Aside
                        </Typography>
                      }
                        disabled={cacheAsideLogs.length === 0} />
                      <FormControlLabel control={
                        <Checkbox size="small"
                          checked={datasetRadarOption["read-through"]}
                          onChange={CheckboxOnChange("read-through")}
                          sx={{ paddingY: "0.3em" }} />
                      } label={
                        <Typography component={"p"} variant="body2"
                          sx={{ color: grey[600] }}
                        >
                          Read Through
                        </Typography>
                      }
                        disabled={readThroughLogs.length === 0} />
                      <FormControlLabel control={
                        <Checkbox size="small"
                          checked={datasetRadarOption["write-through"]}
                          onChange={CheckboxOnChange("write-through")}
                          sx={{ paddingY: "0.3em" }} />
                      } label={
                        <Typography component={"p"} variant="body2"
                          sx={{ color: grey[600] }}
                        >
                          Write Through
                        </Typography>
                      }
                        disabled={writeThroughLogs.length === 0} />
                      <FormControlLabel control={
                        <Checkbox size="small"
                          checked={datasetRadarOption["write-behind"]}
                          onChange={CheckboxOnChange("write-behind")}
                          sx={{ paddingY: "0.3em" }} />
                      } label={
                        <Typography component={"p"} variant="body2"
                          sx={{ color: grey[600] }}
                        >
                          Write Behind
                        </Typography>
                      }
                        disabled={writeBehindLogs.length === 0} />
                    </FormGroup>
                    <Box component={"div"}
                      sx={{
                        marginTop: "1.5em",
                        display: "flex",
                        justifyContent: "end",
                        columnGap: "0.5em",
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        sx={{
                          minWidth: "7em"
                        }}
                        onClick={() => ResetDataset()}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          minWidth: "7em"
                        }}
                        onClick={() => ApplyDataset(datasetRadarOption)}
                      >
                        Apply
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={5.5}>
                {/* Decision Criteria and Weights */}
                <Box component={"div"}>
                  <Typography component={"p"} variant="subtitle2"
                    sx={{
                      marginY: "0.5em",
                      fontWeight: 550,
                      color: grey[700]
                    }}
                  >
                    Criteria and Weights
                  </Typography>
                  <TableContainer>
                    <Table
                      size="small"
                      sx={{
                        padding: "1em",
                        borderRadius: "0.3em",
                        borderCollapse: "unset",
                        border: "1px solid " + grey[200],
                        ".MuiTableCell-root": {
                          border: "none",
                        },
                        ".MuiTableRow-root": {
                        },
                      }}
                    >
                      <TableHead
                        sx={{
                          ".MuiTypography-root": {
                            color: grey[600],
                          }
                        }}
                      >
                        <TableRow>
                          <TableCell>
                            <Typography component={"p"} variant="subtitle2">
                              Criteria
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component={"p"} variant="subtitle2">
                              Description
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component={"p"} variant="subtitle2">
                              Weight
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component={"p"} variant="subtitle2">
                              Attribute
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody
                        sx={{
                          ".MuiTypography-root": {
                            color: grey[600],
                            fontWeight: 550
                          }
                        }}
                      >
                        {Object.entries(saw.GetCriteriaRecord()).map(([key, attribute], index) => {
                          const nameOfCriteria = key.split("_").map((str) => `${str.charAt(0).toUpperCase()}${str.substring(1)}`).join(" ");
                          const weight = saw.GetWeightRecord()[key];
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                <Typography component={"p"} variant="subtitle2">
                                  {`C${index + 1}`}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography component={"p"} variant="subtitle2">
                                  {nameOfCriteria}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography component={"p"} variant="subtitle2">
                                  {weight}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography component={"p"} variant="subtitle2">
                                  {attribute}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
              <Grid item xs={5.5}>
                {/* Highest Preferences */}
                <Box component={"div"}>
                  <Typography component={"p"} variant="subtitle2"
                    sx={{
                      marginY: "0.5em",
                      fontWeight: 550,
                      color: grey[700]
                    }}
                  >
                    Highest Value
                  </Typography>
                  <TableContainer sx={{ height: "100%" }}>
                    <Table
                      size="small"
                      sx={{
                        padding: "1em",
                        borderRadius: "0.3em",
                        borderCollapse: "unset",
                        border: "1px solid " + grey[200],
                        ".MuiTableCell-root": {
                          border: "none",
                        },
                        ".MuiTableRow-root": {
                        },
                      }}
                    >
                      <TableHead
                        sx={{
                          ".MuiTypography-root": {
                            color: grey[600],
                          }
                        }}
                      >
                        <TableRow>
                          <TableCell>
                            <Typography component={"p"} variant="subtitle2">
                              Cache Type
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component={"p"} variant="subtitle2">
                              C1
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component={"p"} variant="subtitle2">
                              C2
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component={"p"} variant="subtitle2">
                              C3
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component={"p"} variant="subtitle2">
                              C4
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody
                        sx={{
                          ".MuiTypography-root": {
                            color: grey[600],
                            fontWeight: 550
                          }
                        }}
                      >
                        {Object.entries(topRankPreferences).map(([key, value], index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                <Typography component={"p"} variant="subtitle2">
                                  {key}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography component={"p"} variant="subtitle2">
                                  {value.origin?.cache_hit}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography component={"p"} variant="subtitle2">
                                  {value.origin?.cache_miss}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography component={"p"} variant="subtitle2">
                                  {value.origin?.response_time + "ms"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box component={"div"} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <Typography component={"p"} variant="subtitle2">
                                    {value.origin?.resource_utilization + "%"}
                                  </Typography>
                                  {/* <IconButton size="small">
                                    <MoreVertRounded fontSize="small" />
                                  </IconButton> */}
                                </Box>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* Test List */}
        <Box component={"div"} className="list-session-stage"
          sx={{
            paddingX: "1em",
            paddingY: "1em",
            marginBottom: "1.5em",
            backgroundColor: "white",
            borderRadius: "0.3em",
            border: "1px solid " + grey[200]
          }}
        >
          <Box component={"div"}
            sx={{
              marginBottom: "0.5em",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography component={"p"} variant="subtitle2"
              sx={{
                fontWeight: 550,
                color: grey[700]
              }}
            >
              Test Workflow
            </Typography>
            <Typography component={"p"} variant="caption"
              sx={{
                color: "#06816d",
                fontStyle: "italic",
              }}
            >
              {totalTestCompleted.length} of 5 tests completed
            </Typography>
          </Box>
          <Box component={"div"}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box component={"div"}
                  sx={{
                    height: "100%",
                    paddingX: "1em",
                    paddingY: "1em",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    borderRadius: "0.2em",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                    backgroundColor: "white",
                  }}
                >
                  <Box component={"div"}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography component={"p"} variant="subtitle2"
                      sx={{
                        marginBottom: "0.7em",
                        fontWeight: 550,
                        color: "#06816d"
                      }}
                    >
                      No-Cache Test
                    </Typography>
                    <Typography component={"p"} variant="caption">
                      {noCacheCompletedTest?.length + "/2"}
                    </Typography>
                  </Box>
                  <Box
                    component={"img"}
                    width={"100%"}
                    height={"5.5em"}
                    src={"/future-interns-app/caches/No-Cache.drawio.png"}
                    sx={{
                      objectFit: "contain"
                    }}
                  />
                  <Typography component={"p"} variant="body2"
                    sx={{
                      marginTop: "1em",
                      color: grey[700]
                    }}
                  >
                    No-Cache Test is a test scenario where the application retrieves all data directly from the database without using any caching mechanism.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={noCacheCompletedTest.length == 2 && <LaunchRounded fontSize="small" />}
                    fullWidth
                    sx={{
                      marginTop: "1em",
                      color: noCacheCompletedTest.length == 2 ? grey[800] : undefined,
                      backgroundColor: noCacheCompletedTest.length == 2 ? grey[300] : undefined,
                      "&:hover": {
                        backgroundColor: noCacheCompletedTest.length == 2 ? grey[400] : undefined,
                        boxShadow: noCacheCompletedTest.length == 2 ? "none" : undefined,
                      },
                      boxShadow: noCacheCompletedTest.length == 2 ? "none" : undefined,
                    }}
                    onClick={() => {
                      navigate(location.pathname + "/no-cache-test");
                    }}
                  >
                    {noCacheCompletedTest.length == 2 ? "View Test Results" : "Start Test"}
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box component={"div"}
                  sx={{
                    height: "100%",
                    paddingX: "1em",
                    paddingY: "1em",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    borderRadius: "0.2em",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                    backgroundColor: "white",
                  }}
                >
                  <Box component={"div"}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography component={"p"} variant="subtitle2"
                      sx={{
                        marginBottom: "0.7em",
                        fontWeight: 550,
                        color: "#06816d"
                      }}
                    >
                      Write-Through Test
                    </Typography>
                    <Typography component={"div"} variant="caption">
                      {cacheSessionStatus?.write_through === "completed" ? "1" : "0"}/1
                    </Typography>
                  </Box>
                  <Box
                    component={"img"}
                    width={"100%"}
                    height={"5.5em"}
                    src={"/future-interns-app/caches/campus4-internship-app-Write-Through.drawio.png"}
                    sx={{
                      objectFit: "contain"
                    }}
                  />
                  <Typography component={"p"} variant="body2"
                    sx={{
                      marginTop: "1em",
                      color: grey[700]
                    }}
                  >
                    Write-Through Test is a test scenario that follows the write-through caching pattern, where data is written to both the cache and the database simultaneously.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={cacheSessionStatus?.write_through === "completed" && <LaunchRounded fontSize="small" />}
                    fullWidth
                    sx={{
                      marginTop: "1em",
                      color: cacheSessionStatus?.write_through === "completed" ? grey[800] : undefined,
                      backgroundColor: cacheSessionStatus?.write_through === "completed" ? grey[300] : undefined,
                      "&:hover": {
                        backgroundColor: cacheSessionStatus?.write_through === "completed" ? grey[400] : undefined,
                        boxShadow: cacheSessionStatus?.write_through === "completed" ? "none" : undefined,
                      },
                      boxShadow: cacheSessionStatus?.write_through === "completed" ? "none" : undefined,
                    }}
                    onClick={() => {
                      navigate(location.pathname + "/write-through")
                    }}
                  >
                    {cacheSessionStatus?.write_through === "completed" ? "View Test Results" : "Start Test"}
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box component={"div"}
                  sx={{
                    height: "100%",
                    paddingX: "1em",
                    paddingY: "1em",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    borderRadius: "0.2em",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                    backgroundColor: "white",
                  }}
                >
                  <Box component={"div"}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography component={"p"} variant="subtitle2"
                      sx={{
                        marginBottom: "0.7em",
                        fontWeight: 550,
                        color: "#06816d"
                      }}
                    >
                      Write-Behind Test
                    </Typography>
                    <Typography component={"div"} variant="caption">
                      {cacheSessionStatus?.write_behind === "completed" ? "1" : "0"} /1
                    </Typography>
                  </Box>
                  <Box
                    component={"img"}
                    width={"100%"}
                    height={"5.5em"}
                    src={"/future-interns-app/caches/campus4-internship-app-Write-Behind.drawio.png"}
                    sx={{
                      objectFit: "contain"
                    }}
                  />
                  <Typography component={"p"} variant="body2"
                    sx={{
                      marginTop: "1em",
                      color: grey[700]
                    }}
                  >
                    Write-Behind Test is a test scenario that follows the write-behind caching pattern, where data is first written to the cache and then asynchronously propagated to the database.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={cacheSessionStatus?.write_behind === "completed" && <LaunchRounded fontSize="small" />}
                    fullWidth
                    sx={{
                      marginTop: "1em",
                      color: cacheSessionStatus?.write_behind === "completed" ? grey[800] : undefined,
                      backgroundColor: cacheSessionStatus?.write_behind === "completed" ? grey[300] : undefined,
                      "&:hover": {
                        backgroundColor: cacheSessionStatus?.write_behind === "completed" ? grey[400] : undefined,
                        boxShadow: cacheSessionStatus?.write_behind === "completed" ? "none" : undefined,
                      },
                      boxShadow: cacheSessionStatus?.write_behind === "completed" ? "none" : undefined,
                    }}
                    onClick={() => {
                      navigate(location.pathname + "/write-behind")
                    }}
                  >
                    {cacheSessionStatus?.write_behind === "completed" ? "View Test Results" : "Start Test"}
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box component={"div"}
                  sx={{
                    height: "100%",
                    paddingX: "1em",
                    paddingY: "1em",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    borderRadius: "0.2em",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                    backgroundColor: "white",
                  }}
                >
                  <Box component={"div"}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography component={"p"} variant="subtitle2"
                      sx={{
                        marginBottom: "0.7em",
                        fontWeight: 550,
                        color: "#06816d"
                      }}
                    >
                      Cache-Aside Test
                    </Typography>
                    <Typography component={"div"} variant="caption">
                      {(cacheSessionStatus?.cache_aside === "completed" ? "1" : "0") + "/1"}
                    </Typography>
                  </Box>
                  <Box
                    component={"img"}
                    width={"100%"}
                    height={"5.5em"}
                    src={"/future-interns-app/caches/campus4-internship-app-Cache-Aside.drawio.png"}
                    sx={{
                      objectFit: "contain"
                    }}
                  />
                  <Typography component={"p"} variant="body2"
                    sx={{
                      marginTop: "1em",
                      color: grey[700]
                    }}
                  >
                    Cache-Aside Test is a test scenario that follows the cache-aside pattern, where data is loaded into the cache only when requested. If the data is not found in the cache (cache miss), it is fetched from the database and then stored in the cache for future access.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={cacheSessionStatus?.cache_aside === "completed" && <LaunchRounded fontSize="small" />}
                    fullWidth
                    sx={{
                      marginTop: "1em",
                      color: cacheSessionStatus?.cache_aside === "completed" ? grey[800] : undefined,
                      backgroundColor: cacheSessionStatus?.cache_aside === "completed" ? grey[300] : undefined,
                      "&:hover": {
                        backgroundColor: cacheSessionStatus?.cache_aside === "completed" ? grey[400] : undefined,
                        boxShadow: cacheSessionStatus?.cache_aside === "completed" ? "none" : undefined,
                      },
                      boxShadow: cacheSessionStatus?.cache_aside === "completed" ? "none" : undefined,
                    }}
                    onClick={() => navigate(location.pathname + "/cache-aside")}
                  >
                    {cacheSessionStatus?.cache_aside === "completed" ? "View Test Results" : "Start Test"}
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box component={"div"}
                  sx={{
                    height: "100%",
                    paddingX: "1em",
                    paddingY: "1em",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    borderRadius: "0.2em",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                    backgroundColor: "white",
                  }}
                >
                  <Box component={"div"}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography component={"p"} variant="subtitle2"
                      sx={{
                        marginBottom: "0.7em",
                        fontWeight: 550,
                        color: "#06816d"
                      }}
                    >
                      Read-Through Test
                    </Typography>
                    <Typography component={"div"} variant="caption">
                      {(cacheSessionStatus?.read_through === "completed" ? "1" : "0") + "/1"}
                    </Typography>
                  </Box>
                  <Box
                    component={"img"}
                    width={"100%"}
                    height={"5.5em"}
                    src={"/future-interns-app/caches/campus4-internship-app-Read-Through.drawio.png"}
                    sx={{
                      objectFit: "contain"
                    }}
                  />
                  <Typography component={"p"} variant="body2"
                    sx={{
                      marginTop: "1em",
                      color: grey[700]
                    }}
                  >
                    Read-Through Test is a test scenario that follows the read-through caching pattern, where the application retrieves data directly from the cache, and if the data is not available (cache miss), the cache itself fetches the data from the database and stores it.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={cacheSessionStatus?.read_through === "completed" && <LaunchRounded fontSize="small" />}
                    fullWidth
                    sx={{
                      marginTop: "1em",
                      color: cacheSessionStatus?.read_through === "completed" ? grey[800] : undefined,
                      backgroundColor: cacheSessionStatus?.read_through === "completed" ? grey[300] : undefined,
                      "&:hover": {
                        backgroundColor: cacheSessionStatus?.read_through === "completed" ? grey[400] : undefined,
                        boxShadow: cacheSessionStatus?.read_through === "completed" ? "none" : undefined,
                      },
                      boxShadow: cacheSessionStatus?.read_through === "completed" ? "none" : undefined,
                    }}
                    onClick={() => {
                      navigate(location.pathname + "/read-through")
                    }}
                  >
                    {cacheSessionStatus?.read_through === "completed" ? "View Test Results" : "Start Test"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* Alternative & Ranking Table */}
        <Box component={"div"} className="list-session-stage"
          sx={{
            paddingBottom: "5em",
          }}
        >
          <Typography component={"p"} variant="subtitle1"
            sx={{
              marginBottom: "0.5em",
              fontWeight: 550,
              color: grey[700]
            }}
          >
            Cache-Pattern Ranking
          </Typography>
          <Box component={"div"}>
            <Typography component={"p"} variant="subtitle2"
              sx={{
                fontWeight: 550,
                color: "#06816d",
              }}
            >
              Settings
            </Typography>
            <Box component={"div"}
              sx={{
                marginY: "0.5em",
                display: "flex",
                columnGap: "1em",
              }}
            >
              <Box component={"div"} className="criteria"
                sx={{
                  flexBasis: "60%",
                }}
              >
                <TableContainer>
                  <Table size="small"
                    sx={{
                      paddingY: "0.5em",
                      borderCollapse: "unset",
                      border: "1px solid " + grey[300],
                      borderRadius: "0.3em",
                      ".MuiTableCell-root": {
                        border: "none",
                      },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography component={"p"} variant="subtitle2" sx={{ color: grey[600] }}>
                            Criteria
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="subtitle2" sx={{ color: grey[600] }}>
                            Description
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="subtitle2" sx={{ color: grey[600] }}>
                            Attribute
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="subtitle2" sx={{ color: grey[600] }}>
                            Weight
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody
                      sx={{
                        ".MuiTypography-subtitle2": {
                          fontWeight: 550,
                          color: grey[600]
                        }
                      }}
                    >
                      {Object.entries(saw.GetCriteriaRecord()).map(([key, attribute], index) => {
                        const nameOfCriteria = key.split("_").map((str) => `${str.charAt(0).toUpperCase()}${str.substring(1)}`).join(" ");
                        const weight = saw.GetWeightRecord()[key];
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography component={"p"} variant="subtitle2">
                                {`C${index + 1}`}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography component={"p"} variant="subtitle2">
                                {nameOfCriteria}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography component={"p"} variant="subtitle2">
                                {attribute}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography component={"p"} variant="subtitle2">
                                {weight}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box component={"div"} className="weights"
                sx={{
                  flexBasis: "40%",
                  // border: "1px solid black",
                }}
              >
                <Typography component={"p"} variant="subtitle2"
                  sx={{
                    fontWeight: 550,
                    color: grey[600]
                  }}
                >
                  Set Weights
                </Typography>
                <Box component={"div"}
                  sx={{
                    marginTop: "0.7em",
                    display: "flex",
                    flexWrap: "wrap",
                    columnGap: "0.5em",
                    rowGap: "1em",
                    justifyContent: "space-between"
                  }}
                >
                  <TextField
                    name="cache_hit"
                    label="Cache Hit"
                    size="small"
                    autoComplete="off"
                    value={weightsSetting["cache_hit"]}
                    onChange={weightOnChange("cache_hit")}
                    sx={{
                      flexBasis: "48.5%",
                    }}
                  />
                  <TextField
                    name="cache_miss"
                    label="Cache Miss"
                    size="small"
                    autoComplete="off"
                    value={weightsSetting["cache_miss"]}
                    onChange={weightOnChange("cache_miss")}
                    sx={{
                      flexBasis: "48.5%",
                    }}
                  />
                  <TextField
                    name="response_time"
                    label="Response Time"
                    size="small"
                    autoComplete="off"
                    value={weightsSetting["response_time"]}
                    onChange={weightOnChange("response_time")}
                    sx={{
                      flexBasis: "48.5%",
                    }}
                  />
                  <TextField
                    name="resource_utilization"
                    label="Resource Utilization"
                    size="small"
                    autoComplete="off"
                    value={weightsSetting["resource_utilization"]}
                    onChange={weightOnChange("resource_utilization")}
                    sx={{
                      flexBasis: "48.5%",
                    }}
                  />
                </Box>
                <Box component={"div"}
                  sx={{
                    marginTop: "1em",
                    display: "flex",
                    columnGap: "0.5em",
                    justifyContent: "end",
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      minWidth: "6em",
                    }}
                    onClick={ApplyWeights}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* Alternatives Data */}
          <Box component={"div"}>
            <Box component={"div"}
              sx={{
                paddingY: "0.5em",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography component={"p"} variant="subtitle2"
                sx={{
                  marginBottom: "0.5em",
                  paddingY: "0.5em",
                  color: "#06816d",
                  fontWeight: 550,
                }}
              >
                Alternatives
              </Typography>
              <TextField
                name="query"
                size="small"
                placeholder="search by cache-pattern or name"
                autoComplete="off"
                InputProps={{
                  sx: {
                    fontSize: "small",
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded fontSize="small" />
                    </InputAdornment>
                  )
                }}
                sx={{
                  width: "20em"
                }}
                value={searchQuery["alternative"]}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(prev => ({
                    ...prev,
                    ["alternative"]: event.target.value
                  }));
                }}
              />
            </Box>
            <TableContainer>
              <Table size="small"
                sx={{
                  borderCollapse: "unset",
                  border: "1px solid " + grey[300],
                  borderRadius: "0.3em",
                  ".MuiTableCell-root": {
                    border: "none",
                  },
                }}
              >
                <TableHead
                  sx={{
                    ".MuiTableCell-root": {
                      paddingY: "0.8em",
                    },
                  }}
                >
                  <TableRow sx={{
                    ".unit-saw": {
                      fontFamily: "Computer Modern",
                      fontStyle: "italic",
                      fontWeight: 400
                    }
                  }}
                  >
                    <TableCell sx={{ width: "10%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>Alternative</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "10%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Cache Hit <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "10%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Cache Miss <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Response Time <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "17%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Resource Utilization <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "17%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Cache Pattern
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allRequestLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={12}
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        <Typography component={"p"} variant="body2"
                          sx={{
                            padding: "0.5em",
                            border: "1px solid " + amber[400],
                            borderRadius: "0.3em",
                            color: amber[700],
                            backgroundColor: amber[50]
                          }}
                        >
                          Alternative data is empty! please store alternative data first!
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {allRequestLogs.length !== 0 && saw.GetAlternatives().filter((alt, _) => {
                    const byCachePattern = alt.cache_type.includes(searchQuery["alternative"]);
                    const byNumberOfRequest = `A:${(saw.GetAlternatives().findIndex(A => A === alt)) + 1}`.includes(searchQuery["alternative"]);
                    return byCachePattern || byNumberOfRequest;
                  }).slice((pageAltTable * _defaultAltPerPage) - _defaultAltPerPage, pageAltTable * _defaultAltPerPage).map((alt, index) => {
                    const idxCurrentAlt = saw.GetAlternatives().findIndex(A => A === alt);
                    return (
                      <TableRow hover key={index}>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {/* {`A:${((pageAltTable * 10) - 10) + (index + 1)}`} */}
                            {`A:${idxCurrentAlt + 1}`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {alt.cache_hit}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {alt.cache_miss}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {alt.response_time + "ms"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {alt.resource_utilization + "%"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {alt.cache_type}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <Pagination
                size="small"
                count={allRequestLogs.length !== 0 ? Math.ceil(saw.GetAlternatives().filter((alt, index) => {
                  const byCachePattern = alt.cache_type.includes(searchQuery["alternative"]);
                  const byNumberOfRequest = `A:${index}`.includes(searchQuery["alternative"]);
                  return byCachePattern || byNumberOfRequest;
                }).length / _defaultAltPerPage) : 1}
                page={pageAltTable}
                onChange={(_: ChangeEvent<unknown>, page: number) => {
                  setPageAltTable(page)
                }}
                sx={{
                  marginY: "0.5em",
                  justifySelf: "end",
                }}
              />
            </TableContainer>
          </Box>
          {/* Ranking Data */}
          <Box component={"div"}>
            <Box component={"div"}
              sx={{
                paddingY: "0.5em",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography component={"p"} variant="subtitle2"
                sx={{
                  marginBottom: "0.5em",
                  paddingY: "0.5em",
                  color: "#06816d",
                  fontWeight: 550,
                }}
              >
                Final Preference Value
              </Typography>
              <TextField
                name="query"
                size="small"
                placeholder="search by cache-pattern or preference value"
                autoComplete="off"
                InputProps={{
                  sx: {
                    fontSize: "small",
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded fontSize="small" />
                    </InputAdornment>
                  )
                }}
                sx={{
                  width: "20em"
                }}
                value={searchQuery["preference"]}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(prev => ({
                    ...prev,
                    ["preference"]: event.target.value
                  }));
                }}
              />
            </Box>
            <TableContainer>
              <Table size="small"
                sx={{
                  borderCollapse: "unset",
                  border: "1px solid " + grey[300],
                  borderRadius: "0.3em",
                  ".MuiTableCell-root": {
                    border: "none",
                  },
                }}
              >
                <TableHead
                  sx={{
                    ".MuiTableCell-root": {
                      paddingY: "0.8em",
                      border: "none",
                    },
                  }}
                >
                  <TableRow sx={{
                    ".unit-saw": {
                      fontFamily: "Computer Modern",
                      fontStyle: "italic",
                      fontWeight: 400
                    }
                  }}
                  >
                    <TableCell sx={{ width: "5%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>Rank</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "8%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Cache Hit <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "8%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Cache Miss <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "8%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Response Time <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "9%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Resource Utilization <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "8%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Cache Pattern
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "8%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Preference Value <span className="unit-saw">(P)</span>
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rankRequestLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={12}
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        <Typography component={"p"} variant="body2"
                          sx={{
                            padding: "0.5em",
                            border: "1px solid " + amber[400],
                            borderRadius: "0.3em",
                            color: amber[700],
                            backgroundColor: amber[50]
                          }}
                        >
                          Ranking data is empty! please store alternative data first!
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {rankRequestLogs.length !== 0 && rankRequestLogs.map((rank, index) => {
                    let weightedScore = rank.weightedNormalizedDecisionMatrix;
                    return (
                      <TableRow hover key={index}
                        sx={Top3RankStyles(saw.FindRank(rank) + 1)}
                      >
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {saw.FindRank(rank) + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {weightedScore["cache_hit"]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {weightedScore["cache_miss"]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {weightedScore["response_time"]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {weightedScore["resource_utilization"]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {rank.origin?.cache_type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box component={"div"}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                              {rank.finalPreferenceValue}
                            </Typography>
                            <IconButton size="small"
                              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                setSelectedRank(rank);
                                setAnchorEl(event.currentTarget);
                              }}
                            >
                              <MoreVertRounded fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <Pagination
                size="small"
                count={rankRequestLogs.length !== 0 ? Math.ceil(saw.GetRanking().filter((rank) => {
                  const byCachePattern = rank.origin?.cache_type.includes(searchQuery["preference"]);
                  const byPreferenceValue = rank.finalPreferenceValue.toString().includes(searchQuery["preference"]);
                  return byCachePattern || byPreferenceValue;
                }).length / 15) : 1}
                page={pageRankTable}
                onChange={(_: ChangeEvent<unknown>, page: number) => {
                  setPageRankTable(page)
                }}
                sx={{
                  marginY: "0.5em",
                  justifySelf: "end",
                }}
              />
            </TableContainer>
          </Box>
        </Box>
      </Container>
      {/* Menu */}
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        autoFocus={false}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: "12em",
              marginTop: "1em",
              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
              border: "1px solid #d4d4d4",
            },
          },
        }}
      >
        <MenuItem dense
          onClick={() => {
            setAnchorEl(null);
            setOpenDialog(prev => ({ ...prev, ["detail-calculation"]: true }));
          }}
        >
          <ListItemIcon>
            <FunctionsRounded fontSize="small" sx={{ color: "#045a55" }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="subtitle2">Detail Calculation</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
      {/* Detail Calculation */}
      <Dialog
        open={Boolean(openDialog["detail-calculation"])}
        onClose={() => setOpenDialog(prev => ({ ...prev, ["detail-calculation"]: false }))}
        maxWidth={"lg"}
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        {/* Alternative Data */}
        <Box component={"div"} marginBottom={2}>
          <Typography component={"p"} variant="subtitle2" fontWeight={550} color={grey[700]}>
            1. Alternative Data
          </Typography>
          <TableContainer>
            <Table size="small"
              sx={{
                borderCollapse: "unset",
                border: "1px solid " + grey[300],
                borderRadius: "0.3em",
                ".MuiTableCell-root": {
                  border: "none",
                },
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    ".unit-saw": {
                      fontFamily: "Computer Modern",
                      fontWeight: 400
                    }
                  }}
                >
                  <TableCell sx={{ width: "20%" }}>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>Alternative</Typography>
                  </TableCell>
                  <TableCell sx={{ width: "10%" }}>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                      Cache Hit
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "10%" }}>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                      Cache Miss
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                      Response Time <span className="unit-saw">(ms)</span>
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                      Resource Utilization <span className="unit-saw">(%)</span>
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                      Cache Pattern
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                      {/* {`A${referenceDataIndex + 1} at request:${referenceDataIndex + 1}`} */}
                      {selectedRank && `A:${saw.GetAlternatives().findIndex(alt => alt === selectedRank.origin) + 1}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                      {selectedRank?.origin?.cache_hit}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                      {selectedRank?.origin?.cache_miss}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                      {selectedRank?.origin?.response_time + "ms"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                      {selectedRank?.origin?.resource_utilization + "%"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                      {selectedRank?.origin?.cache_type}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {/* Criteria & Weights */}
        <Box component={"div"} marginTop={1} marginBottom={2}>
          <Typography component={"p"} variant="subtitle2" fontWeight={550} color={grey[700]}>
            2. Criteria & Weights
          </Typography>
          <Grid container columnSpacing={3}>
            <Grid item xs={6}>
              <TableContainer>
                <Table size="small"
                  sx={{
                    borderCollapse: "unset",
                    border: "1px solid " + grey[300],
                    borderRadius: "0.3em",
                    ".MuiTableCell-root": {
                      border: "none",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        ".unit-saw": {
                          fontFamily: "Computer Modern",
                          fontWeight: 400
                        }
                      }}
                    >
                      <TableCell sx={{ width: "40%" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                          Name
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: "30%" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                          Attribute
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: "30%" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                          Weight
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(saw.GetCriteriaRecord()).map(([key, value], index) => {
                      const weight = saw.GetWeightRecord()[key];
                      return (
                        <TableRow hover key={index}>
                          <TableCell>
                            <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                              {`C${index + 1}`}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                              {value}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                              {weight}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow
                      sx={{
                        backgroundColor: grey[100]
                      }}
                    >
                      <TableCell colSpan={2}>
                        <Typography component={"p"} variant="body2" textAlign={"end"}
                          sx={{
                            fontWeight: 550,
                            color: grey[600]
                          }}
                        >
                          Total weight:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography component={"p"} variant="body2"
                          sx={{
                            fontWeight: 550,
                            color: grey[600]
                          }}
                        >
                          1
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={6}>
              <Typography component={"p"} variant="body2" sx={{ fontWeight: 550, color: grey[600] }}>
                Information:
              </Typography>
              <Box component={"div"}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {/* Criteria */}
                <Box component={"div"}
                  sx={{
                    padding: "0.5em 0.5em 0.5em 1em",
                  }}
                >
                  <ul>
                    {Object.entries(saw.GetCriteriaRecord()).map(([key, _], index) => {
                      return (
                        <li key={index}
                          style={{ color: grey[600] }}
                        >
                          <Typography component={"p"} variant="caption" sx={{ lineHeight: "1em" }}>
                            {`C${index + 1} = ${key}`}
                          </Typography>
                        </li>
                      )
                    })}
                  </ul>
                  <Typography component={"p"} variant="caption"
                    sx={{
                      marginTop: "1em",
                      lineHeight: "1em",
                      color: grey[600],
                    }}
                  >
                    The criterion weights are given in the following form:
                  </Typography>
                  <Box component={"div"}
                    sx={{
                      fontSize: "0.8em",
                    }}
                  >
                    <BlockMath math="W = (w_1, w_2, w_3, \dots, w_n)" />
                  </Box>
                </Box>
                {/* Normalization Formula */}
                <Box component={"div"}
                  sx={{
                    padding: "0.5em",
                  }}
                >
                  <Typography component={"p"} variant="caption"
                    sx={{ fontWeight: 550, color: grey[600] }}
                  >
                    Benefit Attribute Formula:
                  </Typography>

                  <Box component={"div"}
                    sx={{
                      width: "max-content",
                      fontSize: "0.8em",
                    }}
                  >
                    <BlockMath math="r_{ij} = \frac{x_{ij}}{\max x_{ij}}" />
                  </Box>
                  <Typography component={"p"} variant="caption"
                    sx={{ fontWeight: 550, color: grey[600] }}
                  >
                    Cost Attribute Formula:
                  </Typography>
                  <Box component={"div"}
                    sx={{
                      width: "max-content",
                      fontSize: "0.8em",
                    }}
                  >
                    <BlockMath math="r_{ij} = \frac{\min x_{ij}}{x_{ij}}" />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* Normalization */}
        <Box component={"div"} marginTop={1} marginBottom={2}>
          <Typography component={"p"} variant="subtitle2" fontWeight={550} color={grey[700]}>
            3. Normalization
          </Typography>
          <Box component={"div"} marginBottom={2}>
            <Typography component={"p"} variant="body2" marginTop={0.5} marginBottom={1}>
              3.1 Ideal Values
            </Typography>
            <TableContainer>
              <Table size="small"
                sx={{
                  borderCollapse: "unset",
                  border: "1px solid " + grey[300],
                  borderRadius: "0.3em",
                  ".MuiTableCell-root": {
                    border: "none",
                  },
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      ".unit-saw": {
                        fontFamily: "Computer Modern",
                        fontWeight: 400
                      }
                    }}
                  >
                    <TableCell sx={{ width: "40%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Name
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Value
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "40%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Reference
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(saw.GetCriteriaRecord()).map(([key, _], index) => {
                    const normCriteria = saw.GetIdealValuesRecord()[key];
                    const referenceAltIndex = saw.GetAlternatives().findIndex(alt => alt[key as keyof LogType] === normCriteria);
                    return (
                      <TableRow hover key={index}>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {`${key} (C${index + 1})`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {normCriteria + (key === "response_time" ? "ms" : key === "resource_utilization" ? "%" : "")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {`A:${referenceAltIndex + 1}`}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box component={"div"}>
            <Typography component={"p"} variant="body2" marginTop={0.5} marginBottom={1}>
              3.2 Alternative Normalization
            </Typography>
            <TableContainer>
              <Table size="small"
                sx={{
                  borderCollapse: "unset",
                  border: "1px solid " + grey[300],
                  borderRadius: "0.3em",
                  ".MuiTableCell-root": {
                    border: "none",
                  },
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      ".unit-saw": {
                        fontFamily: "Computer Modern",
                        fontStyle: "italic",
                        fontWeight: 400
                      }
                    }}
                  >
                    <TableCell sx={{ width: "30%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>Alternative</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "15%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Cache Hit <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "15%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Cache Miss <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Response Time <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Resource Utilization <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                        {/* {`A${referenceDataIndex + 1} at request:${referenceDataIndex + 1}`} */}
                        {selectedRank && `A:${saw.GetAlternatives().findIndex(alt => alt === selectedRank.origin) + 1}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                        {selectedRank?.normalized["cache_hit"]}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                        {selectedRank?.normalized["cache_miss"]}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                        {selectedRank?.normalized["response_time"]}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                        {selectedRank?.normalized["resource_utilization"]}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        {/* Preference */}
        <Box component={"div"} marginTop={1} marginBottom={2}>
          <Typography component={"p"} variant="subtitle2" fontWeight={550} color={grey[700]} marginBottom={0.5}>
            3. Preference
          </Typography>
          <Grid container columnSpacing={2}>
            <Grid item xs={6}>
              <Typography component={"p"} variant="body2" paddingLeft={2}>
                The Preference Value (V) in the Simple Additive Weighting (SAW) method is calculated using the formula:
              </Typography>
              <Box component={"div"}>
                <BlockMath math="V_i = \sum_{j=1}^{n} (w_j \cdot r_{ij})" />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography component={"p"} variant="body2" sx={{ marginBottom: 0.5, fontWeight: 550, color: grey[600] }}>
                Information:
              </Typography>
              <Box component={"div"}>
                <ul>
                  <li>
                    <InlineMath math="V_i" /> = <Typography component={"span"} variant="body2">The preference value of the <InlineMath math="i" />-th alternative</Typography>
                  </li>
                  <li>
                    <InlineMath math="w_j" /> = <Typography component={"span"} variant="body2">The weight of the <InlineMath math="j" />-th criterion</Typography>
                  </li>
                  <li>
                    <InlineMath math="r_{ij}" /> = <Typography component={"span"} variant="body2">The normalization value of the <InlineMath math="i" />-th alternative on the <InlineMath math="j" />-th criterion</Typography>
                  </li>
                  <li>
                    <InlineMath math="n" /> = <Typography component={"span"} variant="body2">Total number of criteria</Typography>
                  </li>
                </ul>
              </Box>
            </Grid>
          </Grid>
          <TableContainer>
            <Table size="small"
              sx={{
                borderCollapse: "unset",
                border: "1px solid " + grey[300],
                borderRadius: "0.3em",
                ".MuiTableCell-root": {
                  border: "none",
                },
                ".unit-saw": {
                  fontFamily: "Computer Modern",
                  fontStyle: "italic",
                  fontWeight: 400
                }
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "30%" }}>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>Alternative</Typography>
                  </TableCell>
                  <TableCell sx={{ width: "15%" }}>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                      Cache Hit <span className="unit-saw">(P)</span>
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "15%" }}>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                      Cache Miss <span className="unit-saw">(P)</span>
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                      Response Time <span className="unit-saw">(P)</span>
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                      Resource Utilization <span className="unit-saw">(P)</span>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                      {/* {`A${referenceDataIndex + 1} at request:${referenceDataIndex + 1}`} */}
                      {selectedRank && `A:${saw.GetAlternatives().findIndex(alt => alt === selectedRank.origin) + 1}`}
                    </Typography>
                  </TableCell>
                  {selectedRank &&
                    selectedRank.weightedNormalizedDecisionMatrix &&
                    Object.entries(selectedRank.weightedNormalizedDecisionMatrix).map(([_, value], index) => {
                      return (
                        <TableCell key={index}>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                            {value}
                          </Typography>
                        </TableCell>
                      )
                    })}
                </TableRow>
                <TableRow
                  sx={{
                    backgroundColor: grey[100]
                  }}
                >
                  <TableCell>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                      Preference <span className="unit-saw">(P)</span>
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={4}>
                    <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>
                      {selectedRank?.finalPreferenceValue}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Dialog>
    </PerformanceTestLayout>
  )
}