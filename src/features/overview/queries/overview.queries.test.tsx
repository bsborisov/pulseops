import { useEffect } from "react";


import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  act,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  applyOverviewEvent,
} from "@/features/overview/realtime/applyOverviewEvent";

import {
  overviewKeys,
  useOverviewKpiQuery,
  useOverviewRequestsQuery,
} from "./overview.queries";

import type { OverviewSnapshot } from "@shared/monitoring";

function createSnapshot(): OverviewSnapshot {
  return {
    kpi: {
      rps: 1842,
      activeUsers: 438,
      errorRate: 0.42,
      latency: 128,
      eventsPerSecond: 24,

      rpsSparkline: [1842],
      usersSparkline: [438],
      errorSparkline: [0.42],
      latencySparkline: [128],
    },

    chart: [],
    services: [],
    requests: [],
    endpoints: [],
    incidents: [],
  };
}

interface ConsumerProps {
  onRender: () => void;
}

function KpiConsumer({
  onRender,
}: ConsumerProps) {
  const {
    data,
  } = useOverviewKpiQuery();

  useEffect(() => {
    onRender();
  });

  return (
    <div>
      KPI:{data?.rps}
    </div>
  );
}

function RequestConsumer({
  onRender,
}: ConsumerProps) {
  const {
    data,
  } =
    useOverviewRequestsQuery();

  useEffect(() => {
    onRender();
  });

  return (
    <div>
      Requests:{data?.length ?? 0}
    </div>
  );
}

describe(
  "overview query selectors",
  () => {
    it("does not rerender KPI consumers when only requests change",
      async () => {
        const kpiRenderSpy =
          vi.fn();

        const requestRenderSpy =
          vi.fn();

        const queryClient =
          new QueryClient({
            defaultOptions: {
              queries: {
                retry: false,
              },
            },
          });

        queryClient.setQueryData(
          overviewKeys.snapshot(),
          createSnapshot(),
        );

        render(
          <QueryClientProvider
            client={queryClient}
          >
            <KpiConsumer
              onRender={
                kpiRenderSpy
              }
            />

            <RequestConsumer
              onRender={
                requestRenderSpy
              }
            />
          </QueryClientProvider>,
        );

        expect(
          screen.getByText(
            "KPI:1842",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Requests:0",
          ),
        ).toBeInTheDocument();

        const initialKpiRenders =
          kpiRenderSpy.mock.calls
            .length;

        const initialRequestRenders =
          requestRenderSpy.mock.calls
            .length;

        act(() => {
          queryClient.setQueryData<OverviewSnapshot>(
            overviewKeys.snapshot(),
            (current) => {
              if (!current) {
                return current;
              }

              return applyOverviewEvent(
                current,
                {
                  type:
                    "request.created",

                  payload: {
                    id: "request-1",
                    time: "15:30:00",
                    method: "GET",
                    endpoint:
                      "/api/users",
                    status: 200,
                    latency: 42,
                    region: "EU",
                    service: "Users",
                  },
                },
              );
            },
          );
        });

        await waitFor(() => {
          expect(
            screen.getByText(
              "Requests:1",
            ),
          ).toBeInTheDocument();
        });

        expect(
          requestRenderSpy.mock.calls
            .length,
        ).toBeGreaterThan(
          initialRequestRenders,
        );

        expect(
          kpiRenderSpy.mock.calls
            .length,
        ).toBe(
          initialKpiRenders,
        );
      },
    );
  },
);