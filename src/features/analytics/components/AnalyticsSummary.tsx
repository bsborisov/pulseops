import { useMemo } from "react";

import {
  useOverviewChartQuery,
  useOverviewEndpointsQuery,
} from "@/features/overview/queries/overview.queries";

import {
  getEndpointAnalytics,
  getTrafficAnalytics,
} from "@/features/analytics/lib/analytics";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  label: string;
  value: string;
  detail: string;
  emphasis?:
  | "default"
  | "success"
  | "warning"
  | "error";
}

function AnalyticsCard({
  label,
  value,
  detail,
  emphasis = "default",
}: AnalyticsCardProps) {
  const valueClass = {
    default:
      "text-hi",

    success:
      "text-ok",

    warning:
      "text-warn",

    error:
      "text-err",
  }[emphasis];

  return (
    <div className="rounded-lg border border-edge bg-surface p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="text-[10px] font-medium uppercase tracking-wider text-lo">
        {label}
      </div>

      <div
        className={cn(
          "mt-2 font-mono text-2xl font-semibold tabular-nums",
          valueClass,
        )}
      >
        {value}
      </div>

      <div className="mt-1 text-[11px] text-lo">
        {detail}
      </div>
    </div>
  );
}

export function AnalyticsSummary() {
  const {
    data: chart,
  } =
    useOverviewChartQuery();

  const {
    data: endpoints,
  } =
    useOverviewEndpointsQuery();

  const traffic =
    useMemo(
      () =>
        getTrafficAnalytics(
          chart ?? [],
        ),
      [
        chart,
      ],
    );

  const endpointAnalytics =
    useMemo(
      () =>
        getEndpointAnalytics(
          endpoints ?? [],
        ),
      [
        endpoints,
      ],
    );

  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <AnalyticsCard
        label="Average throughput"
        value={Math.round(
          traffic.averageRps,
        ).toLocaleString()}
        detail="Requests per second"
      />

      <AnalyticsCard
        label="Peak throughput"
        value={traffic.peakRps.toLocaleString()}
        detail="Highest rolling sample"
      />

      <AnalyticsCard
        label="Success rate"
        value={`${traffic.successRate.toFixed(
          2,
        )}%`}
        detail={`${traffic.errorRate.toFixed(
          2,
        )}% errors`}
        emphasis={
          traffic.successRate >=
            99
            ? "success"
            : "warning"
        }
      />

      <AnalyticsCard
        label="Weighted P95"
        value={`${Math.round(
          endpointAnalytics.weightedP95,
        )}ms`}
        detail="Weighted by endpoint traffic"
        emphasis={
          endpointAnalytics.weightedP95 >
            300
            ? "error"
            : endpointAnalytics.weightedP95 >
              150
              ? "warning"
              : "default"
        }
      />
    </section>
  );
}