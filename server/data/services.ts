import type {
  EndpointStat,
  ServiceDetail,
} from "../../shared/monitoring.ts";

import {
  MOCK_CHART_DATA,
  MOCK_SERVICES,
} from "./overview.ts";

interface ServiceMetadata {
  description: string;
  version: string;
  instances: number;
  errorRate: number;
  p95: number;
  region: string;
  lastDeployedAt: string;
  dependencies: string[];
  requestServices: string[];
  endpoints: EndpointStat[];
}

const SERVICE_METADATA =
  {
    "api-gateway": {
      description:
        "Primary ingress layer responsible for routing, rate limiting and request orchestration.",

      version: "3.14.2",
      instances: 6,
      errorRate: 0.18,
      p95: 86,
      region: "Global",

      lastDeployedAt:
        "2026-09-14T16:32:00Z",

      dependencies: [
        "Authentication",
        "Redis",
      ],

      requestServices: [
        "Catalog",
        "Users",
        "Orders",
        "Payments",
        "Authentication",
        "Cart",
      ],

      endpoints: [
        {
          endpoint: "/api/*",
          method: "GET",
          service: "API Gateway",
          rps: 1240,
          p95: 82,
          errorRate: 0.12,
          volumePercent: 92,
        },

        {
          endpoint: "/api/*",
          method: "POST",
          service: "API Gateway",
          rps: 602,
          p95: 104,
          errorRate: 0.31,
          volumePercent: 68,
        },

        {
          endpoint: "/health",
          method: "GET",
          service: "API Gateway",
          rps: 35,
          p95: 14,
          errorRate: 0,
          volumePercent: 18,
        },
      ],
    },

    authentication: {
      description:
        "Authentication and session service handling login, authorization and identity validation.",

      version: "2.8.1",
      instances: 4,
      errorRate: 0.27,
      p95: 118,
      region: "EU / US",

      lastDeployedAt:
        "2026-09-13T10:18:00Z",

      dependencies: [
        "Database",
        "Redis",
      ],

      requestServices: [
        "Authentication",
      ],

      endpoints: [
        {
          endpoint:
            "/api/auth/login",
          method: "POST",
          service:
            "Authentication",
          rps: 186,
          p95: 118,
          errorRate: 0.34,
          volumePercent: 76,
        },

        {
          endpoint:
            "/api/auth/session",
          method: "GET",
          service:
            "Authentication",
          rps: 92,
          p95: 61,
          errorRate: 0.08,
          volumePercent: 52,
        },

        {
          endpoint:
            "/api/auth/logout",
          method: "POST",
          service:
            "Authentication",
          rps: 34,
          p95: 48,
          errorRate: 0.04,
          volumePercent: 24,
        },
      ],
    },

    payments: {
      description:
        "Payment orchestration service handling checkout, payment authorization and transaction processing.",

      version: "5.2.7",
      instances: 5,
      errorRate: 2.19,
      p95: 420,
      region: "EU / US",

      lastDeployedAt:
        "2026-09-15T07:42:00Z",

      dependencies: [
        "API Gateway",
        "Database",
      ],

      requestServices: [
        "Payments",
      ],

      endpoints: [
        {
          endpoint:
            "/api/checkout",
          method: "POST",
          service: "Payments",
          rps: 146,
          p95: 420,
          errorRate: 2.19,
          volumePercent: 84,
        },

        {
          endpoint:
            "/api/payments",
          method: "POST",
          service: "Payments",
          rps: 118,
          p95: 287,
          errorRate: 0.91,
          volumePercent: 64,
        },

        {
          endpoint:
            "/api/payments/:id",
          method: "GET",
          service: "Payments",
          rps: 74,
          p95: 96,
          errorRate: 0.16,
          volumePercent: 38,
        },
      ],
    },

    database: {
      description:
        "Primary relational data service supporting transactional application workloads.",

      version: "16.4",
      instances: 3,
      errorRate: 0.03,
      p95: 24,
      region: "EU",

      lastDeployedAt:
        "2026-09-09T21:15:00Z",

      dependencies: [],

      requestServices: [
        "Users",
        "Orders",
        "Catalog",
        "Payments",
      ],

      endpoints: [
        {
          endpoint:
            "/internal/db/read",
          method: "GET",
          service: "Database",
          rps: 2840,
          p95: 18,
          errorRate: 0.02,
          volumePercent: 88,
        },

        {
          endpoint:
            "/internal/db/write",
          method: "POST",
          service: "Database",
          rps: 1370,
          p95: 31,
          errorRate: 0.05,
          volumePercent: 57,
        },
      ],
    },

    redis: {
      description:
        "Distributed cache used for sessions, frequently accessed objects and transient application state.",

      version: "7.4",
      instances: 3,
      errorRate: 0.01,
      p95: 3,
      region: "EU / US",

      lastDeployedAt:
        "2026-09-08T12:05:00Z",

      dependencies: [],

      requestServices: [
        "Authentication",
        "Users",
        "Catalog",
      ],

      endpoints: [
        {
          endpoint:
            "/internal/cache/get",
          method: "GET",
          service: "Redis",
          rps: 6240,
          p95: 2,
          errorRate: 0.01,
          volumePercent: 94,
        },

        {
          endpoint:
            "/internal/cache/set",
          method: "POST",
          service: "Redis",
          rps: 2160,
          p95: 4,
          errorRate: 0.02,
          volumePercent: 49,
        },
      ],
    },
  } satisfies Record<
    string,
    ServiceMetadata
  >;

export function getServiceDetail(
  serviceId: string,
): ServiceDetail | undefined {
  const service =
    MOCK_SERVICES.find(
      (item) =>
        item.id === serviceId,
    );

  const metadata =
    SERVICE_METADATA[
    serviceId as keyof typeof SERVICE_METADATA
    ];

  if (
    !service ||
    !metadata
  ) {
    return undefined;
  }

  const scale =
    service.rps /
    MOCK_SERVICES[0]!.rps;

  const chart =
    MOCK_CHART_DATA.map(
      (point) => {
        const total =
          Math.max(
            1,
            Math.round(
              point.total *
              scale,
            ),
          );

        const failed =
          Math.round(
            total *
            (metadata.errorRate /
              100),
          );

        return {
          ...point,

          total,

          failed,

          success:
            total - failed,
        };
      },
    );

  return {
    ...service,
    ...metadata,
    chart,
  };
}