import type {
  ChartPoint,
  EndpointStat,
  ServiceHealth,
} from "@shared/monitoring";

export interface TrafficAnalytics {
  totalRequests: number;
  averageRps: number;
  peakRps: number;
  successRate: number;
  errorRate: number;
}

export interface EndpointAnalytics {
  weightedP95: number;
  weightedErrorRate: number;
  slowestEndpoint:
  | EndpointStat
  | undefined;
  highestErrorEndpoint:
  | EndpointStat
  | undefined;
}

export interface ServiceThroughputItem {
  id: string;
  name: string;
  rps: number;
  latency: number;
  status: ServiceHealth["status"];
}

export function getTrafficAnalytics(
  chart: ChartPoint[],
): TrafficAnalytics {
  if (chart.length === 0) {
    return {
      totalRequests: 0,
      averageRps: 0,
      peakRps: 0,
      successRate: 100,
      errorRate: 0,
    };
  }

  const totalRequests =
    chart.reduce(
      (total, point) =>
        total + point.total,
      0,
    );

  const successful =
    chart.reduce(
      (total, point) =>
        total + point.success,
      0,
    );

  const failed =
    chart.reduce(
      (total, point) =>
        total + point.failed,
      0,
    );

  return {
    totalRequests,

    averageRps:
      totalRequests /
      chart.length,

    peakRps:
      Math.max(
        ...chart.map(
          (point) =>
            point.total,
        ),
      ),

    successRate:
      totalRequests > 0
        ? (successful /
          totalRequests) *
        100
        : 100,

    errorRate:
      totalRequests > 0
        ? (failed /
          totalRequests) *
        100
        : 0,
  };
}

export function getEndpointAnalytics(
  endpoints: EndpointStat[],
): EndpointAnalytics {
  if (
    endpoints.length === 0
  ) {
    return {
      weightedP95: 0,
      weightedErrorRate: 0,
      slowestEndpoint:
        undefined,
      highestErrorEndpoint:
        undefined,
    };
  }

  const totalRps =
    endpoints.reduce(
      (total, endpoint) =>
        total + endpoint.rps,
      0,
    );

  const weightedP95 =
    totalRps > 0
      ? endpoints.reduce(
        (
          total,
          endpoint,
        ) =>
          total +
          endpoint.p95 *
          endpoint.rps,
        0,
      ) / totalRps
      : 0;

  const weightedErrorRate =
    totalRps > 0
      ? endpoints.reduce(
        (
          total,
          endpoint,
        ) =>
          total +
          endpoint.errorRate *
          endpoint.rps,
        0,
      ) / totalRps
      : 0;

  const slowestEndpoint =
    [...endpoints].sort(
      (a, b) =>
        b.p95 - a.p95,
    )[0];

  const highestErrorEndpoint =
    [...endpoints].sort(
      (a, b) =>
        b.errorRate -
        a.errorRate,
    )[0];

  return {
    weightedP95,
    weightedErrorRate,
    slowestEndpoint,
    highestErrorEndpoint,
  };
}

export function getServiceThroughput(
  services: ServiceHealth[],
): ServiceThroughputItem[] {
  return services
    .map((service) => ({
      id: service.id,
      name: service.name,
      rps: service.rps,
      latency:
        service.latency,
      status:
        service.status,
    }))
    .sort(
      (a, b) =>
        b.rps - a.rps,
    );
}