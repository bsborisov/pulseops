import { useMemo } from "react";
import { getEndpointAnalytics } from "@/features/analytics/lib/analytics";
import { useOverviewEndpointsQuery } from "@/features/overview/queries/overview.queries";
import type {
  EndpointStat,
} from "@shared/monitoring";
import { cn } from "@/lib/utils";

const EMPTY_ENDPOINTS: EndpointStat[] = [];

export function EndpointAnalytics() {
  const {
    data: endpoints,
  } = useOverviewEndpointsQuery();

  const source = endpoints ?? EMPTY_ENDPOINTS;

  const analytics =
    useMemo(
      () =>
        getEndpointAnalytics(
          source,
        ),
      [
        source,
      ],
    );

  const sortedEndpoints =
    useMemo(
      () =>
        [...source]
          .sort(
            (a, b) =>
              b.rps - a.rps,
          )
          .slice(0, 8),
      [
        source,
      ],
    );

  return (
    <section className="overflow-hidden rounded-lg border border-edge bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-edge px-4 py-3">
        <div>
          <h2 className="text-[13px] font-semibold text-hi">
            Endpoint Analytics
          </h2>

          <p className="mt-0.5 text-[11px] text-lo">
            Highest-volume endpoints in the rolling sample
          </p>
        </div>

        <div className="flex gap-5">
          <HeaderMetric
            label="Weighted P95"
            value={`${Math.round(
              analytics.weightedP95,
            )}ms`}
          />

          <HeaderMetric
            label="Error Rate"
            value={`${analytics.weightedErrorRate.toFixed(
              2,
            )}%`}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-175">
          <div className="grid grid-cols-[70px_minmax(220px,1fr)_120px_90px_90px] gap-3 border-b border-edge bg-panel px-4 py-2">
            {[
              "Method",
              "Endpoint",
              "Service",
              "P95",
              "Errors",
            ].map(
              (heading) => (
                <span
                  key={
                    heading
                  }
                  className="text-[10px] font-medium uppercase tracking-wider text-lo"
                >
                  {heading}
                </span>
              ),
            )}
          </div>

          {sortedEndpoints.map(
            (endpoint) => (
              <div
                key={`${endpoint.method}-${endpoint.endpoint}`}
                className="grid grid-cols-[70px_minmax(220px,1fr)_120px_90px_90px] items-center gap-3 border-b border-edge/60 px-4 py-2.5 last:border-0"
              >
                <span className="font-mono text-[10px] font-medium text-accent">
                  {
                    endpoint.method
                  }
                </span>

                <span className="truncate font-mono text-[10px] text-mid">
                  {
                    endpoint.endpoint
                  }
                </span>

                <span className="truncate text-[11px] text-lo">
                  {
                    endpoint.service
                  }
                </span>

                <span
                  className={cn(
                    "font-mono text-[10px] tabular-nums",

                    endpoint.p95 >
                      300
                      ? "text-err"
                      : endpoint.p95 >
                        150
                        ? "text-warn"
                        : "text-mid",
                  )}
                >
                  {
                    endpoint.p95
                  }
                  ms
                </span>

                <span
                  className={cn(
                    "font-mono text-[10px] tabular-nums",

                    endpoint.errorRate >
                      1
                      ? "text-err"
                      : endpoint.errorRate >
                        0.1
                        ? "text-warn"
                        : "text-ok",
                  )}
                >
                  {endpoint.errorRate.toFixed(
                    2,
                  )}
                  %
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

interface HeaderMetricProps {
  label: string;
  value: string;
}

function HeaderMetric({
  label,
  value,
}: HeaderMetricProps) {
  return (
    <div className="text-right">
      <div className="text-[9px] font-medium uppercase tracking-wider text-lo">
        {label}
      </div>

      <div className="mt-0.5 font-mono text-[11px] font-medium text-hi tabular-nums">
        {value}
      </div>
    </div>
  );
}