import { useMemo } from "react";
import { useOverviewRequestsQuery } from "@/features/overview/queries/overview.queries";
import { getStatusDistribution } from "@/features/live-traffic/lib/traffic-stats";

const statusClasses = {
  2: {
    bar: "bg-ok",
    text: "text-ok",
  },

  3: {
    bar: "bg-accent",
    text: "text-accent",
  },

  4: {
    bar: "bg-warn",
    text: "text-warn",
  },

  5: {
    bar: "bg-err",
    text: "text-err",
  },
} as const;

export function StatusDistribution() {
  const {
    data: requests,
  } = useOverviewRequestsQuery();

  const distribution =
    useMemo(
      () =>
        getStatusDistribution(
          requests ?? [],
        ),
      [
        requests,
      ],
    );

  return (
    <section className="rounded-lg border border-edge bg-surface p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-4">
        <h2 className="text-[13px] font-semibold text-hi">
          Status Distribution
        </h2>

        <p className="mt-0.5 text-[11px] text-lo">
          Latest request sample
        </p>
      </div>

      <div className="space-y-4">
        {distribution.map(
          (item) => {
            const style =
              statusClasses[
              item.statusGroup
              ];

            return (
              <div
                key={
                  item.statusGroup
                }
              >
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-medium text-mid">
                    {item.label}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-lo tabular-nums">
                      {item.count}
                    </span>

                    <span
                      className={[
                        "w-12 text-right font-mono text-[11px] font-medium tabular-nums",
                        style.text,
                      ].join(" ")}
                    >
                      {item.percentage.toFixed(
                        1,
                      )}
                      %
                    </span>
                  </div>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-panel">
                  <div
                    className={[
                      "h-full rounded-full transition-[width] duration-300",
                      style.bar,
                    ].join(" ")}
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}