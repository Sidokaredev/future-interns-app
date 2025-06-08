import { Box, Button, CircularProgress, Container, Dialog, Grid, IconButton, Pagination, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import PerformanceTestLayout from "../../../../../components/Templates/PerformanceTestLayout";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Legend, Tooltip as ChartTooltip, BarElement, TooltipItem, ChartData } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { amber, blue, green, grey } from "@mui/material/colors";
import { DoneRounded, KeyboardArrowLeftRounded, KeyboardArrowRightRounded, KeyboardBackspaceRounded, PlayCircleRounded } from "@mui/icons-material";
import JsonView from "@uiw/react-json-view";
import { nordTheme } from "@uiw/react-json-view/nord"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { GetSession, onCloseSnackbar } from "../../../../global-helpers";
import RequestAPI from "../../../../../services/api/request";
import dayjs from "dayjs";
import { LogType, RawVacancies, SamplingQuery } from "../types";
import { generate } from "random-words";
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

export type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
};


export default function NoCacheTest() {
  /* react-router */
  const navigate = useNavigate();
  const location = useLocation();
  const { id: sessionID } = useParams();

  /* state */
  const [noCacheLogs, setNoCacheLogs] = useState<{
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
  // const [writeLogs, setWriteLogs] = useState<{ chart: ChartDataType, logs: LogType[] }>({ chart: { labels: [], datasets: [] }, logs: [] });
  // const [pageWriteLogs, setPageWriteLogs] = useState<number>(1);
  // const [readLogs, setReadLogs] = useState<{ chart: ChartDataType, logs: LogType[] }>({ chart: { labels: [], datasets: [] }, logs: [] });
  // const [pageReadLogs, setPageReadLogs] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  const [vacanciesRaw, setVacanciesRaw] = useState<RawVacancies[]>([]);
  const [requestStats, setRequestStats] = useState<{ awaiting: number; fail: number; success: number; }>({
    awaiting: 0,
    success: 0,
    fail: 0
  });
  const [logs, setLogs] = useState<string>("");
  const [displayLogs, setDisplayLogs] = useState<boolean>(false);
  const [dots, setDots] = useState<string>("");
  const [chunkNumber, setChunkNumber] = useState<number>(1);

  const [alert, setAlert] = useState<{ show: boolean; message: string; }>({ show: false, message: "" });
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [refetch, setRefetch] = useState<boolean>(false);

  /* ref */
  const logsRef = useRef<HTMLDivElement | null>(null);

  /* constants */
  const token = GetSession("auth");
  const paginatedNoCacheLogs = noCacheLogs.logs.slice((pageTableLogs * 15) - 15, pageTableLogs * 15);
  const chunkedLabels = noCacheLogs.chart.resource_utils.labels?.slice((chunkNumber * 10) - 10, chunkNumber * 10);
  const chunkedRespTime = noCacheLogs.chart.resource_utils.datasets[0].data.slice((chunkNumber * 10) - 10, chunkNumber * 10);
  const chunkedResUtil = noCacheLogs.chart.resource_utils.datasets[1].data.slice((chunkNumber * 10) - 10, chunkNumber * 10);

  /* GetSampleJSON */
  const GetSampleJSON = async () => {
    setLoading(prev => ({ ...prev, ["sample-request"]: true }));

    const [sampling, failSampling] = await RequestAPI.Send<SamplingQuery[]>(
      "/administrators/test/generates/sampling?count=10",
      { method: "GET", headers: { "Authorization": "Bearer " + token } }
    );
    if (failSampling) {
      console.log("sampling \t:", failSampling);
      setLoading(prev => ({ ...prev, ["sample-request"]: false }));
      return setAlert({ show: true, message: failSampling.message });
    };
    if (sampling) {
      const reqBody = JSON.stringify({
        sampling: sampling,
        offset: 1,
        total_raw_vacancies: 500
      });
      const [data, fail] = await RequestAPI.Send<RawVacancies[]>(
        "/administrators/test/generates/vacancies",
        { method: "POST", headers: { "Authorization": "Bearer " + token }, body: reqBody, }
      );
      if (fail) {
        setLoading(prev => ({ ...prev, ["sample-request"]: false }));
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        setLoading(prev => ({ ...prev, ["sample-request"]: false }));
        setOpenDialog(prev => ({ ...prev, ["sample-request"]: false }));
        return setVacanciesRaw(data);
      }
    }
  };

  /**
   * 1. Generate 120 random sampling query
   * 2. Creating 500 data vacancies per sampling (60000 data)
   * 2. Execute 50 requests, read 500 data per request - .slice(0, 50)
   * 3. Execute 1000 requests, read 500 data per request using 25 random sampling query at the previous step (execute 4 times)
   * 4. Execute 50 requests, read 500 data per request with new 50 sampling query - .slice(50, 100)
   * 5. Execute 50 requests, read 500 data per request with random 30 sampling query in range .slice(0, 100) and read 500 data per request with new sampling query .slice(100, 120)
   * @returns void
   */
  const RunTestScenario = async () => {
    setLoading(prev => ({ ...prev, ["test"]: true }));
    setDisplayLogs(true);
    setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tBegin No-Cache testing` +
      "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tGenerating sampling search queries`); // Logs

    const TOTAL_REQUEST = 100;
    setRequestStats(prev => ({ ...prev, awaiting: TOTAL_REQUEST }));

    const basicHeaders = new Headers({
      "Authorization": "Bearer " + token
    });
    const logHeaders = new Headers({
      "Authorization": "Bearer " + token,
      "X-Measure-Cache-Request-Logs": "no-cache",
      "X-Cache-Session": sessionID as string,
    });

    const [dataSampling, failSampling] = await RequestAPI.Send<SamplingQuery[]>(
      "/administrators/test/generates/sampling?count=30",
      { method: "GET", headers: basicHeaders }
    );
    if (failSampling) {
      console.log("generate sampling: \t", failSampling);
      return setAlert({ show: true, message: `generate sampling: ${failSampling.message}` })
    };
    if (dataSampling) {
      setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tSampling search queries is ready!` +
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
          "/administrators/test/generates/vacancies",
          { method: "POST", headers: basicHeaders }
        );
        if (failRaw) {
          console.log("raw vacancies: ", failRaw);
          setLoading(prev => ({ ...prev, ["test"]: false }));
          setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\traw vacancies: \t${failRaw.message} ❌`);
          return setAlert({ show: true, message: `raw vacancies: fail at index:${idx} - ${failRaw.message}` })
        };
        if (dataRaw) {
          const reqBody = JSON.stringify(dataRaw);
          const request = new Request(
            HOST.no_cache + "/vacancies",
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
          `${HOST.no_cache}/vacancies?lineIndustry=${firstSampling[idx].line_industry}&employeeType=${firstSampling[idx].employee_type}&workArrangement=${firstSampling[idx].work_arrangement}`,
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
          HOST.no_cache + "/vacancies",
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
          `${HOST.no_cache}/vacancies?lineIndustry=${firstSampling[idx].line_industry}&employeeType=${firstSampling[idx].employee_type}&workArrangement=${firstSampling[idx].work_arrangement}`,
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
          "/administrators/test/generates/vacancies",
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
            HOST.no_cache + "/vacancies",
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
                `${HOST.no_cache}/vacancies?lineIndustry=${combinationSampling[idx].line_industry}&employeeType=${combinationSampling[idx].employee_type}&workArrangement=${combinationSampling[idx].work_arrangement}`,
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
      setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tNo-Cache test completed` + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tClearing testing data`);
      const [successClearing, failClearing] = await RequestAPI.Send<number>(
        "/administrators/test/generates/vacancies?count=" + (dataSampling.length * 500),
        { method: "DELETE", headers: basicHeaders }
      );
      if (failClearing) {
        console.log("clearing \t:", failClearing);
        setAlert({ show: false, message: failClearing.message });
      };
      if (successClearing) {
        setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tGenerated data cleared successfully`);
      }
      setLoading(prev => ({ ...prev, ["test"]: false }));
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
    // if (readLogsRef.current) {
    //   readLogsRef.current.scrollTop = readLogsRef.current.scrollHeight;
    // };
  }, [logs]);
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 5 ? prev + "." : "."));
    }, 1000);

    if (!loading["test"]) {
      return clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [loading["test"]]);
  /* logs fetching */
  useEffect(() => {
    (async () => {
      const HEADERS = new Headers({
        "Authorization": "Bearer " + token,
      });
      const [data, fail] = await RequestAPI.Send<{
        chart: {
          cache_status: ChartData<"bar", { x: number; y: string }[], unknown>;
          resource_utils: ChartData<"line", number[], string>;
        };
        logs: LogType[];
      }>(
        "/administrators/test/" + sessionID + "/logs?pattern=no-cache",
        {
          method: "GET",
          headers: HEADERS,
        }
      );
      if (fail) {
        console.info("fail write logs request \t:", fail);
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setNoCacheLogs(data);
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
              Pengujian Tanpa Cache
            </Typography>
          </Box>
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
                {/* <Bar
                  data={writeLogs.chart as ChartData<"bar", number[], string>}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "Write Request with No-Cache",
                        color: grey[600],
                        font: {
                          size: 14,
                        }
                      },
                      tooltip: {
                        callbacks: {
                          title: (tooltipItems: TooltipItem<"bar">[]) => {
                            return `Response time: ${tooltipItems[0].label}`;
                          },
                          label: (tooltipItem: TooltipItem<"bar">) => {
                            return `Resource utilization ${tooltipItem.dataset.label} : ${tooltipItem.raw} requests`;
                          }
                        }
                      }
                    }
                  }}
                /> */}
                <Bar
                  data={{
                    ...noCacheLogs.chart.cache_status,
                    datasets: [
                      {
                        ...noCacheLogs.chart.cache_status.datasets[0],
                        minBarLength: 10,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    indexAxis: "y",
                    scales: {
                      y: {
                        beginAtZero: true,
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
                {/* <Bar
                  data={readLogs.chart as ChartData<"bar", number[], string>}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "Read Request with No-Cache",
                        color: grey[600],
                        font: {
                          size: 14,
                        }
                      },
                      tooltip: {
                        callbacks: {
                          title: (tooltipItems: TooltipItem<"bar">[]) => {
                            return `Response time: ${tooltipItems[0].label}`;
                          },
                          label: (tooltipItem: TooltipItem<"bar">) => {
                            return `Resource utilization ${tooltipItem.dataset.label} : ${tooltipItem.raw} requests`;
                          }
                        }
                      }
                    }
                  }}
                /> */}
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
                        disabled={chunkNumber === (Math.ceil(noCacheLogs.chart.resource_utils.datasets[0]?.data.length / 10)) || noCacheLogs.logs.length == 0}
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
                    ...noCacheLogs.chart.resource_utils,
                    labels: chunkedLabels,
                    datasets: [
                      {
                        ...noCacheLogs.chart.resource_utils.datasets[0],
                        data: chunkedRespTime,
                        backgroundColor: green[200],
                        borderColor: green[400]
                      },
                      {
                        ...noCacheLogs.chart.resource_utils.datasets[1],
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
          {/* WRITE TEST */}
          <Box component={"div"} className="write-test"
            sx={{
              marginBottom: "1em",
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
            <Typography component={"p"} variant="body1"
              sx={{
                marginY: "0.5em",
                color: grey[700]
              }}
            >
              Klik
              <Typography component={"span"} variant="inherit"
                sx={{
                  color: blue[500],
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => setOpenDialog(prev => ({ ...prev, ["sample-request"]: true }))}
              >
                {" "}Contoh Data JSON
              </Typography>
              . untuk melihat pratinjau data yang digunakan dalam setiap permintaan.
            </Typography>
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
                overflowY: "scroll",
                marginY: "1em",
                border: "1px solid " + grey[300],
                borderRadius: "0.3em",
                padding: "0.5em",
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
              {vacanciesRaw.length !== 0 && (
                <JsonView value={vacanciesRaw} style={nordTheme} collapsed />
              )}
              {displayLogs && (
                <Typography component={"p"} variant="caption" fontFamily={"monospace"} sx={{ whiteSpace: "pre-line" }}>
                  {logs + " " + dots + "\n"}
                  -----------------------------------------------------------------
                  {`\n Progres Pengujian -> ⏳Menunggu: ${requestStats.awaiting} | ✅Berhasil: ${requestStats.success} | ❌Gagal: ${requestStats.fail}`}
                </Typography>
              )}
            </Box>
            <Box component={"div"}
              sx={{
                marginBottom: "1em",
              }}
            >
              <Button
                startIcon={loading["test"] ? <CircularProgress size={20} /> :
                  noCacheLogs.logs.length == 100 ? <DoneRounded fontSize="small" /> :
                    <PlayCircleRounded fontSize="small" />
                }
                variant="contained"
                disabled={loading["test"] || noCacheLogs.logs.length == 100}
                onClick={() => {
                  setVacanciesRaw([]);
                  setOpenDialog(prev => ({ ...prev, ["confirm-write-test"]: true }))
                }}
              >
                {noCacheLogs.logs.length == 100 ? "Selesai" : "Jalankan Pengujian"}
              </Button>
            </Box>
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
                Hasil Pengujian Tanpa Cache
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
                      <TableCell sx={{ width: "16.5%", borderBottom: "1px solid " + grey[400] + "!important" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Response Time (ms)</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "16.5%", borderBottom: "1px solid " + grey[400] + "!important" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Memory Usage (MB)</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "16.5%", borderBottom: "1px solid " + grey[400] + "!important" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>CPU Usage (%)</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "20%", borderBottom: "1px solid " + grey[400] + "!important" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Resource Utilization (%)</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {noCacheLogs.logs.length < 5 && (
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
                    {paginatedNoCacheLogs.map((log_, index) => (
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
                  count={Math.ceil(noCacheLogs.logs.length / 15)}
                  page={pageTableLogs}
                  onChange={(_: ChangeEvent<unknown>, page: number) => {
                    setPageTableLogs(page);
                  }}
                  sx={{
                    marginY: "0.5em",
                    justifySelf: "end",
                  }}
                />
              </TableContainer>
            </Box>
          </Box>
          {/* READ TEST */}
          {/* <Box component={"div"} className="write-test">
            <Typography component={"p"} variant="subtitle1"
              sx={{
                fontWeight: 550,
                color: grey[700],
              }}
            >
              Read Test
            </Typography>
            <Typography component={"p"} variant="body1"
              sx={{
                color: grey[700],
              }}
            >
              This test will execute 250 requests to the no-cache service. Below are the details of the request phases:
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
            <Box component={"div"}
              ref={readLogsRef}
              sx={{
                maxHeight: "20em",
                overflowY: "scroll",
                marginY: "1em",
                border: "1px solid " + grey[300],
                borderRadius: "0.3em",
                padding: "0.5em",
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
            <Box component={"div"}
              sx={{
                marginBottom: "1em",
              }}
            >
              <Button
                startIcon={loading["read-test"] ? <CircularProgress size={20} /> :
                  readLogs.logs.length >= 200 ? <DoneRounded fontSize="small" /> :
                    <PlayCircleRounded fontSize="small" />}
                variant="contained"
                disabled={loading["read-test"] || readLogs.logs.length >= 200}
                onClick={() => {
                  setOpenDialog(prev => ({ ...prev, ["confirm-read-test"]: true }))
                }}
              >
                {readLogs.logs.length >= 200 ? "Completed" : "Run Read Test"}
              </Button>
            </Box>
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
                      <TableCell sx={{ width: "16.5%" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Response Time (ms)</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "16.5%" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Memory Usage (MB)</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "16.5%" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>CPU Usage (%)</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "20%" }}>
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600], fontWeight: 550 }}>Resource Utilization (%)</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {readLogs.logs.length < 5 && (
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
                    {paginatedReadLogs.map((log_, index) => (
                      <TableRow hover key={index}>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                            Request:{(pageReadLogs * 10) - 10 + (index + 1)}
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
                  count={Math.ceil(readLogs.logs.length / 10)}
                  page={pageReadLogs}
                  onChange={(_: ChangeEvent<unknown>, page: number) => {
                    setPageReadLogs(page)
                  }}
                  sx={{
                    marginY: "0.5em",
                    justifySelf: "end",
                  }}
                />
              </TableContainer>
            </Box>
          </Box> */}
        </Box>
      </Container>
      {/* DIALOG CONFIRM REQUEST SAMPLE */}
      <Dialog
        open={Boolean(openDialog["sample-request"])}
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
          Konfirmasi Data Sampel
        </Typography>
        <Typography component={"p"} variant="body2"
          sx={{
            color: grey[600],
            whiteSpace: "pre-line"
          }}
        >
          Apakah Anda yakin ingin meminta contoh sebanyak 500 data lowongan kerja yang dibuat secara otomatis? {"\n"}
        </Typography>
        {/* <Box component={"div"}
          sx={{
            marginTop: "0.5em",
            padding: "0.5em",
            borderRadius: "0.3em",
            color: amber[700],
            backgroundColor: amber[50]
          }}
        >
          <Typography component={"p"} variant="caption">
            Displaying 500 data entries may cause the interface to freeze or slow down.
          </Typography>
        </Box> */}
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
              setOpenDialog(prev => ({ ...prev, ["sample-request"]: false }))
            }}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={loading["sample-request"]}
            startIcon={loading["sample-request"] && <CircularProgress size={20} />}
            onClick={() => {
              GetSampleJSON();
            }}
          >
            Lanjutkan
          </Button>
        </Box>
      </Dialog>
      {/* DIALOG CONFIRM WRITE REQUEST SAMPLE */}
      <Dialog
        open={Boolean(openDialog["confirm-write-test"])}
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
          Pengujian ini akan menjalankan 100 permintaan ke layanan tanpa cache, yang mencakup berbagai operasi baca dan tulis pada data lowongan pekerjaan.

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
              setOpenDialog(prev => ({ ...prev, ["confirm-write-test"]: false }))
            }}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={loading["sample-request"]}
            startIcon={loading["sample-request"] && <CircularProgress size={20} />}
            onClick={() => {
              RunTestScenario();
              setOpenDialog(prev => ({ ...prev, ["confirm-write-test"]: false }));
            }}
          >
            Lanjutkan
          </Button>
        </Box>
      </Dialog>
      {/* DIALOG CONFIRM READ REQUEST SAMPLE */}
      {/* <Dialog
        open={Boolean(openDialog["confirm-read-test"])}
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
          Confirm Read Test Execution
        </Typography>
        <Typography component={"p"} variant="body2"
          sx={{
            color: grey[600],
            whiteSpace: "pre-line"
          }}
        >
          This test will execute 250 requests to the no-cache service, performing multiple read and write operations on job vacancy data. The process involves writing, reading, updating, and a combination of both. Given the large data volume, the test may take some time to complete.

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
              setOpenDialog(prev => ({ ...prev, ["confirm-read-test"]: false }))
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={loading["sample-request"]}
            startIcon={loading["sample-request"] && <CircularProgress size={20} />}
            onClick={() => {
              // RunReadTest();
              RunTestScenario();
              setOpenDialog(prev => ({ ...prev, ["confirm-read-test"]: false }));
            }}
          >
            Continue
          </Button>
        </Box>
      </Dialog> */}
    </PerformanceTestLayout>
  )
}