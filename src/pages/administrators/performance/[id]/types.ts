export type RawVacancies = {
  id: string;
  position: string;
  description: string;
  qualification: string;
  responsibility: string;
  line_industry: string;
  employee_type: string;
  min_experience: string;
  salary: number;
  work_arrangement: string;
  sla: number;
  is_inactive: number;
  employer_id: string;
  created_at: string;
}

export type LogType = {
  id: number;
  cache_hit: number;
  cache_miss: number;
  response_time: number;
  memory_usage: number;
  cpu_usage: number;
  resource_utilization: number;
  cache_type: string;
  created_at: string,
  cache_session_id: number;
};

export type SamplingQuery = {
  line_industry: string;
  employee_type: string;
  work_arrangement: string;
};