import { useNavigate } from "react-router";

import type {
  ServiceHealth,
} from "@shared/monitoring";
import { cn } from "@/lib/utils";

interface SystemHealthProps {
  services: ServiceHealth[];
}

export function SystemHealth({
  services,
}: SystemHealthProps) {
  const navigate = useNavigate();

  return (
    <section className="rounded-lg border border-edge bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-hi">
          System Health
        </h2>

        <button
          type="button"
          onClick={() =>
            navigate("/services")
          }
          className="text-[11px] text-lo transition-colors hover:text-accent"
        >
          View all →
        </button>
      </div>

      <div>
        {services.map((service) => {
          const statusClass =
            service.status === "healthy"
              ? "bg-ok"
              : service.status ===
                "degraded"
                ? "bg-warn animate-pulse"
                : "bg-err";

          const uptimeClass =
            service.status === "healthy"
              ? "text-ok"
              : service.status ===
                "degraded"
                ? "text-warn"
                : "text-err";

          return (
            <button
              key={service.id}
              type="button"
              onClick={() =>
                navigate(
                  `/services/${service.id}`,
                )
              }
              className={cn(
                "flex w-full items-center gap-3 border-b border-edge",
                "px-1 py-2 text-left transition-colors last:border-0",
                "hover:bg-white/[0.02]",
              )}
            >
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  statusClass,
                )}
              />

              <span className="min-w-0 flex-1 truncate text-[13px] text-hi">
                {service.name}
              </span>

              <span
                className={cn(
                  "font-mono text-[11px] tabular-nums",
                  uptimeClass,
                )}
              >
                {service.uptime.toFixed(2)}%
              </span>

              <span className="w-14 text-right font-mono text-[11px] text-lo tabular-nums">
                {service.latency}ms
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}