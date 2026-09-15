import { useMemo } from "react";
import { getServiceThroughput } from "@/features/analytics/lib/analytics";
import { useOverviewServicesQuery } from "@/features/overview/queries/overview.queries";
import { cn } from "@/lib/utils";

export function ServiceAnalytics() {
  const {
    data: services,
  } =
    useOverviewServicesQuery();

  const data =
    useMemo(
      () =>
        getServiceThroughput(
          services ?? [],
        ),
      [
        services,
      ],
    );

  const maxRps =
    Math.max(
      ...data.map(
        (service) =>
          service.rps,
      ),
      1,
    );

  return (
    <section className="rounded-lg border border-edge bg-surface p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-4">
        <h2 className="text-[13px] font-semibold text-hi">
          Service Performance
        </h2>

        <p className="mt-0.5 text-[11px] text-lo">
          Throughput and latency ranking
        </p>
      </div>

      <div className="space-y-4">
        {data.map(
          (service) => (
            <div
              key={
                service.id
              }
            >
              <div className="mb-1.5 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-medium text-mid">
                    {
                      service.name
                    }
                  </div>
                </div>

                <span className="font-mono text-[10px] text-lo tabular-nums">
                  {service.rps.toLocaleString()}{" "}
                  rps
                </span>

                <span
                  className={cn(
                    "w-14 text-right font-mono text-[10px] tabular-nums",

                    service.latency >
                      300
                      ? "text-err"
                      : service.latency >
                        150
                        ? "text-warn"
                        : "text-mid",
                  )}
                >
                  {
                    service.latency
                  }
                  ms
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-panel">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-300"
                  style={{
                    width: `${(service.rps /
                      maxRps) *
                      100
                      }%`,
                  }}
                />
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}