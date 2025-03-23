import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PerformanceTestLayout from "../../../../../components/Templates/PerformanceTestLayout";
import { Box, Button, CircularProgress, Container, Dialog, Grid, IconButton, Pagination, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { DoneRounded, KeyboardArrowLeftRounded, KeyboardArrowRightRounded, KeyboardBackspaceRounded, PlayCircleRounded } from "@mui/icons-material";
import { Bar, Line } from "react-chartjs-2";
import { amber, green, grey } from "@mui/material/colors";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip as ChartTooltip, ChartData, TooltipItem } from "chart.js";
import { LogType, RawVacancies, SamplingQuery } from "../types";
import { GetSession, onCloseSnackbar } from "../../../../global-helpers";
import RequestAPI from "../../../../../services/api/request";
import dayjs from "dayjs";
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
export default function WriteBehindTestPage() {
  /* react-router */
  const navigate = useNavigate();
  const { id: sessionID } = useParams();

  /* ref */
  const logsRef = useRef<HTMLDivElement | null>(null);

  /* state */
  const [writeBehindLogs, setWriteBehindLogs] = useState<{
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
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [chunkNumber, setChunkNumber] = useState<number>(1);

  /* constants */
  const token = GetSession("auth");
  const paginatedWriteBehindLogs = writeBehindLogs.logs.slice((pageTableLogs * 15) - 15, pageTableLogs * 15);
  const chunkedLabels = writeBehindLogs.chart.resource_utils.labels?.slice((chunkNumber * 10) - 10, chunkNumber * 10);
  const chunkedRespTime = writeBehindLogs.chart.resource_utils.datasets[0].data.slice((chunkNumber * 10) - 10, chunkNumber * 10);
  const chunkedResUtil = writeBehindLogs.chart.resource_utils.datasets[1].data.slice((chunkNumber * 10) - 10, chunkNumber * 10);

  /**
   * 
   * @returns void
   */
  const RunWriteBehindScenario = async () => {
    setLoading(true);
    setDisplayLogs(true);
    setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tBegin Write-Behind test` +
      "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tGenerating sampling queries`);

    const TOTAL_REQUEST = 250;
    setRequestStats(prev => ({ ...prev, awaiting: TOTAL_REQUEST }));

    const basicHeaders = new Headers({
      "Authorization": "Bearer " + token
    });
    const logHeaders = new Headers({
      "Authorization": "Bearer " + token,
      "X-Measure-Cache-Request-Logs": "write-behind",
      "X-Cache-Session": sessionID as string,
    });

    const [dataSampling, failSampling] = await RequestAPI.Send<SamplingQuery[]>(
      "/api/v1/administrators/test/generates/sampling?count=80",
      { method: "GET", headers: basicHeaders }
    );
    if (failSampling) {
      console.log("generate sampling: \t", failSampling);
      return setAlert({ show: true, message: `generate sampling: ${failSampling.message}` })
    };
    if (dataSampling) {
      setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tSampling queries is ready!` +
        "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tWriting new data`);

      const firstSampling = dataSampling.slice(0, 50);
      const writtenID: Map<string, string[]> = new Map();
      /**
       * Writing new data
       */
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
            HOST.write_behind + "/api/v1/write-behind/vacancies",
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
      };
      setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tWriting new data completed` +
        "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tReading new written data`);
      /**
       * Reaading new written data
       */
      for (let idx = 0; idx < firstSampling.length; idx++) {
        const request = new Request(
          `${HOST.write_behind}/api/v1/write-behind/vacancies?lineIndustry=${firstSampling[idx].line_industry}&employeeType=${firstSampling[idx].employee_type}&workArrangement=${firstSampling[idx].work_arrangement}`,
          { method: "GET", headers: logHeaders },
        );
        try {
          const response = await fetch(request);
          if (response.status === 200) {
            if (idx === (firstSampling.length - 1)) {
              const responseJSON = await response.json();
              console.log("data before update \t:", responseJSON["data"][0]);
            }
            setRequestStats(prev => ({
              ...prev,
              awaiting: prev.awaiting - 1,
              success: prev.success + 1,
            }));
            setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tread request #${idx} send successfully ✅`);

            continue;
          };

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
      };
      setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tReading new written data completed` +
        "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tWaiting for Data Synchronization`);
      /**
       * Data Synchronization
       */
      const delay = (ms: number) => new Promise((resolve) => setTimeout(() => resolve(true), ms));
      let job = 0
      do {
        const request = new Request(
          HOST.write_behind + "/api/v1/write-behind/job-status",
          { method: "GET", headers: basicHeaders }
        );
        try {
          const response = await fetch(request);
          if (response.status === 200) {
            const responseJSON: { data: number; success: boolean } = await response.json();
            if (responseJSON.data === 0) {
              setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tdata synchronized!` +
                "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tUpdating new written data`);
              job = responseJSON.data

              continue;
            }

            job = responseJSON.data
            setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tTrying request for 30 seconds, ${responseJSON.data} jobs are waiting!`);
            await delay(30000);
            continue;
          }

          console.log("response status\t:", response.status);
          setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tfail with ${response.status}`);
          return setAlert({ show: true, message: `fail with ${response.status}` });

        } catch (err) {
          let error = err as Error;
          console.log("error \t:", error.message);
          return setAlert({ show: true, message: error.message });
        }
      }
      while (job > 0)
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
          HOST.write_behind + "/api/v1/write-behind/vacancies",
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
       * Reading updated new written data
       */
      for (let idx = 0; idx < firstSampling.length; idx++) {
        const request = new Request(
          `${HOST.write_behind}/api/v1/write-behind/vacancies?lineIndustry=${firstSampling[idx].line_industry}&employeeType=${firstSampling[idx].employee_type}&workArrangement=${firstSampling[idx].work_arrangement}`,
          { method: "GET", headers: logHeaders },
        );
        try {
          const response = await fetch(request);
          if (response.status === 200) {
            if (idx === (firstSampling.length - 1)) {
              const responseJSON = await response.json();
              console.log("data after update \t:", responseJSON["data"][0]);
            }
            setRequestStats(prev => ({
              ...prev,
              awaiting: prev.awaiting - 1,
              success: prev.success + 1,
            }));
            setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tread request #${idx} send successfully ✅`);

            continue;
          };

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
       * Combination write and read
       */
      const combinationSampling = dataSampling.slice(50, 75);
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
            HOST.write_behind + "/api/v1/write-behind/vacancies",
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
                `${HOST.write_behind}/api/v1/write-behind/vacancies?lineIndustry=${combinationSampling[idx].line_industry}&employeeType=${combinationSampling[idx].employee_type}&workArrangement=${combinationSampling[idx].work_arrangement}`,
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
      setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tWrite-Behind test completed` +
        "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tWaiting for data synchronization`);
      /**
       * waiting for synchronization
       */
      do {
        const request = new Request(
          HOST.write_behind + "/api/v1/write-behind/job-status",
          { method: "GET", headers: basicHeaders }
        );
        try {
          const response = await fetch(request);
          if (response.status === 200) {
            const responseJSON: { data: number; success: boolean } = await response.json();
            if (responseJSON.data === 0) {
              setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tdata synchronized!` +
                "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tClearing testing data`);
              job = responseJSON.data

              continue;
            }

            job = responseJSON.data
            setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tTrying request for 10 seconds, ${responseJSON.data} jobs are waiting!`);
            await delay(30000);
            continue;
          }

          console.log("response status\t:", response.status);
          setLogs(prev => prev + "\n" + `${dayjs().format("DD/MM/YYYY HH.mm.ss")}: \tfail with ${response.status}`);
          return setAlert({ show: true, message: `fail with ${response.status}` });

        } catch (err) {
          let error = err as Error;
          console.log("error \t:", error.message);
          return setAlert({ show: true, message: error.message });
        }
      }
      while (job > 0)
      const [successClearing, failClearing] = await RequestAPI.Send<number>(
        "/api/v1/administrators/test/generates/vacancies?count=" + ((firstSampling.length + combinationSampling.length) * 500),
        { method: "DELETE", headers: { "Authorization": "Bearer " + token } }
      );
      if (failClearing) {
        console.log("clearing \t:", failClearing);
        setAlert({ show: false, message: failClearing.message });
      };
      if (successClearing) {
        setLogs(prev => prev + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tTesting data cleared successfully`);
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
        "/api/v1/administrators/test/" + sessionID + "/logs?pattern=write-behind",
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
        return setWriteBehindLogs(data);
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
                navigate(-1)
              }}
            >
              <KeyboardBackspaceRounded sx={{ color: "#9bcdc5" }} />
            </IconButton>
            <Typography component={"p"} variant="h6"
              sx={{
                color: "#c2fffb",
              }}
            >
              Write Behind Test
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
                <Bar
                  data={{
                    ...writeBehindLogs.chart.cache_status,
                    datasets: [
                      {
                        ...writeBehindLogs.chart.cache_status.datasets[0],
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
                        disabled={chunkNumber === (Math.ceil(writeBehindLogs.chart.resource_utils.datasets[0].data.length / 10))}
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
                    ...writeBehindLogs.chart.resource_utils,
                    labels: chunkedLabels,
                    datasets: [
                      {
                        ...writeBehindLogs.chart.resource_utils.datasets[0],
                        data: chunkedRespTime,
                        backgroundColor: green[200],
                        borderColor: green[400]
                      },
                      {
                        ...writeBehindLogs.chart.resource_utils.datasets[1],
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
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          {/* READ TEST */}
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
              This test will execute 250 requests to the write-behind service. Below are the details of the request phases:
            </Typography>
            <ol style={{ color: grey[700], lineHeight: "1.5em", marginLeft: "1em", marginTop: "0.5em" }}>
              <li>
                <Typography component={"p"} variant="body1">
                  Execute 50 requests to write new job vacancy data, writing 500 records per request (total: 25,000 records).
                </Typography>
              </li>
              <li>
                <Typography component={"p"} variant="body1">
                  Execute 50 requests to read the job vacancy data written in the first phase, reading 500 records per request.
                </Typography>
              </li>
              <li>
                <Typography component={"p"} variant="body1">
                  Execute 50 requests to update the job vacancy data written in the first phase, updating 500 records per request.
                </Typography>
              </li>
              <li>
                <Typography component={"p"} variant="body1">
                  Execute 50 requests to read the job vacancy data that was updated in the third phase, reading 500 records per request.
                </Typography>
              </li>
              <li>
                <Typography component={"p"} variant="body1">
                  Execute 50 requests with a combination of reading and writing job vacancy data at a 50:50 ratio. Writing 500 records per request (total: 12,500 records) and reading 500 records per request.
                </Typography>
              </li>
            </ol>
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
                    writeBehindLogs.logs.length === 250 ? <DoneRounded fontSize="small" /> :
                      <PlayCircleRounded fontSize="small" />
                }
                disabled={loading || writeBehindLogs.logs.length === 250}
                variant="contained"
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                {writeBehindLogs.logs.length === 250 ? "Completed" : "Run Write Test"}
              </Button>
            </Box>
          </Box>
          {/* READ TEST RESULTS */}
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
              Write Test Results
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
                  {writeBehindLogs.logs.length < 5 && (
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
                          Request logs for the write test are empty. Please run the test first.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {paginatedWriteBehindLogs.map((log_, index) => (
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
                count={Math.ceil(writeBehindLogs.logs.length / 15)}
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
      </Container>
      {/* Confirmation Test Dialog */}
      <Dialog
        open={Boolean(openDialog)}
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
          Confirm Write-Behind Test Execution
        </Typography>
        <Typography component={"p"} variant="body2"
          sx={{
            color: grey[600],
            whiteSpace: "pre-line"
          }}
        >
          This test will execute 250 requests to the write-behind service, performing multiple read and write operations on job vacancy data. The process involves writing, reading, updating, and a combination of both. Given the large data volume, the test may take some time to complete.

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
              setOpenDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              // RunWriteTest();
              RunWriteBehindScenario();
              setOpenDialog(false);
            }}
          >
            Continue
          </Button>
        </Box>
      </Dialog>
    </PerformanceTestLayout>
  )
}