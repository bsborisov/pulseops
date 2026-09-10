import {
  describe,
  expect,
  it,
} from "vitest";

import type { OverviewSnapshot } from "@shared/monitoring";
import { applyOverviewEvent } from "./applyOverviewEvent";

function createSnapshot(): OverviewSnapshot {
  return {
    kpi: {
      rps: 1842,
      activeUsers: 438,
      errorRate: 0.42,
      latency: 128,
      eventsPerSecond: 24,
      rpsSparkline: [1800, 1820, 1842],
      usersSparkline: [420, 430, 438],
      errorSparkline: [0.5, 0.46, 0.42],
      latencySparkline: [140, 134, 128],
    },

    chart: [],

    services: [
      {
        id: "payments",
        name: "Payments",
        status: "healthy",
        uptime: 99.99,
        rps: 150,
        latency: 80,
      },
    ],

    requests: [],

    endpoints: [],

    incidents: [],
  };
}

describe("applyOverviewEvent", () => {
  it("updates KPI values and sparklines", () => {
    const result =
      applyOverviewEvent(
        createSnapshot(),
        {
          type: "kpi.updated",

          payload: {
            rps: 1950,
            activeUsers: 460,
            errorRate: 0.31,
            latency: 117,
            eventsPerSecond: 28,
          },
        },
      );

    expect(result.kpi.rps).toBe(1950);
    expect(result.kpi.activeUsers).toBe(460);

    expect(
      result.kpi.rpsSparkline.at(-1),
    ).toBe(1950);

    expect(
      result.kpi.latencySparkline.at(-1),
    ).toBe(117);
  });

  it("prepends new requests", () => {
    const result =
      applyOverviewEvent(
        createSnapshot(),
        {
          type: "request.created",

          payload: {
            id: "request-1",
            time: "15:30:00",
            method: "GET",
            endpoint: "/api/users",
            status: 200,
            latency: 42,
            region: "EU",
            service: "Users",
          },
        },
      );

    expect(result.requests).toHaveLength(1);

    expect(
      result.requests[0]?.id,
    ).toBe("request-1");
  });

  it("keeps at most 250 requests", () => {
    const snapshot =
      createSnapshot();

    snapshot.requests =
      Array.from(
        {
          length: 250,
        },
        (_, index) => ({
          id: `request-${index}`,
          time: "15:30:00",
          method: "GET" as const,
          endpoint: "/api/test",
          status: 200,
          latency: 50,
          region: "EU" as const,
          service: "Test",
        }),
      );

    const result =
      applyOverviewEvent(
        snapshot,
        {
          type: "request.created",

          payload: {
            id: "new-request",
            time: "15:31:00",
            method: "POST",
            endpoint: "/api/orders",
            status: 201,
            latency: 70,
            region: "US",
            service: "Orders",
          },
        },
      );

    expect(result.requests).toHaveLength(250);

    expect(
      result.requests[0]?.id,
    ).toBe("new-request");
  });

  it("keeps at most 60 chart points", () => {
    const snapshot =
      createSnapshot();

    snapshot.chart =
      Array.from(
        {
          length: 60,
        },
        (_, index) => ({
          timestamp: index,
          label: String(index),
          total: 1800,
          success: 1790,
          failed: 10,
        }),
      );

    const result =
      applyOverviewEvent(
        snapshot,
        {
          type: "chart.point",

          payload: {
            timestamp: 61,
            label: "61",
            total: 1900,
            success: 1895,
            failed: 5,
          },
        },
      );

    expect(result.chart).toHaveLength(60);

    expect(
      result.chart.at(-1)?.timestamp,
    ).toBe(61);

    expect(
      result.chart[0]?.timestamp,
    ).toBe(1);
  });

  it("replaces an updated service", () => {
    const result =
      applyOverviewEvent(
        createSnapshot(),
        {
          type: "service.updated",

          payload: {
            id: "payments",
            name: "Payments",
            status: "degraded",
            uptime: 97.8,
            rps: 220,
            latency: 240,
          },
        },
      );

    expect(
      result.services[0]?.status,
    ).toBe("degraded");

    expect(
      result.services[0]?.latency,
    ).toBe(240);
  });
});