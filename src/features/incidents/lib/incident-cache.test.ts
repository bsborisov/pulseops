import {
  describe,
  expect,
  it,
} from "vitest";

import {
  replaceIncidentInSnapshot,
  setIncidentStatusInSnapshot,
} from "./incident-cache";

import type {
  OverviewSnapshot,
} from "@shared/monitoring";

function createSnapshot(): OverviewSnapshot {
  return {
    kpi: {
      rps: 100,
      activeUsers: 10,
      errorRate: 1,
      latency: 50,
      eventsPerSecond: 24,

      rpsSparkline: [],
      usersSparkline: [],
      errorSparkline: [],
      latencySparkline: [],
    },

    chart: [],
    services: [],
    endpoints: [],

    requests: [
      {
        id: "request-1",
        time: "10:00:00",
        method: "GET",
        endpoint:
          "/api/test",
        status: 200,
        latency: 40,
        region: "EU",
        service: "Test",
      },
    ],

    incidents: [
      {
        id: "incident-1",
        title:
          "Payment issue",
        service:
          "Payments",
        status:
          "investigating",
        severity:
          "critical",
        updatedAt:
          "2026-09-15T10:00:00Z",
      },
    ],
  };
}

describe(
  "incident cache helpers",
  () => {
    it(
      "optimistically updates only the incident collection",
      () => {
        const snapshot =
          createSnapshot();

        const result =
          setIncidentStatusInSnapshot(
            snapshot,
            "incident-1",
            "resolved",
            "2026-09-15T10:01:00Z",
          );

        expect(
          result.incidents[0]
            ?.status,
        ).toBe("resolved");

        expect(
          result.requests,
        ).toBe(
          snapshot.requests,
        );

        expect(
          result.kpi,
        ).toBe(snapshot.kpi);

        expect(
          result.chart,
        ).toBe(
          snapshot.chart,
        );
      },
    );

    it(
      "can roll back an incident without losing newer realtime data",
      () => {
        const original =
          createSnapshot();

        const previousIncident =
          original.incidents[0]!;

        const optimistic =
          setIncidentStatusInSnapshot(
            original,
            "incident-1",
            "resolved",
            "2026-09-15T10:01:00Z",
          );

        const withRealtimeRequest:
          OverviewSnapshot = {
          ...optimistic,

          requests: [
            {
              id:
                "request-new",
              time:
                "10:01:01",
              method:
                "POST",
              endpoint:
                "/api/new",
              status: 200,
              latency: 32,
              region: "US",
              service: "Test",
            },

            ...optimistic.requests,
          ],
        };

        const rolledBack =
          replaceIncidentInSnapshot(
            withRealtimeRequest,
            previousIncident,
          );

        expect(
          rolledBack
            .incidents[0]
            ?.status,
        ).toBe(
          "investigating",
        );

        expect(
          rolledBack.requests[0]
            ?.id,
        ).toBe(
          "request-new",
        );
      },
    );
  },
);