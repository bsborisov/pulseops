import { KPICard } from "@/components/ui/KPICard";
import {
  useOverviewKpiQuery,
} from "@/features/overview/queries/overview.queries";

export function OverviewKpiGrid() {
  const {
    data: kpi,
  } = useOverviewKpiQuery();

  if (!kpi) {
    return null;
  }

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
        sparkColor="#0ea5e9"
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
        sparkColor="#10b981"
      />

      <KPICard
        label="Error Rate"
        value={`${kpi.errorRate.toFixed(2)}%`}
        delta={-0.08}
        deltaLabel="-0.08%"
        invertDelta
        sparkline={
          kpi.errorSparkline
        }
        sparkColor="#ef4444"
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
        sparkColor="#f59e0b"
      />
    </section>
  );
}