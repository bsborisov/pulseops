import type {
  OverviewSnapshot,
} from "@shared/monitoring";

import type {
  RealtimeEvent,
} from "@shared/realtime";

function appendSparkline(
  values: number[],
  value: number,
) {
  return [
    ...values,
    value,
  ].slice(-20);
}

export function applyOverviewEvent(
  current: OverviewSnapshot,
  event: RealtimeEvent,
): OverviewSnapshot {
  switch (event.type) {
    case "kpi.updated": {
      const {
        rps,
        activeUsers,
        errorRate,
        latency,
        eventsPerSecond,
      } = event.payload;

      return {
        ...current,

        kpi: {
          ...current.kpi,

          rps,
          activeUsers,
          errorRate,
          latency,
          eventsPerSecond,

          rpsSparkline:
            appendSparkline(
              current.kpi
                .rpsSparkline,
              rps,
            ),

          usersSparkline:
            appendSparkline(
              current.kpi
                .usersSparkline,
              activeUsers,
            ),

          errorSparkline:
            appendSparkline(
              current.kpi
                .errorSparkline,
              errorRate,
            ),

          latencySparkline:
            appendSparkline(
              current.kpi
                .latencySparkline,
              latency,
            ),
        },
      };
    }

    case "chart.point":
      return {
        ...current,

        chart: [
          ...current.chart,
          event.payload,
        ].slice(-60),
      };

    case "request.created":
      return {
        ...current,

        requests: [
          event.payload,
          ...current.requests,
        ].slice(0, 250),
      };

    case "service.updated":
      return {
        ...current,

        services:
          current.services.map(
            (service) =>
              service.id ===
                event.payload.id
                ? event.payload
                : service,
          ),
      };

    case "incident.updated": {
      const exists =
        current.incidents.some(
          (incident) =>
            incident.id ===
            event.payload.id,
        );

      return {
        ...current,

        incidents: exists
          ? current.incidents.map(
            (incident) =>
              incident.id ===
                event.payload.id
                ? event.payload
                : incident,
          )
          : [
            event.payload,
            ...current.incidents,
          ],
      };
    }
  }
}