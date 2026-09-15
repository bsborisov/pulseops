import { useOverviewQuery } from "@/features/overview/queries/overview.queries";
import { OverviewEndpointPerformance } from "./OverviewEndpointPerformance";
import { MonitoringPageError } from "@/components/monitoring/MonitoringPageError";
import { OverviewKpiGrid } from "./OverviewKpiGrid";
import { OverviewRecentIncidents } from "./OverviewRecentIncidents";
import { OverviewRequestStream } from "./OverviewRequestStream";
import { MonitoringPageSkeleton } from "@/components/monitoring/MonitoringPageSkeleton";
import { OverviewSystemHealth } from "./OverviewSystemHealth";
import { RealtimeTrafficPanel } from "./RealtimeTrafficPanel";

export function OverviewPage() {
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
        retrying={isFetching}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="w-full space-y-5 p-4 sm:p-5">
      <OverviewKpiGrid />

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RealtimeTrafficPanel />
        </div>

        <div className="xl:col-span-2">
          <OverviewSystemHealth />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-5">
        <div className="min-w-0 xl:col-span-3">
          <OverviewRequestStream />
        </div>

        <div className="xl:col-span-2">
          <OverviewEndpointPerformance />
        </div>
      </section>

      <OverviewRecentIncidents />
    </div>
  );
}