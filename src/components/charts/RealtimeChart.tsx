import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartPoint } from "@shared/monitoring";

interface RealtimeChartProps {
  data: ChartPoint[];
  height?: number;
}

export function RealtimeChart({
  data,
  height = 160,
}: RealtimeChartProps) {
  return (
    <ResponsiveContainer
      width="100%"
      height={height}
    >
      <AreaChart
        data={data}
        margin={{
          top: 4,
          right: 4,
          left: -28,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient
            id="traffic-total"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="5%"
              stopColor="#0ea5e9"
              stopOpacity={0.2}
            />

            <stop
              offset="95%"
              stopColor="#0ea5e9"
              stopOpacity={0}
            />
          </linearGradient>

          <linearGradient
            id="traffic-success"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="5%"
              stopColor="#10b981"
              stopOpacity={0.12}
            />

            <stop
              offset="95%"
              stopColor="#10b981"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          stroke="rgba(255,255,255,0.04)"
          strokeDasharray="3 3"
          vertical={false}
        />

        <XAxis
          dataKey="label"
          interval="preserveStartEnd"
          minTickGap={50}
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 10,
            fill: "#475569",
            fontFamily:
              "JetBrains Mono, monospace",
          }}
        />

        <YAxis
          width={55}
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 10,
            fill: "#475569",
            fontFamily:
              "JetBrains Mono, monospace",
          }}
          tickFormatter={(value: number) =>
            value >= 1000
              ? `${(value / 1000).toFixed(1)}k`
              : String(value)
          }
        />

        <Tooltip
          contentStyle={{
            background: "#111927",
            border: "1px solid #1d2b42",
            borderRadius: 8,
            fontSize: 11,
          }}
          labelStyle={{
            color: "#94a3b8",
            fontFamily:
              "JetBrains Mono, monospace",
          }}
        />

        <Area
          type="monotone"
          dataKey="total"
          stroke="#0ea5e9"
          strokeWidth={1.5}
          fill="url(#traffic-total)"
          dot={false}
          activeDot={{
            r: 3,
            fill: "#0ea5e9",
            strokeWidth: 0,
          }}
        />

        <Area
          type="monotone"
          dataKey="success"
          stroke="#10b981"
          strokeWidth={1}
          fill="url(#traffic-success)"
          dot={false}
        />

        <Area
          type="monotone"
          dataKey="failed"
          stroke="#ef4444"
          strokeWidth={1}
          fill="none"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}