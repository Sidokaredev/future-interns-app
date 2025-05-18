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
import { generate } from "random-words";

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
  const paginatedCacheAsideLogs = cacheAsideLogs.logs.slice((pageTableLogs * 15) - 15, pageTableLogs * 15);
  const chunkedLabels = cacheAsideLogs.chart.resource_utils.labels?.slice((chunkNumber * 15) - 15, chunkNumber * 15);
  const chunkedRespTime = cacheAsideLogs.chart.resource_utils.datasets[0].data.slice((chunkNumber * 15) - 15, chunkNumber * 15);
  const chunkedResUtil = cacheAsideLogs.chart.resource_utils.datasets[1].data.slice((chunkNumber * 15) - 15, chunkNumber * 15);

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

    const TOTAL_REQUEST = 100;
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
      "/api/v1/administrators/test/generates/sampling?count=30",
      { method: "GET", headers: basicHeaders }
    );
    if (failSampling) {
      console.log("generate sampling: \t", failSampling);
      return setAlert({ show: true, message: `generate sampling: ${failSampling.message}` })
    };
    if (dataSampling) {
      setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tSampling queries is ready!` +
        "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tWriting new data`);
      /**
       * Writing new data
       */
      const firstSampling = dataSampling.slice(0, 20);
      const writtenID: Map<string, string[]> = new Map();
      for (let idx = 0; idx < firstSampling.length; idx++) {
        const [dataRaw, failRaw] = await RequestAPI.JSONRequest({
          sampling: firstSampling,
          offset: idx + 1,
          total_raw_vacancies: 500
        }).Send<RawVacancies[]>(
          "/api/v1/administrators/test/generates/vacancies",
          { method: "POST", headers: basicHeaders }
        );
        if (failRaw) {
          console.log("raw vacancies: ", failRaw);
          setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\traw vacancies: \t${failRaw.message} ❌`);
          return setAlert({ show: true, message: `raw vacancies: fail at index:${idx} - ${failRaw.message}` })
        };
        if (dataRaw) {
          const reqBody = JSON.stringify(dataRaw);
          const request = new Request(
            HOST.cache_aside + "/api/v1/cache-aside/vacancies",
            { method: "POST", headers: logHeaders, body: reqBody },
          );
          try {
            const response = await fetch(request);
            if (response.status === 201) {
              const responseJSON: { data: string[]; success: boolean; } = await response.json();
              setRequestStats(prev => ({
                ...prev,
                awaiting: prev.awaiting - 1,
                success: prev.success + 1,
              }));
              setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\twrite request #${idx} send successfully ✅`);
              writtenID.set(`request:${idx}`, responseJSON.data); // collect written new data ID

              continue;
            };

            const responseJSON: { success: boolean; error: string; message: string; } = await response.json();
            console.log(`fail response:\t${responseJSON}`);
            setRequestStats(prev => ({
              ...prev,
              awaiting: prev.awaiting - 1,
              fail: prev.fail + 1,
            }));
            setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tfail response: \t${responseJSON.message} ❌`,);

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
          };
        }
      }
      setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tWriting new data completed` +
        "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tReading new written data`);
      /**
       * Read new written data
       */
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
      setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tReading new written data completed` +
        "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tUpdating new written data`);
      /**
       * Update new written data
       */
      const iterator = writtenID.entries();
      for (let idx = 0; idx < writtenID.size; idx++) {
        const entry = iterator.next();
        if (entry.done) {
          break;
        }
        const [keyMap, valueMap] = entry.value;

        const reqBody: Record<string, number | string>[] = [];
        valueMap.forEach(ID => {
          reqBody.push({
            "id": ID,
            "description": generate({ exactly: 15, join: "" }),
            "qualification": `
                    - ${generate({ exactly: 10, join: "" })} \n
                    - ${generate({ exactly: 13, join: " " })} \n
                    - ${generate({ exactly: 17, join: " " })} \n
                  `,
            "responsibility": `
                    * ${generate({ exactly: 20, join: " " })} \n
                    * ${generate({ exactly: 11, join: " " })} \n
                    * ${generate({ exactly: 29, join: " " })} \n
                  `,
          })
        });

        const request = new Request(
          HOST.cache_aside + "/api/v1/cache-aside/vacancies",
          { method: "PATCH", headers: logHeaders, body: JSON.stringify(reqBody) }
        );

        try {
          const response = await fetch(request);
          if (response.status === 200) {
            setRequestStats(prev => ({
              ...prev,
              awaiting: prev.awaiting - 1,
              success: prev.success + 1,
            }));
            setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tupdate written data at #${keyMap} successfully ✅`);

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
      setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tUpdating new written data completed` +
        "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tReading updated new written data`);
      /**
       * Read updated new written data
       */
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
      setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tReading updated new written data completed` +
        "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tExecuting combination write and read data`);
      /**
       * Combination write and read data
       */
      const combinationSampling = dataSampling.slice(20, 30);
      for (let idx = 0; idx < combinationSampling.length; idx++) {
        const [rawVacancies, fail] = await RequestAPI.JSONRequest({
          sampling: combinationSampling,
          offset: idx + 1,
          total_raw_vacancies: 500
        }).Send<RawVacancies[]>(
          "/api/v1/administrators/test/generates/vacancies",
          { method: "POST", headers: basicHeaders }
        );
        if (fail) {
          console.log(`raw vacancies:\t${fail}`);
          setRequestStats(prev => ({
            ...prev,
            awaiting: prev.awaiting - 1,
            fail: prev.fail + 1,
          }));
          setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\traw vacancies: \t${fail.message} ❌`);

          continue;
        };
        if (rawVacancies) {
          const reqBody = JSON.stringify(rawVacancies);
          const request = new Request(
            HOST.cache_aside + "/api/v1/cache-aside/vacancies",
            { method: "POST", headers: logHeaders, body: reqBody },
          );
          try {
            const response = await fetch(request);
            if (response.status === 201) {
              setRequestStats(prev => ({
                ...prev,
                awaiting: prev.awaiting - 1,
                success: prev.success + 1,
              }));
              setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tcombination: write request #${idx} send successfully ✅`);

              const requestRead = new Request(
                `${HOST.cache_aside}/api/v1/cache-aside/vacancies?lineIndustry=${combinationSampling[idx].line_industry}&employeeType=${combinationSampling[idx].employee_type}&workArrangement=${combinationSampling[idx].work_arrangement}`,
                { method: "GET", headers: logHeaders },
              );
              try {
                const response = await fetch(requestRead);
                if (response.status === 200) {
                  setRequestStats(prev => ({
                    ...prev,
                    awaiting: prev.awaiting - 1,
                    success: prev.success + 1,
                  }));
                  setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tcombination: read request #${idx} send successfully ✅`);

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
          } catch (err) {
            if (err instanceof Error) {
              console.log(`error:\t${err}`);
              setRequestStats(prev => ({
                ...prev,
                awaiting: prev.awaiting - 1,
                fail: prev.fail + 2,
              }));
              setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`);

              continue;
            };

            console.log(`unknown:\t${err}`);
            setRequestStats(prev => ({
              ...prev,
              awaiting: prev.awaiting - 1,
              fail: prev.fail + 2,
            }));
            setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`);

            continue;
          }
        }
      }
      setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tCache-Aside test completed` + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tClearing testing data`);
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
              Pengujian Cache Aside
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
            <Typography component={"p"} variant="subtitle1" fontWeight={550}
              sx={{
                marginBottom: "0.5em",
                color: grey[800]
              }}
            >
              Deskripsi Pengujian
            </Typography>
            <Typography component={"p"} variant="body1"
              sx={{
                color: grey[700],
              }}
            >
              Tes ini akan menjalankan 100 permintaan ke layanan cache-aside. Berikut rincian fase permintaan:
            </Typography>
            <ol style={{ color: grey[700], lineHeight: "1.5em", marginLeft: "1em", marginTop: "0.5em" }}>
              <li>
                <Typography component={"p"} variant="body1">
                  Mengeksekusi 20 permintaan untuk menulis data lowongan kerja baru, menulis 500 record per permintaan (total: 10.000 record).
                </Typography>
              </li>
              <li>
                <Typography component={"p"} variant="body1">
                  Mengeksekusi 20 permintaan untuk membaca data lowongan kerja yang ditulis pada fase pertama, membaca 500 record per permintaan.
                </Typography>
              </li>
              <li>
                <Typography component={"p"} variant="body1">
                  Mengeksekusi 20 permintaan untuk memperbarui data lowongan kerja yang ditulis pada fase pertama, memperbarui 500 record per permintaan.
                </Typography>
              </li>
              <li>
                <Typography component={"p"} variant="body1">
                  Mengeksekusi 20 permintaan untuk membaca data lowongan kerja yang diperbarui pada fase ketiga, membaca 500 record per permintaan.
                </Typography>
              </li>
              <li>
                <Typography component={"p"} variant="body1">
                  Mengeksekusi 20 permintaan dengan kombinasi membaca dan menulis data lowongan kerja dengan rasio 50:50. Menulis 500 record per permintaan (total: 5.000 record) dan membaca 500 record per permintaan.
                </Typography>
              </li>
            </ol>
            {/* Terminal */}
            <Typography component={"p"} variant="subtitle1" fontWeight={550}
              sx={{
                marginTop: "1em",
                color: grey[800]
              }}
            >
              Monitoring <span style={{ fontStyle: "italic" }}>Logs</span> Pengujian
            </Typography>
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
                    cacheAsideLogs.logs.length == 100 ? <DoneRounded fontSize="small" /> :
                      <PlayCircleRounded fontSize="small" />
                }
                disabled={loading || cacheAsideLogs.logs.length == 100}
                variant="contained"
                onClick={() => {
                  setOpenDialog(prev => ({ ...prev, ["confirmation"]: true }));
                }}
              >
                {cacheAsideLogs.logs.length == 100 ? "Selesai" : "Jalankan Pengujian"}
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
                  textAlign: "start",
                  // borderBottom: "1px solid " + grey[300]
                }}
              >
                Hasil Pengujian Cache Aside
              </Typography>
              <TableContainer>
                <Table size="small"
                  sx={{
                    borderCollapse: "unset",
                    border: "1px solid " + grey[400],
                    borderRadius: "0.3em",
                    ".MuiTableCell-root": {
                      border: "none",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "10%", borderBottom: "1px solid " + grey[400] + "!important" }}>
                        <Typography component={"p"} variant="body2" sx={{ paddingY: "0.3em", color: grey[600], fontWeight: 550 }}>No. Request</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "10%", borderBottom: "1px solid " + grey[400] + "!important" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Cache Hit</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "10%", borderBottom: "1px solid " + grey[400] + "!important" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Cache Miss</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "20%", borderBottom: "1px solid " + grey[400] + "!important" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Response Time (ms)</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "18%", borderBottom: "1px solid " + grey[400] + "!important" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Memory Usage (MB)</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "15%", borderBottom: "1px solid " + grey[400] + "!important" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>CPU Usage (%)</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "17%", borderBottom: "1px solid " + grey[400] + "!important" }}>
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
                            Log permintaan untuk pengujian masih kosong. Silakan jalankan pengujian terlebih dahulu.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {paginatedCacheAsideLogs.map((log_, index) => (
                      <TableRow hover key={index}>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                            Request:{(pageTableLogs * 15) - 15 + (index + 1)}
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
                  count={Math.ceil(cacheAsideLogs.logs.length / 15)}
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
          Konfirmasi Pengujian
        </Typography>
        <Typography component={"p"} variant="body2"
          sx={{
            color: grey[600],
            whiteSpace: "pre-line"
          }}
        >
          Pengujian ini akan menjalankan 100 permintaan ke layanan cache-aside, yang mencakup berbagai operasi baca dan tulis pada data lowongan pekerjaan.

          Apakah Anda ingin melanjutkan?
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
            Batal
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
            Lanjutkan
          </Button>
        </Box>
      </Dialog>
    </PerformanceTestLayout >
  )
}