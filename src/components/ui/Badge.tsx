import { cn } from "@/lib/utils";
import type {
  HttpMethod,
  IncidentStatus,
} from "@shared/monitoring";

const methodStyles: Record<
  HttpMethod,
  string
> = {
  GET: "bg-sky-500/10 text-sky-400",
  POST: "bg-emerald-500/10 text-emerald-400",
  PUT: "bg-amber-500/10 text-amber-400",
  PATCH: "bg-violet-500/10 text-violet-400",
  DELETE: "bg-red-500/10 text-red-400",
};

export function MethodBadge({
  method,
}: {
  method: HttpMethod;
}) {
  return (
    <span
      className={cn(
        "w-fit rounded px-1.5 py-0.5",
        "font-mono text-[10px] font-semibold",
        methodStyles[method],
      )}
    >
      {method}
    </span>
  );
}

export function StatusBadge({
  status,
}: {
  status: number;
}) {
  const statusGroup =
    Math.floor(status / 100);

  const className =
    statusGroup === 2
      ? "bg-emerald-500/10 text-emerald-400"
      : statusGroup === 3
        ? "bg-sky-500/10 text-sky-400"
        : statusGroup === 4
          ? "bg-amber-500/10 text-amber-400"
          : "bg-red-500/10 text-red-400";

  return (
    <span
      className={cn(
        "w-fit rounded px-1.5 py-0.5",
        "font-mono text-[11px] font-semibold tabular-nums",
        className,
      )}
    >
      {status}
    </span>
  );
}

const incidentStatusStyles: Record<
  IncidentStatus,
  string
> = {
  investigating:
    "border-red-500/20 bg-red-500/10 text-red-400",

  identified:
    "border-amber-500/20 bg-amber-500/10 text-amber-400",

  monitoring:
    "border-sky-500/20 bg-sky-500/10 text-sky-400",

  resolved:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
};

export function IncidentStatusBadge({
  status,
}: {
  status: IncidentStatus;
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5",
        "text-[11px] font-medium capitalize",
        incidentStatusStyles[status],
      )}
    >
      {status}
    </span>
  );
}