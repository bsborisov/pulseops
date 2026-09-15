import { KPICard } from "@/components/ui/KPICard";

import { useOverviewKpiQuery } from "@/features/overview/queries/overview.queries";

export function TrafficMetrics() {
  const {
    data: kpi,
  } = useOverviewKpiQuery();

  if (!kpi) {
    return null;
  }

  const successRate =
    Math.max(
      0,
      100 - kpi.errorRate,
    );

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <KPICard
        label="Requests / sec"
        value={
          kpi.rps.toLocaleString()
        }
        delta={12.4}
        deltaLabel="+12.4%"
        sparkline={
          kpi.rpsSparkline
        }
        sparkColor="#0284c7"
      />

      <KPICard
        label="Success Rate"
        value={`${successRate.toFixed(2)}%`}
        delta={0.08}
        deltaLabel="+0.08%"
        sparkline={
          kpi.errorSparkline.map(
            (value) =>
              100 - value,
          )
        }
        sparkColor="#059669"
      />

      <KPICard
        label="Avg Latency"
        value={String(
          kpi.latency,
        )}
        unit="ms"
        delta={-14}
        deltaLabel="-14ms"
        invertDelta
        sparkline={
          kpi.latencySparkline
        }
        sparkColor="#d97706"
      />

      <KPICard
        label="Active Users"
        value={
          kpi.activeUsers.toLocaleString()
        }
        delta={8.1}
        deltaLabel="+8.1%"
        sparkline={
          kpi.usersSparkline
        }
        sparkColor="#059669"
      />
    </section>
  );
}