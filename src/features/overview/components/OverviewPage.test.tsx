import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  render,
  screen,
} from "@testing-library/react";

import {
  MemoryRouter,
} from "react-router";

import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  OverviewPage,
} from "@/features/overview/components/OverviewPage";

import type { OverviewSnapshot } from "@shared/monitoring";

const snapshot: OverviewSnapshot = {
  kpi: {
    rps: 1842,
    activeUsers: 438,
    errorRate: 0.42,
    latency: 128,

    rpsSparkline: [
      1600,
      1700,
      1842,
    ],

    usersSparkline: [
      400,
      420,
      438,
    ],

    errorSparkline: [
      0.5,
      0.45,
      0.42,
    ],

    latencySparkline: [
      150,
      140,
      128,
    ],

    eventsPerSecond: 24,
  },

  chart: [
    {
      timestamp: 1,
      label: "10:42:17",
      total: 1800,
      success: 1790,
      failed: 10,
    },
    {
      timestamp: 2,
      label: "10:42:18",
      total: 1842,
      success: 1834,
      failed: 8,
    },
  ],

  services: [],

  requests: [],

  endpoints: [],

  incidents: [],
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("OverviewPage", () => {
  it(
    "renders monitoring data from the API",
    async () => {
      vi.spyOn(
        globalThis,
        "fetch",
      ).mockResolvedValue(
        new Response(
          JSON.stringify(
            snapshot,
          ),
          {
            status: 200,

            headers: {
              "Content-Type":
                "application/json",
            },
          },
        ),
      );

      const queryClient =
        new QueryClient({
          defaultOptions: {
            queries: {
              retry: false,
            },
          },
        });

      render(
        <QueryClientProvider
          client={queryClient}
        >
          <MemoryRouter>
            <OverviewPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      expect(
        await screen.findByText(
          "Realtime Traffic",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "System Health",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Live Request Stream",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Endpoint Performance",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Recent Incidents",
        ),
      ).toBeInTheDocument();

      expect(
        globalThis.fetch,
      ).toHaveBeenCalledWith(
        "/api/overview",
        expect.objectContaining({
          method: "GET",
        }),
      );
    },
  );
});