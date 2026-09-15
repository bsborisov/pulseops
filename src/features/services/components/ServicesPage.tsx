import { useMemo } from "react";
import {
  Link,
  useLocation,
} from "react-router";

import { MonitoringPageError } from "@/components/monitoring/MonitoringPageError";
import { MonitoringPageSkeleton } from "@/components/monitoring/MonitoringPageSkeleton";
import {
  useOverviewQuery,
  useOverviewServicesQuery,
} from "@/features/overview/queries/overview.queries";

import type { ServiceStatus } from "@shared/monitoring";
import { cn } from "@/lib/utils";

const statusStyles:
  Record<
    ServiceStatus,
    {
      dot: string;
      text: string;
      label: string;
    }
  > = {
  healthy: {
    dot: "bg-ok",
    text: "text-ok",
    label: "Healthy",
  },

  degraded: {
    dot: "bg-warn",
    text: "text-warn",
    label: "Degraded",
  },

  offline: {
    dot: "bg-err",
    text: "text-err",
    label: "Offline",
  },
};

interface SummaryCardProps {
  label: string;
  value: string;
  detail: string;
}

function SummaryCard({
  label,
  value,
  detail,
}: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-edge bg-surface p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="text-[10px] font-medium uppercase tracking-wider text-lo">
        {label}
      </div>

      <div className="mt-2 font-mono text-2xl font-semibold text-hi tabular-nums">
        {value}
      </div>

      <div className="mt-1 text-[11px] text-lo">
        {detail}
      </div>
    </div>
  );
}

export function ServicesPage() {
  const {
    error,
    isPending,
    isError,
    isFetching,
    refetch,
  } =
    useOverviewQuery();

  const {
    data: services,
  } =
    useOverviewServicesQuery();

  const {
    search,
  } =
    useLocation();

  const summary =
    useMemo(() => {
      const items =
        services ?? [];

      const healthy =
        items.filter(
          (service) =>
            service.status ===
            "healthy",
        ).length;

      const degraded =
        items.filter(
          (service) =>
            service.status ===
            "degraded",
        ).length;

      const totalRps =
        items.reduce(
          (
            total,
            service,
          ) =>
            total +
            service.rps,
          0,
        );

      const avgLatency =
        items.length > 0
          ? Math.round(
            items.reduce(
              (
                total,
                service,
              ) =>
                total +
                service.latency,
              0,
            ) /
            items.length,
          )
          : 0;

      return {
        healthy,
        degraded,
        totalRps,
        avgLatency,
      };
    }, [
      services,
    ]);

  if (isPending) {
    return (
      <MonitoringPageSkeleton />
    );
  }

  if (isError) {
    return (
      <MonitoringPageError
        error={error}
        retrying={
          isFetching
        }
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="w-full space-y-5 p-4 sm:p-5">
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard
          label="Healthy"
          value={String(
            summary.healthy,
          )}
          detail="Services operating normally"
        />

        <SummaryCard
          label="Degraded"
          value={String(
            summary.degraded,
          )}
          detail="Services requiring attention"
        />

        <SummaryCard
          label="Total throughput"
          value={summary.totalRps.toLocaleString()}
          detail="Requests per second"
        />

        <SummaryCard
          label="Avg latency"
          value={`${summary.avgLatency}ms`}
          detail="Across monitored services"
        />
      </section>

      <section className="overflow-hidden rounded-lg border border-edge bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="border-b border-edge px-4 py-3">
          <h2 className="text-[13px] font-semibold text-hi">
            Services
          </h2>

          <p className="mt-0.5 text-[11px] text-lo">
            Runtime health and performance
          </p>
        </div>

        <div className="hidden grid-cols-[minmax(180px,1fr)_120px_120px_120px_120px] gap-4 border-b border-edge bg-panel px-4 py-2 md:grid">
          {[
            "Service",
            "Status",
            "Uptime",
            "Throughput",
            "Latency",
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

        <div>
          {(services ?? []).map(
            (service) => {
              const status =
                statusStyles[
                service.status
                ];

              return (
                <Link
                  key={
                    service.id
                  }
                  to={{
                    pathname:
                      `/services/${service.id}`,
                    search,
                  }}
                  className={cn(
                    "grid grid-cols-2 gap-3 border-b border-edge/70 px-4 py-3",
                    "transition-colors last:border-0",
                    "hover:bg-slate-900/2.5",
                    "md:grid-cols-[minmax(180px,1fr)_120px_120px_120px_120px]",
                    "md:items-center md:gap-4",
                  )}
                >
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium text-hi">
                      {
                        service.name
                      }
                    </div>

                    <div className="mt-0.5 font-mono text-[10px] text-lo">
                      {
                        service.id
                      }
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 md:justify-start">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        status.dot,
                      )}
                    />

                    <span
                      className={cn(
                        "text-[11px] font-medium",
                        status.text,
                      )}
                    >
                      {
                        status.label
                      }
                    </span>
                  </div>

                  <div className="text-[11px] text-lo md:text-mid">
                    <span className="mr-1 md:hidden">
                      Uptime
                    </span>

                    <span className="font-mono tabular-nums">
                      {service.uptime.toFixed(
                        2,
                      )}
                      %
                    </span>
                  </div>

                  <div className="text-right text-[11px] text-lo md:text-left md:text-mid">
                    <span className="mr-1 md:hidden">
                      RPS
                    </span>

                    <span className="font-mono tabular-nums">
                      {service.rps.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-[11px] text-lo md:text-mid">
                    <span className="mr-1 md:hidden">
                      Latency
                    </span>

                    <span className="font-mono tabular-nums">
                      {
                        service.latency
                      }
                      ms
                    </span>
                  </div>
                </Link>
              );
            },
          )}
        </div>
      </section>
    </div>
  );
}