import { useMemo } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getServiceThroughput } from "@/features/analytics/lib/analytics";

import { useOverviewServicesQuery } from "@/features/overview/queries/overview.queries";

export function ServiceThroughputChart() {
  const {
    data: services,
  } =
    useOverviewServicesQuery();

  const data =
    useMemo(
      () =>
        getServiceThroughput(
          services ?? [],
        ),
      [
        services,
      ],
    );

  return (
    <section className="rounded-lg border border-edge bg-surface p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-4">
        <h2 className="text-[13px] font-semibold text-hi">
          Service Throughput
        </h2>

        <p className="mt-0.5 text-[11px] text-lo">
          Requests per second by service
        </p>
      </div>

      <div className="h-67.5 w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              bottom: 0,
              left: -15,
            }}
          >
            <CartesianGrid
              stroke="rgba(15,23,42,0.07)"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tick={{
                fill:
                  "#64748b",
                fontSize: 10,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{
                fill:
                  "#64748b",
                fontSize: 10,
              }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              cursor={{
                fill:
                  "rgba(15,23,42,0.03)",
              }}
              contentStyle={{
                background:
                  "#ffffff",

                border:
                  "1px solid #dbe3ee",

                borderRadius: 8,

                fontSize: 11,

                boxShadow:
                  "0 8px 24px rgba(15,23,42,0.08)",
              }}
            />

            <Bar
              dataKey="rps"
              name="Requests / sec"
              fill="#0284c7"
              radius={[4, 4, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}