import {
  randomUUID,
} from "node:crypto";

import type {
  ChartPoint,
  HttpMethod,
  Region,
  RequestEvent,
} from "../../shared/monitoring.ts";

import type {
  BroadcastRealtimeEvent,
} from "./websocket.ts";

const endpoints = [
  "/api/products",
  "/api/users/482",
  "/api/orders/921",
  "/api/checkout",
  "/api/auth/login",
  "/api/cart",
];

const methods: HttpMethod[] = [
  "GET",
  "GET",
  "GET",
  "POST",
  "POST",
  "PUT",
];

const regions: Region[] = [
  "EU",
  "US",
  "APAC",
  "SA",
];

const REQUEST_INTERVAL_MS = 42;

const EVENTS_PER_SECOND =
  Math.round(
    1_000 / REQUEST_INTERVAL_MS,
  );

function randomBetween(
  min: number,
  max: number,
) {
  return Math.floor(
    Math.random() *
    (max - min + 1) +
    min,
  );
}

function createRequest(): RequestEvent {
  const index = randomBetween(
    0,
    endpoints.length - 1,
  );

  const failed =
    Math.random() < 0.04;

  return {
    id: randomUUID(),

    time: new Date()
      .toISOString()
      .slice(11, 19),

    method:
      methods[index] ?? "GET",

    endpoint:
      endpoints[index] ??
      "/api/unknown",

    status: failed
      ? Math.random() > 0.5
        ? 500
        : 429
      : 200,

    latency: failed
      ? randomBetween(250, 600)
      : randomBetween(25, 190),

    region:
      regions[
      randomBetween(
        0,
        regions.length - 1,
      )
      ] ?? "EU",

    service: [
      "Catalog",
      "Users",
      "Orders",
      "Payments",
      "Authentication",
      "Cart",
    ][index] ?? "Unknown",
  };
}

export function startMonitoringSimulator(
  broadcast: BroadcastRealtimeEvent,
) {
  let rps = 1842;
  let activeUsers = 438;
  let errorRate = 0.42;
  let latency = 128;

  const requestTimer =
    setInterval(() => {
      broadcast({
        type: "request.created",
        payload:
          createRequest(),
      });
    }, REQUEST_INTERVAL_MS);

  const metricsTimer =
    setInterval(() => {
      rps = Math.max(
        100,
        rps +
        randomBetween(-35, 35),
      );

      activeUsers = Math.max(
        1,
        activeUsers +
        randomBetween(-5, 6),
      );

      errorRate = Math.max(
        0.01,
        Math.min(
          5,
          errorRate +
          randomBetween(
            -5,
            5,
          ) /
          100,
        ),
      );

      latency = Math.max(
        10,
        latency +
        randomBetween(
          -8,
          8,
        ),
      );

      broadcast({
        type: "kpi.updated",

        payload: {
          rps,
          activeUsers,
          errorRate,
          latency,
          eventsPerSecond: EVENTS_PER_SECOND,
        },
      });

      const now = Date.now();

      const failed =
        Math.round(
          rps *
          (errorRate / 100),
        );

      const point: ChartPoint = {
        timestamp: now,

        label: new Date(now)
          .toISOString()
          .slice(11, 19),

        total: rps,
        success: rps - failed,
        failed,
      };

      broadcast({
        type: "chart.point",
        payload: point,
      });
    }, 1_000);

  return function stopSimulator() {
    clearInterval(requestTimer);
    clearInterval(metricsTimer);
  };
}