import type {
  ChartPoint,
  EndpointStat,
  Incident,
  KPIData,
  OverviewSnapshot,
  RequestEvent,
  ServiceHealth,
} from "../../src/types/monitoring.ts";


const BASE_TIMESTAMP =
  Date.parse("2026-09-10T08:40:00Z");

const totals = [
  1660,
  1695,
  1720,
  1708,
  1748,
  1775,
  1804,
  1788,
  1812,
  1835,
  1822,
  1860,
  1884,
  1872,
  1901,
  1879,
  1848,
  1864,
  1829,
  1808,
  1836,
  1855,
  1828,
  1842,
];

export const MOCK_CHART_DATA: ChartPoint[] =
  totals.map((total, index) => {
    const timestamp =
      BASE_TIMESTAMP + index * 5_000;

    const failed =
      index % 7 === 0
        ? Math.round(total * 0.008)
        : Math.round(total * 0.0042);

    return {
      timestamp,
      label: new Date(timestamp)
        .toISOString()
        .slice(11, 19),

      total,
      success: total - failed,
      failed,
    };
  });

export const MOCK_KPI: KPIData = {
  rps: 1842,
  activeUsers: 438,
  errorRate: 0.42,
  latency: 128,

  rpsSparkline: [
    1600, 1640, 1665, 1710, 1680,
    1740, 1770, 1805, 1780, 1810,
    1835, 1820, 1865, 1880, 1855,
    1870, 1830, 1810, 1830, 1842,
  ],

  usersSparkline: [
    382, 390, 394, 402, 398,
    408, 415, 420, 418, 425,
    429, 433, 428, 436, 441,
    438, 435, 440, 437, 438,
  ],

  errorSparkline: [
    0.58, 0.52, 0.49, 0.47, 0.51,
    0.46, 0.44, 0.43, 0.45, 0.41,
    0.44, 0.40, 0.39, 0.43, 0.41,
    0.38, 0.40, 0.41, 0.43, 0.42,
  ],

  latencySparkline: [
    154, 149, 151, 146, 143,
    147, 139, 137, 141, 134,
    136, 131, 135, 129, 127,
    132, 126, 130, 127, 128,
  ],

  eventsPerSecond: 24,
};

export const MOCK_SERVICES: ServiceHealth[] = [
  {
    id: "api-gateway",
    name: "API Gateway",
    status: "healthy",
    uptime: 99.99,
    rps: 1842,
    latency: 42,
  },
  {
    id: "authentication",
    name: "Authentication",
    status: "healthy",
    uptime: 99.98,
    rps: 286,
    latency: 68,
  },
  {
    id: "payments",
    name: "Payments",
    status: "degraded",
    uptime: 97.81,
    rps: 156,
    latency: 198,
  },
  {
    id: "database",
    name: "Database",
    status: "healthy",
    uptime: 99.99,
    rps: 4210,
    latency: 12,
  },
  {
    id: "redis",
    name: "Redis",
    status: "healthy",
    uptime: 100,
    rps: 8400,
    latency: 1,
  },
];

export const MOCK_REQUESTS: RequestEvent[] = [
  {
    id: "req-001",
    time: "10:42:18",
    method: "GET",
    endpoint: "/api/users/482",
    status: 200,
    latency: 82,
    region: "EU",
    service: "Users",
  },
  {
    id: "req-002",
    time: "10:42:18",
    method: "POST",
    endpoint: "/api/checkout",
    status: 201,
    latency: 214,
    region: "US",
    service: "Payments",
  },
  {
    id: "req-003",
    time: "10:42:17",
    method: "GET",
    endpoint: "/api/products",
    status: 200,
    latency: 51,
    region: "EU",
    service: "Catalog",
  },
  {
    id: "req-004",
    time: "10:42:17",
    method: "POST",
    endpoint: "/api/auth/login",
    status: 401,
    latency: 73,
    region: "APAC",
    service: "Authentication",
  },
  {
    id: "req-005",
    time: "10:42:16",
    method: "GET",
    endpoint: "/api/orders/921",
    status: 500,
    latency: 341,
    region: "EU",
    service: "Orders",
  },
  {
    id: "req-006",
    time: "10:42:16",
    method: "GET",
    endpoint: "/api/products",
    status: 200,
    latency: 43,
    region: "US",
    service: "Catalog",
  },
  {
    id: "req-007",
    time: "10:42:15",
    method: "POST",
    endpoint: "/api/payments",
    status: 200,
    latency: 187,
    region: "EU",
    service: "Payments",
  },
  {
    id: "req-008",
    time: "10:42:15",
    method: "GET",
    endpoint: "/api/users/712",
    status: 200,
    latency: 64,
    region: "US",
    service: "Users",
  },
  {
    id: "req-009",
    time: "10:42:14",
    method: "PUT",
    endpoint: "/api/cart",
    status: 200,
    latency: 91,
    region: "APAC",
    service: "Cart",
  },
  {
    id: "req-010",
    time: "10:42:14",
    method: "GET",
    endpoint: "/api/notifications",
    status: 200,
    latency: 55,
    region: "SA",
    service: "Notifications",
  },
];

export const MOCK_ENDPOINTS: EndpointStat[] = [
  {
    endpoint: "/api/products",
    method: "GET",
    service: "Catalog",
    rps: 548,
    p95: 49,
    errorRate: 0.02,
    volumePercent: 82,
  },
  {
    endpoint: "/api/users/:id",
    method: "GET",
    service: "Users",
    rps: 366,
    p95: 68,
    errorRate: 0.05,
    volumePercent: 68,
  },
  {
    endpoint: "/api/orders/:id",
    method: "GET",
    service: "Orders",
    rps: 218,
    p95: 114,
    errorRate: 0.08,
    volumePercent: 52,
  },
  {
    endpoint: "/api/checkout",
    method: "POST",
    service: "Payments",
    rps: 146,
    p95: 420,
    errorRate: 2.19,
    volumePercent: 41,
  },
  {
    endpoint: "/api/users",
    method: "GET",
    service: "Users",
    rps: 142,
    p95: 59,
    errorRate: 0.03,
    volumePercent: 38,
  },
  {
    endpoint: "/api/cart",
    method: "PUT",
    service: "Cart",
    rps: 118,
    p95: 82,
    errorRate: 0.04,
    volumePercent: 34,
  },
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "inc-001",
    title: "Elevated checkout latency",
    service: "Payments",
    status: "investigating",
    severity: "critical",
    updatedAt: "2026-09-10T08:39:30Z",
  },
  {
    id: "inc-002",
    title: "Payment service degraded",
    service: "Payments",
    status: "identified",
    severity: "high",
    updatedAt: "2026-09-10T08:38:00Z",
  },
  {
    id: "inc-003",
    title: "Elevated auth error rate",
    service: "Authentication",
    status: "monitoring",
    severity: "medium",
    updatedAt: "2026-09-10T08:35:00Z",
  },
  {
    id: "inc-004",
    title: "API Gateway error spike",
    service: "API Gateway",
    status: "resolved",
    severity: "high",
    updatedAt: "2026-09-10T07:10:00Z",
  },
];

export function getOverviewSnapshot(): OverviewSnapshot {
  return {
    kpi: MOCK_KPI,
    chart: MOCK_CHART_DATA,
    services: MOCK_SERVICES,
    requests: MOCK_REQUESTS,
    endpoints: MOCK_ENDPOINTS,
    incidents: MOCK_INCIDENTS,
  };
}