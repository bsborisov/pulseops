import { useMemo } from "react";
import {
  MethodBadge,
  StatusBadge,
} from "@/components/ui/Badge";

import { useOverviewRequestsQuery } from "@/features/overview/queries/overview.queries";
import { getServiceRequests } from "@/features/services/lib/service-requests";
import { cn } from "@/lib/utils";

interface ServiceLiveRequestsProps {
  serviceNames: string[];
}

export function ServiceLiveRequests({
  serviceNames,
}: ServiceLiveRequestsProps) {
  const {
    data: requests,
  } =
    useOverviewRequestsQuery();

  const serviceRequests =
    useMemo(
      () =>
        getServiceRequests(
          requests ?? [],
          serviceNames,
        ),
      [
        requests,
        serviceNames,
      ],
    );

  return (
    <section className="overflow-hidden rounded-lg border border-edge bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between border-b border-edge px-4 py-3">
        <div>
          <h2 className="text-[13px] font-semibold text-hi">
            Live Requests
          </h2>

          <p className="mt-0.5 text-[11px] text-lo">
            Recent requests associated with this service
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-ok">
          <span className="size-1.5 rounded-full bg-ok animate-pulse-dot" />

          Live
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[620px]">
          <div className="grid grid-cols-[70px_60px_minmax(180px,1fr)_65px_75px_55px] gap-2 border-b border-edge bg-panel px-4 py-2">
            {[
              "Time",
              "Method",
              "Endpoint",
              "Status",
              "Latency",
              "Region",
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

          {serviceRequests.map(
            (request) => (
              <div
                key={
                  request.id
                }
                className={cn(
                  "grid grid-cols-[70px_60px_minmax(180px,1fr)_65px_75px_55px]",
                  "gap-2 border-b border-edge/60 px-4 py-2 last:border-0",
                )}
              >
                <span className="font-mono text-[10px] text-lo">
                  {
                    request.time
                  }
                </span>

                <MethodBadge
                  method={
                    request.method
                  }
                />

                <span className="truncate font-mono text-[10px] text-mid">
                  {
                    request.endpoint
                  }
                </span>

                <StatusBadge
                  status={
                    request.status
                  }
                />

                <span
                  className={cn(
                    "font-mono text-[10px] tabular-nums",

                    request.latency >
                      300
                      ? "text-err"
                      : request.latency >
                        150
                        ? "text-warn"
                        : "text-mid",
                  )}
                >
                  {
                    request.latency
                  }
                  ms
                </span>

                <span className="text-[10px] text-lo">
                  {
                    request.region
                  }
                </span>
              </div>
            ),
          )}

          {serviceRequests.length ===
            0 && (
              <div className="flex h-28 items-center justify-center text-xs text-lo">
                No recent requests for this service.
              </div>
            )}
        </div>
      </div>
    </section>
  );
}