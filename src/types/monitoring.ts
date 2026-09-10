export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

export type ServiceStatus =
  | "healthy"
  | "degraded"
  | "offline";

export type IncidentStatus =
  | "investigating"
  | "identified"
  | "monitoring"
  | "resolved";

export type IncidentSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type Region =
  | "US"
  | "EU"
  | "APAC"
  | "SA";

export type TimeRange =
  | "1m"
  | "5m"
  | "15m"
  | "1h";

export interface ChartPoint {
  timestamp: number;
  label: string;
  total: number;
  success: number;
  failed: number;
}

export interface KPIData {
  rps: number;
  activeUsers: number;
  errorRate: number;
  latency: number;

  rpsSparkline: number[];
  usersSparkline: number[];
  errorSparkline: number[];
  latencySparkline: number[];

  eventsPerSecond: number;
}

export interface ServiceHealth {
  id: string;
  name: string;
  status: ServiceStatus;
  uptime: number;
  rps: number;
  latency: number;
}

export interface RequestEvent {
  id: string;
  time: string;
  method: HttpMethod;
  endpoint: string;
  status: number;
  latency: number;
  region: Region;
  service: string;
}

export interface EndpointStat {
  endpoint: string;
  method: HttpMethod;
  service: string;
  rps: number;
  p95: number;
  errorRate: number;
  volumePercent: number;
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  updatedAt: string;
}

export interface OverviewSnapshot {
  kpi: KPIData;
  chart: ChartPoint[];
  services: ServiceHealth[];
  requests: RequestEvent[];
  endpoints: EndpointStat[];
  incidents: Incident[];
}