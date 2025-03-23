import { Box, Button, CircularProgress, Container, Dialog, Grid, IconButton, Pagination, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import PerformanceTestLayout from "../../../../../components/Templates/PerformanceTestLayout";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Legend, Tooltip, BarElement, TooltipItem, ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";
import { amber, blue, grey } from "@mui/material/colors";
import { DoneRounded, KeyboardBackspaceRounded, PlayCircleRounded } from "@mui/icons-material";
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
  Tooltip,
)

type ChartDataType = {
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
  const [writeLogs, setWriteLogs] = useState<{ chart: ChartDataType, logs: LogType[] }>({ chart: { labels: [], datasets: [] }, logs: [] });
  const [pageWriteLogs, setPageWriteLogs] = useState<number>(1);
  const [readLogs, setReadLogs] = useState<{ chart: ChartDataType, logs: LogType[] }>({ chart: { labels: [], datasets: [] }, logs: [] });
  const [pageReadLogs, setPageReadLogs] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  const [vacanciesRaw, setVacanciesRaw] = useState<RawVacancies[]>([]);
  const [requestStats, setRequestStats] = useState<Record<string, { awaiting: number; fail: number; success: number; }>>({});
  const [logTest, setLogTest] = useState<Record<string, string>>({ ["write-test"]: "", ["read-test"]: "" });
  const [displayLogs, setDisplayLogs] = useState<Record<string, boolean>>({});
  const [dots, setDots] = useState<string>("");
  const [startDots, setStartDots] = useState<boolean>(false);

  const [alert, setAlert] = useState<{ show: boolean; message: string; }>({ show: false, message: "" });
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [refetch, setRefetch] = useState<Record<string, boolean>>({});

  /* ref */
  const writeLogsRef = useRef<HTMLDivElement | null>(null);
  const readLogsRef = useRef<HTMLDivElement | null>(null);;

  /* constants */
  const token = GetSession("auth");
  const paginatedWriteLogs = writeLogs.logs.slice((pageWriteLogs * 15) - 15, pageWriteLogs * 15);
  const paginatedReadLogs = readLogs.logs.slice((pageReadLogs * 10) - 10, pageReadLogs * 10);

  /* GetSampleJSON */
  const GetSampleJSON = async () => {
    setLoading(prev => ({ ...prev, ["sample-request"]: true }));

    const [sampling, failSampling] = await RequestAPI.Send<SamplingQuery[]>(
      "/api/v1/administrators/test/generates/sampling?count=10",
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
        "/api/v1/administrators/test/generates/vacancies",
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
   * 1. Execute 50 requests, write 500 data per request
   * 2. Execute 50 requests, read 500 data per request
   * 3. Execute 50 requests, update written data at the first step, update 500 data per request
   * 4. Execute 50 requests, read updated data at the third step, read 500 data per request
   * 5. Execute 50 requests, combination write 500 data then read 500 data, total 25 write and 25 read ops
   * @returns void
   */
  const RunWriteTestScenario = async () => {
    setStartDots(true);
    setLoading(prev => ({
      ...prev,
      ["write-test"]: true
    }));
    setDisplayLogs(prev => ({
      ...prev,
      ["write-test"]: true
    }));
    setLogTest(prev => ({
      ...prev,
      ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tBegin write testing` +
        "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tGenerating sampling queries`
    })); // Logs

    const TOTAL_REQUEST = 250;
    setRequestStats(prev => ({
      ...prev,
      ["write-test"]: {
        ...prev["write-test"],
        awaiting: TOTAL_REQUEST,
        success: 0,
        fail: 0,
      }
    }));

    const [sampling, fail] = await RequestAPI.Send<SamplingQuery[]>(
      "/api/v1/administrators/test/generates/sampling?count=80", // exected count is 75 combinations, cause the math.round() count 75 became 70
      {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      console.log("sampling: \t", fail);
      return setAlert({ show: true, message: `sampling: ${fail.message}` });
    };
    if (sampling) {
      setLogTest(prev => ({
        ...prev,
        ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tWriting new data`,
      }));

      const writeSampling = sampling.slice(0, 50);
      const writtenID: Map<string, string[]> = new Map();
      /**
       * Write new data
       */
      for (let idx = 0; idx < writeSampling.length; idx++) {
        const [rawVacancies, fail] = await RequestAPI.JSONRequest({
          sampling: writeSampling,
          offset: idx + 1,
          total_raw_vacancies: 500
        }).Send<RawVacancies[]>(
          "/api/v1/administrators/test/generates/vacancies",
          { method: "POST", headers: { "Authorization": "Bearer " + token } }
        );
        if (fail) {
          console.log(`raw vacancies:\t${fail}`);
          setRequestStats(prev => ({
            ...prev,
            ["write-test"]: {
              ...prev["write-test"],
              awaiting: prev["write-test"].awaiting - 1,
              fail: prev["write-test"].fail + 1,
            }
          }));
          setLogTest(prev => ({
            ...prev,
            ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\traw vacancies: \t${fail.message} ❌`,
          }));

          continue;
        };
        if (rawVacancies) {
          const reqHeaders = new Headers({
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
            "X-Measure-Cache-Request-Logs": "no-cache",
            "X-Cache-Session": sessionID as string,
          });
          const reqBody = JSON.stringify(rawVacancies);
          const request = new Request(
            HOST.no_cache + "/api/v1/no-cache/vacancies",
            { method: "POST", headers: reqHeaders, body: reqBody },
          );
          try {
            const response = await fetch(request);
            if (response.status === 201) {
              const responseJSON: { data: string[]; success: boolean; } = await response.json();
              setRequestStats(prev => ({
                ...prev,
                ["write-test"]: {
                  ...prev["write-test"],
                  awaiting: prev["write-test"].awaiting - 1,
                  success: prev["write-test"].success + 1,
                }
              }));
              setLogTest(prev => ({
                ...prev,
                ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\twrite request #${idx} send successfully ✅`,
              }));
              writtenID.set(`request:${idx}`, responseJSON.data); // collect written new data ID

              continue;
            };

            const responseJSON: { success: boolean; error: string; message: string; } = await response.json();
            console.log(`fail response:\t${responseJSON}`);
            setRequestStats(prev => ({
              ...prev,
              ["write-test"]: {
                ...prev["write-test"],
                awaiting: prev["write-test"].awaiting - 1,
                fail: prev["write-test"].fail + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tfail response: \t${responseJSON.message} ❌`,
            }));

            continue;
          } catch (err) {
            if (err instanceof Error) {
              console.log(`error:\t${err}`);
              setRequestStats(prev => ({
                ...prev,
                ["write-test"]: {
                  ...prev["write-test"],
                  awaiting: prev["write-test"].awaiting - 1,
                  fail: prev["write-test"].fail + 1,
                }
              }));
              setLogTest(prev => ({
                ...prev,
                ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`,
              }));

              continue;
            };

            console.log(`unknown:\t${err}`);
            setRequestStats(prev => ({
              ...prev,
              ["write-test"]: {
                ...prev["write-test"],
                awaiting: prev["write-test"].awaiting - 1,
                fail: prev["write-test"].fail + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`,
            }));

            continue;
          };
        };
      };
      setLogTest(prev => ({
        ...prev,
        ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tWriting new data completed` +
          "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading written new data`,
      }));
      /**
       * Read written data
       */
      for (let idx = 0; idx < writeSampling.length; idx++) {
        const reqHeaders = new Headers({
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
          "X-Measure-Cache-Request-Logs": "no-cache",
          "X-Cache-Session": sessionID as string,
        });
        const request = new Request(
          `${HOST.no_cache}/api/v1/no-cache/vacancies/write-ops?lineIndustry=${writeSampling[idx].line_industry}&employeeType=${writeSampling[idx].employee_type}&workArrangement=${writeSampling[idx].work_arrangement}`,
          { method: "GET", headers: reqHeaders },
        );
        try {
          const response = await fetch(request);
          if (response.status === 200) {
            if (idx === (writeSampling.length - 1)) {
              const responseJSON = await response.json();
              console.log("data before update \t:", responseJSON["data"]);
            }
            setRequestStats(prev => ({
              ...prev,
              ["write-test"]: {
                ...prev["write-test"],
                awaiting: prev["write-test"].awaiting - 1,
                success: prev["write-test"].success + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tread request #${idx} send successfully ✅`,
            }));

            continue;
          };

          console.log(`response status:\t${response.status}`);
          setRequestStats(prev => ({
            ...prev,
            ["write-test"]: {
              ...prev["write-test"],
              awaiting: prev["write-test"].awaiting - 1,
              fail: prev["write-test"].fail + 1,
            }
          }));
          setLogTest(prev => ({
            ...prev,
            ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tresponse status: \t${response.status} ❌`,
          }));

          continue;
        } catch (err) {
          if (err instanceof Error) {
            console.log(`error:\t${err}`);
            setRequestStats(prev => ({
              ...prev,
              ["write-test"]: {
                ...prev["write-test"],
                awaiting: prev["write-test"].awaiting - 1,
                fail: prev["write-test"].fail + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`,
            }));

            continue;
          };

          console.log(`unknown:\t${err}`);
          setRequestStats(prev => ({
            ...prev,
            ["write-test"]: {
              ...prev["write-test"],
              awaiting: prev["write-test"].awaiting - 1,
              fail: prev["write-test"].fail + 1,
            }
          }));
          setLogTest(prev => ({
            ...prev,
            ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`,
          }));

          continue;
        }
      }
      setLogTest(prev => ({
        ...prev,
        ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tRead written data completed` +
          "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tUpdating new written data`,
      }));
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
        const reqHeaders = new Headers({
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
          "X-Measure-Cache-Request-Logs": "no-cache",
          "X-Cache-Session": sessionID as string,
        });
        const request = new Request(
          HOST.no_cache + "/api/v1/no-cache/vacancies",
          { method: "PATCH", headers: reqHeaders, body: JSON.stringify(reqBody) }
        );

        try {
          const response = await fetch(request);
          if (response.status === 200) {
            setRequestStats(prev => ({
              ...prev,
              ["write-test"]: {
                ...prev["write-test"],
                awaiting: prev["write-test"].awaiting - 1,
                success: prev["write-test"].success + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tupdate written data at #${keyMap} successfully ✅`,
            }));

            continue;
          }

          console.log(`response status:\t${response.status}`);
          setRequestStats(prev => ({
            ...prev,
            ["write-test"]: {
              ...prev["write-test"],
              awaiting: prev["write-test"].awaiting - 1,
              fail: prev["write-test"].fail + 1,
            }
          }));
          setLogTest(prev => ({
            ...prev,
            ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tresponse status: \t${response.status} ❌`,
          }));

          continue;
        } catch (err) {
          if (err instanceof Error) {
            console.log(`error:\t${err}`);
            setRequestStats(prev => ({
              ...prev,
              ["write-test"]: {
                ...prev["write-test"],
                awaiting: prev["write-test"].awaiting - 1,
                fail: prev["write-test"].fail + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`,
            }));

            continue;
          };

          console.log(`unknown:\t${err}`);
          setRequestStats(prev => ({
            ...prev,
            ["write-test"]: {
              ...prev["write-test"],
              awaiting: prev["write-test"].awaiting - 1,
              fail: prev["write-test"].fail + 1,
            }
          }));
          setLogTest(prev => ({
            ...prev,
            ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`,
          }));

          continue;
        }
      };
      setLogTest(prev => ({
        ...prev,
        ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tUpdating new written data completed` +
          "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\Reading updated new written data`,
      }));
      /**
       * Read updated new written data
       */
      for (let idx = 0; idx < writeSampling.length; idx++) {
        const reqHeaders = new Headers({
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
          "X-Measure-Cache-Request-Logs": "no-cache",
          "X-Cache-Session": sessionID as string,
        })
        const request = new Request(
          `${HOST.no_cache}/api/v1/no-cache/vacancies/write-ops?lineIndustry=${writeSampling[idx].line_industry}&employeeType=${writeSampling[idx].employee_type}&workArrangement=${writeSampling[idx].work_arrangement}`,
          { method: "GET", headers: reqHeaders },
        );
        try {
          const response = await fetch(request);
          if (response.status === 200) {
            if (idx === (writeSampling.length - 1)) {
              const responseJSON = await response.json();
              console.log("data after update \t:", responseJSON["data"]);
            }
            setRequestStats(prev => ({
              ...prev,
              ["write-test"]: {
                ...prev["write-test"],
                awaiting: prev["write-test"].awaiting - 1,
                success: prev["write-test"].success + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tread request #${idx} send successfully ✅`,
            }));

            continue;
          };

          console.log(`response status:\t${response.status}`);
          setRequestStats(prev => ({
            ...prev,
            ["write-test"]: {
              ...prev["write-test"],
              awaiting: prev["write-test"].awaiting - 1,
              fail: prev["write-test"].fail + 1,
            }
          }));
          setLogTest(prev => ({
            ...prev,
            ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tresponse status: \t${response.status} ❌`,
          }));

          continue;
        } catch (err) {
          if (err instanceof Error) {
            console.log(`error:\t${err}`);
            setRequestStats(prev => ({
              ...prev,
              ["write-test"]: {
                ...prev["write-test"],
                awaiting: prev["write-test"].awaiting - 1,
                fail: prev["write-test"].fail + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`,
            }));

            continue;
          };

          console.log(`unknown:\t${err}`);
          setRequestStats(prev => ({
            ...prev,
            ["write-test"]: {
              ...prev["write-test"],
              awaiting: prev["write-test"].awaiting - 1,
              fail: prev["write-test"].fail + 1,
            }
          }));
          setLogTest(prev => ({
            ...prev,
            ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`,
          }));

          continue;
        }
      }
      setLogTest(prev => ({
        ...prev,
        ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tRead updated new written data completed` +
          "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tCombination writing dan reading data`,
      }));
      /**
       * Combination write and read data
       */
      const combinationSampling = sampling.slice(50, 75);
      for (let idx = 0; idx < combinationSampling.length; idx++) {
        const [rawVacancies, fail] = await RequestAPI.JSONRequest({
          sampling: combinationSampling,
          offset: idx + 1,
          total_raw_vacancies: 500
        }).Send<RawVacancies[]>(
          "/api/v1/administrators/test/generates/vacancies",
          { method: "POST", headers: { "Authorization": "Bearer " + token } }
        );
        if (fail) {
          console.log(`raw vacancies:\t${fail}`);
          setRequestStats(prev => ({
            ...prev,
            ["write-test"]: {
              ...prev["write-test"],
              awaiting: prev["write-test"].awaiting - 1,
              fail: prev["write-test"].fail + 1,
            }
          }));
          setLogTest(prev => ({
            ...prev,
            ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\traw vacancies: \t${fail.message} ❌`,
          }));

          continue;
        };
        if (rawVacancies) {
          const reqHeaders = new Headers({
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
            "X-Measure-Cache-Request-Logs": "no-cache",
            "X-Cache-Session": sessionID as string,
          });
          const reqBody = JSON.stringify(rawVacancies);
          const request = new Request(
            HOST.no_cache + "/api/v1/no-cache/vacancies",
            { method: "POST", headers: reqHeaders, body: reqBody },
          );
          try {
            const response = await fetch(request);
            if (response.status === 201) {
              setRequestStats(prev => ({
                ...prev,
                ["write-test"]: {
                  ...prev["write-test"],
                  awaiting: prev["write-test"].awaiting - 1,
                  success: prev["write-test"].success + 1,
                }
              }));
              setLogTest(prev => ({
                ...prev,
                ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tcombination: write request #${idx} send successfully ✅`,
              }));

              const requestRead = new Request(
                `${HOST.no_cache}/api/v1/no-cache/vacancies/write-ops?lineIndustry=${combinationSampling[idx].line_industry}&employeeType=${combinationSampling[idx].employee_type}&workArrangement=${combinationSampling[idx].work_arrangement}`,
                { method: "GET", headers: reqHeaders },
              );
              try {
                const response = await fetch(requestRead);
                if (response.status === 200) {
                  setRequestStats(prev => ({
                    ...prev,
                    ["write-test"]: {
                      ...prev["write-test"],
                      awaiting: prev["write-test"].awaiting - 1,
                      success: prev["write-test"].success + 1,
                    }
                  }));
                  setLogTest(prev => ({
                    ...prev,
                    ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tcombination: read request #${idx} send successfully ✅`,
                  }));

                  continue;
                }

                console.log(`response status:\t${response.status}`);
                setRequestStats(prev => ({
                  ...prev,
                  ["write-test"]: {
                    ...prev["write-test"],
                    awaiting: prev["write-test"].awaiting - 1,
                    fail: prev["write-test"].fail + 1,
                  }
                }));
                setLogTest(prev => ({
                  ...prev,
                  ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tresponse status: \t${response.status} ❌`,
                }));

                continue;
              } catch (err) {
                if (err instanceof Error) {
                  console.log(`error:\t${err}`);
                  setRequestStats(prev => ({
                    ...prev,
                    ["write-test"]: {
                      ...prev["write-test"],
                      awaiting: prev["write-test"].awaiting - 1,
                      fail: prev["write-test"].fail + 1,
                    }
                  }));
                  setLogTest(prev => ({
                    ...prev,
                    ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`,
                  }));

                  continue;
                };

                console.log(`unknown:\t${err}`);
                setRequestStats(prev => ({
                  ...prev,
                  ["write-test"]: {
                    ...prev["write-test"],
                    awaiting: prev["write-test"].awaiting - 1,
                    fail: prev["write-test"].fail + 1,
                  }
                }));
                setLogTest(prev => ({
                  ...prev,
                  ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`,
                }));

                continue;
              }
            }
          } catch (err) {
            if (err instanceof Error) {
              console.log(`error:\t${err}`);
              setRequestStats(prev => ({
                ...prev,
                ["write-test"]: {
                  ...prev["write-test"],
                  awaiting: prev["write-test"].awaiting - 1,
                  fail: prev["write-test"].fail + 2,
                }
              }));
              setLogTest(prev => ({
                ...prev,
                ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`,
              }));

              continue;
            };

            console.log(`unknown:\t${err}`);
            setRequestStats(prev => ({
              ...prev,
              ["write-test"]: {
                ...prev["write-test"],
                awaiting: prev["write-test"].awaiting - 1,
                fail: prev["write-test"].fail + 2,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`,
            }));

            continue;
          }
        }
      }
      setLogTest(prev => ({
        ...prev,
        ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tCombination writing and reading data completed` + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tClearing testing data`,
      }));
      const [successClearing, failClearing] = await RequestAPI.Send<number>(
        "/api/v1/administrators/test/generates/vacancies?count=" + ((writeSampling.length + combinationSampling.length) * 500),
        { method: "DELETE", headers: { "Authorization": "Bearer " + token } }
      );
      if (failClearing) {
        console.log("clearing \t:", failClearing);
        setAlert({ show: false, message: failClearing.message });
      };
      if (successClearing) {
        setLogTest(prev => ({
          ...prev,
          ["write-test"]: prev["write-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tTesting data cleared successfully`,
        }));
      }
      setStartDots(false);
      setLoading(prev => ({
        ...prev,
        ["write-test"]: false,
      }));
      setRefetch(prev => ({ ...prev, ["write-logs"]: !prev["write-logs"] }));
    };
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
  const RunReadTestScenario = async () => {
    setStartDots(true);
    setLoading(prev => ({
      ...prev,
      ["read-test"]: true
    }));
    setDisplayLogs(prev => ({
      ...prev,
      ["read-test"]: true
    }));
    setLogTest(prev => ({
      ...prev,
      ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tBegin read testing` +
        "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tGenerating sampling queries`
    })); // Logs

    const TOTAL_REQUEST = 250;
    setRequestStats(prev => ({
      ...prev,
      ["read-test"]: {
        ...prev["read-test"],
        awaiting: TOTAL_REQUEST,
        success: 0,
        fail: 0,
      }
    }));

    const [sampling, fail] = await RequestAPI.Send<SamplingQuery[]>(
      "/api/v1/administrators/test/generates/sampling?count=120", // exected count is 75 combinations, cause the math.round() count 75 became 70
      {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      console.log("sampling: \t", fail);
      return setAlert({ show: true, message: `sampling: ${fail.message}` });
    };
    if (sampling) {
      setLogTest(prev => ({
        ...prev,
        ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tPreparing required data`,
      }));
      for (let idx = 0; idx < sampling.length; idx++) {
        const [rawVacancies, failRaw] = await RequestAPI.JSONRequest({
          sampling: sampling,
          offset: idx + 1,
          total_raw_vacancies: 500
        }).Send<RawVacancies[]>(
          "/api/v1/administrators/test/generates/vacancies",
          { method: "POST", headers: { "Authorization": "Bearer " + token } }
        );
        if (failRaw) {
          console.log("raw vacancies \t:", failRaw);
          return setAlert({ show: true, message: failRaw.message });
        };
        if (rawVacancies) {
          const [successStore, failStore] = await RequestAPI.JSONRequest(rawVacancies).Send<string[]>(
            "/api/v1/administrators/test/generates/vacancies/store",
            { method: "POST", headers: { "Authorization": "Bearer " + token } }
          );
          if (failStore) {
            console.log("store vacancies \t:", failStore);
            return setAlert({ show: true, message: `at offset ${idx}: ${failStore.message}` })
          };
          if (successStore) {
            setLogTest(prev => ({
              ...prev,
              ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\t${successStore.length} data stored at sampling offset ${idx}`,
            }));
          }
        }
      }
      setLogTest(prev => ({
        ...prev,
        ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tData is ready!` +
          "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 50 different queries`,
      }));

      const reqHeaders = new Headers({
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
        "X-Measure-Cache-Request-Logs": "no-cache",
        "X-Cache-Session": sessionID as string,
      });
      /**
       * Read 50 different query
       */
      const firstSampling = sampling.slice(0, 50)
      for (let idx = 0; idx < firstSampling.length; idx++) {
        const request = new Request(
          `${HOST.no_cache}/api/v1/no-cache/vacancies?lineIndustry=${firstSampling[idx].line_industry}&employeeType=${firstSampling[idx].employee_type}&workArrangement=${firstSampling[idx].work_arrangement}`,
          { method: "GET", headers: reqHeaders },
        );

        try {
          const response = await fetch(request);
          if (response.status === 200) {
            setRequestStats(prev => ({
              ...prev,
              ["read-test"]: {
                ...prev["read-test"],
                awaiting: prev["read-test"].awaiting - 1,
                success: prev["read-test"].success + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tread request #${idx} send successfully ✅`,
            }));

            continue;
          }

          console.log(`response status:\t${response.status}`);
          setRequestStats(prev => ({
            ...prev,
            ["read-test"]: {
              ...prev["read-test"],
              awaiting: prev["read-test"].awaiting - 1,
              fail: prev["read-test"].fail + 1,
            }
          }));
          setLogTest(prev => ({
            ...prev,
            ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tresponse status: \t${response.status} ❌`,
          }));

          continue;
        } catch (err) {
          if (err instanceof Error) {
            console.log(`error:\t${err}`);
            setRequestStats(prev => ({
              ...prev,
              ["read-test"]: {
                ...prev["read-test"],
                awaiting: prev["read-test"].awaiting - 1,
                fail: prev["read-test"].fail + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`,
            }));

            continue;
          };

          console.log(`unknown:\t${err}`);
          setRequestStats(prev => ({
            ...prev,
            ["read-test"]: {
              ...prev["read-test"],
              awaiting: prev["read-test"].awaiting - 1,
              fail: prev["read-test"].fail + 1,
            }
          }));
          setLogTest(prev => ({
            ...prev,
            ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`,
          }));

          continue;
        }
      }
      setLogTest(prev => ({
        ...prev,
        ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 50 different queries completed` +
          "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 25 different queries from the first sampling (x4)`,
      }));
      /**
       * Read 25 random different query from firstSampling
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
            `${HOST.no_cache}/api/v1/no-cache/vacancies?lineIndustry=${secondSampling[idx].line_industry}&employeeType=${secondSampling[idx].employee_type}&workArrangement=${secondSampling[idx].work_arrangement}`,
            { method: "GET", headers: reqHeaders },
          );

          try {
            const response = await fetch(request);
            if (response.status === 200) {
              setRequestStats(prev => ({
                ...prev,
                ["read-test"]: {
                  ...prev["read-test"],
                  awaiting: prev["read-test"].awaiting - 1,
                  success: prev["read-test"].success + 1,
                }
              }));
              setLogTest(prev => ({
                ...prev,
                ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tread request #${idx} send successfully ✅`,
              }));

              continue;
            }

            console.log(`response status:\t${response.status}`);
            setRequestStats(prev => ({
              ...prev,
              ["read-test"]: {
                ...prev["read-test"],
                awaiting: prev["read-test"].awaiting - 1,
                fail: prev["read-test"].fail + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tresponse status: \t${response.status} ❌`,
            }));

            continue;
          } catch (err) {
            if (err instanceof Error) {
              console.log(`error:\t${err}`);
              setRequestStats(prev => ({
                ...prev,
                ["read-test"]: {
                  ...prev["read-test"],
                  awaiting: prev["read-test"].awaiting - 1,
                  fail: prev["read-test"].fail + 1,
                }
              }));
              setLogTest(prev => ({
                ...prev,
                ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`,
              }));

              continue;
            };

            console.log(`unknown:\t${err}`);
            setRequestStats(prev => ({
              ...prev,
              ["read-test"]: {
                ...prev["read-test"],
                awaiting: prev["read-test"].awaiting - 1,
                fail: prev["read-test"].fail + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`,
            }));

            continue;
          }
        }
        setLogTest(prev => ({
          ...prev,
          ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tread request x${idxTimes} times completed`,
        }));
      }
      setLogTest(prev => ({
        ...prev,
        ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 25 different queries from the first sampling executed 4 times` +
          "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 50 different queries from the third sampling`,
      }));
      /**
       * Read 50 different queries and never used before
       */
      const thirdSampling = sampling.slice(50, 100);
      for (let idx = 0; idx < thirdSampling.length; idx++) {
        const request = new Request(
          `${HOST.no_cache}/api/v1/no-cache/vacancies?lineIndustry=${thirdSampling[idx].line_industry}&employeeType=${thirdSampling[idx].employee_type}&workArrangement=${thirdSampling[idx].work_arrangement}`,
          { method: "GET", headers: reqHeaders },
        );

        try {
          const response = await fetch(request);
          if (response.status === 200) {
            setRequestStats(prev => ({
              ...prev,
              ["read-test"]: {
                ...prev["read-test"],
                awaiting: prev["read-test"].awaiting - 1,
                success: prev["read-test"].success + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tread request #${idx} send successfully ✅`,
            }));

            continue;
          }

          console.log(`response status:\t${response.status}`);
          setRequestStats(prev => ({
            ...prev,
            ["read-test"]: {
              ...prev["read-test"],
              awaiting: prev["read-test"].awaiting - 1,
              fail: prev["read-test"].fail + 1,
            }
          }));
          setLogTest(prev => ({
            ...prev,
            ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tresponse status: \t${response.status} ❌`,
          }));

          continue;
        } catch (err) {
          if (err instanceof Error) {
            console.log(`error:\t${err}`);
            setRequestStats(prev => ({
              ...prev,
              ["read-test"]: {
                ...prev["read-test"],
                awaiting: prev["read-test"].awaiting - 1,
                fail: prev["read-test"].fail + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`,
            }));

            continue;
          };

          console.log(`unknown:\t${err}`);
          setRequestStats(prev => ({
            ...prev,
            ["read-test"]: {
              ...prev["read-test"],
              awaiting: prev["read-test"].awaiting - 1,
              fail: prev["read-test"].fail + 1,
            }
          }));
          setLogTest(prev => ({
            ...prev,
            ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`,
          }));

          continue;
        }
      }
      setLogTest(prev => ({
        ...prev,
        ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 50 different queries from the third sampling completed` +
          "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 50 different queries from 30 random sampling first, third sampling and 20 sampling never used before`,
      }));
      /**
       * Read 50 different queries, 30 random from combined first and third sampling, 20 new sampling
       */
      const randomUsedSampling = FisherYatesShuffleAlgorithm([...firstSampling, ...thirdSampling], 30);
      const fourthSampling = sampling.slice(100, 120).concat(randomUsedSampling);
      for (let idx = 0; idx < fourthSampling.length; idx++) {
        const request = new Request(
          `${HOST.no_cache}/api/v1/no-cache/vacancies?lineIndustry=${fourthSampling[idx].line_industry}&employeeType=${fourthSampling[idx].employee_type}&workArrangement=${fourthSampling[idx].work_arrangement}`,
          { method: "GET", headers: reqHeaders },
        );

        try {
          const response = await fetch(request);
          if (response.status === 200) {
            setRequestStats(prev => ({
              ...prev,
              ["read-test"]: {
                ...prev["read-test"],
                awaiting: prev["read-test"].awaiting - 1,
                success: prev["read-test"].success + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tread request #${idx} send successfully ✅`,
            }));

            continue;
          }

          console.log(`response status:\t${response.status}`);
          setRequestStats(prev => ({
            ...prev,
            ["read-test"]: {
              ...prev["read-test"],
              awaiting: prev["read-test"].awaiting - 1,
              fail: prev["read-test"].fail + 1,
            }
          }));
          setLogTest(prev => ({
            ...prev,
            ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tresponse status: \t${response.status} ❌`,
          }));

          continue;
        } catch (err) {
          if (err instanceof Error) {
            console.log(`error:\t${err}`);
            setRequestStats(prev => ({
              ...prev,
              ["read-test"]: {
                ...prev["read-test"],
                awaiting: prev["read-test"].awaiting - 1,
                fail: prev["read-test"].fail + 1,
              }
            }));
            setLogTest(prev => ({
              ...prev,
              ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\terror: \t${err.message} ❌`,
            }));

            continue;
          };

          console.log(`unknown:\t${err}`);
          setRequestStats(prev => ({
            ...prev,
            ["read-test"]: {
              ...prev["read-test"],
              awaiting: prev["read-test"].awaiting - 1,
              fail: prev["read-test"].fail + 1,
            }
          }));
          setLogTest(prev => ({
            ...prev,
            ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tunknown: \t${err} ❌`,
          }));

          continue;
        }
      }
      setLogTest(prev => ({
        ...prev,
        ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tReading data using 50 different queries from 30 random sampling first, third sampling and 20 sampling never used before completed` +
          "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tClearing generated data`,
      }));
      const [successClearing, failClearing] = await RequestAPI.Send<number>(
        "/api/v1/administrators/test/generates/vacancies?count=" + (sampling.length * 500),
        { method: "DELETE", headers: { "Authorization": "Bearer " + token } }
      );
      if (failClearing) {
        console.log("clearing \t:", failClearing);
        setAlert({ show: false, message: failClearing.message });
      };
      if (successClearing) {
        setLogTest(prev => ({
          ...prev,
          ["read-test"]: prev["read-test"] + "\n" + `[${dayjs().format("DD/MM/YYYY HH.mm.ss")}]:\tGenerated data cleared successfully`,
        }));
      }
      setStartDots(false);
      setLoading(prev => ({
        ...prev,
        ["read-test"]: false,
      }));
      setRefetch(prev => ({ ...prev, ["read-logs"]: !prev["read-logs"] }));
    };
  };

  const HEADERS = new Headers({
    "Authorization": "Bearer " + token,
  })
  /* side-effect */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, []);
  useEffect(() => {
    if (writeLogsRef.current) {
      writeLogsRef.current.scrollTop = writeLogsRef.current.scrollHeight;
    };
    if (readLogsRef.current) {
      readLogsRef.current.scrollTop = readLogsRef.current.scrollHeight;
    };
  }, [logTest["write-test"], logTest["read-test"]]);
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 5 ? prev + "." : "."));
    }, 1000);

    if (!startDots) { // FIX HERE
      return clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup saat unmount
  }, [loading["write-test"], loading["read-test"]]);
  /* logs fetching */
  useEffect(() => {
    (async () => {
      const [data, fail] = await RequestAPI.Send<{ chart: ChartDataType; logs: LogType[] }>(
        "/api/v1/administrators/test/no-cache/" + sessionID + "/logs?type=write",
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
        return setWriteLogs(data);
      };
    })();
  }, [refetch["write-logs"]]);
  useEffect(() => {
    (async () => {
      const [data, fail] = await RequestAPI.Send<{ chart: ChartDataType; logs: LogType[] }>(
        "/api/v1/administrators/test/no-cache/" + sessionID + "/logs?type=read",
        {
          method: "GET",
          headers: HEADERS,
        }
      );
      if (fail) {
        console.info("fail read logs request \t:", fail);
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        return setReadLogs(data);
      };
    })();
  }, [refetch["read-logs"]]);
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
              No Cache Test
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
                <Bar
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
            <Typography component={"p"} variant="subtitle1"
              sx={{
                fontWeight: 550,
                color: grey[700],
              }}
            >
              Write Test
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
            <Typography component={"p"} variant="body1"
              sx={{
                marginY: "0.5em",
                color: grey[700]
              }}
            >
              Click
              <Typography component={"span"} variant="inherit"
                sx={{
                  color: blue[500],
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => setOpenDialog(prev => ({ ...prev, ["sample-request"]: true }))}
              >
                {" "}Request Sample JSON Data
              </Typography>
              . to preview the data used in each request.
            </Typography>
            <Box component={"div"}
              ref={writeLogsRef}
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
              {displayLogs["write-test"] && (
                <Typography component={"p"} variant="caption" fontFamily={"monospace"} sx={{ whiteSpace: "pre-line" }}>
                  {logTest["write-test"] + " " + dots + "\n"}
                  -----------------------------------------------------------------
                  {`\n Testing progress -> ⏳Pending: ${requestStats["write-test"].awaiting} | ✅Success: ${requestStats["write-test"].success} | ❌Failed: ${requestStats["write-test"].fail}`}
                </Typography>
              )}
            </Box>
            <Box component={"div"}
              sx={{
                marginBottom: "1em",
              }}
            >
              <Button
                startIcon={loading["write-test"] ? <CircularProgress size={20} /> :
                  writeLogs.logs.length == 250 ? <DoneRounded fontSize="small" /> :
                    <PlayCircleRounded fontSize="small" />
                }
                variant="contained"
                disabled={loading["write-test"] || writeLogs.logs.length == 250}
                onClick={() => {
                  setVacanciesRaw([]);
                  setOpenDialog(prev => ({ ...prev, ["confirm-write-test"]: true }))
                }}
              >
                {writeLogs.logs.length == 250 ? "Test Completed" : "Run Write Test"}
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
                    {writeLogs.logs.length < 5 && (
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
                    {paginatedWriteLogs.map((log_, index) => (
                      <TableRow hover key={index}>
                        <TableCell>
                          <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                            Request:{(pageWriteLogs * 15) - 15 + (index + 1)}
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
                  count={Math.ceil(writeLogs.logs.length / 15)}
                  page={pageWriteLogs}
                  onChange={(_: ChangeEvent<unknown>, page: number) => {
                    setPageWriteLogs(page);
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
          <Box component={"div"} className="write-test">
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
              {displayLogs["read-test"] && (
                <Typography component={"p"} variant="caption" fontFamily={"monospace"} sx={{ whiteSpace: "pre-line" }}>
                  {logTest["read-test"] + " " + dots + "\n"}
                  -----------------------------------------------------------------
                  {`\n Testing progress -> ⏳Pending: ${requestStats["read-test"].awaiting} | ✅Success: ${requestStats["read-test"].success} | ❌Failed: ${requestStats["read-test"].fail}`}
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
          </Box>
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
          Confirm Sample Request
        </Typography>
        <Typography component={"p"} variant="body2"
          sx={{
            color: grey[600],
            whiteSpace: "pre-line"
          }}
        >
          Are you sure you want to request a sample of 500 generated vacancies? {"\n"}
        </Typography>
        <Box component={"div"}
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
        </Box>
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
            Cancel
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
            Continue
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
          Confirm Write Test Execution
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
              setOpenDialog(prev => ({ ...prev, ["confirm-write-test"]: false }))
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
              // RunWriteTest();
              RunWriteTestScenario();
              setOpenDialog(prev => ({ ...prev, ["confirm-write-test"]: false }));
            }}
          >
            Continue
          </Button>
        </Box>
      </Dialog>
      {/* DIALOG CONFIRM READ REQUEST SAMPLE */}
      <Dialog
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
              RunReadTestScenario();
              setOpenDialog(prev => ({ ...prev, ["confirm-read-test"]: false }));
            }}
          >
            Continue
          </Button>
        </Box>
      </Dialog>
    </PerformanceTestLayout>
  )
}