import { useMemo } from "react";

import { useOverviewRequestsQuery } from "@/features/overview/queries/overview.queries";

import { getRegionDistribution } from "@/features/live-traffic/lib/traffic-stats";

const regionNames = {
  EU: "Europe",
  US: "North America",
  APAC: "Asia Pacific",
  SA: "South America",
} as const;

export function RegionTraffic() {
  const {
    data: requests,
  } =
    useOverviewRequestsQuery();

  const regions =
    useMemo(
      () =>
        getRegionDistribution(
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
          Traffic by Region
        </h2>

        <p className="mt-0.5 text-[11px] text-lo">
          Request distribution
        </p>
      </div>

      <div className="space-y-3">
        {regions.map(
          (region) => (
            <div
              key={
                region.region
              }
              className="flex items-center gap-3"
            >
              <div className="w-12">
                <span className="rounded border border-edge bg-panel px-1.5 py-0.5 font-mono text-[10px] font-medium text-mid">
                  {
                    region.region
                  }
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="truncate text-[11px] text-mid">
                    {
                      regionNames[
                      region.region
                      ]
                    }
                  </span>

                  <span className="font-mono text-[10px] text-lo tabular-nums">
                    {region.percentage.toFixed(
                      1,
                    )}
                    %
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-panel">
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-300"
                    style={{
                      width: `${region.percentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}