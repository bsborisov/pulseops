import { useState } from "react";
import { RealtimeChart } from "@/components/charts/RealtimeChart";
import { KPICard } from "@/components/ui/KPICard";
import type { TimeRange } from "@shared/monitoring";
import { useOverviewQuery } from "@/features/overview/queries/overview.queries";
import { OverviewError } from "./OverviewError";
import { OverviewSkeleton } from "./OverviewSkeleton";
import { EndpointPerformance } from "./EndpointPerformance";
import { LiveRequestStream } from "./LiveRequestStream";
import { RecentIncidents } from "./RecentIncidents";
import { SystemHealth } from "./SystemHealth";
import { cn } from "@/lib/utils";

const timeRanges: TimeRange[] = [
  "1m",
  "5m",
  "15m",
  "1h",
];

export function OverviewPage() {
  const [timeRange, setTimeRange] =
    useState<TimeRange>("1m");

  const {
    data,
    error,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useOverviewQuery();

  if (isPending) {
    return <OverviewSkeleton />;
  }

  if (isError) {
    return (
      <OverviewError
        error={error}
        retrying={isFetching}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  const {
    kpi,
    chart,
    services,
    requests,
    endpoints,
    incidents,
  } = data;

  return (
    <div className="w-full space-y-5 p-4 sm:p-5">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          label="Requests / sec"
          value={kpi.rps.toLocaleString()}
          delta={12.4}
          deltaLabel="+12.4%"
          sparkline={
            kpi.rpsSparkline
          }
          sparkColor="#0ea5e9"
        />

        <KPICard
          label="Active Users"
          value={kpi.activeUsers.toLocaleString()}
          delta={8.1}
          deltaLabel="+8.1%"
          sparkline={
            kpi.usersSparkline
          }
          sparkColor="#10b981"
        />

        <KPICard
          label="Error Rate"
          value={`${kpi.errorRate.toFixed(2)}%`}
          delta={-0.08}
          deltaLabel="-0.08%"
          invertDelta
          sparkline={
            kpi.errorSparkline
          }
          sparkColor="#ef4444"
        />

        <KPICard
          label="Avg Latency"
          value={String(
            kpi.latency,
          )}
          unit="ms"
          delta={-14}
          deltaLabel="-14ms"
          invertDelta
          sparkline={
            kpi.latencySparkline
          }
          sparkColor="#f59e0b"
        />
      </section>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-5">
        <div className="rounded-lg border border-edge bg-surface p-4 xl:col-span-3">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[13px] font-semibold text-hi">
                Realtime Traffic
              </h2>

              <div className="mt-0.5 text-[11px] text-lo">
                <span className="font-mono text-accent tabular-nums">
                  {kpi.rps.toLocaleString()}
                </span>

                <span className="ml-1">
                  req/s
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {timeRanges.map(
                (range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() =>
                      setTimeRange(
                        range,
                      )
                    }
                    className={cn(
                      "rounded border px-2 py-0.5",
                      "text-[11px] font-medium transition-colors",
                      timeRange ===
                        range
                        ? "border-accent/25 bg-accent/15 text-accent"
                        : "border-transparent text-lo hover:text-mid",
                    )}
                  >
                    {range}
                  </button>
                ),
              )}
            </div>
          </div>

          <RealtimeChart
            data={chart}
          />
        </div>

        <div className="xl:col-span-2">
          <SystemHealth
            services={services}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-5">
        <div className="min-w-0 xl:col-span-3">
          <LiveRequestStream
            requests={
              requests
            }
            eventsPerSecond={
              kpi.eventsPerSecond
            }
          />
        </div>

        <div className="xl:col-span-2">
          <EndpointPerformance
            endpoints={
              endpoints
            }
          />
        </div>
      </section>

      <RecentIncidents
        incidents={incidents}
      />
    </div>
  );
}