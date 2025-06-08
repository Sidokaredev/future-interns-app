import { Box, Button, CircularProgress, Dialog, IconButton, InputAdornment, Pagination, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import AdministratorLayout from "../../../components/Templates/AdministratorLayout";
import { grey, lightBlue } from "@mui/material/colors";
import { LaunchRounded, RocketLaunchRounded, SearchRounded, SpeedRounded } from "@mui/icons-material";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetSession, onCloseSnackbar } from "../../global-helpers";
import RequestAPI from "../../../services/api/request";
import { useDebounce } from "use-debounce";

type CacheSessionType = {
  id: number;
  label: string;
  status: string | null;
  created_at: string;
  total_of_cache_hit: number;
  number_of_cache_hit: number;
  total_of_cache_miss: number;
  number_of_cache_miss: number;
  avg_response_time: number;
  avg_memory_usage: number;
  avg_cpu_usage: number;
  avg_resource_utilization: number;
}

export default function PerformanceTestPage() {
  /* react-router */
  const navigate = useNavigate();
  const location = useLocation();
  /* state */
  const [cacheSessions, setCacheSessions] = useState<CacheSessionType[]>([]);
  const [cacheSessionsCount, setCacheSessionsCount] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 1000);
  const [pageTable, setPageTable] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState<Record<string, boolean>>({});
  const [testForm, setTestForm] = useState<string>("");
  const [alert, setAlert] = useState<{ show: boolean; message: string; }>({ show: false, message: "" });
  const [loading, setLoading] = useState<boolean>(false);
  // const [refresh, setRefresh] = useState<Record<string, boolean>>({});

  /* constants */
  const token = GetSession("auth");
  // const filteredCacheSessions = cacheSessions.filter(val => val.label.toLowerCase().includes(query.toLowerCase()));
  // const paginatedCacheSessions = filteredCacheSessions.slice((pageTable * 10) - 10, pageTable * 10);

  const totalPageTable = Math.ceil(cacheSessionsCount / 10);

  /* onCreate */
  const CreateNewTest = async () => {
    setLoading(true);

    const token = GetSession("auth");
    const [success, fail] = await RequestAPI.JSONRequest({ label: testForm }).Send<{ id: string; message: string; }>(
      "/administrators/test/",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );
    if (fail) {
      setLoading(false);
      return setAlert({ show: true, message: fail.message });
    };
    if (success) {
      setAlert({ show: true, message: success.message });
      return setTimeout(() => {
        setLoading(false);
        navigate(location.pathname + "/" + success.id);
      }, 2000);
    };
  };

  useEffect(() => {
    (async () => {
      const [data, fail] = await RequestAPI.Send<{ arr: CacheSessionType[]; count: number; }>(
        "/administrators/dashboard/performances?page=" + pageTable + "&label=" + debouncedQuery,
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          }
        }
      );
      if (fail) {
        console.log("cache sessions: \t", fail);
        return setAlert({ show: true, message: fail.message });
      };
      if (data) {
        setCacheSessionsCount(data.count);
        return setCacheSessions(data.arr);
      };
      setAlert({ show: true, message: "cache sessions: \tboth 'fail' and 'data' were empty!" })
    })();
  }, [pageTable, debouncedQuery]); // refresh["cache-sessions"]

  return (
    <AdministratorLayout>
      {/* Default Notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert.show}
        message={alert.message}
        autoHideDuration={3000}
        onClose={onCloseSnackbar(setAlert)}
      />
      <Box component={"div"} className="table-performance-test-results"
      >
        <Box component={"div"}
          sx={{
            marginBottom: "1em",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography component={"p"} variant="subtitle2"
            sx={{
              fontWeight: 550,
              color: "#06816d",
            }}
          >
            Hasil Pengujian Performa
          </Typography>
          <Box component={"div"}
            sx={{
              display: "flex",
              columnGap: 1
            }}
          >
            <TextField
              type="text"
              name="search_test_label"
              placeholder="Cari berdasarkan label"
              size="small"
              autoComplete="off"
              value={query}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setQuery(event.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded fontSize="small" />
                  </InputAdornment>
                ),
                sx: {
                  minWidth: {
                    md: "20em",
                  },
                  fontSize: "small",
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: "small"
                }
              }}
              sx={{
                // minWidth: "15em"
              }}
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<RocketLaunchRounded fontSize="small" />}
              onClick={() => {
                setOpenDialog(prev => (
                  {
                    ...prev,
                    ["new-test"]: true,
                  }
                ))
              }}
            >
              Mulai Pengujian Baru
            </Button>
          </Box>
        </Box>
        <TableContainer>
          <Table size="small"
            sx={{
              borderCollapse: "unset",
              border: "1px solid #e6f2f0",
              borderRadius: "0.3em",
              ".MuiTableCell-root": {
                border: "none",
              },
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e6f2f0" }}>
                <TableCell sx={{ width: "5%" }}>
                  <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[700] }}>No.</Typography>
                </TableCell>
                <TableCell sx={{ width: "15%" }}>
                  <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[700] }}>Tes Label</Typography>
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[700] }}>Avg. Cache Hit</Typography>
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[700] }}>Avg. Cache Miss</Typography>
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[700] }}>Avg. Response Time</Typography>
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[700] }}>Avg. Mem Usage</Typography>
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[700] }}>Avg. CPU Usage</Typography>
                </TableCell>
                <TableCell sx={{ width: "10%" }}>
                  <Typography component={"p"} variant="caption" sx={{ fontWeight: 550, color: grey[700] }}>Avg. Resource Utilization</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cacheSessions.map((log_, index) => {
                const numberOfRow: number = (pageTable * 10) - 10 + (index + 1);
                return (
                  <TableRow hover key={index}>
                    <TableCell>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        {numberOfRow}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        {log_.label}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        {`${log_.total_of_cache_hit}/${log_.number_of_cache_hit}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        {`${log_.total_of_cache_miss}/${log_.number_of_cache_miss}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        {`${log_.avg_response_time}ms`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        {`${log_.avg_memory_usage}%`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                        {`${log_.avg_cpu_usage}%`}
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
                        <Typography component={"p"} variant="body2" sx={{ color: grey[600] }}>
                          {`${log_.avg_resource_utilization}%`}
                        </Typography>
                        <Tooltip title="view detail" placement="top">
                          <IconButton size="small"
                            onClick={() => {
                              navigate(`${location.pathname}/${log_.id}`);
                            }}
                          >
                            <LaunchRounded fontSize="small" sx={{ color: lightBlue[700] }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <Pagination
            color="primary"
            count={totalPageTable}
            onChange={(_: ChangeEvent<unknown>, page: number) => {
              setPageTable(page);
            }}
            page={pageTable}
            sx={{ marginY: "1em", display: "flex", justifySelf: "end" }}
          />
        </TableContainer>
      </Box>
      {/* Dialog Create New Test */}
      <Dialog
        open={Boolean(openDialog["new-test"])}
        onClose={() => {
          setOpenDialog(prev => ({ ...prev, ["candidate-overview"]: false }))
        }}
        maxWidth={"xs"}
        PaperProps={{
          sx: {
            padding: "1em"
          }
        }}
        fullWidth
      >
        <Box component={"div"}
          sx={{
            marginBottom: "0.5em",
            display: "flex",
            columnGap: 1
          }}
        >
          <SpeedRounded fontSize="small" sx={{ color: "#06816d" }} />
          <Typography component={"p"} variant="subtitle2"
            sx={{
              fontWeight: 550,
              color: "#06816d"
            }}
          >
            Buat Pengujian Baru
          </Typography>
        </Box>
        <Box component={"div"}
          sx={{
            marginBottom: '1.5em',
          }}
        >
          <Typography component={"p"} variant="body2" sx={{ marginBottom: "0.5em", color: grey[600] }}>
            Sebelum memulai pengujian, Anda harus terlebih dahulu membuat sesi pengujian dengan menentukan label pengujian untuk mengidentifikasi data log pengujian.
          </Typography>
          <TextField
            type="text"
            // variant="standard"
            name="label"
            label="Label Name"
            size="small"
            autoComplete="off"
            fullWidth
            InputProps={{
              sx: {
                color: grey[600],
                // fontSize: "small",
              }
            }}
            InputLabelProps={{
              sx: {
                fontSize: "small",
              }
            }}
            sx={{
              marginTop: "0.5em",
            }}
            value={testForm}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setTestForm(event.target.value);
            }}
          />
        </Box>
        <Box component={"div"}
          sx={{
            display: "flex",
            columnGap: 1,
            justifyContent: "end"
          }}
        >
          <Button
            variant="text"
            color="error"
            size="small"
            sx={{
              minWidth: "7em"
            }}
            onClick={() => setOpenDialog(prev => ({ ...prev, ["new-test"]: false }))}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              minWidth: "7em"
            }}
            disabled={testForm === "" || loading}
            startIcon={loading && <CircularProgress size={20} />}
            onClick={() => {
              CreateNewTest();
            }}
          >
            Buat
          </Button>
        </Box>
      </Dialog>
    </AdministratorLayout >
  )
}