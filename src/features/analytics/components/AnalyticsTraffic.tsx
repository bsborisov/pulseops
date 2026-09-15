import { useMemo } from "react";
import { RealtimeChart } from "@/components/charts/RealtimeChart";
import { getTrafficAnalytics } from "@/features/analytics/lib/analytics";
import { useOverviewChartQuery } from "@/features/overview/queries/overview.queries";
import type { ChartPoint } from "@shared/monitoring";

const EMPTY_CHART: ChartPoint[] = [];

export function AnalyticsTraffic() {
  const {
    data: chart,
  } = useOverviewChartQuery();

  const data = chart ?? EMPTY_CHART;

  const analytics =
    useMemo(
      () =>
        getTrafficAnalytics(
          data,
        ),
      [
        data,
      ],
    );

  return (
    <section className="rounded-lg border border-edge bg-surface p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[13px] font-semibold text-hi">
            Traffic Trend
          </h2>

          <p className="mt-0.5 text-[11px] text-lo">
            Rolling realtime request sample
          </p>
        </div>

        <div className="flex gap-5">
          <Metric
            label="Requests"
            value={analytics.totalRequests.toLocaleString()}
          />

          <Metric
            label="Peak"
            value={`${analytics.peakRps.toLocaleString()} rps`}
          />
        </div>
      </div>

      <RealtimeChart
        data={data}
        height={270}
      />
    </section>
  );
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({
  label,
  value,
}: MetricProps) {
  return (
    <div className="text-right">
      <div className="text-[9px] font-medium uppercase tracking-wider text-lo">
        {label}
      </div>

      <div className="mt-0.5 font-mono text-[12px] font-medium text-hi tabular-nums">
        {value}
      </div>
    </div>
  );
}