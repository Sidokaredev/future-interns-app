import { Box, Button, CircularProgress, Container, Dialog, Grid, IconButton, Pagination, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import PerformanceTestLayout from "../../../../../components/Templates/PerformanceTestLayout";
import { amber, green, grey, } from "@mui/material/colors";
import { DoneRounded, KeyboardArrowLeftRounded, KeyboardArrowRightRounded, KeyboardBackspaceRounded, PlayCircleRounded } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip as ChartTooltip, ChartData, TooltipItem } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { LogType, RawVacancies, SamplingQuery } from "../types";
import { GetSession, onCloseSnackbar } from "../../../../global-helpers";
import dayjs from "dayjs";
import RequestAPI from "../../../../../services/api/request";
import { HOST } from "../constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Legend,
  ChartTooltip,
)

export default function CacheAsideTestPage() {
  /* react-router */
  const navigate = useNavigate();
  const location = useLocation();
  const { id: sessionID } = useParams();

  /* ref */
  const logsRef = useRef<HTMLDivElement | null>(null);

  /* state */
  const [cacheAsideLogs, setCacheAsideLogs] = useState<{
    chart: {
      cache_status: ChartData<"bar", { x: number; y: string }[], unknown>;
      resource_utils: ChartData<"line", number[], string>;
    };
    logs: LogType[];
  }>({
    chart: {
      cache_status: {
        datasets: []
      },
      resource_utils: {
        datasets: [
          { data: [] },
          { data: [] },
        ]
      }
    },
    logs: []
  });
  const [pageTableLogs, setPageTableLogs] = useState<number>(1);

  const [displayLogs, setDisplayLogs] = useState<boolean>(false);
  const [logs, setLogs] = useState<string>("");
  const [requestStats, setRequestStats] = useState<{ awaiting: number; success: number; fail: number; }>({
    awaiting: 0,
    success: 0,
    fail: 0
  });
  const [dots, setDots] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ show: boolean; message: string; }>({ show: false, message: "" });
  const [refetch, setRefetch] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  const [chunkNumber, setChunkNumber] = useState<number>(1);

  /* constants */
  const token = GetSession("auth");
  const paginatedCacheAsideLogs = cacheAsideLogs.logs.slice((pageTableLogs * 10) - 10, pageTableLogs * 10);
  const chunkedLabels = cacheAsideLogs.chart.resource_utils.labels?.slice((chunkNumber * 10) - 10, chunkNumber * 10);
  const chunkedRespTime = cacheAsideLogs.chart.resource_utils.datasets[0].data.slice((chunkNumber * 10) - 10, chunkNumber * 10);
  const chunkedResUtil = cacheAsideLogs.chart.resource_utils.datasets[1].data.slice((chunkNumber * 10) - 10, chunkNumber * 10);

  /**
   * 1. Generate 120 random sampling query
   * 2. Creating 500 data vacancies per sampling (60000 data)
   * 2. Execute 50 requests, read 500 data per request - .slice(0, 50)
   * 3. Execute 1000 requests, read 500 data per request using 25 random sampling query at the previous step (execute 4 times)
   * 4. Execute 50 requests, read 500 data per request with new 50 sampling query - .slice(50, 100)
   * 5. Execute 50 requests, read 500 data per request with random 30 sampling query in range .slice(0, 100) and read 500 data per request with new sampling query .slice(100, 120)
   * @returns void
   */
  const RunCacheAsideScenario = async () => {
    setLoading(true);
    setDisplayLogs(true);
    setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tBegin read testing` +
      "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tGenerating sampling queries`); // Logs

    const TOTAL_REQUEST = 250;
    setRequestStats(prev => ({ ...prev, awaiting: TOTAL_REQUEST }));

    const basicHeaders = new Headers({
      "Authorization": "Bearer " + token
    });
    const logHeaders = new Headers({
      "Authorization": "Bearer " + token,
      "X-Measure-Cache-Request-Logs": "cache-aside",
      "X-Cache-Session": sessionID as string,
    });

    const [dataSampling, failSampling] = await RequestAPI.Send<SamplingQuery[]>(
      "/api/v1/administrators/test/generates/sampling?count=120",
      { method: "GET", headers: basicHeaders }
    );
    if (failSampling) {
      console.log("generate sampling: \t", failSampling);
      return setAlert({ show: true, message: `generate sampling: ${failSampling.message}` })
    };
    if (dataSampling) {
      setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tPreparing required data`);
      for (let idx = 0; idx < dataSampling.length; idx++) {
        const [rawVacancies, failRaw] = await RequestAPI.JSONRequest({
          sampling: dataSampling,
          offset: idx + 1,
          total_raw_vacancies: 500
        }).Send<RawVacancies[]>(
          "/api/v1/administrators/test/generates/vacancies",
          { method: "POST", headers: basicHeaders }
        );
        if (failRaw) {
          console.log("raw vacancies \t:", failRaw);
          return setAlert({ show: true, message: failRaw.message });
        };
        if (rawVacancies) {
          const [successStore, failStore] = await RequestAPI.JSONRequest(rawVacancies).Send<string[]>(
            "/api/v1/administrators/test/generates/vacancies/store",
            { method: "POST", headers: basicHeaders }
          );
          if (failStore) {
            console.log("store vacancies \t:", failStore);
            return setAlert({ show: true, message: `at offset ${idx}: ${failStore.message}` })
          };
          if (successStore) {
            setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\t${successStore.length} data stored at sampling offset ${idx}`);
          }
        }
      }
      setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tData is ready!` +
        "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 50 different queries`);
      /**
       * Read using 50 different queries
       */
      const firstSampling = dataSampling.slice(0, 50)
      for (let idx = 0; idx < firstSampling.length; idx++) {
        const request = new Request(
          `${HOST.cache_aside}/api/v1/cache-aside/vacancies?lineIndustry=${firstSampling[idx].line_industry}&employeeType=${firstSampling[idx].employee_type}&workArrangement=${firstSampling[idx].work_arrangement}`,
          { method: "GET", headers: logHeaders },
        );

        try {
          const response = await fetch(request);
          if (response.status === 200) {
            setRequestStats(prev => ({
              ...prev,
              awaiting: prev.awaiting - 1,
              success: prev.success + 1,
            }));
            setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tread request #${idx} send successfully ✅`);

            continue;
          }

          console.log(`response status:\t${response.status}`);
          setRequestStats(prev => ({
            ...prev,
            awaiting: prev.awaiting - 1,
            fail: prev.fail + 1,
          }));
          setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tresponse status: \t${response.status} ❌`);

          continue;
        } catch (err) {
          if (err instanceof Error) {
            console.log(`error:\t${err}`);
            setRequestStats(prev => ({
              ...prev,
              awaiting: prev.awaiting - 1,
              fail: prev.fail + 1,
            }));
            setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`);

            continue;
          };

          console.log(`unknown:\t${err}`);
          setRequestStats(prev => ({
            ...prev,
            awaiting: prev.awaiting - 1,
            fail: prev.fail + 1,
          }));
          setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`);

          continue;
        }
      }
      setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 50 different queries completed` +
        "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 25 different queries from the first sampling (x4)`);
      /**
       * Read using 25 random different queries from the first
       */
      const FisherYatesShuffleAlgorithm = (src: SamplingQuery[], take: number): SamplingQuery[] => {
        const shuffled = [...src];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elemen
        }

        return shuffled.slice(0, take);
      }
      const secondSampling = FisherYatesShuffleAlgorithm(firstSampling, 25);
      for (let idxTimes = 0; idxTimes < 4; idxTimes++) {
        for (let idx = 0; idx < secondSampling.length; idx++) {
          const request = new Request(
            `${HOST.cache_aside}/api/v1/cache-aside/vacancies?lineIndustry=${secondSampling[idx].line_industry}&employeeType=${secondSampling[idx].employee_type}&workArrangement=${secondSampling[idx].work_arrangement}`,
            { method: "GET", headers: logHeaders },
          );

          try {
            const response = await fetch(request);
            if (response.status === 200) {
              setRequestStats(prev => ({
                ...prev,
                awaiting: prev.awaiting - 1,
                success: prev.success + 1,
              }));
              setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tread request #${idx} send successfully ✅`);

              continue;
            }

            console.log(`response status:\t${response.status}`);
            setRequestStats(prev => ({
              ...prev,
              awaiting: prev.awaiting - 1,
              fail: prev.fail + 1,
            }));
            setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tresponse status: \t${response.status} ❌`);

            continue;
          } catch (err) {
            if (err instanceof Error) {
              console.log(`error:\t${err}`);
              setRequestStats(prev => ({
                ...prev,
                awaiting: prev.awaiting - 1,
                fail: prev.fail + 1,
              }));
              setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`);

              continue;
            };

            console.log(`unknown:\t${err}`);
            setRequestStats(prev => ({
              ...prev,
              awaiting: prev.awaiting - 1,
              fail: prev.fail + 1,
            }));
            setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`);

            continue;
          }
        }
        setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tread request x${idxTimes} times completed`);
      }
      setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 25 different queries from the first sampling executed 4 times` +
        "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 50 different queries from the third sampling`);
      /**
       * Read using 50 new different queries 
       */
      const thirdSampling = dataSampling.slice(50, 100);
      for (let idx = 0; idx < thirdSampling.length; idx++) {
        const request = new Request(
          `${HOST.cache_aside}/api/v1/cache-aside/vacancies?lineIndustry=${thirdSampling[idx].line_industry}&employeeType=${thirdSampling[idx].employee_type}&workArrangement=${thirdSampling[idx].work_arrangement}`,
          { method: "GET", headers: logHeaders },
        );

        try {
          const response = await fetch(request);
          if (response.status === 200) {
            setRequestStats(prev => ({
              ...prev,
              awaiting: prev.awaiting - 1,
              success: prev.success + 1,
            }));
            setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tread request #${idx} send successfully ✅`);

            continue;
          }

          console.log(`response status:\t${response.status}`);
          setRequestStats(prev => ({
            ...prev,
            awaiting: prev.awaiting - 1,
            fail: prev.fail + 1,
          }));
          setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tresponse status: \t${response.status} ❌`);

          continue;
        } catch (err) {
          if (err instanceof Error) {
            console.log(`error:\t${err}`);
            setRequestStats(prev => ({
              ...prev,
              awaiting: prev.awaiting - 1,
              fail: prev.fail + 1,
            }));
            setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`);

            continue;
          };

          console.log(`unknown:\t${err}`);
          setRequestStats(prev => ({
            ...prev,
            awaiting: prev.awaiting - 1,
            fail: prev.fail + 1,
          }));
          setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`);

          continue;
        }
      }
      setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 50 different queries from the third sampling completed` +
        "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 50 different queries from 30 random sampling first, third sampling and 20 sampling never used before`);
      /**
       * Read 50 different queries, 30 random from combined first and third sampling, 20 new sampling
       */
      const randomUsedSampling = FisherYatesShuffleAlgorithm([...firstSampling, ...thirdSampling], 30);
      const fourthSampling = dataSampling.slice(100, 120).concat(randomUsedSampling);
      for (let idx = 0; idx < fourthSampling.length; idx++) {
        const request = new Request(
          `${HOST.cache_aside}/api/v1/cache-aside/vacancies?lineIndustry=${fourthSampling[idx].line_industry}&employeeType=${fourthSampling[idx].employee_type}&workArrangement=${fourthSampling[idx].work_arrangement}`,
          { method: "GET", headers: logHeaders },
        );

        try {
          const response = await fetch(request);
          if (response.status === 200) {
            setRequestStats(prev => ({
              ...prev,
              awaiting: prev.awaiting - 1,
              success: prev.success + 1,
            }));
            setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tread request #${idx} send successfully ✅`);

            continue;
          }

          console.log(`response status:\t${response.status}`);
          setRequestStats(prev => ({
            ...prev,
            awaiting: prev.awaiting - 1,
            fail: prev.fail + 1,
          }));
          setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tresponse status: \t${response.status} ❌`);

          continue;
        } catch (err) {
          if (err instanceof Error) {
            console.log(`error:\t${err}`);
            setRequestStats(prev => ({
              ...prev,
              awaiting: prev.awaiting - 1,
              fail: prev.fail + 1,
            }));
            setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`);

            continue;
          };

          console.log(`unknown:\t${err}`);
          setRequestStats(prev => ({
            ...prev,
            awaiting: prev.awaiting - 1,
            fail: prev.fail + 1,
          }));
          setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`);

          continue;
        }
      }
      setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 50 different queries from 30 random sampling first, third sampling and 20 sampling never used before completed` +
        "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tClearing generated data`);
      const [successClearing, failClearing] = await RequestAPI.Send<number>(
        "/api/v1/administrators/test/generates/vacancies?count=" + (dataSampling.length * 500),
        { method: "DELETE", headers: basicHeaders }
      );
      if (failClearing) {
        console.log("clearing \t:", failClearing);
        setAlert({ show: false, message: failClearing.message });
      };
      if (successClearing) {
        setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tGenerated data cleared successfully`);
      }
      setLoading(false);
      setRefetch(prev => !prev);
    }
  };

  /* side-effect */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, []);
  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    };
  }, [logs]);
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 5 ? prev + "." : "."));
    }, 1000);

    if (!loading) {
      return clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [loading]);
  useEffect(() => {
    (async () => {
      const [data, fail] = await RequestAPI.Send<{
        chart: {
          cache_status: ChartData<"bar", { x: number; y: string }[], unknown>;
          resource_utils: ChartData<"line", number[], string>;
        };
        logs: LogType[];
      }>(
        "/api/v1/administrators/test/" + sessionID + "/logs?pattern=cache-aside",
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );
      if (fail) {
        console.log("fail request logs: ", fail);
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setCacheAsideLogs(data);
      };
    })();
  }, [refetch]);
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
          marginTop: "-10em",
          paddingBottom: "5em"
        }}
      >
        <Box component={"div"}>
          {/* Title */}
          <Box component={"div"}
            sx={{
              marginBottom: "0.5em",
              display: "flex",
              columnGap: 1,
              alignItems: "start"
            }}
          >
            <IconButton size="small"
              onClick={() => {
                let back = location.pathname.split("/")
                back.splice(-1, 1);
                navigate(back.join("/"));
              }}
            >
              <KeyboardBackspaceRounded sx={{ color: "#9bcdc5" }} />
            </IconButton>
            <Typography component={"p"} variant="h6"
              sx={{
                color: "#c2fffb",
              }}
            >
              Cache Aside Test
            </Typography>
          </Box>
          {/* Chart Container */}
          <Grid container spacing={2}
            sx={{
              marginBottom: "1em",
            }}
          >
            <Grid item xs={6}>
              <Box component={"div"}
                sx={{
                  width: "100%",
                  height: "100%",
                  padding: "0.5em",
                  borderRadius: "0.1em",
                  boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                  backgroundColor: "white",
                }}
              >
                <Bar
                  data={cacheAsideLogs.chart.cache_status}
                  options={{
                    responsive: true,
                    indexAxis: "y",
                    scales: {
                      y: {
                        ticks: {
                          color: grey[700],
                          minRotation: 10,
                          font: {
                            size: 11
                          }
                        }
                      }
                    },
                    plugins: {
                      legend: { display: false, },
                      title: {
                        display: true, text: "Cache Hit & Cache Miss (200 Requests)", padding: {
                          top: 10,
                          bottom: 20
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: (tooltipItems: TooltipItem<"bar">) => {
                            return `${tooltipItems.formattedValue} requests`
                          }
                        }
                      }
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box component={"div"}
                sx={{
                  width: "100%",
                  height: "100%",
                  padding: "0.5em",
                  borderRadius: "0.1em",
                  boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                  backgroundColor: "white",
                }}
              >
                <Box component={"div"}
                  sx={{
                    marginY: "0.6em",
                    paddingX: "0.5em",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography component={"p"} variant="caption"
                    sx={{
                      fontWeight: 550,
                      color: grey[700]
                    }}
                  >
                    Response Time & Resourse Utilization (%)
                  </Typography>
                  <Box component={"div"}
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Tooltip title="Previous Logs" placement="bottom-end">
                      <IconButton size="small"
                        disabled={chunkNumber === 1}
                        onClick={() => {
                          setChunkNumber(prev => prev - 1);
                        }}
                      >
                        <KeyboardArrowLeftRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Next Logs" placement="bottom-end">
                      <IconButton size="small"
                        disabled={chunkNumber === (Math.ceil(cacheAsideLogs.chart.resource_utils.datasets[0]?.data.length / 10))}
                        onClick={() => {
                          setChunkNumber(prev => prev + 1);
                        }}
                      >
                        <KeyboardArrowRightRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Line
                  data={{
                    ...cacheAsideLogs.chart.resource_utils,
                    labels: chunkedLabels,
                    datasets: [
                      {
                        ...cacheAsideLogs.chart.resource_utils.datasets[0],
                        data: chunkedRespTime,
                        backgroundColor: green[200],
                        borderColor: green[400]
                      },
                      {
                        ...cacheAsideLogs.chart.resource_utils.datasets[1],
                        data: chunkedResUtil,
                        backgroundColor: amber[200],
                        borderColor: amber[400],
                      },
                    ]
                  }}
                  options={{
                    scales: {
                      x: {
                        ticks: {
                          font: {
                            size: 11
                          }
                        }
                      },
                      y: {
                        type: "linear",
                        display: true,
                        position: "left",
                        title: {
                          display: true,
                          text: "Response Time (ms)"
                        }
                      },
                      y1: {
                        type: "linear",
                        display: true,
                        position: "right",
                        title: {
                          display: true,
                          text: "Resource Utilization (%)"
                        },
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (tooltipItems: TooltipItem<"line">) => {
                            let unit: string
                            if (tooltipItems.dataset.label === "Response Time") {
                              unit = "ms"
                            } else {
                              unit = "%"
                            }
                            return `${tooltipItems.dataset.label}: ${tooltipItems.raw + unit}`
                          }
                        }
                      }
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          {/* Read Test Terminal */}
          <Box component={"div"} className="write-test"
            sx={{
              marginBottom: "1em"
            }}
          >
            <Typography component={"p"} variant="body1"
              sx={{
                color: grey[700],
              }}
            >
              This test will execute 250 requests to the cache-aside service. Below are the details of the request phases:
            </Typography>
            <ol style={{ color: grey[700], lineHeight: "1.5em", marginLeft: "1em", marginTop: "0.5em" }}>
              <li>
                <Typography component={"p"} variant="body1">
                  Execute 50 requests to read job vacancy data using 50 different queries per request, reading 500 records per request.
                </Typography>
              </li>
              <li>
                <Typography component={"p"} variant="body1">
                  Execute 100 requests using 25 queries from the first phase, repeated 4 times, reading 500 records per request.
                </Typography>
              </li>
              <li>
                <Typography component={"p"} variant="body1">
                  Execute 50 requests to read job vacancy data using 50 new, unique queries that have not been executed before, reading 500 records per request.
                </Typography>
              </li>
              <li>
                <Typography component={"p"} variant="body1">
                  Execute 50 requests with a combination of reading job vacancy data, using 60% previously executed queries and 40% new queries (60:40), reading 500 records per request.
                </Typography>
              </li>
            </ol>
            {/* Terminal */}
            <Box component={"div"}
              ref={logsRef}
              sx={{
                maxHeight: "20em",
                padding: "0.5em",
                overflowY: "scroll",
                marginY: "1em",
                border: "1px solid " + grey[300],
                borderRadius: "0.3em",
                backgroundColor: "black",
                color: "white",
                "&::-webkit-scrollbar": {
                  width: "8px", // Ukuran scrollbar
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: grey[400], // Warna scrollbar
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: grey[200], // Warna background scrollbar
                },
              }}
            >
              {displayLogs && (
                <Typography component={"p"} variant="caption" fontFamily={"monospace"} sx={{ whiteSpace: "pre-line" }}>
                  {logs + " " + dots + "\n"}
                  -----------------------------------------------------------------
                  {`\n Testing progress -> ⏳Pending: ${requestStats.awaiting} | ✅Success: ${requestStats.success} | ❌Failed: ${requestStats.fail}`}
                </Typography>
              )}
            </Box>
            <Box component={"div"}>
              <Button
                startIcon={
                  loading ? <CircularProgress size={20} /> :
                    cacheAsideLogs.logs.length == 250 ? <DoneRounded fontSize="small" /> :
                      <PlayCircleRounded fontSize="small" />
                }
                disabled={loading || cacheAsideLogs.logs.length == 250}
                variant="contained"
                onClick={() => {
                  setOpenDialog(prev => ({ ...prev, ["confirmation"]: true }));
                }}
              >
                {cacheAsideLogs.logs.length == 250 ? "Completed" : "Run Read Test"}
              </Button>
            </Box>
          </Box>
          {/* Table Results */}
          <Box component={"div"}>
            {/* Logs */}
            <Box component={"div"}>
              <Typography component={"p"} variant="subtitle1"
                sx={{
                  marginBottom: "0.5em",
                  paddingY: "0.5em",
                  color: "#06816d",
                  fontWeight: 550,
                  textAlign: "center",
                  borderBottom: "1px solid " + grey[300]
                }}
              >
                Read Test Results
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "10%" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>No. Request</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Cache Hit</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Cache Miss</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "20%" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Response Time (ms)</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "18%" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Memory Usage (MB)</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "15%" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>CPU Usage (%)</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "17%" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Resource Utilization (%)</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cacheAsideLogs.logs.length < 5 && (
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
                            Request logs for the read test are empty. Please run the test first.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {paginatedCacheAsideLogs.map((log_, index) => (
                      <TableRow hover key={index}>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                            Request:{(pageTableLogs * 10) - 10 + (index + 1)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                            {log_.cache_hit}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                            {log_.cache_miss}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                            {log_.response_time + "ms"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                            {log_.memory_usage + "MB"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                            {log_.cpu_usage + "%"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                            {log_.resource_utilization + "%"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  size="small"
                  count={Math.ceil(cacheAsideLogs.logs.length / 10)}
                  page={pageTableLogs}
                  onChange={(_: ChangeEvent<unknown>, page: number) => {
                    setPageTableLogs(page)
                  }}
                  sx={{
                    marginY: "0.5em",
                    justifySelf: "end",
                  }}
                />
              </TableContainer>
            </Box>
          </Box>
        </Box>
      </Container>
      {/* Confirmation Test Dialog */}
      <Dialog
        open={Boolean(openDialog["confirmation"])}
        maxWidth={"xs"}
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        <Typography component={"p"} variant="subtitle2"
          sx={{
            marginBottom: "0.5em",
            fontWeight: 550,
            color: grey[700]
          }}
        >
          Confirm Cache-Aside Test Execution
        </Typography>
        <Typography component={"p"} variant="body2"
          sx={{
            color: grey[600],
            whiteSpace: "pre-line"
          }}
        >
          This test will execute 250 requests to the cache-aside service, performing multiple read and write operations on job vacancy data. The process involves writing, reading, updating, and a combination of both. Given the large data volume, the test may take some time to complete.

          Do you want to proceed?
        </Typography>
        <Box component={"div"}
          sx={{
            marginTop: "1.5em",
            display: 'flex',
            columnGap: 1,
            justifyContent: "end",
          }}
        >
          <Button
            variant="text"
            size="small"
            color="error"
            onClick={() => {
              setOpenDialog(prev => ({ ...prev, ["confirmation"]: false }));
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              // RunReadTest();
              RunCacheAsideScenario();
              setOpenDialog(prev => ({ ...prev, ["confirmation"]: false }));
            }}
          >
            Continue
          </Button>
        </Box>
      </Dialog>
    </PerformanceTestLayout >
  )
}