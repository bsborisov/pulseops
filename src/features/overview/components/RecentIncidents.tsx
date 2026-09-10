import { useNavigate } from "react-router";

import {
  IncidentStatusBadge,
} from "@/components/ui/Badge";

import type {
  Incident,
  IncidentSeverity,
} from "@/types/monitoring";
import { cn } from "@/lib/utils";

interface RecentIncidentsProps {
  incidents: Incident[];
}

const severityClass: Record<
  IncidentSeverity,
  string
> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-amber-500",
  low: "bg-slate-500",
};

const severityTextClass: Record<
  IncidentSeverity,
  string
> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-amber-400",
  low: "text-slate-400",
};

export function RecentIncidents({
  incidents,
}: RecentIncidentsProps) {
  const navigate = useNavigate();

  return (
    <section className="rounded-lg border border-edge bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-hi">
          Recent Incidents
        </h2>

        <button
          type="button"
          onClick={() =>
            navigate("/incidents")
          }
          className="text-[11px] text-lo transition-colors hover:text-accent"
        >
          View all →
        </button>
      </div>

      <div>
        {incidents.map(
          (incident, index) => (
            <div
              key={incident.id}
              className={cn(
                "flex flex-col gap-2 border-b border-edge/50 py-2.5 last:border-0",
                "sm:flex-row sm:items-center sm:gap-4",
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  className={cn(
                    "h-8 w-1 shrink-0 rounded-full",
                    severityClass[
                    incident.severity
                    ],
                  )}
                />

                <div className="min-w-0">
                  <div className="truncate text-[13px] font-medium text-hi">
                    {incident.title}
                  </div>

                  <div className="mt-0.5 text-[11px] text-lo">
                    {incident.service}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-4 sm:pl-0">
                <IncidentStatusBadge
                  status={incident.status}
                />

                <span
                  className={cn(
                    "text-[11px] font-medium capitalize",
                    severityTextClass[
                    incident.severity
                    ],
                  )}
                >
                  {incident.severity}
                </span>

                <span className="w-14 text-right font-mono text-[11px] text-lo">
                  {index === 0
                    ? "30s ago"
                    : index === 1
                      ? "2m ago"
                      : index === 2
                        ? "5m ago"
                        : "2h ago"}
                </span>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}