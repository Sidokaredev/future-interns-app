export const criteriaSet: Set<[string, string]> = new Set([
  ["cache_hit", "benefit"],
  ["cache_miss", "cost"],
  ["response_time", "cost"],
  ["resource_utilization", "cost"]
]);

export const weightsSet: Set<[string, number]> = new Set([
  ["cache_hit", 0.2],
  ["cache_miss", 0.2],
  ["response_time", 0.3],
  ["resource_utilization", 0.3]
]);

type APIHost = {
  main: string;
  no_cache: string;
  write_through: string;
  write_behind: string;
  read_through: string;
  cache_aside: string;
};

const PRODUCTION_HOST = "https://sidokaredev.space/api/v1"

export const HOST: APIHost = {
  main: PRODUCTION_HOST + "/main",
  // main: "http://103.87.67.209:3000",
  // main: "http://localhost:3000",
  no_cache: PRODUCTION_HOST + "/no-cache",
  write_through: PRODUCTION_HOST + "/write-through",
  write_behind: PRODUCTION_HOST + "/write-behind",
  // cache_aside: "http://192.168.144.152:8000",
  cache_aside: PRODUCTION_HOST + "/cache-aside",
  read_through: PRODUCTION_HOST + "/read-through",
}