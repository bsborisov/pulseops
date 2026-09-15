import { RealtimeChart } from "@/components/charts/RealtimeChart";
import { TIME_RANGES } from "@/app/dashboard-filters";
import { useDashboardSearchParams } from "@/hooks/useDashboardSearchParams";

import {
  useOverviewChartQuery,
  useOverviewKpiQuery,
} from "@/features/overview/queries/overview.queries";
import { cn } from "@/lib/utils";


export function RealtimeTrafficPanel() {
  const {
    timeRange,
    setTimeRange,
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
    <div className="rounded-lg border border-edge bg-surface p-4">
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
  );
}