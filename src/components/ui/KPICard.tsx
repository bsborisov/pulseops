import { cn } from "@/lib/utils";
import { Sparkline } from "./Sparkline";

interface KPICardProps {
  label: string;
  value: string;
  unit?: string;
  subvalue?: string;
  delta?: number;
  deltaLabel?: string;
  invertDelta?: boolean;
  sparkline: number[];
  sparkColor?: string;
}

export function KPICard({
  label,
  value,
  unit,
  subvalue,
  delta,
  deltaLabel,
  invertDelta = false,
  sparkline,
  sparkColor = "#0ea5e9",
}: KPICardProps) {
  const isPositive = (delta ?? 0) > 0;

  const isGood =
    invertDelta
      ? !isPositive
      : isPositive;

  const hasChange =
    delta !== undefined &&
    delta !== 0;

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-edge bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-wider text-mid">
          {label}
        </span>

        {hasChange && (
          <span
            className={cn(
              "text-[11px] font-medium tabular-nums",
              isGood
                ? "text-ok"
                : "text-err",
            )}
          >
            {deltaLabel ?? delta}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[26px] font-semibold leading-none tracking-tight text-hi tabular-nums">
            {value}

            {unit && (
              <span className="ml-1 text-base font-normal text-mid">
                {unit}
              </span>
            )}
          </div>

          {subvalue && (
            <div className="mt-1 text-[11px] text-lo">
              {subvalue}
            </div>
          )}
        </div>

        <Sparkline
          data={sparkline}
          color={sparkColor}
        />
      </div>
    </article>
  );
}