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
  no_cache: number;
  cache_aside: number;
  read_through: number;
  write_through: number;
  write_behind: number;
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
    // "no-cache-write": false,
    "no-cache": false,
    "cache-aside": false,
    "read-through": false,
    "write-through": false,
    "write-behind": false,
  });
  const [datasetRadar, setDatasetRadar] = useState<Record<string, number[]>>({
    // "no-cache-write": [],
    "no-cache": [],
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
  const totalTestCompleted = cacheSessionStatus ? Object.entries(cacheSessionStatus).filter(([key, value]) => {
    if (key === "detail") return false;
    if (value == 100) {
      return `${key}:completed`
    }
  }) : [];
  const noCacheLogs = allRequestLogs.filter(log_ => log_.cache_type === "no-cache");
  // const noCacheReadLogs = allRequestLogs.filter(log_ => log_.cache_type === "no-cache-read");
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

  const isLogRequestCacheExist = allRequestLogs.filter(log_ => log_.cache_type !== "no-cache").length > 0;

  if (isLogRequestCacheExist) {
    // saw.StoreAlternatives(allRequestLogs.filter(log_ => log_.cache_type !== "no-cache")); // without no-cache
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
          case "no-cache":
            alternatives.push(...noCacheLogs);
            break;
          // case "no-cache-read":
          //   alternatives.push(...noCacheReadLogs);
          //   break;
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
      // "no-cache-write": [],
      "no-cache": [],
      "cache-aside": [],
      "read-through": [],
      "write-through": [],
      "write-behind": [],
    });
    setDatasetRadarOption({
      // "no-cache-write": false,
      "no-cache": false,
      "cache-aside": false,
      "read-through": false,
      "write-through": false,
      "write-behind": false,
    });
  };

  useEffect(() => {
    (async () => {
      const [data, fail] = await RequestAPI.Send<CacheSessionInfoType>(
        "/administrators/test/" + sessionID + "/status",
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
        "/administrators/test/" + sessionID + "/logs/all",
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
          paddingBottom: "5em",
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
                          label: "No Cache",
                          data: [...datasetRadar["no-cache"]],
                          backgroundColor: "rgba(189, 189, 189, 0.2)",
                          borderColor: "rgba(189, 189, 189, 1)",
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
                          text: "Perbandingan Nilai Preferensi Strategi Cache",
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
                    {/* No Cache */}
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
                          backgroundColor: grey[400],
                          borderRadius: "0.2em",
                        }}
                      />
                      <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[600] }}>No Cache</Typography>
                    </Box>
                    {/* Cache Aside */}
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
                    {/* Read Through */}
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
                    {/* Write Through */}
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
                    {/* Write Behind */}
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
                    Pilih dataset untuk ditampilkan pada grafik
                  </Typography>
                  <Box component={"div"}>
                    <FormGroup>
                      <FormControlLabel control={
                        <Checkbox size="small"
                          checked={datasetRadarOption["no-cache"]}
                          onChange={CheckboxOnChange("no-cache")}
                          sx={{ paddingY: "0.3em" }} />
                      } label={
                        <Typography component={"p"} variant="body2"
                          sx={{ color: grey[600] }}
                        >
                          No Cache
                        </Typography>
                      }
                        disabled={noCacheLogs.length === 0} />
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
                        Terapkan
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
                    Kriteria dan Bobot
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
                              Kriteria
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component={"p"} variant="subtitle2">
                              Deskripsi
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component={"p"} variant="subtitle2">
                              Bobot
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography component={"p"} variant="subtitle2">
                              Atribut
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
                    Nilai Tertinggi
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
                              Jenis Cache
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
              Jenis Pengujian
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
                      {cacheSessionStatus?.no_cache == 100 ? "1" : "0"}/1
                    </Typography>
                  </Box>
                  <Box
                    component={"img"}
                    width={"100%"}
                    height={"5.5em"}
                    src={"/caches/No-Cache.drawio.png"}
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
                    Pengujian No-Cache merupakan skenario di mana aplikasi mengambil seluruh data langsung dari database, tanpa memanfaatkan mekanisme caching.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={cacheSessionStatus?.no_cache == 100 && <LaunchRounded fontSize="small" />}
                    fullWidth
                    sx={{
                      marginTop: "1em",
                      color: cacheSessionStatus?.no_cache == 100 ? grey[800] : undefined,
                      backgroundColor: cacheSessionStatus?.no_cache == 100 ? grey[300] : undefined,
                      "&:hover": {
                        backgroundColor: cacheSessionStatus?.no_cache == 100 ? grey[400] : undefined,
                        boxShadow: cacheSessionStatus?.no_cache == 100 ? "none" : undefined,
                      },
                      boxShadow: cacheSessionStatus?.no_cache == 100 ? "none" : undefined,
                    }}
                    onClick={() => {
                      navigate(location.pathname + "/no-cache-test");
                    }}
                  >
                    {cacheSessionStatus?.no_cache == 100 ? "Lihat Hasil Pengujian" : "Mulai Test"}
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
                      {cacheSessionStatus?.write_through === 100 ? "1" : "0"}/1
                    </Typography>
                  </Box>
                  <Box
                    component={"img"}
                    width={"100%"}
                    height={"5.5em"}
                    src={"/caches/campus4-internship-app-Write-Through.drawio.png"}
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
                    Pengujian Write-Through merupakan skenario yang menerapkan pola caching write-through, di mana setiap penulisan data dilakukan secara simultan ke cache dan database.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={cacheSessionStatus?.write_through === 100 && <LaunchRounded fontSize="small" />}
                    fullWidth
                    sx={{
                      marginTop: "1em",
                      color: cacheSessionStatus?.write_through === 100 ? grey[800] : undefined,
                      backgroundColor: cacheSessionStatus?.write_through === 100 ? grey[300] : undefined,
                      "&:hover": {
                        backgroundColor: cacheSessionStatus?.write_through === 100 ? grey[400] : undefined,
                        boxShadow: cacheSessionStatus?.write_through === 100 ? "none" : undefined,
                      },
                      boxShadow: cacheSessionStatus?.write_through === 100 ? "none" : undefined,
                    }}
                    onClick={() => {
                      navigate(location.pathname + "/write-through")
                    }}
                  >
                    {cacheSessionStatus?.write_through === 100 ? "Lihat Hasil Pengujian" : "Mulai Test"}
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
                      {cacheSessionStatus?.write_behind === 100 ? "1" : "0"} /1
                    </Typography>
                  </Box>
                  <Box
                    component={"img"}
                    width={"100%"}
                    height={"5.5em"}
                    src={"/caches/campus4-internship-app-Write-Behind.drawio.png"}
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
                    Pengujian Write-Behind merupakan skenario yang menerapkan pola caching write-behind, di mana penulisan data dilakukan terlebih dahulu ke cache, lalu diteruskan secara asinkron ke database.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={cacheSessionStatus?.write_behind === 100 && <LaunchRounded fontSize="small" />}
                    fullWidth
                    sx={{
                      marginTop: "1em",
                      color: cacheSessionStatus?.write_behind === 100 ? grey[800] : undefined,
                      backgroundColor: cacheSessionStatus?.write_behind === 100 ? grey[300] : undefined,
                      "&:hover": {
                        backgroundColor: cacheSessionStatus?.write_behind === 100 ? grey[400] : undefined,
                        boxShadow: cacheSessionStatus?.write_behind === 100 ? "none" : undefined,
                      },
                      boxShadow: cacheSessionStatus?.write_behind === 100 ? "none" : undefined,
                    }}
                    onClick={() => {
                      navigate(location.pathname + "/write-behind")
                    }}
                  >
                    {cacheSessionStatus?.write_behind === 100 ? "Lihat Hasil Pengujian" : "Mulai Test"}
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
                      {(cacheSessionStatus?.cache_aside === 100 ? "1" : "0") + "/1"}
                    </Typography>
                  </Box>
                  <Box
                    component={"img"}
                    width={"100%"}
                    height={"5.5em"}
                    src={"/caches/campus4-internship-app-Cache-Aside.drawio.png"}
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
                    Pengujian Cache-Aside adalah skenario di mana data dimuat ke cache saat diminta. Jika terjadi cache miss, data diambil dari database dan disimpan di cache untuk penggunaan berikutnya.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={cacheSessionStatus?.cache_aside === 100 && <LaunchRounded fontSize="small" />}
                    fullWidth
                    sx={{
                      marginTop: "1em",
                      color: cacheSessionStatus?.cache_aside === 100 ? grey[800] : undefined,
                      backgroundColor: cacheSessionStatus?.cache_aside === 100 ? grey[300] : undefined,
                      "&:hover": {
                        backgroundColor: cacheSessionStatus?.cache_aside === 100 ? grey[400] : undefined,
                        boxShadow: cacheSessionStatus?.cache_aside === 100 ? "none" : undefined,
                      },
                      boxShadow: cacheSessionStatus?.cache_aside === 100 ? "none" : undefined,
                    }}
                    onClick={() => navigate(location.pathname + "/cache-aside")}
                  >
                    {cacheSessionStatus?.cache_aside === 100 ? "Lihat Hasil Pengujian" : "Mulai Test"}
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
                      {(cacheSessionStatus?.read_through === 100 ? "1" : "0") + "/1"}
                    </Typography>
                  </Box>
                  <Box
                    component={"img"}
                    width={"100%"}
                    height={"6em"}
                    src={"/caches/campus4-internship-app-Read-Through.drawio.png"}
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
                    Pengujian Read-Through merupakan skenario yang menerapkan pola caching read-through, di mana aplikasi mengakses data dari cache secara langsung, dan apabila terjadi cache miss, cache akan mengambil data dari database kemudian menyimpannya.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={cacheSessionStatus?.read_through === 100 && <LaunchRounded fontSize="small" />}
                    fullWidth
                    sx={{
                      marginTop: "1em",
                      color: cacheSessionStatus?.read_through === 100 ? grey[800] : undefined,
                      backgroundColor: cacheSessionStatus?.read_through === 100 ? grey[300] : undefined,
                      "&:hover": {
                        backgroundColor: cacheSessionStatus?.read_through === 100 ? grey[400] : undefined,
                        boxShadow: cacheSessionStatus?.read_through === 100 ? "none" : undefined,
                      },
                      boxShadow: cacheSessionStatus?.read_through === 100 ? "none" : undefined,
                    }}
                    onClick={() => {
                      navigate(location.pathname + "/read-through")
                    }}
                  >
                    {cacheSessionStatus?.read_through === 100 ? "Lihat Hasil Pengujian" : "Mulai Test"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* Alternative & Ranking Table */}
        <Box component={"div"} className="list-session-stage"
          sx={{
            paddingTop: "1em",
            paddingX: "1em",
            paddingBottom: "1em",
            backgroundColor: "white",
            borderRadius: "0.5em"
          }}
        >
          <Typography component={"p"} variant="subtitle1"
            sx={{
              marginBottom: "0.5em",
              fontWeight: 550,
              color: grey[700]
            }}
          >
            Pemeringkatan Strategi Cache
          </Typography>
          <Box component={"div"}>
            <Typography component={"p"} variant="subtitle2"
              sx={{
                fontWeight: 550,
                color: "#06816d",
              }}
            >
              Pengaturan
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
                        <TableCell
                          sx={{
                            borderBottom: "1px solid " + grey[300] + "!important",
                          }}
                        >
                          <Typography component={"p"} variant="subtitle2" sx={{ color: grey[600] }}>
                            Kriteria
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "1px solid " + grey[300] + "!important",
                          }}
                        >
                          <Typography component={"p"} variant="subtitle2" sx={{ color: grey[600] }}>
                            Deskripsi
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "1px solid " + grey[300] + "!important",
                          }}
                        >
                          <Typography component={"p"} variant="subtitle2" sx={{ color: grey[600] }}>
                            Atribut
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "1px solid " + grey[300] + "!important",
                          }}
                        >
                          <Typography component={"p"} variant="subtitle2" sx={{ color: grey[600] }}>
                            Bobot
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
                  Atur Bobot Kriteria
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
                Data Alternatif
              </Typography>
              <TextField
                name="query"
                size="small"
                placeholder="cari berdasarkan alternatif atau cache"
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
                    <TableCell sx={{ width: "10%", borderBottom: "1px solid " + grey[300] + "!important" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>Alternatif</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "10%", borderBottom: "1px solid " + grey[300] + "!important" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Cache Hit <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "10%", borderBottom: "1px solid " + grey[300] + "!important" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Cache Miss <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "20%", borderBottom: "1px solid " + grey[300] + "!important" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Response Time <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "17%", borderBottom: "1px solid " + grey[300] + "!important" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Resource Utilization <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "17%", borderBottom: "1px solid " + grey[300] + "!important" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Strategi Cache
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isLogRequestCacheExist && (
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
                          Data alternatif masih kosong! Silakan lakukan pengujian terlebih dahulu untuk mengumpulkan data alternatif.
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
                Nilai Preferensi Final
              </Typography>
              <TextField
                name="query"
                size="small"
                placeholder="cari berdasarkan preferensi atau cache"
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
                    <TableCell sx={{ width: "5%", borderBottom: "1px solid " + grey[300] + "!important" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>Rank</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "8%", borderBottom: "1px solid " + grey[300] + "!important" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Cache Hit <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "8%", borderBottom: "1px solid " + grey[300] + "!important" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Cache Miss <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "8%", borderBottom: "1px solid " + grey[300] + "!important" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Response Time <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "9%", borderBottom: "1px solid " + grey[300] + "!important" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Resource Utilization <span className="unit-saw">(R)</span>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "8%", borderBottom: "1px solid " + grey[300] + "!important" }}>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        Cache Pattern
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "8%", borderBottom: "1px solid " + grey[300] + "!important" }}>
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
                          Data pemeringkatan masih kosong! Silakan lakukan pengujian terlebih dahulu untuk mengumpulkan data alternatif.
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