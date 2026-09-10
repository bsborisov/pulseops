import type {
  ChartPoint,
  Incident,
  KPIData,
  RequestEvent,
  ServiceHealth,
} from "./monitoring.ts";

export type KPIRealtimeUpdate = Pick<
  KPIData,
  | "rps"
  | "activeUsers"
  | "errorRate"
  | "latency"
  | "eventsPerSecond"
>;

export type RealtimeEvent =
  | {
    type: "kpi.updated";
    payload: KPIRealtimeUpdate;
  }
  | {
    type: "chart.point";
    payload: ChartPoint;
  }
  | {
    type: "request.created";
    payload: RequestEvent;
  }
  | {
    type: "service.updated";
    payload: ServiceHealth;
  }
  | {
    type: "incident.updated";
    payload: Incident;
  };