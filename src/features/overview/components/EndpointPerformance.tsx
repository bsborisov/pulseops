import {
  MethodBadge,
} from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

import type {
  EndpointStat,
} from "@/types/monitoring";

interface EndpointPerformanceProps {
  endpoints: EndpointStat[];
}

export function EndpointPerformance({
  endpoints,
}: EndpointPerformanceProps) {
  return (
    <section className="flex h-[360px] flex-col rounded-lg border border-edge bg-surface p-4">
      <h2 className="mb-3 text-[13px] font-semibold text-hi">
        Endpoint Performance
      </h2>

      <div className="flex-1 overflow-y-auto">
        {endpoints.map((endpoint) => (
          <div
            key={`${endpoint.method}-${endpoint.endpoint}`}
            className="border-b border-edge/50 py-2.5 last:border-0"
          >
            <div className="mb-1.5 flex items-center gap-2">
              <MethodBadge
                method={endpoint.method}
              />

              <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-mid">
                {endpoint.endpoint}
              </span>

              <span className="font-mono text-[10px] text-lo tabular-nums">
                {endpoint.rps} rps
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-1 flex-1 rounded-full bg-bg">
                <div
                  className="h-1 rounded-full bg-accent/60"
                  style={{
                    width: `${endpoint.volumePercent}%`,
                  }}
                />
              </div>

              <span className="w-16 text-right font-mono text-[10px] text-lo tabular-nums">
                p95 {endpoint.p95}ms
              </span>

              <span
                className={cn(
                  "w-11 text-right font-mono text-[10px] tabular-nums",
                  endpoint.errorRate > 1
                    ? "text-err"
                    : endpoint.errorRate > 0.1
                      ? "text-warn"
                      : "text-lo",
                )}
              >
                {endpoint.errorRate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}