import { MonitoringPageError } from "@/components/monitoring/MonitoringPageError";
import { MonitoringPageSkeleton } from "@/components/monitoring/MonitoringPageSkeleton";
import { useOverviewQuery } from "@/features/overview/queries/overview.queries";
import { AnalyticsSummary } from "./AnalyticsSummary";
import { AnalyticsTraffic } from "./AnalyticsTraffic";
import { EndpointAnalytics } from "./EndpointAnalytics";
import { ServiceAnalytics } from "./ServiceAnalytics";
import { ServiceThroughputChart } from "./ServiceThroughputChart";

export function AnalyticsPage() {
  const {
    error,
    isPending,
    isError,
    isFetching,
    refetch,
  } =
    useOverviewQuery();

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
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-hi">
          Analytics
        </h2>

        <p className="mt-1 text-[11px] text-lo">
          Performance analytics derived from the current rolling monitoring window.
        </p>
      </div>

      <AnalyticsSummary />

      <AnalyticsTraffic />

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <ServiceThroughputChart />
        </div>

        <div className="xl:col-span-2">
          <ServiceAnalytics />
        </div>
      </section>

      <EndpointAnalytics />
    </div>
  );
}