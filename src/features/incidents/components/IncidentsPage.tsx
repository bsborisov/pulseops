import { useMemo } from "react";

import { MonitoringPageError } from "@/components/monitoring/MonitoringPageError";

import { MonitoringPageSkeleton } from "@/components/monitoring/MonitoringPageSkeleton";

import {
  useOverviewIncidentsQuery,
  useOverviewQuery,
} from "@/features/overview/queries/overview.queries";

import { IncidentItem } from "./IncidentItem";
import { cn } from "@/lib/utils";

export function IncidentsPage() {
  const {
    error,
    isPending,
    isError,
    isFetching,
    refetch,
  } =
    useOverviewQuery();

  const {
    data: incidents,
  } =
    useOverviewIncidentsQuery();

  const sortedIncidents =
    useMemo(
      () =>
        [...(incidents ?? [])]
          .sort(
            (a, b) => {
              if (
                a.status ===
                "resolved" &&
                b.status !==
                "resolved"
              ) {
                return 1;
              }

              if (
                a.status !==
                "resolved" &&
                b.status ===
                "resolved"
              ) {
                return -1;
              }

              return (
                new Date(
                  b.updatedAt,
                ).getTime() -
                new Date(
                  a.updatedAt,
                ).getTime()
              );
            },
          ),
      [
        incidents,
      ],
    );

  const stats =
    useMemo(() => {
      const source =
        incidents ?? [];

      return {
        active:
          source.filter(
            (incident) =>
              incident.status !==
              "resolved",
          ).length,

        critical:
          source.filter(
            (incident) =>
              incident.status !==
              "resolved" &&
              incident.severity ===
              "critical",
          ).length,

        investigating:
          source.filter(
            (incident) =>
              incident.status ===
              "investigating",
          ).length,

        resolved:
          source.filter(
            (incident) =>
              incident.status ===
              "resolved",
          ).length,
      };
    }, [
      incidents,
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
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-hi">
          Incidents
        </h2>

        <p className="mt-1 text-[11px] text-lo">
          Monitor, acknowledge and resolve operational incidents.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat
          label="Active"
          value={
            stats.active
          }
        />

        <Stat
          label="Critical"
          value={
            stats.critical
          }
          emphasis="error"
        />

        <Stat
          label="Investigating"
          value={
            stats.investigating
          }
          emphasis="warning"
        />

        <Stat
          label="Resolved"
          value={
            stats.resolved
          }
          emphasis="success"
        />
      </section>

      <div className="space-y-3">
        {sortedIncidents.map(
          (incident) => (
            <IncidentItem
              key={
                incident.id
              }
              incident={
                incident
              }
            />
          ),
        )}

        {sortedIncidents.length ===
          0 && (
            <div className="rounded-lg border border-edge bg-surface p-10 text-center">
              <div className="text-[13px] font-medium text-mid">
                No incidents
              </div>

              <div className="mt-1 text-[11px] text-lo">
                All systems are operating normally.
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

interface StatProps {
  label: string;
  value: number;

  emphasis?:
  | "default"
  | "error"
  | "warning"
  | "success";
}

function Stat({
  label,
  value,
  emphasis = "default",
}: StatProps) {
  const valueClass = {
    default:
      "text-hi",

    error:
      "text-err",

    warning:
      "text-warn",

    success:
      "text-ok",
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
    </div>
  );
}