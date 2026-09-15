import {
  Check,
  LoaderCircle,
} from "lucide-react";

import { IncidentStatusBadge } from "@/components/ui/Badge";

import { useUpdateIncidentStatusMutation } from "@/features/incidents/mutations/incident.mutations";

import type {
  Incident,
  IncidentSeverity,
} from "@shared/monitoring";
import { cn } from "@/lib/utils";

interface IncidentItemProps {
  incident: Incident;
}

const severityStyles:
  Record<
    IncidentSeverity,
    string
  > = {
  critical:
    "border-err/20 bg-err/10 text-err",

  high:
    "border-orange-500/20 bg-orange-500/10 text-orange-600",

  medium:
    "border-warn/20 bg-warn/10 text-warn",

  low:
    "border-slate-300 bg-slate-50 text-slate-600",
};

export function IncidentItem({
  incident,
}: IncidentItemProps) {
  const mutation =
    useUpdateIncidentStatusMutation();

  const resolved =
    incident.status ===
    "resolved";

  function acknowledge() {
    mutation.mutate({
      incidentId:
        incident.id,

      status:
        "identified",
    });
  }

  function resolve() {
    mutation.mutate({
      incidentId:
        incident.id,

      status:
        "resolved",
    });
  }

  return (
    <article
      data-incident-id={incident.id}
      className="rounded-lg border border-edge bg-surface p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5",
                "text-[10px] font-semibold capitalize",
                severityStyles[
                incident.severity
                ],
              )}
            >
              {
                incident.severity
              }
            </span>

            <IncidentStatusBadge
              status={
                incident.status
              }
            />
          </div>

          <h3 className="mt-3 text-[14px] font-semibold text-hi">
            {
              incident.title
            }
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-lo">
            <span>
              Service{" "}
              <strong className="font-medium text-mid">
                {
                  incident.service
                }
              </strong>
            </span>

            <span>
              Updated{" "}
              <span className="font-mono text-mid">
                {new Date(
                  incident.updatedAt,
                ).toLocaleString()}
              </span>
            </span>

            <span className="font-mono text-[10px]">
              {incident.id}
            </span>
          </div>

          {mutation.isError && (
            <p className="mt-3 text-[11px] text-err">
              {
                mutation.error
                  .message
              }
            </p>
          )}
        </div>

        {!resolved && (
          <div className="flex shrink-0 gap-2">
            {incident.status ===
              "investigating" && (
                <button
                  type="button"
                  disabled={
                    mutation.isPending
                  }
                  onClick={
                    acknowledge
                  }
                  className={cn(
                    "rounded-md border border-edge bg-surface",
                    "px-3 py-2 text-[11px] font-medium text-mid",
                    "transition-colors hover:bg-panel hover:text-hi",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  Acknowledge
                </button>
              )}

            <button
              type="button"
              disabled={
                mutation.isPending
              }
              onClick={
                resolve
              }
              className={cn(
                "flex items-center gap-1.5 rounded-md",
                "border border-ok/20 bg-ok/10 px-3 py-2",
                "text-[11px] font-medium text-ok",
                "transition-colors hover:bg-ok/15",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {mutation.isPending ? (
                <LoaderCircle
                  size={12}
                  className="animate-spin"
                />
              ) : (
                <Check
                  size={12}
                />
              )}

              Resolve
            </button>
          </div >
        )
        }
      </div >
    </article >
  );
}