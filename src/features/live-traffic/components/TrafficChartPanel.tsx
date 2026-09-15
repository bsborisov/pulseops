import { RealtimeChart } from "@/components/charts/RealtimeChart";

import { TIME_RANGES } from "@/app/dashboard-filters";

import {
  useOverviewChartQuery,
  useOverviewKpiQuery,
} from "@/features/overview/queries/overview.queries";

import { useDashboardSearchParams } from "@/hooks/useDashboardSearchParams";

export function TrafficChartPanel() {
  const {
    timeRange,
    setTimeRange,
    environment,
  } = useDashboardSearchParams();

  const {
    data: chart,
  } = useOverviewChartQuery();

  const {
    data: kpi,
  } = useOverviewKpiQuery();

  if (!chart || !kpi) {
    return null;
  }

  return (
    <section className="rounded-lg border border-edge bg-surface p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[13px] font-semibold text-hi">
              Request Traffic
            </h2>

            <span className="rounded-full border border-ok/20 bg-ok/10 px-2 py-0.5 text-[10px] font-medium capitalize text-ok">
              {environment}
            </span>
          </div>

          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-lg font-semibold text-hi tabular-nums">
              {kpi.rps.toLocaleString()}
            </span>

            <span className="text-[11px] text-lo">
              req/s
            </span>
          </div>
        </div>

        <div className="flex rounded-md border border-edge bg-panel p-0.5">
          {TIME_RANGES.map(
            (range) => (
              <button
                key={range}
                type="button"
                onClick={() =>
                  setTimeRange(
                    range,
                  )
                }
                className={[
                  "rounded px-2.5 py-1 text-[11px] font-medium transition-colors",

                  timeRange ===
                    range
                    ? "bg-surface text-accent shadow-sm"
                    : "text-lo hover:text-hi",
                ].join(" ")}
              >
                {range}
              </button>
            ),
          )}
        </div>
      </div>

      <RealtimeChart
        data={chart}
        height={260}
      />

      <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-edge pt-3 text-[10px] text-lo">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-accent" />
          Total
        </div>

        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-ok" />
          Successful
        </div>

        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-err" />
          Failed
        </div>
      </div>
    </section>
  );
}