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

export const HOST: APIHost = {
  main: "http://54.198.53.107",
  no_cache: "http://54.198.53.107:8004",
  write_through: "http://54.198.53.107:8002",
  write_behind: "http://54.198.53.107:8003",
  cache_aside: "http://54.198.53.107:8000",
  read_through: "http://54.198.53.107:8001",
}