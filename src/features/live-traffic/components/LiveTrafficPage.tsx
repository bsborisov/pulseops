import { useOverviewQuery } from "@/features/overview/queries/overview.queries";
import { MonitoringPageError } from "@/components/monitoring/MonitoringPageError";
import { MonitoringPageSkeleton } from "@/components/monitoring/MonitoringPageSkeleton";
import { RegionTraffic } from "./RegionTraffic";
import { StatusDistribution } from "./StatusDistribution";
import { TrafficChartPanel } from "./TrafficChartPanel";
import { TrafficEvents } from "./TrafficEvents";
import { TrafficMetrics } from "./TrafficMetrics";

export function LiveTrafficPage() {
  const {
    error,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useOverviewQuery();

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
      <TrafficMetrics />

      <TrafficChartPanel />

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <StatusDistribution />

        <RegionTraffic />
      </section>

      <TrafficEvents />
    </div>
  );
}